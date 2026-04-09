import { prisma } from "@/lib/prisma";
import { computeUserStl, type StlBreakdown } from "@/lib/stl/engine";
import { EHB_STL_LEVELS, getLevelMeta, getProgressToNextLevel, type EhbStlLevelMeta } from "@/lib/stl/levels";
import { isMongoObjectId } from "@/lib/mongoId";
import { evaluateAiAutomation } from "@/lib/ai/automationBrain";

export type StlFullSnapshot = {
  name: string;
  stlLevel: number;
  levels: EhbStlLevelMeta[];
  trustScore: number;
  /** Legacy compatibility alias for quick UI wiring */
  progressPercent: number;
  levelName: string;
  pss: {
    kycStatus: string;
    /** Legacy compatibility alias */
    kyc: boolean;
    level: number;
    complaintsCount: number;
    /** Legacy compatibility alias */
    complaints: number;
    complaintLimit: number;
  };
  crb: {
    /** Legacy compatibility alias */
    verifications: number;
    totalVerifications: number;
    /** Legacy compatibility alias */
    required: number;
    requiredVerifications: number;
    examsPassed: number;
    requiredExams: number;
    history: { id: string; status: string; at: string }[];
  };
  dmo: {
    /** Legacy compatibility alias */
    refills: number;
    refillCount: number;
    /** Legacy compatibility alias */
    requiredRefills: number;
    requiredRefillCount: number;
    refillHistory: { id: string; status: string; dueDate: string }[];
  };
  franchise: {
    /** Legacy compatibility alias arrays */
    verified: string[];
    pending: string[];
    verifiedLocations: number;
    pendingLocations: number;
  };
  complaints: {
    count: number;
    limit: number;
    nearLimit: boolean;
  };
  progress: {
    percent: number;
    nextLevelName: string | null;
  };
  nextLevel: { level: number; name: string; minScore: number } | null;
  nextLevelName: string | null;
  /** Legacy compatibility alias (numeric level) */
  nextLevelLevel: number | null;
  missingRequirements: string[];
  supreme: {
    eligible: boolean;
    pendingApproval: boolean;
    approved: boolean;
    rejected: boolean;
  };
  upgradeBlocked: boolean;
  /** Legacy compatibility alias */
  blocked: boolean;
  canUpgrade: boolean;
  aiSuggestions: string[];
  ai: {
    readinessPercent: number;
    guide: string;
    tasks: string[];
    recommendations: string[];
    fraud: { flagged: boolean; reasons: string[]; risk: "LOW" | "MEDIUM" | "HIGH" };
    autoDecision: { recommendUpgrade: boolean; escalateToDmo: boolean; reason: string };
  };
  breakdown: StlBreakdown | null;
  dataSource: "live" | "demo";
};

const REQUIRED_VERIFICATIONS = 4;
const REQUIRED_EXAMS = 4;
const REQUIRED_REFILLS = 4;
const COMPLAINT_LIMIT = 8;

