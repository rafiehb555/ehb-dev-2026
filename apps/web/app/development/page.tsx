"use client";

// ═══════════════════════════════════════════════════════════════════════════
//  EHB DEVELOPMENT CENTER — Real-time Build Control Panel
//  Company : EHB Technologies (Pvt.) Ltd.
//  Version : 5.0 (2026-04-11) — Cinematic Hero + Bento Mission Control
//
//  v5.0 changes (this revision):
//    • CINEMATIC HERO (design-system §7.12 — new pattern):
//        – Near-black glass surface with ambient drifting gradient orbs
//        – Huge minimalist headline (clamp 44–96px), gradient 2nd line
//        – 4-up animated number counter row (platform / industries /
//          core depts / AI modules) with stagger rise-in
//        – AI Copilot ribbon (clickable) — dynamic brief from live data
//        – Gradient CTA shimmer strip + ghost "Landing" CTA
//        – Live status pill with pulsing dot (teal=live, amber=static)
//        – Top scan-line, tuned box shadow, reduced-motion compliant
//    • Bento Mission Control preserved below hero as working area
//    • Tesla / Apple minimalist aesthetic — empty space, big numbers
//    • All animations gated behind prefers-reduced-motion (§8.4)
//    • Full keyboard + focus-visible support (§11)
//
//  v4.4 changes (prev revision):
//    • Mobile bento collapse (<900px → 1 col) via injected media query
//    • Page enter fade + slide-up stagger (design-system §8.2)
//    • Critical pulse animation on Quick Action banner (§8.1)
//    • Esc-key drawer close + focus trap on open (§11)
//    • Focus-visible outline on all clickable cards (§11)
//    • prefers-reduced-motion compliance (§8.4)
//    • aria-labels on drill-down buttons (§11)
//
//  REAL-TIME DATA FLOW:
//    /development  ─fetch─▶  /api/dev-status  ─read─▶  ehb-status.json
//                                                             ▲
//                                                             │  rolled in by
//                                         scripts/ehb-status-update.mjs
//                                                             ▲
//                                                             │  appended by
//                                         scripts/ehb-log-change.mjs
//
//  This page starts with a STATIC fallback DATA object baked in, then
//  useEffect fetches /api/dev-status on mount and every 15 seconds so logs
//  show up without redeploying.
//
//  See docs/EHB_CONTEXT.md §15 for agent rules.
//  See design-system/EHB-UIUX-SYSTEM.md §7.11 for Bento Mission Control spec
//  and §7.12 for the v5.0 Cinematic Hero pattern.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderFlowWidget } from "@/components/core/FolderFlowWidget";

// ── TYPES ───────────────────────────────────────────────────────────────
type Level = "high" | "med" | "low";
type Status = "live" | "partial" | "pending";

type UrgentFix = {
  id: string;
  level: Level;
  title: string;
  where: string;
  impact: string;
  eta: string;
  owner: string;
};

type Bug = {
  id: string;
  severity: Level;
  type: string;
  message: string;
  file: string;
  line: number;
  status: "open" | "fixed" | "wontfix";
};

type Duplicate = {
  what: string;
  locations: string[];
  action: string;
  status: "open" | "fixed";
};

type MissingField = {
  field: string;
  needFrom: string;
  blocks: string;
  priority: Level;
};

type EmptyEntry = {
  path: string;
  kind: "file" | "folder";
  reason: string;
  level: Level;
};

// ── FALLBACK DATA (used until /api/dev-status replies) ──────────────────
const FALLBACK = {
  stats: [
    { val: "32",   label: "Industries",   sub: "6 live in Phase-1",      color: "purple", icon: "🏭" },
    { val: "50+",  label: "Countries",    sub: "Global rollout",         color: "teal",   icon: "🌍" },
    { val: "8",    label: "STL Levels",   sub: "L0 – L8 Supreme",        color: "purple", icon: "⭐" },
    { val: "100+", label: "AI Modules",   sub: "Planned / in build",     color: "amber",  icon: "🤖" },
    { val: "~70%", label: "Shared Reuse", sub: "Booking / pay / chat",   color: "teal",   icon: "🧩" },
    { val: "8",    label: "Core Depts",   sub: "PSS CRB STL DMO JPS ...", color: "amber", icon: "🏛️" },
  ],

  priorities: [
    { n: 1, level: "high" as Level, title: "Finalize microservices architecture contracts", meta: "THIS WEEK", icon: "🏗️" },
    { n: 2, level: "high" as Level, title: "Wire wallet escrow into all booking flows",     meta: "THIS WEEK", icon: "💰" },
    { n: 3, level: "high" as Level, title: "AI recommend → marketplace listings",           meta: "THIS WEEK", icon: "🤖" },
    { n: 4, level: "med"  as Level, title: "STL scoring rules per-industry calibration",    meta: "NEXT",      icon: "⭐" },
    { n: 5, level: "med"  as Level, title: "Identity + verification service first pass",    meta: "NEXT",      icon: "🔐" },
    { n: 6, level: "med"  as Level, title: "Apply database master schema to Postgres",      meta: "NEXT",      icon: "🗄️" },
    { n: 7, level: "low"  as Level, title: "Wire app routes to remaining modules",          meta: "LATER",     icon: "🧷" },
    { n: 8, level: "low"  as Level, title: "Industry pages — live data for 1-2 sections",   meta: "LATER",     icon: "📊" },
  ],

  coreSystems: [
    { name: "AI Department",            progress: 40, icon: "🤖" },
    { name: "Blockchain (Polkadot)",    progress: 10, icon: "⛓️" },
    { name: "Finance / Wallet",         progress: 35, icon: "💰" },
    { name: "Affiliate System",         progress: 20, icon: "🔗" },
    { name: "Franchise System",         progress: 15, icon: "🏢" },
    { name: "JPS — Job Profile",        progress: 30, icon: "💼" },
    { name: "Verification PSS/CRB/STL", progress: 25, icon: "🔐" },
    { name: "DMO — Management Office",  progress: 35, icon: "🏛️" },
  ],

  industries: {
    phase1: [
      { name: "E-commerce (GoSellr GSM)", progress: 60, icon: "🛒" },
      { name: "Legal Services (OLS)",     progress: 30, icon: "⚖️" },
      { name: "Medical & Health (WMS)",   progress: 20, icon: "🏥" },
      { name: "Education (HPS / OBS)",    progress: 15, icon: "🎓" },
      { name: "Jobs & HR (JPS)",          progress: 30, icon: "💼" },
      { name: "Travel & Tourism (AGTS)",  progress: 10, icon: "✈️" },
    ],
    phase2: [
      "Finance", "Consulting", "Construction", "Agriculture", "Automotive",
      "Hospitality", "Real Estate", "Entertainment", "Media", "Fashion",
      "Beauty", "Fitness", "Logistics", "Manufacturing", "Energy",
      "Technology", "Telecom", "Government", "NGO", "Sports",
      "Music", "Gaming", "Food", "Pets", "Weddings", "Events",
    ],
  },

  departments: [
    { code: "PSS",  name: "Proof & Security System",         pct: 30, color: "#7B6EF6", icon: "🔐" },
    { code: "CRB",  name: "Central Record Blockchain",  pct: 25, color: "#F0A030", icon: "📜" },
    { code: "STL",  name: "Service Trust Level",             pct: 35, color: "#2BBFA0", icon: "⭐" },
    { code: "DMO",  name: "Decentralized Mgmt Office",       pct: 35, color: "#38C878", icon: "🏛️" },
    { code: "JPS",  name: "Job Profile & Skill",             pct: 30, color: "#A098F8", icon: "💼" },
    { code: "Franchise", name: "Global Franchise Network",   pct: 15, color: "#F05858", icon: "🏢" },
  ],

  apis: [
    { method: "POST", path: "/api/auth/register",  tag: "Auth",   status: "live"    as Status },
    { method: "POST", path: "/api/auth/login",     tag: "Auth",   status: "live"    as Status },
    { method: "GET",  path: "/api/stl/:userId",    tag: "STL",    status: "live"    as Status },
    { method: "POST", path: "/api/stl/recalc",     tag: "STL",    status: "live"    as Status },
    { method: "GET",  path: "/api/pss/status",     tag: "PSS",    status: "partial" as Status },
    { method: "POST", path: "/api/crb/submit",     tag: "CRB",    status: "partial" as Status },
    { method: "GET",  path: "/api/dmo/queue",      tag: "DMO",    status: "live"    as Status },
    { method: "POST", path: "/api/dmo/fraud",      tag: "DMO",    status: "live"    as Status },
    { method: "GET",  path: "/api/wallet/balance", tag: "Wallet", status: "pending" as Status },
    { method: "POST", path: "/api/wallet/escrow",  tag: "Wallet", status: "pending" as Status },
    { method: "POST", path: "/api/ai/adjust",      tag: "AI",     status: "partial" as Status },
    { method: "GET",  path: "/api/franchise/list", tag: "Fran.",  status: "pending" as Status },
  ],

  flows: {
    user:     ["User signup", "PSS verification", "JPS profile creation", "Service access (consumer)"],
    provider: ["Provider signup", "PSS identity verify", "CRB certification", "STL level assignment",
               "Service listing via DMO", "Orders & earnings"],
    franchise:["Country franchise apply", "Corporate franchise", "Sub franchise",
               "Providers onboarding", "Local orders management"],
  },

  warnings: [
    { level: "high" as Level, text: "AI recommend not yet wired to marketplace listings" },
    { level: "high" as Level, text: "Wallet escrow not fully linked to all booking flows" },
    { level: "med"  as Level, text: "STL scoring rules pending final per-industry calibration" },
    { level: "med"  as Level, text: "CRB blockchain hash storage pending Polkadot contract" },
    { level: "low"  as Level, text: "Live industry stats — only 2/32 wired to real data" },
  ],

  sharedTools: [
    "Booking engine (Medical, Legal, Education, Travel, Local)",
    "Payment gateway + EHB Wallet (all industries)",
    "Messaging + notifications (all industries)",
    "Reviews & ratings (marketplace + services)",
    "Analytics dashboards (DMO, franchise, affiliate)",
  ],

  industrySpecific: [
    "Medical — prescriptions, lab reports, medical records",
    "Legal — contracts, case files, court documents",
    "Education — LMS, exams, assignments, course builder",
    "Travel — flight / hotel search, itineraries, visa flows",
  ],

  aiIntegration: [
    "AI Lawyer — Legal (case triage, document drafting, risk analysis)",
    "AI Diagnosis — Medical (symptom triage, report explanation)",
    "AI Resume Builder — Jobs (CV generation & optimization)",
    "AI Course Tutor — Education (adaptive learning paths)",
    "AI Business Advisor — Commerce & SME services",
    "AI Fraud Detector — DMO (transaction + review abuse)",
  ],

  franchiseHierarchy: [
    "Global Super Admin — overall control & policy",
    "Country Franchise — country-level operations & validation",
    "Corporate Franchise — city / sector operations",
    "Sub Franchise — local onboarding, inspections, support",
  ],

  pending: [
    { level: "high" as Level, title: "Wallet escrow module",          sub: "Blocks all paid bookings across 6 Phase-1 industries" },
    { level: "high" as Level, title: "CRB on-chain certificate hash", sub: "Required for STL L5+ trust level" },
    { level: "high" as Level, title: "Franchise dashboard UI",        sub: "No interface for Country/Corporate franchise yet" },
    { level: "med"  as Level, title: "Medical module pages",          sub: "Prescriptions / lab reports screens missing" },
    { level: "med"  as Level, title: "GoSellr cart checkout",         sub: "Cart page exists, checkout flow pending" },
    { level: "med"  as Level, title: "AI prompts folder",             sub: "Needs seeding for AI Lawyer / Diagnosis" },
    { level: "low"  as Level, title: "Onboarding tour",               sub: "First-run walkthrough for new users" },
  ],

  phases: [
    { id: "Phase 0", days: "Days 1–3",   title: "Local stack bring-up",       pct: 100 },
    { id: "Phase 1", days: "Days 4–14",  title: "System hardening + auth",    pct: 75  },
    { id: "Phase 2", days: "Days 15–28", title: "STL + DMO production-ready", pct: 35  },
    { id: "Phase 3", days: "Days 29–42", title: "Wallet, escrow, franchise",  pct: 10  },
    { id: "Phase 4", days: "Days 43–56", title: "AI layer + fraud detection", pct: 5   },
    { id: "Phase 5", days: "Days 57–70", title: "Production launch + scale",  pct: 0   },
  ],

  // ── NEW QUALITY SECTIONS ────────────────────────────────────────────
  urgentFixes: [
    { id: "UF-001", level: "high" as Level, title: "Wallet escrow route not wired", where: "services/api/stl-replit/routes/bookingRoutes.js", impact: "Blocks ALL paid Phase-1 bookings (6 industries)", eta: "2 days",  owner: "backend team" },
    { id: "UF-002", level: "high" as Level, title: "CRB → Polkadot hash storage missing", where: "services/api/stl-replit/services/crbService.js", impact: "Blocks STL L5+ trust level. No on-chain proof.", eta: "1 week", owner: "blockchain team" },
    { id: "UF-003", level: "high" as Level, title: "AI recommend → marketplace not connected", where: "apps/web/app/ai-marketplace/page.tsx", impact: "Users cannot discover services via AI.", eta: "3 days", owner: "frontend + AI team" },
    { id: "UF-004", level: "med"  as Level, title: "Franchise dashboard UI missing", where: "apps/web/app/franchise/", impact: "Country / Corporate franchises cannot operate the platform.", eta: "2 weeks", owner: "frontend team" },
    { id: "UF-005", level: "med"  as Level, title: "PSS liveness detection is placeholder", where: "services/api/stl-replit/services/pssService.js", impact: "KYC can be spoofed by photos.", eta: "1 week", owner: "AI team" },
  ] as UrgentFix[],

  bugs: [
    { id: "BUG-001", severity: "high" as Level, type: "Runtime", message: "MongoDB connection drops silently on long idle — no reconnect hooked", file: "services/api/stl-replit/config/db.js", line: 42, status: "open" as const },
    { id: "BUG-002", severity: "high" as Level, type: "Logic",   message: "STL score not recalculated after CRB approval", file: "services/api/stl-replit/services/stlService.js", line: 178, status: "open" as const },
    { id: "BUG-003", severity: "med"  as Level, type: "TS/Type", message: "Industry type map uses any[] — lost type safety",    file: "apps/web/lib/industry/config.ts", line: 27, status: "open" as const },
    { id: "BUG-004", severity: "med"  as Level, type: "UI",      message: "Mobile nav drawer flickers on first render (hydration mismatch)", file: "apps/web/components/TopNavTabs.tsx", line: 18, status: "open" as const },
    { id: "BUG-005", severity: "low"  as Level, type: "Perf",    message: "home page re-renders industries grid 6x on mount", file: "apps/web/app/home/page.tsx", line: 412, status: "open" as const },
  ] as Bug[],

  duplicates: [
    { what: "Two backend folders (backend/ + services/api/src/)", locations: ["backup/consolidation-2026-04-11/ (archived)"], action: "RESOLVED — services/api/stl-replit/ is the single source of truth", status: "fixed" as const },
    { what: "Card component referenced as uppercase Card.tsx (16 files)", locations: ["backup/casing-fix-2026-04-11/ (archived)"], action: "RESOLVED — all imports now use @/components/ui/card", status: "fixed" as const },
    { what: "Industry list hardcoded in 3 places", locations: ["apps/web/lib/industry/config.ts", "apps/web/app/home/page.tsx (INDUSTRY_CHIPS)", "apps/web/app/development/page.tsx (DATA.industries)"], action: "Extract to packages/types/industries.ts — single source", status: "open" as const },
    { what: "STL level definitions duplicated", locations: ["services/api/stl-replit/constants/stlLevels.js", "apps/web/lib/stl/levels.ts"], action: "Share via packages/types/stl.ts", status: "open" as const },
  ] as Duplicate[],

  missingInfo: [
    { field: "Polkadot contract address",                needFrom: "Blockchain team", blocks: "CRB on-chain hash storage (blocks STL L5+)", priority: "high" as Level },
    { field: "Production MongoDB URI",                    needFrom: "Ops / DevOps",    blocks: "Staging + production deployment",             priority: "high" as Level },
    { field: "JWT_SECRET (production)",                   needFrom: "Security team",   blocks: "Production auth — only local-dev secret exists", priority: "high" as Level },
    { field: "OPENAI_API_KEY (production)",               needFrom: "Finance / Ops",   blocks: "AI Lawyer, Diagnosis, Tutor in production",   priority: "high" as Level },
    { field: "ANTHROPIC_API_KEY (production)",            needFrom: "Finance / Ops",   blocks: "Claude-based AI assistant in production",     priority: "med"  as Level },
    { field: "Payment gateway credentials (Stripe/local)",needFrom: "Finance team",    blocks: "Wallet top-up + escrow payouts",              priority: "high" as Level },
    { field: "SMTP server credentials",                   needFrom: "Ops",             blocks: "User email notifications, receipts, password reset", priority: "med"  as Level },
    { field: "Company logo (high-res SVG)",               needFrom: "Design team",     blocks: "Final production branding across all pages",  priority: "low"  as Level },
    { field: "Terms of Service + Privacy Policy text",    needFrom: "Legal team",      blocks: "Production launch (regulatory requirement)",  priority: "high" as Level },
  ] as MissingField[],

  emptyFiles: [
    { path: "services/ai/src/prompts/",                           kind: "folder" as const, reason: "No seed prompts for AI Lawyer / Diagnosis / Tutor", level: "high" as Level },
    { path: "apps/web/app/medical/",                              kind: "folder" as const, reason: "Medical module pages not created yet",               level: "high" as Level },
    { path: "apps/web/app/onboarding/",                           kind: "folder" as const, reason: "First-run onboarding tour pages missing",             level: "med"  as Level },
    { path: "apps/web/app/gosellr/cart/checkout/",                kind: "folder" as const, reason: "Checkout flow not implemented",                       level: "high" as Level },
    { path: "services/api/stl-replit/routes/walletRoutes.js",     kind: "file"   as const, reason: "Wallet route file does not exist",                    level: "high" as Level },
    { path: "services/api/stl-replit/routes/franchiseRoutes.js",  kind: "file"   as const, reason: "Franchise route file does not exist",                 level: "med"  as Level },
    { path: "docs/API_REFERENCE.md",                              kind: "file"   as const, reason: "API reference documentation missing",                 level: "low"  as Level },
    { path: "packages/types/",                                    kind: "folder" as const, reason: "Shared types package is empty",                       level: "med"  as Level },
  ] as EmptyEntry[],
};

