import type { STLEntityType } from "@prisma/client";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/fraud/riskEngine";
import { levelForScore } from "@/lib/stl/engine";

async function resolveStlForEntity(params: {
  trustScore: number;
  entityId: string;
  stlEntityType: STLEntityType;
}) {
  const row = await prisma.sTLScore
    .findUnique({
      where: {
        entityType_entityId: { entityType: params.stlEntityType, entityId: params.entityId },
      },
    })
    .catch(() => null);
  if (row) {
    const s = Number(row.score);
    const lv = levelForScore(s);
    return { score: s, level: row.level, label: lv.label, source: "db" as const };
  }
  const lv = levelForScore(params.trustScore);
  return {
    score: params.trustScore,
    level: lv.level,
    label: lv.label,
    source: "synthetic" as const,
  };
}

// Trust score tiers
function getTrustBadge(score: number): { badge: string; level: string; color: string } {
  if (score >= 85) return { badge: "🥇", level: "Platinum", color: "text-purple-300" };
  if (score >= 70) return { badge: "🥇", level: "Gold",     color: "text-yellow-300" };
  if (score >= 50) return { badge: "🥈", level: "Silver",   color: "text-ehb-textBody"  };
  return             { badge: "🥉", level: "Bronze",   color: "text-orange-400" };
}

// GET /api/gosellr/trust?productId=xxx  OR  ?sellerId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const sellerId  = searchParams.get("sellerId");

    if (!productId && !sellerId) {
      return fail(400, "VALIDATION", "productId or sellerId required");
    }

    const entityId   = (productId ?? sellerId)!;
    const entityType = productId ? "product" : "seller";

    // Get fraud risk (lower risk = higher trust)
    const risk         = await calculateRiskScore(entityId);
    const fraudPenalty = Math.round(risk.score * 0.4); // fraud reduces trust

    // Get reviews if seller
    let reviewScore = 70;
    if (sellerId) {
      const agg = await prisma.product.aggregate({
        where: { sellerId },
        _avg: { rating: true },
      }).catch(() => null);
      if (agg?._avg?.rating) reviewScore = Math.round(agg._avg.rating * 20);
    }

    // Composite trust score
    const trustScore = Math.max(0, Math.min(100,
      Math.round(reviewScore * 0.5 + (100 - risk.score) * 0.3 + 20)
      - fraudPenalty
    ));

    const badge = getTrustBadge(trustScore);
    const flaggedForReview = trustScore < 30;

    const stlEntityType: STLEntityType = productId ? "PRODUCT" : "USER";
    const stl = await resolveStlForEntity({
      trustScore,
      entityId,
      stlEntityType,
    });

    return ok({
      entityId,
      entityType,
      trustScore,
      badge,
      stl,
      fraudRisk:       { score: risk.score, tier: risk.tier },
      flaggedForReview,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
