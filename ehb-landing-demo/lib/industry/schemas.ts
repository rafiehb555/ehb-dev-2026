import { z } from "zod";

export const VerifiableEntityTypeSchema = z.enum(["SERVICE", "PRODUCT", "COMPANY"]);
export type VerifiableEntityType = z.infer<typeof VerifiableEntityTypeSchema>;

export const IndustryVerificationStatusSchema = z.enum(["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]);
export type IndustryVerificationStatus = z.infer<typeof IndustryVerificationStatusSchema>;

export const ListIndustriesQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const AttachIndustriesSchema = z.object({
  entityType: VerifiableEntityTypeSchema,
  entityId: z.string().cuid(),
  industryIds: z.array(z.string().cuid()).min(1).max(32),
});

export const CreateIndustryVerificationSchema = z.object({
  entityType: VerifiableEntityTypeSchema,
  entityId: z.string().cuid(),
  industryId: z.string().cuid(),
  weight: z.coerce.number().min(0.1).max(5).optional(),
  expiryDate: z.coerce.date().optional(), // default handled server-side
});

export const ApproveIndustryVerificationSchema = z.object({
  id: z.string().cuid(),
  status: IndustryVerificationStatusSchema,
  score: z.coerce.number().min(0).max(100).optional(),
  expiryDate: z.coerce.date().optional(),
});

export const IndustryVerifySchema = z.union([
  z.object({
    mode: z.literal("REQUEST").optional(),
    entityType: VerifiableEntityTypeSchema,
    entityId: z.string().cuid(),
    industryId: z.string().cuid(),
    weight: z.coerce.number().min(0.1).max(5).optional(),
    expiryDate: z.coerce.date().optional(),
  }),
  z.object({
    mode: z.literal("DECISION"),
    verificationId: z.string().cuid(),
    status: z.enum(["VERIFIED", "REJECTED"]),
    score: z.coerce.number().min(0).max(100).optional(),
    expiryDate: z.coerce.date().optional(),
  }),
]);

