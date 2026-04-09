import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logEvent } from "../services/logService.js";

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  return jwt.sign(
    { userId: user.userId, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export const signup = async (req, res) => {
  const { userId, email, password, role = "user", type = "seller", source = "signup" } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { userId }] });
  if (exists) return res.status(409).json({ msg: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    userId,
    email,
    passwordHash,
    role,
    type,
    source,
    pssScore: 20,
    crbScore: 10,
    dmoScore: 20,
    lockAmount: 0,
    stlScore: 0,
    stlLevel: "L1",
    stlLogs: [],
    modules: {
      pss: {
        kycVerified: false,
        idVerified: false,
        addressVerified: false,
        amlChecked: false,
        livenessPassed: false,
        complaints: 0,
        verificationPending: 1,
        trustScore: 20,
        score: 20,
      },
      crb: {
        examsPassed: 0,
        examsFailed: 0,
        visitsCompleted: 0,
        score: 10,
        application: {
          status: "pending",
          currentStage: "sub",
          documents: [],
          submittedAt: null,
          updatedAt: null,
          timeline: [],
          escalationHistory: [],
          approvalTimes: {},
        },
      },
      dmo: { activityLevel: "low", orders: 0, refills: 0, behaviorScore: 50, score: 20 },
      franchise: { connected: false, coverage: "none", score: 0 },
    },
    earnings: { today: 0, monthly: 0, total: 0 },
    wallet: { mainBalance: 0, earningBalance: 0, lockWallet: 0, frozen: false },
    earningsLogs: [],
    growth: { referrals: 0, earnings: 0 },
  });

  await logEvent({ userId: user.userId, event: "AUTH_SIGNUP", entity: "user", meta: { role: user.role } });
  const token = signToken(user);
  return res.status(201).json({ token, user: { userId: user.userId, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash || "");
  if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

  await logEvent({ userId: user.userId, event: "AUTH_LOGIN", entity: "user" });
  const token = signToken(user);
  return res.json({ token, user: { userId: user.userId, email: user.email, role: user.role } });
};

