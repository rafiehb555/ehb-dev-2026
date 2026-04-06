import { ok } from "@/lib/apiResponse";
import { agentChooserCategories, agentChooserRecommendations } from "@/lib/agents/catalog";

export async function GET() {
  return ok({
    categories: agentChooserCategories,
    recommendations: agentChooserRecommendations,
  });
}
