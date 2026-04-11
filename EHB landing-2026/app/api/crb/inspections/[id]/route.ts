import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CRBIdParamsSchema, PatchInspectionSchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const { id } = CRBIdParamsSchema.parse(await ctx.params);
    const body = PatchInspectionSchema.parse(await req.json());

    const existing = await prisma.cRBInspection.findUnique({ where: { id }, include: { application: true } });
    if (!existing) return fail(404, "NOT_FOUND", "Inspection not found");

    // Franchise can only update their own inspections. Admin can update any.
    if (!isAdmin(auth.user.role) && existing.inspectorId !== auth.user.userId) {
      return fail(403, "FORBIDDEN", "Forbidden");
    }

    const updated = await prisma.cRBInspection.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.report !== undefined ? { report: body.report ?? null } : {}),
        ...(body.score !== undefined ? { score: body.score === null ? null : body.score } : {}),
      },
      include: { application: { include: { documents: true, certificate: true } } },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "CRB_INSPECTION_UPDATED",
      targetType: "OTHER",
      targetId: updated.id,
      metadata: { status: updated.status, applicationId: updated.applicationId },
    });

    // If inspection is submitted, move application into REVIEW for final decision.
    if (body.status === "SUBMITTED") {
      await prisma.cRBApplication.update({
        where: { id: updated.applicationId },
        data: { status: "REVIEW" },
      });
    }

    return ok(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}

