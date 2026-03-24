import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { completeVerificationPhase } from "@/lib/pss/refillEngine";
import { VerifyPssStepSchema } from "@/lib/pss/schemas";
import { calculateRiskForCase } from "@/lib/pss/intelligence";

const STEP_TO_PHASE = {
  IDENTITY: 1,
  DOCUMENTS: 2,
  LIVENESS: 3,
  AML_RISK: 4,
} as const;
const PHASE_TO_STEP = {
  1: "IDENTITY",
  2: "DOCUMENTS",
  3: "LIVENESS",
  4: "AML_RISK",
  5: "FINAL_DECISION",
  6: "FINAL_DECISION",
} as const;

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = VerifyPssStepSchema.parse(await req.json());
    const verification = await prisma.pSSVerification.findUnique({
      where: { id: body.caseId },
      select: { id: true, userId: true },
    });
    if (!verification) return fail(404, "NOT_FOUND", "PSS case not found");

    const phase = STEP_TO_PHASE[body.step];
    if (body.status === "REJECTED") {
      await prisma.pSSStepReview.create({
        data: {
          verificationId: verification.id,
          step: body.step,
          decision: "REJECTED",
          reviewerId: auth.user.userId,
          riskLevel: body.riskLevel ?? "high",
          notes: body.notes,
        },
      });

      await prisma.profile.updateMany({
        where: { userId: verification.userId },
        data: {
          verificationStatus: "REJECTED",
          stlStatus: "LIMITED",
          stlUpdatedAt: new Date(),
        },
      });

      await prisma.pSSVerification.update({
        where: { id: verification.id },
        data: {
          status: "REJECTED",
          currentStep: body.step,
          phaseCompleted: Math.max(phase - 1, 0),
          riskLevel: body.riskLevel ?? "high",
        },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "PSS_STEP_REJECTED",
        targetType: "USER",
        targetId: verification.userId,
        metadata: { caseId: body.caseId, step: body.step, notes: body.notes ?? null },
      });

      const risk = await calculateRiskForCase(body.caseId);
      if (risk) {
        await prisma.pSSVerification.update({
          where: { id: body.caseId },
          data: { riskScore: risk.score, riskLevel: risk.level },
        });
      }

      return ok({ caseId: body.caseId, step: body.step, status: "REJECTED" });
    }

    const result = await completeVerificationPhase({
      actorUserId: auth.user.userId,
      userId: verification.userId,
      phase,
      riskLevel: body.riskLevel,
    });

    await prisma.pSSStepReview.create({
      data: {
        verificationId: verification.id,
        step: body.step,
        decision: "APPROVED",
        reviewerId: auth.user.userId,
        riskLevel: body.riskLevel ?? "low",
        notes: body.notes,
      },
    });

    const nextPhase = Math.min(phase + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6;
    await prisma.pSSVerification.update({
      where: { id: verification.id },
      data: {
        status: "UNDER_REVIEW",
        currentStep: PHASE_TO_STEP[nextPhase],
        riskLevel: body.riskLevel ?? undefined,
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PSS_STEP_APPROVED",
      targetType: "USER",
      targetId: verification.userId,
      metadata: { caseId: body.caseId, step: body.step, notes: body.notes ?? null },
    });

    const risk = await calculateRiskForCase(body.caseId);
    if (risk) {
      await prisma.pSSVerification.update({
        where: { id: body.caseId },
        data: { riskScore: risk.score, riskLevel: risk.level },
      });
      if (risk.level === "high") {
        await writeAuditLog({
          actorId: auth.user.userId,
          action: "PSS_HIGH_RISK_MANUAL_REVIEW_REQUIRED",
          targetType: "PSS_VERIFICATION",
          targetId: body.caseId,
          metadata: risk as any,
        });
      }
    }

    return ok({
      caseId: body.caseId,
      step: body.step,
      status: "APPROVED",
      verification: result.verification,
      refill: result.refill,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

