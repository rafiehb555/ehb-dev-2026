/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — DMO Approval Gate
 *  POST /api/gosellr/dmo/approve
 *
 *  DMO officer / admin approves (or rejects) a SELLER_ONBOARDING
 *  application. On approval, auto-triggers franchise assignment if
 *  `autoAssignFranchise` is true.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";

const DmoDecisionSchema = z.object({
  applicationId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED", "IN_REVIEW"]),
  notes: z.string().max(1000).optional(),
  autoAssignFranchise: z.boolean().optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = DmoDecisionSchema.parse(await req.json());

    const application = await prisma.application.findUnique({
      where: { id: body.applicationId },
      select: { id: true, applicantId: true, type: true, status: true, payload: true },
    });
    if (!application) return fail(404, "NOT_FOUND", "Application not found");
    if (String(application.type) !== "SELLER_ONBOARDING") {
      return fail(400, "BAD_TYPE", "Application is not SELLER_ONBOARDING");
    }

    const currentPayload = (application.payload ?? {}) as Record<string, unknown>;
    const nextPayload = {
      ...currentPayload,
      dmoDecision: body.decision,
      dmoNotes: body.notes ?? null,
      dmoReviewedAt: new Date().toISOString(),
      dmoReviewerId: auth.user.userId,
      onboardingState:
        body.decision === "APPROVED"
          ? "PENDING_FRANCHISE_ASSIGNMENT"
          : body.decision === "REJECTED"
          ? "REJECTED"
          : "UNDER_DMO_REVIEW",
    };

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: body.decision as any,
        assignedToId: auth.user.userId,
        payload: nextPayload,
      },
      select: { id: true, status: true, applicantId: true, payload: true },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: `GOSELLR_DMO_${body.decision}`,
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: { notes: body.notes ?? null, storeName: currentPayload.storeName ?? null },
    });

    // ─── Auto franchise assignment on approval ──────────────────────
    let franchiseLink: unknown = null;
    if (body.decision === "APPROVED" && body.autoAssignFranchise !== false) {
      const country = String((currentPayload as any).country ?? "").trim();
      if (country) {
        const franchise = await prisma.franchise.findFirst({
          where: { country: { equals: country, mode: "insensitive" } as any, status: "active" },
          orderBy: [{ level: "asc" }, { createdAt: "asc" }], // prefer COUNTRY > CORPORATE > SUB
          select: { id: true, name: true, country: true, level: true },
        });
        if (franchise) {
          franchiseLink = await prisma.franchiseUser
            .upsert({
              where: { userId_franchiseId: { userId: updated.applicantId, franchiseId: franchise.id } },
              update: { role: "SELLER" },
              create: { userId: updated.applicantId, franchiseId: franchise.id, role: "SELLER" },
              select: { id: true, franchiseId: true, role: true },
            })
            .catch(() => null);

          if (franchiseLink) {
            await prisma.application.update({
              where: { id: application.id },
              data: {
                payload: {
                  ...nextPayload,
                  franchiseId: franchise.id,
                  franchiseName: franchise.name,
                  onboardingState: "FRANCHISE_ASSIGNED",
                },
              },
            });
            await writeAuditLog({
              actorId: auth.user.userId,
              action: "GOSELLR_FRANCHISE_AUTO_ASSIGNED",
              targetType: "USER",
              targetId: updated.applicantId,
              metadata: { franchiseId: franchise.id, country },
            });
          }
        }
      }
    }

    return ok({
      application: { id: updated.id, status: updated.status },
      franchiseLink,
      nextStep: body.decision === "APPROVED" ? "CRB_CERTIFICATION" : "DMO_RESUBMIT",
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
