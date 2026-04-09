import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { fail, okCompressed } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getAiSuggestionsForUser } from "@/services/ai";
import { enqueueAiProcessing } from "@/jobs/enqueue";
import { enforceRateLimit } from "@/lib/api/rateLimit";
import { monitorApiRequest } from "@/monitoring/api";

const QuerySchema = z.object({
  fresh: z.enum(["1", "true"]).optional(),
});

/**
 * AI user-guide + fraud + auto-decision hints for dashboard/DMO.
 * Human approval remains mandatory for sensitive actions (e.g. SUPREME).
 */
export async function GET(req: Request) {
  const limited = enforceRateLimit(req, { route: "api:ai:suggestions", maxRequests: 70, windowMs: 60_000 });
  if (!limited.ok) return limited.response;

  return monitorApiRequest(req, "api:ai:suggestions", async () => {
    QuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));

    const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    try {
      enqueueAiProcessing(auth.user.userId);
      const payload = await getAiSuggestionsForUser(auth.user.userId);
      return okCompressed(req, payload);
    } catch (err) {
      return handleRouteError(err);
    }
  });
}
