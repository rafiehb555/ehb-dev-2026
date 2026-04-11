import { getLevelFromScore, getLockLevel } from "../utils/level.utils.js";
import { analyzeUser } from "./ai.service.js";

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value || 0)));
}

function deriveFlatScores(user) {
  const pssScore = clampScore(user.pssScore ?? user.modules?.pss?.score);
  const crbScore = clampScore(user.crbScore ?? user.modules?.crb?.score);
  const dmoScore = clampScore(user.dmoScore ?? user.modules?.dmo?.score);
  const lockAmount = Math.max(0, Number(user.lockAmount || 0));
  return { pssScore, crbScore, dmoScore, lockAmount };
}

export function calculateSTL(user) {
  const { pssScore, crbScore, dmoScore, lockAmount } = deriveFlatScores(user);
  const avgScore = (pssScore + crbScore + dmoScore) / 3;

  const scoreLevel = getLevelFromScore(avgScore);
  const lockLevel = getLockLevel(lockAmount);
  const pssLevel = getLevelFromScore(pssScore);
  const crbLevel = getLevelFromScore(crbScore);
  const dmoLevel = getLevelFromScore(dmoScore);

  const finalLevel = Math.min(scoreLevel, lockLevel, pssLevel, crbLevel, dmoLevel);
  const finalScore = Math.round((finalLevel / 8) * 100);
  return finalScore;
}

export function explainSTL(user) {
  const reasons = [];

  if (!user.modules?.pss?.kycVerified) reasons.push("KYC not verified");
  if ((user.modules?.crb?.examsFailed || 0) > 0) reasons.push("Some exams failed");
  if ((user.modules?.pss?.verificationPending || 0) > 0) reasons.push("Pending verifications");
  if (user.modules?.dmo?.activityLevel === "low") reasons.push("Low activity");

  return reasons;
}

export function getLevel(score) {
  return `L${getLevelFromScore(score)}`;
}

function getPssLevel(pss = {}) {
  if (!pss.kycVerified) return { level: "L1", name: "Unverified" };
  if ((pss.complaints || 0) > 0) return { level: "L4", name: "Trusted" };
  return { level: "L5", name: "Premium" };
}

function getCrbLevel(crb = {}) {
  const passes = crb.examsPassed || 0;
  if (passes >= 3 && (crb.examsFailed || 0) === 0) return { level: "L5", name: "Expert" };
  if (passes >= 2) return { level: "L3", name: "Skilled" };
  if (passes >= 1) return { level: "L2", name: "Basic" };
  return { level: "L1", name: "Beginner" };
}

function getDmoLevel(dmo = {}) {
  if (dmo.activityLevel === "high") return { level: "L5", name: "Elite" };
  if (dmo.activityLevel === "medium") return { level: "L3", name: "Engaged" };
  if (dmo.activityLevel === "low") return { level: "L2", name: "Active" };
  return { level: "L1", name: "Idle" };
}

export function getStlBreakdown(user) {
  const { pssScore, crbScore, dmoScore, lockAmount } = deriveFlatScores(user);
  const franchiseScore = clampScore(user.modules?.franchise?.score);

  const modules = {
    pss: { score: pssScore, ...getPssLevel(user.modules?.pss) },
    crb: { score: crbScore, ...getCrbLevel(user.modules?.crb) },
    dmo: { score: dmoScore, ...getDmoLevel(user.modules?.dmo) },
    franchise: { score: franchiseScore },
    lock: { amount: lockAmount, level: `L${getLockLevel(lockAmount)}` },
  };

  const weakArea = ["pss", "crb", "dmo"].reduce((a, b) => (modules[a].score <= modules[b].score ? a : b));
  return { modules, weakArea: weakArea.toUpperCase() };
}

function shouldRunAi(reason) {
  return ["pss_update", "crb_update", "dmo_update", "suspicious_activity"].includes(reason);
}

export async function recalculateUserStl(user, options = {}) {
  const reason = options.reason || "module_update";
  const previous = Number(user.stlScore || 0);
  const { pssScore, crbScore, dmoScore } = deriveFlatScores(user);
  user.pssScore = pssScore;
  user.crbScore = crbScore;
  user.dmoScore = dmoScore;

  let ai = null;
  let aiAdjustedPss = pssScore;
  if (shouldRunAi(reason)) {
    ai = await analyzeUser({
      pss: pssScore,
      crb: crbScore,
      dmo: dmoScore,
      lock: Number(user.lockAmount || 0),
    });
    aiAdjustedPss = clampScore(pssScore + Number(ai?.trustAdjustment || 0));
  }

  const calcUser = { ...user.toObject?.(), ...user, pssScore: aiAdjustedPss };
  const stlScore = calculateSTL(calcUser);
  const stlLevel = getLevel(stlScore);
  const reasons = explainSTL(calcUser);
  const breakdown = getStlBreakdown(calcUser);

  user.stlScore = stlScore;
  user.stlLevel = stlLevel;
  user.stlLogs = user.stlLogs || [];
  user.stlLogs.push({
    action: "STL_RECALCULATE_AI",
    before: previous,
    after: stlScore,
    reason: reasons.length ? reasons.join(", ") : reason,
  });
  if (ai) {
    user.aiInsight = {
      risk: ai.risk,
      trustAdjustment: ai.trustAdjustment,
      reason: ai.reason,
      updatedAt: new Date(),
    };
  }

  return { stlScore, stlLevel, reasons, breakdown, ai };
}

