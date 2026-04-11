import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { removeSocket, setUserSocket, getUserSocket } from "@/services/dmo-service/utils/socketStore";

export async function startDmoRealtimeServer(port = Number(process.env.DMO_REALTIME_PORT ?? 5000)) {
  const server = createServer();

  const io = new Server(server, {
    cors: { origin: process.env.DMO_REALTIME_CORS_ORIGIN ?? "*" },
  });

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.on("connection", (socket) => {
    socket.on("register", async (userId: string) => {
      if (!userId) return;
      await setUserSocket(userId, socket.id);
    });

    socket.on("send_message", async ({ from, to, message }: { from: string; to: string; message: string }) => {
      const targetSocket = await getUserSocket(to);
      if (!targetSocket) return;
      io.to(targetSocket).emit("receive_message", { from, message });
    });

    socket.on("disconnect", async () => {
      await removeSocket(socket.id);
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });

  return { io, server };
}
