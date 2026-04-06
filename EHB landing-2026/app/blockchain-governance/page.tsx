import { BlockchainGovernanceLanding } from "@/components/BlockchainGovernanceLanding";

export default function BlockchainGovernancePage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  return <BlockchainGovernanceLanding locationQuery={searchParams} />;
}

