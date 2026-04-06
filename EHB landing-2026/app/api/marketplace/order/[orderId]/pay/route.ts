import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, isAdmin } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { buildEscrowTimeline } from "@/lib/marketplace/escrowTimeline";
import { buildOrderViewerPayload } from "@/lib/marketplace/orderViewer";

const PaySchema = z.object({
  idempotencyKey: z.string().max(120).optional(),
});

/**
 * Demo payment: PENDING → PAID. Buyer (or admin) only. Replace with Stripe/wallet later.
 */
export async function POST(req: Request, ctx: { params: { orderId: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    PaySchema.parse(await req.json().catch(() => ({})));
    const orderId = ctx.params.orderId;
    if (!orderId?.trim()) return fail(400, "VALIDATION", "orderId required");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, imageUrl: true } },
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const uid = auth.user.userId;
    const canPay =
      (order.buyerId === uid || isAdmin(auth.user.role)) && order.status === "PENDING";
    if (!canPay) {
      return fail(403, "FORBIDDEN", "Only the buyer can pay, and the order must be pending");
    }

    const prevMeta = (order.metadata ?? {}) as Record<string, unknown>;
    const now = new Date().toISOString();
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        metadata: {
          ...prevMeta,
          paymentCapturedAt: now,
          paymentMethod: "DEMO_WALLET",
          escrowHeld: prevMeta.escrowHeld ?? true,
        } as object,
      },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, imageUrl: true } },
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    await writeAuditLog({
      actorId: uid,
      action: "MARKETPLACE_ORDER_PAID",
      targetType: "OTHER",
      targetId: order.id,
      metadata: { amount: order.price * order.quantity },
    });

    const meta = (updated.metadata ?? null) as Record<string, unknown> | null;
    const escrowTimeline = buildEscrowTimeline(meta, updated.createdAt);
    const payload = buildOrderViewerPayload(updated, uid, auth.user.role);

    return ok({ ...payload, escrowTimeline }, { status: 200 });
  } catch (err) {
    return handleRouteError(err);
  }
}
