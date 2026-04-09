export const EHB_QUEUE_NAME = "ehb-background";

export const JOB_NAMES = {
  AI_PROCESSING: "ai.processing",
  STL_RECALCULATION: "stl.recalculation",
  NOTIFICATION_DISPATCH: "notification.dispatch",
  PAYMENT_VERIFICATION: "payment.verification",
} as const;

export type EhbJobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];
