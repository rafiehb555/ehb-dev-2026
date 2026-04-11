import { prisma } from "@/lib/prisma";
import type { STLEntityType } from "@prisma/client";
import { syncLowTrustUserSignal } from "@/lib/fraud/orchestration";
import { getLevelMetaForScore, getProgressToNextLevel } from "@/lib/stl/levels";

export type StlBreakdown = {
  pss: number; // weighted 30%
  crb: number; // weighted 30%
  performance: number; // weighted 20% (DMO)
  behavior: number; // penalty component (complaints/risk)
  industries: number; // weighted 10% (franchise)
  refilling: number; // reserved/compat
  total: number; // 0..100
  level: number; // 1..8
  label: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function average(nums: number[]) {
  if (nums.length === 0) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function isMongoObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

export function levelForScore(score: number, supremeApproved = false) {
  const meta = getLevelMetaForScore(score, supremeApproved);
  return { level: meta.level, label: meta.name };
}

/** Prefer DB level when set; if score exists but level is missing (legacy rows), derive from score. */
export function resolveStlLevelFromScoreAndDb(
  score: number | null | undefined,
  level: number | null | undefined
): number | null {
  if (score == null || !Number.isFinite(Number(score))) return null;
  const s = Number(score);
  if (level != null && Number.isFinite(level) && level >= 1 && level <= 8) return Math.floor(level);
  return levelForScore(s).level;
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

async function reviewStatsForEntity(targetId: string) {
  const logs = await prisma.auditLog.findMany({
    where: { action: "MARKETPLACE_REVIEW_CREATED", targetId },
    select: { metadata: true },
    take: 5000,
    orderBy: { createdAt: "desc" },
  });

  const ratings = logs
    .map((entry) => {
      const metadata = (entry.metadata ?? {}) as Record<string, unknown>;
      return typeof metadata.rating === "number" ? metadata.rating : null;
    })
    .filter((value): value is number => value !== null);

  return {
    count: ratings.length,
    average: average(ratings),
  };
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

async function crbScoreForEntity(entityId: string, entityType: "SERVICE" | "PRODUCT") {
  const now = new Date();
  const certs = await prisma.cRBCertificate.findMany({
    where: { entityId, type: entityType, status: "ACTIVE", expiryDate: { gt: now } },
    select: {
      id: true,
      application: { select: { inspection: { select: { score: true } } } },
    },
    take: 10,
  });

  let points = 0;
  for (const cert of certs) {
    points += 10;
    const score = cert.application?.inspection?.score ? Number(cert.application.inspection.score) : null;
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

async function ownerTrustSnapshot(userId: string) {
  if (!isMongoObjectId(userId)) {
    return {
      pss: 30,
      behavior: 4,
      refilling: 5,
    };
  }

  const [profile, verification, behavior] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: { stlStatus: true },
    }),
    prisma.pSSVerification.findUnique({
      where: { userId },
      select: { phaseCompleted: true },
    }),
    franchiseBehaviorForUser(userId),
  ]);

  return {
    pss: pssScoreFromPhase(verification?.phaseCompleted ?? 0),
    behavior,
    refilling: refillingScoreFromStlStatus(profile?.stlStatus ?? null),
  };
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

async function industryBoostForEntity(entityType: "SERVICE" | "PRODUCT", entityId: string) {
  const now = new Date();
  const verifications = await prisma.industryVerification.findMany({
    where: {
      entityType,
      entityId,
      status: "VERIFIED",
      OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
    },
    select: { score: true, weight: true },
    take: 32,
  });

  let points = 0;
  for (const verification of verifications) {
    const score = verification.score ? Number(verification.score) : 60;
    const weight = Number(verification.weight);
    points += (score / 100) * 10 * weight;
  }

  return clamp(points, 0, 20);
}

async function refillingScoreForEntity(entityType: "SERVICE" | "PRODUCT", entityId: string, ownerStatus?: string | null) {
  const verifications = await prisma.industryVerification.findMany({
    where: { entityType, entityId },
    select: {
      status: true,
      expiryDate: true,
      refills: {
        select: { status: true, dueDate: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    take: 32,
  });

  if (verifications.length === 0) return refillingScoreFromStlStatus(ownerStatus);

  const now = Date.now();
  let score = 0;
  for (const verification of verifications) {
    const latestRefill = verification.refills[0];
    if (latestRefill?.status === "EXPIRED") {
      score = Math.min(score, -40);
      continue;
    }
    if (verification.status === "REJECTED" || verification.status === "EXPIRED") {
      score = Math.min(score, -20);
      continue;
    }
    if (latestRefill?.status === "PENDING" && latestRefill.dueDate.getTime() - now <= 1000 * 60 * 60 * 24 * 7) {
      score = Math.max(score, 5);
      continue;
    }
    if (verification.status === "VERIFIED") {
      score = Math.max(score, 10);
    }
  }

  return clamp(score, -40, 10);
}

async function isSupremeApprovedForUser(
  userId: string,
  profileApproval: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | null | undefined
): Promise<boolean> {
  if (!isMongoObjectId(userId)) return false;
  if (profileApproval === "APPROVED") return true;
  const rec = await prisma.registryRecord.findFirst({
    where: {
      entityType: "USER",
      entityId: userId,
      verificationSource: "MANUAL",
      status: "VERIFIED",
    },
    select: { id: true },
  });
  return Boolean(rec);
}

/** After score write: eligible for L8 → mark PENDING; score dropped → clear PENDING (not REJECTED/APPROVED). */
export async function syncSupremeApprovalState(userId: string) {
  if (!isMongoObjectId(userId)) return;
  const [profile, scoreRow] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: { stlSupremeApproval: true },
    }),
    prisma.sTLScore.findUnique({
      where: { entityType_entityId: { entityType: "USER", entityId: userId } },
      select: { score: true },
    }),
  ]);
  if (!profile || !scoreRow) return;
  const score = Number(scoreRow.score);
  const a = profile.stlSupremeApproval;
  if (a === "APPROVED") return;
  if (a === "REJECTED") return;

  if (score >= 96 && a === "NONE") {
    await prisma.profile.update({
      where: { userId },
      data: { stlSupremeApproval: "PENDING" },
    });
    return;
  }
  if (score < 96 && a === "PENDING") {
    await prisma.profile.update({
      where: { userId },
      data: { stlSupremeApproval: "NONE" },
    });
  }
}

function buildBreakdown(parts: Omit<StlBreakdown, "total" | "level" | "label">, supremeApproved = false): StlBreakdown {
  const total = clamp(parts.pss + parts.crb + parts.performance + parts.behavior + parts.industries + parts.refilling, 0, 100);
  const lvl = levelForScore(total, supremeApproved);
  return {
    ...parts,
    total,
    level: lvl.level,
    label: lvl.label,
  };
}

function demoBreakdown(): StlBreakdown {
  return buildBreakdown({
    pss: 30,
    crb: 10,
    performance: 12,
    behavior: 4,
    industries: 6,
    refilling: 5,
  });
}

export async function computeUserStl(userId: string): Promise<StlBreakdown> {
  if (!isMongoObjectId(userId)) return demoBreakdown();

  const [profile, verification, complaintsCount, crbCertificates, crbPassedExams, refills, franchiseSummary] =
    await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        select: { verificationStatus: true, stlSupremeApproval: true },
      }),
      prisma.pSSVerification.findUnique({
        where: { userId },
        select: { phaseCompleted: true, status: true },
      }),
      prisma.complaint.count({
        where: {
          targetId: userId,
          status: { in: ["PENDING", "AI_REVIEW", "HUMAN_REVIEW"] },
        } as any,
      }),
      prisma.cRBCertificate.count({
        where: {
          entityId: userId,
          status: "ACTIVE",
        },
      }),
      prisma.inspectionReport.count({
        where: {
          task: { crbApplication: { applicantId: userId } },
          fraudSuspected: false,
          score: { gte: 70 },
        },
      }),
      prisma.pSSRefill.findMany({
        where: { verification: { userId } },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: { id: true, status: true, dueDate: true, createdAt: true },
      }),
      prisma.inspectionTask.groupBy({
        by: ["status"],
        where: { inspectorId: userId },
        _count: { _all: true },
      }),
    ]);

  const supremeApproved = await isSupremeApprovedForUser(userId, profile?.stlSupremeApproval ?? undefined);

  const complaintLimit = 8;
  const pssLevel = verification?.phaseCompleted ?? 0;
  const pssKycDone = profile?.verificationStatus === "VERIFIED" || verification?.status === "VERIFIED";
  const pssNormalized = clamp((pssKycDone ? 60 : 0) + (clamp(pssLevel, 0, 6) / 6) * 40, 0, 100);
  const pssWeighted = (pssNormalized / 100) * 30;

  const requiredVerifications = 4;
  const requiredExams = 4;
  const verificationsRatio = clamp(crbCertificates / requiredVerifications, 0, 1);
  const examsRatio = clamp(crbPassedExams / requiredExams, 0, 1);
  const crbNormalized = verificationsRatio * 60 + examsRatio * 40;
  const crbWeighted = (crbNormalized / 100) * 30;

  const requiredRefills = 4;
  const refillDoneCount = refills.filter((r) => r.status === "COMPLETED").length;
  const dmoNormalized = clamp((refillDoneCount / requiredRefills) * 100, 0, 100);
  const dmoWeighted = (dmoNormalized / 100) * 20;

  const verifiedLocations = franchiseSummary.find((x) => x.status === "COMPLETED")?._count._all ?? 0;
  const pendingLocations = franchiseSummary
    .filter((x) => x.status === "ASSIGNED" || x.status === "IN_PROGRESS")
    .reduce((sum, x) => sum + x._count._all, 0);
  const franchiseTotal = verifiedLocations + pendingLocations;
  const franchiseNormalized = franchiseTotal > 0 ? (verifiedLocations / franchiseTotal) * 100 : 0;
  const franchiseWeighted = (franchiseNormalized / 100) * 10;

  const complaintPenalty = complaintsCount >= complaintLimit ? 20 : (complaintsCount / complaintLimit) * 10;
  const canUpgrade = complaintsCount < complaintLimit;
  const penaltyWeighted = canUpgrade ? -complaintPenalty : -25;

  return buildBreakdown(
    {
      pss: Math.round(pssWeighted),
      crb: Math.round(crbWeighted),
      performance: Math.round(dmoWeighted),
      behavior: Math.round(penaltyWeighted),
      industries: Math.round(franchiseWeighted),
      refilling: 0,
    },
    supremeApproved
  );
}

