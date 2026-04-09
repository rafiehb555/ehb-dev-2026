export function calculateSTL(user) {
  const pss = user.modules?.pss?.score || 0;
  const crb = user.modules?.crb?.score || 0;
  const dmo = user.modules?.dmo?.score || 0;
  const franchise = user.modules?.franchise?.score || 0;

  const activityBonus = user.modules?.dmo?.activityLevel === "high" ? 10 : 5;
  const trustBonus = user.modules?.pss?.kycVerified ? 10 : 0;

  const score =
    pss * 0.25 +
    crb * 0.25 +
    dmo * 0.2 +
    franchise * 0.15 +
    activityBonus * 0.1 +
    trustBonus * 0.05;

  return Math.round(score);
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
  if (score >= 85) return "L5";
  if (score >= 70) return "L4";
  if (score >= 50) return "L3";
  if (score >= 30) return "L2";
  return "L1";
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value || 0)));
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
  const pssScore = clampScore(user.modules?.pss?.score);
  const crbScore = clampScore(user.modules?.crb?.score);
  const dmoScore = clampScore(user.modules?.dmo?.score);
  const franchiseScore = clampScore(user.modules?.franchise?.score);

  const modules = {
    pss: { score: pssScore, ...getPssLevel(user.modules?.pss) },
    crb: { score: crbScore, ...getCrbLevel(user.modules?.crb) },
    dmo: { score: dmoScore, ...getDmoLevel(user.modules?.dmo) },
    franchise: { score: franchiseScore },
  };

  const weakArea = ["pss", "crb", "dmo"].reduce((a, b) => (modules[a].score <= modules[b].score ? a : b));
  return { modules, weakArea: weakArea.toUpperCase() };
}

export function recalculateUserStl(user) {
  const stlScore = calculateSTL(user);
  const stlLevel = getLevel(stlScore);
  const reasons = explainSTL(user);
  const breakdown = getStlBreakdown(user);

  user.stlScore = stlScore;
  user.stlLevel = stlLevel;

  return { stlScore, stlLevel, reasons, breakdown };
}

