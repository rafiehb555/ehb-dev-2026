import type { AutomationAction, AutomationPayload } from "@/services/dmo-service/automation/types";

export async function handleSTLCheck(user: AutomationPayload): Promise<AutomationAction | null> {
  const meetsCriteria = Boolean(user.pssVerified) && Number(user.balance ?? 0) > 100 && Boolean(user.crbPassed);
  if (!meetsCriteria) return null;

  return {
    action: "UPGRADE_STL",
    level: (user.level ?? 1) + 1,
    reason: "Auto STL upgrade criteria met",
  };
}

