import type { AIBrainContext, RiskDecision } from "@/services/dmo-service/ai/models/ai.types";

export async function checkRisk(context: AIBrainContext): Promise<RiskDecision> {
  let score = 0;

  if (context.failedPayments > 3) score += 40;
  if (!context.pssVerified) score += 30;
  if (context.multipleAccounts) score += 30;

  return {
    score,
    level: score > 70 ? "HIGH" : "LOW",
  };
}
