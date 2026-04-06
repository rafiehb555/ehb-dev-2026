import type { UserRole } from "@prisma/client";
import { getSessionUser } from "./auth";

export type ApiAuthResult =
  | { ok: true; user: { userId: string; role: UserRole } }
  | { ok: false; status: number; error: string };

export async function requireSession(allowedRoles?: UserRole[]): Promise<ApiAuthResult> {
  const user = await getSessionUser();
  // Dev/demo fallback: let protected APIs work locally without login flow friction.
  if (!user && process.env.NODE_ENV !== "production") {
    const demoUser = { userId: "ehb-demo-admin", role: "SUPER_ADMIN" as UserRole };
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(demoUser.role)) {
      return { ok: false, status: 403, error: "Forbidden" };
    }
    return { ok: true, user: demoUser };
  }
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, user };
}

export function isAdmin(role: UserRole) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isFranchise(role: UserRole) {
  return role === "FRANCHISE";
}

