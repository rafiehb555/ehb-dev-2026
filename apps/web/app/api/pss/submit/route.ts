/**
 * ═══════════════════════════════════════════════════════════════════════
 *  User-facing PSS submission endpoint.
 *
 *   POST  /api/pss/submit   — create (or top-up) the caller's PSS case
 *                              and attach submitted documents.
 *   GET   /api/pss/submit   — return the caller's current PSS case state.
 *
 *  Admin review endpoint remains /api/pss/verify (restricted).
 *  Flow: user uploads → case created/updated → admin reviews → decision.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";

// ─── Validation ───────────────────────────────────────────────────────

const DocumentSchema = z.object({
  step: z.enum(["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK"]),
  type: z.enum([
    "CNIC",
    "PASSPORT",
    "LICENSE",
    "ADDRESS_PROOF",
    "SELFIE",
    "VIDEO",
    "AML_EVIDENCE",
    "OTHER",
  ]),
  fileUrl: z.string().url(),
  mimeType: z.string().max(120).optional(),
  notes: z.string().max(500).optional(),
});

const SubmitSchema = z.object({
  step: z.enum(["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK"]),
  documents: z.array(DocumentSchema).min(1).max(10),
  livenessPassed: z.boolean().optional(),
  clientMeta: z
    .object({
      userAgent: z.string().max(400).optional(),
      ipHash: z.string().max(200).optional(),
    })
    .optional(),
});

const STEP_TO_PHASE: Record<string, number> = {
  IDENTITY: 1,
  DOCUMENTS: 2,
  LIVENESS: 3,
  AML_RISK: 4,
};

// ─── POST ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = SubmitSchema.parse(await req.json());

    // Upsert the verification case (one per user).
    const existing = await prisma.pSSVerification.findUnique({
      where: { userId: auth.user.userId },
      select: { id: true, status: true, phaseCompleted: true, currentStep: true },
    });

    const verification = existing
      ? await prisma.pSSVerification.update({
          where: { id: existing.id },
          data: {
            status: existing.status === "REJECTED" ? "UNDER_REVIEW" : existing.status,
            currentStep: body.step,
          },
          select: { id: true, status: true, phaseCompleted: true, currentStep: true },
        })
      : await prisma.pSSVerification.create({
          data: {
            userId: auth.user.userId,
            status: "UNDER_REVIEW",
            currentStep: body.step,
            phaseCompleted: 0,
          },
          select: { id: true, status: true, phaseCompleted: true, currentStep: true },
        });

    // Persist each submitted document.
    const createdDocs = await prisma.$transaction(
      body.documents.map((d) =>
        prisma.pSSDocument.create({
          data: {
            verificationId: verification.id,
            step: d.step,
            type: d.type,
            fileUrl: d.fileUrl,
            mimeType: d.mimeType ?? null,
            notes: d.notes ?? null,
            reviewStatus: "PENDING",
          },
          select: { id: true, step: true, type: true, reviewStatus: true },
        }),
      ),
    );

    // Light-touch risk signal — real scoring happens in /api/pss/risk/calculate.
    const phase = STEP_TO_PHASE[body.step] ?? 1;
    const baseScore = Math.min(60, phase * 12);

    await prisma.pSSVerification.update({
      where: { id: verification.id },
      data: {
        riskScore: baseScore,
        riskLevel: baseScore <= 30 ? "low" : baseScore <= 60 ? "medium" : "high",
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PSS_USER_SUBMISSION",
      targetType: "PSS_VERIFICATION",
      targetId: verification.id,
      metadata: {
        step: body.step,
        documentCount: createdDocs.length,
        livenessPassed: body.livenessPassed ?? null,
        userAgent: body.clientMeta?.userAgent ?? null,
      },
    });

    return ok(
      {
        case: {
          id: verification.id,
          status: verification.status,
          currentStep: body.step,
          phaseCompleted: verification.phaseCompleted,
        },
        documents: createdDocs,
        nextStep: nextStepAfter(body.step),
      },
      { status: existing ? 200 : 201 },
    );
  } catch (err) {
    return handleRouteError(err);
  }
}

// ─── GET ──────────────────────────────────────────────────────────────

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const verification = await prisma.pSSVerification.findUnique({
      where: { userId: auth.user.userId },
      select: {
        id: true,
        status: true,
        currentStep: true,
        phaseCompleted: true,
        riskScore: true,
        riskLevel: true,
        lastVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        documents: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            step: true,
            type: true,
            reviewStatus: true,
            reviewedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!verification) {
      return ok({ case: null, documents: [], nextStep: "IDENTITY" });
    }

    return ok({
      case: {
        id: verification.id,
        status: verification.status,
        currentStep: verification.currentStep,
        phaseCompleted: verification.phaseCompleted,
        riskScore: verification.riskScore,
        riskLevel: verification.riskLevel,
        lastVerifiedAt: verification.lastVerifiedAt,
        createdAt: verification.createdAt,
        updatedAt: verification.updatedAt,
      },
      documents: verification.documents,
      nextStep: nextStepAfter(verification.currentStep),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

// ─── helpers ──────────────────────────────────────────────────────────

function nextStepAfter(step: string): string {
  switch (step) {
    case "IDENTITY":
      return "DOCUMENTS";
    case "DOCUMENTS":
      return "LIVENESS";
    case "LIVENESS":
      return "AML_RISK";
    case "AML_RISK":
      return "FINAL_DECISION";
    default:
      return "FINAL_DECISION";
  }
}
