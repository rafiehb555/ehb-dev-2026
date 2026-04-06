import { prisma } from "@/lib/prisma";

export type PssRiskLevel = "low" | "medium" | "high";
export type FraudStatus = "SAFE" | "SUSPICIOUS" | "BLOCKED";
export type RefillAlertStatus = "NORMAL" | "WARNING" | "EXPIRED";

function toObj(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  return v as Record<string, unknown>;
}

function asStringArray(v: unknown) {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function riskLevelFromScore(score: number): PssRiskLevel {
  if (score >= 51) return "high";
  if (score >= 21) return "medium";
  return "low";
}

export function refillAlertFromDueDate(dueDate: Date | null | undefined): {
  status: RefillAlertStatus;
  daysRemaining: number | null;
} {
  if (!dueDate) return { status: "NORMAL", daysRemaining: null };
  const now = Date.now();
  const ms = dueDate.getTime() - now;
  const daysRemaining = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (daysRemaining < 0) return { status: "EXPIRED", daysRemaining };
  if (daysRemaining <= 7) return { status: "WARNING", daysRemaining };
  return { status: "NORMAL", daysRemaining };
}

async function sharedDeviceAccounts(deviceHash: string) {
  if (!deviceHash) return 0;
  const recent = await prisma.pSSStepReview.findMany({
    where: { createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } },
    include: { verification: { select: { userId: true } } },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });
  const users = new Set<string>();
  for (const r of recent) {
    const md = toObj(r.metadata);
    const hash = typeof md.deviceHash === "string" ? md.deviceHash : "";
    if (hash === deviceHash) users.add(r.verification.userId);
  }
  return users.size;
}

export async function calculateRiskForCase(caseId: string) {
  const verification = await prisma.pSSVerification.findUnique({
    where: { id: caseId },
    include: {
      user: { select: { id: true, profile: { select: { verificationStatus: true } } } },
      stepReviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!verification) return null;

  const identityReview = verification.stepReviews.find((r) => r.step === "IDENTITY");
  const amlReview = verification.stepReviews.find((r) => r.step === "AML_RISK");
  const latestMeta = verification.stepReviews.map((r) => toObj(r.metadata)).find((m) => Object.keys(m).length > 0) ?? {};
  const amlMeta = toObj(amlReview?.metadata);

  const idMismatch =
    identityReview?.decision === "REJECTED" || verification.user.profile?.verificationStatus === "REJECTED";
  const amlFlags = asStringArray(amlMeta.flags);
  const amlFlag = amlFlags.length > 0 || amlReview?.decision === "REJECTED";

  const deviceHash = typeof latestMeta.deviceHash === "string" ? latestMeta.deviceHash : "";
  const sharedAccounts = deviceHash ? await sharedDeviceAccounts(deviceHash) : 1;
  const deviceRisk = sharedAccounts >= 2;

  const rejectedAttempts30d = await prisma.pSSStepReview.count({
    where: {
      verificationId: caseId,
      decision: "REJECTED",
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  const behaviorRisk = rejectedAttempts30d >= 2;

  const score =
    (idMismatch ? 40 : 0) +
    (amlFlag ? 30 : 0) +
    (deviceRisk ? 20 : 0) +
    (behaviorRisk ? 10 : 0);
  const level = riskLevelFromScore(score);

  return {
    caseId,
    score,
    level,
    factors: {
      identityFail: idMismatch,
      amlFlag,
      amlFlags,
      deviceRisk,
      deviceHash: deviceHash || null,
      sharedDeviceAccounts: sharedAccounts,
      behaviorRisk,
      rejectedAttempts30d,
    },
  };
}

export async function detectFraudForCase(caseId: string) {
  const risk = await calculateRiskForCase(caseId);
  if (!risk) return null;

  const blocked =
    risk.factors.sharedDeviceAccounts >= 3 || risk.factors.rejectedAttempts30d >= 4;
  const suspicious =
    !blocked &&
    (risk.factors.sharedDeviceAccounts >= 2 ||
      risk.factors.rejectedAttempts30d >= 2 ||
      risk.factors.amlFlag);

  const status: FraudStatus = blocked ? "BLOCKED" : suspicious ? "SUSPICIOUS" : "SAFE";
  const reasons: string[] = [];
  if (risk.factors.sharedDeviceAccounts >= 2) reasons.push("DEVICE_REUSE_DETECTED");
  if (risk.factors.rejectedAttempts30d >= 2) reasons.push("MULTIPLE_FAILED_ATTEMPTS");
  if (risk.factors.amlFlag) reasons.push("AML_FLAGS_PRESENT");

  return {
    caseId,
    status,
    reasons,
    risk: { score: risk.score, level: risk.level },
  };
}

