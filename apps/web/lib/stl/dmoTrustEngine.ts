import { recalcUserStl } from "@/lib/stl/engine";
import { buildStlFullSnapshot } from "@/lib/stl/fullSnapshot";
import { EHB_STL_LEVELS } from "@/lib/stl/levels";

export type TrustEngineEvent = "USER_LOGIN" | "REFILL_UPDATE" | "VERIFICATION_UPDATE" | "EXAM_RESULT" | "COMPLAINT_UPDATE";

export async function runDmoTrustEngine(args: {
  userId: string;
  reason: TrustEngineEvent;
  actorId?: string | null;
}) {
  const result = await recalcUserStl({
    userId: args.userId,
    actorId: args.actorId ?? null,
    reason: args.reason,
  });
  return result;
}

/** Legacy shape for /api/stl/me — maps from unified snapshot */
export async function getUserTrustEngineSnapshot(userId: string) {
  const s = await buildStlFullSnapshot(userId);
  return {
    stlLevel: s.stlLevel,
    trustScore: s.trustScore,
    progressToNextLevel: s.progress.percent,
    levelName: s.levelName,
    nextLevel: s.nextLevel,
    levels: EHB_STL_LEVELS,
    canUpgrade: s.canUpgrade,
    pss: {
      kycStatus: s.pss.kycStatus,
      level: s.pss.level,
      complaintsCount: s.pss.complaintsCount,
      complaintLimit: s.pss.complaintLimit,
    },
    crb: {
      totalVerifications: s.crb.totalVerifications,
      requiredVerifications: s.crb.requiredVerifications,
      examsPassed: s.crb.examsPassed,
      requiredExams: s.crb.requiredExams,
      history: s.crb.history,
    },
    dmo: {
      refillCount: s.dmo.refillCount,
      requiredRefillCount: s.dmo.requiredRefillCount,
      refillHistory: s.dmo.refillHistory,
    },
    franchise: s.franchise,
    missingRequirements: s.missingRequirements,
    aiSuggestions: s.aiSuggestions,
    supreme: s.supreme,
  };
}
