import { prisma } from "@/lib/prisma";

const db = prisma as any;

type FraudSignalType =
  | "FAILED_VERIFICATION"
  | "RAPID_SUBMISSION"
  | "LOCATION_MISMATCH"
  | "INCOMPLETE_PROFILE"
  | "LOW_CRB_BADGE"
  | "MULTIPLE_ACCOUNTS"
  | "SUSPICIOUS_ACTIVITY"
  | "FAKE_REVIEW"
  | "COMPLAINT_RECEIVED";

type FraudEntityType = "USER" | "APPLICATION" | "ORDER" | "PROVIDER" | "SELLER" | "FRANCHISE";

// ---------------------------------------------------------------------------
// Risk Score Weights — matches Phase 11-12 plan
// ---------------------------------------------------------------------------
const SIGNAL_WEIGHTS: Record<FraudSignalType, number> = {
  FAILED_VERIFICATION:  30,
  RAPID_SUBMISSION:     25,
  LOCATION_MISMATCH:    20,
  INCOMPLETE_PROFILE:   15,
  LOW_CRB_BADGE:        10,
  MULTIPLE_ACCOUNTS:    35,
  SUSPICIOUS_ACTIVITY:  25,
  FAKE_REVIEW:          20,
  COMPLAINT_RECEIVED:   15,
};

export type RiskTier = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export function getRiskTier(score: number): RiskTier {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

export function getTierColor(tier: RiskTier) {
  const colors: Record<RiskTier, string> = {
    CRITICAL: "bg-red-600/20 text-red-300 border-red-500/40",
    HIGH:     "bg-orange-600/20 text-orange-300 border-orange-500/40",
    MEDIUM:   "bg-yellow-600/20 text-yellow-300 border-yellow-500/40",
    LOW:      "bg-green-600/20 text-green-300 border-green-500/40",
  };
  return colors[tier];
}

// ---------------------------------------------------------------------------
// Calculate risk score for an entity (0–100)
// ---------------------------------------------------------------------------
export async function calculateRiskScore(entityId: string): Promise<{
  score: number;
  tier: RiskTier;
  signals: { type: FraudSignalType; weight: number; count: number }[];
  autoBlock: boolean;
}> {
  const signals: Array<{ signalType: FraudSignalType; entityId: string; resolvedAt: Date | null; createdAt: Date }> =
    await db.fraudSignal.findMany({
    where: { entityId, resolvedAt: null },
    orderBy: { createdAt: "desc" },
  });

  // Group by signal type and count
  const grouped = signals.reduce<Record<string, { count: number; weight: number }>>((acc, s) => {
    if (!acc[s.signalType]) acc[s.signalType] = { count: 0, weight: SIGNAL_WEIGHTS[s.signalType] ?? 10 };
    acc[s.signalType].count += 1;
    return acc;
  }, {});

  // Score formula: sum(weight * count * diminishing_factor), capped at 100
  let rawScore = 0;
  const breakdown = Object.entries(grouped).map(([type, data]) => {
    // Diminishing returns after first signal
    const effectiveWeight = data.weight * (1 + (data.count - 1) * 0.3);
    rawScore += effectiveWeight;
    return {
      type: type as FraudSignalType,
      weight: data.weight,
      count: data.count,
    };
  });

  const score = Math.min(100, Math.round(rawScore));
  const tier = getRiskTier(score);

  return {
    score,
    tier,
    signals: breakdown,
    autoBlock: score >= 80,
  };
}

// ---------------------------------------------------------------------------
// Write a fraud signal
// ---------------------------------------------------------------------------
export async function writeFraudSignal(args: {
  entityId: string;
  entityType: FraudEntityType;
  signalType: FraudSignalType;
  weight?: number;
  metadata?: Record<string, unknown>;
}) {
  return db.fraudSignal.create({
    data: {
      entityId:   args.entityId,
      entityType: args.entityType,
      signalType: args.signalType,
      weight:     args.weight ?? SIGNAL_WEIGHTS[args.signalType] ?? 1,
      metadata:   args.metadata ?? undefined,
    },
  });
}

// ---------------------------------------------------------------------------
// Get all unresolved signals for the DMO fraud queue
// ---------------------------------------------------------------------------
export async function getFraudQueue(options?: { limit?: number; tier?: RiskTier }) {
  const signals: Array<{
    entityId: string;
    entityType: FraudEntityType;
    signalType: FraudSignalType;
    resolvedAt: Date | null;
    createdAt: Date;
  }> = await db.fraudSignal.findMany({
    where: { resolvedAt: null },
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 100,
  });

  // Group by entityId
  const entityMap = new Map<string, { entityId: string; entityType: string; signals: typeof signals }>();
  for (const s of signals) {
    if (!entityMap.has(s.entityId)) {
      entityMap.set(s.entityId, { entityId: s.entityId, entityType: s.entityType, signals: [] });
    }
    entityMap.get(s.entityId)!.signals.push(s);
  }

  // Score each entity
  const results = await Promise.all(
    Array.from(entityMap.values()).map(async (e) => {
      const risk = await calculateRiskScore(e.entityId);
      return { ...e, ...risk };
    })
  );

  // Filter by tier if requested
  const filtered = options?.tier
    ? results.filter((r) => r.tier === options.tier)
    : results;

  // Sort by score descending
  return filtered.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Resolve (dismiss) all signals for an entity
// ---------------------------------------------------------------------------
export async function resolveEntitySignals(entityId: string) {
  return db.fraudSignal.updateMany({
    where: { entityId, resolvedAt: null },
    data: { resolvedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Apply a penalty
// ---------------------------------------------------------------------------
export async function applyPenalty(args: {
  entityId: string;
  entityType: FraudEntityType;
  ruleId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "WARNING";
  action: "ACCOUNT_SUSPENDED" | "LISTING_HIDDEN" | "CRB_SCORE_DEDUCTION" | "WARNING_NOTIFICATION" | "FUNDS_FROZEN" | "FIRST_TIME_GRACE";
  reason: string;
  confidence?: number;
  autoApplied?: boolean;
}) {
  return db.penaltyLog.create({
    data: {
      entityId:    args.entityId,
      entityType:  args.entityType,
      ruleId:      args.ruleId,
      severity:    args.severity,
      action:      args.action,
      reason:      args.reason,
      confidence:  args.confidence,
      autoApplied: args.autoApplied ?? true,
    },
  });
}
