import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const db = prisma as any;

const EscrowSchema = z.object({
  orderId:     z.string().min(1),
  holdDays:    z.number().min(1).max(30).default(7),
  reason:      z.string().optional(),
});

// POST /api/gosellr/escrow/hold
export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body  = EscrowSchema.parse(await req.json());
    const order = await db.order.findUnique({ where: { id: body.orderId } });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const releaseAt = new Date(Date.now() + body.holdDays * 24 * 60 * 60 * 1000);

    // Update order status to HELD (using metadata to track escrow)
    const updated = await db.order.update({
      where: { id: body.orderId },
      data:  {
        status:   "PENDING",
        metadata: {
          escrowHeld:    true,
          escrowReason:  body.reason ?? "Standard review hold",
          escrowRelease: releaseAt.toISOString(),
          heldBy:        auth.user.userId,
        } as any,
      },
    });

    await writeAuditLog({
      actorId:    auth.user.userId,
      action:     "ESCROW_HOLD_PLACED",
      targetType: "OTHER",
      targetId:   body.orderId,
      metadata:   { holdDays: body.holdDays, releaseAt: releaseAt.toISOString() } as any,
    });

    return ok({ order: updated, escrowRelease: releaseAt, message: `Funds held for ${body.holdDays} days` });
  } catch (err) {
    return handleRouteError(err);
  }
}
