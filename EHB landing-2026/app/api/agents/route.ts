import { ok } from "@/lib/apiResponse";
import {
  agentDashboardPurpose,
  agentDashboardSummary,
  agentDetails,
  agentGroups,
  agentGuidanceCards,
  agentHandoffOrder,
  agentLifecycleEvents,
  agentOwnershipHighlights,
  agentStatuses,
  agentWorkflowContractSummary,
} from "@/lib/agents/catalog";
import { readAgentRuntimeSnapshot, getAgentRuntimeSummary } from "@/lib/agents/runtimeStore";

export async function GET() {
  const runtimeSnapshot = await readAgentRuntimeSnapshot();
  const runtimeSummary = await getAgentRuntimeSummary();

  return ok({
    summary: agentDashboardSummary,
    groups: agentGroups,
    details: agentDetails,
    statuses: agentStatuses,
    runtime: {
      summary: runtimeSummary,
      statuses: runtimeSnapshot.statuses,
      handoffs: runtimeSnapshot.handoffs,
    },
    handoffOrder: agentHandoffOrder,
    guidanceCards: agentGuidanceCards,
    ownershipHighlights: agentOwnershipHighlights,
    dashboardPurpose: agentDashboardPurpose,
    lifecycleEvents: agentLifecycleEvents,
    workflowContract: agentWorkflowContractSummary,
  });
}
