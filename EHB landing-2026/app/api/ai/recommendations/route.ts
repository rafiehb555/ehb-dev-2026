import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getRecommendations } from "@/lib/ai/recommendationEngine";
import { getSessionUser } from "@/lib/auth";
import type { RecommendationType } from "@/lib/ai/recommendationEngine";

// GET /api/ai/recommendations?type=service&limit=10
export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return fail(401, "AUTH", "Login required");

    const { searchParams } = new URL(req.url);
    const type  = (searchParams.get("type") ?? "service") as RecommendationType;
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    const items = await getRecommendations(user.userId, type, limit);
    return ok({ items, total: items.length });
  } catch (err) {
    return handleRouteError(err);
  }
}
