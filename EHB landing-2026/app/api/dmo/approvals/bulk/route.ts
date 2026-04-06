import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/apiResponse";
import { BulkApprovalSchema } from "@/lib/dmo/schemas";
import { recalcUserStl } from "@/lib/stl/engine";
import { createDemoDecision, isDmoDemoMode } from "@/lib/dmo/demoStore";
import { triggerAutomationEvent } from "@/lib/automation/engine";

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BulkApprovalSchema.parse(await req.json());
    const uniqueIds = [...new Set(body.applicationIds)];
    const nextStatus = body.decision === "APPROVED" ? "APPROVED" : "REJECTED";
    if (isDmoDemoMode()) {
      let updated = 0;
      for (const id of uniqueIds) {
        const done = createDemoDecision({
          applicationId: id,
          decision: body.decision,
          notes: body.notes ?? undefined,
        });
        if (done) updated += 1;
      }
      return ok({ updated, decision: body.decision, status: nextStatus });
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const applications = await tx.application.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true, applicantId: true },
      });
      if (applications.length === 0) return { approvals: [], applications: [] };

      const approvals = await tx.approval.createMany({
        data: applications.map((a) => ({
          applicationId: a.id,
          approvedById: auth.user.userId,
          decision: body.decision,
          notes: body.notes,
        })),
      });

      await tx.application.updateMany({
        where: { id: { in: applications.map((a) => a.id) } },
        data: { status: nextStatus },
      });

      return { approvalsCount: approvals.count, applications };
    });

    for (const application of result.applications) {
      await writeAuditLog({
        actorId: auth.user.userId,
        action: "DMO_APPROVAL_RECORDED_BULK",
        targetType: "APPLICATION",
        targetId: application.id,
        metadata: { decision: body.decision, notes: body.notes ?? null },
      });

      await recalcUserStl({
        userId: application.applicantId,
        actorId: auth.user.userId,
        reason: `DMO_BULK_APPROVAL_${body.decision}`,
      });

      await triggerAutomationEvent({
        event: "STL_UPDATED",
        actorUserId: auth.user.userId,
        correlationId: `stl-updated-bulk-${application.id}`,
        data: { userId: application.applicantId, entityType: "USER", entityId: application.applicantId },
      });

      if (body.decision === "APPROVED") {
        await triggerAutomationEvent({
          event: "DMO_APPROVED",
          actorUserId: auth.user.userId,
          correlationId: `dmo-bulk-approval-${application.id}`,
          data: {
            applicationId: application.id,
            userId: application.applicantId,
            source: "PSS",
          },
        });
      }
    }

    return ok({
      updated: result.applications.length,
      decision: body.decision,
      status: nextStatus,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

