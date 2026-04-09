import { startDmoRealtimeServer } from "@/services/dmo-service/realtime.server";

async function main() {
  const { io } = await startDmoRealtimeServer();
  console.log("[dmo-realtime] listening", { port: process.env.DMO_REALTIME_PORT ?? 5000 });

  io.on("connection", (socket) => {
    console.log("[dmo-realtime] connected", socket.id);
  });
}

main().catch((err) => {
  console.error("[dmo-realtime] startup failed", err);
  process.exit(1);
});
