import { z } from "zod";

export const CRBApplicationTypeSchema = z.enum(["SKILL", "SERVICE", "PRODUCT", "COMPANY"]);
export type CRBApplicationType = z.infer<typeof CRBApplicationTypeSchema>;

export const CRBApplicationStatusSchema = z.enum(["SUBMITTED", "REVIEW", "INSPECTION", "APPROVED", "REJECTED"]);
export type CRBApplicationStatus = z.infer<typeof CRBApplicationStatusSchema>;

export const CRBDocumentTypeSchema = z.enum(["ID", "LICENSE", "PORTFOLIO", "EXPERIENCE", "OTHER"]);
export type CRBDocumentType = z.infer<typeof CRBDocumentTypeSchema>;

export const CRBInspectionStatusSchema = z.enum(["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"]);
export type CRBInspectionStatus = z.infer<typeof CRBInspectionStatusSchema>;

export const CreateCRBApplicationSchema = z.object({
  type: CRBApplicationTypeSchema,
  industry: z.string().min(2).max(120),
  notes: z.string().max(5000).optional(),
  documents: z
    .array(
      z.object({
        fileUrl: z.string().url(),
        type: CRBDocumentTypeSchema,
      })
    )
    .min(1)
    .max(25),
});

export const ListCRBApplicationsQuerySchema = z.object({
  status: CRBApplicationStatusSchema.optional(),
  type: CRBApplicationTypeSchema.optional(),
  query: z.string().trim().min(1).max(120).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const CRBIdParamsSchema = z.object({ id: z.string().cuid() });

export const PatchCRBApplicationSchema = z.object({
  status: CRBApplicationStatusSchema.optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export const AssignInspectionSchema = z.object({
  applicationId: z.string().cuid(),
  inspectorId: z.string().cuid(),
});

export const PatchInspectionSchema = z.object({
  status: CRBInspectionStatusSchema.optional(),
  report: z.string().max(20000).nullable().optional(),
  score: z.coerce.number().min(0).max(100).nullable().optional(),
});

export const IssueCertificateSchema = z.object({
  applicationId: z.string().cuid(),
  expiryDate: z.coerce.date(),
});

