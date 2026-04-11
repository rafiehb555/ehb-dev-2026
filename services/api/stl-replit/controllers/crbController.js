import User from "../models/User.js";
import { recalculateUserStl } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";
import { notifyUser } from "../services/notificationService.js";
import { escalateCrbApplication } from "../services/crbEscalationService.js";

const STAGES = ["sub", "master", "corporate", "company"];
const ESCALATE_MS = 24 * 60 * 60 * 1000;

function getCurrentStage(app) {
  return (app?.currentStage || "sub").toLowerCase();
}

function getNextStage(stage) {
  const idx = STAGES.indexOf((stage || "sub").toLowerCase());
  if (idx < 0 || idx >= STAGES.length - 1) return STAGES[STAGES.length - 1];
  return STAGES[idx + 1];
}

function shouldEscalate(app) {
  if (!app?.updatedAt || app?.status === "approved" || app?.status === "rejected") return false;
  return Date.now() - new Date(app.updatedAt).getTime() > ESCALATE_MS;
}

export const createCrbApplication = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.modules.crb.application = {
      status: "submitted",
      currentStage: (req.body?.assignedLevel || "sub").toLowerCase(),
      documents: req.body?.documents || [],
      submittedAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          stage: (req.body?.assignedLevel || "sub").toLowerCase(),
          status: "submitted",
          timestamp: new Date(),
          note: "application_created",
        },
      ],
      escalationHistory: [],
      approvalTimes: {},
    };

    await user.save();
    await logEvent({ userId: user.userId, event: "CRB_APPLICATION_CREATED", entity: "crb", meta: user.modules.crb.application });
    return res.json({ message: "CRB application created", application: user.modules.crb.application });
  } catch (error) {
    return res.status(500).json({ msg: "CRB create error", error: error.message });
  }
};

export const getCrbApplicationStatus = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.modules.crb.application = user.modules.crb.application || {};
    return res.json({ userId: user.userId, application: user.modules.crb.application || null });
  } catch (error) {
    return res.status(500).json({ msg: "CRB status error", error: error.message });
  }
};

export const updateCrbApproval = async (req, res) => {
  try {
    const { approved, examsPassedDelta = 0, examsFailedDelta = 0 } = req.body || {};
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.modules.crb.application = user.modules.crb.application || {};
    const currentStage = getCurrentStage(user.modules.crb.application);
    const nextStage = getNextStage(currentStage);
    user.modules.crb.application.updatedAt = new Date();
    user.modules.crb.application.timeline = user.modules.crb.application.timeline || [];
    user.modules.crb.application.approvalTimes = user.modules.crb.application.approvalTimes || {};
    if (approved) {
      user.modules.crb.application.approvalTimes[currentStage] = new Date();
      if (currentStage === "company") {
        user.modules.crb.application.status = "approved";
      } else {
        user.modules.crb.application.status = "in_review";
        user.modules.crb.application.currentStage = nextStage;
        user.modules.crb.application.timeline.push({
          stage: nextStage,
          status: "in_review",
          timestamp: new Date(),
          note: `approved_at_${currentStage}`,
        });
      }
    } else {
      user.modules.crb.application.status = "rejected";
    }
    user.modules.crb.application.timeline.push({
      stage: currentStage,
      status: approved ? "approved" : "rejected",
      timestamp: new Date(),
      note: "manual_decision",
    });
    user.modules.crb.examsPassed = Math.max(0, (user.modules.crb.examsPassed || 0) + Number(examsPassedDelta || 0));
    user.modules.crb.examsFailed = Math.max(0, (user.modules.crb.examsFailed || 0) + Number(examsFailedDelta || 0));
    user.modules.crb.score = Math.max(
      0,
      Math.min(100, (user.modules.crb.examsPassed || 0) * 20 - (user.modules.crb.examsFailed || 0) * 10 + (approved ? 20 : 0)),
    );

    const stl = await recalculateUserStl(user, { reason: "crb_update" });
    await user.save();
    await logEvent({
      userId: user.userId,
      event: approved ? "CRB_APPROVED" : "CRB_REJECTED",
      entity: "crb",
      meta: {
        examsPassed: user.modules.crb.examsPassed,
        examsFailed: user.modules.crb.examsFailed,
        currentStage: user.modules.crb.application.currentStage,
        status: user.modules.crb.application.status,
      },
    });
    await notifyUser({
      userId: user.userId,
      type: approved ? "CRB_APPROVED" : "CRB_REJECTED",
      title: "CRB decision",
      message: approved
        ? `CRB decision updated. Current stage: ${(user.modules.crb.application.currentStage || "company").toUpperCase()}.`
        : "Your CRB request was rejected.",
    });
    await logEvent({
      userId: user.userId,
      event: "STL_UPDATED",
      entity: "stl",
      meta: { stlScore: user.stlScore, stlLevel: user.stlLevel, source: "crb_update" },
    });
    return res.json({ message: "CRB approval updated", crb: user.modules.crb, stl });
  } catch (error) {
    return res.status(500).json({ msg: "CRB approval error", error: error.message });
  }
};

export const getCrbTimeline = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const app = user.modules?.crb?.application || {};

    return res.json({
      userId: user.userId,
      submittedAt: app.submittedAt || null,
      currentStage: app.currentStage || "sub",
      approvalTimes: app.approvalTimes || {},
      timeline: app.timeline || [],
      escalationHistory: app.escalationHistory || [],
    });
  } catch (error) {
    return res.status(500).json({ msg: "CRB timeline error", error: error.message });
  }
};

export const runCrbEscalationCheck = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!shouldEscalate(user.modules?.crb?.application)) {
      return res.json({ message: "No escalation needed" });
    }
    await escalateCrbApplication(user, "delay_over_24h");
    await user.save();
    return res.json({ message: "Escalated", application: user.modules.crb.application });
  } catch (error) {
    return res.status(500).json({ msg: "CRB escalation check error", error: error.message });
  }
};

