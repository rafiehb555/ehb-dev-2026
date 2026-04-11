import { prisma } from "@/lib/prisma";
import { resolveStlLevelFromScoreAndDb } from "@/lib/stl/engine";
import { isDevDemoDatasetEnabled } from "@/lib/demo/demoFallback";
import { DEMO_MARKETPLACE_ITEMS } from "@/lib/demo/demoMarketplaceItems";
import type { MarketplaceListQuerySchema } from "./schemas";
import type { z } from "zod";

type Query = z.infer<typeof MarketplaceListQuerySchema>;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export type MarketplaceItem = {
  kind: "SERVICE_PROVIDER" | "PRODUCT";
  id: string;
  name: string;
  category: string | null;
  subtitle: string;
  industry: { id: string; name: string; slug: string } | null;
  stlScore: number;
  stlLevel: number;
  rating: number | null;
  availability: boolean;
  location: string | null;
  distanceKm: number | null;
  industryBadges: Array<{ id: string; name: string; slug: string }>;
  rankScore: number;
};

async function getIndustryId(industry: string | undefined) {
  if (!industry) return null;
  const row = await prisma.industry.findFirst({
    where: { OR: [{ id: industry }, { slug: industry }, { name: { equals: industry, mode: "insensitive" } }] },
    select: { id: true },
  });
  return row?.id ?? null;
}

