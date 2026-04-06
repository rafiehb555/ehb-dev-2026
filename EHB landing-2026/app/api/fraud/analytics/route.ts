import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [signals, unresolved, penalties] = await Promise.all([
      prisma.fraudSignal.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 500,
        select: {
          entityId: true,
          entityType: true,
          signalType: true,
          resolvedAt: true,
          createdAt: true,
        },
      }),
      prisma.fraudSignal.findMany({
        where: { resolvedAt: null },
        orderBy: { createdAt: "desc" },
        take: 500,
        select: { entityId: true, entityType: true, signalType: true, createdAt: true },
      }),
      prisma.penaltyLog.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { entityId: true, severity: true, action: true, createdAt: true },
      }),
    ]);

    const byDay = new Map<string, number>();
    const tierBreakdown = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    const entityCounts = new Map<string, { entityId: string; entityType: string; count: number }>();

    for (const signal of signals) {
      const day = signal.createdAt.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);

      const key = `${signal.entityType}:${signal.entityId}`;
      const current = entityCounts.get(key) ?? {
        entityId: signal.entityId,
        entityType: signal.entityType,
        count: 0,
      };
      current.count += 1;
      entityCounts.set(key, current);
    }

    for (const signal of unresolved) {
      const entityKey = `${signal.entityType}:${signal.entityId}`;
      const count = entityCounts.get(entityKey)?.count ?? 1;
      if (count >= 4) tierBreakdown.CRITICAL += 1;
      else if (count >= 3) tierBreakdown.HIGH += 1;
      else if (count >= 2) tierBreakdown.MEDIUM += 1;
      else tierBreakdown.LOW += 1;
    }

    const topFlagged = Array.from(entityCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const falsePositives = signals.filter((signal) => signal.resolvedAt !== null).length;

    return ok({
      window: "7d",
      signalsPerDay: Array.from(byDay.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, count]) => ({ day, count })),
      unresolvedCount: unresolved.length,
      riskDistribution: tierBreakdown,
      topFlagged,
      falsePositiveCount: falsePositives,
      penaltiesIssued: penalties.length,
      latestPenalties: penalties.slice(0, 10),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
