import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { writeAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

/** Narrow shape from Stripe `checkout.session.completed` payload (avoids brittle namespace imports). */
type StripeCheckoutSessionPayload = {
  id: string;
  client_reference_id?: string | null;
  metadata?: Record<string, string | undefined> | null;
  payment_status?: string | null;
  amount_total?: number | null;
  payment_intent?: string | { id?: string } | null;
};

/**
 * Stripe webhook: verify signature, idempotent by event id, mark order PAID on checkout.session.completed.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 501 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  let event: { id: string; type: string; data: { object: StripeCheckoutSessionPayload } };
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, whSecret) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const existing = await prisma.processedStripeEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type !== "checkout.session.completed") {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: event.type },
    });
    return NextResponse.json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const orderId = session.client_reference_id ?? session.metadata?.orderId;
  if (!orderId || typeof orderId !== "string") {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: `${event.type}_NO_ORDER` },
    });
    return NextResponse.json({ received: true, skipped: true });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: `${event.type}_NOT_FOUND` },
    });
    return NextResponse.json({ received: true, skipped: true });
  }

  if (order.status !== "PENDING") {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: `${event.type}_NOT_PENDING` },
    });
    return NextResponse.json({ received: true, skipped: true });
  }

  if (session.payment_status !== "paid") {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: `${event.type}_UNPAID` },
    });
    return NextResponse.json({ received: true, skipped: true });
  }

  const expectedCents = Math.round(order.price * order.quantity * 100);
  const paidCents = session.amount_total;
  if (paidCents != null && paidCents !== expectedCents) {
    await prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: `${event.type}_AMOUNT_MISMATCH` },
    });
    return NextResponse.json({ received: true, error: "amount_mismatch" });
  }

  const prevMeta = (order.metadata ?? {}) as Record<string, unknown>;
  const now = new Date().toISOString();
  const pi = session.payment_intent;
  const paymentIntentId =
    typeof pi === "string" ? pi : pi && typeof pi === "object" && "id" in pi ? String((pi as { id: string }).id) : undefined;

  await prisma.$transaction([
    prisma.processedStripeEvent.create({
      data: { stripeEventId: event.id, eventType: event.type },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        metadata: {
          ...prevMeta,
          paymentCapturedAt: now,
          paymentMethod: "STRIPE",
          stripeCheckoutSessionId: session.id,
          ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
          escrowHeld: prevMeta.escrowHeld ?? true,
        } as object,
      },
    }),
  ]);

  await writeAuditLog({
    actorId: order.buyerId,
    action: "MARKETPLACE_ORDER_PAID",
    targetType: "OTHER",
    targetId: order.id,
    metadata: { amount: order.price * order.quantity, source: "stripe_webhook" },
  });

  return NextResponse.json({ received: true });
}
