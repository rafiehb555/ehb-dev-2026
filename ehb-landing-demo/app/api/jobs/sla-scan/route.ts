import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { runSlaScan } from "@/lib/automation/engine";

export async function POST() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const result = await runSlaScan({ actorUserId: auth.user.userId });
    return ok(result);
  } catch (err) {
    return handleRouteError(err);
  }
}

