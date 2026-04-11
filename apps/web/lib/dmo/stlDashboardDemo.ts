/**
 * Demo snapshot for EHB-STL-LEVEL dashboard UI (PSS + CRB + DMO + Franchise).
 * Replace with GET /api/stl/me + workflow APIs when counts are live.
 */

export type StlDashboardDemo = {
  displayName: string;
  /** Shown next to name, e.g. Seller / Franchise */
  roleLabel: string;
  stlLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  trustScore: number;
  nextLevelLabel: string;
  nextLevelShort: string;
  /** 0–100 visual progress toward next tier */
  progressToNext: number;
  pending: {
    crb: { current: number; target: number };
    exams: { current: number; target: number };
    refills: { current: number; target: number };
  };
  pss: {
    kycDone: boolean;
    phaseLabel: string;
    complaintsOpen: number;
    complaintsMax: number;
    warning?: string;
  };
  crb: {
    verifications: { current: number; target: number };
    examsPassed: { current: number; target: number };
    history: { label: string; ok: boolean }[];
  };
  dmo: {
    refills: { current: number; target: number };
    statusLabel: string;
    nextRequirement: string;
    /** Last refill amount label for dashboard */
    lastRefillAmount: string;
  };
  franchise: {
    verifications: { city: string; done: boolean }[];
    totalLabel: string;
  };
  publicProfile: {
    badge: string;
    /** Structured lines for public card */
    summaryLines: string[];
    stlLine: string;
  };
  ai: {
    headline: string;
    bullets: string[];
  };
  dmoControl: {
    stlLevel: number;
    complaints: string[];
  };
};

/** Horizontal tier cards (Franchise / STL verification mocks). */
export type StlTierCardDef = {
  id: string;
  name: string;
  subtitle: string;
  /** Visual accent for neon border */
  accent: "slate" | "zinc" | "amber" | "sky" | "violet" | "emerald";
};

export const STL_TIER_CARDS: StlTierCardDef[] = [
  { id: "stl1", name: "L1 FREE", subtitle: "Starter access", accent: "slate" },
  { id: "stl2", name: "L2 BASIC", subtitle: "Basic verification", accent: "zinc" },
  { id: "stl3", name: "L3 NORMAL", subtitle: "Operationally trusted", accent: "amber" },
  { id: "stl4", name: "L4 STANDARD", subtitle: "Standard trust controls", accent: "sky" },
  { id: "stl5", name: "L5 ADVANCED", subtitle: "Advanced trust profile", accent: "violet" },
  { id: "stl6", name: "L6 HIGH", subtitle: "High reliability", accent: "emerald" },
  { id: "stl7", name: "L7 VIP", subtitle: "Priority trust lane", accent: "amber" },
  { id: "stl8", name: "L8 SUPREME 👑", subtitle: "DMO approved only", accent: "violet" },
];

/** Franchise / provider verification pipeline (demo). */
export type StlVerificationStepDef = {
  id: string;
  title: string;
  detail?: string;
  status: "complete" | "current" | "pending";
};

export const STL_VERIFICATION_STEPS: StlVerificationStepDef[] = [
  {
    id: "app",
    title: "Application",
    detail: "Submitted by applicant",
    status: "complete",
  },
  {
    id: "docs",
    title: "Documents",
    detail: "Verified Apr 20, 2024",
    status: "complete",
  },
  {
    id: "ai",
    title: "AI & risk",
    detail: "Reveal trust score",
    status: "current",
  },
  {
    id: "inspect",
    title: "Franchise inspection",
    detail: "Inspector: Asad Malik",
    status: "pending",
  },
  {
    id: "dmo",
    title: "DMO review",
    detail: "Blockchain record",
    status: "pending",
  },
];

import type { StlKpiItem } from "@/lib/stl/stlKpi";

export type { StlKpiItem } from "@/lib/stl/stlKpi";

export const STL_KPI_STRIP: StlKpiItem[] = [
  { label: "Active providers", value: "8,450", hint: "+320 this week", accent: "blue" },
  { label: "Pending verifications", value: "320", hint: "Queue", accent: "rose" },
  { label: "Verified listings", value: "6,150", hint: "GoSellr + JPS", accent: "emerald" },
  { label: "STL upgrades (30d)", value: "725", hint: "All levels", accent: "amber" },
  { label: "Trust revenue", value: "$1.25M", hint: "Demo aggregate", accent: "violet" },
];

export const STL_DASHBOARD_DEMO: StlDashboardDemo = {
  displayName: "Muhammad Rafi",
  roleLabel: "Seller / Franchise",
  stlLevel: 6,
  trustScore: 82,
  nextLevelLabel: "STL-7 (VIP)",
  nextLevelShort: "VIP",
  progressToNext: 65,
  pending: {
    crb: { current: 2, target: 4 },
    exams: { current: 1, target: 4 },
    refills: { current: 4, target: 6 },
  },
  pss: {
    kycDone: true,
    phaseLabel: "Advanced",
    complaintsOpen: 2,
    complaintsMax: 8,
    warning: "2 more complaints will block upgrade",
  },
  crb: {
    verifications: { current: 2, target: 4 },
    examsPassed: { current: 1, target: 4 },
    history: [
      { label: "Visit #1 — PASS", ok: true },
      { label: "Visit #2 — PASS", ok: true },
      { label: "Exam #1 — FAIL", ok: false },
    ],
  },
  dmo: {
    refills: { current: 4, target: 6 },
    statusLabel: "In progress",
    nextRequirement: "2 more refills needed",
    lastRefillAmount: "$100",
  },
  franchise: {
    verifications: [
      { city: "Islamabad", done: true },
      { city: "Lahore", done: false },
    ],
    totalLabel: "2 verifications",
  },
  publicProfile: {
    badge: "HIGH VERIFIED USER",
    stlLine: "STL LEVEL: 4 (HIGH)",
    summaryLines: [
      "PSS: Verified",
      "CRB: 2/4 Verified",
      "Exams: 1/4 Passed",
      "DMO: Active",
      "Complaints: 2",
    ],
  },
  ai: {
    headline: "You're 80% ready for VIP",
    bullets: [
      "Complete 2 CRB verifications",
      "Pass 3 exams",
      "Add 2 refills",
    ],
  },
  dmoControl: {
    stlLevel: 4,
    complaints: ["Late delivery", "Service issue"],
  },
};
