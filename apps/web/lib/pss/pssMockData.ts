import type { PssCaseSummary } from "@/components/pss/PSSCaseCard";
import type { AuditEvent } from "@/components/pss/AuditTimeline";
import type { PlatformRule } from "@/components/pss/RuleBuilder";
import type { CriterionResult } from "@/components/pss/CriteriaChecklist";

export const MOCK_PSS_CASES: PssCaseSummary[] = [
  {
    id: "case_01ht_ali",
    user: { name: "Ali Khan", email: "ali@test.com" },
    entityType: "Medical device",
    platform: "gosellr",
    score: 78,
    risk: "HIGH",
    stage: "AML_RISK",
    stlLevel: 5,
    updatedAt: "14 Apr 2026 · 21:37",
  },
  {
    id: "case_02ht_sara",
    user: { name: "Dr. Sara Noor", email: "sara@test.com" },
    entityType: "Cardiologist profile",
    platform: "hps",
    score: 84,
    risk: "MEDIUM",
    stage: "FRANCHISE_REVIEW",
    stlLevel: 5,
    updatedAt: "14 Apr 2026 · 18:22",
  },
  {
    id: "case_03ht_usman",
    user: { name: "Usman Raza", email: "usman@test.com" },
    entityType: "Organic food product",
    platform: "gosellr",
    score: 46,
    risk: "MEDIUM",
    stage: "DOCUMENTS",
    stlLevel: 3,
    updatedAt: "14 Apr 2026 · 22:07",
  },
  {
    id: "case_04ht_lex",
    user: { name: "Lex Partners LLC" },
    entityType: "Corporate law firm",
    platform: "ols",
    score: 93,
    risk: "LOW",
    stage: "CRB_REVIEW",
    stlLevel: 7,
    updatedAt: "14 Apr 2026 · 20:11",
  },
  {
    id: "case_05ht_hira",
    user: { name: "Hira Textiles", email: "hira@textiles.pk" },
    entityType: "Fabric bulk product",
    platform: "gosellr",
    score: 62,
    risk: "LOW",
    stage: "AUTO_APPROVED",
    stlLevel: 4,
    updatedAt: "14 Apr 2026 · 17:02",
  },
  {
    id: "case_06ht_zain",
    user: { name: "Zain Traders", email: "zain@traders.pk" },
    entityType: "Honey 1kg product",
    platform: "gosellr",
    score: 72,
    risk: "LOW",
    stage: "AUTO_APPROVED",
    stlLevel: 4,
    updatedAt: "14 Apr 2026 · 15:48",
  },
  {
    id: "case_07ht_bilal",
    user: { name: "Bilal Mehmood", email: "bilal@dev.pk" },
    entityType: "Freelancer profile",
    platform: "jps",
    score: 38,
    risk: "CRITICAL",
    stage: "FRAUD_FLAGGED",
    stlLevel: 2,
    updatedAt: "14 Apr 2026 · 22:58",
  },
];

export const MOCK_AUDIT_TIMELINE: AuditEvent[] = [
  {
    id: "ev_01",
    at: "14 Apr · 21:12",
    title: "stl_request created",
    detail: "Source: gosellr-backend · idempotency_key: req_01ht_zk2",
    tone: "ok",
  },
  {
    id: "ev_02",
    at: "14 Apr · 21:12",
    title: "Criteria loaded — 15 items",
    detail: "criteria_set: gs_product_v4",
    tone: "ok",
  },
  {
    id: "ev_03",
    at: "14 Apr · 21:13",
    title: "AML flag raised",
    detail: "Watchlist match · confidence 0.34 · needs review",
    tone: "warn",
  },
  {
    id: "ev_04",
    at: "14 Apr · 21:13",
    title: "Routed → Franchise",
    detail: "Rule match: franchise_full (P4) · assigned: GoSellr-Lahore",
    tone: "info",
  },
  {
    id: "ev_05",
    at: "14 Apr · 21:37",
    title: "Operator opened case",
    detail: "Reviewer: Saeed Ahmed (franchise_lhe_gs)",
    tone: "info",
  },
];

