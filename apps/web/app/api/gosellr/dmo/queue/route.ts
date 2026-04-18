/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — DMO Review Queue
 *  GET /api/gosellr/dmo/queue?status=NEW&take=20&skip=0
 *
 *  Returns SELLER_ONBOARDING applications for DMO / admin review.
 *  Sorted by priority DESC then createdAt ASC (oldest-first within priority).
 * ═══════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";

const ALLOWED_STATUSES = ["NEW", "IN_REVIEW", "UNDER_INSPECTION", "APPROVED", "REJECTED"] as const;

export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status");
    const take = Math.min(100, Math.max(1, Number(url.searchParams.get("take") ?? 20)));
    const skip = Math.max(0, Number(url.searchParams.get("skip") ?? 0));

    const where: any = { type: "SELLER_ONBOARDING" };
    if (statusParam && (ALLOWED_STATUSES as readonly string[]).includes(statusParam)) {
      where.status = statusParam;
    } else {
      where.status = { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] };
    }

    const [total, rows, counts] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        take,
        skip,
        select: {
          id: true,
          status: true,
          priority: true,
          riskScore: true,
          riskLevel: true,
          payload: true,
          createdAt: true,
          applicant: { select: { id: true, email: true } },
        },
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { type: "SELLER_ONBOARDING" as any },
        _count: { _all: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    counts.forEach((c: any) => {
      statusCounts[c.status] = c._count._all;
    });

    return ok({
      total,
      take,
      skip,
      statusCounts,
      rows: rows.map((r) => {
        const p = (r.payload ?? {}) as Record<string, unknown>;
        return {
          id: r.id,
          status: r.status,
          priority: r.priority,
          riskScore: r.riskScore,
          riskLevel: r.riskLevel,
          createdAt: r.createdAt,
          applicant: r.applicant,
          storeName: (p.storeName as string) ?? null,
          category: (p.category as string) ?? null,
          country: (p.country as string) ?? null,
          onboardingState: (p.onboardingState as string) ?? null,
          franchiseName: (p.franchiseName as string) ?? null,
        };
      }),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
