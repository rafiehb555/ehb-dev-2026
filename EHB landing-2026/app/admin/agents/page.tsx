import {
  agentChooserCategories,
  agentChooserRecommendations,
  agentDashboardPurpose,
  agentDashboardSummary,
  agentGroups,
  agentGuidanceCards,
  agentHandoffOrder,
  agentOwnershipHighlights,
  agentStatuses,
  agentWorkflowContractSummary,
} from "@/lib/agents/catalog";
import AgentControlClient from "@/components/admin/AgentControlClient";

export default function AdminAgentsPage() {
  return (
    <AgentControlClient
      chooserCategories={agentChooserCategories}
      chooserRecommendations={agentChooserRecommendations}
      dashboardPurpose={agentDashboardPurpose}
      dashboardSummary={agentDashboardSummary}
      groups={agentGroups}
      guidanceCards={agentGuidanceCards}
      handoffOrder={agentHandoffOrder}
      ownershipHighlights={agentOwnershipHighlights}
      statuses={agentStatuses}
      workflowContract={agentWorkflowContractSummary}
    />
  );
}
