const COMMISSION_MAP = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 5,
  6: 7,
  7: 10,
  8: 15,
};

function levelToNumber(level) {
  if (typeof level === "number") return level;
  const parsed = Number(String(level || "L1").replace("L", ""));
  return Number.isFinite(parsed) ? Math.max(1, Math.min(8, parsed)) : 1;
}

export function getCommissionPercent(stlLevel) {
  const level = levelToNumber(stlLevel);
  return COMMISSION_MAP[level] ?? 0;
}

export function calculateEarning(stlLevel, amount) {
  const commissionPercent = getCommissionPercent(stlLevel);
  const orderAmount = Math.max(0, Number(amount || 0));
  const commissionAmount = (orderAmount * commissionPercent) / 100;
  return { userLevel: levelToNumber(stlLevel), commissionPercent, commissionAmount, orderAmount };
}

export function calculateDistribution(orderAmount) {
  const amount = Math.max(0, Number(orderAmount || 0));
  return {
    platform: amount * 0.05,
    seller: amount * 0.8,
    franchise: amount * 0.1,
    referral: amount * 0.05,
  };
}

export function canEarn(stlLevel) {
  const level = levelToNumber(stlLevel);
  if (level <= 1) return { allowed: false, reason: "L1 users cannot earn" };
  if (level === 2) return { allowed: true, reason: "Limited earning" };
  return { allowed: true, reason: "Earning enabled" };
}

