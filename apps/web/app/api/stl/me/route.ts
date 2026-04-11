import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { fail, okCompressed } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getStlMePayloadForUser } from "@/services/stl";
import { enforceRateLimit } from "@/lib/api/rateLimit";
import { monitorApiRequest } from "@/monitoring/api";

const QuerySchema = z.object({
  fresh: z.enum(["1", "true"]).optional(),
});

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, { route: "api:stl:me", maxRequests: 80, windowMs: 60_000 });
  if (!limited.ok) return limited.response;

  return monitorApiRequest(req, "api:stl:me", async () => {
    QuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));

    const auth = await requireSession(["USER", "SELLER", "PROVIDER", "FRANCHISE", "FRANCHISE_OWNER", "ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    try {
      const payload = await getStlMePayloadForUser(auth.user.userId);
      return okCompressed(req, payload);
    } catch (err) {
      return handleRouteError(err);
    }
  });
}
