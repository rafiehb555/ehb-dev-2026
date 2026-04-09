import User from "../models/User.js";
import { recalculateUserStl } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";

function getActivityLevel(orders = 0) {
  if (orders >= 20) return "high";
  if (orders >= 5) return "medium";
  return "low";
}

export const trackDmoActivity = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const { ordersDelta = 0, refillsDelta = 0, behaviorScoreDelta = 0 } = req.body || {};
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.modules.dmo.orders = Math.max(0, (user.modules.dmo.orders || 0) + Number(ordersDelta || 0));
    user.modules.dmo.refills = Math.max(0, (user.modules.dmo.refills || 0) + Number(refillsDelta || 0));
    user.modules.dmo.behaviorScore = Math.max(0, Math.min(100, (user.modules.dmo.behaviorScore || 50) + Number(behaviorScoreDelta || 0)));
    user.modules.dmo.activityLevel = getActivityLevel(user.modules.dmo.orders);
    user.modules.dmo.score = Math.max(0, Math.min(100, user.modules.dmo.behaviorScore * 0.6 + user.modules.dmo.orders * 2));

    const stl = await recalculateUserStl(user, { reason: "dmo_update" });
    await user.save();
    await logEvent({
      userId: user.userId,
      event: "DMO_ACTIVITY",
      entity: "dmo",
      meta: { orders: user.modules.dmo.orders, level: user.modules.dmo.activityLevel },
    });
    await logEvent({
      userId: user.userId,
      event: "STL_UPDATED",
      entity: "stl",
      meta: { stlScore: user.stlScore, stlLevel: user.stlLevel, source: "dmo_update" },
    });

    return res.json({ message: "DMO activity tracked", dmo: user.modules.dmo, stl });
  } catch (error) {
    return res.status(500).json({ msg: "DMO track error", error: error.message });
  }
};

export const getDmoStats = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json({ userId: user.userId, dmo: user.modules.dmo });
  } catch (error) {
    return res.status(500).json({ msg: "DMO stats error", error: error.message });
  }
};

