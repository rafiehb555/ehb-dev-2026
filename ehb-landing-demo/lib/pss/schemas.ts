import { z } from "zod";

export const PssCaseStatusSchema = z.enum(["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"]);
export const PssRiskSchema = z.enum(["low", "medium", "high"]);
export const PssStepSchema = z.enum(["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK", "FINAL_DECISION"]);
export const PssStepDecisionSchema = z.enum(["APPROVED", "REJECTED"]);

export const ListPssCasesQuerySchema = z.object({
  status: PssCaseStatusSchema.optional(),
  risk: PssRiskSchema.optional(),
  query: z.string().trim().min(1).max(120).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const VerifyPssStepSchema = z.object({
  caseId: z.string().cuid(),
  step: PssStepSchema.exclude(["FINAL_DECISION"]),
  status: PssStepDecisionSchema,
  riskLevel: PssRiskSchema.optional(),
  notes: z.string().max(5000).optional(),
});

export const PssDecisionSchema = z.object({
  caseId: z.string().cuid(),
  decision: PssStepDecisionSchema,
  notes: z.string().max(5000).optional(),
});

export const PssCaseIdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const PssRiskCalculateSchema = z.object({
  caseId: z.string().cuid(),
});

export const PssFraudCheckSchema = z.object({
  caseId: z.string().cuid(),
});

export type PssStep = z.infer<typeof PssStepSchema>;
export type PssStepDecision = z.infer<typeof PssStepDecisionSchema>;

