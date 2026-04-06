import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";

type NotificationType = "CRITICAL" | "WARNING" | "INFO" | "FRAUD_ALERT";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  nextAction?: string;
  /** In-app path for deep-link (e.g. /orders/[id]) */
  href?: string;
};

function fallbackNotifications(): NotificationItem[] {
  return [
    {
      id: "n1",
      title: "PSS Verification Required",
      message: "Your identity verification is pending review.",
      type: "WARNING",
      time: new Date().toISOString(),
      nextAction: "Open PSS and complete all verification steps",
    },
    {
      id: "n2",
      title: "Refilling Expiring",
      message: "One verification will expire in 3 days.",
      type: "CRITICAL",
      time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      nextAction: "Complete refill now to avoid STL drop",
    },
  ];
}

function actionFromType(type: NotificationType) {
  if (type === "CRITICAL" || type === "FRAUD_ALERT") return "Take action immediately";
  if (type === "WARNING") return "Review and resolve soon";
  return "No urgent action required";
}

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return ok(fallbackNotifications());

  if (!process.env.DATABASE_URL) return ok(fallbackNotifications());

  try {
    const [applications, logs, refills, fraudApps, marketplaceOrders] = await Promise.all([
      prisma.application.findMany({
        where: { applicantId: auth.user.userId },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, status: true, updatedAt: true, type: true },
      }),
      prisma.sTLLog.findMany({
        where: { entityType: "USER", entityId: auth.user.userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, change: true, reason: true, createdAt: true },
      }),
      prisma.pSSRefill.findMany({
        where: { verification: { userId: auth.user.userId } },
        orderBy: { dueDate: "asc" },
        take: 10,
        select: { id: true, dueDate: true, status: true },
      }),
      prisma.application.findMany({
        where: {
          applicantId: auth.user.userId,
          riskScore: { gte: 61 },
          status: { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, type: true, riskScore: true, updatedAt: true, status: true },
      }),
      prisma.order.findMany({
        where: {
          OR: [{ buyerId: auth.user.userId }, { sellerId: auth.user.userId }],
        },
        orderBy: { updatedAt: "desc" },
        take: 25,
        select: {
          id: true,
          status: true,
          updatedAt: true,
          buyerId: true,
          sellerId: true,
          product: { select: { name: true } },
        },
      }),
    ]);

    const items: NotificationItem[] = [];

    for (const app of applications) {
      const type: NotificationType =
        app.status === "REJECTED" ? "CRITICAL" : app.status === "APPROVED" ? "INFO" : "WARNING";
      items.push({
        id: `app-${app.id}`,
        title: `Application ${app.status}`,
        message: `${app.type} application is currently ${app.status}.`,
        type,
        time: app.updatedAt.toISOString(),
        nextAction: actionFromType(type),
        href: "/dmo/applications",
      });
    }

    for (const log of logs) {
      const change = Number(log.change);
      const type: NotificationType = change < 0 ? "WARNING" : "INFO";
      items.push({
        id: `stl-${log.id}`,
        title: change < 0 ? "STL Score Drop Detected" : "STL Score Updated",
        message: `${log.reason} (${change >= 0 ? "+" : ""}${change.toFixed(2)}).`,
        type,
        time: log.createdAt.toISOString(),
        nextAction: change < 0 ? "Review latest verification and refill actions" : "Keep trust performance stable",
        href: "/verification",
      });
    }

    const now = Date.now();
    for (const refill of refills) {
      const diffDays = Math.ceil((refill.dueDate.getTime() - now) / (1000 * 60 * 60 * 24));
      if (refill.status === "COMPLETED") {
        items.push({
          id: `refill-${refill.id}`,
          title: "Refilling Completed",
          message: "Refilling has been successfully completed.",
          type: "INFO",
          time: refill.dueDate.toISOString(),
          nextAction: "No action required",
          href: "/dmo/refilling",
        });
        continue;
      }
      const type: NotificationType = diffDays <= 0 || refill.status === "EXPIRED" ? "CRITICAL" : diffDays <= 7 ? "WARNING" : "INFO";
      items.push({
        id: `refill-${refill.id}`,
        title: type === "CRITICAL" ? "Refilling Expired" : "Refilling Reminder",
        message:
          type === "CRITICAL"
            ? "Verification refill has expired and may impact STL."
            : `Refilling due in ${Math.max(0, diffDays)} day(s).`,
        type,
        time: refill.dueDate.toISOString(),
        nextAction: type === "CRITICAL" ? "Complete refill now to avoid marketplace impact" : "Schedule refill completion",
        href: "/dmo/refilling",
      });
    }

    for (const app of fraudApps) {
      items.push({
        id: `fraud-${app.id}`,
        title: "Fraud Alert",
        message: `${app.type} application is paused for fraud review at score ${app.riskScore ?? 0}/100.`,
        type: "FRAUD_ALERT",
        time: app.updatedAt.toISOString(),
        nextAction: "Open DMO fraud queue or review your latest verification details",
        href: "/dmo/fraud",
      });
    }

    for (const ord of marketplaceOrders) {
      const productName = ord.product?.name ?? "Product";
      const roleSide = ord.buyerId === auth.user.userId ? "buyer" : "seller";
      let title = "Marketplace order";
      let message = `${productName} — ${ord.status}`;
      let type: NotificationType = "INFO";
      if (ord.status === "PENDING") {
        title = roleSide === "buyer" ? "Payment pending" : "New order to fulfill";
        message =
          roleSide === "buyer"
            ? `Complete payment for ${productName}.`
            : `Buyer has not paid yet for ${productName}.`;
        type = "WARNING";
      } else if (ord.status === "PAID") {
        title = roleSide === "buyer" ? "Payment received" : "Order paid — ready to ship";
        message =
          roleSide === "buyer"
            ? `Payment captured for ${productName}.`
            : `${productName} is paid — mark shipped when dispatched.`;
        type = roleSide === "seller" ? "WARNING" : "INFO";
      } else if (ord.status === "SHIPPED") {
        title = "Order shipped";
        message =
          roleSide === "buyer"
            ? `${productName} is on the way.`
            : `You marked ${productName} as shipped.`;
        type = "INFO";
      } else if (ord.status === "DELIVERED") {
        title = "Order delivered";
        message = `${productName} — delivery completed.`;
        type = "INFO";
      } else if (ord.status === "CANCELLED") {
        title = "Order cancelled";
        message = `${productName} was cancelled.`;
        type = "WARNING";
      }
      items.push({
        id: `order-${ord.id}-${ord.status}`,
        title,
        message,
        type,
        time: ord.updatedAt.toISOString(),
        nextAction: "View order details",
        href: `/orders/${ord.id}`,
      });
    }

    const unique = Array.from(new Map(items.map((n) => [n.id, n])).values()).sort(
      (a, b) => +new Date(b.time) - +new Date(a.time)
    );

    return ok(unique.slice(0, 100));
  } catch {
    return ok(fallbackNotifications());
  }
}

