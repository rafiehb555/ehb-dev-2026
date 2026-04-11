import { ServicePlatformLanding } from "@/components/ServicePlatformLanding";

export default function HpsPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return (
    <ServicePlatformLanding
      acronym="HPS"
      title="HPS — Education & Learning Service Platform"
      subtitle="Verified learning services with progress, records, and secure engagement."
      industrySlugForAi="education"
      accentColor="#E53935"
      locationQuery={searchParams}
      bullets={[
        "AI learning paths and verified tutoring workflows",
        "Verification: PSS + CRB + STL trust score levels",
        "Progress tracking and record-based trust continuity",
        "Secure marketplace interactions with DMO monitoring",
      ]}
    />
  );
}

