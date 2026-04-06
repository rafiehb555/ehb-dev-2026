import { ok } from "@/lib/apiResponse";
import { listAgentRuntimeHandoffs, listAgentRuntimeStatuses, getAgentRuntimeSummary } from "@/lib/agents/runtimeStore";

export async function GET() {
  const [summary, statuses, handoffs] = await Promise.all([
    getAgentRuntimeSummary(),
    listAgentRuntimeStatuses(),
    listAgentRuntimeHandoffs(),
  ]);

  return ok({
    summary,
    statuses,
    handoffs,
  });
}
