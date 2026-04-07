/**
 * Demo snapshot for EHB-STL-LEVEL dashboard UI (PSS + CRB + DMO + Franchise).
 * Replace with GET /api/stl/me + workflow APIs when counts are live.
 */

export type StlDashboardDemo = {
  displayName: string;
  stlLevel: 1 | 2 | 3 | 4 | 5;
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
  };
  franchise: {
    verifications: { city: string; done: boolean }[];
    totalLabel: string;
  };
  publicProfile: {
    badge: string;
    summaryLines: string[];
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

export const STL_DASHBOARD_DEMO: StlDashboardDemo = {
  displayName: "Muhammad Rafi",
  stlLevel: 4,
  trustScore: 78,
  nextLevelLabel: "STL-5 (VIP)",
  nextLevelShort: "VIP",
  progressToNext: 80,
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
    warning: "2 more complaints before upgrade path may be blocked",
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
    nextRequirement: "2 more refills needed for next tier review",
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
    summaryLines: ["PSS: Verified", "CRB: 2/4", "DMO: Active", "Complaints: 2 open"],
  },
  ai: {
    headline: "You are ~80% ready for VIP",
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
