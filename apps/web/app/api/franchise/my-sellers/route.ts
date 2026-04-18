/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Franchise Manager — My Assigned Sellers
 *  GET /api/franchise/my-sellers?take=25&skip=0
 *
 *  Returns sellers (FranchiseUser role=SELLER) assigned to this manager's
 *  franchise(s), joined with their SELLER_ONBOARDING Application payload.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";
import { requireSession, isAdmin } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";

export async function GET(req: Request) {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const take = Math.min(100, Math.max(1, Number(url.searchParams.get("take") ?? 25)));
    const skip = Math.max(0, Number(url.searchParams.get("skip") ?? 0));

    // Which franchises does this operator manage?
    const memberships = await prisma.franchiseUser.findMany({
      where: isAdmin(auth.user.role)
        ? { role: { not: "SELLER" } }
        : { userId: auth.user.userId, role: { not: "SELLER" } },
      select: { franchiseId: true, role: true },
    });

    const franchiseIds = memberships.map((m) => m.franchiseId);
    if (!isAdmin(auth.user.role) && franchiseIds.length === 0) {
      return ok({ total: 0, take, skip, rows: [] });
    }

    const sellerWhere: any = { role: "SELLER" };
    if (!isAdmin(auth.user.role)) sellerWhere.franchiseId = { in: franchiseIds };

    const [total, sellers] = await Promise.all([
      prisma.franchiseUser.count({ where: sellerWhere }),
      prisma.franchiseUser.findMany({
        where: sellerWhere,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          user: { select: { id: true, email: true } },
          franchise: { select: { id: true, name: true, city: true, level: true } },
        },
      }),
    ]);

    // Get their onboarding applications in one shot
    const userIds = sellers.map((s) => s.userId);
    const apps = await prisma.application.findMany({
      where: { type: "SELLER_ONBOARDING" as any, applicantId: { in: userIds } },
      select: { applicantId: true, status: true, payload: true, riskLevel: true, createdAt: true },
    });
    const appByUser = new Map(apps.map((a) => [a.applicantId, a]));

    return ok({
      total,
      take,
      skip,
      rows: sellers.map((s) => {
        const app = appByUser.get(s.userId);
        const p = ((app?.payload ?? {}) as Record<string, unknown>) || {};
        return {
          id: s.id,
          userId: s.userId,
          email: s.user.email,
          assignedAt: s.createdAt,
          franchise: s.franchise,
          storeName: (p.storeName as string) ?? null,
          category: (p.category as string) ?? null,
          country: (p.country as string) ?? null,
          onboardingState: (p.onboardingState as string) ?? null,
          applicationStatus: app?.status ?? null,
          riskLevel: app?.riskLevel ?? null,
        };
      }),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
