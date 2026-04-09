import { getLevelFromScore } from "../utils/level.utils.js";

function toNumericLevel(level) {
  if (typeof level === "number") return level;
  const str = String(level || "L1").toUpperCase();
  const num = Number(str.replace("L", ""));
  return Number.isFinite(num) && num > 0 ? num : 1;
}

function toLabel(level) {
  return `L${level}`;
}

export function calculateSellerSTL(userLevel, sellerScore) {
  const userLvl = toNumericLevel(userLevel);
  const sellerLvl = getLevelFromScore(sellerScore);
  const finalLevel = Math.min(userLvl, sellerLvl);
  return {
    level: finalLevel,
    label: toLabel(finalLevel),
    breakdown: {
      userLevel: toLabel(userLvl),
      sellerLevel: toLabel(sellerLvl),
    },
  };
}

export function calculateProductSTL(sellerLevel, qualityScore) {
  const sellerLvl = toNumericLevel(sellerLevel);
  const productLvl = getLevelFromScore(qualityScore);
  const finalLevel = Math.min(sellerLvl, productLvl);
  return {
    level: finalLevel,
    label: toLabel(finalLevel),
    breakdown: {
      sellerLevel: toLabel(sellerLvl),
      productLevel: toLabel(productLvl),
    },
  };
}

export function calculateFranchiseSTL(performanceScore) {
  const franchiseLvl = getLevelFromScore(performanceScore);
  return {
    level: franchiseLvl,
    label: toLabel(franchiseLvl),
    breakdown: {
      performanceLevel: toLabel(franchiseLvl),
    },
  };
}

