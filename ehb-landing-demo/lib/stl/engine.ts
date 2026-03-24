import { prisma } from "@/lib/prisma";
import type { STLEntityType } from "@prisma/client";

export type StlBreakdown = {
  pss: number; // 0..40
  crb: number; // 0..20 (v1=0 until CRB exists)
  performance: number; // 0..20 (v1 minimal)
  behavior: number; // -50..20 (v1 includes franchise inspection signals)
  industries: number; // 0..20 (multi-industry verification boost)
  refilling: number; // -40..10
  total: number; // 0..100
  level: number; // 1..5
  label: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function levelForScore(score: number) {
  if (score >= 90) return { level: 5, label: "Elite Verified" };
  if (score >= 75) return { level: 4, label: "Highly Trusted" };
  if (score >= 60) return { level: 3, label: "Trusted" };
  if (score >= 40) return { level: 2, label: "Basic Verified" };
  return { level: 1, label: "Low Trust" };
}

function pssScoreFromPhase(phaseCompleted: number) {
  // Map 0..6 → 0..40
  const phase = clamp(Math.floor(phaseCompleted), 0, 6);
  // Phase weighting consistent with your design: foundation is phase 1..2..3.
  if (phase <= 0) return 0;
  if (phase === 1) return 30; // identity+device
  if (phase === 2) return 40; // identity + AML
  if (phase >= 3) return 40; // cap at 40 for PSS component
  return 0;
}

function refillingScoreFromStlStatus(stlStatus: string | null | undefined) {
  // Refilling component is 10% weight, but you also want heavy drops when expired/failed.
  // We model it as a direct component contribution:
  // ACTIVE: +10, WARNING: +5, LIMITED(grace): -10, SUSPENDED(expired): -40, DOWNGRADED(failed): -20
  if (stlStatus === "ACTIVE") return 10;
  if (stlStatus === "WARNING") return 5;
  if (stlStatus === "LIMITED") return -10;
  if (stlStatus === "DOWNGRADED") return -20;
  if (stlStatus === "SUSPENDED") return -40;
  return 0;
}

async function performanceScoreForUser(userId: string) {
  // Use ONLY real data we already have in schema (orders, jobs, providerServices).
  // v1 heuristic:
  // - Completed Orders as Seller → up to 12 points
  // - Completed Orders as Buyer (signals engagement) → up to 4 points
  // - ProviderServices count (supply readiness) → up to 4 points
  // Total cap: 20
  const [sellerCompleted, buyerCompleted, providerServices] = await Promise.all([
    prisma.order.count({ where: { sellerId: userId, status: "DELIVERED" } }),
    prisma.order.count({ where: { buyerId: userId, status: "DELIVERED" } }),
    prisma.providerService.count({ where: { userId, isActive: true } }),
  ]);

  const sellerPts = clamp(sellerCompleted * 2, 0, 12);
  const buyerPts = clamp(buyerCompleted * 1, 0, 4);
  const servicePts = clamp(providerServices * 2, 0, 4);

  return clamp(sellerPts + buyerPts + servicePts, 0, 20);
}

async function crbScoreForUser(userId: string) {
  // CRB component: 0..20
  // v1 real rule:
  // - Each active certificate contributes 10 points
  // - If its inspection score >= 90, add +5 bonus (per cert)
  // - Cap at 20
  const now = new Date();
  const certs = await prisma.cRBCertificate.findMany({
    where: { entityId: userId, status: "ACTIVE", expiryDate: { gt: now } },
    select: {
      id: true,
      applicationId: true,
      application: { select: { inspection: { select: { score: true } } } },
    },
    take: 10,
  });

  let points = 0;
  for (const c of certs) {
    points += 10;
    const score = c.application?.inspection?.score ? Number(c.application.inspection.score) : null;
    if (score !== null && score >= 90) points += 5;
  }
  return clamp(points, 0, 20);
}

async function franchiseBehaviorForUser(userId: string) {
  // Physical inspection signal (v1):
  // - Latest inspection report on any CRB application for this user.
  // - Fraud suspected: -50
  // - score < 50: -30
  // - 50..79: -10
  // - 80..89: +10
  // - >= 90: +20
  const latest = await prisma.inspectionReport.findFirst({
    where: { task: { crbApplication: { applicantId: userId } } },
    orderBy: { createdAt: "desc" },
    select: { score: true, fraudSuspected: true },
  });
  if (!latest) return 0;
  if (latest.fraudSuspected) return -50;
  const score = Number(latest.score);
  if (score < 50) return -30;
  if (score < 80) return -10;
  if (score < 90) return 10;
  return 20;
}

async function industryBoostForUser(userId: string) {
  // v1: Sum verified industry scores (weighted), cap at 20.
  // Verified industry contributes: (score/100) * 10 * weight
  // So two strong verified industries can reach the cap.
  const now = new Date();
  const ver = await prisma.industryVerification.findMany({
    where: {
      entityType: "COMPANY",
      entityId: userId,
      status: "VERIFIED",
      OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
    },
    select: { score: true, weight: true },
    take: 32,
  });
  let pts = 0;
  for (const v of ver) {
    const score = v.score ? Number(v.score) : 60;
    const weight = Number(v.weight);
    pts += (score / 100) * 10 * weight;
  }
  return clamp(pts, 0, 20);
}

export async function computeUserStl(userId: string): Promise<StlBreakdown> {
  const [profile, verification] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: { stlStatus: true },
    }),
    prisma.pSSVerification.findUnique({
      where: { userId },
      select: { phaseCompleted: true },
    }),
  ]);

  const pss = pssScoreFromPhase(verification?.phaseCompleted ?? 0);
  const crb = await crbScoreForUser(userId);
  const performance = await performanceScoreForUser(userId);
  const behavior = await franchiseBehaviorForUser(userId);
  const industries = await industryBoostForUser(userId);
  const refilling = refillingScoreFromStlStatus(profile?.stlStatus ?? null);

  const total = clamp(pss + crb + performance + behavior + industries + refilling, 0, 100);
  const lvl = levelForScore(total);

  return {
    pss,
    crb,
    performance,
    behavior,
    industries,
    refilling,
    total,
    level: lvl.level,
    label: lvl.label,
  };
}