export async function listMarketplaceItems(query: Query) {
  const wantsServices = query.type === "ALL" || query.type === "SERVICES";
  const wantsProducts = query.type === "ALL" || query.type === "PRODUCTS";
  const industryId = await getIndustryId(query.industry);
  const q = query.q?.trim();
  const hasGeo = query.lat !== undefined && query.lng !== undefined;
  const radiusKm = query.radiusKm ?? 50;
  const results: MarketplaceItem[] = [];

  if (wantsServices) {
    const where: any = { isActive: true };
    if (industryId) where.service = { industryId };
    if (q) {
      where.OR = [
        { service: { name: { contains: q, mode: "insensitive" } } },
        { service: { category: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const providers = await prisma.providerService.findMany({
      where,
      include: {
        service: { include: { industry: { select: { id: true, name: true, slug: true } } } },
        user: { select: { id: true, name: true } },
        profile: { select: { rating: true } },
      },
      take: 300,
      orderBy: { updatedAt: "desc" },
    });

    const userIds = Array.from(new Set(providers.map((p) => p.userId)));
    const serviceIds = Array.from(new Set(providers.map((p) => p.serviceId)));
    const [userStlRows, serviceStlRows, companyIndustryRows, serviceIndustryRows] = await Promise.all([
      prisma.sTLScore.findMany({
        where: { entityType: "USER", entityId: { in: userIds } },
        select: { entityId: true, score: true, level: true },
      }),
      prisma.sTLScore.findMany({
        where: { entityType: "SERVICE", entityId: { in: serviceIds } },
        select: { entityId: true, score: true, level: true },
      }),
      prisma.industryVerification.findMany({
        where: {
          entityType: "COMPANY",
          entityId: { in: userIds },
          status: "VERIFIED",
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        },
        select: { entityId: true, industry: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.industryVerification.findMany({
        where: {
          entityType: "SERVICE",
          entityId: { in: serviceIds },
          status: "VERIFIED",
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        },
        select: { entityId: true, industry: { select: { id: true, name: true, slug: true } } },
      }),
    ]);

    const userStlMap = new Map(
      userStlRows.map((x) => {
        const score = Number(x.score);
        const level = resolveStlLevelFromScoreAndDb(score, x.level) ?? 1;
        return [x.entityId, { score, level }] as const;
      })
    );
    const serviceStlMap = new Map(
      serviceStlRows.map((x) => {
        const score = Number(x.score);
        const level = resolveStlLevelFromScoreAndDb(score, x.level) ?? 1;
        return [x.entityId, { score, level }] as const;
      })
    );
    const companyMap = new Map<string, Array<{ id: string; name: string; slug: string }>>();
    for (const row of companyIndustryRows) {
      const arr = companyMap.get(row.entityId) ?? [];
      arr.push(row.industry);
      companyMap.set(row.entityId, arr);
    }
    const serviceMap = new Map<string, Array<{ id: string; name: string; slug: string }>>();
    for (const row of serviceIndustryRows) {
      const arr = serviceMap.get(row.entityId) ?? [];
      arr.push(row.industry);
      serviceMap.set(row.entityId, arr);
    }

    for (const p of providers) {
      const stl = serviceStlMap.get(p.id) ?? userStlMap.get(p.userId) ?? { score: 0, level: 1 };
      const rating = p.profile?.rating ? Number(p.profile.rating) : null;
      if (query.minRating && (rating ?? 0) < query.minRating) continue;
      if (query.minStlLevel && stl.level < query.minStlLevel) continue;

      const lat = p.locationLat ? Number(p.locationLat) : null;
      const lng = p.locationLng ? Number(p.locationLng) : null;
      const distanceKm =
        hasGeo && lat !== null && lng !== null ? haversineKm(query.lat!, query.lng!, lat, lng) : null;
      if (distanceKm !== null && distanceKm > radiusKm) continue;

      const badges = Array.from(
        new Map(
          [...(companyMap.get(p.userId) ?? []), ...(serviceMap.get(p.serviceId) ?? [])].map((x) => [x.id, x])
        ).values()
      );
      const stlN = clamp(stl.score / 100, 0, 1);
      const industriesN = clamp(badges.length / 6, 0, 1);
      const reviewsN = rating ? clamp(rating / 5, 0, 1) : 0;
      const distanceN = distanceKm === null ? 0.5 : clamp(1 - distanceKm / Math.max(1, radiusKm), 0, 1);
      const avail = p.isActive && (p.availability ?? "available").toLowerCase() === "available";
      const availabilityN = avail ? 1 : 0.2;
      const rankScore = 100 * (0.4 * stlN + 0.2 * industriesN + 0.15 * reviewsN + 0.15 * distanceN + 0.1 * availabilityN);

      results.push({
        kind: "SERVICE_PROVIDER",
        id: p.id,
        name: p.user.name,
        category: p.service.category ?? null,
        subtitle: p.service.name,
        industry: p.service.industry,
        stlScore: stl.score,
        stlLevel: stl.level,
        rating,
        availability: avail,
        location: p.location ?? null,
        distanceKm: distanceKm !== null ? Number(distanceKm.toFixed(2)) : null,
        industryBadges: badges.slice(0, 8),
        rankScore: Number(rankScore.toFixed(2)),
      });
    }
  }

  if (wantsProducts) {
    const where: any = { isActive: true };
    if (industryId) where.industryId = industryId;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { seller: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: { select: { id: true, name: true } },
        industry: { select: { id: true, name: true, slug: true } },
      },
      take: 300,
      orderBy: { updatedAt: "desc" },
    });

    const sellerIds = Array.from(new Set(products.map((p) => p.sellerId)));
    const productIds = Array.from(new Set(products.map((p) => p.id)));
    const [userStlRows, productStlRows, companyIndustryRows, productIndustryRows] = await Promise.all([
      prisma.sTLScore.findMany({
        where: { entityType: "USER", entityId: { in: sellerIds } },
        select: { entityId: true, score: true, level: true },
      }),
      prisma.sTLScore.findMany({
        where: { entityType: "PRODUCT", entityId: { in: productIds } },
        select: { entityId: true, score: true, level: true },
      }),
      prisma.industryVerification.findMany({
        where: {
          entityType: "COMPANY",
          entityId: { in: sellerIds },
          status: "VERIFIED",
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        },
        select: { entityId: true, industry: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.industryVerification.findMany({
        where: {
          entityType: "PRODUCT",
          entityId: { in: productIds },
          status: "VERIFIED",
          OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
        },
        select: { entityId: true, industry: { select: { id: true, name: true, slug: true } } },
      }),
    ]);

    const userStlMap = new Map(
      userStlRows.map((x) => {
        const score = Number(x.score);
        const level = resolveStlLevelFromScoreAndDb(score, x.level) ?? 1;
        return [x.entityId, { score, level }] as const;
      })
    );
    const productStlMap = new Map(
      productStlRows.map((x) => {
        const score = Number(x.score);
        const level = resolveStlLevelFromScoreAndDb(score, x.level) ?? 1;
        return [x.entityId, { score, level }] as const;
      })
    );
    const companyMap = new Map<string, Array<{ id: string; name: string; slug: string }>>();
    for (const row of companyIndustryRows) {
      const arr = companyMap.get(row.entityId) ?? [];
      arr.push(row.industry);
      companyMap.set(row.entityId, arr);
    }
    const productMap = new Map<string, Array<{ id: string; name: string; slug: string }>>();
    for (const row of productIndustryRows) {
      const arr = productMap.get(row.entityId) ?? [];
      arr.push(row.industry);
      productMap.set(row.entityId, arr);
    }

    for (const p of products) {
      const stl = productStlMap.get(p.id) ?? userStlMap.get(p.sellerId) ?? { score: 0, level: 1 };
      const rating = p.rating ? Number(p.rating) : null;
      if (query.minRating && (rating ?? 0) < query.minRating) continue;
      if (query.minStlLevel && stl.level < query.minStlLevel) continue;

      const badges = Array.from(
        new Map(
          [...(companyMap.get(p.sellerId) ?? []), ...(productMap.get(p.id) ?? [])].map((x) => [x.id, x])
        ).values()
      );
      const stlN = clamp(stl.score / 100, 0, 1);
      const industriesN = clamp(badges.length / 6, 0, 1);
      const reviewsN = rating ? clamp(rating / 5, 0, 1) : 0;
      const distanceN = 0.5;
      const avail = p.isActive && p.stock > 0;
      const availabilityN = avail ? 1 : 0.2;
      const rankScore = 100 * (0.4 * stlN + 0.2 * industriesN + 0.15 * reviewsN + 0.15 * distanceN + 0.1 * availabilityN);

      results.push({
        kind: "PRODUCT",
        id: p.id,
        name: p.name,
        category: p.category ?? null,
        subtitle: `Seller: ${p.seller.name}`,
        industry: p.industry,
        stlScore: stl.score,
        stlLevel: stl.level,
        rating,
        availability: avail,
        location: null,
        distanceKm: null,
        industryBadges: badges.slice(0, 8),
        rankScore: Number(rankScore.toFixed(2)),
      });
    }
  }

  let list = results;
  let demoFallback = false;
  if (results.length === 0 && isDevDemoDatasetEnabled()) {
    list = [...DEMO_MARKETPLACE_ITEMS];
    demoFallback = true;
  }

  list.sort((a, b) => b.rankScore - a.rankScore);
  const total = list.length;
  const take = query.take ?? 24;
  const skip = query.skip ?? 0;
  const items = list.slice(skip, skip + take);
  return { items, total, take, skip, demoFallback };
}

export function buildSuggestions(input: { items: MarketplaceItem[]; q?: string }) {
  const byCategory = new Map<string, number>();
  for (const item of input.items) {
    if (!item.category) continue;
    byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1);
  }
  const topCategories = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);
  const suggestions = [
    ...topCategories.map((c) => `Top in ${c}`),
    "Nearby trusted providers",
    "Top rated and available now",
  ];
  if (input.q && input.q.length > 0) suggestions.unshift(`Results similar to "${input.q}"`);
  return Array.from(new Set(suggestions)).slice(0, 6);
}

