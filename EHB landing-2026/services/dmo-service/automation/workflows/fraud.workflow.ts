import type { AutomationAction, AutomationPayload } from "@/services/dmo-service/automation/types";

export async function handleFraudCheck(user: AutomationPayload): Promise<AutomationAction | null> {
  if (!user.suspiciousActivity) return null;
  return {
    action: "APPLY_PENALTY",
    reason: "Suspicious activity detected by automation",
    meta: { severity: "HIGH" },
  };
}

