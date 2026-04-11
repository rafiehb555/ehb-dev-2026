import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { calculateRiskScore, getRiskTier, writeFraudSignal } from "@/lib/fraud/riskEngine";
import { calculateRiskForCase } from "@/lib/pss/intelligence";

type FraudEntityType = "USER" | "APPLICATION" | "ORDER" | "PROVIDER" | "SELLER" | "FRANCHISE";
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
type ApplicationStatus = "NEW" | "IN_REVIEW" | "UNDER_INSPECTION" | "APPROVED" | "REJECTED";

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function riskPriority(score: number) {
  if (score >= 81) return "CRITICAL" as const;
  if (score >= 61) return "HIGH" as const;
  if (score >= 31) return "MEDIUM" as const;
  return "LOW" as const;
}

function nextApplicationStatus(current: ApplicationStatus, score: number): ApplicationStatus {
  if (current === "APPROVED" || current === "REJECTED") return current;
  if (score >= 81) return "UNDER_INSPECTION";
  if (score >= 61 && current === "NEW") return "IN_REVIEW";
  return current;
}

async function writeSignalOnce(args: {
  entityId: string;
  entityType: FraudEntityType;
  signalType: FraudSignalType;
  actorId?: string | null;
  metadata?: Record<string, unknown>;
  targetType?: "USER" | "APPLICATION" | "PSS_VERIFICATION" | "OTHER";
  targetId?: string;
}) {
  const existing = await prisma.fraudSignal.findFirst({
    where: {
      entityId: args.entityId,
      entityType: args.entityType,
      signalType: args.signalType,
      resolvedAt: null,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { id: true },
  });

  if (existing) {
    const risk = await calculateRiskScore(args.entityId);
    return { created: false, risk };
  }

  await writeFraudSignal({
    entityId: args.entityId,
    entityType: args.entityType,
    signalType: args.signalType,
    metadata: args.metadata,
  });

  const risk = await calculateRiskScore(args.entityId);

  await writeAuditLog({
    actorId: args.actorId ?? null,
    action: "FRAUD_SIGNAL_SYNCED",
    targetType: args.targetType ?? "OTHER",
    targetId: args.targetId ?? args.entityId,
    metadata: {
      entityId: args.entityId,
      entityType: args.entityType,
      signalType: args.signalType,
      riskScore: risk.score,
      riskTier: risk.tier,
    },
  });

  return { created: true, risk };
}

export async function syncApplicationRisk(applicationId: string, actorId?: string | null) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      applicantId: true,
      status: true,
      priority: true,
      payload: true,
    },
  });
  if (!application) return null;

  const [applicationRisk, applicantRisk] = await Promise.all([
    calculateRiskScore(application.id),
    calculateRiskScore(application.applicantId),
  ]);

  const score = Math.max(applicationRisk.score, applicantRisk.score);
  const tier = getRiskTier(score);
  const priority = riskPriority(score);
  const status = nextApplicationStatus(application.status as ApplicationStatus, score);
  const payload = {
    ...asObject(application.payload),
    riskSources: {
      applicationEntity: applicationRisk.score,
      applicantEntity: applicantRisk.score,
    },
    fraudMonitoredAt: new Date().toISOString(),
    autoPaused: score >= 81,
  };

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      riskScore: score,
      riskLevel: tier,
      priority,
      status,
      payload: payload as any,
    },
    select: {
      id: true,
      status: true,
      priority: true,
      riskScore: true,
      riskLevel: true,
      applicantId: true,
    },
  });

  if (score >= 61) {
    await writeAuditLog({
      actorId: actorId ?? null,
      action: score >= 81 ? "FRAUD_ALERT_CRITICAL_APPLICATION" : "FRAUD_ALERT_HIGH_RISK_APPLICATION",
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: {
        applicantId: application.applicantId,
        riskScore: score,
        riskTier: tier,
        priority,
        status,
      },
    });
  }

  return updated;
}

export async function syncApplicantRiskApplications(applicantId: string, actorId?: string | null) {
  const applications = await prisma.application.findMany({
    where: {
      applicantId,
      status: { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] },
    },
    select: { id: true },
    take: 50,
  });

  return Promise.all(applications.map((application) => syncApplicationRisk(application.id, actorId)));
}

