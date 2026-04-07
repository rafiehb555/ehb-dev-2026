/**
 * EHB-STL-LEVEL (Service Trust Level) — DMO reference content.
 * Aligned with docs/development/EHB_MASTER_SYSTEM_PLAN.md §7 and EHB_STL_FULL_PLAN.md.
 */

export const EHB_STL_DOC_VERSION = "8.0";

export type StlLevelRow = {
  level: string;
  score: string;
  label: string;
  icon: string;
  color: string;
};

export const stlLevels: StlLevelRow[] = [
  { level: "L1", score: "0–39", label: "Low Trust / FREE", icon: "🔴", color: "#EF4444" },
  { level: "L2", score: "40–59", label: "Basic Verified / BASIC", icon: "🟠", color: "#F97316" },
  { level: "L3", score: "60–74", label: "Trusted / STANDARD", icon: "🔵", color: "#3B82F6" },
  { level: "L4", score: "75–89", label: "Highly Trusted / PREMIUM", icon: "🟣", color: "#8B5CF6" },
  { level: "L5", score: "90–100", label: "Elite Verified / VIP", icon: "👑", color: "#10B981" },
];

export const stlFormulaLines = [
  { component: "PSS Score", range: "0–40", note: "Identity verification layers (EHB-PSS)" },
  { component: "CRB Score", range: "0–20", note: "Physical certification (EHB-CRB)" },
  { component: "Performance", range: "0–20", note: "Orders, services completed" },
  { component: "Behavior", range: "−50–20", note: "Fraud signals, inspection results" },
  { component: "Industries", range: "0–20", note: "Multi-industry verification boost" },
  { component: "Refilling", range: "−40–10", note: "Re-verification status" },
];

export const stlAccessRows: { feature: string; l1: string; l2: string; l3: string; l4: string; l5: string }[] = [
  { feature: "Browse", l1: "✅", l2: "✅", l3: "✅", l4: "✅", l5: "✅" },
  { feature: "Sell products", l1: "❌", l2: "✅ limited", l3: "✅", l4: "✅", l5: "✅" },
  { feature: "Withdrawal limit", l1: "❌", l2: "£50/day", l3: "£250/day", l4: "£1,000/day", l5: "Unlimited" },
  { feature: "Franchise apply", l1: "❌", l2: "❌", l3: "✅", l4: "✅", l5: "✅" },
  { feature: "Commission", l1: "—", l2: "15%", l3: "12%", l4: "10%", l5: "8%" },
  { feature: "Validator eligible", l1: "❌", l2: "❌", l3: "❌", l4: "✅", l5: "✅" },
];

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
  { stlLevel: "L5", multiplier: "× 1.35" },
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
  { href: "/dmo/crb", label: "EHB-CRB", short: "Certification & Registry Board", note: "Certificates & inspections → CRB score" },
  { href: "/dmo/jps/profiles", label: "EHB-JPS", short: "Job Profile & Skill", note: "Designations & salary multipliers use STL" },
  { href: "/dmo/industry", label: "Industries", short: "35 industries", note: "Industry verification boosts Industries component" },
  { href: "/dmo/refilling", label: "Refilling", short: "6-month cycle", note: "Drives Refilling component of score" },
  { href: "/dmo/franchise", label: "Franchise", short: "ESF / EMF / ECF", note: "Inspections & franchise KPIs affect Behavior" },
  { href: "/dmo/affiliate", label: "EHB-EAP", short: "Affiliate Program", note: "Network trust & attribution" },
  { href: "/dmo/penalty", label: "Penalties", short: "Complaints", note: "Violations can reduce STL" },
];
