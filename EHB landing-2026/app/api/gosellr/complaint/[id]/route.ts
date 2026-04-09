import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { runDmoTrustEngine } from "@/lib/stl/dmoTrustEngine";

const ParamsSchema = z.object({ id: z.string().min(1) });
const PatchSchema = z.object({
  status: z.enum(["AI_REVIEW", "HUMAN_REVIEW", "RESOLVED", "DISMISSED"]),
  note: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { id } = ParamsSchema.parse(ctx.params);
    const body = PatchSchema.parse(await req.json());

    const existing = await prisma.complaint.findUnique({
      where: { id },
      select: { id: true, status: true, targetId: true, targetType: true, humanNote: true },
    });
    if (!existing) return fail(404, "NOT_FOUND", "Complaint not found");

    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: body.status,
        humanNote: body.note ?? existing.humanNote ?? undefined,
        resolvedAt: body.status === "RESOLVED" || body.status === "DISMISSED" ? new Date() : null,
        resolvedBy: body.status === "RESOLVED" || body.status === "DISMISSED" ? auth.user.userId : null,
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "COMPLAINT_STATUS_UPDATED",
      targetType: "OTHER",
      targetId: complaint.id,
      metadata: {
        status: complaint.status,
        targetId: complaint.targetId,
        targetType: complaint.targetType,
        note: body.note ?? null,
      },
    });
    if (complaint.targetType.toUpperCase() === "USER") {
      await runDmoTrustEngine({
        userId: complaint.targetId,
        actorId: auth.user.userId,
        reason: "COMPLAINT_UPDATE",
      }).catch(() => undefined);
    }

    return ok({ complaint });
  } catch (err) {
    return handleRouteError(err);
  }
}
