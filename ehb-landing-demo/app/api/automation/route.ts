import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";
import { isDmoDemoMode } from "@/lib/dmo/demoStore";

const db = prisma as any;

function demoPayload() {
  return {
    stats: {
      activeRules: 24,
      triggersToday: 128,
      autoDecisions: 42,
      fraudAlerts: 6,
    },
    rules: [
      {
        id: "1",
        event: "PSS_VERIFIED",
        action: "Create DMO Application",
        active: true,
      },
      {
        id: "2",
        event: "REFILL_EXPIRED",
        action: "Reduce STL + Hide Listing",
        active: true,
      },
      {
        id: "3",
        event: "STL_UPDATED",
        action: "Refresh Marketplace Ranking",
        active: true,
      },
    ],
    suggestions: [
      "Low-risk cases can be auto-approved with manual override threshold.",
      "Run refill and SLA scans daily to maintain trust integrity.",
    ],
  };
}

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return ok(demoPayload());

  if (!process.env.DATABASE_URL || isDmoDemoMode()) {
    return ok(demoPayload());
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [rules, events, fraudAlerts] = await Promise.all([
      db.automationRule.findMany({
        orderBy: [{ isActive: "desc" }, { priority: "asc" }],
        take: 100,
      }),
      db.automationEvent.findMany({
        where: { createdAt: { gte: todayStart } },
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
      prisma.auditLog.count({
        where: {
          createdAt: { gte: todayStart },
          OR: [
            { action: { contains: "FRAUD", mode: "insensitive" } },
            { action: { contains: "HIGH_RISK", mode: "insensitive" } },
          ],
        },
      }),
    ]);

    const activeRules = rules.filter((r: any) => r.isActive).length;
    const triggersToday = events.length;
    const autoDecisions = events.filter((e: any) => e.status === "DONE").length;

    return ok({
      stats: {
        activeRules,
        triggersToday,
        autoDecisions,
        fraudAlerts,
      },
      rules: rules.map((r: any) => ({
        id: r.id,
        event: r.eventType,
        action: Array.isArray(r.actions) ? r.actions.join(", ") : String(r.actions ?? ""),
        active: Boolean(r.isActive),
      })),
      suggestions: [
        "Auto-approve only low-risk flows and escalate repeated failures.",
        "Keep refill-expired penalties active to protect marketplace trust.",
      ],
    });
  } catch {
    return ok(demoPayload());
  }
}

