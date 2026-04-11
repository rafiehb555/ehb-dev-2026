import crypto from "crypto";
import AdminActionRequest from "../models/AdminActionRequest.js";
import User from "../models/User.js";
import Log from "../models/Log.js";
import { logEvent } from "./logService.js";
import { recalculateUserStl } from "./stlService.js";

const LIMITS = {
  maxStlComponentDelta: Number(process.env.ADMIN_MAX_STL_COMPONENT_DELTA || 10),
  maxWalletAdjustAmount: Number(process.env.ADMIN_MAX_WALLET_ADJUST_AMOUNT || 1000),
  requestExpiresHours: Number(process.env.ADMIN_REQUEST_EXPIRES_HOURS || 24),
  anomalyWindowMinutes: Number(process.env.ADMIN_ANOMALY_WINDOW_MINUTES || 10),
  anomalyBurstLimit: Number(process.env.ADMIN_ANOMALY_BURST_LIMIT || 5),
};

function buildSnapshot(user) {
  return {
    userId: user.userId,
    pssScore: user.pssScore,
    crbScore: user.crbScore,
    dmoScore: user.dmoScore,
    lockAmount: user.lockAmount,
    stlScore: user.stlScore,
    stlLevel: user.stlLevel,
    wallet: user.wallet,
  };
}

function ensureLimits({ actionType, payload, user }) {
  if (actionType === "STL_UPDATE") {
    const checks = ["pssScore", "crbScore", "dmoScore"];
    for (const key of checks) {
      if (typeof payload[key] === "number") {
        const before = Number(user[key] || 0);
        const delta = Math.abs(payload[key] - before);
        if (delta > LIMITS.maxStlComponentDelta) {
          throw new Error(`${key} delta exceeds allowed limit`);
        }
      }
    }
  }

  if (actionType === "WALLET_ADJUST") {
    const amount = Number(payload.amount || 0);
    if (Number.isNaN(amount) || amount === 0) {
      throw new Error("Wallet adjust amount is required");
    }
    if (Math.abs(amount) > LIMITS.maxWalletAdjustAmount) {
      throw new Error("Wallet adjust amount exceeds allowed limit");
    }
  }
}

async function checkAndEmitAnomaly({ requestedBy, actionType }) {
  const windowStart = new Date(Date.now() - LIMITS.anomalyWindowMinutes * 60 * 1000);
  const count = await AdminActionRequest.countDocuments({
    requestedBy,
    createdAt: { $gte: windowStart },
  });
  if (count >= LIMITS.anomalyBurstLimit) {
    await logEvent({
      userId: requestedBy,
      event: "ADMIN_ANOMALY_ALERT",
      entity: "admin",
      meta: {
        type: "request_burst",
        actionType,
        count,
        windowMinutes: LIMITS.anomalyWindowMinutes,
      },
    });
  }
}

async function executeApprovedAction(requestDoc, approverId) {
  const user = await User.findOne({ userId: requestDoc.targetUserId });
  if (!user) throw new Error("Target user not found");

  const beforeSnapshot = buildSnapshot(user);
  const payload = requestDoc.payload || {};

  if (requestDoc.actionType === "STL_UPDATE") {
    if (typeof payload.pssScore === "number") user.pssScore = payload.pssScore;
    if (typeof payload.crbScore === "number") user.crbScore = payload.crbScore;
    if (typeof payload.dmoScore === "number") user.dmoScore = payload.dmoScore;
    if (typeof payload.lockAmount === "number") user.lockAmount = payload.lockAmount;
    await recalculateUserStl(user, { reason: "admin_approved_stl_update" });
  } else if (requestDoc.actionType === "FREEZE_USER") {
    user.wallet = user.wallet || { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false };
    user.wallet.frozen = Boolean(payload.freeze ?? true);
  } else if (requestDoc.actionType === "WALLET_ADJUST") {
    user.wallet = user.wallet || { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false };
    const amount = Number(payload.amount || 0);
    user.wallet.mainBalance = Number(user.wallet.mainBalance || 0) + amount;
  } else {
    throw new Error("Unsupported action type");
  }

  await user.save();
  const afterSnapshot = buildSnapshot(user);

  requestDoc.status = "approved";
  requestDoc.approvedBy = approverId;
  requestDoc.approvedAt = new Date();
  requestDoc.executedAt = new Date();
  requestDoc.beforeSnapshot = beforeSnapshot;
  requestDoc.afterSnapshot = afterSnapshot;
  await requestDoc.save();

  await logEvent({
    userId: requestDoc.targetUserId,
    event: "ADMIN_ACTION_APPROVED_EXECUTED",
    entity: "admin",
    meta: {
      actionRequestId: String(requestDoc._id),
      actionType: requestDoc.actionType,
      requestedBy: requestDoc.requestedBy,
      approvedBy: approverId,
      beforeSnapshot,
      afterSnapshot,
      reason: requestDoc.reason,
    },
  });

  return { requestDoc, beforeSnapshot, afterSnapshot };
}

