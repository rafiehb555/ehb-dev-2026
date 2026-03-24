import { prisma } from "@/lib/prisma";
import { isAdmin, isFranchise, requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/apiResponse";
import { DmoIdParamsSchema, PatchApplicationSchema } from "@/lib/dmo/schemas";
import { getDemoApplicationById, isDmoDemoMode, patchDemoApplication } from "@/lib/dmo/demoStore";

const TRANSITIONS: Record<string, string[]> = {
  NEW: ["IN_REVIEW", "UNDER_INSPECTION", "REJECTED", "APPROVED"],
  IN_REVIEW: ["UNDER_INSPECTION", "REJECTED", "APPROVED"],
  UNDER_INSPECTION: ["REJECTED", "APPROVED"],
  APPROVED: [],
  REJECTED: [],
};

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { id } = DmoIdParamsSchema.parse(ctx.params);
    if (isDmoDemoMode()) {
      const application = getDemoApplicationById(id);
      if (!application) return fail(404, "NOT_FOUND", "Application not found");
      return ok({ application });
    }
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        approvals: {
          orderBy: { createdAt: "desc" },
          include: { approvedBy: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
    });
    if (!application) return fail(404, "NOT_FOUND", "Application not found");

    // RBAC: Admins can view all. Franchise can view assigned only. Users can view own only.
    if (
      !isAdmin(auth.user.role) &&
      !(isFranchise(auth.user.role) && application.assignedToId === auth.user.userId) &&
      !(auth.user.role === "USER" && application.applicantId === auth.user.userId)
    ) {
      return fail(403, "FORBIDDEN", "Forbidden");
    }

    return ok({ application });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { id } = DmoIdParamsSchema.parse(ctx.params);
    const body = PatchApplicationSchema.parse(await req.json());
    if (isDmoDemoMode()) {
      const existing = getDemoApplicationById(id);
      if (!existing) return fail(404, "NOT_FOUND", "Application not found");
      if (body.status && !TRANSITIONS[existing.status]?.includes(body.status)) {
        return fail(409, "INVALID_STATUS_TRANSITION", `Cannot change status from ${existing.status} to ${body.status}`);
      }
      const application = patchDemoApplication({
        id,
        status: body.status as any,
        assignedToId: body.assignedToId,
        actorId: auth.user.userId,
      });
      if (!application) return fail(404, "NOT_FOUND", "Application not found");
      return ok({ application });
    }
    const existing = await prisma.application.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return fail(404, "NOT_FOUND", "Application not found");
    if (body.status && !TRANSITIONS[existing.status]?.includes(body.status)) {
      return fail(409, "INVALID_STATUS_TRANSITION", `Cannot change status from ${existing.status} to ${body.status}`);
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.assignedToId !== undefined ? { assignedToId: body.assignedToId } : {}),
      },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_APPLICATION_UPDATED",
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: { status: application.status, assignedToId: application.assignedToId ?? null },
    });

    return ok({ application });
  } catch (err) {
    return handleRouteError(err);
  }
}