export async function syncPssFraudSignals(caseId: string, actorId?: string | null) {
  const risk = await calculateRiskForCase(caseId);
  if (!risk) return null;

  const createdSignals: FraudSignalType[] = [];

  if (risk.factors.identityFail) {
    const result = await writeSignalOnce({
      entityId: risk.caseId,
      entityType: "APPLICATION",
      signalType: "FAILED_VERIFICATION",
      actorId,
      metadata: { source: "PSS", caseId },
      targetType: "PSS_VERIFICATION",
      targetId: caseId,
    });
    if (result.created) createdSignals.push("FAILED_VERIFICATION");
  }

  if (risk.factors.rejectedAttempts30d >= 2) {
    const result = await writeSignalOnce({
      entityId: risk.caseId,
      entityType: "APPLICATION",
      signalType: "RAPID_SUBMISSION",
      actorId,
      metadata: { source: "PSS", caseId, rejectedAttempts30d: risk.factors.rejectedAttempts30d },
      targetType: "PSS_VERIFICATION",
      targetId: caseId,
    });
    if (result.created) createdSignals.push("RAPID_SUBMISSION");
  }

  if (risk.factors.sharedDeviceAccounts >= 2) {
    const result = await writeSignalOnce({
      entityId: risk.caseId,
      entityType: "APPLICATION",
      signalType: "MULTIPLE_ACCOUNTS",
      actorId,
      metadata: {
        source: "PSS",
        caseId,
        sharedDeviceAccounts: risk.factors.sharedDeviceAccounts,
        deviceHash: risk.factors.deviceHash,
      },
      targetType: "PSS_VERIFICATION",
      targetId: caseId,
    });
    if (result.created) createdSignals.push("MULTIPLE_ACCOUNTS");
  }

  if (risk.factors.amlFlag) {
    const result = await writeSignalOnce({
      entityId: risk.caseId,
      entityType: "APPLICATION",
      signalType: "SUSPICIOUS_ACTIVITY",
      actorId,
      metadata: { source: "PSS", caseId, amlFlags: risk.factors.amlFlags },
      targetType: "PSS_VERIFICATION",
      targetId: caseId,
    });
    if (result.created) createdSignals.push("SUSPICIOUS_ACTIVITY");
  }

  return {
    createdSignals,
    risk,
  };
}

export async function syncCrbFraudSignals(args: {
  applicationId: string;
  applicantId: string;
  decision: "APPROVED" | "REJECTED";
  actorId?: string | null;
}) {
  if (args.decision !== "REJECTED") {
    return { createdSignals: [] as FraudSignalType[] };
  }

  const createdSignals: FraudSignalType[] = [];

  const applicationSignal = await writeSignalOnce({
    entityId: args.applicationId,
    entityType: "APPLICATION",
    signalType: "LOW_CRB_BADGE",
    actorId: args.actorId,
    metadata: { source: "CRB", decision: args.decision, applicationId: args.applicationId },
    targetType: "OTHER",
    targetId: args.applicationId,
  });
  if (applicationSignal.created) createdSignals.push("LOW_CRB_BADGE");

  const userSignal = await writeSignalOnce({
    entityId: args.applicantId,
    entityType: "USER",
    signalType: "LOW_CRB_BADGE",
    actorId: args.actorId,
    metadata: { source: "CRB", decision: args.decision, applicationId: args.applicationId },
    targetType: "USER",
    targetId: args.applicantId,
  });
  if (userSignal.created) createdSignals.push("LOW_CRB_BADGE");

  return { createdSignals };
}

export async function syncLowTrustUserSignal(args: {
  userId: string;
  stlScore: number;
  actorId?: string | null;
}) {
  if (args.stlScore >= 40) return null;

  return writeSignalOnce({
    entityId: args.userId,
    entityType: "USER",
    signalType: "INCOMPLETE_PROFILE",
    actorId: args.actorId,
    metadata: {
      source: "STL",
      stlScore: args.stlScore,
    },
    targetType: "USER",
    targetId: args.userId,
  });
}
