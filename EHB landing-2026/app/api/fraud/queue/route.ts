import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getFraudQueue } from "@/lib/fraud/riskEngine";
import type { RiskTier } from "@/lib/fraud/riskEngine";

// GET /api/fraud/queue?tier=HIGH&limit=50
export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { searchParams } = new URL(req.url);
    const tier  = searchParams.get("tier") as RiskTier | null;
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);

    const queue = await getFraudQueue({ tier: tier ?? undefined, limit });
    return ok({ queue, total: queue.length });
  } catch (err) {
    return handleRouteError(err);
  }
}
