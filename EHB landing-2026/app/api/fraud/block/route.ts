import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { applyPenalty, calculateRiskScore } from "@/lib/fraud/riskEngine";
import { writeAuditLog } from "@/lib/audit";
import { syncApplicantRiskApplications, syncApplicationRisk } from "@/lib/fraud/orchestration";

const BlockSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(["USER", "APPLICATION", "ORDER", "PROVIDER", "SELLER", "FRANCHISE"]),
  reason: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BlockSchema.parse(await req.json());
    const risk = await calculateRiskScore(body.entityId);
    const severity =
      risk.score >= 81 ? "CRITICAL" : risk.score >= 61 ? "HIGH" : risk.score >= 31 ? "MEDIUM" : "LOW";
    const action =
      body.entityType === "ORDER"
        ? "FUNDS_FROZEN"
        : body.entityType === "APPLICATION"
          ? "LISTING_HIDDEN"
          : "ACCOUNT_SUSPENDED";

    await applyPenalty({
      entityId: body.entityId,
      entityType: body.entityType,
      ruleId: "MANUAL_FRAUD_BLOCK",
      severity,
      action,
      reason: body.reason ?? `Manual fraud block at ${risk.score}/100`,
      confidence: risk.score,
      autoApplied: false,
    });

    let application = null;
    if (body.entityType === "APPLICATION") {
      application = await prisma.application.update({
        where: { id: body.entityId },
        data: {
          status: "UNDER_INSPECTION",
          priority: "CRITICAL",
          riskScore: risk.score,
          riskLevel: risk.tier,
        },
        select: { id: true, applicantId: true, status: true },
      });
      await syncApplicationRisk(application.id, auth.user.userId);
      await syncApplicantRiskApplications(application.applicantId, auth.user.userId);
    }

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRAUD_ENTITY_BLOCKED",
      targetType: body.entityType === "APPLICATION" ? "APPLICATION" : "OTHER",
      targetId: body.entityId,
      metadata: {
        entityType: body.entityType,
        riskScore: risk.score,
        riskTier: risk.tier,
        reason: body.reason ?? null,
      },
    });

    return ok({
      blocked: true,
      entityId: body.entityId,
      entityType: body.entityType,
      risk,
      application,
      message: "Entity has been paused for fraud review.",
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
