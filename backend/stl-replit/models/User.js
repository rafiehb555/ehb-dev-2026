import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    type: {
      type: String,
      default: "seller",
    },
    source: {
      type: String,
      default: "signup",
    },
    pssScore: {
      type: Number,
      default: 0,
    },
    crbScore: {
      type: Number,
      default: 0,
    },
    dmoScore: {
      type: Number,
      default: 0,
    },
    lockAmount: {
      type: Number,
      default: 0,
    },
    stlScore: Number,
    stlLevel: String,
    aiInsight: {
      risk: String,
      trustAdjustment: Number,
      reason: String,
      updatedAt: Date,
    },
    stlLogs: [
      {
        action: String,
        before: Number,
        after: Number,
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    modules: {
      pss: {
        kycVerified: Boolean,
        idVerified: Boolean,
        addressVerified: Boolean,
        amlChecked: Boolean,
        livenessPassed: Boolean,
        complaints: Number,
        verificationPending: Number,
        trustScore: Number,
        score: Number,
      },
      crb: {
        examsPassed: Number,
        examsFailed: Number,
        visitsCompleted: Number,
        score: Number,
        application: {
          status: String,
          currentStage: String,
          documents: [String],
          submittedAt: Date,
          updatedAt: Date,
          lastEscalatedAt: Date,
          timeline: [
            {
              stage: String,
              status: String,
              timestamp: Date,
              note: String,
            },
          ],
          escalationHistory: [
            {
              fromStage: String,
              toStage: String,
              timestamp: Date,
              reason: String,
            },
          ],
          approvalTimes: {
            sub: Date,
            master: Date,
            corporate: Date,
            company: Date,
          },
        },
      },
      dmo: {
        activityLevel: String,
        orders: Number,
        refills: Number,
        behaviorScore: Number,
        score: Number,
      },
      franchise: {
        connected: Boolean,
        coverage: String,
        score: Number,
      },
    },
    earnings: {
      today: Number,
      monthly: Number,
      total: Number,
    },
    wallet: {
      mainBalance: {
        type: Number,
        default: 0,
      },
      earningBalance: {
        type: Number,
        default: 0,
      },
      lockWallet: {
        type: Number,
        default: 0,
      },
      frozen: {
        type: Boolean,
        default: false,
      },
    },
    earningsLogs: [
      {
        orderAmount: Number,
        userLevel: Number,
        commissionPercent: Number,
        commissionAmount: Number,
        distribution: {
          platform: Number,
          seller: Number,
          franchise: Number,
          referral: Number,
        },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    growth: {
      referrals: Number,
      earnings: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);

