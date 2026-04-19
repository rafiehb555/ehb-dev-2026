/**
 * DMO navigation — canonical 18-module structure (rebuild Phase 1, 2026-04-19).
 *
 * Groups
 *   1. Overview        — 1 module
 *   2. Verification    — 5 modules (EHB STL, DMO STL, PSS, CRB, Up-Guard)
 *   3. Operations      — 7 modules (Applications, Approvals, Wallet, Earnings, Refill, Complaints, Franchise)
 *   4. Intelligence    — 7 modules (Activity, Tasks, AI, Analytics, Blockchain, Notifications, Settings)
 *
 * Naming rules (CLAUDE.md §6.2):
 *   STL = Service Trust Level             (L1 → L10 with 5 entity types)
 *   CRB = Certification & Refill Board
 *   PSS = Personal Security System
 *
 * Legacy routes under `/dmo/jps`, `/dmo/penalty`, `/dmo/affiliate`, `/dmo/industry`,
 * `/dmo/automation`, `/dmo/home`, `/dmo/roadmap` still exist on disk — they are
 * intentionally NOT in this sidebar to keep the canonical 18 modules clean.
 */

import React from "react";

export type DmoNavItem = {
  key: string;
  label: string;
  href: string;
};

export type DmoNavSection = {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  groupKey: DmoNavGroupKey;
  items: DmoNavItem[];
};

export type DmoNavGroupKey = "overview" | "verification" | "operations" | "intelligence";

export type DmoNavGroup = {
  key: DmoNavGroupKey;
  label: string;
  tint: string; // tailwind text color used on the group header
};

export const DMO_NAV_GROUPS: DmoNavGroup[] = [
  { key: "overview", label: "Overview", tint: "text-cyan-300/90" },
  { key: "verification", label: "Verification", tint: "text-emerald-300/90" },
  { key: "operations", label: "Operations", tint: "text-amber-300/90" },
  { key: "intelligence", label: "Intelligence", tint: "text-[#A098F8]" },
];

/* Mini SVG icon factory — 16×16, stroke-based, inherits currentColor */
const S = (d: string, extra?: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d + (extra ?? "") }} />
);

