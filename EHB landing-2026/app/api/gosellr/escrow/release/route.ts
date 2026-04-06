import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const db = prisma as any;

const ReleaseSchema = z.object({
  orderId: z.string().min(1),
  reason:  z.string().optional(),
});

// POST /api/gosellr/escrow/release
export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body  = ReleaseSchema.parse(await req.json());
    const order = await db.order.findUnique({ where: { id: body.orderId } });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const updated = await db.order.update({
      where: { id: body.orderId },
      data:  {
        status:   "COMPLETED",
        metadata: {
          ...(order.metadata as object ?? {}),
          escrowHeld:     false,
          escrowReleasedAt: new Date().toISOString(),
          escrowReleaseReason: body.reason ?? "Manual release",
          releasedBy: auth.user.userId,
        } as any,
      },
    });

    await writeAuditLog({
      actorId:    auth.user.userId,
      action:     "ESCROW_RELEASED",
      targetType: "OTHER",
      targetId:   body.orderId,
      metadata:   { reason: body.reason } as any,
    });

    return ok({ order: updated, message: "Escrow released, funds transferred to seller" });
  } catch (err) {
    return handleRouteError(err);
  }
}
