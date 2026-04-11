import ActionCenter from "./ActionCenter";
import AdvancedData from "./AdvancedData";
import Factors from "./Factors";
import Hero from "./Hero";
import Modules from "./Modules";
import Snapshot from "./Snapshot";
import STLChart from "./STLChart";
import UpgradePath from "./UpgradePath";
import PageWrapper from "@/components/ui/PageWrapper";

export default function STLDashboard() {
  return (
    <PageWrapper>
      <div className="relative min-h-screen overflow-hidden bg-[#0B0F19] p-4 text-white md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.14),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.12),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6">
          <div className="lg:col-span-6">
            <Hero />
          </div>
          <div className="lg:col-span-6">
            <ActionCenter />
          </div>
          <div className="lg:col-span-6">
            <Snapshot />
          </div>
          <div className="lg:col-span-6">
            <UpgradePath />
          </div>
          <div className="lg:col-span-3">
            <Factors />
          </div>
          <div className="lg:col-span-3">
            <STLChart />
          </div>
          <div className="lg:col-span-6">
            <Modules />
          </div>
          <div className="lg:col-span-6">
            <AdvancedData />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

