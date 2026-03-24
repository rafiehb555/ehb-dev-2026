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

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.inspectionTask.findUnique({ where: { id: body.taskId } });
      if (!task) return { kind: "not_found" as const };
      if (!isAdmin(auth.user.role) && task.inspectorId !== auth.user.userId) return { kind: "forbidden" as const };

      const esc = await tx.inspectionEscalation.create({
        data: { taskId: body.taskId, level: body.level, reason: body.reason },
      });
      await tx.inspectionTask.update({ where: { id: body.taskId }, data: { status: "ESCALATED" } });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "FRANCHISE_TASK_ESCALATED",
        targetType: "OTHER",
        targetId: esc.id,
        metadata: { taskId: body.taskId, level: body.level },
      });

      return { kind: "ok" as const, esc };
    });

    if (result.kind === "not_found") return fail(404, "NOT_FOUND", "Task not found");
    if (result.kind === "forbidden") return fail(403, "FORBIDDEN", "Forbidden");
    return ok(result.esc);
  } catch (err) {
    return handleRouteError(err);
  }
}

