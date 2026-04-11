import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { MarketplaceListQuerySchema } from "@/lib/marketplace/schemas";
import { buildSuggestions, listMarketplaceItems } from "@/lib/marketplace/engine";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = MarketplaceListQuerySchema.parse({
      q: url.searchParams.get("q") ?? undefined,
      type: url.searchParams.get("type") ?? "ALL",
      industry: url.searchParams.get("industry") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
      lat: url.searchParams.get("lat") ?? undefined,
      lng: url.searchParams.get("lng") ?? undefined,
      radiusKm: url.searchParams.get("radiusKm") ?? undefined,
      minStlLevel: url.searchParams.get("minStlLevel") ?? undefined,
      minRating: url.searchParams.get("minRating") ?? undefined,
    });

    const data = await listMarketplaceItems(query);
    return ok({
      ...data,
      suggestions: buildSuggestions({ items: data.items, q: query.q }),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

