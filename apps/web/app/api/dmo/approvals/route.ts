import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/apiResponse";
import { CreateApprovalSchema, ListApprovalsQuerySchema } from "@/lib/dmo/schemas";
import { Prisma } from "@prisma/client";
import { recalcUserStl } from "@/lib/stl/engine";
import { createDemoDecision, isDmoDemoMode, listDemoApprovals } from "@/lib/dmo/demoStore";
import { triggerAutomationEvent } from "@/lib/automation/engine";

export async function GET(req: Request) {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListApprovalsQuerySchema.parse({
      applicationId: url.searchParams.get("applicationId") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    if (isDmoDemoMode()) {
      const approvals = listDemoApprovals({
        applicationId: query.applicationId,
        take: query.take ?? 100,
        skip: query.skip ?? 0,
      });
      return ok({
        approvals,
        page: { take: query.take ?? 100, skip: query.skip ?? 0 },
      });
    }

    const where = query.applicationId ? { applicationId: query.applicationId } : {};
    const approvals = await prisma.approval.findMany({
      where,
      include: {
        approvedBy: { select: { id: true, name: true, email: true, role: true } },
        application: { select: { id: true, applicantId: true, assignedToId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: query.take ?? 100,
      skip: query.skip ?? 0,
    });

    const filtered =
      auth.user.role === "FRANCHISE"
        ? approvals.filter((a) => a.application.assignedToId === auth.user.userId)
        : approvals;

    return ok({
      approvals: filtered.map((a) => ({
        id: a.id,
        applicationId: a.applicationId,
        decision: a.decision,
        notes: a.notes,
        createdAt: a.createdAt,
        approvedBy: a.approvedBy,
      })),
      page: { take: query.take ?? 100, skip: query.skip ?? 0 },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  // Only ADMIN / SUPER_ADMIN can approve/reject.
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = CreateApprovalSchema.parse(await req.json());

    if (isDmoDemoMode()) {
      const result = createDemoDecision({
        applicationId: body.applicationId,
        decision: body.decision,
        notes: body.notes ?? undefined,
      });
      if (!result) return fail(404, "NOT_FOUND", "Application not found");
      return ok(result, { status: 201 });
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const application = await tx.application.findUnique({ where: { id: body.applicationId } });
      if (!application) {
        return null;
      }

      const approval = await tx.approval.create({
        data: {
          applicationId: body.applicationId,
          approvedById: auth.user.userId,
          decision: body.decision,
          notes: body.notes,
        },
      });

      const nextStatus = body.decision === "APPROVED" ? "APPROVED" : "REJECTED";
      const updated = await tx.application.update({
        where: { id: body.applicationId },
        data: { status: nextStatus },
      });

      return { approval, application: updated };
    });

    if (!result) return fail(404, "NOT_FOUND", "Application not found");

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_APPROVAL_RECORDED",
      targetType: "APPROVAL",
      targetId: result.approval.id,
      metadata: { applicationId: body.applicationId, decision: body.decision },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_APPLICATION_STATUS_SET",
      targetType: "APPLICATION",
      targetId: body.applicationId,
      metadata: { status: result.application.status },
    });

    await recalcUserStl({
      userId: result.application.applicantId,
      actorId: auth.user.userId,
      reason: `DMO_APPROVAL_${body.decision}`,
    });

    await triggerAutomationEvent({
      event: "STL_UPDATED",
      actorUserId: auth.user.userId,
      correlationId: `stl-updated-after-dmo-${result.approval.id}`,
      data: { userId: result.application.applicantId, entityType: "USER", entityId: result.application.applicantId },
    });

    if (body.decision === "APPROVED") {
      await triggerAutomationEvent({
        event: "DMO_APPROVED",
        actorUserId: auth.user.userId,
        correlationId: `dmo-approval-${result.approval.id}`,
        data: {
          applicationId: result.application.id,
          userId: result.application.applicantId,
          source: "PSS",
        },
      });
    }

    return ok(result, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

