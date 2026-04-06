import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { PatchInspectionTaskSchema, TaskIdParamsSchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const { id } = TaskIdParamsSchema.parse(await ctx.params);
    const task = await prisma.inspectionTask.findUnique({
      where: { id },
      include: {
        franchise: true,
        report: true,
        escalations: { orderBy: { createdAt: "desc" } },
        crbApplication: { include: { documents: true } },
      },
    });
    if (!task) return fail(404, "NOT_FOUND", "Task not found");

    if (!isAdmin(auth.user.role) && task.inspectorId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");

    return ok(task);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const { id } = TaskIdParamsSchema.parse(await ctx.params);
    const body = PatchInspectionTaskSchema.parse(await req.json());

    const existing = await prisma.inspectionTask.findUnique({ where: { id } });
    if (!existing) return fail(404, "NOT_FOUND", "Task not found");

    if (!isAdmin(auth.user.role) && existing.inspectorId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");

    const updated = await prisma.inspectionTask.update({
      where: { id },
      data: { ...(body.status ? { status: body.status } : {}) },
      include: { franchise: true, report: true, crbApplication: { include: { documents: true } } },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRANCHISE_TASK_UPDATED",
      targetType: "OTHER",
      targetId: updated.id,
      metadata: { status: updated.status },
    });

    return ok(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}

