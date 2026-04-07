/**
 * Reference STL scoring (demo / bridge) — aligns with product brief for PSS+CRB+DMO weights.
 * Production engine: `lib/stl/engine.ts` + Prisma; use this for UI previews & docs only.
 */

import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

export function stlDashboardDemoToEngine(d: StlDashboardDemo): StlDemoUserShape {
  return {
    pss: {
      kyc: d.pss.kycDone,
      level: d.pss.phaseLabel.toLowerCase().includes("advanced") ? "advanced" : "basic",
      complaints: d.pss.complaintsOpen,
      maxAllowed: d.pss.complaintsMax,
    },
    crb: {
      verifications: d.crb.verifications.current,
      requiredVerifications: d.crb.verifications.target,
      examsPassed: d.crb.examsPassed.current,
      requiredExams: d.crb.examsPassed.target,
    },
    dmo: {
      refills: d.dmo.refills.current,
      requiredRefills: d.dmo.refills.target,
    },
  };
}

export type StlDemoUserShape = {
  pss: {
    kyc: boolean;
    level: "basic" | "advanced";
    complaints: number;
    maxAllowed: number;
  };
  crb: {
    verifications: number;
    requiredVerifications: number;
    examsPassed: number;
    requiredExams: number;
  };
  dmo: {
    refills: number;
    requiredRefills: number;
  };
};

export function calculateSTL(user: StlDemoUserShape): number {
  let score = 0;
  if (user.pss.kyc) score += 20;
  score += user.pss.level === "advanced" ? 20 : 10;
  const v = user.crb.requiredVerifications > 0 ? user.crb.verifications / user.crb.requiredVerifications : 0;
  const e = user.crb.requiredExams > 0 ? user.crb.examsPassed / user.crb.requiredExams : 0;
  const r = user.dmo.requiredRefills > 0 ? user.dmo.refills / user.dmo.requiredRefills : 0;
  score += v * 20;
  score += e * 10;
  score += r * 20;
  score -= user.pss.complaints * 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getSTLLevelFromScore(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

export function canUpgradeStl(user: StlDemoUserShape): boolean {
  return user.pss.complaints < user.pss.maxAllowed;
}

export function getStlSuggestions(user: StlDemoUserShape): string[] {
  const tasks: string[] = [];
  if (user.crb.verifications < user.crb.requiredVerifications) {
    tasks.push("Complete CRB verifications");
  }
  if (user.crb.examsPassed < user.crb.requiredExams) {
    tasks.push("Pass remaining exams");
  }
  if (user.dmo.refills < user.dmo.requiredRefills) {
    tasks.push("Complete DMO refills");
  }
  if (user.pss.complaints >= user.pss.maxAllowed - 2) {
    tasks.push("Resolve complaints — upgrade may block soon");
  }
  return tasks;
}
