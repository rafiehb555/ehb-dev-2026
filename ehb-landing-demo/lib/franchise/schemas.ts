import { z } from "zod";

export const FranchiseLevelSchema = z.enum(["SUB", "MASTER", "CORPORATE"]);
export type FranchiseLevel = z.infer<typeof FranchiseLevelSchema>;

export const InspectionTaskStatusSchema = z.enum(["ASSIGNED", "IN_PROGRESS", "COMPLETED", "ESCALATED"]);
export type InspectionTaskStatus = z.infer<typeof InspectionTaskStatusSchema>;

export const CreateInspectionTaskSchema = z.object({
  crbApplicationId: z.string().cuid(),
  dmoApplicationId: z.string().cuid().optional(),
  franchiseId: z.string().cuid(),
  inspectorId: z.string().cuid().optional(),
  dueDate: z.coerce.date(),
});

export const ListInspectionTasksQuerySchema = z.object({
  status: InspectionTaskStatusSchema.optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const TaskIdParamsSchema = z.object({ id: z.string().cuid() });

export const PatchInspectionTaskSchema = z.object({
  status: InspectionTaskStatusSchema.optional(),
});

export const SubmitInspectionReportSchema = z.object({
  taskId: z.string().cuid(),
  findings: z.string().min(10).max(20000),
  score: z.coerce.number().min(0).max(100),
  mediaUrls: z.array(z.string().url()).max(30).default([]),
  fraudSuspected: z.coerce.boolean().optional(),
  fraudNotes: z.string().max(20000).optional(),
  geo: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      accuracyM: z.number().min(0).max(5000).optional(),
      capturedAt: z.coerce.date().optional(),
    })
    .optional(),
  deviceHash: z.string().max(256).optional(),
});

export const CreateEscalationSchema = z.object({
  taskId: z.string().cuid(),
  level: z.enum(["SUB", "MASTER", "CORPORATE"]),
  reason: z.string().min(5).max(20000),
});

