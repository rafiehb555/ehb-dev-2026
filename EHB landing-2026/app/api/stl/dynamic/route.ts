import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import {
  canUnlockPremiumServices,
  explainSTL,
  fromSnapshotToDynamic,
  getNextLevel,
} from "@/lib/stl/dynamicEngine";

export async function GET() {
  const auth = await requireSession(["USER", "SELLER", "PROVIDER", "FRANCHISE", "FRANCHISE_OWNER", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  const snapshot = await buildStlFullSnapshot(auth.user.userId);
  const dynamic = fromSnapshotToDynamic(snapshot, auth.user.userId);
  const explanation = explainSTL(dynamic);
  const nextLevel = getNextLevel(dynamic.stlScore);

  return ok({
    user: dynamic,
    explanation,
    nextLevel,
    monetization: {
      unlockPremiumServices: canUnlockPremiumServices(dynamic),
      rule: "STL > 70 unlocks premium services",
    },
  });
}

