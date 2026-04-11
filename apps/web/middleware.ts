import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimitMemory";

const SESSION_COOKIE = "ehb_session";

/** Global API caps (per IP, per minute) + stricter sensitive route caps. */
const API_RATE = { max: 300, windowMs: 60_000 };
const SENSITIVE_API_RATE = { max: 80, windowMs: 60_000 };

function getKey() {
  const secret = process.env.EHB_AUTH_SECRET;
  if (!secret) {
    // Fail closed for protected routes if secret is missing.
    return null;
  }
  return new TextEncoder().encode(secret);
}

function base64UrlToBytes(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: ArrayBuffer) {
  const u8 = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verifyHs256Jwt(token: string, key: Uint8Array) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  const headerJson = new TextDecoder().decode(base64UrlToBytes(headerB64));
  const payloadJson = new TextDecoder().decode(base64UrlToBytes(payloadB64));

  let header: any;
  let payload: any;
  try {
    header = JSON.parse(headerJson);
    payload = JSON.parse(payloadJson);
  } catch {
    return null;
  }

  if (header?.alg !== "HS256") return null;

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const rawKey = key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = base64UrlToBytes(signatureB64);
  const ok = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, data);
  if (!ok) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload?.exp === "number" && payload.exp < now) return null;
  return payload;
}

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dmo") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/dmo") ||
    pathname.startsWith("/api/admin")
  );
}

function isRateLimitedApi(pathname: string) {
  return pathname.startsWith("/api/");
}

function isSensitiveApi(pathname: string) {
  return (
    pathname.startsWith("/api/fraud") ||
    pathname.startsWith("/api/ai") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/payment") ||
    pathname.startsWith("/api/dmo") ||
    pathname.startsWith("/api/admin")
  );
}

function isRateLimitExempt(pathname: string) {
  return pathname.startsWith("/api/webhooks/");
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  return res;
}

function isMiddlewareBypassEnabled() {
  // Production is always strict.
  if (process.env.NODE_ENV === "production") return false;
  // In local/dev, default to bypass so pages remain usable without session bootstrap.
  // Set EHB_MIDDLEWARE_DEV_BYPASS=false to test strict auth/rate behavior locally.
  return process.env.EHB_MIDDLEWARE_DEV_BYPASS !== "false";
}

function clientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function roleAllowedForPath(pathname: string, role: string) {
  // `/admin` is restricted to admins only.
  if (pathname.startsWith("/admin")) return role === "ADMIN" || role === "SUPER_ADMIN";
  // `/dmo` is for franchise + admins (operators).
  if (pathname.startsWith("/dmo")) return role === "FRANCHISE" || role === "ADMIN" || role === "SUPER_ADMIN";
  // `/api/dmo` routes enforce RBAC per-route; middleware checks only authentication.
  return true;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isRateLimitedApi(pathname) && !isRateLimitExempt(pathname)) {
    const ip = clientIp(req);
    const apiGroup = pathname.split("/").slice(0, 4).join("/");
    const baseKey = `${ip}:${apiGroup}`;
    const base = checkRateLimit(baseKey, API_RATE.max, API_RATE.windowMs);
    if (!base.ok) {
      return withSecurityHeaders(
        NextResponse.json(
          { success: false, error: { code: "RATE_LIMIT", message: "Too many requests" } },
          { status: 429, headers: { "Retry-After": String(base.retryAfterSec) } }
        )
      );
    }
    if (isSensitiveApi(pathname)) {
      const sensitiveKey = `${ip}:sensitive:${apiGroup}`;
      const strict = checkRateLimit(sensitiveKey, SENSITIVE_API_RATE.max, SENSITIVE_API_RATE.windowMs);
      if (!strict.ok) {
        return withSecurityHeaders(
          NextResponse.json(
            { success: false, error: { code: "RATE_LIMIT", message: "Too many requests" } },
            { status: 429, headers: { "Retry-After": String(strict.retryAfterSec) } }
          )
        );
      }
    }
  }

  if (!isProtectedPath(pathname)) return withSecurityHeaders(NextResponse.next());

  if (isMiddlewareBypassEnabled()) {
    return withSecurityHeaders(NextResponse.next());
  }

  const key = getKey();
  if (!key) return withSecurityHeaders(NextResponse.json({ error: "Server misconfigured" }, { status: 500 }));

  const authHeader = req.headers.get("authorization");
  const bearerToken =
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : null;
  const token = req.cookies.get(SESSION_COOKIE)?.value || bearerToken;
  if (!token) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));

  try {
    const payload = await verifyHs256Jwt(token, key);
    if (!payload) return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    const role = typeof payload.role === "string" ? payload.role : "";
    if (!roleAllowedForPath(pathname, role)) {
      return withSecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
    }
    return withSecurityHeaders(NextResponse.next());
  } catch {
    return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
}

export const config = {
  matcher: [
    "/dmo/:path*",
    "/admin/:path*",
    "/api/dmo/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
    "/api/payment/:path*",
    "/api/fraud/:path*",
    "/api/ai/:path*",
    "/api/:path*",
  ],
};