export const DMO_NAV_SECTIONS: DmoNavSection[] = [
  // ───────────────────────────── Overview ─────────────────────────────
  {
    key: "dashboard",
    icon: S('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    label: "Dashboard",
    href: "/dmo",
    groupKey: "overview",
    items: [
      { key: "dashboard-overview", label: "Overview", href: "/dmo" },
      { key: "dashboard-pulse", label: "Live pulse", href: "/dmo/home" },
      { key: "dashboard-roadmap", label: "Roadmap", href: "/dmo/roadmap" },
    ],
  },

  // ─────────────────────────── Verification ───────────────────────────
  {
    key: "stl",
    icon: S('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    label: "EHB STL Management",
    href: "/dmo/stl",
    groupKey: "verification",
    items: [
      { key: "stl-overview", label: "Overview", href: "/dmo/stl" },
      { key: "stl-reference", label: "EHB-STL-LEVEL (reference)", href: "/dmo/ehb-stl-level" },
      { key: "stl-scores", label: "Scores", href: "/dmo/stl/scores" },
      { key: "stl-breakdown", label: "Breakdown", href: "/dmo/stl/breakdown" },
      { key: "stl-history", label: "History", href: "/dmo/stl/history" },
      { key: "stl-ranking", label: "Ranking", href: "/dmo/stl/ranking" },
    ],
  },
  {
    key: "dmo-stl",
    icon: S('<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><path d="M5.64 5.64l12.72 12.72"/><path d="M18.36 5.64L5.64 18.36"/>'),
    label: "DMO STL",
    href: "/dmo/dmo-stl",
    groupKey: "verification",
    items: [
      { key: "dmo-stl-all", label: "All STL (one page)", href: "/dmo/dmo-stl" },
      { key: "dmo-stl-levels", label: "L1 → L10 Levels", href: "/dmo/dmo-stl#levels" },
      { key: "dmo-stl-formula", label: "Formula & inputs", href: "/dmo/dmo-stl#formula" },
      { key: "dmo-stl-types", label: "5 STL entity types", href: "/dmo/dmo-stl#types" },
      { key: "dmo-stl-coin-lock", label: "Coin lock tiers", href: "/dmo/dmo-stl#coin-lock" },
    ],
  },
  {
    key: "pss",
    icon: S('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
    label: "PSS Monitoring",
    href: "/dmo/pss",
    groupKey: "verification",
    items: [
      { key: "pss-queue", label: "Operator queue", href: "/dmo/pss/queue" },
      { key: "pss-cases", label: "Cases", href: "/dmo/pss/cases" },
      { key: "pss-rules", label: "Rule engine", href: "/dmo/pss/rules" },
      { key: "pss-webhooks", label: "Webhook monitor", href: "/dmo/pss/webhooks" },
      { key: "pss-crb", label: "CRB override", href: "/dmo/pss/crb" },
      { key: "pss-steps", label: "Verification steps", href: "/dmo/pss/steps" },
      { key: "pss-risk", label: "Risk analysis", href: "/dmo/pss/risk" },
      { key: "pss-fraud", label: "Fraud detection", href: "/dmo/pss/fraud" },
      { key: "pss-refilling", label: "Refilling", href: "/dmo/pss/refilling" },
    ],
  },
  {
    key: "crb",
    icon: S('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>'),
    label: "CRB Monitoring",
    href: "/dmo/crb",
    groupKey: "verification",
    items: [
      { key: "crb-applications", label: "Applications", href: "/dmo/crb/applications" },
      { key: "crb-docs", label: "Document review", href: "/dmo/crb/docs" },
      { key: "crb-inspection", label: "Inspection", href: "/dmo/crb/inspection" },
      { key: "crb-certificates", label: "Certificates", href: "/dmo/crb/certificates" },
      { key: "crb-expiry", label: "Expiry", href: "/dmo/crb/expiry" },
    ],
  },
  {
    key: "up-guard",
    icon: S('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
    label: "Up-Guard",
    href: "/dmo/up-guard",
    groupKey: "verification",
    items: [
      { key: "up-guard-overview", label: "Overview", href: "/dmo/up-guard" },
      { key: "up-guard-signals", label: "Signals", href: "/dmo/up-guard/signals" },
      { key: "up-guard-incidents", label: "Incidents", href: "/dmo/up-guard/incidents" },
      { key: "up-guard-policy", label: "Policy", href: "/dmo/up-guard/policy" },
    ],
  },

  // ──────────────────────────── Operations ────────────────────────────
  {
    key: "applications",
    icon: S('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>'),
    label: "Applications",
    href: "/dmo/applications",
    groupKey: "operations",
    items: [
      { key: "applications-all", label: "All applications", href: "/dmo/applications/all" },
      { key: "applications-queue", label: "My queue", href: "/dmo/applications/queue" },
      { key: "applications-high-risk", label: "High risk", href: "/dmo/applications/high-risk" },
      { key: "applications-sla", label: "SLA breach", href: "/dmo/applications/sla-breach" },
    ],
  },
  {
    key: "approvals",
    icon: S('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
    label: "Approvals",
    href: "/dmo/approvals",
    groupKey: "operations",
    items: [
      { key: "approvals-pending", label: "Pending decisions", href: "/dmo/approvals/pending" },
      { key: "approvals-approved", label: "Approved", href: "/dmo/approvals/approved" },
      { key: "approvals-rejected", label: "Rejected", href: "/dmo/approvals/rejected" },
      { key: "approvals-history", label: "History", href: "/dmo/approvals/history" },
    ],
  },
  {
    key: "wallet-control",
    icon: S('<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>'),
    label: "Wallet Control",
    href: "/dmo/wallet-control",
    groupKey: "operations",
    items: [
      { key: "wallet-overview", label: "Overview", href: "/dmo/wallet-control" },
      { key: "wallet-balances", label: "Balances", href: "/dmo/wallet-control/balances" },
      { key: "wallet-escrow", label: "Escrow", href: "/dmo/wallet-control/escrow" },
      { key: "wallet-lock", label: "Coin lock", href: "/dmo/wallet-control/lock" },
    ],
  },
  {
    key: "earnings-engine",
    icon: S('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    label: "Earnings Engine",
    href: "/dmo/earnings-engine",
    groupKey: "operations",
    items: [
      { key: "earnings-overview", label: "Overview", href: "/dmo/earnings-engine" },
      { key: "earnings-split", label: "40/25/20/15 split", href: "/dmo/earnings-engine/split" },
      { key: "earnings-payouts", label: "Payouts", href: "/dmo/earnings-engine/payouts" },
      { key: "earnings-history", label: "History", href: "/dmo/earnings-engine/history" },
    ],
  },
  {
    key: "refill-management",
    icon: S('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
    label: "Refill Management",
    href: "/dmo/refill-management",
    groupKey: "operations",
    items: [
      { key: "refill-active", label: "Active", href: "/dmo/refill-management/active" },
      { key: "refill-expiring", label: "Expiring soon", href: "/dmo/refill-management/expiring" },
      { key: "refill-expired", label: "Expired", href: "/dmo/refill-management/expired" },
      { key: "refill-completed", label: "Completed", href: "/dmo/refill-management/completed" },
    ],
  },
  {
    key: "complaints",
    icon: S('<path d="M12 3v18"/><path d="M5 8l7-5 7 5"/><path d="M3 13l2-5h4l2 5"/><path d="M13 13l2-5h4l2 5"/><path d="M3 13a2.5 2.5 0 0 0 5 0"/><path d="M16 13a2.5 2.5 0 0 0 5 0"/>'),
    label: "Complaints",
    href: "/dmo/complaints",
    groupKey: "operations",
    items: [
      { key: "complaints-open", label: "Open", href: "/dmo/complaints/open" },
      { key: "complaints-ladder", label: "Penalty ladder", href: "/dmo/complaints/ladder" },
      { key: "complaints-appeals", label: "Appeals", href: "/dmo/complaints/appeals" },
      { key: "complaints-history", label: "History", href: "/dmo/complaints/history" },
    ],
  },
  {
    key: "franchise",
    icon: S('<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/>'),
    label: "Franchise Control",
    href: "/dmo/franchise",
    groupKey: "operations",
    items: [
      { key: "franchise-tasks", label: "Tasks", href: "/dmo/franchise/tasks" },
      { key: "franchise-in-progress", label: "In progress", href: "/dmo/franchise/in-progress" },
      { key: "franchise-reports", label: "Reports", href: "/dmo/franchise/reports" },
      { key: "franchise-escalations", label: "Escalations", href: "/dmo/franchise/escalations" },
    ],
  },

  // ─────────────────────────── Intelligence ───────────────────────────
  {
    key: "activity-engine",
    icon: S('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    label: "Activity Engine",
    href: "/dmo/activity-engine",
    groupKey: "intelligence",
    items: [
      { key: "activity-live", label: "Live feed", href: "/dmo/activity-engine" },
      { key: "activity-24h", label: "Last 24h", href: "/dmo/activity-engine/last-24h" },
      { key: "activity-7d", label: "Last 7d", href: "/dmo/activity-engine/last-7d" },
      { key: "activity-audit", label: "Audit log", href: "/dmo/activity-engine/audit" },
    ],
  },
  {
    key: "task-system",
    icon: S('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'),
    label: "Task System",
    href: "/dmo/task-system",
    groupKey: "intelligence",
    items: [
      { key: "task-inbox", label: "Inbox", href: "/dmo/task-system" },
      { key: "task-queues", label: "Queues", href: "/dmo/task-system/queues" },
      { key: "task-sla", label: "SLA timers", href: "/dmo/task-system/sla" },
      { key: "task-routing", label: "Routing rules", href: "/dmo/task-system/routing" },
    ],
  },
  {
    key: "ai-assistant",
    icon: S('<path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/>'),
    label: "AI Assistant",
    href: "/dmo/ai-assistant",
    groupKey: "intelligence",
    items: [
      { key: "ai-chat", label: "Chat", href: "/dmo/ai-assistant" },
      { key: "ai-suggestions", label: "Suggestions", href: "/dmo/ai-assistant/suggestions" },
      { key: "ai-recommendations", label: "Recommendations", href: "/dmo/ai-recommendations" },
      { key: "ai-history", label: "History", href: "/dmo/ai-assistant/history" },
    ],
  },
  {
    key: "analytics",
    icon: S('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
    label: "Analytics",
    href: "/dmo/analytics",
    groupKey: "intelligence",
    items: [
      { key: "analytics-overview", label: "Overview", href: "/dmo/analytics" },
      { key: "analytics-kpis", label: "KPIs", href: "/dmo/analytics/kpis" },
      { key: "analytics-trends", label: "Trends", href: "/dmo/analytics/trends" },
      { key: "analytics-segments", label: "Segments", href: "/dmo/analytics/segments" },
    ],
  },
  {
    key: "blockchain-control",
    icon: S('<rect x="2" y="7" width="6" height="10" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/><path d="M8 12h8"/><path d="M8 9h8"/><path d="M8 15h8"/>'),
    label: "Blockchain Control",
    href: "/dmo/blockchain-control",
    groupKey: "intelligence",
    items: [
      { key: "blockchain-overview", label: "Overview", href: "/dmo/blockchain-control" },
      { key: "blockchain-stl-proofs", label: "STL proofs", href: "/dmo/blockchain-control/stl-proofs" },
      { key: "blockchain-crb-hashes", label: "CRB hashes", href: "/dmo/blockchain-control/crb-hashes" },
      { key: "blockchain-explorer", label: "Explorer", href: "/dmo/blockchain-control/explorer" },
    ],
  },
  {
    key: "notifications",
    icon: S('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    label: "Notifications",
    href: "/dmo/notifications",
    groupKey: "intelligence",
    items: [
      { key: "notifications-all", label: "All", href: "/dmo/notifications/all" },
      { key: "notifications-critical", label: "Critical", href: "/dmo/notifications/critical" },
      { key: "notifications-warnings", label: "Warnings", href: "/dmo/notifications/warnings" },
      { key: "notifications-system", label: "System alerts", href: "/dmo/notifications/system" },
    ],
  },
  {
    key: "settings",
    icon: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-2.82H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.82-.33V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 .33 2.82H21a2 2 0 1 1 0 4h-.09"/>'),
    label: "Settings",
    href: "/dmo/settings",
    groupKey: "intelligence",
    items: [
      { key: "settings-users", label: "Users", href: "/dmo/settings/users" },
      { key: "settings-roles", label: "Roles", href: "/dmo/settings/roles" },
      { key: "settings-permissions", label: "Permissions", href: "/dmo/settings/permissions" },
      { key: "settings-config", label: "System config", href: "/dmo/settings/config" },
    ],
  },
];

/** Group sections by their `groupKey` so the sidebar can render headers. */
export function groupDmoSections(sections: DmoNavSection[] = DMO_NAV_SECTIONS) {
  const byGroup: Record<DmoNavGroupKey, DmoNavSection[]> = {
    overview: [],
    verification: [],
    operations: [],
    intelligence: [],
  };
  for (const section of sections) {
    byGroup[section.groupKey].push(section);
  }
  return DMO_NAV_GROUPS.map((group) => ({
    ...group,
    sections: byGroup[group.key],
  }));
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/** Active link match for DMO routes (supports nested paths). */
export function isDmoPathActive(pathname: string, href: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);
  return p === h || p.startsWith(`${h}/`);
}

/**
 * Resolves which DMO module owns the current URL. Uses longest-prefix wins so
 * `/dmo/pss/...` does not incorrectly match the dashboard base `/dmo`.
 */
export function getDmoSectionKeyFromPathname(pathname: string | null): string | null {
  if (!pathname) return DMO_NAV_SECTIONS[0]?.key ?? null;
  const normalized = normalizePathname(pathname);

  const candidates: { key: string; prefix: string }[] = [];
  for (const section of DMO_NAV_SECTIONS) {
    candidates.push({ key: section.key, prefix: section.href });
    for (const item of section.items) {
      candidates.push({ key: section.key, prefix: item.href });
    }
  }
  candidates.sort((a, b) => b.prefix.length - a.prefix.length);

  for (const { key, prefix } of candidates) {
    const pref = normalizePathname(prefix);
    if (normalized === pref || normalized.startsWith(`${pref}/`)) {
      return key;
    }
  }
  return DMO_NAV_SECTIONS[0]?.key ?? null;
}
