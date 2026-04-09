import type { AutomationAction, AutomationPayload } from "@/services/dmo-service/automation/types";

async function sendNotification(userId: string, message: string) {
  // Placeholder for realtime/push integration.
  console.log(`[automation:notify] user=${userId} message=${message}`);
}

export async function executeAction(action: AutomationAction, payload: AutomationPayload) {
  switch (action.action) {
    case "UPGRADE_STL":
      console.log(`[automation] Upgrading STL for ${payload.userId} to level ${action.level ?? "N/A"}`);
      await sendNotification(payload.userId, "Your STL upgraded automatically.");
      return { executed: true, action };

    case "APPLY_PENALTY":
      console.log(`[automation] Applying penalty for ${payload.userId}`);
      await sendNotification(payload.userId, "A security penalty was automatically applied.");
      return { executed: true, action };

    case "AUTO_APPROVE_FRANCHISE":
      console.log(`[automation] Auto-approving franchise for ${payload.userId}`);
      await sendNotification(payload.userId, "Your franchise request was auto-approved.");
      return { executed: true, action };

    default:
      return { executed: false, action: { action: "NO_ACTION", reason: "No executable action" } };
  }
}

