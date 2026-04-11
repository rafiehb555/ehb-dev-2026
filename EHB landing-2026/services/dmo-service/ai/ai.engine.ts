import { checkRisk } from "@/services/dmo-service/ai/decision/risk.decision";
import { checkEligibility } from "@/services/dmo-service/ai/decision/eligibility.decision";
import type { AIBrainContext, AIBrainResult } from "@/services/dmo-service/ai/models/ai.types";

export async function runAIBrain(context: AIBrainContext): Promise<AIBrainResult> {
  const risk = await checkRisk(context);
  const eligibility = await checkEligibility(context);

  return {
    risk,
    eligibility,
  };
}
