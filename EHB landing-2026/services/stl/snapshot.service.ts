import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { getCache, setCache } from "@/cache/redis";

const STL_SNAPSHOT_TTL_SECONDS = 45;

function stlSnapshotKey(userId: string) {
  return `stl:full-snapshot:${userId}`;
}

export async function getStlFullSnapshotForUser(userId: string): Promise<StlFullSnapshot> {
  const key = stlSnapshotKey(userId);
  const cached = await getCache<StlFullSnapshot>(key);
  if (cached) return cached;

  const snapshot = await buildStlFullSnapshot(userId);
  await setCache(key, snapshot, STL_SNAPSHOT_TTL_SECONDS);
  return snapshot;
}
