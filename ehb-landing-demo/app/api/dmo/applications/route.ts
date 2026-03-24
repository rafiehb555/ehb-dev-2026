import { prisma } from "@/lib/prisma";
import { isAdmin, isFranchise, requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/apiResponse";
import { CreateApplicationSchema, ListApplicationsQuerySchema } from "@/lib/dmo/schemas";
import { createDemoApplication, isDmoDemoMode, listDemoApplications } from "@/lib/dmo/demoStore";

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = CreateApplicationSchema.parse(await req.json());
    if (isDmoDemoMode()) {
      const application = createDemoApplication({
        type: body.type,
        applicantId: auth.user.userId,
        assignedToId: body.assignedToId,
        payload: (body.payload as Record<string, unknown>) ?? undefined,
      });
      return ok({ application }, { status: 201 });
    }
    // applicantId is taken from session, never from request body.
    const application = await prisma.application.create({
      data: {
        type: body.type,
        applicantId: auth.user.userId,
        assignedToId: body.assignedToId,
        payload: body.payload as any,
      },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_APPLICATION_CREATED",
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: { type: application.type, status: application.status },
    });

    return ok({ application }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListApplicationsQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    if (isDmoDemoMode()) {
      const allApplications = listDemoApplications({
        take: 5000,
        skip: 0,
        status: query.status,
        type: query.type,
        role: auth.user.role,
        userId: auth.user.userId,
      });
      const applications = listDemoApplications({
        take: query.take ?? 50,
        skip: query.skip ?? 0,
        status: query.status,
        type: query.type,
        role: auth.user.role,
        userId: auth.user.userId,
      });
      const take = query.take ?? 50;
      const skip = query.skip ?? 0;
      return ok({
        applications,
        page: { take, skip, total: allApplications.length, hasNext: skip + applications.length < allApplications.length },
      });
    }

    const where = isAdmin(auth.user.role)
      ? {
          ...(query.status ? { status: query.status } : {}),
          ...(query.type ? { type: query.type } : {}),
        }
      : isFranchise(auth.user.role)
        ? {
            ...(query.status ? { status: query.status } : {}),
            ...(query.type ? { type: query.type } : {}),
            assignedToId: auth.user.userId,
          }
        : {
            ...(query.status ? { status: query.status } : {}),
            ...(query.type ? { type: query.type } : {}),
            applicantId: auth.user.userId,
          };

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.take ?? 50,
      skip: query.skip ?? 0,
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    const total = await prisma.application.count({ where });
    const take = query.take ?? 50;
    const skip = query.skip ?? 0;
    return ok({
      applications,
      page: { take, skip, total, hasNext: skip + applications.length < total },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

