"use client";

export type PriorityTab = "ALL" | "HIGH_RISK" | "SLA_BREACH" | "NEW";

const tabs: Array<{ id: PriorityTab; label: string }> = [
  { id: "ALL", label: "All" },
  { id: "HIGH_RISK", label: "High Risk" },
  { id: "SLA_BREACH", label: "SLA Breach" },
  { id: "NEW", label: "New" },
];

export function PriorityQueueTabs(props: {
  value: PriorityTab;
  counts: Record<PriorityTab, number>;
  onChange: (tab: PriorityTab) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const active = props.value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => props.onChange(tab.id)}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
              active
                ? "bg-gradient-to-r from-[#00eaff] to-[#3b82f6] text-slate-950 btn-glow"
                : "glass-panel border border-white/15 text-slate-200 hover:bg-white/5",
            ].join(" ")}
          >
            <span>{tab.label}</span>
            <span className={active ? "text-slate-900/80" : "text-ehb-textMuted"}>{props.counts[tab.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

