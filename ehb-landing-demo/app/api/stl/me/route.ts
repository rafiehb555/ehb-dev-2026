import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { computeUserStl, recalcUserStl } from "@/lib/stl/engine";

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    // Ensure we always return a fresh breakdown (no static scores).
    const breakdown = await computeUserStl(auth.user.userId);
    const persisted = await prisma.sTLScore.findUnique({
      where: { entityType_entityId: { entityType: "USER", entityId: auth.user.userId } },
      select: { score: true, level: true, breakdown: true, lastUpdated: true },
    });

    // Optionally persist if missing or drifted.
    if (!persisted || Number(persisted.score) !== breakdown.total || persisted.level !== breakdown.level) {
      await recalcUserStl({
        userId: auth.user.userId,
        actorId: auth.user.userId,
        reason: "STL_ME_READ_RECALC",
      }).catch(() => undefined);
    }

    return ok({ breakdown, persisted });
  } catch (err) {
    return handleRouteError(err);
  }
}

