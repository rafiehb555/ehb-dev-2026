/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Public Product Listing
 *  GET /api/gosellr/products?category=&q=&sort=stl|price_asc|price_desc&take=&skip=
 *
 *  Public (no auth). Returns active products joined with seller email +
 *  seller's Profile.stlLevel/stlScore (for the trust badge on each card).
 * ═══════════════════════════════════════════════════════════════════════
 */

import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") ?? undefined;
    const q = url.searchParams.get("q") ?? undefined;
    const sort = url.searchParams.get("sort") ?? "stl";
    const take = Math.min(60, Math.max(1, Number(url.searchParams.get("take") ?? 24)));
    const skip = Math.max(0, Number(url.searchParams.get("skip") ?? 0));

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (q) where.name = { contains: q, mode: "insensitive" };

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc")  orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        take: sort === "stl" ? take * 2 : take, // fetch a bit more when we sort by STL in-memory
        skip,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          price: true,
          stock: true,
          imageUrl: true,
          rating: true,
          createdAt: true,
          seller: { select: { id: true, email: true } },
        },
      }),
    ]);

    // Fetch seller STL in one batch
    const sellerIds = [...new Set(products.map((p) => p.seller.id))];
    const profiles = sellerIds.length
      ? await prisma.profile.findMany({
          where: { userId: { in: sellerIds } },
          select: { userId: true, stlLevel: true, stlScore: true },
        })
      : [];
    const stlMap = new Map(profiles.map((p) => [p.userId, p]));

    let rows = products.map((p) => {
      const stl = stlMap.get(p.seller.id);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
        rating: p.rating,
        seller: { id: p.seller.id, email: p.seller.email },
        stlLevel: stl?.stlLevel ?? 0,
        stlScore: stl?.stlScore ?? 0,
      };
    });

    if (sort === "stl") {
      rows = rows
        .sort((a, b) => b.stlLevel - a.stlLevel || b.stlScore - a.stlScore)
        .slice(0, take);
    }

    return ok({ total, take, skip, sort, rows });
  } catch (err) {
    return handleRouteError(err);
  }
}
