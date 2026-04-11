import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

export type UserStlModule = {
  score: number;
};

export type UserStlObject = {
  userId: string;
  stlScore: number;
  stlLevel: string;
  modules: {
    pss: UserStlModule & {
      kycVerified: boolean;
      complaints: number;
      verificationPending: number;
    };
    crb: UserStlModule & {
      examsPassed: number;
      examsFailed: number;
      visitsCompleted: number;
    };
    dmo: UserStlModule & {
      activityLevel: "low" | "medium" | "high";
      refills: number;
      behaviorScore: number;
    };
    franchise: UserStlModule & {
      connected: boolean;
      coverage: "none" | "district" | "regional" | "national";
    };
  };
  earnings: { today: number; monthly: number; total: number };
  growth: { referrals: number; earnings: number };
  history: Array<{ at: string; score: number; reason: string }>;
  logs: Array<{ at: string; message: string }>;
};

export type DynamicStlExplanation = {
  reasons: string[];
  fixes: string[];
};

export type DynamicLevel = { level: string; min: number };

export const DYNAMIC_LEVELS: DynamicLevel[] = [
  { level: "L1", min: 0 },
  { level: "L2", min: 30 },
  { level: "L3", min: 50 },
  { level: "L4", min: 70 },
  { level: "L5", min: 85 },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function calculateSTL(user: UserStlObject): number {
  const pss = user.modules.pss.score || 0;
  const crb = user.modules.crb.score || 0;
  const dmo = user.modules.dmo.score || 0;
  const franchise = user.modules.franchise.score || 0;

  const activityBonus = user.modules.dmo.activityLevel === "high" ? 10 : 5;
  const trustBonus = user.modules.pss.kycVerified ? 10 : 0;

  const score =
    pss * 0.25 +
    crb * 0.25 +
    dmo * 0.2 +
    franchise * 0.15 +
    activityBonus * 0.1 +
    trustBonus * 0.05;

  return clamp(Math.round(score), 0, 100);
}

export function explainSTL(user: UserStlObject): DynamicStlExplanation {
  const reasons: string[] = [];
  const fixes: string[] = [];

  if (!user.modules.pss.kycVerified) {
    reasons.push("KYC not verified");
    fixes.push("Complete KYC verification");
  }
  if (user.modules.crb.examsFailed > 0) {
    reasons.push("Some exams failed");
    fixes.push("Retake failed CRB exams");
  }
  if (user.modules.pss.verificationPending > 0) {
    reasons.push("Pending verifications");
    fixes.push("Finish pending PSS verification steps");
  }
  if (user.modules.dmo.activityLevel === "low") {
    reasons.push("Low activity level");
    fixes.push("Increase platform activity and refill consistency");
  }

  return { reasons, fixes };
}

export function getNextLevel(score: number): DynamicLevel | null {
  return DYNAMIC_LEVELS.find((l) => l.min > score) ?? null;
}

export function getCurrentLevel(score: number): DynamicLevel {
  return (
    [...DYNAMIC_LEVELS].reverse().find((l) => score >= l.min) ?? {
      level: "L1",
      min: 0,
    }
  );
}

export function calculateReferralBonus(referrals: number): number {
  return Math.max(0, referrals) * 5;
}

export function canUnlockPremiumServices(user: UserStlObject): boolean {
  return user.stlScore > 70;
}

export function fromSnapshotToDynamic(snapshot: StlFullSnapshot, userId: string): UserStlObject {
  const referrals = snapshot.franchise.verifiedLocations + snapshot.franchise.pendingLocations;
  const growthEarnings = calculateReferralBonus(referrals);
  const dmoActivity: "low" | "medium" | "high" =
    snapshot.dmo.refillCount >= snapshot.dmo.requiredRefillCount ? "high" : snapshot.dmo.refillCount >= 2 ? "medium" : "low";

  const object: UserStlObject = {
    userId,
    stlScore: snapshot.trustScore,
    stlLevel: `L${snapshot.stlLevel}`,
    modules: {
      pss: {
        kycVerified: snapshot.pss.kyc,
        complaints: snapshot.pss.complaintsCount,
        verificationPending: snapshot.pss.kyc ? 0 : 1,
        score: snapshot.pss.kyc ? 70 : 45,
      },
      crb: {
        examsPassed: snapshot.crb.examsPassed,
        examsFailed: Math.max(0, snapshot.crb.requiredExams - snapshot.crb.examsPassed),
        visitsCompleted: snapshot.crb.totalVerifications,
        score: Math.round((snapshot.crb.totalVerifications / Math.max(1, snapshot.crb.requiredVerifications)) * 100),
      },
      dmo: {
        activityLevel: dmoActivity,
        refills: snapshot.dmo.refillCount,
        behaviorScore: Math.max(0, 100 - Math.round((snapshot.complaints.count / Math.max(1, snapshot.complaints.limit)) * 100)),
        score: Math.round((snapshot.dmo.refillCount / Math.max(1, snapshot.dmo.requiredRefillCount)) * 100),
      },
      franchise: {
        connected: referrals > 0,
        coverage: referrals > 8 ? "regional" : referrals > 0 ? "district" : "none",
        score: Math.round((snapshot.franchise.verifiedLocations / Math.max(1, referrals)) * 100),
      },
    },
    earnings: {
      today: Math.max(5, Math.round(snapshot.trustScore * 0.08)),
      monthly: Math.max(50, Math.round(snapshot.trustScore * 2.4)),
      total: Math.max(200, Math.round(snapshot.trustScore * 10)),
    },
    growth: {
      referrals,
      earnings: growthEarnings,
    },
    history: [
      {
        at: new Date().toISOString(),
        score: snapshot.trustScore,
        reason: "SNAPSHOT_SYNC",
      },
    ],
    logs: [
      {
        at: new Date().toISOString(),
        message: snapshot.dataSource === "live" ? "Live STL snapshot loaded" : "Demo STL snapshot loaded",
      },
    ],
  };

  object.stlScore = calculateSTL(object);
  object.stlLevel = getCurrentLevel(object.stlScore).level;
  return object;
}

