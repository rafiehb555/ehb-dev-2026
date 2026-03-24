import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";
import { PssDecisionSchema } from "@/lib/pss/schemas";
import { triggerAutomationEvent } from "@/lib/automation/engine";
import { calculateRiskForCase } from "@/lib/pss/intelligence";

function addMonths(d: Date, months: number) {
  const out = new Date(d);
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = PssDecisionSchema.parse(await req.json());
    const now = new Date();

    const verification = await prisma.pSSVerification.findUnique({
      where: { id: body.caseId },
      select: { id: true, userId: true, phaseCompleted: true, riskLevel: true },
    });
    if (!verification) return fail(404, "NOT_FOUND", "PSS case not found");

    const risk = await calculateRiskForCase(body.caseId);
    if (risk && body.decision === "APPROVED" && risk.level === "high") {
      return fail(
        409,
        "HIGH_RISK_MANUAL_REVIEW_REQUIRED",
        "High-risk case cannot be final approved without manual override"
      );
    }

    if (body.decision === "REJECTED") {
      await prisma.pSSVerification.update({
        where: { id: verification.id },
        data: {
          status: "REJECTED",
          currentStep: "FINAL_DECISION",
          riskScore: risk?.score ?? undefined,
          riskLevel: risk?.level ?? undefined,
          lastVerifiedAt: now,
        },
      });

      await prisma.profile.updateMany({
        where: { userId: verification.userId },
        data: {
          verificationStatus: "REJECTED",
          stlStatus: "LIMITED",
          stlUpdatedAt: now,
        },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "PSS_FINAL_REJECTED",
        targetType: "USER",
        targetId: verification.userId,
        metadata: { caseId: body.caseId, notes: body.notes ?? null },
      });

      await recalcUserStl({
        userId: verification.userId,
        actorId: auth.user.userId,
        reason: "PSS_FINAL_REJECTED",
      });

      await triggerAutomationEvent({
        event: "STL_UPDATED",
        actorUserId: auth.user.userId,
        correlationId: `stl-updated-pss-rejected-${body.caseId}`,
        data: { userId: verification.userId, entityType: "USER", entityId: verification.userId },
      });

      return ok({ caseId: body.caseId, decision: body.decision });
    }

    const updatedVerification = await prisma.pSSVerification.update({
      where: { id: verification.id },
      data: {
        status: "VERIFIED",
        currentStep: "FINAL_DECISION",
        riskScore: risk?.score ?? undefined,
        riskLevel: risk?.level ?? undefined,
        phaseCompleted: Math.max(verification.phaseCompleted, 6),
        lastVerifiedAt: now,
      },
    });

    await prisma.profile.updateMany({
      where: { userId: verification.userId },
      data: {
        verificationStatus: "VERIFIED",
        stlStatus: "ACTIVE",
        stlUpdatedAt: now,
      },
    });

    const dueDate = addMonths(now, 6);
    const graceEndDate = addDays(dueDate, 7);
    await prisma.pSSRefill.create({
      data: {
        verificationId: verification.id,
        phase: 6,
        dueDate,
        graceEndDate,
        status: "PENDING",
      },
    });

    let dmoApplication:
      | {
          id: string;
        }
      | null = null;
    try {
      dmoApplication = await prisma.application.create({
        data: {
          type: "PSS_VERIFICATION" as any,
          status: "NEW",
          applicantId: verification.userId,
          payload: {
            pssApplicationType: "PSS_VERIFICATION",
            pssVerificationId: verification.id,
            decision: "APPROVED",
            notes: body.notes ?? null,
            riskLevel: risk?.level ?? verification.riskLevel ?? "low",
            riskScore: risk?.score ?? null,
            phaseCompleted: updatedVerification.phaseCompleted,
          },
        },
        select: { id: true },
      });
    } catch {
      dmoApplication = await prisma.application.create({
        data: {
          type: "PSS",
          status: "NEW",
          applicantId: verification.userId,
          payload: {
            pssApplicationType: "PSS_VERIFICATION",
            pssVerificationId: verification.id,
            decision: "APPROVED",
            notes: body.notes ?? null,
            riskLevel: risk?.level ?? verification.riskLevel ?? "low",
            riskScore: risk?.score ?? null,
            phaseCompleted: updatedVerification.phaseCompleted,
          },
        },
        select: { id: true },
      });
    }

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PSS_FINAL_APPROVED",
      targetType: "USER",
      targetId: verification.userId,
      metadata: { caseId: body.caseId, notes: body.notes ?? null, dmoApplicationId: dmoApplication.id },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_TASK_CREATED_FROM_PSS_VERIFICATION",
      targetType: "APPLICATION",
      targetId: dmoApplication.id,
      metadata: { pssVerificationId: verification.id, userId: verification.userId },
    });

    await recalcUserStl({
      userId: verification.userId,
      actorId: auth.user.userId,
      reason: "PSS_FINAL_APPROVED",
    });

    await triggerAutomationEvent({
      event: "STL_UPDATED",
      actorUserId: auth.user.userId,
      correlationId: `stl-updated-pss-approved-${body.caseId}`,
      data: { userId: verification.userId, entityType: "USER", entityId: verification.userId },
    });

    await triggerAutomationEvent({
      event: "PSS_VERIFIED",
      actorUserId: auth.user.userId,
      correlationId: `pss-final-${body.caseId}`,
      data: {
        userId: verification.userId,
        caseId: verification.id,
        riskLevel: verification.riskLevel ?? "low",
        riskScore: risk?.score ?? null,
      },
    });

    return ok({
      caseId: body.caseId,
      decision: body.decision,
      dmoApplicationId: dmoApplication.id,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