export async function createAdminActionRequest({
  actionType,
  targetUserId,
  payload,
  reason,
  requestedBy,
  requestIp,
  userAgent,
}) {
  const user = await User.findOne({ userId: targetUserId });
  if (!user) throw new Error("Target user not found");

  ensureLimits({ actionType, payload, user });
  await checkAndEmitAnomaly({ requestedBy, actionType });

  const expiresAt = new Date(Date.now() + LIMITS.requestExpiresHours * 60 * 60 * 1000);
  const correlationId = crypto.randomUUID();
  const request = await AdminActionRequest.create({
    actionType,
    targetUserId,
    payload,
    reason,
    requestedBy,
    correlationId,
    requestIp,
    userAgent,
    expiresAt,
  });

  await logEvent({
    userId: targetUserId,
    event: "ADMIN_ACTION_REQUESTED",
    entity: "admin",
    meta: {
      actionRequestId: String(request._id),
      actionType,
      requestedBy,
      correlationId,
      reason,
    },
  });

  return request;
}

export async function approveAdminActionRequest({ requestId, approverId, approvalIp }) {
  const requestDoc = await AdminActionRequest.findById(requestId);
  if (!requestDoc) throw new Error("Action request not found");
  if (requestDoc.status !== "pending") throw new Error("Only pending request can be approved");
  if (requestDoc.expiresAt && requestDoc.expiresAt < new Date()) {
    requestDoc.status = "expired";
    await requestDoc.save();
    throw new Error("Action request expired");
  }
  if (requestDoc.requestedBy === approverId) {
    throw new Error("Requester cannot approve own action");
  }
  requestDoc.approvalIp = approvalIp;
  return executeApprovedAction(requestDoc, approverId);
}

export async function rejectAdminActionRequest({ requestId, rejectorId, rejectReason }) {
  const requestDoc = await AdminActionRequest.findById(requestId);
  if (!requestDoc) throw new Error("Action request not found");
  if (requestDoc.status !== "pending") throw new Error("Only pending request can be rejected");

  requestDoc.status = "rejected";
  requestDoc.rejectedBy = rejectorId;
  requestDoc.rejectReason = rejectReason || "rejected_by_admin";
  requestDoc.rejectedAt = new Date();
  await requestDoc.save();

  await logEvent({
    userId: requestDoc.targetUserId,
    event: "ADMIN_ACTION_REJECTED",
    entity: "admin",
    meta: {
      actionRequestId: String(requestDoc._id),
      actionType: requestDoc.actionType,
      requestedBy: requestDoc.requestedBy,
      rejectedBy: rejectorId,
      rejectReason: requestDoc.rejectReason,
    },
  });

  return requestDoc;
}

export async function rollbackAdminActionRequest({ requestId, rollbackBy, reason }) {
  const requestDoc = await AdminActionRequest.findById(requestId);
  if (!requestDoc) throw new Error("Action request not found");
  if (requestDoc.status !== "approved") throw new Error("Only approved action can be rolled back");

  const user = await User.findOne({ userId: requestDoc.targetUserId });
  if (!user) throw new Error("Target user not found");
  const before = requestDoc.beforeSnapshot;
  if (!before) throw new Error("Rollback snapshot missing");

  user.pssScore = Number(before.pssScore || user.pssScore || 0);
  user.crbScore = Number(before.crbScore || user.crbScore || 0);
  user.dmoScore = Number(before.dmoScore || user.dmoScore || 0);
  user.lockAmount = Number(before.lockAmount || user.lockAmount || 0);
  user.wallet = before.wallet || user.wallet;
  await recalculateUserStl(user, { reason: "admin_rollback_restore" });
  await user.save();

  requestDoc.status = "rolled_back";
  requestDoc.rolledBackBy = rollbackBy;
  requestDoc.rolledBackAt = new Date();
  requestDoc.rejectReason = reason || "rollback";
  await requestDoc.save();

  await logEvent({
    userId: requestDoc.targetUserId,
    event: "ADMIN_ACTION_ROLLED_BACK",
    entity: "admin",
    meta: {
      actionRequestId: String(requestDoc._id),
      actionType: requestDoc.actionType,
      rolledBackBy: rollbackBy,
      reason: reason || "rollback",
    },
  });

  return requestDoc;
}

export async function getPendingAdminActions() {
  return AdminActionRequest.find({ status: "pending" }).sort({ createdAt: -1 }).limit(200);
}

export async function getAdminActionTimeline({ page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AdminActionRequest.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    AdminActionRequest.countDocuments(),
  ]);
  return { items, total, page, limit };
}

export async function getAdminSecurityStats() {
  const windowStart = new Date(Date.now() - LIMITS.anomalyWindowMinutes * 60 * 1000);
  const [pendingCount, approvedToday, anomalyAlerts] = await Promise.all([
    AdminActionRequest.countDocuments({ status: "pending" }),
    AdminActionRequest.countDocuments({
      status: "approved",
      approvedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }),
    Log.countDocuments({
      event: "ADMIN_ANOMALY_ALERT",
      createdAt: { $gte: windowStart },
    }),
  ]);
  return { pendingCount, approvedToday, anomalyAlerts };
}
