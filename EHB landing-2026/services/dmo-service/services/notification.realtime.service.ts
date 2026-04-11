import type { Server as SocketIOServer } from "socket.io";
import { getUserSocket } from "@/services/dmo-service/utils/socketStore";

export async function sendNotificationRealtime(io: SocketIOServer, userId: string, message: string) {
  const socketId = await getUserSocket(userId);
  if (!socketId) return;
  io.to(socketId).emit("notification", { message });
}
