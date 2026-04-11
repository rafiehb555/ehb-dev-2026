import { fail, ok } from "@/lib/apiResponse";
import { getAgentDetail } from "@/lib/agents/catalog";
import { getAgentRuntimeHistory, getAgentRuntimeHandoffs } from "@/lib/agents/runtimeStore";

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
    agentId: agent.id,
    history: await getAgentRuntimeHistory(agent.id),
    handoffs: await getAgentRuntimeHandoffs(agent.id),
  });
}