function demoSnapshot(): StlFullSnapshot {
  const breakdown = {
    pss: 18,
    crb: 15,
    performance: 12,
    behavior: -4,
    industries: 8,
    refilling: 0,
    total: 49,
    level: 3,
    label: "NORMAL",
  };
  return {
    name: "Demo User",
    stlLevel: 3,
    levels: EHB_STL_LEVELS,
    trustScore: 49,
    progressPercent: 45,
    levelName: "NORMAL",
    pss: {
      kycStatus: "PENDING",
      kyc: false,
      level: 2,
      complaintsCount: 1,
      complaints: 1,
      complaintLimit: COMPLAINT_LIMIT,
    },
    crb: {
      verifications: 1,
      totalVerifications: 1,
      required: REQUIRED_VERIFICATIONS,
      requiredVerifications: REQUIRED_VERIFICATIONS,
      examsPassed: 0,
      requiredExams: REQUIRED_EXAMS,
      history: [],
    },
    dmo: {
      refills: 1,
      refillCount: 1,
      requiredRefills: REQUIRED_REFILLS,
      requiredRefillCount: REQUIRED_REFILLS,
      refillHistory: [],
    },
    franchise: { verified: [], pending: [], verifiedLocations: 0, pendingLocations: 0 },
    complaints: { count: 1, limit: COMPLAINT_LIMIT, nearLimit: false },
    progress: { percent: 45, nextLevelName: "STANDARD" },
    nextLevel: { level: 4, name: "STANDARD", minScore: 56 },
    nextLevelName: "STANDARD",
    nextLevelLevel: 4,
    missingRequirements: ["Complete KYC verification", "Finish PSS phase progress"],
    supreme: { eligible: false, pendingApproval: false, approved: false, rejected: false },
    upgradeBlocked: false,
    blocked: false,
    canUpgrade: true,
    aiSuggestions: ["Complete KYC verification"],
    ai: {
      readinessPercent: 45,
      guide: "Complete core trust tasks to improve STL.",
      tasks: ["Complete KYC verification", "Finish PSS phase progress"],
      recommendations: ["Focus on pending trust tasks before upgrade request"],
      fraud: { flagged: false, reasons: [], risk: "LOW" },
      autoDecision: { recommendUpgrade: false, escalateToDmo: false, reason: "More trust steps required" },
    },
    breakdown,
    dataSource: "demo",
  };
}

/**
 * Unified trust snapshot for Widget, Dashboard, and GET /api/stl/full-snapshot.
 */
