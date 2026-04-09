import { runAutomation } from "@/services/dmo-service/automation/automation.engine";
import type { AutomationEvent, AutomationPayload } from "@/services/dmo-service/automation/types";

export async function triggerAutomationEvent(event: AutomationEvent, data: AutomationPayload) {
  try {
    return await runAutomation(event, data);
  } catch (error) {
    console.error("[automation] trigger failed", event, error);
    return { executed: false, action: null };
  }
}

