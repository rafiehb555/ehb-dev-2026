/**
 * Phase 11–30 (Growth Plan) — UI vs backend tracking for DMO pending work.
 * Source: docs/EHB_PHASE_11_30_GROWTH_PLAN.md (landing app copy).
 */

export type PhaseUiStatus = "ui_ready" | "ui_partial" | "planned";

export type PendingWorkRoute = {
  label: string;
  href: string;
  note: string;
};

export type PendingWorkChecklistItem = {
  label: string;
  /** True when UI exists in app; backend may still be demo/mock */
  uiDone: boolean;
  /** True when roadmap item is fully shipped (rare in demo) */
  backendDone?: boolean;
};

export type PendingWorkPhase = {
  id: string;
  /** e.g. "Phases 11–15" */
  rangeLabel: string;
  title: string;
  summary: string;
  status: PhaseUiStatus;
  /** Rough UI coverage for this track (design + screens wired) */
  uiPercent: number;
  routes: PendingWorkRoute[];
  checklist: PendingWorkChecklistItem[];
};

export const PENDING_WORK_PHASE_GROUPS: PendingWorkPhase[] = [
  {
    id: "track-fraud",
    rangeLabel: "Phases 11–15",
    title: "AI fraud detection & risk",
    summary: "Signal collection, risk tiers, fraud queue, alerts, and analytics.",
    status: "ui_ready",
    uiPercent: 92,
    routes: [
      { label: "Fraud queue", href: "/dmo/fraud", note: "Tiers, filters, signal breakdown, resolve/block" },
      { label: "Marketplace analytics", href: "/dmo/analytics", note: "Fraud + complaints + order review KPIs" },
      { label: "PSS", href: "/dmo/pss", note: "Upstream verification cases" },
    ],
    checklist: [
      { label: "Live signal feed UI", uiDone: true },
      { label: "Risk tier filters + score gauge", uiDone: true },
      { label: "POST /api/fraud/signal persistence", uiDone: false, backendDone: false },
      { label: "Email alerts for CRITICAL", uiDone: false },
      { label: "Weekly CSV export", uiDone: false },
    ],
  },
  {
    id: "track-recommendations",
    rangeLabel: "Phases 16–22",
    title: "AI recommendations & insights",
    summary: "Behavior tracking, insight cards, trending, search assist, matching, feedback.",
    status: "ui_partial",
    uiPercent: 55,
    routes: [
      { label: "AI recommendations hub", href: "/dmo/ai-recommendations", note: "Insights, trending, feedback (UI shell)" },
      { label: "Automation", href: "/dmo/automation", note: "Rules / triggers overview" },
      { label: "AI Marketplace", href: "/ai-marketplace", note: "Discovery + trust messaging" },
    ],
    checklist: [
      { label: "Insight card patterns + CTAs", uiDone: true },
      { label: "Trending strip (per industry)", uiDone: true },
      { label: "Thumbs feedback on recommendations", uiDone: true },
      { label: "POST /api/events/track", uiDone: false },
      { label: "GET /api/ai/recommendations live engine", uiDone: false },
    ],
  },
  {
    id: "track-gosellr",
    rangeLabel: "Phases 23–29",
    title: "GoSellr + DMO integration",
    summary: "Seller onboarding, order review, complaints, escrow, marketplace analytics.",
    status: "ui_ready",
    uiPercent: 88,
    routes: [
      { label: "Applications", href: "/dmo/applications", note: "Seller + order workflows" },
      { label: "Moderation", href: "/dmo/moderation", note: "Complaint queue + resolution" },
      { label: "GoSellr product", href: "/gosellr", note: "Trust lines on cards" },
    ],
    checklist: [
      { label: "Complaint moderation UI", uiDone: true },
      { label: "Application filters (seller/order)", uiDone: true },
      { label: "Escrow hold/extend UI in order detail", uiDone: false },
      { label: "Review fraud pattern flags", uiDone: false },
    ],
  },
  {
    id: "track-unified-queue",
    rangeLabel: "Phase 30",
    title: "Unified operations queue",
    summary: "Single priority-sorted queue for all DMO actions.",
    status: "ui_ready",
    uiPercent: 95,
    routes: [
      { label: "Unified queue", href: "/dmo/queue", note: "All types + priority filters" },
      { label: "Refilling", href: "/dmo/refilling", note: "Compliance renewals" },
    ],
    checklist: [
      { label: "Cross-module aggregation UI", uiDone: true },
      { label: "Operator assignment", uiDone: false },
      { label: "Server-backed queue ordering", uiDone: false },
    ],
  },
];

export function aggregateRoadmapStats() {
  const uiAvg =
    PENDING_WORK_PHASE_GROUPS.reduce((acc, p) => acc + p.uiPercent, 0) /
    Math.max(1, PENDING_WORK_PHASE_GROUPS.length);
  const checklist = PENDING_WORK_PHASE_GROUPS.flatMap((p) => p.checklist);
  const uiDone = checklist.filter((c) => c.uiDone).length;
  const backendDone = checklist.filter((c) => c.backendDone === true).length;
  return {
    phaseCount: PENDING_WORK_PHASE_GROUPS.length,
    uiAveragePercent: Math.round(uiAvg),
    checklistTotal: checklist.length,
    checklistUiDone: uiDone,
    checklistBackendDone: backendDone,
  };
}
