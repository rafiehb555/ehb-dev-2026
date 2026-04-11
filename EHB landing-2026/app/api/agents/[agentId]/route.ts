import { fail, ok } from "@/lib/apiResponse";
import {
  getAgentDetail,
  getAgentHandoffTimeline,
  getAgentNeighbors,
} from "@/lib/agents/catalog";
import { getAgentRuntimeHandoffs, getAgentRuntimeHistory, getAgentRuntimeStatus } from "@/lib/agents/runtimeStore";

type RouteContext = {
  params: {
    agentId: string;
  };
};

export async function GET(_req: Request, context: RouteContext) {
  const agent = getAgentDetail(context.params.agentId);

  if (!agent) {
    return fail(404, "AGENT_NOT_FOUND", `No development agent found for '${context.params.agentId}'.`);
  }

  return ok({
    agent,
    runtime: await getAgentRuntimeStatus(agent.id),
    runtimeHistory: await getAgentRuntimeHistory(agent.id),
    handoffs: await getAgentRuntimeHandoffs(agent.id),
    neighbors: getAgentNeighbors(agent.id),
    handoffTimeline: getAgentHandoffTimeline(agent.id),
  });
}