type Data = typeof FALLBACK;

const TABS = [
  "Overview", "Quality", "32 Industries", "Departments", "APIs",
  "User Flows", "System Map", "AI Recommend", "Dev Phases", "Structure",
  "Q&A", "Pending",
] as const;
type Tab = typeof TABS[number];

// ── STYLES ──────────────────────────────────────────────────────────────
//  SILVER 3D BACKGROUND — layered radial + linear gradients on a bright
//  metallic base. Fixed attachment so it behaves like real silver satin.
// ─────────────────────────────────────────────────────────────────────────
const SILVER_BG = `
  radial-gradient(ellipse 70% 45% at 18% 12%, rgba(255,255,255,0.75), transparent 55%),
  radial-gradient(ellipse 55% 38% at 82% 22%, rgba(255,255,255,0.55), transparent 55%),
  radial-gradient(ellipse 65% 50% at 50% 55%, rgba(90,100,130,0.45), transparent 65%),
  radial-gradient(ellipse 75% 55% at 28% 88%, rgba(200,208,220,0.55), transparent 60%),
  radial-gradient(ellipse 60% 45% at 85% 92%, rgba(120,130,160,0.45), transparent 60%),
  linear-gradient(135deg,
    #d7dbe4 0%,
    #eef0f5 12%,
    #b7bdcb 26%,
    #e1e5ec 40%,
    #a6acbb 54%,
    #dde1e9 68%,
    #9ea4b3 82%,
    #cfd3dc 100%
  )
`;

const s = {
  page: {
    minHeight: "100vh",
    background: SILVER_BG,
    backgroundAttachment: "fixed",
    color: "#1a1d2e",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "clamp(10px, 2vw, 24px) clamp(10px, 2vw, 32px) 60px",
  } as React.CSSProperties,
  nav: {
    maxWidth: 1600, margin: "10px auto 20px",
    padding: "clamp(10px, 1.6vw, 14px) clamp(12px, 2vw, 24px)",
    background: "rgba(19,22,42,0.94)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    boxShadow: "0 14px 34px rgba(20,26,48,0.35), 0 1px 0 rgba(255,255,255,0.18) inset",
  } as React.CSSProperties,
  navInner: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 12, flexWrap: "wrap",
  } as React.CSSProperties,
  navLinks: {
    display: "flex", alignItems: "center", gap: 3,
    flexWrap: "wrap", justifyContent: "center",
  } as React.CSSProperties,
  hero: {
    maxWidth: 1600, margin: "0 auto 18px",
    padding: "clamp(18px, 2.6vw, 28px) clamp(18px, 2.6vw, 30px)",
    background: "rgba(19,22,42,0.92)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 16,
    boxShadow: "0 18px 44px rgba(20,26,48,0.4), 0 1px 0 rgba(255,255,255,0.18) inset",
    position: "relative", overflow: "hidden",
  } as React.CSSProperties,
  statsGrid: {
    maxWidth: 1600, margin: "28px auto 18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  statCard: {
    background: "rgba(19,22,42,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    padding: "15px 16px",
    boxShadow: "0 10px 28px rgba(20,26,48,0.3), 0 1px 0 rgba(255,255,255,0.15) inset",
  } as React.CSSProperties,
  tabRow: {
    maxWidth: 1600, margin: "0 auto 16px",
    display: "flex", gap: 6, flexWrap: "wrap",
    padding: "8px 10px",
    background: "rgba(19,22,42,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    boxShadow: "0 10px 28px rgba(20,26,48,0.28), 0 1px 0 rgba(255,255,255,0.15) inset",
  } as React.CSSProperties,
  legend: {
    maxWidth: 1600, margin: "0 auto 16px",
    padding: "11px 16px",
    background: "rgba(19,22,42,0.88)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center",
    fontSize: 10, color: "#C8CCDF",
    boxShadow: "0 8px 22px rgba(20,26,48,0.22)",
  } as React.CSSProperties,
};

// ── PRIMITIVES ──────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "rgba(19,22,42,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...cardStyle, ...style }}>{children}</div>;
}

function CardTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 12, paddingBottom: 8,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#C8CCDF",
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {children}
      </div>
      {right}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0" }}>{children}</div>;
}

function Chip({ children, color }: { children: React.ReactNode; color: "purple" | "teal" | "amber" | "red" | "green" | "gray" }) {
  const map = {
    purple: { bg: "rgba(123,110,246,0.15)", fg: "#A098F8", br: "rgba(123,110,246,0.3)" },
    teal:   { bg: "rgba(43,191,160,0.15)",  fg: "#2BBFA0", br: "rgba(43,191,160,0.3)" },
    amber:  { bg: "rgba(240,160,48,0.15)",  fg: "#F0A030", br: "rgba(240,160,48,0.3)" },
    red:    { bg: "rgba(240,88,88,0.15)",   fg: "#F07070", br: "rgba(240,88,88,0.3)" },
    green:  { bg: "rgba(56,200,120,0.15)",  fg: "#38C878", br: "rgba(56,200,120,0.3)" },
    gray:   { bg: "rgba(255,255,255,0.06)", fg: "#8890B0", br: "rgba(255,255,255,0.15)" },
  };
  const c = map[color];
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px", borderRadius: 5,
      background: c.bg, color: c.fg, border: `1px solid ${c.br}`,
      fontSize: 9, fontWeight: 700, letterSpacing: "0.03em",
    }}>
      {children}
    </span>
  );
}