export const MOCK_CRITERIA: CriterionResult[] = [
  { id: "c1", title: "Title ≥ 20 chars", met: true },
  { id: "c2", title: "≥ 3 product images, all ≥ 800px", met: true, detail: "4 images uploaded, avg 1240×960" },
  { id: "c3", title: "Verified seller identity (PSS)", met: true, detail: "KYC + liveness passed 3 months ago" },
  { id: "c4", title: "Seller profile complete", met: true, detail: "Address, tax ID, contact verified" },
  { id: "c5", title: "Category classification valid", met: true },
  { id: "c6", title: "SKU / GTIN provided", met: true },
  { id: "c7", title: "Stock quantity declared", met: true },
  { id: "c8", title: "Return policy attached", met: true },
  { id: "c9", title: "Shipping zones configured", met: true },
  { id: "c10", title: "Brand / origin proof", met: false, detail: "Optional — unlocks L5+" },
  { id: "c11", title: "Medical device import license", met: false, required: true, detail: "Required for category: medical" },
  { id: "c12", title: "AML screening clean", met: false, required: true, detail: "Watchlist match confidence 0.34" },
  { id: "c13", title: "Halal / organic certificate", met: false },
  { id: "c14", title: "Business registration (NTN)", met: false },
  { id: "c15", title: "GST compliance record", met: false },
];

export const MOCK_GOSELLR_RULES: PlatformRule[] = [
  { id: "r1", priority: 1, name: "auto_free", operator: "lte", threshold: 2, action: "reject", active: true },
  { id: "r2", priority: 2, name: "auto_basic", operator: "eq", threshold: 3, action: "auto_approve", stlLevel: 2, active: true },
  { id: "r3", priority: 3, name: "auto_normal", operator: "gte", threshold: 8, action: "auto_approve", stlLevel: 3, active: true },
  { id: "r4", priority: 4, name: "franchise_vip", operator: "gte", threshold: 12, action: "route_franchise", stlLevel: 8, active: true },
  { id: "r5", priority: 5, name: "crb_elite", operator: "gte", threshold: 14, action: "route_crb", stlLevel: 9, active: true },
];

export type WebhookLog = {
  id: string;
  eventId: string;
  target: string;
  platform: string;
  status: "delivered" | "pending" | "retry" | "failed";
  latencyMs?: number;
  attempt: number;
  sentAt: string;
};

export const MOCK_WEBHOOK_LOGS: WebhookLog[] = [
  { id: "wh_01", eventId: "evt_01ht_ali", target: "gosellr-api/webhooks/pss", platform: "gosellr", status: "delivered", latencyMs: 127, attempt: 1, sentAt: "14 Apr · 21:13:48" },
  { id: "wh_02", eventId: "evt_02ht_sara", target: "hps-api/webhooks/pss", platform: "hps", status: "delivered", latencyMs: 184, attempt: 1, sentAt: "14 Apr · 18:22:12" },
  { id: "wh_03", eventId: "evt_03ht_usman", target: "gosellr-api/webhooks/pss", platform: "gosellr", status: "retry", latencyMs: 2004, attempt: 2, sentAt: "14 Apr · 22:07:33" },
  { id: "wh_04", eventId: "evt_04ht_lex", target: "ols-api/webhooks/pss", platform: "ols", status: "delivered", latencyMs: 96, attempt: 1, sentAt: "14 Apr · 20:11:02" },
  { id: "wh_05", eventId: "evt_05ht_bilal", target: "jps-api/webhooks/pss", platform: "jps", status: "failed", attempt: 3, sentAt: "14 Apr · 22:58:18" },
  { id: "wh_06", eventId: "evt_06ht_hira", target: "gosellr-api/webhooks/pss", platform: "gosellr", status: "delivered", latencyMs: 143, attempt: 1, sentAt: "14 Apr · 17:02:55" },
];
