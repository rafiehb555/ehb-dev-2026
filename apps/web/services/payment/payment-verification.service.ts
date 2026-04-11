import type { PaymentType } from "@/lib/payments/catalog";
import { runDmoTrustEngine } from "@/lib/stl/dmoTrustEngine";

/**
 * Payment-domain post verification effects.
 * Isolated so this domain can be extracted later.
 */
export async function runPaymentPostVerificationEffects(args: {
  userId: string;
  paymentType: PaymentType;
  actorId: string;
}): Promise<string> {
  if (args.paymentType === "STL_UPGRADE") {
    await runDmoTrustEngine({ userId: args.userId, actorId: args.actorId, reason: "VERIFICATION_UPDATE" }).catch(() => undefined);
    return "STL recalculated";
  }
  if (args.paymentType === "CRB_EXAM") {
    await runDmoTrustEngine({ userId: args.userId, actorId: args.actorId, reason: "EXAM_RESULT" }).catch(() => undefined);
    return "CRB score recalculated";
  }
  if (args.paymentType === "DMO_REFILL") {
    await runDmoTrustEngine({ userId: args.userId, actorId: args.actorId, reason: "REFILL_UPDATE" }).catch(() => undefined);
    return "DMO refill trust refreshed";
  }
  return "Payment captured";
}