function StatusChip({ status }: { status: Status }) {
  if (status === "live")    return <Chip color="green">LIVE</Chip>;
  if (status === "partial") return <Chip color="amber">PARTIAL</Chip>;
  return <Chip color="red">PENDING</Chip>;
}

function PrioChip({ level }: { level: Level }) {
  if (level === "high") return <Chip color="red">HIGH</Chip>;
  if (level === "med")  return <Chip color="amber">MED</Chip>;
  return <Chip color="green">LOW</Chip>;
}

function Dot({ status }: { status: Status }) {
  const map = { live: "#2BBFA0", partial: "#F0A030", pending: "#F05858" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: map[status], flexShrink: 0,
    }} />
  );
}

function PBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", background: color,
        borderRadius: 3, transition: "width 0.4s",
      }} />
    </div>
  );
}

function MethodTag({ method }: { method: string }) {
  const map: Record<string, string> = { GET: "#38C878", POST: "#7B6EF6", PUT: "#F0A030", DELETE: "#F05858", PATCH: "#2BBFA0" };
  const color = map[method] ?? "#8890B0";
  return (
    <span style={{
      display: "inline-block", padding: "2px 7px", borderRadius: 4,
      fontSize: 9, fontWeight: 700, fontFamily: "monospace",
      color, background: `${color}22`, border: `1px solid ${color}44`,
      minWidth: 44, textAlign: "center",
    }}>
      {method}
    </span>
  );
}

function LevelDot({ level }: { level: Level }) {
  const map = { high: "#F05858", med: "#F0A030", low: "#38C878" };
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: map[level], flexShrink: 0,
    }} />
  );
}

function LevelBadge({ level }: { level: Level }) {
  return <PrioChip level={level} />;
}

function Legend() {
  return (
    <div style={s.legend}>
      <span style={{ fontWeight: 700, color: "#C8CCDF", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 9 }}>
        Legend
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Dot status="live" /> Live / Fixed
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Dot status="partial" /> Partial / Medium
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Dot status="pending" /> Pending / High risk
      </span>
      <span style={{ marginLeft: "auto", color: "#555A78" }}>
        Tip: click any card, row, or tab to drill down
      </span>
    </div>
  );
}

// ── DETAIL MODAL SYSTEM ─────────────────────────────────────────────────
type DetailField = { label: string; value: React.ReactNode; mono?: boolean; color?: string };
type Detail = {
  title: string;
  kind: string;
  level?: Level;
  summary?: string;
  fields: DetailField[];
  sections?: { title: string; items: { label: string; sub?: string; level?: Level }[] }[];
};

function buildUrgentDetail(u: UrgentFix): Detail {
  return {
    kind: "Urgent fix",
    title: u.title,
    level: u.level,
    summary: u.impact,
    fields: [
      { label: "ID",          value: u.id, mono: true },
      { label: "Level",       value: u.level.toUpperCase() },
      { label: "Location",    value: u.where, mono: true, color: "#A098F8" },
      { label: "Impact",      value: u.impact, color: "#F07070" },
      { label: "ETA",         value: u.eta },
      { label: "Owner",       value: u.owner, color: "#2BBFA0" },
    ],
  };
}
function buildBugDetail(b: Bug): Detail {
  return {
    kind: "Bug",
    title: b.message,
    level: b.severity,
    fields: [
      { label: "ID",        value: b.id, mono: true },
      { label: "Type",      value: b.type },
      { label: "Severity",  value: b.severity.toUpperCase() },
      { label: "Status",    value: b.status.toUpperCase() },
      { label: "File",      value: b.file, mono: true, color: "#A098F8" },
      { label: "Line",      value: String(b.line), mono: true, color: "#F07070" },
    ],
  };
}
function buildDuplicateDetail(d: Duplicate): Detail {
  return {
    kind: "Duplicate",
    title: d.what,
    level: d.status === "open" ? "med" : "low",
    fields: [
      { label: "Status",    value: d.status.toUpperCase(), color: d.status === "fixed" ? "#2BBFA0" : "#F0A030" },
      { label: "Action",    value: d.action },
    ],
    sections: [{ title: "Locations", items: d.locations.map((l) => ({ label: l })) }],
  };
}
function buildMissingDetail(m: MissingField): Detail {
  return {
    kind: "Missing info",
    title: m.field,
    level: m.priority,
    fields: [
      { label: "Need from", value: m.needFrom, color: "#A098F8" },
      { label: "Blocks",    value: m.blocks, color: "#F07070" },
      { label: "Priority",  value: m.priority.toUpperCase() },
    ],
  };
}
function buildEmptyDetail(e: EmptyEntry): Detail {
  return {
    kind: e.kind === "folder" ? "Empty folder" : "Empty file",
    title: e.path,
    level: e.level,
    fields: [
      { label: "Kind",    value: e.kind },
      { label: "Path",    value: e.path, mono: true, color: "#A098F8" },
      { label: "Reason",  value: e.reason, color: "#F07070" },
      { label: "Level",   value: e.level.toUpperCase() },
    ],
  };
}
function buildPriorityDetail(p: { n: number; level: Level; title: string; meta: string }): Detail {
  return {
    kind: "Priority task",
    title: p.title,
    level: p.level,
    fields: [
      { label: "Rank",    value: `#${p.n}` },
      { label: "When",    value: p.meta },
      { label: "Level",   value: p.level.toUpperCase() },
    ],
  };
}
function buildCoreDetail(c: { name: string; progress: number }): Detail {
  const level: Level = c.progress >= 50 ? "low" : c.progress >= 25 ? "med" : "high";
  return {
    kind: "Core system",
    title: c.name,
    level,
    fields: [
      { label: "Build readiness",  value: `${c.progress}%`, color: "#A098F8" },
      { label: "Health",            value: level === "low" ? "Good" : level === "med" ? "In progress" : "Early / blocked" },
    ],
  };
}
function buildWarningDetail(w: { level: Level; text: string }): Detail {
  return {
    kind: "Integration warning",
    title: w.text,
    level: w.level,
    fields: [
      { label: "Level", value: w.level.toUpperCase() },
    ],
  };
}
function buildIndustryDetail(i: { name: string; progress: number }): Detail {
  const level: Level = i.progress >= 50 ? "low" : i.progress >= 25 ? "med" : "high";
  return {
    kind: "Industry",
    title: i.name,
    level,
    fields: [
      { label: "Phase",             value: "Phase-1 focus" },
      { label: "Build readiness",   value: `${i.progress}%`, color: "#2BBFA0" },
    ],
  };
}
function buildDeptDetail(d: { code: string; name: string; pct: number; color: string }): Detail {
  const level: Level = d.pct >= 50 ? "low" : d.pct >= 25 ? "med" : "high";
  return {
    kind: "Department",
    title: `${d.code} — ${d.name}`,
    level,
    fields: [
      { label: "Code",              value: d.code, mono: true },
      { label: "Build readiness",   value: `${d.pct}%`, color: d.color },
    ],
  };
}
function buildApiDetail(a: { method: string; path: string; tag: string; status: Status }): Detail {
  const level: Level = a.status === "live" ? "low" : a.status === "partial" ? "med" : "high";
  return {
    kind: "API endpoint",
    title: `${a.method} ${a.path}`,
    level,
    fields: [
      { label: "Method",  value: a.method, mono: true, color: "#A098F8" },
      { label: "Path",    value: a.path, mono: true },
      { label: "Tag",     value: a.tag },
      { label: "Status",  value: a.status.toUpperCase(), color: a.status === "live" ? "#2BBFA0" : a.status === "partial" ? "#F0A030" : "#F05858" },
    ],
  };
}
function buildPendingDetail(p: { level: Level; title: string; sub: string }): Detail {
  return {
    kind: "Pending item",
    title: p.title,
    level: p.level,
    fields: [
      { label: "Detail",   value: p.sub },
      { label: "Priority", value: p.level.toUpperCase() },
    ],
  };
}

