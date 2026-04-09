"use client";

import useUI from "@/hooks/useUI";
import type { UiWidgetType } from "@/lib/ai/uiEngine";
import UpgradeCard from "@/components/dashboard/widgets/UpgradeCard";
import PSSCard from "@/components/dashboard/widgets/PSSCard";
import FranchiseCard from "@/components/dashboard/widgets/FranchiseCard";
import FraudAlertsCard from "@/components/dashboard/widgets/FraudAlertsCard";
import ApprovalsCard from "@/components/dashboard/widgets/ApprovalsCard";
import SystemStatsCard from "@/components/dashboard/widgets/SystemStatsCard";
import RefillCard from "@/components/dashboard/widgets/RefillCard";
import CrbPendingCard from "@/components/dashboard/widgets/CrbPendingCard";
import VipUpgradeCard from "@/components/dashboard/widgets/VipUpgradeCard";

function widgetNode(type: UiWidgetType) {
  switch (type) {
    case "VIP_UPGRADE":
      return <VipUpgradeCard />;
    case "PSS_REQUIRED":
      return <PSSCard />;
    case "CRB_PENDING":
      return <CrbPendingCard />;
    case "UPGRADE_READY":
      return <UpgradeCard />;
    case "REFILL":
      return <RefillCard />;
    case "FRANCHISE":
      return <FranchiseCard />;
    case "FRAUD_ALERTS":
      return <FraudAlertsCard />;
    case "PENDING_APPROVALS":
      return <ApprovalsCard />;
    case "SYSTEM_STATS":
      return <SystemStatsCard />;
    default:
      return null;
  }
}

export default function DynamicUI() {
  const { widgets, loading, error } = useUI();

  if (loading) return <div className="text-sm text-gray-300">Loading AI widgets...</div>;
  if (error) return <div className="text-sm text-amber-300">{error}</div>;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-300">AI Dynamic UI</h2>
        <span className="text-xs text-gray-400">{widgets.length} widgets</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {widgets.map((w) => (
          <div key={w.type}>{widgetNode(w.type)}</div>
        ))}
      </div>
    </section>
  );
}

