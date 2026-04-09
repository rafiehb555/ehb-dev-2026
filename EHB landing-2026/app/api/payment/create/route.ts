import { randomUUID } from "node:crypto";
import { z } from "zod";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { getAppBaseUrl, getStripe, stripeCheckoutCurrency } from "@/lib/stripe";
import { PAYMENT_PROVIDERS, PAYMENT_TYPES, defaultAmountForType, type PaymentProvider, type PaymentType } from "@/lib/payments/catalog";

const BodySchema = z.object({
  type: z.enum(PAYMENT_TYPES),
  provider: z.enum(PAYMENT_PROVIDERS),
  amount: z.number().positive().max(500000).optional(),
});

function txTypeForPayment(type: PaymentType): TransactionType {
  if (type === "FRANCHISE_FEE") return "FRANCHISE";
  return "ORDER";
}

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BodySchema.parse(await req.json());
    const amount = Number((body.amount ?? defaultAmountForType(body.type)).toFixed(2));
    if (amount <= 0) return fail(400, "VALIDATION", "Amount must be greater than 0");

    const paymentId = `pay_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const referenceId = `${paymentId}:${body.type}:${body.provider}`;
    const tx = await prisma.transaction.create({
      data: {
        userId: auth.user.userId,
        amount,
        type: txTypeForPayment(body.type),
        status: "PENDING",
        referenceId,
      },
    });

    if (body.provider === "STRIPE") {
      const stripe = getStripe();
      if (!stripe) return fail(501, "PAYMENT_PROVIDER_UNAVAILABLE", "Stripe is not configured");
      const base = getAppBaseUrl();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${base}/dmo/stl?payment=success&paymentId=${paymentId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/dmo/stl?payment=cancelled&paymentId=${paymentId}`,
        metadata: {
          paymentId,
          paymentType: body.type,
          provider: body.provider,
          userId: auth.user.userId,
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: stripeCheckoutCurrency(),
              unit_amount: Math.round(amount * 100),
              product_data: {
                name: `${body.type.replaceAll("_", " ")} - EHB`,
              },
            },
          },
        ],
      });
      return ok({
        paymentId,
        amount,
        type: body.type,
        provider: body.provider,
        status: tx.status.toLowerCase(),
        checkoutUrl: session.url ?? null,
      });
    }

    return ok({
      paymentId,
      amount,
      type: body.type,
      provider: body.provider as PaymentProvider,
      status: "pending",
      instructions: `Complete payment using ${body.provider} and then call /api/payment/verify`,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
