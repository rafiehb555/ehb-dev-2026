import EarningsOverview from "@/components/monetization/EarningsOverview";
import IncomeGraph from "@/components/monetization/IncomeGraph";
import IncomeSources from "@/components/monetization/IncomeSources";
import UpgradeOpportunities from "@/components/monetization/UpgradeOpportunities";
import WalletCard from "@/components/monetization/WalletCard";

export default function MonetizationSection() {
  return (
    <section className="space-y-4">
      <EarningsOverview />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="lg:col-span-3">
          <WalletCard />
        </div>
        <div className="lg:col-span-3">
          <IncomeGraph />
        </div>
      </div>
      <IncomeSources />
      <UpgradeOpportunities />
    </section>
  );
}

