import type { ApplicationStatus } from "./types";

export function fmtDateTime(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function statusTone(status: ApplicationStatus) {
  if (status === "APPROVED") return "emerald";
  if (status === "REJECTED") return "rose";
  if (status === "IN_REVIEW") return "amber";
  if (status === "UNDER_INSPECTION") return "violet";
  return "cyan";
}

export function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

