import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";
import { createDemoApplication, isDmoDemoMode } from "@/lib/dmo/demoStore";
import type { AutomationEventType } from "./schemas";

type TriggerArgs = {
  event: AutomationEventType;
  actorUserId?: string | null;
  correlationId?: string;
  data?: Record<string, unknown>;
};

type TriggerResult = {
  event: AutomationEventType;
  eventId: string | null;
  processed: boolean;
  actionsExecuted: string[];
  fallbackUsed: boolean;
  error?: string;
};

const db = prisma as any;

function toObject(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  return data as Record<string, unknown>;
}

function maybeString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

async function actionCreateDmoApplicationFromPss(payload: Record<string, unknown>, actorUserId: string | null) {
  const userId = maybeString(payload.userId);
  const caseId = maybeString(payload.caseId);
  if (!userId) return "SKIP_CREATE_DMO_APPLICATION_MISSING_USER";

  if (isDmoDemoMode()) {
    createDemoApplication({
      type: "PSS",
      applicantId: userId,
      payload: {
        source: "automation_demo",
        event: "PSS_VERIFIED",
        pssApplicationType: "PSS_VERIFICATION",
        pssVerificationId: caseId ?? null,
      },
    });
    return "CREATE_DMO_APPLICATION_DEMO";
  }

  const existing = caseId
    ? (
        await prisma.application.findMany({
          where: {
            applicantId: userId,
            OR: [{ type: "PSS_VERIFICATION" as any }, { type: "PSS" }],
          },
          select: { id: true, payload: true },
          take: 50,
        })
      ).find((row) => {
        const payloadData = toObject(row.payload);
        return payloadData.pssVerificationId === caseId;
      }) ?? null
    : null;
  if (existing) return "SKIP_CREATE_DMO_APPLICATION_ALREADY_EXISTS";

  try {
    await prisma.application.create({
      data: {
        type: "PSS_VERIFICATION" as any,
        status: "NEW",
        applicantId: userId,
        payload: {
          source: "automation",
          event: "PSS_VERIFIED",
          pssVerificationId: caseId ?? null,
          riskLevel: maybeString(payload.riskLevel) ?? "low",
        },
      },
    });
    await writeAuditLog({
      actorId: actorUserId,
      action: "AUTOMATION_DMO_APPLICATION_CREATED",
      targetType: "APPLICATION",
      targetId: userId,
      metadata: { event: "PSS_VERIFIED", pssVerificationId: caseId ?? null },
    });
    return "CREATE_DMO_APPLICATION";
  } catch {
    // Compatibility fallback for environments where enum migration isn't applied yet.
    await prisma.application.create({
      data: {
        type: "PSS",
        status: "NEW",
        applicantId: userId,
        payload: {
          source: "automation_fallback",
          event: "PSS_VERIFIED",
          pssApplicationType: "PSS_VERIFICATION",
          pssVerificationId: caseId ?? null,
        },
      },
    });
    return "CREATE_DMO_APPLICATION_FALLBACK_PSS";
  }
}

async function actionCreateRegistryAndRecalcStl(payload: Record<string, unknown>, actorUserId: string | null) {
  const applicationId = maybeString(payload.applicationId);
  const userIdFromPayload = maybeString(payload.userId);
  const source = maybeString(payload.source) ?? "MANUAL";
  const userId =
    userIdFromPayload ??
    (applicationId
      ? (
          await prisma.application.findUnique({
            where: { id: applicationId },
            select: { applicantId: true },
          })
        )?.applicantId
      : undefined);
  if (!userId) return "SKIP_DMO_APPROVED_MISSING_USER";

  if (isDmoDemoMode()) {
    return "CREATE_REGISTRY_AND_RECALC_STL_DEMO";
  }

  const existingRegistry = await prisma.registryRecord.findFirst({
    where: {
      entityType: "USER",
      entityId: userId,
      verificationSource: source === "PSS" ? "PSS" : source === "CRB" ? "CRB" : source === "FRANCHISE" ? "FRANCHISE" : "MANUAL",
      status: "VERIFIED",
    },
    select: { id: true },
  });
  if (!existingRegistry) {
    await prisma.registryRecord.create({
      data: {
        entityType: "USER",
        entityId: userId,
        verificationSource: source === "PSS" ? "PSS" : source === "CRB" ? "CRB" : source === "FRANCHISE" ? "FRANCHISE" : "MANUAL",
        status: "VERIFIED",
        issuedAt: new Date(),
      },
    });
  }

  await recalcUserStl({
    userId,
    actorId: actorUserId,
    reason: "AUTOMATION_DMO_APPROVED",
  });
  return existingRegistry ? "RECALC_STL_ONLY_REGISTRY_EXISTS" : "CREATE_REGISTRY_AND_RECALC_STL";
}

