import User from "../models/User.js";
import { escalateCrbApplication } from "../services/crbEscalationService.js";
import { logEvent } from "../services/logService.js";

const ESCALATE_MS = 24 * 60 * 60 * 1000;

function isStuck(app) {
  if (!app?.updatedAt) return false;
  if (app.status === "approved" || app.status === "rejected") return false;
  if ((app.currentStage || "sub").toLowerCase() === "company") return false;
  return Date.now() - new Date(app.updatedAt).getTime() > ESCALATE_MS;
}

export async function runCrbEscalationCycle() {
  const users = await User.find({
    "modules.crb.application.updatedAt": { $exists: true },
  });

  let escalated = 0;
  for (const user of users) {
    const app = user.modules?.crb?.application;
    if (!isStuck(app)) continue;
    const result = await escalateCrbApplication(user, "worker_delay_over_24h");
    if (result.changed) {
      escalated += 1;
      await user.save();
    }
  }

  await logEvent({
    userId: "system",
    event: "CRB_ESCALATION_CYCLE",
    entity: "worker",
    meta: { escalated },
  });
  return { escalated };
}

export function startCrbEscalationWorker() {
  const intervalMs = Number(process.env.CRB_ESCALATION_INTERVAL_MS || 10 * 60 * 1000);
  const safeInterval = Math.max(5 * 60 * 1000, intervalMs);

  const tick = async () => {
    try {
      await runCrbEscalationCycle();
    } catch (error) {
      await logEvent({
        userId: "system",
        event: "CRB_ESCALATION_FAILED",
        entity: "worker",
        meta: { message: error.message },
      });
    }
  };

  setInterval(tick, safeInterval);
}

