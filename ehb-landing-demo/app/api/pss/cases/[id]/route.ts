import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { PssCaseIdParamsSchema } from "@/lib/pss/schemas";
import { detectFraudForCase, refillAlertFromDueDate } from "@/lib/pss/intelligence";

const STEPS = ["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK", "FINAL_DECISION"] as const;

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { id } = PssCaseIdParamsSchema.parse(ctx.params);
    const verification = await prisma.pSSVerification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            country: true,
            role: true,
            profile: {
              select: { verificationStatus: true, stlStatus: true, stlScore: true, stlUpdatedAt: true },
            },
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            step: true,
            type: true,
            fileUrl: true,
            mimeType: true,
            reviewStatus: true,
            notes: true,
            createdAt: true,
          },
        },
        stepReviews: {
          orderBy: { createdAt: "desc" },
          include: {
            reviewer: { select: { id: true, name: true, email: true } },
          },
        },
        refills: {
          where: { status: "PENDING" },
          orderBy: { dueDate: "asc" },
          take: 1,
        },
      },
    });

    if (!verification) return fail(404, "NOT_FOUND", "PSS case not found");
    if (auth.user.role === "USER" && verification.userId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");

    const stepStatuses = STEPS.map((step, idx) => {
      const stepNumber = idx + 1;
      if (verification.user.profile?.verificationStatus === "REJECTED" && stepNumber >= verification.phaseCompleted) {
        return { step, status: "REJECTED" as const };
      }
      if (verification.phaseCompleted >= stepNumber) return { step, status: "APPROVED" as const };
      if (verification.phaseCompleted + 1 === stepNumber) return { step, status: "IN_PROGRESS" as const };
      return { step, status: "PENDING" as const };
    });

    const latestReviewByStep = new Map(
      verification.stepReviews.map((r) => [r.step, r] as const)
    );
    const docsByStep = {
      IDENTITY: verification.documents.filter((d) => d.step === "IDENTITY"),
      DOCUMENTS: verification.documents.filter((d) => d.step === "DOCUMENTS"),
      LIVENESS: verification.documents.filter((d) => d.step === "LIVENESS"),
      AML_RISK: verification.documents.filter((d) => d.step === "AML_RISK"),
    };
    const identityReviewMeta =
      (latestReviewByStep.get("IDENTITY")?.metadata as Record<string, unknown> | null) ?? null;
    const livenessMeta =
      (latestReviewByStep.get("LIVENESS")?.metadata as Record<string, unknown> | null) ?? null;
    const amlMeta =
      (latestReviewByStep.get("AML_RISK")?.metadata as Record<string, unknown> | null) ?? null;

    const refillAlert = refillAlertFromDueDate(verification.refills[0]?.dueDate);
    const fraud = await detectFraudForCase(verification.id);

    return ok({
      case: {
        id: verification.id,
        userId: verification.userId,
        user: {
          id: verification.user.id,
          name: verification.user.name,
          email: verification.user.email,
          country: verification.user.country ?? null,
          role: verification.user.role,
        },
        profile: verification.user.profile,
        phaseCompleted: verification.phaseCompleted,
        riskLevel: verification.riskLevel ?? "low",
        riskScore: verification.riskScore ?? null,
        lastVerifiedAt: verification.lastVerifiedAt,
        updatedAt: verification.updatedAt,
        steps: stepStatuses,
        stepContent: {
          identity: {
            name: verification.user.name,
            dob: typeof identityReviewMeta?.dob === "string" ? identityReviewMeta.dob : null,
            idNumber: typeof identityReviewMeta?.idNumber === "string" ? identityReviewMeta.idNumber : null,
            latestReview: latestReviewByStep.get("IDENTITY")
              ? {
                  decision: latestReviewByStep.get("IDENTITY")!.decision,
                  notes: latestReviewByStep.get("IDENTITY")!.notes,
                  reviewer: latestReviewByStep.get("IDENTITY")!.reviewer,
                  createdAt: latestReviewByStep.get("IDENTITY")!.createdAt,
                }
              : null,
          },
          documents: docsByStep.DOCUMENTS.map((d) => ({
            id: d.id,
            type: d.type,
            fileUrl: d.fileUrl,
            mimeType: d.mimeType,
            reviewStatus: d.reviewStatus,
            notes: d.notes,
            createdAt: d.createdAt,
          })).concat(
            docsByStep.IDENTITY.map((d) => ({
              id: d.id,
              type: d.type,
              fileUrl: d.fileUrl,
              mimeType: d.mimeType,
              reviewStatus: d.reviewStatus,
              notes: d.notes,
              createdAt: d.createdAt,
            }))
          ),
          liveness: {
            faceMatchScore:
              typeof livenessMeta?.faceMatchScore === "number" ? livenessMeta.faceMatchScore : null,
            selfieUrl:
              docsByStep.LIVENESS.find((d) => d.type === "SELFIE")?.fileUrl ?? null,
            videoUrl:
              docsByStep.LIVENESS.find((d) => d.type === "VIDEO")?.fileUrl ?? null,
            latestReview: latestReviewByStep.get("LIVENESS")
              ? {
                  decision: latestReviewByStep.get("LIVENESS")!.decision,
                  notes: latestReviewByStep.get("LIVENESS")!.notes,
                  reviewer: latestReviewByStep.get("LIVENESS")!.reviewer,
                  createdAt: latestReviewByStep.get("LIVENESS")!.createdAt,
                }
              : null,
          },
          aml: {
            result:
              typeof amlMeta?.result === "string" ? amlMeta.result : "PENDING",
            flags: Array.isArray(amlMeta?.flags)
              ? amlMeta.flags.filter((f): f is string => typeof f === "string")
              : [],
            latestReview: latestReviewByStep.get("AML_RISK")
              ? {
                  decision: latestReviewByStep.get("AML_RISK")!.decision,
                  notes: latestReviewByStep.get("AML_RISK")!.notes,
                  reviewer: latestReviewByStep.get("AML_RISK")!.reviewer,
                  createdAt: latestReviewByStep.get("AML_RISK")!.createdAt,
                }
              : null,
          },
        },
        fraudStatus: fraud?.status ?? "SAFE",
        fraudReasons: fraud?.reasons ?? [],
        nextRefill: verification.refills[0] ?? null,
        refillAlert: refillAlert.status,
        refillDaysRemaining: refillAlert.daysRemaining,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

