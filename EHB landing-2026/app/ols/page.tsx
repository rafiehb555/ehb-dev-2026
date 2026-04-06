import { ServicePlatformLanding } from "@/components/ServicePlatformLanding";

export default function OlsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return (
    <ServicePlatformLanding
      acronym="OLS"
      title="OLS — Legal Services Service Platform"
      subtitle="Legal help with verified professionals, clear trust layers, and secure documentation."
      industrySlugForAi="law"
      accentColor="#6B7280"
      locationQuery={searchParams}
      bullets={[
        "AI document drafting and compliance support",
        "Verification stack: PSS + CRB + STL level trust",
        "Case file organization and secure settlement guidance",
        "Transparent outcomes with trust badge meaning",
      ]}
    />
  );
}

