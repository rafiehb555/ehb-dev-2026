import { requireSession } from "@/lib/rbac";
import { fail } from "@/lib/apiResponse";
import { handleStlUpgradeRoute } from "@/services/dmo-service";

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  // Keep existing behavior safe: this is additive endpoint only.
  return handleStlUpgradeRoute(req);
}
