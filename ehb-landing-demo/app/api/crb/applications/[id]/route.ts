import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CRBIdParamsSchema, PatchCRBApplicationSchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const { id } = CRBIdParamsSchema.parse(await ctx.params);
    const app = await prisma.cRBApplication.findUnique({
      where: { id },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true, country: true } },
        documents: true,
        inspection: true,
        certificate: true,
      },
    });
    if (!app) return fail(404, "NOT_FOUND", "CRB application not found");

    if (!isAdmin(auth.user.role) && app.applicantId !== auth.user.userId) {
      return fail(403, "FORBIDDEN", "Forbidden");
    }

    return ok(app);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const { id } = CRBIdParamsSchema.parse(await ctx.params);
    const body = PatchCRBApplicationSchema.parse(await req.json());

    const updated = await prisma.cRBApplication.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes ?? null } : {}),
      },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true, country: true } },
        documents: true,
        inspection: true,
        certificate: true,
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "CRB_APPLICATION_UPDATED",
      targetType: "OTHER",
      targetId: updated.id,
      metadata: { status: updated.status, notesUpdated: body.notes !== undefined },
    });

    return ok(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}

