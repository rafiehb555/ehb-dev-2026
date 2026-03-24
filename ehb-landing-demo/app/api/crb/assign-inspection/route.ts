import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { AssignInspectionSchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = AssignInspectionSchema.parse(await req.json());
    const inspection = await prisma.$transaction(async (tx) => {
      const app = await tx.cRBApplication.findUnique({ where: { id: body.applicationId } });
      if (!app) return null;

      const row = await tx.cRBInspection.upsert({
        where: { applicationId: body.applicationId },
        create: {
          applicationId: body.applicationId,
          inspectorId: body.inspectorId,
          status: "ASSIGNED",
        },
        update: {
          inspectorId: body.inspectorId,
          status: "ASSIGNED",
          report: null,
          score: null,
        },
      });

      await tx.cRBApplication.update({
        where: { id: body.applicationId },
        data: { status: "INSPECTION" },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_ASSIGN_INSPECTION",
        targetType: "OTHER",
        targetId: row.id,
        metadata: { applicationId: body.applicationId, inspectorId: body.inspectorId },
      });

      return row;
    });

    if (!inspection) return fail(404, "NOT_FOUND", "CRB application not found");
    return ok(inspection, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

