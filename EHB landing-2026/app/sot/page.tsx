import { ServicePlatformLanding } from "@/components/ServicePlatformLanding";

export default function SotPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return (
    <ServicePlatformLanding
      acronym="SOT"
      title="SOT — Service Operations & Training Platform"
      subtitle="Operational workflows and training that keep services consistent and verified."
      industrySlugForAi="hr"
      accentColor="#22C55E"
      locationQuery={searchParams}
      bullets={[
        "Training tasks and operations support for providers",
        "Verification renewals with refilling continuity signals",
        "Quality control feedback loops via DMO monitoring",
        "AI recommendations for the right next action",
      ]}
    />
  );
}

