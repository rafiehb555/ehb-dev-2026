import Log from "../models/Log.js";
import Franchise from "../models/Franchise.js";
import User from "../models/User.js";
import { logEvent } from "../services/logService.js";
import { recalculateUserStl } from "../services/stlService.js";

export const getAdminDashboard = async (_req, res) => {
  try {
    const [totalUsers, activeUsers, pendingCrb, fraudAlerts, revenueAgg, todayRevenueAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ "modules.dmo.activityLevel": { $in: ["medium", "high"] } }),
      User.countDocuments({ "modules.crb.application.status": { $in: ["submitted", "in_review", "escalated"] } }),
      User.countDocuments({ "wallet.frozen": true }),
      User.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$earnings.total" } } }]),
      User.aggregate([
        {
          $group: { _id: null, todayRevenue: { $sum: "$earnings.today" } },
        },
      ]),
    ]);

    return res.json({
      totalUsers,
      activeUsers,
      pendingCrb,
      fraudAlerts,
      totalEarnings: revenueAgg?.[0]?.totalRevenue || 0,
      todayRevenue: todayRevenueAgg?.[0]?.todayRevenue || 0,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Admin dashboard error", error: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          $or: [{ userId: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
        }
      : {};

    const [items, total] = await Promise.all([
      User.find(where)
        .select("userId email role stlScore stlLevel wallet modules.pss.score modules.crb.score modules.dmo.score")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(where),
    ]);

    return res.json({ items, page, limit, total });
  } catch (error) {
    return res.status(500).json({ msg: "Admin users error", error: error.message });
  }
};

export const adminUpdateStl = async (req, res) => {
  try {
    const { userId, pssScore, crbScore, dmoScore, lockAmount, reason = "admin_manual_adjustment" } = req.body || {};
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (typeof pssScore === "number") user.pssScore = pssScore;
    if (typeof crbScore === "number") user.crbScore = crbScore;
    if (typeof dmoScore === "number") user.dmoScore = dmoScore;
    if (typeof lockAmount === "number") user.lockAmount = lockAmount;

    const before = { stlScore: user.stlScore, stlLevel: user.stlLevel };
    const stl = await recalculateUserStl(user, { reason: "admin_manual_update" });
    await user.save();

    await logEvent({
      userId,
      event: "ADMIN_STL_UPDATED",
      entity: "admin",
      meta: { admin: req.auth?.userId, before, after: { stlScore: stl.stlScore, stlLevel: stl.stlLevel }, reason },
    });

    return res.json({ message: "STL updated by admin", userId, stl, before });
  } catch (error) {
    return res.status(500).json({ msg: "Admin STL update error", error: error.message });
  }
};

export const adminFreezeUser = async (req, res) => {
  try {
    const { userId, freeze = true, reason = "admin_action" } = req.body || {};
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.wallet = user.wallet || { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false };
    user.wallet.frozen = Boolean(freeze);
    await user.save();

    await logEvent({
      userId,
      event: freeze ? "ADMIN_USER_FROZEN" : "ADMIN_USER_UNFROZEN",
      entity: "admin",
      meta: { admin: req.auth?.userId, reason },
    });

    return res.json({ message: freeze ? "User frozen" : "User unfrozen", userId, frozen: user.wallet.frozen });
  } catch (error) {
    return res.status(500).json({ msg: "Admin freeze error", error: error.message });
  }
};

export const getAdminLogs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Log.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Log.countDocuments(),
    ]);
    return res.json({ items, page, limit, total });
  } catch (error) {
    return res.status(500).json({ msg: "Admin logs error", error: error.message });
  }
};

export const getAdminFranchiseOverview = async (_req, res) => {
  try {
    const items = await Franchise.find().sort({ createdAt: -1 });
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ msg: "Admin franchise overview error", error: error.message });
  }
};

