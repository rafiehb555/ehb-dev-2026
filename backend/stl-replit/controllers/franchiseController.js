import Franchise from "../models/Franchise.js";
import User from "../models/User.js";
import { logEvent } from "../services/logService.js";
import { notifyUser } from "../services/notificationService.js";
import { recalculateUserStl } from "../services/stlService.js";

const STAGES = ["sub", "master", "corporate", "company"];

function nextStage(currentStage) {
  const idx = STAGES.indexOf((currentStage || "sub").toLowerCase());
  if (idx < 0 || idx >= STAGES.length - 1) return STAGES[STAGES.length - 1];
  return STAGES[idx + 1];
}

async function notifyNextLevel(stage, userId) {
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

export const getFranchiseDashboard = async (_req, res) => {
  try {
    const items = await Franchise.find().sort({ createdAt: -1 });
    const totals = items.reduce(
      (acc, f) => {
        acc.pendingRequests += f.pendingRequests || 0;
        acc.approvals += f.approvals || 0;
        return acc;
      },
      { pendingRequests: 0, approvals: 0 },
    );
    return res.json({ items, totals });
  } catch (error) {
    return res.status(500).json({ msg: "Franchise dashboard error", error: error.message });
  }
};

export const approveFranchiseRequest = async (req, res) => {
  try {
    const { userId, franchiseId } = req.body || {};
    if (!userId || !franchiseId) return res.status(400).json({ msg: "userId and franchiseId are required" });

    const [user, franchise] = await Promise.all([User.findOne({ userId }), Franchise.findById(franchiseId)]);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!franchise) return res.status(404).json({ msg: "Franchise not found" });

    user.modules.crb.application = user.modules.crb.application || {};
    user.modules.crb.application.status = "approved";
    user.modules.crb.application.currentStage = nextStage(user.modules.crb.application.currentStage);
    user.modules.crb.application.updatedAt = new Date();

    if (user.modules.crb.application.currentStage === "company") {
      user.modules.crb.score = Math.min(100, (user.modules.crb.score || 0) + 20);
      await recalculateUserStl(user, { reason: "crb_update" });
    }

    franchise.approvals = (franchise.approvals || 0) + 1;
    franchise.pendingRequests = Math.max(0, (franchise.pendingRequests || 0) - 1);

    await Promise.all([user.save(), franchise.save()]);

    await logEvent({ userId, event: "FRANCHISE_APPROVED", entity: "franchise", meta: { franchiseId, stage: user.modules.crb.application.currentStage } });
    await notifyUser({
      userId,
      type: "FRANCHISE_APPROVAL",
      title: "Franchise approval",
      message: `Your request moved to ${user.modules.crb.application.currentStage.toUpperCase()} stage.`,
    });
    await notifyNextLevel(user.modules.crb.application.currentStage, userId);

    return res.json({ message: "Franchise approval processed", application: user.modules.crb.application });
  } catch (error) {
    return res.status(500).json({ msg: "Franchise approve error", error: error.message });
  }
};

export const escalateFranchiseRequest = async (req, res) => {
  try {
    const { userId, reason = "delay" } = req.body || {};
    if (!userId) return res.status(400).json({ msg: "userId is required" });

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.modules.crb.application = user.modules.crb.application || {};
    user.modules.crb.application.currentStage = nextStage(user.modules.crb.application.currentStage);
    user.modules.crb.application.lastEscalatedAt = new Date();
    user.modules.crb.application.updatedAt = new Date();
    user.modules.crb.application.status = "escalated";
    await user.save();

    await logEvent({
      userId,
      event: "CRB_ESCALATED",
      entity: "crb",
      meta: { currentStage: user.modules.crb.application.currentStage, reason },
    });
    await notifyUser({
      userId,
      type: "CRB_ESCALATION",
      title: "Request escalated",
      message: `Your request was escalated to ${user.modules.crb.application.currentStage.toUpperCase()}.`,
    });
    await notifyNextLevel(user.modules.crb.application.currentStage, userId);

    return res.json({ message: "Request escalated", application: user.modules.crb.application });
  } catch (error) {
    return res.status(500).json({ msg: "Franchise escalation error", error: error.message });
  }
};

export const getFranchisePerformance = async (_req, res) => {
  try {
    const items = await Franchise.find().sort({ performanceScore: -1 });
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ msg: "Franchise performance error", error: error.message });
  }
};