export async function upsertStlScore(args: {
  entityId: string;
  entityType: STLEntityType;
  breakdown: StlBreakdown;
  reason: string;
  actorId?: string | null;
}) {
  const existing = await prisma.sTLScore.findUnique({
    where: { entityType_entityId: { entityType: args.entityType, entityId: args.entityId } },
    select: { score: true },
  });

  const nextScore = args.breakdown.total;
  const prevScore = existing ? Number(existing.score) : 0;
  const change = nextScore - prevScore;

  const scoreRow = await prisma.sTLScore.upsert({
    where: { entityType_entityId: { entityType: args.entityType, entityId: args.entityId } },
    update: {
      score: nextScore,
      level: args.breakdown.level,
      breakdown: args.breakdown as any,
    },
    create: {
      entityId: args.entityId,
      entityType: args.entityType,
      score: nextScore,
      level: args.breakdown.level,
      breakdown: args.breakdown as any,
    },
  });

  await prisma.sTLLog.create({
    data: {
      entityId: args.entityId,
      entityType: args.entityType,
      change,
      reason: args.reason,
      metadata: {
        actorId: args.actorId ?? null,
        prevScore,
        nextScore,
        breakdown: args.breakdown,
      },
    },
  });

  return { scoreRow, change, prevScore, nextScore };
}

export async function recalcUserStl(args: { userId: string; reason: string; actorId?: string | null }) {
  const breakdown = await computeUserStl(args.userId);
  return await upsertStlScore({
    entityId: args.userId,
    entityType: "USER",
    breakdown,
    reason: args.reason,
    actorId: args.actorId ?? null,
  });
}

