import User from "../models/User.js";
import { recalculateUserStl } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";

export const getUser = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: "User fetch error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, type, source } = req.body || {};
    if (!userId) return res.status(400).json({ msg: "userId is required" });
    if (req.auth?.role !== "admin" && req.auth?.userId !== userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (type) user.type = type;
    if (source) user.source = source;

    const stl = await recalculateUserStl(user, { reason: "user_update" });
    await user.save();
    await logEvent({ userId: user.userId, event: "STL_UPDATED", entity: "stl", meta: { stlScore: user.stlScore, stlLevel: user.stlLevel, source: "user_update" } });

    return res.json({ message: "User updated", user, stl });
  } catch (error) {
    return res.status(500).json({ msg: "User update error", error: error.message });
  }
};

