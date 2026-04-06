import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";
import { syncApplicantRiskApplications, syncCrbFraudSignals } from "@/lib/fraud/orchestration";

const DecisionSchema = z.object({
  applicationId: z.string().cuid(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().max(5000).optional(),
  expiryMonths: z.coerce.number().int().min(6).max(12).optional(),
});

function addMonths(d: Date, months: number) {
  const out = new Date(d);
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = DecisionSchema.parse(await req.json());
    const now = new Date();
    const expiryDate = addMonths(now, body.expiryMonths ?? 12);

    const result = await prisma.$transaction(async (tx) => {
      const app = await tx.cRBApplication.findUnique({
        where: { id: body.applicationId },
        include: { inspection: true, certificate: true },
      });
      if (!app) return null;

      if (body.decision === "REJECTED") {
        const rejected = await tx.cRBApplication.update({
          where: { id: app.id },
          data: { status: "REJECTED", notes: body.notes ?? app.notes },
        });
        await writeAuditLog({
          actorId: auth.user.userId,
          action: "CRB_DECISION_REJECTED",
          targetType: "OTHER",
          targetId: rejected.id,
          metadata: { notes: body.notes ?? null },
        });

      await syncCrbFraudSignals({
        applicationId: rejected.id,
        applicantId: rejected.applicantId,
        decision: "REJECTED",
        actorId: auth.user.userId,
      });

        return { kind: "rejected" as const, app: rejected };
      }

      const cert = await tx.cRBCertificate.upsert({
        where: { applicationId: app.id },
        create: {
          applicationId: app.id,
          entityId: app.applicantId,
          type: app.type,
          industry: app.industry,
          status: "ACTIVE",
          expiryDate,
        },
        update: {
          status: "ACTIVE",
          expiryDate,
        },
      });

      const approved = await tx.cRBApplication.update({
        where: { id: app.id },
        data: { status: "APPROVED", notes: body.notes ?? app.notes },
      });

      const existingDmo = app.dmoTaskId
        ? await tx.application.findUnique({ where: { id: app.dmoTaskId }, select: { id: true } })
        : null;
      let dmoAppId = existingDmo?.id ?? null;
      if (!dmoAppId) {
        const dmo = await tx.application.create({
          data: {
            type: "CRB_CERTIFICATION",
            status: "NEW",
            applicantId: app.applicantId,
            payload: {
              crbApplicationId: app.id,
              certificateId: cert.id,
              decision: "APPROVED",
              source: "CRB_DECISION",
            },
          },
          select: { id: true },
        });
        dmoAppId = dmo.id;
        await tx.cRBApplication.update({
          where: { id: app.id },
          data: { dmoTaskId: dmo.id },
        });
      }

      await tx.registryRecord.create({
        data: {
          entityType: "USER",
          entityId: app.applicantId,
          verificationSource: "CRB",
          status: "VERIFIED",
          issuedAt: now,
          expiryDate,
        },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_DECISION_APPROVED",
        targetType: "OTHER",
        targetId: approved.id,
        metadata: { certificateId: cert.id, dmoApplicationId: dmoAppId, expiryDate: expiryDate.toISOString() },
      });

      return { kind: "approved" as const, app: approved, cert, dmoAppId };
    });

    if (!result) return fail(404, "NOT_FOUND", "CRB application not found");

    await recalcUserStl({
      userId: result.app.applicantId,
      actorId: auth.user.userId,
      reason: `CRB_DECISION_${result.kind.toUpperCase()}`,
    });

    await syncApplicantRiskApplications(result.app.applicantId, auth.user.userId);

    return ok(result, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

