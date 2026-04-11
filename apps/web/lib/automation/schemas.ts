import { z } from "zod";

export const AutomationEventTypeSchema = z.enum([
  "PSS_VERIFIED",
  "DMO_APPROVED",
  "STL_UPDATED",
  "REFILL_EXPIRED",
]);

export const TriggerAutomationSchema = z.object({
  event: AutomationEventTypeSchema,
  data: z.record(z.string(), z.unknown()).optional(),
  correlationId: z.string().max(120).optional(),
});

export const ListAutomationEventsQuerySchema = z.object({
  event: AutomationEventTypeSchema.optional(),
  status: z.enum(["PENDING", "PROCESSING", "DONE", "FAILED", "DEAD_LETTER"]).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).max(5000).optional(),
});

export const UpsertAutomationRuleSchema = z.object({
  code: z.string().min(3).max(120),
  name: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  event: AutomationEventTypeSchema,
  active: z.boolean().default(true),
  priority: z.number().int().min(1).max(9999).default(100),
  conditions: z.record(z.string(), z.unknown()).optional(),
  actions: z.array(z.string()).min(1),
});

export type AutomationEventType = z.infer<typeof AutomationEventTypeSchema>;

