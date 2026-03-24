import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateCRBApplicationSchema, ListCRBApplicationsQuerySchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = CreateCRBApplicationSchema.parse(await req.json());

    const created = await prisma.$transaction(async (tx) => {
      const crbApp = await tx.cRBApplication.create({
        data: {
          applicantId: auth.user.userId,
          type: body.type,
          industry: body.industry,
          notes: body.notes,
          documents: {
            create: body.documents.map((d) => ({ fileUrl: d.fileUrl, type: d.type })),
          },
        },
        include: { documents: true },
      });

      // Mirror into DMO queue as a governance task (real workflow control).
      const dmoTask = await tx.application.create({
        data: {
          type: "CRB_CERTIFICATION",
          status: "NEW",
          applicantId: auth.user.userId,
          payload: {
            crbApplicationId: crbApp.id,
            crbType: crbApp.type,
            industry: crbApp.industry,
          },
        },
      });

      await tx.cRBApplication.update({
        where: { id: crbApp.id },
        data: { dmoTaskId: dmoTask.id },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_APPLICATION_SUBMITTED",
        targetType: "OTHER",
        targetId: crbApp.id,
        metadata: { dmoTaskId: dmoTask.id, type: crbApp.type, industry: crbApp.industry },
      });

      return { ...crbApp, dmoTaskId: dmoTask.id };
    });

    return ok(created);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const url = new URL(req.url);
    const q = ListCRBApplicationsQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      query: url.searchParams.get("query") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const where: any = {};
    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type;
    if (q.query) {
      where.OR = [
        { industry: { contains: q.query, mode: "insensitive" } },
        { applicant: { name: { contains: q.query, mode: "insensitive" } } },
        { applicant: { email: { contains: q.query, mode: "insensitive" } } },
      ];
    }

    // USER: own applications only. ADMIN: all.
    if (!isAdmin(auth.user.role)) where.applicantId = auth.user.userId;

    const take = q.take ?? 50;
    const skip = q.skip ?? 0;

    const [items, total] = await prisma.$transaction([
      prisma.cRBApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          applicant: { select: { id: true, name: true, email: true, role: true } },
          documents: true,
          inspection: true,
          certificate: true,
        },
      }),
      prisma.cRBApplication.count({ where }),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

