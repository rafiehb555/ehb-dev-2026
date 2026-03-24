import { z } from "zod";

export const ApplicationTypeSchema = z.enum([
  "PSS_VERIFICATION",
  "PSS",
  "PSS_REFILL",
  "CRB_CERTIFICATION",
  "INDUSTRY_VERIFICATION",
  "CRB",
  "SERVICE",
  "PRODUCT",
  "FRANCHISE",
  "OTHER",
]);
export type ApplicationType = z.infer<typeof ApplicationTypeSchema>;

export const ApplicationStatusSchema = z.enum(["NEW", "IN_REVIEW", "UNDER_INSPECTION", "APPROVED", "REJECTED"]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const ApprovalDecisionSchema = z.enum(["APPROVED", "REJECTED"]);
export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>;

export const CreateApplicationSchema = z.object({
  type: ApplicationTypeSchema,
  payload: z.unknown().optional(),
  assignedToId: z.string().cuid().optional(),
});

export const ListApplicationsQuerySchema = z.object({
  status: ApplicationStatusSchema.optional(),
  type: ApplicationTypeSchema.optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const PatchApplicationSchema = z.object({
  status: ApplicationStatusSchema.optional(),
  assignedToId: z.string().cuid().nullable().optional(),
});

export const DmoIdParamsSchema = z.object({ id: z.string().cuid() });

export const CreateApprovalSchema = z.object({
  applicationId: z.string().cuid(),
  decision: ApprovalDecisionSchema,
  notes: z.string().max(5000).optional(),
});

export const BulkApprovalSchema = z.object({
  applicationIds: z.array(z.string().cuid()).min(1).max(100),
  decision: ApprovalDecisionSchema,
  notes: z.string().max(5000).optional(),
});

export const ListApprovalsQuerySchema = z.object({
  applicationId: z.string().cuid().optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const ListRegistryQuerySchema = z.object({
  entityType: z.enum(["USER", "SERVICE", "PRODUCT", "COMPANY"]).optional(),
  status: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
  source: z.enum(["PSS", "CRB", "FRANCHISE", "MANUAL"]).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const ListAuditQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
  targetType: z.enum(["APPLICATION", "APPROVAL", "REGISTRY_RECORD", "PSS_VERIFICATION", "AUTOMATION_EVENT", "USER", "OTHER"]).optional(),
  targetId: z.string().optional(),
  applicationId: z.string().cuid().optional(),
});

