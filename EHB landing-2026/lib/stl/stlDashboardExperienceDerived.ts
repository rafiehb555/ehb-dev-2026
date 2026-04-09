import type { StlTierCardDef, StlVerificationStepDef } from "@/lib/dmo/stlDashboardDemo";
import type { EhbStlLevelMeta } from "@/lib/stl/levels";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

/** Clamp STL user-facing level to 1–8. */
export function clampUserStlLevel(level: number): number {
  return Math.max(1, Math.min(8, level));
}

/** Accent sequence for live tier strip (matches demo STL_TIER_CARDS cadence). */
const LIVE_TIER_ACCENTS: StlTierCardDef["accent"][] = [
  "slate",
  "zinc",
  "amber",
  "sky",
  "violet",
  "emerald",
  "amber",
  "violet",
];

/** Map API level metadata to tier selector cards. */
export function liveTierCardsFromLevels(levels: EhbStlLevelMeta[]): StlTierCardDef[] {
  return levels.map((lv, idx) => ({
    id: `stl${lv.level}`,
    name: `${lv.code} ${lv.name}`,
    subtitle: lv.requiresManualApproval ? "Manual approval required" : `${lv.min}-${lv.max} score range`,
    accent: LIVE_TIER_ACCENTS[idx] ?? "slate",
  }));
}

/** Verification pipeline steps derived from a full trust snapshot. */
export function verificationStepsFromFullSnapshot(snapshot: StlFullSnapshot): StlVerificationStepDef[] {
  return [
    {
      id: "kyc",
      title: "KYC",
      detail: snapshot.pss.kycStatus,
      status: snapshot.pss.kycStatus === "VERIFIED" ? "complete" : "current",
    },
    {
      id: "crb",
      title: "CRB",
      detail: `${snapshot.crb.totalVerifications}/${snapshot.crb.requiredVerifications} verifications`,
      status:
        snapshot.crb.totalVerifications >= snapshot.crb.requiredVerifications ? "complete" : "current",
    },
    {
      id: "exams",
      title: "Exams",
      detail: `${snapshot.crb.examsPassed}/${snapshot.crb.requiredExams} passed`,
      status: snapshot.crb.examsPassed >= snapshot.crb.requiredExams ? "complete" : "current",
    },
    {
      id: "dmo",
      title: "DMO Refills",
      detail: `${snapshot.dmo.refillCount}/${snapshot.dmo.requiredRefillCount}`,
      status: snapshot.dmo.refillCount >= snapshot.dmo.requiredRefillCount ? "complete" : "pending",
    },
    {
      id: "supreme",
      title: "SUPREME Review",
      detail: snapshot.supreme.pendingApproval ? "Pending DMO approval" : "Not in review",
      status: snapshot.supreme.approved
        ? "complete"
        : snapshot.supreme.pendingApproval
          ? "current"
          : "pending",
    },
  ];
}