function DetailDrawer({ detail, onClose }: { detail: Detail; onClose: () => void }) {
  const isCritical = detail.level === "high";
  const accent = detail.level === "high" ? "#F05858" : detail.level === "med" ? "#F0A030" : "#2BBFA0";
  const titleId = "ehb-drawer-title";
  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="ehb-fade-up"
      style={{
        position: "fixed", inset: 0, background: "rgba(6,7,16,0.82)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto",
          background: isCritical
            ? "linear-gradient(145deg, rgba(60,14,14,1), rgba(28,10,18,1))"
            : "#13162A",
          border: `2px solid ${isCritical ? "#F05858" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 16,
          padding: "22px 24px",
          boxShadow: isCritical
            ? "0 0 0 1px rgba(240,88,88,0.25), 0 24px 60px rgba(240,88,88,0.25)"
            : "0 24px 60px rgba(0,0,0,0.55)",
          color: isCritical ? "#FFE5E5" : "#fff",
          fontFamily: "inherit",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
          paddingBottom: 10, borderBottom: `1px solid ${isCritical ? "rgba(240,88,88,0.35)" : "rgba(255,255,255,0.08)"}`,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 9px", borderRadius: 5,
            color: accent, background: `${accent}22`, border: `1px solid ${accent}55`,
          }}>{detail.kind}</span>
          {detail.level && <PrioChip level={detail.level} />}
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 6, color: isCritical ? "#FFE5E5" : "#C8CCDF",
              padding: "4px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >✕ Close</button>
        </div>

        <h2 id={titleId} style={{
          fontSize: 18, fontWeight: 700, margin: "6px 0 14px",
          color: isCritical ? "#FFCACA" : "#fff", lineHeight: 1.3,
        }}>{detail.title}</h2>

        {detail.summary && (
          <div style={{
            fontSize: 12, lineHeight: 1.6, color: isCritical ? "#FFCACA" : "#C8CCDF",
            marginBottom: 14, padding: "10px 12px",
            background: isCritical ? "rgba(240,88,88,0.12)" : "rgba(255,255,255,0.04)",
            borderLeft: `3px solid ${accent}`, borderRadius: 6,
          }}>
            {detail.summary}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {detail.fields.map((f) => (
            <div key={f.label} style={{
              background: isCritical ? "rgba(240,88,88,0.08)" : "#1A1D33",
              border: `1px solid ${isCritical ? "rgba(240,88,88,0.22)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8, padding: "9px 12px",
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: isCritical ? "#FFB3B3" : "#8890B0",
                marginBottom: 5,
              }}>{f.label}</div>
              <div style={{
                fontSize: 12, fontWeight: 600, lineHeight: 1.5,
                color: f.color ?? (isCritical ? "#FFE5E5" : "#C8CCDF"),
                fontFamily: f.mono ? "monospace" : "inherit",
                wordBreak: "break-word",
              }}>{f.value}</div>
            </div>
          ))}
        </div>

        {detail.sections?.map((sec) => (
          <div key={sec.title} style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: isCritical ? "#FFB3B3" : "#A098F8",
              marginBottom: 6,
            }}>{sec.title}</div>
            {sec.items.map((it) => (
              <div key={it.label} style={{
                fontSize: 11, color: isCritical ? "#FFE5E5" : "#C8CCDF",
                fontFamily: "monospace", padding: "5px 0",
                borderBottom: "1px dashed rgba(255,255,255,0.06)",
              }}>• {it.label}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Action banner — summarizes all high-severity items needing fory action
function QuickActionBanner({
  data, onOpen,
}: {
  data: Data;
  onOpen: () => void;
}) {
  const criticalFixes = data.urgentFixes.filter((u) => u.level === "high");
  const criticalBugs = data.bugs.filter((b) => b.severity === "high" && b.status === "open");
  const criticalMissing = data.missingInfo.filter((m) => m.priority === "high");
  const criticalWarnings = data.warnings.filter((w) => w.level === "high");
  const criticalCount = criticalFixes.length + criticalBugs.length + criticalMissing.length + criticalWarnings.length;
  const hasCritical = criticalCount > 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={
        hasCritical
          ? `Quick action — ${criticalCount} critical items need immediate attention`
          : "Quick action — all systems nominal"
      }
      className={`ehb-clickable ehb-fade-up ehb-fade-up-d2 ${hasCritical ? "ehb-critical-pulse" : ""}`}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        maxWidth: 1600, margin: "0 auto 14px",
        padding: "18px 22px",
        borderRadius: 14,
        background: hasCritical
          ? "linear-gradient(135deg, rgba(240,88,88,0.32), rgba(240,88,88,0.08) 70%)"
          : "linear-gradient(135deg, rgba(43,191,160,0.22), rgba(43,191,160,0.05) 70%)",
        border: hasCritical ? "2px solid #F05858" : "1px solid rgba(43,191,160,0.35)",
        boxShadow: hasCritical
          ? "0 0 0 1px rgba(240,88,88,0.3), 0 10px 30px rgba(240,88,88,0.18)"
          : "0 6px 20px rgba(0,0,0,0.25)",
        color: hasCritical ? "#FFE5E5" : "#C8CCDF",
        fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: hasCritical ? "rgba(240,88,88,0.22)" : "rgba(43,191,160,0.18)",
        border: `1px solid ${hasCritical ? "#F05858" : "#2BBFA0"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, fontWeight: 800,
        color: hasCritical ? "#FF8080" : "#2BBFA0",
      }}>
        {hasCritical ? "!" : "✓"}
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: hasCritical ? "#FFB3B3" : "#7BDFC4",
          marginBottom: 4,
        }}>
          Quick Action · Fory tawajo chahiye
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, lineHeight: 1.25,
          color: hasCritical ? "#FFCACA" : "#DFFBF3",
          marginBottom: 4,
        }}>
          {hasCritical
            ? `${criticalCount} critical item${criticalCount > 1 ? "s" : ""} project health par asar dal rahe hain`
            : "Koi critical blocker nahin — project health green"}
        </div>
        <div style={{ fontSize: 11, opacity: 0.9, lineHeight: 1.5 }}>
          {hasCritical ? (
            <>
              🚨 {criticalFixes.length} urgent fixes ·{" "}
              🐛 {criticalBugs.length} high bugs ·{" "}
              ❓ {criticalMissing.length} missing ·{" "}
              ⚠️ {criticalWarnings.length} warnings
              {" — click to see details"}
            </>
          ) : (
            "Keep shipping. Click for the full quality report."
          )}
        </div>
      </div>
      <div style={{
        padding: "10px 16px", borderRadius: 8,
        background: hasCritical ? "#F05858" : "#2BBFA0",
        color: "#0C0E1A", fontSize: 11, fontWeight: 800,
        letterSpacing: "0.04em", whiteSpace: "nowrap",
      }}>
        {hasCritical ? "View action list →" : "All clear ✓"}
      </div>
    </button>
  );
}

// Clickable row wrapper
function ClickableCard({
  children, onClick, critical, style, ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  critical?: boolean;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="ehb-clickable"
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        background: critical ? "rgba(240,88,88,0.14)" : "#1A1D33",
        border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, padding: "11px 13px",
        color: critical ? "#FFCACA" : "#fff",
        fontFamily: "inherit",
        marginBottom: 7,
        transition: "transform 0.12s, border-color 0.12s",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  HEALTH RING — SVG radial showing avg core systems + industries progress
//  Design system §7.11 — Bento Mission Control widget
// ═══════════════════════════════════════════════════════════════════════════
function computeHealth(data: Data): {
  pct: number;
  level: "healthy" | "fair" | "risk";
  color: string;
  glow: string;
  label: string;
} {
  const core = data.coreSystems.map((c) => c.progress);
  const ind  = data.industries.phase1.map((i) => i.progress);
  const all  = [...core, ...ind];
  const pct  = Math.round(all.reduce((a, b) => a + b, 0) / Math.max(all.length, 1));
  if (pct >= 60) return { pct, level: "healthy", color: "#38C878", glow: "rgba(56,200,120,0.35)",  label: "Healthy"  };
  if (pct >= 30) return { pct, level: "fair",    color: "#F0A030", glow: "rgba(240,160,48,0.35)",  label: "Fair"     };
  return              { pct, level: "risk",    color: "#F05858", glow: "rgba(240,88,88,0.4)",    label: "At risk"  };
}

function HealthRing({ data, onClick }: { data: Data; onClick: () => void }) {
  const h = computeHealth(data);
  const size = 132;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (h.pct / 100) * c;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        background: "rgba(19,22,42,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${h.color}55`,
        borderRadius: 14,
        padding: 18,
        boxShadow: `0 14px 36px rgba(20,26,48,0.34), 0 0 24px ${h.glow}, 0 1px 0 rgba(255,255,255,0.16) inset`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 10, width: "100%", height: "100%",
        color: "#fff", transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
        textTransform: "uppercase", color: h.color,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 12 }}>💚</span> Platform health
      </div>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor={h.color} stopOpacity="1" />
              <stop offset="100%" stopColor="#A098F8" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none"
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke="url(#healthGrad)" strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{h.pct}%</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: h.color, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>
            {h.label}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#8890B0", textAlign: "center", lineHeight: 1.4 }}>
        Avg across {data.coreSystems.length} core systems + {data.industries.phase1.length} Phase-1 industries
      </div>
    </button>
  );
}

// Count badges for tab labels
function countForTab(tab: Tab, data: Data): number | null {
  switch (tab) {
    case "Quality":       return data.urgentFixes.length + data.bugs.length + data.duplicates.filter((d) => d.status === "open").length + data.missingInfo.length + data.emptyFiles.length;
    case "32 Industries": return data.industries.phase1.length + data.industries.phase2.length;
    case "Departments":   return data.departments.length;
    case "APIs":          return data.apis.length;
    case "User Flows":    return Object.keys(data.flows).length;
    case "Dev Phases":    return data.phases.length;
    case "Pending":       return data.pending.length;
    default:              return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function DevelopmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [data, setData] = useState<Data>(FALLBACK);
  const [source, setSource] = useState<"fallback" | "live">("fallback");
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Detail | null>(null);

  const openDetail = (d: Detail) => setSelected(d);
  const closeDetail = () => setSelected(null);

  // Quick Action aggregate detail
  const buildQuickActionDetail = (): Detail => {
    const criticalFixes   = data.urgentFixes.filter((u) => u.level === "high");
    const criticalBugs    = data.bugs.filter((b) => b.severity === "high" && b.status === "open");
    const criticalMissing = data.missingInfo.filter((m) => m.priority === "high");
    const criticalWarn    = data.warnings.filter((w) => w.level === "high");
    const total = criticalFixes.length + criticalBugs.length + criticalMissing.length + criticalWarn.length;
    return {
      kind: "Quick Action",
      title: total > 0
        ? `${total} critical items need fory action`
        : "No critical blockers",
      level: total > 0 ? "high" : "low",
      summary: total > 0
        ? "Ye sab project health par seedha asar dal rahe hain. Click karke Quality tab se drill down karein."
        : "Project health green. Keep shipping.",
      fields: [
        { label: "Urgent fixes (high)",  value: `${criticalFixes.length}`,   color: "#F07070" },
        { label: "Open bugs (high)",     value: `${criticalBugs.length}`,    color: "#F07070" },
        { label: "Missing info (high)",  value: `${criticalMissing.length}`, color: "#F0A030" },
        { label: "Warnings (high)",      value: `${criticalWarn.length}`,    color: "#F0A030" },
      ],
      sections: [
        ...(criticalFixes.length ? [{ title: "Urgent fixes", items: criticalFixes.map((u) => ({ label: `${u.id} — ${u.title}`, sub: u.where, level: u.level })) }] : []),
        ...(criticalBugs.length  ? [{ title: "Bugs",         items: criticalBugs.map((b)  => ({ label: `${b.id} — ${b.message}`, sub: `${b.file}:${b.line}`, level: b.severity })) }] : []),
        ...(criticalMissing.length ? [{ title: "Missing info", items: criticalMissing.map((m) => ({ label: m.field, sub: `from ${m.needFrom}`, level: m.priority })) }] : []),
      ],
    };
  };

  const [qaInput, setQaInput] = useState("");
  const [qaList, setQaList] = useState<{ q: string; a: string }[]>([
    { q: "Project ka main goal kya hai?", a: "32 industries ko ek unified global super app mein jorna — trust, AI, aur blockchain-backed services ke sath." },
    { q: "STL kya hai?", a: "Service Trust Level — L0 (unverified) se L8 (SUPREME). PSS+CRB+DMO+earnings+behavior ke formula se calculate hota hai." },
    { q: "DMO ka kaam?", a: "Decentralized Management Office — 8 modules ka governance authority, L8 approvals, revenue split 40/25/20/15." },
    { q: "Phase-1 industries?", a: "E-commerce, Legal, Medical, Education, Jobs, Travel." },
    { q: "File ka backup kaise banta hai?", a: "Har destructive change backup/<name>-<date>/ folder mein save hoti hai. Git-ignored." },
  ]);

  // ── REAL-TIME FETCH ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function pull() {
      try {
        const res = await fetch("/api/dev-status", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.ok && json.data) {
          // Merge live data over fallback so any missing section is still valid.
          const live = json.data as Partial<Data>;
          setData((prev) => ({ ...prev, ...live }));
          setSource("live");
          setLastFetch(new Date());
          setFetchError(null);
        } else {
          setFetchError(json.error || "Unknown error");
        }
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : String(err));
      }
    }
    pull();
    const id = setInterval(pull, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // ── ESC KEY CLOSES DRAWER (design system §11 accessibility) ─────────
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while drawer is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  // ── RENDERS ──────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
      <Card>
        <CardTitle right={<Chip color="purple">{data.coreSystems.length}</Chip>}>🧠 Core systems progress · click any</CardTitle>
        {data.coreSystems.map((c) => {
          const low = c.progress < 25;
          const ic = (c as { icon?: string }).icon ?? "•";
          return (
            <button
              type="button"
              key={c.name}
              onClick={() => openDetail(buildCoreDetail(c))}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                background: low ? "rgba(240,88,88,0.1)" : "transparent",
                border: low ? "1px solid rgba(240,88,88,0.35)" : "1px solid transparent",
                borderRadius: 8, padding: "8px 10px", marginBottom: 6,
                color: low ? "#FFCACA" : "inherit", fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 4 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{ic}</span>
                <span style={{ flex: 1, color: low ? "#FFCACA" : "#C8CCDF", fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: low ? "#FF8080" : "#A098F8", fontWeight: 700 }}>{c.progress}%</span>
              </div>
              <PBar pct={c.progress} color={low ? "#F05858" : "#7B6EF6"} />
            </button>
          );
        })}
      </Card>

      <Card>
        <CardTitle right={<Chip color="red">{data.warnings.length}</Chip>}>⚠️ Integration warnings · click any</CardTitle>
        {data.warnings.map((w, i) => {
          const critical = w.level === "high";
          return (
            <button
              type="button"
              key={i}
              onClick={() => openDetail(buildWarningDetail(w))}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                background: critical ? "rgba(240,88,88,0.15)" : "transparent",
                border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, marginBottom: 6,
                color: critical ? "#FFCACA" : "inherit", fontFamily: "inherit",
              }}
            >
              <LevelDot level={w.level} />
              <span style={{ flex: 1, fontSize: 11, color: critical ? "#FFCACA" : "#C8CCDF", lineHeight: 1.5 }}>{w.text}</span>
              <LevelBadge level={w.level} />
            </button>
          );
        })}
      </Card>

      <Card>
        <CardTitle right={<Chip color="red">{data.urgentFixes.filter((f) => f.level === "high").length}</Chip>}>
          🚨 Top urgent fixes · click any
        </CardTitle>
        {data.urgentFixes.slice(0, 3).map((u) => {
          const critical = u.level === "high";
          return (
            <button
              type="button"
              key={u.id}
              onClick={() => openDetail(buildUrgentDetail(u))}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                background: critical ? "rgba(240,88,88,0.15)" : "transparent",
                border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, marginBottom: 6,
                color: critical ? "#FFCACA" : "inherit", fontFamily: "inherit",
              }}
            >
              <LevelDot level={u.level} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: critical ? "#FFCACA" : "#fff", fontWeight: 600 }}>{u.title}</div>
                <div style={{ fontSize: 9, color: critical ? "#FFB3B3" : "#8890B0", fontFamily: "monospace", marginTop: 2 }}>{u.where}</div>
              </div>
              <LevelBadge level={u.level} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setActiveTab("Quality")}
          style={{
            marginTop: 10, width: "100%", padding: "7px 12px",
            background: "rgba(240,88,88,0.08)", border: "1px solid rgba(240,88,88,0.25)",
            borderRadius: 6, color: "#F07070", fontSize: 10, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          See all {data.urgentFixes.length} urgent fixes →
        </button>
      </Card>

      <Card>
        <CardTitle right={<Chip color="amber">{data.missingInfo.length}</Chip>}>
          ❓ Missing info · click any
        </CardTitle>
        {data.missingInfo.slice(0, 3).map((m) => {
          const critical = m.priority === "high";
          return (
            <button
              type="button"
              key={m.field}
              onClick={() => openDetail(buildMissingDetail(m))}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                background: critical ? "rgba(240,88,88,0.15)" : "transparent",
                border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, marginBottom: 6,
                color: critical ? "#FFCACA" : "inherit", fontFamily: "inherit",
              }}
            >
              <LevelDot level={m.priority} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: critical ? "#FFCACA" : "#fff", fontWeight: 600 }}>{m.field}</div>
                <div style={{ fontSize: 9, color: critical ? "#FFB3B3" : "#8890B0", marginTop: 2 }}>From: {m.needFrom}</div>
              </div>
              <LevelBadge level={m.priority} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setActiveTab("Quality")}
          style={{
            marginTop: 10, width: "100%", padding: "7px 12px",
            background: "rgba(240,160,48,0.08)", border: "1px solid rgba(240,160,48,0.25)",
            borderRadius: 6, color: "#F0A030", fontSize: 10, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          See all {data.missingInfo.length} missing fields →
        </button>
      </Card>
    </div>
  );

  const renderQuality = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* URGENT FIXING */}
      <Card>
        <CardTitle right={<Chip color="red">{data.urgentFixes.length}</Chip>}>
          🚨 Urgent fixing — click any card for full info
        </CardTitle>
        {data.urgentFixes.map((u) => {
          const critical = u.level === "high";
          return (
            <ClickableCard key={u.id} critical={critical} onClick={() => openDetail(buildUrgentDetail(u))}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: critical ? "#FFB3B3" : "#555A78", fontWeight: 700 }}>{u.id}</span>
                <span style={{ fontSize: 12, color: critical ? "#FFCACA" : "#fff", fontWeight: 600, flex: 1 }}>{u.title}</span>
                <Chip color="gray">ETA {u.eta}</Chip>
                <LevelBadge level={u.level} />
              </div>
              <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0", marginBottom: 3 }}>
                <span style={{ color: critical ? "#FFCACA" : "#A098F8" }}>Where:</span>{" "}
                <code style={{ fontFamily: "monospace" }}>{u.where}</code>
              </div>
              <div style={{ fontSize: 10, color: critical ? "#FFCACA" : "#8890B0", marginBottom: 3 }}>
                <span style={{ color: critical ? "#FF8080" : "#F07070" }}>Impact:</span> {u.impact}
              </div>
              <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0" }}>
                <span style={{ color: critical ? "#C4F7E6" : "#2BBFA0" }}>Owner:</span> {u.owner}
              </div>
            </ClickableCard>
          );
        })}
      </Card>

      {/* BUGS */}
      <Card>
        <CardTitle right={<Chip color="red">{data.bugs.filter((b) => b.status === "open").length} open</Chip>}>
          🐛 Errors & bugs — click any for full trace
        </CardTitle>
        {data.bugs.map((b) => {
          const critical = b.severity === "high" && b.status === "open";
          return (
            <ClickableCard key={b.id} critical={critical} onClick={() => openDetail(buildBugDetail(b))}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 9, fontFamily: "monospace", color: critical ? "#FFB3B3" : "#555A78", fontWeight: 700 }}>{b.id}</span>
                <Chip color="gray">{b.type}</Chip>
                <span style={{ fontSize: 12, color: critical ? "#FFCACA" : "#fff", fontWeight: 600, flex: 1 }}>{b.message}</span>
                <LevelBadge level={b.severity} />
              </div>
              <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0", fontFamily: "monospace" }}>
                <span style={{ color: critical ? "#FFCACA" : "#A098F8" }}>📍 </span>
                {b.file}
                <span style={{ color: critical ? "#FF8080" : "#F07070" }}>:{b.line}</span>
              </div>
            </ClickableCard>
          );
        })}
      </Card>

      {/* DUPLICATES */}
      <Card>
        <CardTitle right={<Chip color="amber">{data.duplicates.filter((d) => d.status === "open").length} open</Chip>}>
          🔁 Duplicate information / code · click any
        </CardTitle>
        {data.duplicates.map((d) => (
          <ClickableCard key={d.what} onClick={() => openDetail(buildDuplicateDetail(d))}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, flex: 1 }}>{d.what}</span>
              {d.status === "fixed"
                ? <Chip color="green">FIXED</Chip>
                : <Chip color="amber">OPEN</Chip>}
            </div>
            <div style={{ fontSize: 10, color: "#8890B0", marginBottom: 4 }}>
              <span style={{ color: "#A098F8" }}>Locations:</span>
            </div>
            {d.locations.map((loc) => (
              <div key={loc} style={{ fontSize: 10, color: "#C8CCDF", fontFamily: "monospace", marginLeft: 12, marginBottom: 2 }}>
                • {loc}
              </div>
            ))}
            <div style={{ fontSize: 10, color: "#8890B0", marginTop: 5 }}>
              <span style={{ color: "#2BBFA0" }}>Action:</span> {d.action}
            </div>
          </ClickableCard>
        ))}
      </Card>

      {/* MISSING INFO */}
      <Card>
        <CardTitle right={<Chip color="amber">{data.missingInfo.length}</Chip>}>
          ❓ Missing information — click any to see blocker
        </CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>
          {data.missingInfo.map((m) => {
            const critical = m.priority === "high";
            return (
              <button
                type="button"
                key={m.field}
                onClick={() => openDetail(buildMissingDetail(m))}
                style={{
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  background: critical ? "rgba(240,88,88,0.14)" : "#1A1D33",
                  border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "11px 13px",
                  color: critical ? "#FFCACA" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <LevelDot level={m.priority} />
                  <span style={{ fontSize: 11, color: critical ? "#FFCACA" : "#fff", fontWeight: 600, flex: 1 }}>{m.field}</span>
                  <LevelBadge level={m.priority} />
                </div>
                <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0", marginBottom: 3 }}>
                  <span style={{ color: critical ? "#FFCACA" : "#A098F8" }}>From:</span> {m.needFrom}
                </div>
                <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0" }}>
                  <span style={{ color: critical ? "#FF8080" : "#F07070" }}>Blocks:</span> {m.blocks}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* EMPTY FILES */}
      <Card>
        <CardTitle right={<Chip color="red">{data.emptyFiles.length}</Chip>}>
          📂 Empty files / folders · click any
        </CardTitle>
        {data.emptyFiles.map((e) => {
          const critical = e.level === "high";
          return (
            <button
              type="button"
              key={e.path}
              onClick={() => openDetail(buildEmptyDetail(e))}
              style={{
                width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8, padding: "9px 11px",
                marginBottom: 5,
                background: critical ? "rgba(240,88,88,0.13)" : "#1A1D33",
                border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                color: critical ? "#FFCACA" : "#fff",
              }}
            >
              <span style={{ fontSize: 12 }}>{e.kind === "folder" ? "📁" : "📄"}</span>
              <code style={{ flex: 1, fontSize: 10, color: critical ? "#FFCACA" : "#C8CCDF", fontFamily: "monospace" }}>{e.path}</code>
              <span style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0" }}>{e.reason}</span>
              <LevelBadge level={e.level} />
            </button>
          );
        })}
      </Card>
    </div>
  );

  const renderIndustries = () => (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <CardTitle right={<Chip color="teal">{data.industries.phase1.length}</Chip>}>🎯 Phase-1 focus · click any industry</CardTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {data.industries.phase1.map((i) => {
            const critical = i.progress < 20;
            const ic = (i as { icon?: string }).icon ?? "•";
            return (
              <button
                type="button"
                key={i.name}
                onClick={() => openDetail(buildIndustryDetail(i))}
                style={{
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  background: critical ? "rgba(240,88,88,0.14)" : "#1A1D33",
                  border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10, padding: 14,
                  color: critical ? "#FFCACA" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: critical ? "rgba(240,88,88,0.2)" : "rgba(43,191,160,0.15)",
                    border: `1px solid ${critical ? "rgba(240,88,88,0.4)" : "rgba(43,191,160,0.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>{ic}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: critical ? "#FFCACA" : "#fff", flex: 1, lineHeight: 1.3 }}>{i.name}</div>
                </div>
                <PBar pct={i.progress} color={critical ? "#F05858" : "#2BBFA0"} />
                <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0", marginTop: 5 }}>Build readiness {i.progress}%</div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle right={<Chip color="gray">{data.industries.phase2.length}</Chip>}>Phase-2 / 3 queue · click any</CardTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.industries.phase2.map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => openDetail({
                kind: "Phase-2/3 industry", title: n, level: "low",
                fields: [
                  { label: "Phase",  value: "Phase-2 / 3 queue" },
                  { label: "Status", value: "Queued — not yet in active build" },
                ],
              })}
              style={{
                padding: "5px 10px", background: "#1A1D33", borderRadius: 6,
                fontSize: 10, color: "#8890B0", border: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDepartments = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
      {data.departments.map((d) => {
        const critical = d.pct < 20;
        const ic = (d as { icon?: string }).icon ?? "•";
        return (
          <button
            type="button"
            key={d.code}
            onClick={() => openDetail(buildDeptDetail(d))}
            style={{
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              background: critical ? "rgba(240,88,88,0.14)" : "rgba(19,22,42,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: critical ? "1px solid #F05858" : "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14, padding: 18,
              boxShadow: "0 12px 30px rgba(20,26,48,0.3), 0 1px 0 rgba(255,255,255,0.15) inset",
              color: critical ? "#FFCACA" : "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: `${d.color}28`, border: `1px solid ${d.color}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{ic}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: d.color, textTransform: "uppercase" }}>{d.code}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: critical ? "#FFCACA" : "#fff", marginTop: 1 }}>{d.name}</div>
                <div style={{ fontSize: 9, color: critical ? "#FFB3B3" : "#8890B0", marginTop: 2 }}>Build {d.pct}%</div>
              </div>
            </div>
            <PBar pct={d.pct} color={critical ? "#F05858" : d.color} />
          </button>
        );
      })}
    </div>
  );

  const renderAPIs = () => (
    <Card>
      <CardTitle right={<Chip color="gray">{data.apis.length}</Chip>}>Backend API map · click any endpoint</CardTitle>
      {data.apis.map((api) => {
        const critical = api.status === "pending";
        return (
          <button
            type="button"
            key={api.path}
            onClick={() => openDetail(buildApiDetail(api))}
            style={{
              width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
              marginBottom: 4,
              background: critical ? "rgba(240,88,88,0.12)" : "transparent",
              border: critical ? "1px solid #F05858" : "1px solid transparent",
              borderRadius: 7,
              color: critical ? "#FFCACA" : "#fff",
            }}
          >
            <MethodTag method={api.method} />
            <code style={{ flex: 1, fontSize: 11, color: critical ? "#FFCACA" : "#C8CCDF", fontFamily: "monospace" }}>{api.path}</code>
            <Chip color="gray">{api.tag}</Chip>
            <StatusChip status={api.status} />
          </button>
        );
      })}
    </Card>
  );

  const renderFlows = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
      {Object.entries(data.flows).map(([key, steps]) => (
        <Card key={key}>
          <CardTitle>{key} flow</CardTitle>
          {(steps as string[]).map((step, i) => (
            <Row key={step}>
              <span style={{ fontSize: 10, color: "#555A78", fontFamily: "monospace" }}>{i + 1}.</span>
              <span style={{ flex: 1, fontSize: 11, color: "#C8CCDF" }}>{step}</span>
            </Row>
          ))}
        </Card>
      ))}
    </div>
  );

  const renderMap = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <Card>
        <CardTitle>Shared tools across industries</CardTitle>
        {data.sharedTools.map((t) => (
          <Row key={t}>
            <Dot status="live" />
            <span style={{ fontSize: 11, color: "#C8CCDF" }}>{t}</span>
          </Row>
        ))}
      </Card>
      <Card>
        <CardTitle>Industry-specific extensions</CardTitle>
        {data.industrySpecific.map((t) => (
          <Row key={t}>
            <Dot status="partial" />
            <span style={{ fontSize: 11, color: "#C8CCDF" }}>{t}</span>
          </Row>
        ))}
      </Card>
      <Card style={{ gridColumn: "1 / -1" }}>
        <CardTitle>Franchise hierarchy</CardTitle>
        {data.franchiseHierarchy.map((t, i) => (
          <Row key={t}>
            <span style={{ fontSize: 10, color: "#F0A030", fontFamily: "monospace", fontWeight: 700 }}>L{i + 1}</span>
            <span style={{ fontSize: 11, color: "#C8CCDF" }}>{t}</span>
          </Row>
        ))}
      </Card>
    </div>
  );

  const renderRecommendations = () => (
    <Card>
      <CardTitle right={<Chip color="purple">{data.aiIntegration.length}</Chip>}>AI integration map</CardTitle>
      {data.aiIntegration.map((t) => (
        <Row key={t}>
          <span style={{ fontSize: 11, color: "#A098F8" }}>✦</span>
          <span style={{ fontSize: 11, color: "#C8CCDF" }}>{t}</span>
        </Row>
      ))}
    </Card>
  );

  const renderPhases = () => (
    <Card>
      <CardTitle right={<Chip color="teal">{data.phases.length}</Chip>}>70-day roadmap (Phase 0 → 5)</CardTitle>
      {data.phases.map((p) => (
        <div key={p.id} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#A098F8" }}>{p.id}</span>
              <span style={{ fontSize: 10, color: "#555A78", marginLeft: 8 }}>{p.days}</span>
              <span style={{ fontSize: 11, color: "#C8CCDF", marginLeft: 10 }}>{p.title}</span>
            </div>
            <span style={{ fontSize: 10, color: "#2BBFA0", fontWeight: 700 }}>{p.pct}%</span>
          </div>
          <PBar pct={p.pct} color={p.pct >= 100 ? "#38C878" : p.pct >= 50 ? "#2BBFA0" : p.pct >= 10 ? "#F0A030" : "#F05858"} />
        </div>
      ))}
    </Card>
  );

  const renderStructure = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 10 }}>
      <Card>
        <CardTitle>Monorepo structure</CardTitle>
        <pre style={{ fontSize: 10, color: "#C8CCDF", fontFamily: "monospace", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
{`D:\\EHB DEVELOPMENT 2026
├── apps/
│   ├── web/                ← Next.js 14 frontend (port 3000)
│   │   └── app/api/dev-status/  ← REAL-TIME data route
│   └── admin/              ← reserved
├── services/
│   ├── api/stl-replit/     ← Express + Mongoose (port 5000)
│   ├── ai/                 ← Express + OpenAI (port 8080)
│   └── workers/            ← cron / jobs
├── packages/               ← shared ui / types / utils
├── infrastructure/         ← scripts, docker, k8s
├── data/ehb-data/          ← industry + service seeds
├── docs/                   ← LAUNCH, STRUCTURE, CONTEXT
├── scripts/                ← ehb-log-change, ehb-status-update
├── ehb-status.json         ← machine-written real-time status
├── AGENTS.md               ← portable AI-agent context
└── backup/                 ← safety backups`}
        </pre>
      </Card>
      <Card>
        <CardTitle>Missing files — create these</CardTitle>
        {data.emptyFiles.slice(0, 6).map((e) => (
          <Row key={e.path}>
            <span style={{ fontSize: 11 }}>{e.kind === "folder" ? "📁" : "📄"}</span>
            <span style={{ flex: 1, color: "#C8CCDF", fontFamily: "monospace", fontSize: 10 }}>{e.path}</span>
            <Chip color={e.level === "high" ? "red" : "amber"}>
              {e.level === "high" ? "Create" : "Update"}
            </Chip>
          </Row>
        ))}
      </Card>
    </div>
  );

  const renderQA = () => (
    <Card>
      <CardTitle>Company knowledge base — Q&amp;A</CardTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          value={qaInput}
          onChange={(e) => setQaInput(e.target.value)}
          placeholder="Apna sawaal yahan likhein..."
          style={{
            flex: 1, background: "#1A1D33", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 11,
            fontFamily: "inherit", outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && qaInput.trim()) {
              setQaList([{ q: qaInput, a: "Answer pending — developer will update." }, ...qaList]);
              setQaInput("");
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (qaInput.trim()) {
              setQaList([{ q: qaInput, a: "Answer pending — developer will update." }, ...qaList]);
              setQaInput("");
            }
          }}
          style={{
            background: "linear-gradient(135deg,#7B6EF6,#2BBFA0)", border: "none",
            borderRadius: 8, padding: "8px 18px", color: "#fff", fontSize: 11,
            fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Save
        </button>
      </div>
      {qaList.map((item, i) => (
        <div key={i} style={{
          background: "#1A1D33", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, padding: "11px 13px", marginBottom: 7,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 5 }}>Q: {item.q}</div>
          <div style={{ fontSize: 11, color: "#C8CCDF", lineHeight: 1.6 }}>A: {item.a}</div>
        </div>
      ))}
    </Card>
  );

  const renderPending = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {data.pending.map((item) => {
        const critical = item.level === "high";
        const colors = {
          high: { bg: "rgba(240,88,88,0.17)", border: "#F05858", text: "#FFCACA" },
          med:  { bg: "rgba(240,160,48,0.06)", border: "rgba(240,160,48,0.2)", text: "#fff" },
          low:  { bg: "rgba(56,200,120,0.05)", border: "rgba(56,200,120,0.18)", text: "#fff" },
        };
        const c = colors[item.level];
        return (
          <button
            type="button"
            key={item.title}
            onClick={() => openDetail(buildPendingDetail(item))}
            style={{
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 8,
              background: c.bg, border: `1px solid ${c.border}`,
              color: c.text,
            }}
          >
            <LevelDot level={item.level} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 10, color: critical ? "#FFB3B3" : "#8890B0" }}>{item.sub}</div>
            </div>
            <LevelBadge level={item.level} />
          </button>
        );
      })}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":      return renderOverview();
      case "Quality":       return renderQuality();
      case "32 Industries": return renderIndustries();
      case "Departments":   return renderDepartments();
      case "APIs":          return renderAPIs();
      case "User Flows":    return renderFlows();
      case "System Map":    return renderMap();
      case "AI Recommend":  return renderRecommendations();
      case "Dev Phases":    return renderPhases();
      case "Structure":     return renderStructure();
      case "Q&A":           return renderQA();
      case "Pending":       return renderPending();
      default:              return renderOverview();
    }
  };

  // ── MAIN RENDER ──────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/*
        v4.4 — Injected design-system CSS layer.
        Keyframes, responsive bento collapse, focus-visible, and
        prefers-reduced-motion rules live here so we stay inside CSS-in-JS
        for the rest of the file while still unlocking @media + keyframes.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ehb-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);  }
        }
        @keyframes ehb-critical-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(240,88,88,0.30),
              0 10px 30px rgba(240,88,88,0.18);
          }
          50% {
            box-shadow:
              0 0 0 2px rgba(240,88,88,0.55),
              0 16px 42px rgba(240,88,88,0.36);
          }
        }
        .ehb-fade-up { animation: ehb-fade-up 320ms cubic-bezier(.2,.8,.2,1) both; }
        .ehb-fade-up-d1 { animation-delay: 40ms;  }
        .ehb-fade-up-d2 { animation-delay: 80ms;  }
        .ehb-fade-up-d3 { animation-delay: 120ms; }
        .ehb-fade-up-d4 { animation-delay: 160ms; }
        .ehb-fade-up-d5 { animation-delay: 200ms; }
        .ehb-critical-pulse { animation: ehb-critical-pulse 1400ms ease-in-out infinite; }

        /* ═══════════════════════════════════════════════════════════════ */
        /*  v5.0 CINEMATIC HERO — design-system §7.12 (new pattern)         */
        /* ═══════════════════════════════════════════════════════════════ */

        /* Ambient gradient orbs drifting behind the hero — very slow,
           mid-opacity, blurred. This is what sells the "hardware product"
           feel on an otherwise near-black surface. */
        @keyframes ehb-orb-drift-a {
          0%, 100% { transform: translate3d(0, 0, 0)   scale(1);    opacity: 0.55; }
          50%      { transform: translate3d(40px, -30px, 0) scale(1.08); opacity: 0.75; }
        }
        @keyframes ehb-orb-drift-b {
          0%, 100% { transform: translate3d(0, 0, 0)      scale(1);    opacity: 0.45; }
          50%      { transform: translate3d(-60px, 24px, 0) scale(1.12); opacity: 0.65; }
        }
        .ehb-orb-a { animation: ehb-orb-drift-a 14s ease-in-out infinite; }
        .ehb-orb-b { animation: ehb-orb-drift-b 18s ease-in-out infinite; }

        /* Live status orb — slow breathing halo (teal when live, amber when static) */
        @keyframes ehb-live-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(43,191,160,0.55), 0 0 14px rgba(43,191,160,0.45); }
          50%      { box-shadow: 0 0 0 6px rgba(43,191,160,0.00), 0 0 22px rgba(43,191,160,0.65); }
        }
        .ehb-live-dot { animation: ehb-live-pulse 2200ms ease-in-out infinite; }

        /* Cinematic number counter — count-up is simulated via opacity +
           translate from a blurred start. We pair this with a CSS variable
           for stagger so each metric flows in one-by-one. */
        @keyframes ehb-num-rise {
          0%   { opacity: 0; transform: translateY(14px); filter: blur(6px); letter-spacing: 0; }
          60%  { opacity: 1; filter: blur(0);             }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0); letter-spacing: -0.5px; }
        }
        .ehb-num { animation: ehb-num-rise 900ms cubic-bezier(.2,.8,.2,1) both; }
        .ehb-num-d1 { animation-delay: 120ms; }
        .ehb-num-d2 { animation-delay: 240ms; }
        .ehb-num-d3 { animation-delay: 360ms; }
        .ehb-num-d4 { animation-delay: 480ms; }

        /* Big headline reveal — each span fades in + rises in sequence */
        @keyframes ehb-headline-rise {
          0%   { opacity: 0; transform: translateY(22px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        .ehb-headline-line { animation: ehb-headline-rise 820ms cubic-bezier(.2,.8,.2,1) both; display: inline-block; }
        .ehb-headline-d1 { animation-delay: 80ms;  }
        .ehb-headline-d2 { animation-delay: 180ms; }

        /* Gradient action strip — slow shimmer sweep on the primary CTA.
           Kept subtle so it doesn't feel spammy. */
        @keyframes ehb-cta-shimmer {
          0%   { background-position: 0% 50%;   }
          100% { background-position: 200% 50%; }
        }
        .ehb-cta-primary {
          background-image: linear-gradient(
            100deg,
            #7B6EF6 0%,
            #A098F8 22%,
            #2BBFA0 50%,
            #A098F8 78%,
            #7B6EF6 100%
          );
          background-size: 220% 100%;
          animation: ehb-cta-shimmer 6s linear infinite;
        }
        .ehb-cta-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* Tiny ambient scan line across the hero top border */
        @keyframes ehb-scan {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100%);  opacity: 0; }
        }
        .ehb-scan { animation: ehb-scan 4200ms ease-in-out infinite; }

        /* AI copilot ribbon — slow breathing underline */
        @keyframes ehb-ai-bar {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .ehb-ai-bar {
          background-image: linear-gradient(90deg, rgba(160,152,248,0.0), rgba(160,152,248,0.55), rgba(43,191,160,0.55), rgba(160,152,248,0.0));
          background-size: 200% 100%;
          animation: ehb-ai-bar 5s ease-in-out infinite;
        }

        /* Hero hover lift */
        .ehb-hero-lift { transition: transform 260ms cubic-bezier(.2,.8,.2,1), box-shadow 260ms cubic-bezier(.2,.8,.2,1); }
        .ehb-hero-lift:hover { transform: translateY(-2px); }

        /* §11 — focus-visible outline for all clickable cards */
        .ehb-clickable:focus-visible {
          outline: 2px solid #7B6EF6;
          outline-offset: 2px;
          border-radius: 10px;
        }

        /* §7.11 rule #4 — Bento collapses to single column under 900px.
           Order: priority queue first, health ring second, stats third. */
        @media (max-width: 900px) {
          .ehb-bento {
            grid-template-columns: 1fr !important;
          }
          .ehb-hero-metrics {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .ehb-hero-headline {
            font-size: clamp(36px, 9vw, 56px) !important;
          }
          .ehb-hero-action-strip {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .ehb-hero-action-strip > * { width: 100%; }
        }
        @media (max-width: 560px) {
          .ehb-hero-metrics {
            grid-template-columns: 1fr !important;
          }
        }

        /* §8.4 — prefers-reduced-motion compliance */
        @media (prefers-reduced-motion: reduce) {
          .ehb-fade-up,
          .ehb-critical-pulse,
          .ehb-fade-up-d1,
          .ehb-fade-up-d2,
          .ehb-fade-up-d3,
          .ehb-fade-up-d4,
          .ehb-fade-up-d5,
          .ehb-orb-a,
          .ehb-orb-b,
          .ehb-live-dot,
          .ehb-num,
          .ehb-num-d1,
          .ehb-num-d2,
          .ehb-num-d3,
          .ehb-num-d4,
          .ehb-headline-line,
          .ehb-headline-d1,
          .ehb-headline-d2,
          .ehb-cta-primary,
          .ehb-scan,
          .ehb-ai-bar {
            animation: none !important;
          }
          *, *::before, *::after {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}} />
      {/* NEW: FOLDER FLOW LIVE WIDGET (Hybrid Architecture v1) */}
      <div style={{ padding: "16px 24px 0" }}>
        <FolderFlowWidget />
      </div>
      {/* NAV */}
      <div className="ehb-fade-up" style={s.nav}>
        <div style={s.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg,#7B6EF6,#2BBFA0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>EHB</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>EHB Technologies (Pvt.) Ltd.</div>
              <div style={{ fontSize: 9, color: "#555A78", letterSpacing: "0.05em" }}>EDUCATION · HEALTH · BUSINESS</div>
            </div>
          </div>
          <div style={s.navLinks}>
            <Link href="/"              style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>Landing</Link>
            <Link href="/home"          style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>Home</Link>
            <Link href="/ai-marketplace" style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>AI Market</Link>
            <span style={{
              fontSize: 11, fontWeight: 700, color: "#A098F8",
              padding: "4px 12px", borderRadius: 6,
              background: "rgba(123,110,246,0.12)", border: "1px solid rgba(123,110,246,0.3)",
            }}>Development</span>
            <Link href="/admin" style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>Admin</Link>
            <Link href="/dmo"   style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>DMO</Link>
            <Link href="/auth"  style={{ fontSize: 11, color: "#555A78", padding: "4px 9px", borderRadius: 6, textDecoration: "none" }}>Auth</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: source === "live" ? "#2BBFA0" : "#F0A030", fontWeight: 600 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: source === "live" ? "#2BBFA0" : "#F0A030" }} />
              {source === "live" ? "Live" : "Static"}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
              background: "rgba(240,160,48,0.1)", border: "1px solid rgba(240,160,48,0.3)",
              borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#F0A030",
            }}>850.00 EHBGC</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  HERO · v5.0 CINEMATIC                                            */}
      {/*  design-system §7.12 · Tesla/Apple minimalist — big empty space,  */}
      {/*  big numbers, subtle gradients, cinematic mood. Glass cards float */}
      {/*  over a near-black hero surface that sits on the silver page bg. */}
      {/*  Sections: eyebrow · headline · metric row · AI ribbon · action   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        {(() => {
          // ── Live metrics derived from fetched data ─────────────────
          const coreAvg = Math.round(
            data.coreSystems.reduce((a, c) => a + c.progress, 0) / Math.max(1, data.coreSystems.length)
          );
          const phase1Avg = Math.round(
            data.industries.phase1.reduce((a, i) => a + i.progress, 0) / Math.max(1, data.industries.phase1.length)
          );
          const platformBuild = Math.round((coreAvg + phase1Avg) / 2);
          const industriesLive = data.industries.phase1.length;
          const aiModules = 100; // from §4 — 100+ planned
          const liveColor = source === "live" ? "#2BBFA0" : "#F0A030";

          return (
            <div
              className="ehb-fade-up ehb-hero-lift"
              style={{
                position: "relative",
                margin: "0 auto 22px",
                padding: "clamp(34px, 5vw, 68px) clamp(26px, 3.2vw, 56px) clamp(28px, 3.6vw, 44px)",
                background: `
                  radial-gradient(ellipse 55% 60% at 18% 0%, rgba(123,110,246,0.18), transparent 60%),
                  radial-gradient(ellipse 50% 55% at 92% 10%, rgba(43,191,160,0.15), transparent 60%),
                  linear-gradient(180deg, rgba(8,10,22,0.96) 0%, rgba(12,14,28,0.98) 55%, rgba(10,12,26,0.98) 100%)
                `,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                boxShadow:
                  "0 32px 80px rgba(10,12,24,0.55), 0 1px 0 rgba(255,255,255,0.10) inset, 0 0 0 1px rgba(255,255,255,0.03) inset",
                overflow: "hidden",
                isolation: "isolate",
              }}
            >
              {/* ─── Ambient gradient orbs (depth) ─────────────────── */}
              <div
                className="ehb-orb-a"
                aria-hidden
                style={{
                  position: "absolute",
                  top: "-18%",
                  left: "-8%",
                  width: 520,
                  height: 520,
                  background:
                    "radial-gradient(circle, rgba(123,110,246,0.42) 0%, rgba(123,110,246,0) 65%)",
                  filter: "blur(8px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div
                className="ehb-orb-b"
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: "-22%",
                  right: "-10%",
                  width: 560,
                  height: 560,
                  background:
                    "radial-gradient(circle, rgba(43,191,160,0.36) 0%, rgba(43,191,160,0) 65%)",
                  filter: "blur(10px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              {/* ─── Top scan line ─────────────────────────────────── */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                <div
                  className="ehb-scan"
                  style={{
                    width: "40%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, #7B6EF6 30%, #2BBFA0 70%, transparent)",
                  }}
                />
              </div>

              {/* ─── Content layer ─────────────────────────────────── */}
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Eyebrow row: breadcrumb + live orb */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: "clamp(22px, 3vw, 34px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#8890B0",
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 1,
                        background:
                          "linear-gradient(90deg, transparent, rgba(160,152,248,0.6))",
                      }}
                    />
                    <span style={{ color: "#A098F8" }}>EHB Home</span>
                    <span style={{ color: "#3a3f5a" }}>/</span>
                    <span style={{ color: "#2BBFA0" }}>Control Center</span>
                    <span style={{ color: "#3a3f5a" }}>/</span>
                    <span style={{ color: "#C8CCDF" }}>Development</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: liveColor,
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: source === "live" ? "rgba(43,191,160,0.10)" : "rgba(240,160,48,0.10)",
                      border: `1px solid ${source === "live" ? "rgba(43,191,160,0.28)" : "rgba(240,160,48,0.28)"}`,
                    }}
                  >
                    <span
                      className="ehb-live-dot"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: liveColor,
                        display: "inline-block",
                      }}
                    />
                    {source === "live" ? "LIVE" : "STATIC"}
                    <span style={{ color: "#555A78", fontWeight: 600, letterSpacing: "0.04em" }}>
                      {source === "live"
                        ? lastFetch
                          ? `updated ${lastFetch.toLocaleTimeString()}`
                          : "just now"
                        : fetchError ?? "reconnecting…"}
                    </span>
                  </div>
                </div>

                {/* Cinematic headline */}
                <h1
                  className="ehb-hero-headline"
                  style={{
                    fontSize: "clamp(44px, 6.2vw, 96px)",
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.02,
                    letterSpacing: "-1.4px",
                    margin: "0 0 clamp(16px, 2vw, 22px)",
                    maxWidth: 1100,
                  }}
                >
                  <span className="ehb-headline-line ehb-headline-d1">EHB Development.</span>
                  <br />
                  <span
                    className="ehb-headline-line ehb-headline-d2"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #A098F8 0%, #7B6EF6 35%, #2BBFA0 85%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Built in real time.
                  </span>
                </h1>

                {/* Subhead */}
                <p
                  className="ehb-fade-up ehb-fade-up-d2"
                  style={{
                    fontSize: "clamp(13px, 1.05vw, 15px)",
                    lineHeight: 1.7,
                    color: "#8890B0",
                    maxWidth: 640,
                    margin: "0 0 clamp(32px, 4vw, 48px)",
                    fontWeight: 400,
                  }}
                >
                  32 industries. 8 core systems. One global super-app —
                  tracked live from{" "}
                  <code style={{ color: "#A098F8", fontFamily: "ui-monospace, monospace", fontSize: "0.92em" }}>
                    ehb-status.json
                  </code>
                  , refreshed every 15 seconds.
                </p>

                {/* ─── METRIC ROW (big numbers · Tesla-grade) ─────── */}
                <div
                  className="ehb-hero-metrics"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "clamp(14px, 1.6vw, 28px)",
                    margin: "0 0 clamp(28px, 3.4vw, 40px)",
                    paddingTop: "clamp(20px, 2.4vw, 30px)",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    { val: `${platformBuild}%`, label: "Platform Build",   sub: "Core + Phase-1 avg", accent: "#A098F8", delay: "ehb-num-d1" },
                    { val: `${industriesLive}/32`, label: "Industries Live", sub: "Phase-1 focus",      accent: "#2BBFA0", delay: "ehb-num-d2" },
                    { val: "8",                  label: "Core Depts",       sub: "PSS · CRB · STL · AI", accent: "#F0A030", delay: "ehb-num-d3" },
                    { val: `${aiModules}+`,      label: "AI Modules",       sub: "Planned / in build", accent: "#7B6EF6", delay: "ehb-num-d4" },
                  ].map((m) => (
                    <div key={m.label} className={`ehb-num ${m.delay}`}>
                      <div
                        style={{
                          fontSize: "clamp(36px, 4.8vw, 68px)",
                          fontWeight: 800,
                          color: "#fff",
                          lineHeight: 0.95,
                          letterSpacing: "-1.2px",
                          marginBottom: 10,
                          fontFeatureSettings: '"tnum" 1, "lnum" 1',
                        }}
                      >
                        {m.val}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: m.accent,
                          marginBottom: 4,
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#555A78", fontWeight: 500 }}>
                        {m.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ─── AI COPILOT RIBBON ──────────────────────────── */}
                <button
                  type="button"
                  onClick={() => openDetail(buildQuickActionDetail())}
                  className="ehb-fade-up ehb-fade-up-d3 ehb-clickable"
                  aria-label="Open AI copilot suggestions"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    marginBottom: "clamp(22px, 2.6vw, 32px)",
                    background:
                      "linear-gradient(135deg, rgba(160,152,248,0.08), rgba(43,191,160,0.08))",
                    border: "1px solid rgba(160,152,248,0.22)",
                    borderRadius: 14,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* bottom shimmer bar */}
                  <span
                    aria-hidden
                    className="ehb-ai-bar"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 1,
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background:
                        "linear-gradient(135deg, #A098F8 0%, #7B6EF6 50%, #2BBFA0 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                      boxShadow: "0 8px 22px rgba(123,110,246,0.35)",
                    }}
                  >
                    🤖
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#A098F8",
                        marginBottom: 3,
                      }}
                    >
                      AI Copilot · Mission Brief
                    </div>
                    <div style={{ fontSize: 13, color: "#E6E8F2", fontWeight: 600, lineHeight: 1.45 }}>
                      {(() => {
                        const totalCritical =
                          data.urgentFixes.filter((u) => u.level === "high").length +
                          data.bugs.filter((b) => b.severity === "high" && b.status === "open").length;
                        if (totalCritical > 0) {
                          return `${totalCritical} critical items need attention. Tap to drill into the Quality queue.`;
                        }
                        return "Platform green — focus this week: wallet escrow wiring + AI marketplace recommendations.";
                      })()}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#A098F8",
                      padding: "6px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(160,152,248,0.35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Open →
                  </span>
                </button>

                {/* ─── GRADIENT ACTION STRIP ──────────────────────── */}
                <div
                  className="ehb-hero-action-strip ehb-fade-up ehb-fade-up-d4"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href="/admin"
                    className="ehb-cta-primary ehb-clickable"
                    style={{
                      padding: "14px 26px",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow:
                        "0 14px 34px rgba(123,110,246,0.40), 0 0 0 1px rgba(255,255,255,0.12) inset",
                      transition: "transform 200ms cubic-bezier(.2,.8,.2,1), filter 200ms",
                    }}
                  >
                    Open Super Admin
                    <span style={{ fontSize: 14 }}>→</span>
                  </Link>

                  <Link
                    href="/"
                    className="ehb-clickable"
                    style={{
                      padding: "13px 22px",
                      borderRadius: 12,
                      color: "#C8CCDF",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    ← Landing
                  </Link>

                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#2BBFA0",
                        padding: "5px 11px",
                        borderRadius: 999,
                        background: "rgba(43,191,160,0.10)",
                        border: "1px solid rgba(43,191,160,0.28)",
                      }}
                    >
                      PHASE-1 ACTIVE
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#A098F8",
                        padding: "5px 11px",
                        borderRadius: 999,
                        background: "rgba(123,110,246,0.10)",
                        border: "1px solid rgba(123,110,246,0.30)",
                      }}
                    >
                      850.00 EHBGC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* LEGEND */}
        <Legend />

        {/* QUICK ACTION BANNER — fory tawajo wala card */}
        <QuickActionBanner
          data={data}
          onOpen={() => openDetail(buildQuickActionDetail())}
        />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  BENTO MISSION CONTROL — design system §7.11                     */}
        {/*  Left (2 cols): Priority queue · Right top: Health ring ·        */}
        {/*  Right bottom: Stats mini-grid (2x2)                             */}
        {/*  v4.4: ehb-bento className → collapses to 1-col <900px           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="ehb-bento ehb-fade-up ehb-fade-up-d3" style={{
          maxWidth: 1600, margin: "0 auto 18px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
          gap: 14,
          alignItems: "stretch",
        }}>
          {/* LEFT — Priority Queue (wide) */}
          <div style={{
            background: "rgba(19,22,42,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14,
            padding: 18,
            boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -1, left: 30, right: 30, height: 1,
              background: "linear-gradient(90deg, transparent, #F05858, #F0A030, transparent)",
            }} />
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 14, paddingBottom: 10,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: "#F07070",
                letterSpacing: "0.12em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>🎯</span> Priority queue · this week
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#FF8080",
                  padding: "2px 7px", borderRadius: 4,
                  background: "rgba(240,88,88,0.14)", border: "1px solid rgba(240,88,88,0.28)",
                }}>{data.priorities.filter((p) => p.level === "high").length} HIGH</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#F0A030",
                  padding: "2px 7px", borderRadius: 4,
                  background: "rgba(240,160,48,0.14)", border: "1px solid rgba(240,160,48,0.28)",
                }}>{data.priorities.filter((p) => p.level === "med").length} MED</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: "#38C878",
                  padding: "2px 7px", borderRadius: 4,
                  background: "rgba(56,200,120,0.14)", border: "1px solid rgba(56,200,120,0.28)",
                }}>{data.priorities.filter((p) => p.level === "low").length} LOW</span>
              </div>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 10,
            }}>
              {data.priorities.map((p) => {
                const critical = p.level === "high";
                const ic = (p as { icon?: string }).icon ?? "•";
                const col =
                  critical
                    ? { bg: "rgba(240,88,88,0.17)", border: "#F05858",             num: "#FF8080", numBg: "rgba(240,88,88,0.28)", text: "#FFCACA", glow: "0 0 18px rgba(240,88,88,0.22)" }
                  : p.level === "med"
                    ? { bg: "rgba(240,160,48,0.09)", border: "rgba(240,160,48,0.35)", num: "#F0A030", numBg: "rgba(240,160,48,0.18)", text: "#FFE6C2", glow: "0 0 14px rgba(240,160,48,0.16)" }
                    : { bg: "rgba(56,200,120,0.08)", border: "rgba(56,200,120,0.32)", num: "#38C878", numBg: "rgba(56,200,120,0.16)", text: "#C8F2D8", glow: "0 0 12px rgba(56,200,120,0.14)" };
                return (
                  <button
                    type="button"
                    key={p.n}
                    onClick={() => openDetail(buildPriorityDetail(p))}
                    style={{
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      background: col.bg, border: `1px solid ${col.border}`,
                      borderRadius: 10, padding: "12px 14px",
                      color: col.text,
                      boxShadow: col.glow,
                      transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: col.numBg, border: `1px solid ${col.border}`,
                        fontSize: 15,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{ic}</div>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: col.numBg, border: `1px solid ${col.border}`,
                        fontSize: 10, fontWeight: 700, color: col.num,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{p.n}</div>
                      <span style={{ fontSize: 9, color: col.num, fontWeight: 700, letterSpacing: "0.08em" }}>{p.meta}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: col.text, lineHeight: 1.45 }}>{p.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Health Ring + Stats mini-grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            <HealthRing
              data={data}
              onClick={() => {
                const h = computeHealth(data);
                openDetail({
                  kind: "Platform health",
                  title: `${h.pct}% build health — ${h.label}`,
                  level: h.level === "risk" ? "high" : h.level === "fair" ? "med" : "low",
                  summary: `Average progress across ${data.coreSystems.length} core systems + ${data.industries.phase1.length} Phase-1 industries.`,
                  fields: [
                    ...data.coreSystems.map((c) => ({
                      label: (c as { icon?: string }).icon ? `${(c as { icon?: string }).icon} ${c.name}` : c.name,
                      value: `${c.progress}%`,
                      color: c.progress >= 60 ? "#38C878" : c.progress >= 30 ? "#F0A030" : "#F05858",
                    })),
                    ...data.industries.phase1.map((i) => ({
                      label: (i as { icon?: string }).icon ? `${(i as { icon?: string }).icon} ${i.name}` : i.name,
                      value: `${i.progress}%`,
                      color: i.progress >= 60 ? "#38C878" : i.progress >= 30 ? "#F0A030" : "#F05858",
                    })),
                  ],
                });
              }}
            />

            {/* Stats mini-grid 2x2 */}
            <div style={{
              background: "rgba(19,22,42,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 14px 36px rgba(20,26,48,0.32), 0 1px 0 rgba(255,255,255,0.16) inset",
              flex: 1,
            }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "#A098F8", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 12 }}>📊</span> Platform vital signs
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 8,
              }}>
                {data.stats.map((st) => {
                  const ic = (st as { icon?: string }).icon ?? "•";
                  return (
                    <button
                      type="button"
                      key={st.label}
                      onClick={() => openDetail({
                        kind: "Stat",
                        title: `${st.val} ${st.label}`,
                        level: "low",
                        summary: st.sub,
                        fields: [
                          { label: "Value", value: st.val, color: "#A098F8" },
                          { label: "Label", value: st.label },
                          { label: "Note",  value: st.sub },
                        ],
                      })}
                      style={{
                        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        background: "rgba(26,29,51,0.85)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        padding: "10px 11px",
                        color: "#fff",
                        transition: "transform 0.14s ease-out, border-color 0.14s ease-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.borderColor = "rgba(123,110,246,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, lineHeight: 1 }}>{ic}</span>
                        <div style={{
                          fontSize: 17, fontWeight: 800, lineHeight: 1,
                          color: st.color === "purple" ? "#A098F8" : st.color === "teal" ? "#2BBFA0" : "#F0A030",
                        }}>{st.val}</div>
                      </div>
                      <div style={{ fontSize: 9, color: "#C8CCDF", fontWeight: 600, letterSpacing: "0.02em" }}>{st.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* TABS with count badges */}
        <div className="ehb-fade-up ehb-fade-up-d4" style={s.tabRow}>
          {TABS.map((tab) => {
            const count = countForTab(tab, data);
            return (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
                padding: "6px 13px", borderRadius: 8, fontSize: 10, fontWeight: 600,
                cursor: "pointer",
                border: activeTab === tab ? "1px solid rgba(123,110,246,0.3)" : "1px solid transparent",
                background: activeTab === tab ? "rgba(123,110,246,0.18)" : "transparent",
                color: activeTab === tab ? "#A098F8" : "#555A78",
                whiteSpace: "nowrap", fontFamily: "inherit",
                transition: "all 0.2s",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                {tab}
                {count !== null && (
                  <span style={{
                    background: activeTab === tab ? "rgba(123,110,246,0.25)" : "rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: "1px 6px",
                    fontSize: 9, fontWeight: 700,
                    color: activeTab === tab ? "#A098F8" : "#8890B0",
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div key={activeTab} className="ehb-fade-up" style={{ maxWidth: 1600, margin: "0 auto" }}>
          {renderTab()}
        </div>

        {/* Stats moved into Bento Mission Control above — §7.11 */}

        {/* FOOTER */}
        <div style={{
          maxWidth: 1600, margin: "36px auto 0",
          paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: source === "live" ? "#2BBFA0" : "#F0A030" }} />
            <span style={{ fontSize: 10, color: "#555A78" }}>
              EHB · {source === "live" ? "Live data" : "Static fallback"}
              {lastFetch ? ` · ${lastFetch.toLocaleTimeString()}` : ""}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "#555A78" }}>
            Investor Demo · v4.4 Bento Mission Control (polish pass) · 2026-04-11 · real-time via /api/dev-status
          </span>
        </div>
      </div>

      {/* DETAIL DRAWER — shows full info of any clicked card */}
      {selected && <DetailDrawer detail={selected} onClose={closeDetail} />}
    </div>
  );
}
