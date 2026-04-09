import { prisma } from "@/lib/prisma";
import { computeUserStl } from "@/lib/stl/engine";
import { getUserTrustEngineSnapshot } from "@/lib/stl/dmoTrustEngine";
import { getStlFullSnapshotForUser } from "@/services/stl/snapshot.service";
import { getCache, setCache } from "@/cache/redis";
import { enqueueStlRecalculation } from "@/jobs/enqueue";

const STL_DASHBOARD_TTL_SECONDS = 30;

export type StlMePayload = {
  breakdown: Awaited<ReturnType<typeof computeUserStl>>;
  persisted: {
    score: number;
    level: number;
    breakdown: unknown;
    lastUpdated: Date;
  } | null;
  trustEngine: Awaited<ReturnType<typeof getUserTrustEngineSnapshot>>;
  fullSnapshot: Awaited<ReturnType<typeof getStlFullSnapshotForUser>>;
};

function stlMeKey(userId: string) {
  return `stl:me:${userId}`;
}

export async function getStlMePayloadForUser(userId: string): Promise<StlMePayload> {
  const key = stlMeKey(userId);
  const cached = await getCache<StlMePayload>(key);
  if (cached) return cached;

  const breakdown = await computeUserStl(userId);
  const persisted = await prisma.sTLScore.findUnique({
    where: { entityType_entityId: { entityType: "USER", entityId: userId } },
    select: { score: true, level: true, breakdown: true, lastUpdated: true },
  });

  if (!persisted || Number(persisted.score) !== breakdown.total || persisted.level !== breakdown.level) {
    enqueueStlRecalculation({
      userId,
      actorId: userId,
      reason: "STL_ME_READ_RECALC",
    });
  }

  const [trustEngine, fullSnapshot] = await Promise.all([
    getUserTrustEngineSnapshot(userId),
    getStlFullSnapshotForUser(userId),
  ]);

  const payload: StlMePayload = { breakdown, persisted, trustEngine, fullSnapshot };
  await setCache(key, payload, STL_DASHBOARD_TTL_SECONDS);
  return payload;
}
