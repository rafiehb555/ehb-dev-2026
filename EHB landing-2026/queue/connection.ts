import IORedis from "ioredis";

let sharedConnection: IORedis | null = null;

export function getQueueConnection(): IORedis | null {
  if (sharedConnection) return sharedConnection;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  sharedConnection = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  return sharedConnection;
}
