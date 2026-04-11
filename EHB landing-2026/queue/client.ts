import { Queue, type JobsOptions } from "bullmq";
import { getQueueConnection } from "@/queue/connection";
import { EHB_QUEUE_NAME, type EhbJobName } from "@/queue/names";

let sharedQueue: Queue | null = null;

function getQueue(): Queue | null {
  if (sharedQueue) return sharedQueue;
  const connection = getQueueConnection();
  if (!connection) return null;
  sharedQueue = new Queue(EHB_QUEUE_NAME, { connection });
  return sharedQueue;
}

export async function enqueueJob<T extends Record<string, unknown>>(
  name: EhbJobName,
  payload: T,
  opts?: JobsOptions,
): Promise<void> {
  const queue = getQueue();
  if (!queue) return;

  await queue
    .add(name, payload, {
      attempts: 3,
      removeOnComplete: 200,
      removeOnFail: 500,
      backoff: { type: "exponential", delay: 500 },
      ...opts,
    })
    .catch(() => undefined);
}