export async function buildStlFullSnapshot(userId: string): Promise<StlFullSnapshot> {
  if (!isMongoObjectId(userId)) {
    return demoSnapshot();
  }

  const [
    breakdown,
    scoreRow,
    profile,
    user,
    verification,
    complaintsCount,
    certificatesCount,
    passedExamCount,
    refillRows,
    taskRows,
    activityEvents30d,
  ] = await Promise.all([
    computeUserStl(userId),
    prisma.sTLScore.findUnique({
      where: { entityType_entityId: { entityType: "USER", entityId: userId } },
      select: { level: true, score: true },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: { verificationStatus: true, stlSupremeApproval: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.pSSVerification.findUnique({
      where: { userId },
      select: { phaseCompleted: true },
    }),
    prisma.complaint.count({
      where: { targetId: userId, status: { in: ["PENDING", "AI_REVIEW", "HUMAN_REVIEW"] } } as any,
    }),
    prisma.cRBCertificate.count({ where: { entityId: userId, status: "ACTIVE" } }),
    prisma.inspectionReport.count({
      where: { task: { crbApplication: { applicantId: userId } }, fraudSuspected: false, score: { gte: 70 } },
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
    prisma.userEvent.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const trustScore = Math.round(Number(scoreRow?.score ?? breakdown.total ?? 0));
  const stlLevel = Number(scoreRow?.level ?? breakdown.level ?? 1);
  const levelMeta = getLevelMeta(stlLevel);
  const progressPct = getProgressToNextLevel(trustScore, stlLevel);
  const nextMeta = stlLevel < 8 ? getLevelMeta(stlLevel + 1) : null;

  const refillCount = refillRows.filter((r) => r.status === "COMPLETED").length;
  const franchiseVerified = taskRows.find((x) => x.status === "COMPLETED")?._count._all ?? 0;
  const franchisePending = taskRows
    .filter((x) => x.status === "ASSIGNED" || x.status === "IN_PROGRESS")
    .reduce((sum, x) => sum + x._count._all, 0);

  const approval = profile?.stlSupremeApproval ?? "NONE";
  const supremeApproved = approval === "APPROVED";
  const supremeRejected = approval === "REJECTED";
  const supremePending = approval === "PENDING";
  const supremeEligible = trustScore >= 96 && !supremeApproved;

  const missing: string[] = [];
  if (profile?.verificationStatus !== "VERIFIED") missing.push("Complete KYC verification");
  if ((verification?.phaseCompleted ?? 0) < 6) missing.push("Finish PSS phase progress");
  if (certificatesCount < REQUIRED_VERIFICATIONS) missing.push("Complete CRB verifications");
  if (passedExamCount < REQUIRED_EXAMS) missing.push("Pass required CRB exams");
  if (refillCount < REQUIRED_REFILLS) missing.push("Complete DMO refill cycle");
  if (complaintsCount >= COMPLAINT_LIMIT) missing.push("Resolve complaints (upgrade blocked)");
  if (supremePending) {
    missing.push("SUPREME: pending DMO approval");
  }

  const canUpgrade = complaintsCount < COMPLAINT_LIMIT;
  const nearLimit = complaintsCount >= COMPLAINT_LIMIT - 2 && complaintsCount < COMPLAINT_LIMIT;
  const ai = evaluateAiAutomation({
    stlLevel,
    trustScore,
    progressPercent: progressPct,
    complaintsCount,
    complaintLimit: COMPLAINT_LIMIT,
    kycVerified: (profile?.verificationStatus ?? "PENDING") === "VERIFIED",
    crbVerifications: certificatesCount,
    requiredCrbVerifications: REQUIRED_VERIFICATIONS,
    examsPassed: passedExamCount,
    requiredExams: REQUIRED_EXAMS,
    dmoRefills: refillCount,
    requiredDmoRefills: REQUIRED_REFILLS,
    activityEvents30d,
    supremePending,
    supremeApproved,
  });

  return {
    name: user?.name ?? "User",
    stlLevel,
    levels: EHB_STL_LEVELS,
    trustScore,
    progressPercent: progressPct,
    levelName: levelMeta.name,
    pss: {
      kycStatus: profile?.verificationStatus ?? "PENDING",
      kyc: (profile?.verificationStatus ?? "PENDING") === "VERIFIED",
      level: verification?.phaseCompleted ?? 0,
      complaintsCount,
      complaints: complaintsCount,
      complaintLimit: COMPLAINT_LIMIT,
    },
    crb: {
      verifications: certificatesCount,
      totalVerifications: certificatesCount,
      required: REQUIRED_VERIFICATIONS,
      requiredVerifications: REQUIRED_VERIFICATIONS,
      examsPassed: passedExamCount,
      requiredExams: REQUIRED_EXAMS,
      history: refillRows.slice(0, 6).map((r) => ({
        id: r.id,
        status: r.status,
        at: r.createdAt.toISOString(),
      })),
    },
    dmo: {
      refills: refillCount,
      refillCount,
      requiredRefills: REQUIRED_REFILLS,
      requiredRefillCount: REQUIRED_REFILLS,
      refillHistory: refillRows.map((r) => ({
        id: r.id,
        status: r.status,
        dueDate: r.dueDate.toISOString(),
      })),
    },
    franchise: {
      verified: Array.from({ length: franchiseVerified }, (_, i) => `verified-${i + 1}`),
      pending: Array.from({ length: franchisePending }, (_, i) => `pending-${i + 1}`),
      verifiedLocations: franchiseVerified,
      pendingLocations: franchisePending,
    },
    complaints: {
      count: complaintsCount,
      limit: COMPLAINT_LIMIT,
      nearLimit,
    },
    progress: {
      percent: progressPct,
      nextLevelName: nextMeta?.name ?? null,
    },
    nextLevel: nextMeta ? { level: nextMeta.level, name: nextMeta.name, minScore: nextMeta.min } : null,
    nextLevelName: nextMeta?.name ?? null,
    nextLevelLevel: nextMeta?.level ?? null,
    missingRequirements: missing,
    supreme: {
      eligible: supremeEligible,
      pendingApproval: supremePending,
      approved: supremeApproved,
      rejected: supremeRejected,
    },
    upgradeBlocked: !canUpgrade,
    blocked: !canUpgrade,
    canUpgrade,
    aiSuggestions:
      ai.tasks.length > 0 ? ai.tasks : missing.length > 0 ? missing : ["Maintain current trust quality and avoid complaints"],
    ai,
    breakdown,
    dataSource: "live",
  };
}
