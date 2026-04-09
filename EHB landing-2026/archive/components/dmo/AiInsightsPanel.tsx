/** Archived - not used in production */

"use client";

export function AiInsightsPanel(props: {
  riskAlerts: string[];
  slaWarnings: string[];
  suggestions: string[];
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#041427]/90 to-[#03101f]/90 p-4 space-y-4 shadow-[0_16px_40px_rgba(2,8,23,0.55)]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#33C3FF]">AI Insights</h2>
        <span className="text-[11px] text-ehb-textMuted">Realtime</span>
      </div>

      <section className="rounded-xl border border-rose-400/25 bg-rose-500/10 p-3">
        <h3 className="text-xs font-semibold text-rose-100">Risk Alerts</h3>
        <ul className="mt-2 space-y-1 text-xs text-rose-100/90">
          {props.riskAlerts.length === 0 ? <li>No critical risk alerts.</li> : props.riskAlerts.map((x) => <li key={x}>• {x}</li>)}
        </ul>
      </section>

      <section className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3">
        <h3 className="text-xs font-semibold text-amber-100">SLA Warnings</h3>
        <ul className="mt-2 space-y-1 text-xs text-amber-100/90">
          {props.slaWarnings.length === 0 ? <li>No SLA breach warnings.</li> : props.slaWarnings.map((x) => <li key={x}>• {x}</li>)}
        </ul>
      </section>

      <section className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3">
        <h3 className="text-xs font-semibold text-cyan-100">AI Suggestions</h3>
        <ul className="mt-2 space-y-1 text-xs text-cyan-100/90">
          {props.suggestions.map((x) => (
            <li key={x}>• {x}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

