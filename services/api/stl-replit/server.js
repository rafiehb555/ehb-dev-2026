import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB, { dbState } from "./config/db.js";
import stlRoutes from "./routes/stlRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pssRoutes from "./routes/pssRoutes.js";
import crbRoutes from "./routes/crbRoutes.js";
import dmoRoutes from "./routes/dmoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import franchiseRoutes from "./routes/franchiseRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { sanitizeRequest } from "./middleware/sanitize.js";
import { startCrbEscalationWorker } from "./jobs/crbEscalationWorker.js";

dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
connectDB();

const app = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);
app.use(express.json());
app.use(sanitizeRequest);
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", stlRoutes);
app.use("/api", aiRoutes);
app.use("/api", taskRoutes);
app.use("/api", chatRoutes);
app.use("/api", userRoutes);
app.use("/api", pssRoutes);
app.use("/api", crbRoutes);
app.use("/api", dmoRoutes);
app.use("/api", uploadRoutes);
app.use("/api", logRoutes);
app.use("/api", notificationRoutes);
app.use("/api", franchiseRoutes);
app.use("/api", systemRoutes);
app.use("/api", earningRoutes);
app.use("/api", adminRoutes);

app.get("/", (_req, res) => {
  res.send("EHB STL Backend Running");
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "stl-replit-api",
    port: Number(process.env.PORT || 5000),
    db: {
      connected: dbState.connected,
      error: dbState.error,
      lastAttempt: dbState.lastAttempt,
    },
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  startCrbEscalationWorker();
  console.log(`Server running on port ${PORT}`);
});

