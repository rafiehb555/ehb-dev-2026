import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { scanRefillsAndEnforce } from "@/lib/pss/refillEngine";

export async function POST() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const result = await scanRefillsAndEnforce({ actorUserId: auth.user.userId });
    return ok(result);
  } catch (err) {
    return handleRouteError(err);
  }
}

