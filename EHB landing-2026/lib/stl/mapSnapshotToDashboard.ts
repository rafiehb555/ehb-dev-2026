import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

/** Maps unified API snapshot into legacy dashboard card shape (single UI system). */
export function mapSnapshotToDashboardDemo(s: StlFullSnapshot, displayName = "Account"): StlDashboardDemo {
  const nextLabel = s.nextLevel ? `${s.nextLevel.name} (L${s.nextLevel.level})` : "Max tier";
  return {
    displayName: s.name ?? displayName,
    roleLabel: s.dataSource === "demo" ? "Demo preview" : "Trust account",
    stlLevel: Math.max(1, Math.min(8, s.stlLevel)) as StlDashboardDemo["stlLevel"],
    trustScore: s.trustScore,
    nextLevelLabel: nextLabel,
    nextLevelShort: s.nextLevel?.name ?? (s.stlLevel >= 8 ? "MAX" : "Next tier"),
    progressToNext: s.progress.percent,
    pending: {
      crb: { current: s.crb.totalVerifications, target: s.crb.requiredVerifications },
      exams: { current: s.crb.examsPassed, target: s.crb.requiredExams },
      refills: { current: s.dmo.refillCount, target: s.dmo.requiredRefillCount },
    },
    pss: {
      kycDone: String(s.pss.kycStatus).toUpperCase() === "VERIFIED",
      phaseLabel: `Level ${s.pss.level}`,
      complaintsOpen: s.pss.complaintsCount,
      complaintsMax: s.pss.complaintLimit,
      warning: s.complaints.nearLimit ? "Complaints near platform limit" : undefined,
    },
    crb: {
      verifications: { current: s.crb.totalVerifications, target: s.crb.requiredVerifications },
      examsPassed: { current: s.crb.examsPassed, target: s.crb.requiredExams },
      history: s.crb.history.map((h) => ({ label: `${h.status} · ${h.at.slice(0, 10)}`, ok: h.status === "COMPLETED" })),
    },
    dmo: {
      refills: { current: s.dmo.refillCount, target: s.dmo.requiredRefillCount },
      statusLabel: s.upgradeBlocked ? "Upgrade blocked" : s.supreme.pendingApproval ? "SUPREME pending" : "Active",
      nextRequirement: s.missingRequirements[0] ?? "—",
      lastRefillAmount: "—",
    },
    franchise: {
      verifications: [
        { city: "Verified locations", done: s.franchise.verifiedLocations > 0 },
        { city: "Pending locations", done: s.franchise.pendingLocations === 0 },
      ],
      totalLabel: `${s.franchise.verifiedLocations} verified · ${s.franchise.pendingLocations} pending`,
    },
    publicProfile: {
      badge: `${s.levelName}`,
      stlLine: `STL L${s.stlLevel} · ${s.trustScore}/100`,
      summaryLines: [
        `PSS: ${s.pss.kycStatus}`,
        `CRB: ${s.crb.totalVerifications}/${s.crb.requiredVerifications}`,
        `Complaints: ${s.complaints.count}/${s.complaints.limit}`,
      ],
    },
    ai: {
      headline: s.aiSuggestions[0] ?? "Trust profile is stable",
      bullets: s.aiSuggestions.slice(0, 6),
    },
    dmoControl: {
      stlLevel: s.stlLevel,
      complaints: s.supreme.pendingApproval ? ["SUPREME approval pending"] : [],
    },
  };
}
