import { ServicePlatformLanding } from "@/components/ServicePlatformLanding";

export default function AgtsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return (
    <ServicePlatformLanding
      acronym="AGTS"
      title="AGTS — Travel & Tourism Service Platform"
      subtitle="Travel bookings that stay verified: providers, payments, and trust are aligned end-to-end."
      industrySlugForAi="travel"
      accentColor="#0EA5E9"
      locationQuery={searchParams}
      bullets={[
        "AI-assisted itinerary and matching for travelers",
        "Provider verification: PSS identity + CRB business checks",
        "Secure payment and trust-confirmed confirmations",
        "Marketplace-ready listings with STL trust levels",
      ]}
    />
  );
}

