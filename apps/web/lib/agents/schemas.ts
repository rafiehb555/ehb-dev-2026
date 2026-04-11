import { z } from "zod";

export const AgentGroupKeySchema = z.enum(["core", "domain", "advanced"]);

export const AgentStatusSchema = z.enum([
  "idle",
  "reading-context",
  "planning",
  "waiting-for-input",
  "working",
  "verifying",
  "blocked",
  "failed",
  "completed",
]);

export const AgentPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]);

export const AgentDefinitionSchema = z.object({
  id: z.string().min(3).max(120),
  group: AgentGroupKeySchema,
  summary: z.string().min(10).max(500),
  owner: z.string().min(3).max(120),
});

export const AgentGroupSchema = z.object({
  key: AgentGroupKeySchema,
  title: z.string().min(3).max(80),
  detail: z.string().min(3).max(200),
  agents: z.array(AgentDefinitionSchema).min(1),
});

export const AgentStatusInfoSchema = z.object({
  name: AgentStatusSchema,
  meaning: z.string().min(3).max(200),
});

export const AgentGuidanceCardSchema = z.object({
  title: z.string().min(3).max(80),
  body: z.string().min(10).max(300),
});

export const AgentChooserRecommendationSchema = z.object({
  id: z.string().min(3).max(120),
  category: z.enum(["planning", "flow", "operations", "franchise", "trust", "deploy"]),
  title: z.string().min(3).max(120),
  ownerNeed: z.string().min(8).max(300),
  primaryAgentId: z.string().min(3).max(120),
  supportingAgentIds: z.array(z.string().min(3).max(120)).min(1),
  reason: z.string().min(8).max(400),
});

export const AgentReferenceLinkSchema = z.object({
  label: z.string().min(3).max(120),
  path: z.string().min(1).max(300),
});

export const AgentDetailSchema = AgentDefinitionSchema.extend({
  purpose: z.string().min(10).max(500),
  whenToUse: z.array(z.string().min(3).max(250)).min(2),
  whenNotToUse: z.array(z.string().min(3).max(250)).min(1),
  outputs: z.array(z.string().min(3).max(250)).min(2),
  verification: z.array(z.string().min(3).max(250)).min(2),
  risks: z.array(z.string().min(3).max(250)).min(2),
  references: z.array(AgentReferenceLinkSchema).min(2),
  samplePrompts: z.array(z.string().min(8).max(250)).min(2),
});

export const AgentHandoffPayloadSchema = z.object({
  handoffId: z.string().min(3).max(120),
  correlationId: z.string().min(3).max(120),
  fromAgent: z.string().min(3).max(120),
  toAgent: z.string().min(3).max(120),
  requestSummary: z.string().min(3).max(500),
  reason: z.string().min(3).max(500),
  affectedPaths: z.array(z.string().min(1)).min(1),
  expectedOutput: z.string().min(3).max(500),
  verification: z.array(z.string().min(3).max(300)).min(1),
  priority: AgentPrioritySchema.default("NORMAL"),
  blockedBy: z.array(z.string().min(1).max(200)).default([]),
  memoryRefs: z.array(z.string().min(1).max(200)).default([]),
});

export const AgentLifecycleEventSchema = z.enum([
  "context.started",
  "plan.ready",
  "input.required",
  "work.started",
  "verify.started",
  "handoff.requested",
  "handoff.accepted",
  "handoff.returned",
  "task.completed",
  "task.failed",
  "task.blocked",
]);

export const AgentRuntimeModeSchema = z.enum(["mock", "live"]);

export const AgentRuntimeStatusSchema = z.object({
  agentId: z.string().min(3).max(120),
  status: AgentStatusSchema,
  queueSize: z.number().int().min(0).max(999),
  healthScore: z.number().int().min(0).max(100),
  lastTask: z.string().min(3).max(200),
  mode: AgentRuntimeModeSchema.default("mock"),
  lastUpdatedAt: z.string().datetime(),
  lastUpdatedLabel: z.string().min(3).max(80),
});

export const AgentRuntimeHistoryEventSchema = z.object({
  id: z.string().min(3).max(120),
  agentId: z.string().min(3).max(120),
  status: AgentStatusSchema,
  title: z.string().min(3).max(160),
  detail: z.string().min(3).max(300),
  occurredAt: z.string().datetime(),
  occurredAtLabel: z.string().min(3).max(80),
  mode: AgentRuntimeModeSchema.default("mock"),
});

export const AgentHandoffStatusSchema = z.enum(["accepted", "completed", "cancelled"]);

export const AgentHandoffRecordSchema = z.object({
  id: z.string().min(3).max(120),
  fromAgentId: z.string().min(3).max(120),
  toAgentId: z.string().min(3).max(120),
  requestSummary: z.string().min(3).max(300),
  reason: z.string().min(3).max(400),
  expectedOutput: z.string().min(3).max(300),
  priority: AgentPrioritySchema.default("NORMAL"),
  status: AgentHandoffStatusSchema.default("accepted"),
  triggeredById: z.string().min(3).max(120).nullable().default(null),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdAtLabel: z.string().min(3).max(80),
});

export const AgentRuntimeSnapshotSchema = z.object({
  statuses: z.array(AgentRuntimeStatusSchema),
  history: z.array(AgentRuntimeHistoryEventSchema),
  handoffs: z.array(AgentHandoffRecordSchema),
});

export const AgentRecommendationResultSchema = z.object({
  query: z.string().min(1).max(300),
  primaryAgentId: z.string().min(3).max(120),
  supportingAgentIds: z.array(z.string().min(3).max(120)).min(1),
  matchedScenarioIds: z.array(z.string().min(3).max(120)).default([]),
  reason: z.string().min(8).max(400),
});

export type AgentGroupKey = z.infer<typeof AgentGroupKeySchema>;
export type AgentStatus = z.infer<typeof AgentStatusSchema>;
export type AgentPriority = z.infer<typeof AgentPrioritySchema>;
export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;
export type AgentGroup = z.infer<typeof AgentGroupSchema>;
export type AgentStatusInfo = z.infer<typeof AgentStatusInfoSchema>;
export type AgentGuidanceCard = z.infer<typeof AgentGuidanceCardSchema>;
export type AgentChooserRecommendation = z.infer<typeof AgentChooserRecommendationSchema>;
export type AgentReferenceLink = z.infer<typeof AgentReferenceLinkSchema>;
export type AgentDetail = z.infer<typeof AgentDetailSchema>;
export type AgentHandoffPayload = z.infer<typeof AgentHandoffPayloadSchema>;
export type AgentLifecycleEvent = z.infer<typeof AgentLifecycleEventSchema>;
export type AgentRuntimeMode = z.infer<typeof AgentRuntimeModeSchema>;
export type AgentRuntimeStatus = z.infer<typeof AgentRuntimeStatusSchema>;
export type AgentRuntimeHistoryEvent = z.infer<typeof AgentRuntimeHistoryEventSchema>;
export type AgentHandoffStatus = z.infer<typeof AgentHandoffStatusSchema>;
export type AgentHandoffRecord = z.infer<typeof AgentHandoffRecordSchema>;
export type AgentRuntimeSnapshot = z.infer<typeof AgentRuntimeSnapshotSchema>;
export type AgentRecommendationResult = z.infer<typeof AgentRecommendationResultSchema>;
