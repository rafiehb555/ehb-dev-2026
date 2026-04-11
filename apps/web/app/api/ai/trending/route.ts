import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getTrending } from "@/lib/ai/recommendationEngine";

// GET /api/ai/trending?industry=it
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get("industry");
    if (!industry) return fail(400, "VALIDATION", "industry is required");

    const data = await getTrending(industry);
    return ok(data);
  } catch (err) {
    return handleRouteError(err);
  }
}
