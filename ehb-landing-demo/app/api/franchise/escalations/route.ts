import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateEscalationSchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = CreateEscalationSchema.parse(await req.json());

    const task = await prisma.inspectionTask.findUnique({ where: { id: body.taskId } });
    if (!task) return fail(404, "NOT_FOUND", "Task not found");
    if (!isAdmin(auth.user.role) && task.inspectorId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");

    const esc = await prisma.inspectionEscalation.create({
      data: { taskId: body.taskId, level: body.level, reason: body.reason },
    });
    await prisma.inspectionTask.update({ where: { id: body.taskId }, data: { status: "ESCALATED" } });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRANCHISE_TASK_ESCALATED",
      targetType: "OTHER",
      targetId: esc.id,
      metadata: { taskId: body.taskId, level: body.level },
    });

    return ok(esc);
  } catch (err) {
    return handleRouteError(err);
  }
}

