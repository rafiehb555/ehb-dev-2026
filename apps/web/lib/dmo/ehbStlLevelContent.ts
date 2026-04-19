/**
 * EHB-STL-LEVEL (Service Trust Level) — DMO reference content.
 * Level bands and names are derived from `lib/stl/levels.ts` (single source of truth).
 */

import { EHB_STL_LEVELS } from "@/lib/stl/levels";

export const EHB_STL_DOC_VERSION = "8.0";

export type StlLevelRow = {
  level: string;
  score: string;
  label: string;
  icon: string;
  color: string;
};

const STL_LEVEL_ICONS = ["🔴", "🟠", "🟡", "🔵", "🟣", "🟢", "💎", "👑"];
const STL_LEVEL_COLORS = ["#EF4444", "#F97316", "#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#D946EF", "#FBBF24"];

/** Canonical L1–L8 rows — keep in sync with engine */
export const stlLevels: StlLevelRow[] = EHB_STL_LEVELS.map((l, i) => ({
  level: l.code,
  score: `${l.min}–${l.max}`,
  label: l.name,
  icon: STL_LEVEL_ICONS[i] ?? "⚪",
  color: STL_LEVEL_COLORS[i] ?? "#94a3b8",
}));

export const stlFormulaLines = [
  { component: "PSS", range: "30%", note: "KYC + level progress + complaint sensitivity" },
  { component: "CRB", range: "30%", note: "Verifications + exams performance" },
  { component: "DMO", range: "20%", note: "Refill completion and consistency" },
  { component: "Franchise", range: "10%", note: "Verified vs pending locations ratio" },
  { component: "Penalty", range: "Dynamic", note: "Complaints can block upgrades" },
];

/** L1–L8 access matrix (reference — tune in product). */
export const stlAccessMatrix: { feature: string; byLevel: string[] }[] = [
  { feature: "Browse", byLevel: ["✅", "✅", "✅", "✅", "✅", "✅", "✅", "✅"] },
  { feature: "Sell products", byLevel: ["❌", "✅ lim", "✅", "✅", "✅", "✅", "✅", "✅"] },
  { feature: "Withdrawal limit", byLevel: ["❌", "£50/d", "£250/d", "£500/d", "£1k/d", "£2k/d", "£5k/d", "∞"] },
  { feature: "Franchise apply", byLevel: ["❌", "❌", "✅", "✅", "✅", "✅", "✅", "✅"] },
  { feature: "Commission", byLevel: ["—", "15%", "14%", "12%", "10%", "9%", "8%", "7%"] },
  { feature: "Validator eligible", byLevel: ["❌", "❌", "❌", "✅", "✅", "✅", "✅", "✅"] },
];

/** @deprecated Use stlAccessMatrix; columns L1–L5 only */
export const stlAccessRows: { feature: string; l1: string; l2: string; l3: string; l4: string; l5: string }[] =
  stlAccessMatrix.map((row) => ({
    feature: row.feature,
    l1: row.byLevel[0] ?? "—",
    l2: row.byLevel[1] ?? "—",
    l3: row.byLevel[2] ?? "—",
    l4: row.byLevel[3] ?? "—",
    l5: row.byLevel[4] ?? "—",
  }));

export const pssStlImpact: { phase: string; boost: string }[] = [
  { phase: "Phase 0 (none)", boost: "+0" },
  { phase: "Phase 1 (L1+L2)", boost: "+30 base STL" },
  { phase: "Phase 2 (all 5)", boost: "+40 base STL" },
];

export const crbCertBoost: { level: string; stlBoost: string; eligibility: string }[] = [
  { level: "Basic", stlBoost: "+5", eligibility: "L2 users" },
  { level: "Standard", stlBoost: "+10", eligibility: "L3 users" },
  { level: "Advanced", stlBoost: "+15", eligibility: "L4 users" },
  { level: "VIP", stlBoost: "+20", eligibility: "L5 users" },
];

export const jpsStlMultiplier: { stlLevel: string; multiplier: string }[] = [
  { stlLevel: "L1", multiplier: "× 0.80" },
  { stlLevel: "L2", multiplier: "× 1.00" },
  { stlLevel: "L3", multiplier: "× 1.10" },
  { stlLevel: "L4", multiplier: "× 1.20" },
  { stlLevel: "L5", multiplier: "× 1.28" },
  { stlLevel: "L6", multiplier: "× 1.32" },
  { stlLevel: "L7", multiplier: "× 1.35" },
  { stlLevel: "L8", multiplier: "× 1.42" },
];

export const gosellrSellerTiers: { tier: string; type: string; stlMin: string }[] = [
  { tier: "T1", type: "Manufacturer", stlMin: "L4" },
  { tier: "T2", type: "Dealer", stlMin: "L3" },
  { tier: "T3", type: "Distributor", stlMin: "L3" },
  { tier: "T4", type: "Wholesaler", stlMin: "L2" },
  { tier: "T5", type: "Trader", stlMin: "L2" },
  { tier: "T6", type: "Retailer", stlMin: "L2" },
  { tier: "T7", type: "Online Seller", stlMin: "L1 (limited)" },
];

export const dmoStlPanelTools: string[] = [
  "Manual override (reason required)",
  "Freeze / suspend trust state",
  "Appeals queue",
  "Bulk recalculate",
  "Audit trail review",
];

export const stlCardDisplayRules: string[] = [
  "GoSellr GSM product card → Seller STL badge below price",
  "User profile card → STL badge + score",
  "EHB-JPS profile → STL badge + level",
  "Franchise card → STL score shown",
];

export const ecosystemLinks: { href: string; label: string; short: string; note: string }[] = [
  { href: "/dmo/pss", label: "EHB-PSS", short: "Proof & Security System", note: "Identity layers feed PSS portion of STL" },
  { href: "/dmo/crb", label: "EHB-CRB", short: "Central Record Blockchain", note: "Certificates & inspections → CRB score" },
  { href: "/dmo/jps/profiles", label: "EHB-JPS", short: "Job Profile & Skill", note: "Designations & salary multipliers use STL" },
  { href: "/dmo/industry", label: "Industries", short: "35 industries", note: "Industry verification boosts Industries component" },
  { href: "/dmo/refilling", label: "Refilling", short: "6-month cycle", note: "Drives Refilling component of score" },
  { href: "/dmo/franchise", label: "Franchise", short: "ESF / EMF / ECF", note: "Inspections & franchise KPIs affect Behavior" },
  { href: "/dmo/affiliate", label: "EHB-EAP", short: "Affiliate Program", note: "Network trust & attribution" },
  { href: "/dmo/penalty", label: "Penalties", short: "Complaints", note: "Violations can reduce STL" },
];

/** Bundled reference for `GET /api/stl/meta` and external consumers. */
export function getEhbStlMetaPayload() {
  return {
    documentVersion: EHB_STL_DOC_VERSION,
    sourceRefs: ["docs/development/EHB_MASTER_SYSTEM_PLAN.md §7", "docs/development/EHB_STL_FULL_PLAN.md"],
    formula: stlFormulaLines,
    levels: stlLevels,
    accessControl: stlAccessRows,
    accessControlMatrix: stlAccessMatrix,
    pssImpact: pssStlImpact,
    crbCertBoost,
    jpsSalaryMultiplier: jpsStlMultiplier,
    gosellrSellerTiers,
    dmoPanelTools: dmoStlPanelTools,
    cardDisplayRules: stlCardDisplayRules,
    ecosystemLinks,
  };
}
