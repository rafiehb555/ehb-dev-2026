import { z } from "zod";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getAgentDetail } from "@/lib/agents/catalog";
import {
  appendAgentRuntimeHistory,
  completeAgentHandoff,
  createAgentHandoff,
  getAgentRuntimeSummary,
  listAgentRuntimeHandoffs,
  listAgentRuntimeStatuses,
  resetAgentRuntimeStore,
  setAllAgentsToWorking,
  updateAgentRuntimeStatus,
} from "@/lib/agents/runtimeStore";
import { requireSession } from "@/lib/rbac";
import { AgentPrioritySchema, AgentStatusSchema } from "@/lib/agents/schemas";

const UpdateStatusSchema = z.object({
  action: z.literal("update-status"),
  agentId: z.string().min(3),
  status: AgentStatusSchema,
  lastTask: z.string().min(3).max(200),
  queueSize: z.number().int().min(0).max(999).optional(),
  healthScore: z.number().int().min(0).max(100).optional(),
  historyTitle: z.string().min(3).max(160).optional(),
  historyDetail: z.string().min(3).max(300).optional(),
});

const AppendHistorySchema = z.object({
  action: z.literal("append-history"),
  agentId: z.string().min(3),
  status: AgentStatusSchema,
  title: z.string().min(3).max(160),
  detail: z.string().min(3).max(300),
});

const CreateHandoffSchema = z.object({
  action: z.literal("create-handoff"),
  fromAgentId: z.string().min(3),
  toAgentId: z.string().min(3),
  requestSummary: z.string().min(3).max(300),
  reason: z.string().min(3).max(400),
  expectedOutput: z.string().min(3).max(300),
  priority: AgentPrioritySchema.optional(),
});

const CompleteHandoffSchema = z.object({
  action: z.literal("complete-handoff"),
  handoffId: z.string().min(3),
});

const ResetRuntimeSchema = z.object({
  action: z.literal("reset-runtime"),
});

const SetAllWorkingSchema = z.object({
  action: z.literal("set-all-working"),
  lastTask: z.string().min(3).max(200).optional(),
});

const RuntimeMutationSchema = z.discriminatedUnion("action", [
  UpdateStatusSchema,
  AppendHistorySchema,
  CreateHandoffSchema,
  CompleteHandoffSchema,
  ResetRuntimeSchema,
  SetAllWorkingSchema,
]);

export async function GET() {
  const [summary, statuses, handoffs] = await Promise.all([
    getAgentRuntimeSummary(),
    listAgentRuntimeStatuses(),
    listAgentRuntimeHandoffs(),
  ]);

  return ok({ summary, statuses, handoffs });
}

export async function POST(req: Request) {
  const auth = await requireSession(["SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const payload = RuntimeMutationSchema.parse(await req.json());

    if ("agentId" in payload && !getAgentDetail(payload.agentId)) {
      return fail(404, "AGENT_NOT_FOUND", `No development agent found for '${payload.agentId}'.`);
    }

    if ("fromAgentId" in payload && !getAgentDetail(payload.fromAgentId)) {
      return fail(404, "AGENT_NOT_FOUND", `No development agent found for '${payload.fromAgentId}'.`);
    }

    if ("toAgentId" in payload && !getAgentDetail(payload.toAgentId)) {
      return fail(404, "AGENT_NOT_FOUND", `No development agent found for '${payload.toAgentId}'.`);
    }

    switch (payload.action) {
      case "update-status": {
        const status = await updateAgentRuntimeStatus({
          ...payload,
          actorId: auth.user.userId,
        });
        return ok({ status, message: "Agent runtime status updated." });
      }
      case "append-history": {
        const event = await appendAgentRuntimeHistory(payload);
        return ok({ event, message: "Agent runtime history event added." });
      }
      case "create-handoff": {
        const handoff = await createAgentHandoff({
          ...payload,
          triggeredById: auth.user.userId,
        });
        return ok({ handoff, message: "Agent handoff created." }, { status: 201 });
      }
      case "complete-handoff": {
        const handoff = await completeAgentHandoff({
          handoffId: payload.handoffId,
          actorId: auth.user.userId,
        });
        return ok({ handoff, message: "Agent handoff completed." });
      }
      case "reset-runtime": {
        const snapshot = await resetAgentRuntimeStore();
        return ok({ snapshot, message: "Agent runtime store reset to defaults." });
      }
      case "set-all-working": {
        const snapshot = await setAllAgentsToWorking({
          lastTask: payload.lastTask,
        });
        return ok({ snapshot, message: "All catalog agents set to working." });
      }
    }
  } catch (err) {
    return handleRouteError(err);
  }
}
