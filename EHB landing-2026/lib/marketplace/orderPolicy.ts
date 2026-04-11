import type { OrderStatus, UserRole } from "@prisma/client";
import { isAdmin } from "@/lib/rbac";

export function isValidStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return false;
  if (current === "CANCELLED" || current === "DELIVERED") return false;
  const nextOk: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
  };
  return nextOk[current]?.includes(next) ?? false;
}

export function canUpdateFulfillmentFixed(
  uid: string,
  role: string,
  order: { buyerId: string; sellerId: string; status: OrderStatus },
  next: OrderStatus
): boolean {
  const op = role === "FRANCHISE" || role === "ADMIN" || role === "SUPER_ADMIN";
  if (op) return true;
  const isSeller = order.sellerId === uid;
  const isBuyer = order.buyerId === uid;
  if (next === "CANCELLED" && isBuyer && (order.status === "PENDING" || order.status === "PAID")) return true;
  if (next === "SHIPPED" && isSeller && order.status === "PAID") return true;
  if (next === "DELIVERED" && isSeller && order.status === "SHIPPED") return true;
  return false;
}

export function buildOrderActions(
  uid: string,
  role: string,
  order: { buyerId: string; sellerId: string; status: OrderStatus }
) {
  const canExtendEscrow = role === "FRANCHISE" || isAdmin(role as UserRole);
  const canUpdateStatus = (["SHIPPED", "DELIVERED", "CANCELLED"] as const).some((s) =>
    canUpdateFulfillmentFixed(uid, role, order, s)
  );
  const canPay =
    (order.buyerId === uid || isAdmin(role as UserRole)) && order.status === "PENDING";
  const actions = {
    pay: canPay,
    markShipped:
      canUpdateFulfillmentFixed(uid, role, order, "SHIPPED") &&
      isValidStatusTransition(order.status, "SHIPPED"),
    markDelivered:
      canUpdateFulfillmentFixed(uid, role, order, "DELIVERED") &&
      isValidStatusTransition(order.status, "DELIVERED"),
    cancel:
      canUpdateFulfillmentFixed(uid, role, order, "CANCELLED") &&
      isValidStatusTransition(order.status, "CANCELLED"),
  };
  return { canExtendEscrow, canUpdateStatus, actions };
}
