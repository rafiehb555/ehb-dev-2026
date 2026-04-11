import { ServicePlatformLanding } from "@/components/ServicePlatformLanding";

export default function WmsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return (
    <ServicePlatformLanding
      acronym="WMS"
      title="WMS — Medical & Health Service Platform"
      subtitle="Medical services with trusted verification: identity checks, certification and secure payments."
      industrySlugForAi="health"
      accentColor="#29ABE2"
      locationQuery={searchParams}
      bullets={[
        "Patient intake and provider matching via AI",
        "Verification stack: PSS + CRB + STL",
        "Appointments, records and secure settlement flow",
        "Industry-first trust signals for safer bookings",
      ]}
    />
  );
}

