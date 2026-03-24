import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "ehb_session";

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
    pathname.startsWith("/api/dmo")
  );
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
  if (!isProtectedPath(pathname)) return NextResponse.next();

  // Local demo mode: keep protected pages usable during product demos
  // even when auth/session is not fully wired in browser.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const key = getKey();
  if (!key) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyHs256Jwt(token, key);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = typeof payload.role === "string" ? payload.role : "";
    if (!roleAllowedForPath(pathname, role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/dmo/:path*", "/admin/:path*", "/api/dmo/:path*"],
};

