import { z } from "zod";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession, isAdmin } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { buildEscrowTimeline } from "@/lib/marketplace/escrowTimeline";
import { buildOrderActions, canUpdateFulfillmentFixed, isValidStatusTransition } from "@/lib/marketplace/orderPolicy";

const PatchOrderSchema = z
  .object({
    status: z.enum(["SHIPPED", "DELIVERED", "CANCELLED"]),
    trackingNumber: z.string().max(120).optional(),
  })
  .refine((d) => !d.trackingNumber?.trim() || d.status === "SHIPPED", {
    message: "trackingNumber is only used when status is SHIPPED",
  });

export async function GET(_req: Request, ctx: { params: { orderId: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const orderId = ctx.params.orderId;
    if (!orderId?.trim()) return fail(400, "VALIDATION", "orderId required");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, imageUrl: true } },
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const uid = auth.user.userId;
    const canView =
      order.buyerId === uid ||
      order.sellerId === uid ||
      auth.user.role === "FRANCHISE" ||
      isAdmin(auth.user.role);
    if (!canView) return fail(403, "FORBIDDEN", "Not allowed to view this order");

    const meta = (order.metadata ?? null) as Record<string, unknown> | null;
    const escrowTimeline = buildEscrowTimeline(meta, order.createdAt);
    const viewer = buildOrderActions(uid, auth.user.role, order);

    return ok({
      order,
      viewer,
      escrowTimeline,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: Request, ctx: { params: { orderId: string } }) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN", "SELLER"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const orderId = ctx.params.orderId;
    if (!orderId?.trim()) return fail(400, "VALIDATION", "orderId required");

    const body = PatchOrderSchema.parse(await req.json());

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const uid = auth.user.userId;
    const next = body.status as OrderStatus;

    if (!canUpdateFulfillmentFixed(uid, auth.user.role, order, next)) {
      return fail(403, "FORBIDDEN", "Not allowed to set this status");
    }

    if (order.status === "CANCELLED" || order.status === "DELIVERED") {
      return fail(409, "CONFLICT", "Order is already final");
    }

    if (!isValidStatusTransition(order.status, next)) {
      return fail(400, "VALIDATION", `Cannot move from ${order.status} to ${next}`);
    }

    const prevMeta = (order.metadata ?? {}) as Record<string, unknown>;
    const newMeta: Record<string, unknown> = { ...prevMeta };
    if (next === "SHIPPED") {
      newMeta.shippedAt = new Date().toISOString();
      if (body.trackingNumber?.trim()) {
        newMeta.trackingNumber = body.trackingNumber.trim();
      }
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: next,
        metadata: newMeta as object,
      },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, imageUrl: true } },
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    await writeAuditLog({
      actorId: uid,
      action: "MARKETPLACE_ORDER_STATUS",
      targetType: "OTHER",
      targetId: order.id,
      metadata: { from: order.status, to: next, tracking: body.trackingNumber ?? null },
    });

    const meta = (updated.metadata ?? null) as Record<string, unknown> | null;
    const escrowTimeline = buildEscrowTimeline(meta, updated.createdAt);
    const viewer = buildOrderActions(uid, auth.user.role, updated);

    return ok({
      order: updated,
      viewer,
      escrowTimeline,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
