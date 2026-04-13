import type { UserRole } from "@prisma/client";
import { getSessionUser } from "./auth";
import { prisma } from "./prisma";

export type ApiAuthResult =
  | { ok: true; user: { userId: string; role: UserRole } }
  | { ok: false; status: number; error: string };

/**
 * When true (non-production only), unauthenticated API calls may use a demo Super Admin user.
 * Set `EHB_DEV_AUTH_BYPASS=false` to require a real session while developing (e.g. testing login).
 * Never enabled in production.
 */
export function isDevSessionFallbackEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const v = process.env.EHB_DEV_AUTH_BYPASS;
  if (v === "false" || v === "0") return false;
  return true;
}

/* --------------------------- Dev fallback user cache ---------------------------
 * Without this cache every unauthenticated API request (common in local dev)
 * re-ran `prisma.user.findMany({ take: 80 })`. On a cold Mongo connection that
 * stacked onto the /api/stl/full-snapshot latency path and made the DMO sub
 * pages visibly slow on first click. We cache for 60s, only in dev, and only
 * for unauthenticated callers. Prod is untouched.
 * -----------------------------------------------------------------------------*/
type CachedFallbackUsers = {
  users: { id: string; role: UserRole }[];
  at: number;
};
let fallbackUsersCache: CachedFallbackUsers | null = null;
const FALLBACK_USERS_TTL_MS = 60_000;

async function loadFallbackUsers(): Promise<{ id: string; role: UserRole }[]> {
  const now = Date.now();
  if (fallbackUsersCache && now - fallbackUsersCache.at < FALLBACK_USERS_TTL_MS) {
    return fallbackUsersCache.users;
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, role: true },
      take: 80,
    });
    fallbackUsersCache = { users, at: now };
    return users;
  } catch {
    // Prisma not ready / DB down — keep returning empty so callers fall back to the synthetic user.
    fallbackUsersCache = { users: [], at: now };
    return [];
  }
}

async function devSessionFallbackUser(allowedRoles?: UserRole[]): Promise<{ userId: string; role: UserRole } | null> {
  const users = await loadFallbackUsers();
  if (users.length === 0) return null;
  const pick = (u: { id: string; role: UserRole }) => ({ userId: u.id, role: u.role });
  if (!allowedRoles?.length) return pick(users[0]);
  const match = users.find((u) => allowedRoles.includes(u.role));
  return pick(match ?? users[0]);
}

/** Test helper to wipe the dev fallback cache. */
export function __resetDevFallbackCacheForTests() {
  fallbackUsersCache = null;
}

export async function requireSession(allowedRoles?: UserRole[]): Promise<ApiAuthResult> {
  const user = await getSessionUser();
  // Dev fallback: use a real DB user id so Prisma FKs (orders, etc.) succeed.
  if (!user && isDevSessionFallbackEnabled()) {
    const fallback = await devSessionFallbackUser(allowedRoles);
    if (!fallback) {
      // Dev-safe synthetic user fallback keeps demo APIs/pages usable when local DB is empty.
      return { ok: true, user: { userId: "demo-user", role: "USER" } };
    }
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(fallback.role)) {
      return { ok: false, status: 403, error: "Forbidden" };
    }
    return { ok: true, user: fallback };
  }
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, user };
}

export async function requireRole(allowedRoles: UserRole[]): Promise<ApiAuthResult> {
  return requireSession(allowedRoles);
}

export function isAdmin(role: UserRole) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isFranchise(role: UserRole) {
  return role === "FRANCHISE";
}

