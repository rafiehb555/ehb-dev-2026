import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { okCompressed } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";
import { isDmoDemoMode } from "@/lib/dmo/demoStore";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { enforceRateLimit } from "@/lib/api/rateLimit";

const db = prisma as any;

const QuerySchema = z.object({
  refresh: z.enum(["1", "true"]).optional(),
});

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

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, { route: "api:automation", maxRequests: 50, windowMs: 60_000 });
  if (!limited.ok) return limited.response;

  QuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));

  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return okCompressed(req, demoPayload());

  if (!process.env.DATABASE_URL || isDmoDemoMode()) {
    return okCompressed(req, demoPayload());
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [rules, events, fraudAlerts, aiSnapshot] = await Promise.all([
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
      buildStlFullSnapshot(auth.user.userId).catch(() => null),
    ]);

    const activeRules = rules.filter((r: any) => r.isActive).length;
    const triggersToday = events.length;
    const autoDecisions = events.filter((e: any) => e.status === "DONE").length;

    return okCompressed(req, {
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
        aiSnapshot?.ai.guide ?? "Auto-approve only low-risk flows and escalate repeated failures.",
        ...(aiSnapshot?.ai.recommendations ?? []),
        "Keep refill-expired penalties active to protect marketplace trust.",
      ],
    });
  } catch {
    return okCompressed(req, demoPayload());
  }
}
