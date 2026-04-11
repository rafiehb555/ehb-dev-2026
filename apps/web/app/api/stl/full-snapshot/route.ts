import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { fail, okCompressed } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getStlFullSnapshotForUser } from "@/services/stl.service";
import { enforceRateLimit } from "@/lib/api/rateLimit";

const QuerySchema = z.object({
  fresh: z.enum(["1", "true"]).optional(),
});

/**
 * Unified STL payload for Widget, Dashboard, and integrations.
 */
export async function GET(req: Request) {
  const limited = enforceRateLimit(req, { route: "api:stl:full-snapshot", maxRequests: 100, windowMs: 60_000 });
  if (!limited.ok) return limited.response;

  QuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams.entries()));

  const auth = await requireSession(["USER", "SELLER", "PROVIDER", "FRANCHISE", "FRANCHISE_OWNER", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const snapshot = await getStlFullSnapshotForUser(auth.user.userId);
    return okCompressed(req, snapshot);
  } catch (err) {
    return handleRouteError(err);
  }
}
