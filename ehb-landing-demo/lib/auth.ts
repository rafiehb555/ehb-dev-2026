import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";

const SESSION_COOKIE = "ehb_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function requireSessionSecret() {
  const secret = process.env.EHB_AUTH_SECRET;
  if (!secret) throw new Error("Missing EHB_AUTH_SECRET");
  return secret;
}

function getKey() {
  const secret = requireSessionSecret();
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  userId: string;
  role: UserRole;
};

export async function createSessionCookie(payload: SessionUser) {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_TTL_SECONDS)
    .sign(getKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey());
    if (typeof payload.userId !== "string") return null;
    if (typeof payload.role !== "string") return null;
    return { userId: payload.userId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