async function actionMarketplaceRefresh(payload: Record<string, unknown>, actorUserId: string | null) {
  const userId = maybeString(payload.userId);
  if (!userId) return "SKIP_MARKETPLACE_REFRESH_MISSING_USER";
  if (isDmoDemoMode()) return "REQUEST_MARKETPLACE_RANKING_REFRESH_DEMO";
  await writeAuditLog({
    actorId: actorUserId,
    action: "AUTOMATION_MARKETPLACE_RANKING_REFRESH_REQUESTED",
    targetType: "USER",
    targetId: userId,
    metadata: { event: "STL_UPDATED" },
  });
  return "REQUEST_MARKETPLACE_RANKING_REFRESH";
}

async function actionRefillExpiredPenalty(payload: Record<string, unknown>, actorUserId: string | null) {
  const userId = maybeString(payload.userId);
  if (!userId) return "SKIP_REFILL_PENALTY_MISSING_USER";

  if (isDmoDemoMode()) return "APPLY_REFILL_EXPIRED_PENALTY_DEMO";

  await prisma.profile.updateMany({
    where: { userId },
    data: {
      stlStatus: "DOWNGRADED",
      stlScore: { decrement: 10 },
      stlUpdatedAt: new Date(),
    },
  });

  await prisma.providerService.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  await recalcUserStl({
    userId,
    actorId: actorUserId,
    reason: "AUTOMATION_REFILL_EXPIRED",
  });
  return "APPLY_REFILL_EXPIRED_PENALTY";
}

async function executeBuiltInActions(args: TriggerArgs) {
  const payload = toObject(args.data);
  const actor = args.actorUserId ?? null;

  switch (args.event) {
    case "PSS_VERIFIED":
      return [await actionCreateDmoApplicationFromPss(payload, actor)];
    case "DMO_APPROVED":
      return [await actionCreateRegistryAndRecalcStl(payload, actor)];
    case "STL_UPDATED":
      return [await actionMarketplaceRefresh(payload, actor)];
    case "REFILL_EXPIRED":
      return [await actionRefillExpiredPenalty(payload, actor)];
    default:
      return [];
  }
}

async function recordAutomationEvent(args: TriggerArgs) {
  return db.automationEvent.create({
    data: {
      eventType: args.event,
      entityType: maybeString(args.data?.entityType) ?? "USER",
      entityId: maybeString(args.data?.entityId) ?? maybeString(args.data?.userId) ?? "unknown",
      payload: args.data ?? {},
      status: "PROCESSING",
      attempts: 1,
      correlationId: args.correlationId ?? null,
      triggeredById: args.actorUserId ?? null,
    },
  });
}

async function markEventDone(eventId: string) {
  await db.automationEvent.update({
    where: { id: eventId },
    data: { status: "DONE", processedAt: new Date(), lastError: null },
  });
}

async function markEventFailed(eventId: string, err: unknown) {
  const message = err instanceof Error ? err.message : "Automation execution failed";
  await db.automationEvent.update({
    where: { id: eventId },
    data: {
      status: "FAILED",
      processedAt: new Date(),
      lastError: message,
      nextRetryAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
}

export async function triggerAutomationEvent(args: TriggerArgs): Promise<TriggerResult> {
  if (isDmoDemoMode()) {
    const actionsExecuted = await executeBuiltInActions(args);
    return {
      event: args.event,
      eventId: null,
      processed: true,
      actionsExecuted,
      fallbackUsed: true,
    };
  }

  let eventId: string | null = null;
  try {
    const row = await recordAutomationEvent(args);
    eventId = row.id;
    const actionsExecuted = await executeBuiltInActions(args);
    await markEventDone(row.id);
    return { event: args.event, eventId, processed: true, actionsExecuted, fallbackUsed: false };
  } catch (err) {
    if (eventId) {
      await markEventFailed(eventId, err);
      return {
        event: args.event,
        eventId,
        processed: false,
        actionsExecuted: [],
        fallbackUsed: false,
        error: err instanceof Error ? err.message : "Automation execution failed",
      };
    }

    // Fallback when automation tables are not migrated yet.
    const actionsExecuted = await executeBuiltInActions(args);
    return {
      event: args.event,
      eventId: null,
      processed: true,
      actionsExecuted,
      fallbackUsed: true,
    };
  }
}

export async function runSlaScan(args: { actorUserId: string }) {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const staleApps = await prisma.application.findMany({
    where: {
      status: { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] },
      createdAt: { lt: threeDaysAgo },
    },
    select: {
      id: true,
      applicantId: true,
      status: true,
      createdAt: true,
    },
    take: 1000,
  });

  let escalated = 0;
  for (const app of staleApps) {
    await writeAuditLog({
      actorId: args.actorUserId,
      action: "DMO_SLA_BREACH_DETECTED",
      targetType: "APPLICATION",
      targetId: app.id,
      metadata: {
        status: app.status,
        createdAt: app.createdAt,
      },
    });
    escalated += 1;
  }

  await writeAuditLog({
    actorId: args.actorUserId,
    action: "DMO_SLA_SCAN_COMPLETED",
    targetType: "OTHER",
    targetId: "dmo_sla_scan",
    metadata: { scanned: staleApps.length, breached: escalated },
  });

  return { scanned: staleApps.length, breached: escalated };
}

