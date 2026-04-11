import { enqueueJob } from "@/queue/client";
import { JOB_NAMES } from "@/queue/names";
import type { PaymentType } from "@/lib/payments/catalog";

export function enqueueAiProcessing(userId: string): void {
  void enqueueJob(JOB_NAMES.AI_PROCESSING, { userId });
}

export function enqueueStlRecalculation(args: { userId: string; actorId: string; reason: string }): void {
  void enqueueJob(JOB_NAMES.STL_RECALCULATION, args);
}

export function enqueueNotificationDispatch(args: { userId: string }): void {
  void enqueueJob(JOB_NAMES.NOTIFICATION_DISPATCH, args);
}

export function enqueuePaymentVerification(args: {
  userId: string;
  actorId: string;
  paymentType: PaymentType;
}): void {
  void enqueueJob(JOB_NAMES.PAYMENT_VERIFICATION, args);
}
