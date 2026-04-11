export type AiAutomationInput = {
  stlLevel: number;
  trustScore: number;
  progressPercent: number;
  complaintsCount: number;
  complaintLimit: number;
  kycVerified: boolean;
  crbVerifications: number;
  requiredCrbVerifications: number;
  examsPassed: number;
  requiredExams: number;
  dmoRefills: number;
  requiredDmoRefills: number;
  activityEvents30d: number;
  supremePending: boolean;
  supremeApproved: boolean;
};

export type AiAutomationResult = {
  readinessPercent: number;
  guide: string;
  tasks: string[];
  recommendations: string[];
  fraud: {
    flagged: boolean;
    reasons: string[];
    risk: "LOW" | "MEDIUM" | "HIGH";
  };
  autoDecision: {
    recommendUpgrade: boolean;
    escalateToDmo: boolean;
    reason: string;
  };
};

function clampPercent(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function evaluateAiAutomation(input: AiAutomationInput): AiAutomationResult {
  const verificationReadiness =
    (input.kycVerified ? 1 : 0) * 0.25 +
    Math.min(1, input.crbVerifications / Math.max(1, input.requiredCrbVerifications)) * 0.35 +
    Math.min(1, input.examsPassed / Math.max(1, input.requiredExams)) * 0.2 +
    Math.min(1, input.dmoRefills / Math.max(1, input.requiredDmoRefills)) * 0.2;

  const activityScore = clampPercent((input.activityEvents30d / 40) * 100);
  const complaintsPenalty =
    input.complaintsCount >= input.complaintLimit
      ? 35
      : input.complaintsCount >= input.complaintLimit - 1
        ? 20
        : input.complaintsCount >= input.complaintLimit - 2
          ? 10
          : 0;

  const readinessPercent = clampPercent(
    input.trustScore * 0.45 +
      input.progressPercent * 0.3 +
      verificationReadiness * 100 * 0.2 +
      activityScore * 0.05 -
      complaintsPenalty
  );

  const tasks: string[] = [];
  if (!input.kycVerified) tasks.push("Complete KYC verification");
  if (input.crbVerifications < input.requiredCrbVerifications) {
    tasks.push(`Complete ${input.requiredCrbVerifications - input.crbVerifications} CRB verifications`);
  }
  if (input.examsPassed < input.requiredExams) {
    tasks.push(`Pass ${input.requiredExams - input.examsPassed} CRB exams`);
  }
  if (input.dmoRefills < input.requiredDmoRefills) {
    tasks.push(`Add ${input.requiredDmoRefills - input.dmoRefills} DMO refills`);
  }
  if (input.complaintsCount >= input.complaintLimit - 2) {
    tasks.push("Resolve complaint issues to avoid trust downgrade");
  }

  const fraudReasons: string[] = [];
  if (input.complaintsCount >= input.complaintLimit) fraudReasons.push("Complaint limit exceeded");
  if (input.activityEvents30d > 120) fraudReasons.push("Unusual activity spike detected");
  if (input.trustScore < 30 && input.stlLevel >= 4) fraudReasons.push("Trust-score mismatch for current level");

  const risk: "LOW" | "MEDIUM" | "HIGH" =
    fraudReasons.length >= 2 ? "HIGH" : fraudReasons.length === 1 ? "MEDIUM" : "LOW";
  const flagged = fraudReasons.length > 0;

  const recommendUpgrade =
    readinessPercent >= 95 &&
    !flagged &&
    input.complaintsCount < input.complaintLimit &&
    !input.supremePending &&
    !input.supremeApproved;
  const escalateToDmo = flagged || input.supremePending || (input.trustScore >= 96 && !input.supremeApproved);

  const recommendations: string[] = [];
  if (recommendUpgrade) {
    recommendations.push("AI recommends upgrade review (95%+ readiness)");
  } else {
    recommendations.push("Focus on pending trust tasks before upgrade request");
  }
  if (escalateToDmo) {
    recommendations.push("DMO review recommended for risk/supreme decision");
  }
  if (!flagged && input.activityEvents30d < 10) {
    recommendations.push("Increase platform activity for stronger trust momentum");
  }

  const guide =
    readinessPercent >= 95
      ? "You are almost upgrade-ready."
      : readinessPercent >= 80
        ? "You are close to the next trust tier."
        : "Complete core trust tasks to improve STL.";

  return {
    readinessPercent,
    guide,
    tasks,
    recommendations,
    fraud: { flagged, reasons: fraudReasons, risk },
    autoDecision: {
      recommendUpgrade,
      escalateToDmo,
      reason: recommendUpgrade
        ? "High readiness with low risk"
        : escalateToDmo
          ? "Risk or approval gate requires DMO"
          : "More trust steps required",
    },
  };
}
