/**
 * Law-specific marketing + marketplace copy derived from EHB OLS Law prototype data
 * (`content/industries/law/ols-law-source/…`, esp. `src/database/mockData.ts` + landing AI features).
 * Demo-only — replace with API/CMS later.
 */

export const LAW_OLS_SOURCE =
  "content/industries/law/ols-law-source (mock lawyers, cases, franchise — see mockData.ts)";

export const lawLandingContent = {
  /** Richer hero line under the main title */
  heroLead:
    "Hire verified lawyers or offer legal services worldwide: AI-assisted document match, PSS-verified counsel, secure settlement via EHB Trusty Wallet & STL — same flows as the OLS Law prototype.",
  /** Compact stats row (aligned with OLS landing “HERO_STATS” concept) */
  stats: [
    { label: "Legal verticals", value: "32+" },
    { label: "AI-assisted flows", value: "14" },
    { label: "Target markets", value: "50+" },
    { label: "Trust stack", value: "PSS·DMO·STL" },
  ] as const,
  /** Replaces generic “Why {industry} on EHB” for Law only */
  whyEhb: [
    {
      title: "Verified counsel",
      desc: "Lawyers and firms pass PSS + bar verification; ratings and STL-backed trust like OLS mock profiles.",
    },
    {
      title: "AI + documents",
      desc: "AI legal agent, document drafter, and case monitoring — inspired by the OLS landing feature grid.",
    },
    {
      title: "Franchise-ready",
      desc: "EHB Law franchise offices (e.g. Lahore, Karachi, Dubai in mock data) map to real expansion paths.",
    },
    {
      title: "Secure money & records",
      desc: "Consultation fees, retainers, and settlements flow through EHB wallet rules — disputes auditable on-chain-ready.",
    },
  ],
  aiInsights:
    "Demand signals, jurisdiction hints, and document workload for Law will feed from JPS + OLS-style case graph: AI suggests counsel tier, draft templates, and franchise routing — same intelligence direction as the standalone OLS app.",
};

export type LawTrending = { name: string; blurb: string };

/** Trending cards: names from industry services + blurbs from OLS themes */
export const lawTrendingServices: LawTrending[] = [
  { name: "Legal Advice", blurb: "Initial consult & strategy — PKR / AED tiers from OLS fee model." },
  { name: "Document Drafting", blurb: "Contracts, notices, filings — AI-assisted drafts reviewed by verified lawyers." },
  { name: "Company Formation", blurb: "Corporate setup & compliance bundles (Karachi / Dubai mock offices)." },
  { name: "Contracts", blurb: "B2B, employment, vendor — negotiation + STL-secured milestones." },
  { name: "Divorce", blurb: "Family court workflow — custody & settlement paths (OLS family-law counsel)." },
  { name: "Custody", blurb: "Child custody & mediation with documented court history." },
  { name: "Court Representation", blurb: "Civil & criminal appearance — LHC / SHC / DIFC jurisdictions." },
  { name: "Bail", blurb: "Urgent filings & surety coordination." },
  { name: "Visa Consultation", blurb: "Immigration & work permits — UAE + PK cross-border mock practice." },
  { name: "Work Permit", blurb: "Employer-sponsored documentation & compliance." },
];

export type LawProviderRow = {
  initials: string;
  headline: string;
  city: string;
  focus: string;
  rating: string;
  reviews: string;
  badge: string;
};

/** Mirrors first three MOCK_LAWYERS entries (titles, cities, practice — not personal data). */
export const lawTopProviders: LawProviderRow[] = [
  {
    initials: "IS",
    headline: "Advocate High Court",
    city: "Lahore, PK",
    focus: "Property · Civil · Contracts",
    rating: "4.9",
    reviews: "234 reviews",
    badge: "Top rated · PSS verified",
  },
  {
    initials: "SM",
    headline: "Advocate Supreme Court",
    city: "Karachi, PK",
    focus: "Family · Divorce · Custody",
    rating: "4.8",
    reviews: "189 reviews",
    badge: "Family law expert · Verified",
  },
  {
    initials: "AH",
    headline: "International Legal Consultant",
    city: "Dubai, AE",
    focus: "Corporate · M&A · Cross-border",
    rating: "4.95",
    reviews: "312 reviews",
    badge: "Premium · DIFC-class",
  },
];

export type LawJobRow = { title: string; detail: string };

export const lawJobOpenings: LawJobRow[] = [
  {
    title: "Associate Lawyer — Corporate (Karachi)",
    detail: "3+ yrs · PKR 180k–280k/mo · Hybrid — EHB Law Services Karachi (mock franchise).",
  },
  {
    title: "Legal researcher — Remote",
    detail: "Common-law research · contracts & compliance · stipend + STL performance bonus.",
  },
  {
    title: "Paralegal — Lahore",
    detail: "Civil filings & client intake · Urdu/English · onsite at partner franchise office.",
  },
];

export const lawIndustryHomeIntro =
  "Browse verified legal services, counsel, and roles on the EHB legal stack — data aligned with the OLS Law prototype (mock lawyers, franchises, jurisdictions).";
