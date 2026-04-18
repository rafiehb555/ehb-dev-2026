"use client";

import { useState } from "react";

export type RuleOperator = "gte" | "lte" | "eq" | "between";
export type RuleAction = "auto_approve" | "route_franchise" | "route_crb" | "reject";

export type PlatformRule = {
  id: string;
  priority: number;
  name: string;
  operator: RuleOperator;
  threshold: number;
  thresholdMax?: number;
  action: RuleAction;
  stlLevel?: number;
  active: boolean;
};

const actionMeta: Record<RuleAction, { label: string; cls: string }> = {
  auto_approve: { label: "Auto-approve", cls: "text-[#2BBFA0] bg-[#2BBFA0]/15 border-[#2BBFA0]/30" },
  route_franchise: { label: "→ Franchise", cls: "text-[#F0A030] bg-[#F0A030]/15 border-[#F0A030]/30" },
  route_crb: { label: "→ CRB", cls: "text-[#29ABE2] bg-[#29ABE2]/15 border-[#29ABE2]/30" },
  reject: { label: "Reject", cls: "text-[#F05858] bg-[#F05858]/15 border-[#F05858]/30" },
};

const opLabel: Record<RuleOperator, string> = {
  gte: "≥",
  lte: "≤",
  eq: "=",
  between: "between",
};

export function RuleBuilder({ initial = [] }: { initial?: PlatformRule[] }) {
  const [rules, setRules] = useState(initial);

  const toggle = (id: string) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  return (
    <div className="space-y-2">
      {rules.map((r) => (
        <div
          key={r.id}
          className={`grid grid-cols-[80px_1fr_1.4fr_140px_90px_60px] items-center gap-3 rounded-xl border bg-[#1A1D33] p-3 text-xs transition ${
            r.active ? "border-white/[0.08]" : "border-white/[0.04] opacity-60"
          }`}
        >
          <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-center text-[10px] font-semibold text-[#8A8FAE]">
            P{r.priority}
          </span>
          <code className="rounded bg-[#7B6EF6]/10 px-2 py-0.5 text-[11px] text-[#A098F8]">{r.name}</code>
          <span className="text-[#E7E9F5]">
            criteria_met {opLabel[r.operator]} <b>{r.threshold}</b>
            {r.operator === "between" && r.thresholdMax != null && <> &ndash; {r.thresholdMax}</>}
          </span>
          <span className={`rounded-md border px-2 py-1 text-center text-[10px] font-semibold ${actionMeta[r.action].cls}`}>
            {actionMeta[r.action].label}
            {r.stlLevel != null && <> · L{r.stlLevel}</>}
          </span>
          <button
            onClick={() => toggle(r.id)}
            className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${
              r.active
                ? "border-[#38C878]/40 bg-[#38C878]/10 text-[#38C878]"
                : "border-white/[0.08] bg-white/[0.04] text-[#8A8FAE]"
            }`}
          >
            {r.active ? "ACTIVE" : "OFF"}
          </button>
          <button className="text-[#8A8FAE] hover:text-[#E7E9F5]">Edit</button>
        </div>
      ))}
      <button className="w-full rounded-xl border border-dashed border-white/[0.12] bg-transparent p-3 text-xs text-[#8A8FAE] transition hover:border-[#7B6EF6]/60 hover:text-[#A098F8]">
        + Add new rule
      </button>
    </div>
  );
}
