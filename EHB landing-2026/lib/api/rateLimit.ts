import { NextResponse } from "next/server";

type RateBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateBucket>();

export type RateLimitOptions = {
  route: string;
  maxRequests: number;
  windowMs: number;
  userId?: string;
};

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function makeKey(req: Request, opts: RateLimitOptions): string {
  const id = opts.userId && opts.userId.length > 0 ? `u:${opts.userId}` : `ip:${getClientIp(req)}`;
  return `${opts.route}:${id}`;
}

export function enforceRateLimit(
  req: Request,
  opts: RateLimitOptions,
): { ok: true } | { ok: false; response: NextResponse } {
  const now = Date.now();
  const key = makeKey(req, opts);
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }

  if (current.count >= opts.maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please retry shortly.",
            details: { retryAfterSeconds },
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(opts.maxRequests),
            "X-RateLimit-Remaining": "0",
          },
        },
      ),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true };
}
