export type AIBrainContext = {
  userId: string;
  failedPayments: number;
  pssVerified: boolean;
  multipleAccounts: boolean;
  balance: number;
};

export type RiskDecision = {
  score: number;
  level: "LOW" | "HIGH";
};

export type EligibilityDecision = {
  allowed: boolean;
  reason?: string;
};

export type AIBrainResult = {
  risk: RiskDecision;
  eligibility: EligibilityDecision;
};
