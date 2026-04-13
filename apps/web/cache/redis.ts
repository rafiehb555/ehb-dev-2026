type CacheEntry = {
  value: string;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry>();

function getEnv(name: string): string | null {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function getRedisRestConfig() {
  const baseUrl = getEnv("REDIS_REST_URL");
  const token = getEnv("REDIS_REST_TOKEN");
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

function isExpired(entry: CacheEntry): boolean {
  return Date.now() >= entry.expiresAt;
}

/**
 * Hard-cap the time we're willing to wait on an Upstash / Redis REST round-trip.
 * If the token is set but the host is unreachable, raw `fetch` would block the
 * entire API route. 300ms is plenty for healthy Redis and cheap to give up on.
 */
const REDIS_TIMEOUT_MS = 300;

function redisAbortSignal(): AbortSignal {
  // `AbortSignal.timeout` is available in Node 18+ and the Next.js runtime.
  // Fallback to a manual controller if for some reason it's missing.
  const anySignal = (AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal });
  if (typeof anySignal.timeout === "function") {
    return anySignal.timeout(REDIS_TIMEOUT_MS);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);
  return controller.signal;
}

async function getFromRedis<T>(key: string): Promise<T | null> {
  const cfg = getRedisRestConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(`${cfg.baseUrl}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: "no-store",
      signal: redisAbortSignal(),
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { result?: string | null };
    if (!json?.result) return null;

    try {
      return JSON.parse(json.result) as T;
    } catch {
      return null;
    }
  } catch {
    // Timeouts, network errors, DNS failures → fall back silently.
    return null;
  }
}

async function setToRedis(key: string, rawValue: string, ttlSeconds: number): Promise<void> {
  const cfg = getRedisRestConfig();
  if (!cfg) return;

  await fetch(`${cfg.baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(rawValue)}?EX=${ttlSeconds}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: "no-store",
    signal: redisAbortSignal(),
  }).catch(() => undefined);
}

/**
 * Redis-first cache read with safe in-memory fallback.
 * Falls back to in-process cache when REDIS_REST_URL/TOKEN are missing.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redisVal = await getFromRedis<T>(key);
    if (redisVal !== null) return redisVal;
  } catch {
    // Ignore and fallback.
  }

  const local = memoryCache.get(key);
  if (!local) return null;
  if (isExpired(local)) {
    memoryCache.delete(key);
    return null;
  }

  try {
    return JSON.parse(local.value) as T;
  } catch {
    memoryCache.delete(key);
    return null;
  }
}

/**
 * Redis-first cache write with safe in-memory fallback.
 */
export async function setCache<T>(key: string, data: T, ttlSeconds = 60): Promise<void> {
  const raw = JSON.stringify(data);

  memoryCache.set(key, {
    value: raw,
    expiresAt: Date.now() + Math.max(1, ttlSeconds) * 1000,
  });

  await setToRedis(key, raw, Math.max(1, ttlSeconds));
}
