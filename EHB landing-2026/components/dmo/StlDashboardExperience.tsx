"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NeonShell } from "@/components/dmo/stl-dashboard/NeonShell";
import { StlDashboardAiPanel } from "@/components/dmo/stl-dashboard/StlDashboardAiPanel";
import { StlDashboardHero } from "@/components/dmo/stl-dashboard/StlDashboardHero";
import { StlDashboardModuleGrid } from "@/components/dmo/stl-dashboard/StlDashboardModuleGrid";
import { StlDashboardPublicProfile } from "@/components/dmo/stl-dashboard/StlDashboardPublicProfile";
import { StlDashboardSidebar } from "@/components/dmo/stl-dashboard/StlDashboardSidebar";
import { STL_DASHBOARD_NAV } from "@/components/dmo/stl-dashboard/stlNav";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";
import { STL_DASHBOARD_DEMO } from "@/lib/dmo/stlDashboardDemo";
import {
  calculateSTL,
  canUpgradeStl,
  stlDashboardDemoToEngine,
} from "@/lib/dmo/stlDemoEngine";

type Props = {
  data?: StlDashboardDemo;
};

export function StlDashboardExperience({ data = STL_DASHBOARD_DEMO }: Props) {
  const d = data;
  const pathname = usePathname() ?? "";
  const engineShape = stlDashboardDemoToEngine(d);
  const modelScore = calculateSTL(engineShape);
  const upgradeBlocked = !canUpgradeStl(engineShape);

  return (
    <NeonShell>
      <div className="relative z-10 flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <StlDashboardSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">EHB STL LEVEL · Service Trust Level</p>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <StlDashboardHero data={d} modelScore={modelScore} upgradeBlocked={upgradeBlocked} />
            <StlDashboardAiPanel data={d} />
          </div>

          <StlDashboardModuleGrid data={d} />
          <StlDashboardPublicProfile data={d} />

          <p className="text-center text-[11px] text-ehb-textMuted">
            Demo UI — connect to <code className="rounded bg-white/10 px-1">GET /api/stl/me</code> and workflow services for live counts.
            Reference model: <code className="rounded bg-white/10 px-1">lib/dmo/stlDemoEngine.ts</code>
          </p>

          <div className="flex flex-wrap justify-center gap-2 border-t border-white/10 pt-4 lg:hidden">
            {STL_DASHBOARD_NAV.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] ${
                    active ? "bg-cyan-500/20 text-cyan-100" : "text-ehb-textMuted"
                  }`}
                >
                  <Icon className="h-3 w-3" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </NeonShell>
  );
}
