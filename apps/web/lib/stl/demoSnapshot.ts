/**
 * Client-safe STL demo snapshot.
 *
 * This file MUST NOT import prisma, engine.ts, or any server-only module.
 * It is imported by both:
 *   - server side: lib/stl/fullSnapshot.ts (demoSnapshot() fallback)
 *   - client side: hooks/useSTL.ts (instant initial render, no loading flash)
 *
 * Keep it pure data + the `EHB_STL_LEVELS` constant (also client-safe).
 */

import { EHB_STL_LEVELS } from "@/lib/stl/levels";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

export const REQUIRED_VERIFICATIONS = 4;
export const REQUIRED_EXAMS = 4;
export const REQUIRED_REFILLS = 4;
export const COMPLAINT_LIMIT = 8;

/**
 * Stable demo payload for SSR + client initial render.
 * Used when (a) no user session, (b) dev fallback, (c) client first paint.
 */
export const DEMO_STL_SNAPSHOT: StlFullSnapshot = {
  name: "Demo User",
  stlLevel: 3,
  levels: EHB_STL_LEVELS,
  trustScore: 49,
  progressPercent: 45,
  levelName: "NORMAL",
  pss: {
    kycStatus: "PENDING",
    kyc: false,
    level: 2,
    complaintsCount: 1,
    complaints: 1,
    complaintLimit: COMPLAINT_LIMIT,
  },
  crb: {
    verifications: 1,
    totalVerifications: 1,
    required: REQUIRED_VERIFICATIONS,
    requiredVerifications: REQUIRED_VERIFICATIONS,
    examsPassed: 0,
    requiredExams: REQUIRED_EXAMS,
    history: [],
  },
  dmo: {
    refills: 1,
    refillCount: 1,
    requiredRefills: REQUIRED_REFILLS,
    requiredRefillCount: REQUIRED_REFILLS,
    refillHistory: [],
  },
  franchise: { verified: [], pending: [], verifiedLocations: 0, pendingLocations: 0 },
  complaints: { count: 1, limit: COMPLAINT_LIMIT, nearLimit: false },
  progress: { percent: 45, nextLevelName: "STANDARD" },
  nextLevel: { level: 4, name: "STANDARD", minScore: 56 },
  nextLevelName: "STANDARD",
  nextLevelLevel: 4,
  missingRequirements: ["Complete KYC verification", "Finish PSS phase progress"],
  supreme: { eligible: false, pendingApproval: false, approved: false, rejected: false },
  upgradeBlocked: false,
  blocked: false,
  canUpgrade: true,
  aiSuggestions: ["Complete KYC verification"],
  ai: {
    readinessPercent: 45,
    guide: "Complete core trust tasks to improve STL.",
    tasks: ["Complete KYC verification", "Finish PSS phase progress"],
    recommendations: ["Focus on pending trust tasks before upgrade request"],
    fraud: { flagged: false, reasons: [], risk: "LOW" },
    autoDecision: { recommendUpgrade: false, escalateToDmo: false, reason: "More trust steps required" },
  },
  breakdown: {
    pss: 18,
    crb: 15,
    performance: 12,
    behavior: -4,
    industries: 8,
    refilling: 0,
    total: 49,
    level: 3,
    label: "NORMAL",
  },
  dataSource: "demo",
};

export function getDemoStlSnapshot(): StlFullSnapshot {
  // Return a shallow clone so callers can safely mutate without corrupting the constant.
  return { ...DEMO_STL_SNAPSHOT };
}
