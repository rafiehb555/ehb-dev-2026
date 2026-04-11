import { AIToolsSection } from "@/components/AIToolsSection";
import { RoadmapPhasesSection } from "@/components/RoadmapPhasesSection";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";

export function UniversalStructuredAdminBlocks() {
  return (
    <div className="space-y-6">
      <TrustBadgeLegend />
      <STLLevelsAndSecurity />
      <AIToolsSection />
      <RoadmapPhasesSection />
    </div>
  );
}

