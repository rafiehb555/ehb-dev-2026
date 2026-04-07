"use client";

import Link from "next/link";
import { StlDashboardExperience } from "@/components/dmo/StlDashboardExperience";
import { StlMetaJsonPanel } from "@/components/dmo/StlMetaJsonPanel";
import {
  crbCertBoost,
  dmoStlPanelTools,
  ecosystemLinks,
  EHB_STL_DOC_VERSION,
  gosellrSellerTiers,
  jpsStlMultiplier,
  pssStlImpact,
  stlAccessRows,
  stlCardDisplayRules,
  stlFormulaLines,
  stlLevels,
} from "@/lib/dmo/ehbStlLevelContent";

export default function EhbStlLevelPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-6">
        <StlDashboardExperience />

        <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/90 to-[#020b18]/90 p-5 shadow-[0_0_32px_rgba(34,211,238,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2 max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">EHB-DMO · Trust infrastructure</p>
              <h1 className="text-xl font-semibold gradient-text md:text-2xl">
                EHB-STL-LEVEL <span className="text-ehb-textBody font-normal">(Service Trust Level)</span>
              </h1>
              <p className="text-sm text-ehb-textBody leading-relaxed">
                AI-driven reputation engine: har <strong className="text-cyan-100/90">USER</strong>,{" "}
                <strong className="text-cyan-100/90">SERVICE</strong>, aur <strong className="text-cyan-100/90">PRODUCT</strong> ko{" "}
                <strong className="text-white">0–100</strong> trust score milta hai. Neeche master plan reference (formulas, tables) — operational
                engine <Link href="/dmo/stl" className="text-cyan-300 underline-offset-2 hover:underline">STL operations</Link> par.
              </p>
              <div className="flex flex-wrap gap-2 pt-1" aria-label="STL levels L1 to L5">
                {stlLevels.map((row) => (
                  <span
                    key={row.level}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] shadow-sm"
                    style={{ borderColor: `${row.color}55` }}
                    title={row.label}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full ring-1 ring-white/20" style={{ backgroundColor: row.color }} />
                    <span className="font-semibold text-white">{row.level}</span>
                    <span className="text-ehb-textMuted">{row.score}</span>
                    <span className="hidden sm:inline text-ehb-textMuted" aria-hidden="true">
                      {row.icon}
                    </span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-ehb-textMuted">
                Source alignment: <code className="rounded bg-white/10 px-1.5 py-0.5 text-ehb-textBody">EHB_MASTER_SYSTEM_PLAN.md</code> §7 · Document
                v{EHB_STL_DOC_VERSION} (living doc). Pehle &quot;v7.0&quot; naam se files refer ho sakti thin; repo mein ab{" "}
                <strong className="text-ehb-textBody">v{EHB_STL_DOC_VERSION}</strong> active hai. JSON:{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-ehb-textBody">GET /api/stl/meta</code>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/dmo/stl" className="ehb-btn-primary ehb-press">
                Open STL engine
              </Link>
              <Link href="/dmo" className="ehb-btn-secondary ehb-press">
                DMO home
              </Link>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Technical reference</p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <section className="ehb-card-elevated space-y-4">
          <h2 className="text-sm font-semibold text-white">Score formula (0–100)</h2>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 text-[11px] leading-relaxed text-cyan-100/90 font-mono">
            {`EHB-STL-LEVEL Score (0–100) =
  PSS Score      (0–40)   → Identity verification layers
  CRB Score      (0–20)   → Physical certification
  Performance    (0–20)   → Orders, services completed
  Behavior       (-50–20) → Fraud signals, inspection results
  Industries     (0–20)   → Multi-industry verification boost
  Refilling      (-40–10) → Re-verification status`}
          </pre>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-3 py-2 text-left">Component</th>
                  <th className="px-3 py-2 text-left">Range</th>
                  <th className="px-3 py-2 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {stlFormulaLines.map((row) => (
                  <tr key={row.component} className="border-t border-white/10">
                    <td className="px-3 py-2 font-medium text-white">{row.component}</td>
                    <td className="px-3 py-2 text-cyan-200/90">{row.range}</td>
                    <td className="px-3 py-2 text-ehb-textBody">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ehb-card-elevated space-y-4">
          <h2 className="text-sm font-semibold text-white">5 levels</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-3 py-2 text-left">Level</th>
                  <th className="px-3 py-2 text-left">Score</th>
                  <th className="px-3 py-2 text-left">Label</th>
                  <th className="px-3 py-2 text-left">Icon</th>
                  <th className="px-3 py-2 text-left">Color</th>
                </tr>
              </thead>
              <tbody>
                {stlLevels.map((row) => (
                  <tr key={row.level} className="border-t border-white/10">
                    <td className="px-3 py-2 font-semibold">{row.level}</td>
                    <td className="px-3 py-2">{row.score}</td>
                    <td className="px-3 py-2 text-ehb-textBody">{row.label}</td>
                    <td className="px-3 py-2">{row.icon}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: row.color }} />
                        <code className="text-[11px] text-ehb-textMuted">{row.color}</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ehb-card-elevated space-y-4">
          <h2 className="text-sm font-semibold text-white">STL → access control</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs text-center">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-2 py-2 text-left">Feature</th>
                  <th className="px-2 py-2">L1</th>
                  <th className="px-2 py-2">L2</th>
                  <th className="px-2 py-2">L3</th>
                  <th className="px-2 py-2">L4</th>
                  <th className="px-2 py-2">L5</th>
                </tr>
              </thead>
              <tbody>
                {stlAccessRows.map((row) => (
                  <tr key={row.feature} className="border-t border-white/10">
                    <td className="px-2 py-2 text-left font-medium text-white">{row.feature}</td>
                    <td className="px-2 py-2">{row.l1}</td>
                    <td className="px-2 py-2">{row.l2}</td>
                    <td className="px-2 py-2">{row.l3}</td>
                    <td className="px-2 py-2">{row.l4}</td>
                    <td className="px-2 py-2">{row.l5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="ehb-card-elevated space-y-3">
            <h2 className="text-sm font-semibold text-white">EHB-PSS → STL impact</h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-white/5 text-ehb-textBody">
                  <tr>
                    <th className="px-3 py-2 text-left">PSS phase</th>
                    <th className="px-3 py-2 text-left">STL boost</th>
                  </tr>
                </thead>
                <tbody>
                  {pssStlImpact.map((r) => (
                    <tr key={r.phase} className="border-t border-white/10">
                      <td className="px-3 py-2">{r.phase}</td>
                      <td className="px-3 py-2 text-emerald-200/90">{r.boost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/dmo/pss" className="inline-flex text-xs text-cyan-300 hover:underline">
              Open EHB-PSS panel →
            </Link>
          </section>

          <section className="ehb-card-elevated space-y-3">
            <h2 className="text-sm font-semibold text-white">EHB-CRB certificate → STL boost</h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-white/5 text-ehb-textBody">
                  <tr>
                    <th className="px-3 py-2 text-left">Level</th>
                    <th className="px-3 py-2 text-left">STL boost</th>
                    <th className="px-3 py-2 text-left">Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {crbCertBoost.map((r) => (
                    <tr key={r.level} className="border-t border-white/10">
                      <td className="px-3 py-2">{r.level}</td>
                      <td className="px-3 py-2 text-emerald-200/90">{r.stlBoost}</td>
                      <td className="px-3 py-2 text-ehb-textBody">{r.eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/dmo/crb" className="inline-flex text-xs text-cyan-300 hover:underline">
              Open EHB-CRB panel →
            </Link>
          </section>
        </div>

        <section className="ehb-card-elevated space-y-3">
          <h2 className="text-sm font-semibold text-white">EHB-JPS — STL salary multiplier</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-3 py-2 text-left">STL level</th>
                  <th className="px-3 py-2 text-left">Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {jpsStlMultiplier.map((r) => (
                  <tr key={r.stlLevel} className="border-t border-white/10">
                    <td className="px-3 py-2">{r.stlLevel}</td>
                    <td className="px-3 py-2 text-amber-200/90">{r.multiplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-ehb-textMuted">
            AI matching mein bhi STL weight hota hai (skills, experience ke sath).{" "}
            <Link href="/dmo/jps/profiles" className="text-cyan-300 hover:underline">
              JPS workspace
            </Link>
          </p>
        </section>

        <section className="ehb-card-elevated space-y-3">
          <h2 className="text-sm font-semibold text-white">GoSellr GSM — seller tier vs STL minimum</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-3 py-2 text-left">Tier</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">STL min</th>
                </tr>
              </thead>
              <tbody>
                {gosellrSellerTiers.map((r) => (
                  <tr key={r.tier} className="border-t border-white/10">
                    <td className="px-3 py-2 font-medium">{r.tier}</td>
                    <td className="px-3 py-2 text-ehb-textBody">{r.type}</td>
                    <td className="px-3 py-2 text-violet-200/90">{r.stlMin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ehb-card-elevated space-y-3">
          <h2 className="text-sm font-semibold text-white">DMO — EHB-STL-LEVEL panel (planned controls)</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-ehb-textBody">
            {dmoStlPanelTools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="text-[11px] text-ehb-textMuted">
            Governance: har DMO action ke liye reason; high-risk actions ke liye propose → senior confirm; audit logs immutable (master plan §17).
          </p>
          <Link href="/dmo/stl" className="inline-flex text-xs text-cyan-300 hover:underline">
            Current demo: manual calculate + tables →
          </Link>
        </section>

        <section className="ehb-card-elevated space-y-3">
          <h2 className="text-sm font-semibold text-white">Cards & surfaces — STL display rules</h2>
          <ul className="space-y-2">
            {stlCardDisplayRules.map((rule) => (
              <li key={rule} className="flex gap-2 text-sm text-ehb-textBody">
                <span className="text-cyan-400">▸</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ehb-card-elevated space-y-4">
          <h2 className="text-sm font-semibold text-white">Cross-module links (departments & industries)</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ecosystemLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <div className="text-xs font-semibold text-white group-hover:text-cyan-100">
                  {item.label}{" "}
                  <span className="font-normal text-ehb-textMuted">— {item.short}</span>
                </div>
                <p className="mt-1 text-[11px] text-ehb-textBody leading-relaxed">{item.note}</p>
              </Link>
            ))}
          </div>
        </section>

        <StlMetaJsonPanel />

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-white">System flow (trust stack)</h2>
          <pre className="mt-3 overflow-x-auto text-[11px] leading-relaxed text-ehb-textBody font-mono whitespace-pre-wrap">
            {`Register → EHB-PSS (identity) → EHB-STL-LEVEL (starting L1) → optional EHB-CRB →
live orders/work → STL recalc → EHB-EHW (wallet) → refilling / 6-month review →
EHB-EAP / staking / EHB-BRS (where applicable)`}
          </pre>
        </section>
      </div>
    </main>
  );
}
