import { GlobalExpansionLanding } from "@/components/GlobalExpansionLanding";

export default function GlobalPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return <GlobalExpansionLanding locationQuery={searchParams} />;
}

