import User from "../models/User.js";
import { recalculateUserStl } from "../services/stlService.js";
import { logEvent } from "../services/logService.js";
import { notifyUser } from "../services/notificationService.js";

function computeRiskBand(pss) {
  let risk = 90;
  if (pss.idVerified) risk -= 20;
  if (pss.addressVerified) risk -= 15;
  if (pss.amlChecked) risk -= 15;
  if (pss.livenessPassed) risk -= 15;
  if (pss.kycVerified) risk -= 10;
  risk += (pss.complaints || 0) * 15;
  risk += (pss.verificationPending || 0) * 10;
  if (risk <= 30) return "low";
  if (risk <= 60) return "medium";
  return "high";
}

export const getPss = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json({ userId: user.userId, pss: user.modules?.pss, riskLevel: computeRiskBand(user.modules?.pss || {}) });
  } catch (error) {
    return res.status(500).json({ msg: "PSS fetch error", error: error.message });
  }
};

export const updatePssVerification = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const { kycVerified, complaints, verificationPending, idVerified, addressVerified, amlChecked, livenessPassed } = req.body || {};
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (typeof kycVerified === "boolean") user.modules.pss.kycVerified = kycVerified;
    if (typeof idVerified === "boolean") user.modules.pss.idVerified = idVerified;
    if (typeof addressVerified === "boolean") user.modules.pss.addressVerified = addressVerified;
    if (typeof amlChecked === "boolean") user.modules.pss.amlChecked = amlChecked;
    if (typeof livenessPassed === "boolean") user.modules.pss.livenessPassed = livenessPassed;
    if (typeof complaints === "number") user.modules.pss.complaints = complaints;
    if (typeof verificationPending === "number") user.modules.pss.verificationPending = verificationPending;

    const trustScore = Math.max(
      0,
      Math.min(
        100,
        20 +
          (user.modules.pss.idVerified ? 20 : 0) +
          (user.modules.pss.addressVerified ? 15 : 0) +
          (user.modules.pss.amlChecked ? 15 : 0) +
          (user.modules.pss.livenessPassed ? 15 : 0) +
          (user.modules.pss.kycVerified ? 15 : 0) -
          (user.modules.pss.complaints || 0) * 8 -
          (user.modules.pss.verificationPending || 0) * 5,
      ),
    );
    user.modules.pss.trustScore = trustScore;
    user.modules.pss.score = trustScore;

    const stl = await recalculateUserStl(user, { reason: "pss_update" });
    await user.save();
    await logEvent({ userId: user.userId, event: "PSS_UPDATED", entity: "pss", meta: { riskLevel: computeRiskBand(user.modules.pss) } });
    await notifyUser({
      userId: user.userId,
      type: "VERIFICATION_UPDATE",
      title: "PSS updated",
      message: `Verification updated. Risk level: ${computeRiskBand(user.modules.pss)}.`,
    });
    await logEvent({
      userId: user.userId,
      event: "STL_UPDATED",
      entity: "stl",
      meta: { stlScore: user.stlScore, stlLevel: user.stlLevel, source: "pss_update" },
    });

    return res.json({ message: "PSS updated", pss: user.modules.pss, riskLevel: computeRiskBand(user.modules.pss), stl });
  } catch (error) {
    return res.status(500).json({ msg: "PSS update error", error: error.message });
  }
};

export const getPssRisk = async (req, res) => {
  try {
    if (req.auth?.role !== "admin" && req.auth?.userId !== req.params.userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const riskLevel = computeRiskBand(user.modules?.pss || {});
    return res.json({ userId: user.userId, riskLevel });
  } catch (error) {
    return res.status(500).json({ msg: "PSS risk error", error: error.message });
  }
};