export async function computeServiceStl(serviceId: string): Promise<StlBreakdown> {
  const provider = await prisma.providerService.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      userId: true,
      isActive: true,
      availability: true,
      verificationStatus: true,
      profile: { select: { stlStatus: true, rating: true } },
    },
  });

  if (!provider) throw new Error("Service not found");

  const [owner, crb, reviews, industries, entityRefilling] = await Promise.all([
    ownerTrustSnapshot(provider.userId),
    crbScoreForEntity(serviceId, "SERVICE"),
    reviewStatsForEntity(serviceId),
    industryBoostForEntity("SERVICE", serviceId),
    refillingScoreForEntity("SERVICE", serviceId, provider.profile?.stlStatus ?? null),
  ]);

  const availabilityValue = (provider.availability ?? "available").toLowerCase();
  const ratingSource = reviews.average ?? (provider.profile?.rating ? Number(provider.profile.rating) : null);
  const performance = clamp(
    (ratingSource !== null ? (ratingSource / 5) * 10 : 0) +
      clamp(reviews.count, 0, 4) +
      (provider.isActive ? 3 : 0) +
      (provider.verificationStatus === "VERIFIED" ? 3 : provider.verificationStatus === "PENDING" ? 1 : 0),
    0,
    20
  );

  let entityBehavior = 0;
  if (!provider.isActive) entityBehavior -= 20;
  else if (availabilityValue !== "available") entityBehavior -= 5;
  else entityBehavior += 5;
  if (provider.verificationStatus === "REJECTED") entityBehavior -= 15;
  if (ratingSource !== null && ratingSource >= 4.5) entityBehavior += 5;
  if (ratingSource !== null && ratingSource < 3) entityBehavior -= 5;

  return buildBreakdown({
    pss: owner.pss,
    crb,
    performance,
    behavior: clamp(Math.round(owner.behavior * 0.5 + entityBehavior), -50, 20),
    industries,
    refilling: clamp(Math.round(owner.refilling * 0.5 + entityRefilling), -40, 10),
  });
}

