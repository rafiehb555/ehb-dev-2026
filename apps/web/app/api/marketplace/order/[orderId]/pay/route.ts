import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, isAdmin } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { buildEscrowTimeline } from "@/lib/marketplace/escrowTimeline";
import { buildOrderActions } from "@/lib/marketplace/orderPolicy";
import { getAppBaseUrl, getStripe, stripeCheckoutCurrency } from "@/lib/stripe";

const PaySchema = z.object({
  idempotencyKey: z.string().max(120).optional(),
});

async function buildPayResponse(orderId: string, uid: string, role: string) {
  const updated = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: { select: { id: true, name: true, slug: true, price: true, imageUrl: true } },
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  });
  if (!updated) return null;
  const meta = (updated.metadata ?? null) as Record<string, unknown> | null;
  const escrowTimeline = buildEscrowTimeline(meta, updated.createdAt);
  const viewer = buildOrderActions(uid, role, updated);
  return { order: updated, viewer, escrowTimeline };
}

/**
 * Payment: Stripe Checkout when `STRIPE_SECRET_KEY` is set; otherwise demo wallet (PENDING → PAID).
 * Demo path supports optional `idempotencyKey` for safe retries. Stripe Checkout uses Stripe idempotency on session create.
 */
export async function POST(req: Request, ctx: { params: { orderId: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    let raw: unknown = {};
    try {
      raw = await req.json();
    } catch {
      /* empty body */
    }
    const parsed = PaySchema.parse(raw);
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
    const prevMeta = (order.metadata ?? {}) as Record<string, unknown>;
    const idem = parsed.idempotencyKey?.trim();

    if (
      idem &&
      order.status === "PAID" &&
      prevMeta.demoPayIdempotencyKey === idem &&
      (order.buyerId === uid || isAdmin(auth.user.role))
    ) {
      const replay = await buildPayResponse(order.id, uid, auth.user.role);
      if (replay) {
        return ok({ paymentMode: "demo" as const, ...replay });
      }
    }

    const canPay =
      (order.buyerId === uid || isAdmin(auth.user.role)) && order.status === "PENDING";
    if (!canPay) {
      return fail(403, "FORBIDDEN", "Only the buyer can pay, and the order must be pending");
    }

    const stripe = getStripe();
    if (stripe) {
      const base = getAppBaseUrl();
      const currency = stripeCheckoutCurrency();
      const lineTotal = order.price * order.quantity;
      const unitAmount = Math.round(lineTotal * 100);
      if (unitAmount < 1) {
        return fail(400, "VALIDATION", "Order total too small for Stripe (minimum 1 cent)");
      }

      const idempotencyKey =
        idem && idem.length > 0
          ? `ehb-checkout-${order.id}-${idem.slice(0, 80)}`
          : `ehb-checkout-${order.id}`;

      const session = await stripe.checkout.sessions.create(
        {
          mode: "payment",
          client_reference_id: order.id,
          success_url: `${base}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${base}/orders/${order.id}?cancelled=1`,
          metadata: {
            orderId: String(order.id),
            buyerId: String(order.buyerId),
          },
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency,
                unit_amount: unitAmount,
                product_data: {
                  name: order.product.name,
                },
              },
            },
          ],
        },
        { idempotencyKey }
      );

      if (!session.url) {
        return fail(502, "STRIPE", "Checkout session missing redirect URL");
      }

      return ok({
        paymentMode: "stripe" as const,
        checkoutUrl: session.url,
      });
    }

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
          ...(idem ? { demoPayIdempotencyKey: idem } : {}),
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
    const viewer = buildOrderActions(uid, auth.user.role, updated);

    return ok({
      paymentMode: "demo" as const,
      order: updated,
      viewer,
      escrowTimeline,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
