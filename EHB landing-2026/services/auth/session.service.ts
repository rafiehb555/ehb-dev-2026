import type { UserRole } from "@prisma/client";
import { createSessionCookie, clearSessionCookie, getSessionUser } from "@/lib/auth";
import { requireSession } from "@/lib/rbac";

export async function getAuthenticatedUser() {
  return getSessionUser();
}

export async function requireAuthenticatedSession(allowedRoles?: UserRole[]) {
  return requireSession(allowedRoles);
}

export async function issueUserSession(args: { userId: string; role: UserRole }) {
  await createSessionCookie(args);
}

export function revokeUserSession() {
  clearSessionCookie();
}
