import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { CreateCRBApplicationSchema } from "@/lib/crb/schemas";
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

      const dmoTask = await tx.application.create({
        data: {
          type: "CRB_CERTIFICATION",
          status: "NEW",
          applicantId: auth.user.userId,
          payload: {
            crbApplicationId: crbApp.id,
            crbType: crbApp.type,
            industry: crbApp.industry,
            source: "CRB_APPLY",
          },
        },
      });

      await tx.cRBApplication.update({
        where: { id: crbApp.id },
        data: { dmoTaskId: dmoTask.id },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_APPLICATION_APPLY_CREATED",
        targetType: "OTHER",
        targetId: crbApp.id,
        metadata: { dmoTaskId: dmoTask.id, type: crbApp.type, industry: crbApp.industry },
      });

      return { ...crbApp, dmoTaskId: dmoTask.id };
    });

    return ok(created, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

