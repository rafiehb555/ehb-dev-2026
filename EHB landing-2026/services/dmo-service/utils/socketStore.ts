import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const redis = new IORedis(REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: false });

const USER_SOCKET_PREFIX = "rt:user:";
const SOCKET_USER_PREFIX = "rt:socket:";
const SOCKET_TTL_SECONDS = 60 * 60 * 12;

export async function setUserSocket(userId: string, socketId: string): Promise<void> {
  await redis.set(`${USER_SOCKET_PREFIX}${userId}`, socketId, "EX", SOCKET_TTL_SECONDS);
  await redis.set(`${SOCKET_USER_PREFIX}${socketId}`, userId, "EX", SOCKET_TTL_SECONDS);
}

export async function getUserSocket(userId: string): Promise<string | null> {
  return redis.get(`${USER_SOCKET_PREFIX}${userId}`);
}

export async function removeSocket(socketId: string): Promise<void> {
  const userId = await redis.get(`${SOCKET_USER_PREFIX}${socketId}`);
  if (userId) {
    await redis.del(`${USER_SOCKET_PREFIX}${userId}`);
  }
  await redis.del(`${SOCKET_USER_PREFIX}${socketId}`);
}
