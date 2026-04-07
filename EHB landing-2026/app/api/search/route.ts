import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { resolveStlLevelFromScoreAndDb } from "@/lib/stl/engine";
import { isDevDemoDatasetEnabled } from "@/lib/demo/demoFallback";
import { DEMO_SEARCH_RESULTS, type DemoSearchRow } from "@/lib/demo/demoSearchResults";

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

type SearchResult = {
  kind: "SERVICE_PROVIDER" | "PRODUCT";
  id: string;
  title: string;
  subtitle: string;
  industry: { id: string; name: string; slug: string } | null;
  entityId: string; // provider userId or productId
  sellerUserId: string | null;
  stlScore: number | null;
  stlLevel: number | null;
  /** Where the displayed STL came from: product listing vs seller/provider account. */
  stlSource: "USER" | "PRODUCT" | null;
  rating: number | null; // 0..5
  availability: boolean;
  location: { label: string | null; lat: number | null; lng: number | null };
  verifiedIndustries: Array<{ industryId: string; slug: string; name: string }>;
  distanceKm: number | null;
  rankScore: number; // 0..100
  breakdown: {
    stl: number; // 0..1
    distance: number; // 0..1
    reviews: number; // 0..1
    industries: number; // 0..1
    availability: number; // 0..1
  };
  labels: string[];
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const kind = (url.searchParams.get("type") ?? "ALL").toUpperCase();
    const industry = url.searchParams.get("industry") ?? undefined; // slug or id
    const verifiedIndustry = url.searchParams.get("verifiedIndustry") ?? undefined; // slug or id
    const location = (url.searchParams.get("location") ?? "").trim();
    const lat = url.searchParams.get("lat") ? Number(url.searchParams.get("lat")) : null;
    const lng = url.searchParams.get("lng") ? Number(url.searchParams.get("lng")) : null;
    const radiusKm = url.searchParams.get("radiusKm") ? Number(url.searchParams.get("radiusKm")) : 50;
    const minRating = url.searchParams.get("minRating") ? Number(url.searchParams.get("minRating")) : 0;
    const minStlLevel = url.searchParams.get("minStlLevel") ? Number(url.searchParams.get("minStlLevel")) : 0;
    const take = clamp(Number(url.searchParams.get("take") ?? 24), 1, 60);
    const skip = clamp(Number(url.searchParams.get("skip") ?? 0), 0, 5000);

    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng);
    const geoLat = hasGeo ? (lat as number) : null;
    const geoLng = hasGeo ? (lng as number) : null;

    const wantsServices = kind === "ALL" || kind === "SERVICES" || kind === "SERVICE";
    const wantsProducts = kind === "ALL" || kind === "PRODUCTS" || kind === "PRODUCT";

    // Industry filter can be slug or id.
    let industryId: string | null = null;
    if (industry) {
      const ind = await prisma.industry.findFirst({
        where: { OR: [{ id: industry }, { slug: industry }] },
        select: { id: true },
      });
      industryId = ind?.id ?? null;
      if (!industryId) return fail(400, "INVALID_INDUSTRY", "Unknown industry");
    }

    let verifiedIndustryId: string | null = null;
    if (verifiedIndustry) {
      const ind = await prisma.industry.findFirst({
        where: { OR: [{ id: verifiedIndustry }, { slug: verifiedIndustry }] },
        select: { id: true },
      });
      verifiedIndustryId = ind?.id ?? null;
      if (!verifiedIndustryId) return fail(400, "INVALID_VERIFIED_INDUSTRY", "Unknown verifiedIndustry");
    }

    const results: SearchResult[] = [];

    if (wantsServices) {
      const serviceWhere: any = { isActive: true };
      if (industryId) serviceWhere.industryId = industryId;
      if (q) {
        serviceWhere.OR = [
          { service: { name: { contains: q, mode: "insensitive" } } },
          { service: { category: { contains: q, mode: "insensitive" } } },
          { user: { name: { contains: q, mode: "insensitive" } } },
        ];
      }
      if (location) serviceWhere.location = { contains: location, mode: "insensitive" };

      const providers = await prisma.providerService.findMany({
        where: serviceWhere,
        take: 200,
        include: {
          service: { include: { industry: { select: { id: true, name: true, slug: true } } } },
          user: { select: { id: true, name: true, email: true } },
          profile: { select: { rating: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      const providerUserIds = Array.from(new Set(providers.map((p) => p.userId)));
      const [stlRows, verifiedCompanyIndustries, verifiedServiceIndustries] = await Promise.all([
        prisma.sTLScore.findMany({
          where: { entityType: "USER", entityId: { in: providerUserIds } },
          select: { entityId: true, score: true, level: true },
        }),
        prisma.industryVerification.findMany({
          where: {
            entityType: "COMPANY",
            entityId: { in: providerUserIds },
            status: "VERIFIED",
            ...(verifiedIndustryId ? { industryId: verifiedIndustryId } : {}),
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          select: { entityId: true, industryId: true, industry: { select: { id: true, slug: true, name: true } } },
          take: 5000,
        }),
        prisma.industryVerification.findMany({
          where: {
            entityType: "SERVICE",
            entityId: { in: providers.map((p) => p.serviceId) },
            status: "VERIFIED",
            ...(verifiedIndustryId ? { industryId: verifiedIndustryId } : {}),
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          select: { entityId: true, industryId: true, industry: { select: { id: true, slug: true, name: true } } },
          take: 5000,
        }),
      ]);

      const stlMap = new Map(
        stlRows.map((r) => {
          const score = Number(r.score);
          const level = resolveStlLevelFromScoreAndDb(score, r.level);
          return [r.entityId, { score, level }] as const;
        })
      );
      const companyIndustryMap = new Map<string, Array<{ industryId: string; slug: string; name: string }>>();
      for (const v of verifiedCompanyIndustries) {
        const arr = companyIndustryMap.get(v.entityId) ?? [];
        arr.push({ industryId: v.industry.id, slug: v.industry.slug, name: v.industry.name });
        companyIndustryMap.set(v.entityId, arr);
      }
      const serviceIndustryMap = new Map<string, Array<{ industryId: string; slug: string; name: string }>>();
      for (const v of verifiedServiceIndustries) {
        const arr = serviceIndustryMap.get(v.entityId) ?? [];
        arr.push({ industryId: v.industry.id, slug: v.industry.slug, name: v.industry.name });
        serviceIndustryMap.set(v.entityId, arr);
      }

      for (const p of providers) {
        const stl = stlMap.get(p.userId);
        const rating = p.profile?.rating ? Number(p.profile.rating) : null;
        if (rating !== null && rating < minRating) continue;
        if (stl?.level != null && stl.level < minStlLevel) continue;

        const provLat = p.locationLat ? Number(p.locationLat) : null;
        const provLng = p.locationLng ? Number(p.locationLng) : null;
        const distanceKm =
          geoLat !== null && geoLng !== null && provLat !== null && provLng !== null
            ? haversineKm(geoLat, geoLng, provLat, provLng)
            : null;
        if (distanceKm !== null && distanceKm > radiusKm) continue;

        const stlN = clamp((stl?.score ?? 0) / 100, 0, 1);
        const distN =
          distanceKm === null ? 0.5 : clamp(1 - distanceKm / Math.max(1, radiusKm), 0, 1);
        const reviewsN = rating === null ? 0.0 : clamp(rating / 5, 0, 1);

        const verified = [
          ...(companyIndustryMap.get(p.userId) ?? []),
          ...(serviceIndustryMap.get(p.serviceId) ?? []),
        ];
        const verifiedUnique = Array.from(
          new Map(verified.map((x) => [x.industryId, x])).values()
        );
        const industriesN = clamp(verifiedUnique.length / 6, 0, 1); // 6 verified industries ≈ full signal

        const avail = p.isActive && (p.availability ?? "available").toLowerCase() === "available";
        const availN = avail ? 1 : 0.2;

        // Weighted rank (0..100)
        const rank =
          100 *
          (0.4 * stlN +
            0.2 * distN +
            0.15 * reviewsN +
            0.15 * industriesN +
            0.1 * availN);

        const labels: string[] = [];
        if ((stl?.score ?? 0) >= 90) labels.push("Top Verified");
        if (distanceKm !== null && distanceKm <= 10) labels.push("Best Near You");
        if (industriesN >= 0.5) labels.push("Multi‑Industry Verified");
        if (avail) labels.push("Available Now");

        results.push({
          kind: "SERVICE_PROVIDER",
          id: p.id,
          title: p.user.name,
          subtitle: p.service.name,
          industry: p.service.industry,
          entityId: p.id,
          sellerUserId: p.userId,
          stlScore: stl?.score ?? null,
          stlLevel: stl?.level ?? null,
          stlSource: stl ? "USER" : null,
          rating,
          availability: avail,
          location: { label: p.location ?? null, lat: provLat, lng: provLng },
          verifiedIndustries: verifiedUnique.slice(0, 8),
          distanceKm,
          rankScore: Number(rank.toFixed(2)),
          breakdown: { stl: stlN, distance: distN, reviews: reviewsN, industries: industriesN, availability: availN },
          labels,
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
        take: 200,
        include: {
          industry: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
      });

      const sellerIds = Array.from(new Set(products.map((p) => p.sellerId)));
      const productIds = Array.from(new Set(products.map((p) => p.id)));
      const [userStlRows, productStlRows, verifiedCompanyIndustries, verifiedProductIndustries] =
        await Promise.all([
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
            ...(verifiedIndustryId ? { industryId: verifiedIndustryId } : {}),
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          select: { entityId: true, industry: { select: { id: true, slug: true, name: true } } },
          take: 5000,
        }),
        prisma.industryVerification.findMany({
          where: {
            entityType: "PRODUCT",
            entityId: { in: products.map((p) => p.id) },
            status: "VERIFIED",
            ...(verifiedIndustryId ? { industryId: verifiedIndustryId } : {}),
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          select: { entityId: true, industry: { select: { id: true, slug: true, name: true } } },
          take: 5000,
        }),
      ]);

      const userStlMap = new Map(
        userStlRows.map((r) => {
          const score = Number(r.score);
          const level = resolveStlLevelFromScoreAndDb(score, r.level);
          return [r.entityId, { score, level }] as const;
        })
      );
      const productStlMap = new Map(
        productStlRows.map((r) => {
          const score = Number(r.score);
          const level = resolveStlLevelFromScoreAndDb(score, r.level);
          return [r.entityId, { score, level }] as const;
        })
      );
      const companyIndustryMap = new Map<string, Array<{ industryId: string; slug: string; name: string }>>();
      for (const v of verifiedCompanyIndustries) {
        const arr = companyIndustryMap.get(v.entityId) ?? [];
        arr.push({ industryId: v.industry.id, slug: v.industry.slug, name: v.industry.name });
        companyIndustryMap.set(v.entityId, arr);
      }
      const productIndustryMap = new Map<string, Array<{ industryId: string; slug: string; name: string }>>();
      for (const v of verifiedProductIndustries) {
        const arr = productIndustryMap.get(v.entityId) ?? [];
        arr.push({ industryId: v.industry.id, slug: v.industry.slug, name: v.industry.name });
        productIndustryMap.set(v.entityId, arr);
      }

      for (const p of products) {
        const productStl = productStlMap.get(p.id);
        const userStl = userStlMap.get(p.sellerId);
        const stl = productStl ?? userStl;
        const stlSource: "USER" | "PRODUCT" | null = productStl
          ? "PRODUCT"
          : userStl
            ? "USER"
            : null;
        const rating = p.rating ? Number(p.rating) : null;
        if (rating !== null && rating < minRating) continue;
        if (stl?.level != null && stl.level < minStlLevel) continue;

        const stlN = clamp((stl?.score ?? 0) / 100, 0, 1);
        const distN = 0.5; // product distance requires shipping address/warehouse (future)
        const reviewsN = rating === null ? 0.0 : clamp(rating / 5, 0, 1);

        const verified = [
          ...(companyIndustryMap.get(p.sellerId) ?? []),
          ...(productIndustryMap.get(p.id) ?? []),
        ];
        const verifiedUnique = Array.from(new Map(verified.map((x) => [x.industryId, x])).values());
        const industriesN = clamp(verifiedUnique.length / 6, 0, 1);
        const avail = p.isActive && p.stock > 0;
        const availN = avail ? 1 : 0.2;

        const rank =
          100 *
          (0.4 * stlN +
            0.2 * distN +
            0.15 * reviewsN +
            0.15 * industriesN +
            0.1 * availN);

        const labels: string[] = [];
        if ((stl?.score ?? 0) >= 90) labels.push("Top Verified");
        if (industriesN >= 0.5) labels.push("Multi‑Industry Verified");
        if (avail) labels.push("In Stock");

        results.push({
          kind: "PRODUCT",
          id: p.id,
          title: p.name,
          subtitle: `Seller: ${p.seller.name}`,
          industry: p.industry,
          entityId: p.id,
          sellerUserId: p.sellerId,
          stlScore: stl?.score ?? null,
          stlLevel: stl?.level ?? null,
          stlSource,
          rating,
          availability: avail,
          location: { label: null, lat: null, lng: null },
          verifiedIndustries: verifiedUnique.slice(0, 8),
          distanceKm: null,
          rankScore: Number(rank.toFixed(2)),
          breakdown: { stl: stlN, distance: distN, reviews: reviewsN, industries: industriesN, availability: availN },
          labels,
        });
      }
    }

    let demoFallback = false;
    if (results.length === 0 && isDevDemoDatasetEnabled()) {
      let demoRows: DemoSearchRow[] = [...DEMO_SEARCH_RESULTS];
      if (wantsServices && !wantsProducts) demoRows = demoRows.filter((r) => r.kind === "SERVICE_PROVIDER");
      else if (wantsProducts && !wantsServices) demoRows = demoRows.filter((r) => r.kind === "PRODUCT");
      if (minRating > 0) demoRows = demoRows.filter((r) => (r.rating ?? 0) >= minRating);
      if (minStlLevel > 0) demoRows = demoRows.filter((r) => (r.stlLevel ?? 0) >= minStlLevel);
      if (demoRows.length === 0) demoRows = [...DEMO_SEARCH_RESULTS];
      results.push(...(demoRows as unknown as SearchResult[]));
      demoFallback = true;
    }

    // Final sort + pagination
    results.sort((a, b) => b.rankScore - a.rankScore);
    const paged = results.slice(skip, skip + take);
    return ok({ items: paged, total: results.length, take, skip, demoFallback });
  } catch (err) {
    return handleRouteError(err);
  }
}

