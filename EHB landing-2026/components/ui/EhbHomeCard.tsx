import { KpiCard } from "./KpiCard";

export function EhbHomeCard() {
  return (
    <div className="glass-panel card-hover p-3 sm:p-4">
      <div className="text-[10px] xs:text-[11px] font-semibold text-[#00eaff] mb-0.5">
        EHB Home · Control Center
      </div>
      <div className="text-xs sm:text-sm font-semibold text-white mb-1">
        Manage industries, trust systems, wallet & AI tools from one place.
      </div>
      <p className="text-[10px] xs:text-[11px] text-ehb-textBody mb-2">
        Central dashboard connecting DMO, PSS, CRB, STL, Wallet and Affiliate program – built to
        scale 32+ industries with shared tools.
      </p>
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
        <KpiCard label="Core Layers" value="5" detail="DMO · PSS · CRB · STL · Wallet" />
        <KpiCard label="Growth Engines" value="2" detail="Franchise · Affiliate" />
        <KpiCard label="Industries" value="32+" detail="Connected via shared marketplace" />
      </div>
    </div>
  );
}
