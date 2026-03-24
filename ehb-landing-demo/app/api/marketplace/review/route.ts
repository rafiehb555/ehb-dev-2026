import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { MarketplaceReviewSchema } from "@/lib/marketplace/schemas";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";

function average(nums: number[]) {
  if (nums.length === 0) return null;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = MarketplaceReviewSchema.parse(await req.json());

    const duplicate = await prisma.auditLog.findFirst({
      where: {
        actorId: auth.user.userId,
        action: "MARKETPLACE_REVIEW_CREATED",
        targetId: body.itemId,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (duplicate) return fail(429, "TOO_MANY_REVIEWS", "Please wait before posting another review");

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "MARKETPLACE_REVIEW_CREATED",
      targetType: "OTHER",
      targetId: body.itemId,
      metadata: {
        kind: body.kind,
        rating: body.rating,
        comment: body.comment ?? null,
      },
    });

    const logs = await prisma.auditLog.findMany({
      where: { action: "MARKETPLACE_REVIEW_CREATED", targetId: body.itemId },
      select: { metadata: true },
      take: 5000,
      orderBy: { createdAt: "desc" },
    });
    const ratings = logs
      .map((l) => {
        const md = (l.metadata ?? {}) as Record<string, unknown>;
        return typeof md.rating === "number" ? md.rating : null;
      })
      .filter((n): n is number => n !== null);
    const avg = average(ratings);

    if (body.kind === "PRODUCT") {
      const product = await prisma.product.findUnique({
        where: { id: body.itemId },
        select: { id: true, sellerId: true },
      });
      if (!product) return fail(404, "NOT_FOUND", "Product not found");
      await prisma.product.update({
        where: { id: product.id },
        data: { rating: avg ?? undefined },
      });
      await recalcUserStl({
        userId: product.sellerId,
        actorId: auth.user.userId,
        reason: "MARKETPLACE_REVIEW_PRODUCT",
      }).catch(() => undefined);
      return ok({ itemId: body.itemId, kind: body.kind, averageRating: avg, reviewsCount: ratings.length }, { status: 201 });
    }

    const provider = await prisma.providerService.findUnique({
      where: { id: body.itemId },
      select: { id: true, userId: true, profileId: true },
    });
    if (!provider) return fail(404, "NOT_FOUND", "Provider service not found");

    if (provider.profileId && avg !== null) {
      await prisma.profile.update({
        where: { id: provider.profileId },
        data: { rating: avg },
      }).catch(() => undefined);
    }

    await recalcUserStl({
      userId: provider.userId,
      actorId: auth.user.userId,
      reason: "MARKETPLACE_REVIEW_SERVICE_PROVIDER",
    }).catch(() => undefined);

    return ok({ itemId: body.itemId, kind: body.kind, averageRating: avg, reviewsCount: ratings.length }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

