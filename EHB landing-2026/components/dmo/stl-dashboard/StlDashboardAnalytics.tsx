"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

function SparkArea({ values }: { values: number[] }) {
  const w = 200;
  const h = 48;
  const max = 100;
  const min = 0;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const line = pts.join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full text-cyan-400/90" preserveAspectRatio="none">
      <defs>
        <linearGradient id="stlSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </linearGradient>
      </defs>
      <polygon fill="url(#stlSparkFill)" points={area} />
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" points={line} />
    </svg>
  );
}

export function StlDashboardAnalytics({ snapshot }: { snapshot?: StlFullSnapshot | null }) {
  const spark = snapshot
    ? [
        Math.max(0, snapshot.trustScore - 20),
        Math.max(0, snapshot.trustScore - 14),
        Math.max(0, snapshot.trustScore - 10),
        Math.max(0, snapshot.trustScore - 6),
        Math.max(0, snapshot.trustScore - 3),
        snapshot.trustScore,
      ]
    : [42, 48, 45, 55, 52, 61, 58, 72, 68, 78];
  const successPct = snapshot ? Math.round((snapshot.crb.totalVerifications / Math.max(1, snapshot.crb.requiredVerifications)) * 100) : 94;
  const complaintsPct = snapshot ? Math.round((snapshot.complaints.count / Math.max(1, snapshot.complaints.limit)) * 100) : 2;

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md sm:p-5"
      aria-label="Performance analytics"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-400" aria-hidden />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/90">Performance</p>
            <p className="text-sm text-ehb-textBody">Trust performance, completion, and complaint ratio</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          <TrendingUp className="h-3 w-3" aria-hidden />
          {snapshot ? `${snapshot.progress.percent}% to next level` : "+12% vs last month"}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
          <p className="text-[10px] uppercase text-ehb-textMuted">Orders</p>
          <p className="text-lg font-bold text-white">{snapshot ? snapshot.trustScore : 128}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
          <p className="text-[10px] uppercase text-ehb-textMuted">Success</p>
          <p className="text-lg font-bold text-emerald-300">{successPct}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-center">
          <p className="text-[10px] uppercase text-ehb-textMuted">Complaints</p>
          <p className="text-lg font-bold text-amber-200">{complaintsPct}%</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-cyan-500/15 bg-black/30 p-2">
        <SparkArea values={spark} />
        <p className="mt-1 text-center text-[10px] text-ehb-textMuted">Trust activity</p>
      </div>
    </section>
  );
}
