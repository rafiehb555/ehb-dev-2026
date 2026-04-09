import User from "../models/User.js";
import { calculateSTL, explainSTL, getLevel, getStlBreakdown as computeStlBreakdown } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";

export const getUserSTL = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (req.auth?.role !== "admin" && req.auth?.userId !== targetUserId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: targetUserId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const score = user.stlScore ?? 0;
    const reasons = explainSTL(user);
    const breakdown = computeStlBreakdown(user);
    await logEvent({ userId: user.userId, event: "STL_VIEWED", entity: "stl", meta: { score, level: user.stlLevel } });

    return res.json({
      stlScore: score,
      stlLevel: user.stlLevel,
      reasons,
      breakdown,
      userProfile: {
        type: user.role || "SELLER",
        source: user.source || "signup",
        franchiseConnected: Boolean(user.modules?.franchise?.connected),
      },
      policy: [
        "Fake data = ban risk",
        "Low activity = downgrade",
        "High performance = STL boost",
      ],
      user,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const calculateStl = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const score = calculateSTL(user);
    user.stlScore = score;
    user.stlLevel = getLevel(score);
    await user.save();
    await logEvent({ userId: user.userId, event: "STL_UPDATED", entity: "stl", meta: { score, level: user.stlLevel, source: "manual_calculate" } });

    return res.json({ userId: user.userId, stlScore: user.stlScore, stlLevel: user.stlLevel });
  } catch (error) {
    return res.status(500).json({ msg: "STL calculate error", error: error.message });
  }
};

export const getStlBreakdown = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const score = user.stlScore ?? 0;
    const stlLevel = user.stlLevel ?? getLevel(score);
    const breakdown = computeStlBreakdown(user);
    await logEvent({ userId: user.userId, event: "STL_BREAKDOWN_VIEWED", entity: "stl", meta: { score, level: stlLevel } });

    return res.json({ userId: user.userId, stlScore: score, stlLevel, breakdown });
  } catch (error) {
    return res.status(500).json({ msg: "Breakdown error", error: error.message });
  }
};

