import { Worker } from "bullmq";
import { recalcUserStl } from "@/lib/stl/engine";
import { runDmoTrustEngine } from "@/lib/stl/dmoTrustEngine";
import { getAiSuggestionsForUser } from "@/services/ai.service";
import { getStlFullSnapshotForUser } from "@/services/stl.service";
import { getQueueConnection } from "@/queue/connection";
import { EHB_QUEUE_NAME, JOB_NAMES } from "@/queue/names";
import type { PaymentType } from "@/lib/payments/catalog";

type JobPayload = {
  userId?: string;
  actorId?: string;
  reason?: string;
  paymentType?: PaymentType;
};

export function startBackgroundWorker() {
  const connection = getQueueConnection();
  if (!connection) return null;

  return new Worker(
    EHB_QUEUE_NAME,
    async (job) => {
      const payload = (job.data ?? {}) as JobPayload;
      if (!payload.userId) return;

      switch (job.name) {
        case JOB_NAMES.AI_PROCESSING:
          await getAiSuggestionsForUser(payload.userId);
          return;

        case JOB_NAMES.STL_RECALCULATION:
          await recalcUserStl({
            userId: payload.userId,
            actorId: payload.actorId ?? payload.userId,
            reason: payload.reason ?? "BACKGROUND_RECALC",
          }).catch(() => undefined);
          await getStlFullSnapshotForUser(payload.userId).catch(() => undefined);
          return;

        case JOB_NAMES.NOTIFICATION_DISPATCH:
          await getStlFullSnapshotForUser(payload.userId).catch(() => undefined);
          return;

        case JOB_NAMES.PAYMENT_VERIFICATION:
          if (!payload.paymentType) return;
          if (payload.paymentType === "STL_UPGRADE") {
            await runDmoTrustEngine({ userId: payload.userId, actorId: payload.actorId ?? payload.userId, reason: "VERIFICATION_UPDATE" }).catch(() => undefined);
          } else if (payload.paymentType === "CRB_EXAM") {
            await runDmoTrustEngine({ userId: payload.userId, actorId: payload.actorId ?? payload.userId, reason: "EXAM_RESULT" }).catch(() => undefined);
          } else if (payload.paymentType === "DMO_REFILL") {
            await runDmoTrustEngine({ userId: payload.userId, actorId: payload.actorId ?? payload.userId, reason: "REFILL_UPDATE" }).catch(() => undefined);
          }
          return;

        default:
          return;
      }
    },
    { connection },
  );
}
