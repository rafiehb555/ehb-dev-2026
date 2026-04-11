import User from "../models/User.js";
import { calculateDistribution, calculateEarning, canEarn } from "../services/earningService.js";
import { logEvent } from "../services/logService.js";
import { notifyUser } from "../services/notificationService.js";

function sameOwnerOrAdmin(req, userId) {
  return req.auth?.role === "admin" || req.auth?.userId === userId;
}

export const getEarnings = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!sameOwnerOrAdmin(req, user.userId)) return res.status(403).json({ msg: "Forbidden" });

    return res.json({
      userId: user.userId,
      stlLevel: user.stlLevel || "L1",
      earnings: user.earnings || { today: 0, monthly: 0, total: 0 },
      wallet: user.wallet || { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false },
      nextUnlock: "Reach next STL level for higher commission",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Earnings fetch error", error: error.message });
  }
};

export const addEarning = async (req, res) => {
  try {
    const { userId, amount, reason = "transaction_commission" } = req.body || {};
    if (!userId) return res.status(400).json({ msg: "userId is required" });

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!sameOwnerOrAdmin(req, user.userId)) return res.status(403).json({ msg: "Forbidden" });

    user.wallet = user.wallet || { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false };
    if (user.wallet.frozen) return res.status(423).json({ msg: "Wallet frozen due to risk/fraud" });

    const earningAllowed = canEarn(user.stlLevel || "L1");
    if (!earningAllowed.allowed) return res.status(403).json({ msg: earningAllowed.reason });

    if ((user.modules?.pss?.complaints || 0) >= 5 || user.aiInsight?.risk === "high") {
      user.wallet.frozen = true;
      await user.save();
      await logEvent({ userId: user.userId, event: "WALLET_FROZEN", entity: "earning", meta: { reason: "fraud_risk" } });
      return res.status(423).json({ msg: "Wallet frozen due to risk/fraud" });
    }

    const earning = calculateEarning(user.stlLevel || "L1", amount);
    const distribution = calculateDistribution(earning.orderAmount);

    user.earnings = user.earnings || { today: 0, monthly: 0, total: 0 };
    user.earnings.today = Number(user.earnings.today || 0) + earning.commissionAmount;
    user.earnings.monthly = Number(user.earnings.monthly || 0) + earning.commissionAmount;
    user.earnings.total = Number(user.earnings.total || 0) + earning.commissionAmount;
    user.wallet.earningBalance = Number(user.wallet.earningBalance || 0) + earning.commissionAmount;
    user.wallet.mainBalance = Number(user.wallet.mainBalance || 0) + earning.commissionAmount;
    user.wallet.lockWallet = Number(user.lockAmount || user.wallet.lockWallet || 0);

    user.earningsLogs = user.earningsLogs || [];
    user.earningsLogs.push({
      orderAmount: earning.orderAmount,
      userLevel: earning.userLevel,
      commissionPercent: earning.commissionPercent,
      commissionAmount: earning.commissionAmount,
      distribution,
      reason,
    });

    await user.save();

    await logEvent({
      userId: user.userId,
      event: "EARNING_ADDED",
      entity: "earning",
      meta: { commissionAmount: earning.commissionAmount, commissionPercent: earning.commissionPercent, reason },
    });
    await notifyUser({
      userId: user.userId,
      type: "EARNING_UPDATE",
      title: "Earning added",
      message: `You earned ${earning.commissionAmount.toFixed(2)} (${earning.commissionPercent}%).`,
    });

    return res.json({
      message: "Earning added",
      stlLevel: user.stlLevel,
      earning,
      distribution,
      wallet: user.wallet,
      earnings: user.earnings,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Earning add error", error: error.message });
  }
};

