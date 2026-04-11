export type AutomationEvent = "USER_UPDATED" | "PAYMENT_SUCCESS" | "STL_CHECK";

export type AutomationPayload = {
  userId: string;
  role?: string;
  stl?: number;
  pssVerified?: boolean;
  crbPassed?: boolean;
  balance?: number;
  suspiciousActivity?: boolean;
  checksPassed?: boolean;
  level?: number;
};

export type AutomationActionType = "UPGRADE_STL" | "APPLY_PENALTY" | "AUTO_APPROVE_FRANCHISE" | "NO_ACTION";

export type AutomationAction = {
  action: AutomationActionType;
  reason: string;
  level?: number;
  meta?: Record<string, unknown>;
};

