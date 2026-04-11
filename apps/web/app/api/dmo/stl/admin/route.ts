import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { runDmoTrustEngine } from "@/lib/stl/dmoTrustEngine";
import { getLevelMeta } from "@/lib/stl/levels";

const BodySchema = z.object({
  userId: z.string().min(1),
  action: z.enum(["UPGRADE", "DOWNGRADE", "BLOCK", "ADD_PENALTY", "APPROVE_SUPREME", "REJECT_SUPREME"]),
  amount: z.number().min(1).max(1000).optional(),
  note: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BodySchema.parse(await req.json());
    const scoreRow = await prisma.sTLScore.findUnique({
      where: { entityType_entityId: { entityType: "USER", entityId: body.userId } },
      select: { score: true, level: true },
    });
    if (!scoreRow) return fail(404, "NOT_FOUND", "User STL score not found");

    if (body.action === "BLOCK") {
      await prisma.profile.updateMany({
        where: { userId: body.userId },
        data: { stlStatus: "SUSPENDED", stlUpdatedAt: new Date() },
      });
    }

    if (body.action === "ADD_PENALTY") {
      await prisma.penaltyLog.create({
        data: {
          entityId: body.userId,
          entityType: "USER",
          ruleId: "DMO_MANUAL_PENALTY",
          severity: "MEDIUM",
          action: "WARNING_NOTIFICATION",
          reason: body.note ?? "Manual DMO penalty",
          autoApplied: false,
        },
      });
    }

    if (body.action === "APPROVE_SUPREME") {
      const score = Number(scoreRow.score);
      if (score < 96) return fail(400, "INVALID_STATE", "Trust score must be at least 96 for SUPREME approval");
      await prisma.registryRecord.create({
        data: {
          entityType: "USER",
          entityId: body.userId,
          verificationSource: "MANUAL",
          status: "VERIFIED",
          issuedAt: new Date(),
        },
      });
      await prisma.profile.updateMany({
        where: { userId: body.userId },
        data: { stlSupremeApproval: "APPROVED", stlUpdatedAt: new Date() },
      });
    }

    if (body.action === "REJECT_SUPREME") {
      const score = Number(scoreRow.score);
      if (score < 96) return fail(400, "INVALID_STATE", "User must be in SUPREME eligibility range");
      await prisma.profile.updateMany({
        where: { userId: body.userId },
        data: { stlSupremeApproval: "REJECTED", stlUpdatedAt: new Date() },
      });
    }

    if (body.action === "UPGRADE" || body.action === "DOWNGRADE") {
      const currentLevel = Number(scoreRow.level ?? 1);
      const targetLevel = body.action === "UPGRADE" ? Math.min(8, currentLevel + 1) : Math.max(1, currentLevel - 1);
      const meta = getLevelMeta(targetLevel);
      await prisma.sTLScore.update({
        where: { entityType_entityId: { entityType: "USER", entityId: body.userId } },
        data: {
          level: targetLevel,
          score: Math.max(Number(scoreRow.score), meta.min),
          lastUpdated: new Date(),
        },
      });
    }

    await runDmoTrustEngine({
      userId: body.userId,
      actorId: auth.user.userId,
      reason: body.action === "ADD_PENALTY" ? "COMPLAINT_UPDATE" : "VERIFICATION_UPDATE",
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: `DMO_STL_ADMIN_${body.action}`,
      targetType: "USER",
      targetId: body.userId,
      metadata: { amount: body.amount ?? null, note: body.note ?? null },
    });

    return ok({ success: true });
  } catch (err) {
    return handleRouteError(err);
  }
}

