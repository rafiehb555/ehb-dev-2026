import Franchise from "../models/Franchise.js";
import { logEvent } from "./logService.js";
import { notifyUser } from "./notificationService.js";

const STAGES = ["sub", "master", "corporate", "company"];

function nextStage(currentStage) {
  const idx = STAGES.indexOf((currentStage || "sub").toLowerCase());
  if (idx < 0 || idx >= STAGES.length - 1) return STAGES[STAGES.length - 1];
  return STAGES[idx + 1];
}

export async function notifyNextLevel(stage, userId) {
  const nextFranchise = await Franchise.findOne({ type: stage }).sort({ responseTime: 1 });
  if (!nextFranchise || !nextFranchise.assignedUsers?.length) return;
  const recipient = nextFranchise.assignedUsers[0];
  await notifyUser({
    userId: recipient,
    type: "FRANCHISE_TASK",
    title: "Escalated request assigned",
    message: `User ${userId} request moved to ${stage.toUpperCase()} stage.`,
  });
}

export async function escalateCrbApplication(user, reason = "delay_over_24h") {
  user.modules.crb.application = user.modules.crb.application || {};
  const fromStage = (user.modules.crb.application.currentStage || "sub").toLowerCase();
  const toStage = nextStage(fromStage);
  if (fromStage === toStage) return { changed: false, toStage };

  user.modules.crb.application.currentStage = toStage;
  user.modules.crb.application.lastEscalatedAt = new Date();
  user.modules.crb.application.updatedAt = new Date();
  user.modules.crb.application.status = "escalated";
  user.modules.crb.application.escalationHistory = user.modules.crb.application.escalationHistory || [];
  user.modules.crb.application.escalationHistory.push({
    fromStage,
    toStage,
    timestamp: new Date(),
    reason,
  });
  user.modules.crb.application.timeline = user.modules.crb.application.timeline || [];
  user.modules.crb.application.timeline.push({
    stage: toStage,
    status: "escalated",
    timestamp: new Date(),
    note: reason,
  });

  await logEvent({
    userId: user.userId,
    event: "CRB_ESCALATED",
    entity: "crb",
    meta: { fromStage, toStage, reason },
  });
  await notifyUser({
    userId: user.userId,
    type: "CRB_ESCALATION",
    title: "Request escalated",
    message: `CRB request escalated to ${toStage.toUpperCase()}.`,
  });
  await notifyNextLevel(toStage, user.userId);
  return { changed: true, toStage };
}

