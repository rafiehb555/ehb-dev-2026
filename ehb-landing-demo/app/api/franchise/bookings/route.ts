import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { isMongoObjectId } from "@/lib/mongoId";

const QuerySchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "UNDER_INSPECTION", "APPROVED", "REJECTED"]).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

function demoBookings() {
  const now = Date.now();
  return {
    items: [
      {
        id: "demo-booking-1",
        applicant: { name: "Ali Khan", email: "ali@test.com" },
        provider: { name: "Rapid Electric Lahore", serviceName: "Home Wiring" },
        quantity: 1,
        status: "NEW",
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 60 * 60 * 1000).toISOString(),
        assignedTo: null,
        notes: "Urgent home wiring visit requested.",
        scheduledFor: null,
      },
      {
        id: "demo-booking-2",
        applicant: { name: "Sara Noor", email: "sara@test.com" },
        provider: { name: "City Health Support", serviceName: "Clinic Assistance" },
        quantity: 2,
        status: "IN_REVIEW",
        createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
        assignedTo: { id: "ehb-demo-franchise", name: "Franchise Operator" },
        notes: "Need morning slot confirmation.",
        scheduledFor: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    total: 2,
    take: 50,
    skip: 0,
  };
}

export async function GET(req: Request) {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
    return ok(demoBookings());
  }

  try {
    const url = new URL(req.url);
    const q = QuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const where = {
      type: "SERVICE" as const,
      ...(q.status ? { status: q.status } : {}),
      ...(isAdmin(auth.user.role)
        ? {}
        : {
            OR: [{ assignedToId: auth.user.userId }, { assignedToId: null }],
          }),
    };

    const take = q.take ?? 50;
    const skip = q.skip ?? 0;
    const [apps, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
        include: {
          applicant: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    const providerServiceIds = apps
      .map((app) => {
        const payload = (app.payload ?? {}) as Record<string, unknown>;
        return typeof payload.providerServiceId === "string" ? payload.providerServiceId : null;
      })
      .filter((value): value is string => Boolean(value));

    const providerServices = providerServiceIds.length
      ? await prisma.providerService.findMany({
          where: { id: { in: providerServiceIds } },
          include: {
            user: { select: { id: true, name: true } },
            service: { select: { id: true, name: true } },
          },
        })
      : [];
    const providerMap = new Map(providerServices.map((item) => [item.id, item]));

    return ok({
      items: apps.map((app) => {
        const payload = (app.payload ?? {}) as Record<string, unknown>;
        const providerServiceId =
          typeof payload.providerServiceId === "string" ? payload.providerServiceId : null;
        const provider = providerServiceId ? providerMap.get(providerServiceId) : null;
        return {
          id: app.id,
          applicant: {
            id: app.applicant?.id ?? "",
            name: app.applicant?.name ?? "Unknown",
            email: app.applicant?.email ?? "—",
          },
          provider: {
            id: provider?.id ?? providerServiceId ?? "",
            name: provider?.user.name ?? "Unmapped Provider",
            serviceName: provider?.service.name ?? "Service Request",
          },
          quantity: typeof payload.quantity === "number" ? payload.quantity : 1,
          status: app.status,
          createdAt: app.createdAt.toISOString(),
          updatedAt: app.updatedAt.toISOString(),
          assignedTo: app.assignedTo ? { id: app.assignedTo.id, name: app.assignedTo.name ?? "Operator" } : null,
          notes: typeof payload.notes === "string" ? payload.notes : null,
          scheduledFor: typeof payload.scheduledFor === "string" ? payload.scheduledFor : null,
        };
      }),
      total,
      take,
      skip,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
