import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

/** Shared KPI strip item — used by STL dashboard (live or demo). */
export type StlKpiItem = {
  label: string;
  value: string;
  hint?: string;
  accent: "blue" | "rose" | "emerald" | "amber" | "violet";
};

export function kpisFromSnapshot(s: StlFullSnapshot): StlKpiItem[] {
  return [
    {
      label: "Trust score",
      value: `${s.trustScore}`,
      hint: `Level ${s.stlLevel} · ${s.levelName}`,
      accent: "emerald",
    },
    {
      label: "PSS / KYC",
      value: String(s.pss.kycStatus),
      hint: `Phase ${s.pss.level}/6`,
      accent: "blue",
    },
    {
      label: "CRB verifications",
      value: `${s.crb.totalVerifications}/${s.crb.requiredVerifications}`,
      hint: `Exams ${s.crb.examsPassed}/${s.crb.requiredExams}`,
      accent: "violet",
    },
    {
      label: "DMO refills",
      value: `${s.dmo.refillCount}/${s.dmo.requiredRefillCount}`,
      hint: "Completed",
      accent: "amber",
    },
    {
      label: "Complaints",
      value: `${s.complaints.count}/${s.complaints.limit}`,
      hint: s.complaints.nearLimit ? "Near limit" : s.upgradeBlocked ? "Blocked" : "OK",
      accent: s.complaints.nearLimit || s.upgradeBlocked ? "rose" : "emerald",
    },
  ];
}
