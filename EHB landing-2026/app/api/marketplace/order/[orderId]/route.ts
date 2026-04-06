import { z } from "zod";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession, isAdmin } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { buildEscrowTimeline } from "@/lib/marketplace/escrowTimeline";

const PatchOrderSchema = z.object({
  status: z.enum(["SHIPPED", "DELIVERED", "CANCELLED"]),
});

function isValidStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return false;
  if (current === "CANCELLED" || current === "DELIVERED") return false;
  const nextOk: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ["SHIPPED", "CANCELLED"],
    PAID: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
  };
  return nextOk[current]?.includes(next) ?? false;
}

function canUpdateFulfillmentFixed(
  uid: string,
  role: string,
  order: { buyerId: string; sellerId: string; status: OrderStatus },
  next: OrderStatus
): boolean {
  const op = role === "FRANCHISE" || role === "ADMIN" || role === "SUPER_ADMIN";
  if (op) return true;
  const isSeller = order.sellerId === uid;
  const isBuyer = order.buyerId === uid;
  if (next === "CANCELLED" && isBuyer && order.status === "PENDING") return true;
  if (next === "SHIPPED" && isSeller && (order.status === "PENDING" || order.status === "PAID")) return true;
  if (next === "DELIVERED" && isSeller && order.status === "SHIPPED") return true;
  return false;
}

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

    const canExtendEscrow = auth.user.role === "FRANCHISE" || isAdmin(auth.user.role);
    const canUpdateStatus = ["SHIPPED", "DELIVERED", "CANCELLED"].some((s) =>
      canUpdateFulfillmentFixed(uid, auth.user.role, order, s as OrderStatus)
    );
    const actions = {
      markShipped:
        canUpdateFulfillmentFixed(uid, auth.user.role, order, "SHIPPED") &&
        isValidStatusTransition(order.status, "SHIPPED"),
      markDelivered:
        canUpdateFulfillmentFixed(uid, auth.user.role, order, "DELIVERED") &&
        isValidStatusTransition(order.status, "DELIVERED"),
      cancel:
        canUpdateFulfillmentFixed(uid, auth.user.role, order, "CANCELLED") &&
        isValidStatusTransition(order.status, "CANCELLED"),
    };

    return ok({
      order,
      viewer: { canExtendEscrow, canUpdateStatus, actions },
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

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: next },
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
      metadata: { from: order.status, to: next },
    });

    const meta = (updated.metadata ?? null) as Record<string, unknown> | null;
    const escrowTimeline = buildEscrowTimeline(meta, updated.createdAt);

    const canExtendEscrow = auth.user.role === "FRANCHISE" || isAdmin(auth.user.role);
    const canUpdateStatus = ["SHIPPED", "DELIVERED", "CANCELLED"].some((s) =>
      canUpdateFulfillmentFixed(uid, auth.user.role, updated, s as OrderStatus)
    );
    const actions = {
      markShipped:
        canUpdateFulfillmentFixed(uid, auth.user.role, updated, "SHIPPED") &&
        isValidStatusTransition(updated.status, "SHIPPED"),
      markDelivered:
        canUpdateFulfillmentFixed(uid, auth.user.role, updated, "DELIVERED") &&
        isValidStatusTransition(updated.status, "DELIVERED"),
      cancel:
        canUpdateFulfillmentFixed(uid, auth.user.role, updated, "CANCELLED") &&
        isValidStatusTransition(updated.status, "CANCELLED"),
    };

    return ok({
      order: updated,
      viewer: { canExtendEscrow, canUpdateStatus, actions },
      escrowTimeline,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
