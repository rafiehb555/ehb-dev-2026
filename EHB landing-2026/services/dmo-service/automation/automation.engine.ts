import * as workflows from "@/services/dmo-service/automation/workflows";
import { executeAction } from "@/services/dmo-service/automation/executor";
import type { AutomationEvent, AutomationPayload } from "@/services/dmo-service/automation/types";

export async function runAutomation(event: AutomationEvent, data: AutomationPayload) {
  let action = null;

  switch (event) {
    case "USER_UPDATED":
      action = await workflows.handleFraudCheck(data);
      break;
    case "PAYMENT_SUCCESS":
      action = await workflows.handleFranchiseApproval(data);
      break;
    case "STL_CHECK":
      action = await workflows.handleSTLCheck(data);
      break;
    default:
      action = null;
  }

  if (!action) return { executed: false, action: null };
  return executeAction(action, data);
}

