import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { TaskIdParamsSchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";
import { isMongoObjectId } from "@/lib/mongoId";

const PatchBookingSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "UNDER_INSPECTION", "APPROVED", "REJECTED"]).optional(),
  notes: z.string().max(5000).nullable().optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
  assignToMe: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
    return ok({
      id: (await ctx.params).id,
      status: "IN_REVIEW",
      message: "Demo booking update applied.",
    });
  }

  try {
    const { id } = TaskIdParamsSchema.parse(await ctx.params);
    const body = PatchBookingSchema.parse(await req.json());

    const existing = await prisma.application.findUnique({
      where: { id },
      include: { applicant: { select: { id: true } }, assignedTo: { select: { id: true } } },
    });
    if (!existing || existing.type !== "SERVICE") return fail(404, "NOT_FOUND", "Booking request not found");

    if (
      !isAdmin(auth.user.role) &&
      existing.assignedToId &&
      existing.assignedToId !== auth.user.userId
    ) {
      return fail(403, "FORBIDDEN", "This booking is assigned to another operator");
    }

    const currentPayload = ((existing.payload ?? {}) as Record<string, unknown>) ?? {};
    const nextPayload = {
      ...currentPayload,
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(body.scheduledFor !== undefined ? { scheduledFor: body.scheduledFor } : {}),
      franchiseBookingUpdatedAt: new Date().toISOString(),
      franchiseBookingUpdatedBy: auth.user.userId,
    };

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.assignToMe ? { assignedToId: auth.user.userId } : {}),
        payload: nextPayload,
      },
      include: {
        applicant: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRANCHISE_BOOKING_UPDATED",
      targetType: "APPLICATION",
      targetId: updated.id,
      metadata: {
        status: updated.status,
        assignToMe: body.assignToMe ?? false,
        scheduledFor: body.scheduledFor ?? null,
      },
    });

    return ok(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
