import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getInsightCards } from "@/lib/ai/recommendationEngine";
import { getSessionUser } from "@/lib/auth";

// GET /api/ai/insights?industry=it&limit=5
export async function GET(req: Request) {
  try {
    const user     = await getSessionUser();
    const userId   = user?.userId ?? "anonymous";
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get("industry") ?? undefined;
    const limit    = parseInt(searchParams.get("limit") ?? "5", 10);

    const cards = await getInsightCards({ userId, industry, limit });
    return ok({ cards });
  } catch (err) {
    return handleRouteError(err);
  }
}
