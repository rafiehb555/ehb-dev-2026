import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";
import { triggerAutomationEvent } from "@/lib/automation/engine";
import { runDmoTrustEngine } from "@/lib/stl/dmoTrustEngine";

export type PssPhase = 1 | 2 | 3 | 4 | 5 | 6;

const GRACE_DAYS = 7;

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

function addMonths(d: Date, months: number) {
  const out = new Date(d);
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

function nextDueDateForPhase(now: Date, phase: PssPhase, opts?: { highRisk?: boolean }) {
  // v1: implement phases 1-3 periodic; 4-6 are "continuous" but we still create a 6-month check-in for visibility.
  if (phase === 1) return addMonths(now, 6);
  if (phase === 2) return addMonths(now, opts?.highRisk ? 3 : 6);
  if (phase === 3) return addMonths(now, 12); // 6–12 months; choose 12 for v1
  return addMonths(now, 6);
}

export async function completeVerificationPhase(args: {
  actorUserId: string;
  userId: string;
  phase: PssPhase;
  riskLevel?: "low" | "medium" | "high";
}) {
  const now = new Date();

  const verification = await prisma.pSSVerification.upsert({
    where: { userId: args.userId },
    update: {
      phaseCompleted: Math.max(args.phase, 0),
      lastVerifiedAt: now,
      riskLevel: args.riskLevel ?? undefined,
    },
    create: {
      userId: args.userId,
      phaseCompleted: args.phase,
      lastVerifiedAt: now,
      riskLevel: args.riskLevel ?? "low",
    },
  });

  // schedule next refill for that phase
  const dueDate = nextDueDateForPhase(now, args.phase, { highRisk: args.riskLevel === "high" });
  const graceEndDate = addDays(dueDate, GRACE_DAYS);

  const refill = await prisma.pSSRefill.create({
    data: {
      verificationId: verification.id,
      phase: args.phase,
      dueDate,
      graceEndDate,
      status: "PENDING",
    },
  });

  await prisma.profile.updateMany({
    where: { userId: args.userId },
    data: {
      verificationStatus: "VERIFIED",
      stlStatus: "ACTIVE",
      stlScore: { increment: phaseToStlImpact(args.phase) },
      stlUpdatedAt: now,
    },
  });

  await writeAuditLog({
    actorId: args.actorUserId,
    action: "PSS_PHASE_COMPLETED",
    targetType: "USER",
    targetId: args.userId,
    metadata: { phase: args.phase, refillId: refill.id, dueDate, graceEndDate, riskLevel: args.riskLevel ?? null },
  });

  await recalcUserStl({ userId: args.userId, actorId: args.actorUserId, reason: "PSS_PHASE_COMPLETED" });
  await runDmoTrustEngine({
    userId: args.userId,
    actorId: args.actorUserId,
    reason: "REFILL_UPDATE",
  }).catch(() => undefined);

  return { verification, refill };
}

export function phaseToStlImpact(phase: PssPhase) {
  // Represent as points out of 100 for v1 (not %). Calibrate later.
  if (phase === 1) return 30;
  if (phase === 2) return 20;
  if (phase === 3) return 20;
  if (phase === 4) return 10;
  if (phase === 5) return 10;
  return 10;
}

export async function scanRefillsAndEnforce(args: { actorUserId: string }) {
  const now = new Date();
  const warningWindowDays = 5; // "due soon"
  const warningStart = addDays(now, warningWindowDays);

  // due soon: any pending refill with dueDate within N days
  const dueSoon = await prisma.pSSRefill.findMany({
    where: {
      status: "PENDING",
      dueDate: { lte: warningStart, gte: now },
    },
    include: { verification: { select: { userId: true } } },
    take: 500,
  });

  // in grace: dueDate passed, graceEndDate not passed
  const inGrace = await prisma.pSSRefill.findMany({
    where: {
      status: "PENDING",
      dueDate: { lt: now },
      graceEndDate: { gte: now },
    },
    include: { verification: { select: { userId: true } } },
    take: 500,
  });

  // expired: graceEndDate passed
  const expired = await prisma.pSSRefill.findMany({
    where: {
      status: "PENDING",
      graceEndDate: { lt: now },
    },
    include: { verification: { select: { userId: true } } },
    take: 500,
  });

  // update statuses
  if (expired.length > 0) {
    await prisma.pSSRefill.updateMany({
      where: { id: { in: expired.map((r) => r.id) } },
      data: { status: "EXPIRED" },
    });
  }

  // STL enforcement (v1): WARNING/LIMITED/SUSPENDED mapping
  const dueSoonUserIds = Array.from(new Set(dueSoon.map((r) => r.verification.userId)));
  const inGraceUserIds = Array.from(new Set(inGrace.map((r) => r.verification.userId)));
  const expiredUserIds = Array.from(new Set(expired.map((r) => r.verification.userId)));

  if (dueSoonUserIds.length > 0) {
    await prisma.profile.updateMany({
      where: { userId: { in: dueSoonUserIds } },
      data: { stlStatus: "WARNING", stlUpdatedAt: now },
    });
  }
  if (inGraceUserIds.length > 0) {
    await prisma.profile.updateMany({
      where: { userId: { in: inGraceUserIds } },
      data: { stlStatus: "LIMITED", stlUpdatedAt: now },
    });
  }
  if (expiredUserIds.length > 0) {
    await prisma.profile.updateMany({
      where: { userId: { in: expiredUserIds } },
      data: { stlStatus: "SUSPENDED", stlScore: { decrement: 10 }, stlUpdatedAt: now },
    });
  }

  // DMO automation: create task application for PSS_REFILL when expired
  const createdTasks: string[] = [];
  for (const r of expired) {
    const task = await prisma.application.create({
      data: {
        type: "PSS_REFILL",
        status: "NEW",
        applicantId: r.verification.userId,
        payload: {
          refillId: r.id,
          verificationId: r.verificationId,
          phase: r.phase,
          dueDate: r.dueDate,
          graceEndDate: r.graceEndDate,
          status: "EXPIRED",
        },
      },
    });
    createdTasks.push(task.id);
    await writeAuditLog({
      actorId: args.actorUserId,
      action: "DMO_TASK_CREATED_FROM_REFILL_EXPIRED",
      targetType: "APPLICATION",
      targetId: task.id,
      metadata: { refillId: r.id, userId: r.verification.userId },
    });
  }

  await writeAuditLog({
    actorId: args.actorUserId,
    action: "PSS_REFILL_SCAN_COMPLETED",
    targetType: "OTHER",
    targetId: "pss_refill_scan",
    metadata: {
      dueSoon: dueSoon.length,
      inGrace: inGrace.length,
      expired: expired.length,
      createdTasks: createdTasks.length,
    },
  });

  const touchedUsers = Array.from(new Set([...dueSoonUserIds, ...inGraceUserIds, ...expiredUserIds]));
  for (const userId of touchedUsers) {
    await recalcUserStl({ userId, actorId: args.actorUserId, reason: "PSS_REFILL_SCAN" });
    await runDmoTrustEngine({
      userId,
      actorId: args.actorUserId,
      reason: "REFILL_UPDATE",
    }).catch(() => undefined);
  }

  for (const userId of expiredUserIds) {
    await triggerAutomationEvent({
      event: "REFILL_EXPIRED",
      actorUserId: args.actorUserId,
      correlationId: `refill-expired-${userId}-${now.toISOString()}`,
      data: { userId },
    });
  }

  return {
    dueSoonCount: dueSoon.length,
    inGraceCount: inGrace.length,
    expiredCount: expired.length,
    createdTaskCount: createdTasks.length,
  };
}

