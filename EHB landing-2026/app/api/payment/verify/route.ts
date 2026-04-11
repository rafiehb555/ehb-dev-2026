import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { isAdmin, requireSession } from "@/lib/rbac";
import { getStripe } from "@/lib/stripe";
import { writeAuditLog } from "@/lib/audit";
import { readAffiliateStore, writeAffiliateStore } from "@/lib/affiliate/store";
import { txLabelForType, type PaymentType } from "@/lib/payments/catalog";
import { enqueuePaymentVerification } from "@/jobs/enqueue";
import { runPaymentPostVerificationEffects } from "@/services/payment";
import { enforceRateLimit } from "@/lib/api/rateLimit";
import { monitorApiRequest } from "@/monitoring/api";

const BodySchema = z.object({
  paymentId: z.string().min(8),
  sessionId: z.string().optional(),
  providerReference: z.string().optional(),
  userId: z.string().optional(),
});

function parseRef(referenceId?: string | null): { paymentId: string; paymentType: PaymentType | null; provider: string | null } {
  if (!referenceId) return { paymentId: "", paymentType: null, provider: null };
  const [paymentId, paymentType, provider] = referenceId.split(":");
  const validType = paymentType as PaymentType | undefined;
  if (!validType || !["STL_UPGRADE", "CRB_EXAM", "DMO_REFILL", "FRANCHISE_FEE"].includes(validType)) {
    return { paymentId, paymentType: null, provider: provider ?? null };
  }
  return { paymentId, paymentType: validType, provider: provider ?? null };
}

async function applyAffiliateCommission(args: { payerUserId: string; paymentId: string; amount: number; paymentType: PaymentType }) {
  const store = await readAffiliateStore();
  const referrerId = store.referredBy[args.payerUserId];
  if (!referrerId || referrerId === args.payerUserId) return null;

  const already = store.commissions.some((c) => c.sourcePaymentId === args.paymentId && c.userId === referrerId);
  if (already) return null;

  const referrerStl = await prisma.sTLScore.findUnique({
    where: { entityType_entityId: { entityType: "USER", entityId: referrerId } },
    select: { level: true },
  });
  const level = Number(referrerStl?.level ?? 1);
  const rate = level >= 7 ? 0.15 : level >= 6 ? 0.12 : level >= 5 ? 0.1 : 0.08;
  const commissionAmount = Number((args.amount * rate).toFixed(2));
  if (commissionAmount <= 0) return null;

  store.commissions.push({
    id: `comm_${Date.now()}_${randomUUID().slice(0, 6)}`,
    userId: referrerId,
    fromUser: args.payerUserId,
    amount: commissionAmount,
    type: `PAYMENT_${args.paymentType}`,
    createdAt: new Date().toISOString(),
    sourcePaymentId: args.paymentId,
  });
  await writeAffiliateStore(store, referrerId);

  await prisma.wallet.upsert({
    where: { userId: referrerId },
    create: { userId: referrerId, affiliateIncome: commissionAmount },
    update: { affiliateIncome: { increment: commissionAmount } },
  });
  await prisma.transaction.create({
    data: {
      userId: referrerId,
      amount: commissionAmount,
      type: "AFFILIATE",
      status: "COMPLETED",
      referenceId: `affiliate:${args.paymentId}`,
    },
  });
  return { referrerId, commissionAmount, ratePct: Math.round(rate * 100) };
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, { route: "api:payment:verify", maxRequests: 30, windowMs: 60_000 });
  if (!limited.ok) return limited.response;

  return monitorApiRequest(req, "api:payment:verify", async () => {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BodySchema.parse(await req.json());
    const ownerUserId = body.userId && isAdmin(auth.user.role) ? body.userId : auth.user.userId;

    const tx = await prisma.transaction.findFirst({
      where: {
        userId: ownerUserId,
        referenceId: { startsWith: body.paymentId },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!tx) return fail(404, "NOT_FOUND", "Payment record not found");

    const ref = parseRef(tx.referenceId);
    if (ref.paymentId !== body.paymentId || !ref.paymentType) return fail(400, "VALIDATION", "Invalid payment reference");

    if (tx.status === "COMPLETED") {
      return ok({
        success: true,
        paymentId: body.paymentId,
        alreadyVerified: true,
        message: "Payment already verified",
      });
    }

    // Basic fraud checks: exact amount/ownership + provider verification path.
    if (tx.amount <= 0) return fail(400, "FRAUD_CHECK", "Invalid payment amount");
    if (ref.provider === "STRIPE") {
      const stripe = getStripe();
      if (!stripe) return fail(501, "PAYMENT_PROVIDER_UNAVAILABLE", "Stripe is not configured");
      if (!body.sessionId) return fail(400, "VALIDATION", "sessionId is required for Stripe verification");
      const session = await stripe.checkout.sessions.retrieve(body.sessionId);
      const paid = session.payment_status === "paid";
      const metaPaymentId = session.metadata?.paymentId;
      const paidAmount = Number(((session.amount_total ?? 0) / 100).toFixed(2));
      if (!paid || metaPaymentId !== body.paymentId || paidAmount !== Number(tx.amount.toFixed(2))) {
        return fail(400, "FRAUD_CHECK", "Stripe verification failed");
      }
    } else {
      // Local/global manual rails still require a provider reference to mark complete.
      if (!body.providerReference || body.providerReference.trim().length < 6) {
        return fail(400, "VALIDATION", "providerReference required for non-Stripe verification");
      }
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "COMPLETED" },
    });

    const effect = await runPaymentPostVerificationEffects({
      userId: ownerUserId,
      paymentType: ref.paymentType,
      actorId: auth.user.userId,
    });
    const commission = await applyAffiliateCommission({
      payerUserId: ownerUserId,
      paymentId: body.paymentId,
      amount: tx.amount,
      paymentType: ref.paymentType,
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PAYMENT_VERIFIED",
      targetType: "OTHER",
      targetId: body.paymentId,
      metadata: {
        paymentType: ref.paymentType,
        provider: ref.provider,
        amount: tx.amount,
        userId: ownerUserId,
      },
    });

    enqueuePaymentVerification({
      userId: ownerUserId,
      actorId: auth.user.userId,
      paymentType: ref.paymentType,
    });

    return ok({
      success: true,
      paymentId: body.paymentId,
      type: ref.paymentType,
      label: txLabelForType(ref.paymentType),
      amount: tx.amount,
      status: "completed",
      effect,
      commission,
      message: "Payment successful. Dashboard will reflect updates shortly.",
    });
  } catch (err) {
    return handleRouteError(err);
  }
  });
}
