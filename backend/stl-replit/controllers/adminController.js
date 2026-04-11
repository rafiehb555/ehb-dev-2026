import Log from "../models/Log.js";
import Franchise from "../models/Franchise.js";
import User from "../models/User.js";
import {
  approveAdminActionRequest,
  createAdminActionRequest,
  getAdminActionTimeline,
  getAdminSecurityStats,
  getPendingAdminActions,
  rejectAdminActionRequest,
  rollbackAdminActionRequest,
} from "../services/adminActionService.js";
import { getClientIp } from "../middleware/adminSecurity.js";

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
    const request = await createAdminActionRequest({
      actionType: "STL_UPDATE",
      targetUserId: userId,
      payload: { pssScore, crbScore, dmoScore, lockAmount },
      reason,
      requestedBy: req.auth?.userId,
      requestIp: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });
    return res.status(202).json({
      message: "STL update request created, pending second admin approval",
      requestId: request._id,
      status: request.status,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Admin STL update request error", error: error.message });
  }
};

export const adminFreezeUser = async (req, res) => {
  try {
    const { userId, freeze = true, reason = "admin_action" } = req.body || {};
    const request = await createAdminActionRequest({
      actionType: "FREEZE_USER",
      targetUserId: userId,
      payload: { freeze },
      reason,
      requestedBy: req.auth?.userId,
      requestIp: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });
    return res.status(202).json({
      message: "Freeze action request created, pending second admin approval",
      requestId: request._id,
      status: request.status,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Admin freeze request error", error: error.message });
  }
};

export const createWalletAdjustmentRequest = async (req, res) => {
  try {
    const { userId, amount, reason = "wallet_adjustment" } = req.body || {};
    const request = await createAdminActionRequest({
      actionType: "WALLET_ADJUST",
      targetUserId: userId,
      payload: { amount },
      reason,
      requestedBy: req.auth?.userId,
      requestIp: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });
    return res.status(202).json({
      message: "Wallet adjustment request created, pending second admin approval",
      requestId: request._id,
      status: request.status,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Wallet adjustment request error", error: error.message });
  }
};

export const approveAdminAction = async (req, res) => {
  try {
    const { requestId } = req.body || {};
    const { requestDoc, beforeSnapshot, afterSnapshot } = await approveAdminActionRequest({
      requestId,
      approverId: req.auth?.userId,
      approvalIp: getClientIp(req),
    });
    return res.json({
      message: "Admin action approved and executed",
      requestId: requestDoc._id,
      actionType: requestDoc.actionType,
      beforeSnapshot,
      afterSnapshot,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Admin action approval failed", error: error.message });
  }
};

export const rejectAdminAction = async (req, res) => {
  try {
    const { requestId, reason } = req.body || {};
    const request = await rejectAdminActionRequest({
      requestId,
      rejectorId: req.auth?.userId,
      rejectReason: reason,
    });
    return res.json({
      message: "Admin action rejected",
      requestId: request._id,
      status: request.status,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Admin action rejection failed", error: error.message });
  }
};

export const rollbackAdminAction = async (req, res) => {
  try {
    const { requestId, reason } = req.body || {};
    const request = await rollbackAdminActionRequest({
      requestId,
      rollbackBy: req.auth?.userId,
      reason,
    });
    return res.json({
      message: "Admin action rolled back",
      requestId: request._id,
      status: request.status,
    });
  } catch (error) {
    return res.status(400).json({ msg: "Admin action rollback failed", error: error.message });
  }
};

export const getPendingAdminActionQueue = async (_req, res) => {
  try {
    const items = await getPendingAdminActions();
    return res.json({ items });
  } catch (error) {
    return res.status(500).json({ msg: "Pending admin actions error", error: error.message });
  }
};

export const getAdminActionHistory = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const data = await getAdminActionTimeline({ page, limit });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Admin action history error", error: error.message });
  }
};

export const getAdminSecurityOverview = async (_req, res) => {
  try {
    const stats = await getAdminSecurityStats();
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ msg: "Admin security overview error", error: error.message });
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

