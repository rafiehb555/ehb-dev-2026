import { z } from "zod";

export const updateUserSchema = z.object({
  userId: z.string().min(3),
  type: z.string().optional(),
  source: z.string().optional(),
});

export const pssVerificationSchema = z.object({
  kycVerified: z.boolean().optional(),
  idVerified: z.boolean().optional(),
  addressVerified: z.boolean().optional(),
  amlChecked: z.boolean().optional(),
  livenessPassed: z.boolean().optional(),
  complaints: z.number().int().min(0).optional(),
  verificationPending: z.number().int().min(0).optional(),
});

export const crbApplicationSchema = z.object({
  assignedLevel: z.enum(["sub", "master", "corporate", "company"]).optional(),
  documents: z.array(z.string()).optional(),
});

export const crbApprovalSchema = z.object({
  approved: z.boolean(),
  examsPassedDelta: z.number().int().optional(),
  examsFailedDelta: z.number().int().optional(),
});

export const dmoActivitySchema = z.object({
  ordersDelta: z.number().optional(),
  refillsDelta: z.number().optional(),
  behaviorScoreDelta: z.number().optional(),
});

