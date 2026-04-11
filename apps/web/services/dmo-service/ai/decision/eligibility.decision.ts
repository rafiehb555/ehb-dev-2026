import type { AIBrainContext, EligibilityDecision } from "@/services/dmo-service/ai/models/ai.types";

export async function checkEligibility(context: AIBrainContext): Promise<EligibilityDecision> {
  if (!context.pssVerified) {
    return { allowed: false, reason: "PSS Required" };
  }

  if (context.balance < 100) {
    return { allowed: false, reason: "Insufficient Balance" };
  }

  return { allowed: true };
}