export async function computeProductStl(productId: string): Promise<StlBreakdown> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      sellerId: true,
      isActive: true,
      stock: true,
      rating: true,
      seller: { select: { profile: { select: { stlStatus: true } } } },
    },
  });

  if (!product) throw new Error("Product not found");

  const [owner, crb, reviews, industries, entityRefilling, deliveredOrders] = await Promise.all([
    ownerTrustSnapshot(product.sellerId),
    crbScoreForEntity(productId, "PRODUCT"),
    reviewStatsForEntity(productId),
    industryBoostForEntity("PRODUCT", productId),
    refillingScoreForEntity("PRODUCT", productId, product.seller.profile?.stlStatus ?? null),
    prisma.order.count({ where: { productId, status: "DELIVERED" } }),
  ]);

  const ratingSource = reviews.average ?? (product.rating ? Number(product.rating) : null);
  const performance = clamp(
    (ratingSource !== null ? (ratingSource / 5) * 10 : 0) +
      clamp(reviews.count, 0, 4) +
      clamp(deliveredOrders, 0, 3) +
      (product.isActive && product.stock > 0 ? 3 : 0),
    0,
    20
  );

  let entityBehavior = 0;
  if (!product.isActive) entityBehavior -= 20;
  else entityBehavior += 5;
  if (product.stock <= 0) entityBehavior -= 10;
  if (ratingSource !== null && ratingSource >= 4.5) entityBehavior += 5;
  if (ratingSource !== null && ratingSource < 3) entityBehavior -= 5;

  return buildBreakdown({
    pss: owner.pss,
    crb,
    performance,
    behavior: clamp(Math.round(owner.behavior * 0.5 + entityBehavior), -50, 20),
    industries,
    refilling: clamp(Math.round(owner.refilling * 0.5 + entityRefilling), -40, 10),
  });
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
  const key = { entityType_entityId: { entityType: args.entityType, entityId: args.entityId } } as const;

  const scoreRow = existing
    ? await prisma.sTLScore.update({
        where: key,
        data: {
          score: nextScore,
          level: args.breakdown.level,
          breakdown: args.breakdown as any,
        },
      })
    : await prisma.sTLScore.create({
        data: {
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

  if (args.entityType === "USER" && isMongoObjectId(args.entityId)) {
    await prisma.profile.updateMany({
      where: { userId: args.entityId },
      data: {
        stlScore: Math.round(nextScore),
        stlUpdatedAt: new Date(),
      },
    });
  }

  return { scoreRow, change, prevScore, nextScore };
}

export async function recalcUserStl(args: { userId: string; reason: string; actorId?: string | null }) {
  const breakdown = await computeUserStl(args.userId);
  const result = await upsertStlScore({
    entityId: args.userId,
    entityType: "USER",
    breakdown,
    reason: args.reason,
    actorId: args.actorId ?? null,
  });
  await syncSupremeApprovalState(args.userId);
  await syncLowTrustUserSignal({
    userId: args.userId,
    stlScore: result.nextScore,
    actorId: args.actorId ?? null,
  });
  return result;
}

export async function recalcServiceStl(args: { serviceId: string; reason: string; actorId?: string | null }) {
  const breakdown = await computeServiceStl(args.serviceId);
  return await upsertStlScore({
    entityId: args.serviceId,
    entityType: "SERVICE",
    breakdown,
    reason: args.reason,
    actorId: args.actorId ?? null,
  });
}

export async function recalcProductStl(args: { productId: string; reason: string; actorId?: string | null }) {
  const breakdown = await computeProductStl(args.productId);
  return await upsertStlScore({
    entityId: args.productId,
    entityType: "PRODUCT",
    breakdown,
    reason: args.reason,
    actorId: args.actorId ?? null,
  });
}

export async function recalcStlByEntity(args: {
  entityId: string;
  entityType: STLEntityType;
  reason: string;
  actorId?: string | null;
}) {
  switch (args.entityType) {
    case "USER":
      return recalcUserStl({ userId: args.entityId, reason: args.reason, actorId: args.actorId });
    case "SERVICE":
      return recalcServiceStl({ serviceId: args.entityId, reason: args.reason, actorId: args.actorId });
    case "PRODUCT":
      return recalcProductStl({ productId: args.entityId, reason: args.reason, actorId: args.actorId });
  }
}

export async function computeStlByEntity(args: {
  entityId: string;
  entityType: STLEntityType;
}): Promise<StlBreakdown> {
  switch (args.entityType) {
    case "USER":
      return computeUserStl(args.entityId);
    case "SERVICE":
      return computeServiceStl(args.entityId);
    case "PRODUCT":
      return computeProductStl(args.entityId);
  }
}

