import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { calculateRiskScore } from "@/lib/fraud/riskEngine";

// GET /api/fraud/score?entityId=xxx
export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get("entityId");
    if (!entityId) return fail(400, "VALIDATION", "entityId is required");

    const risk = await calculateRiskScore(entityId);
    return ok(risk);
  } catch (err) {
    return handleRouteError(err);
  }
}
