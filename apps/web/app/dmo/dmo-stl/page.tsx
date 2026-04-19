"use client";

/**
 * DMO STL — Consolidated reference page (V2 — 10-level system)
 * All STL concepts on one page for DMO operators.
 *
 * Sections:
 *   1. Hero            — what STL is
 *   2. Levels L1→L10   — 10+1 cards (L0 pre-level + L1-L10)
 *   3. Formula         — composite PSS×0.4 + CRB×0.3 + DMO×0.3, MIN-cap
 *   4. 5 Entity Types  — Personal, Product, Service, Franchise, Production
 *   5. Token Lock      — EHBGC lock per level
 *   6. Source Caps     — Auto→L5, Franchise→L8, CRB→L9, DMO→L10
 */

const STL_LEVELS = [
  { lvl: 0, key: "PRE-LEVEL", color: "#555A78", band: "—",        lock: 0,     resp: "0%",   perks: "Browse only. No commerce. Not in system." },
  { lvl: 1, key: "FREE",      color: "#9CA3AF", band: "1 – 10",   lock: 0,     resp: "10%",  perks: "Email verified. Basic browse + limited actions." },
  { lvl: 2, key: "BASIC",     color: "#60A5FA", band: "11 – 20",  lock: 50,    resp: "20%",  perks: "Can transact, low limits." },
  { lvl: 3, key: "NORMAL",    color: "#38C878", band: "21 – 35",  lock: 100,   resp: "40%",  perks: "Standard commerce, full product listing." },
  { lvl: 4, key: "STANDARD",  color: "#2BBFA0", band: "36 – 50",  lock: 250,   resp: "55%",  perks: "Extended features, moderate escrow." },
  { lvl: 5, key: "ADVANCED",  color: "#F0A030", band: "51 – 65",  lock: 500,   resp: "70%",  perks: "Priority search, advanced analytics. Auto-cap." },
  { lvl: 6, key: "HIGH",      color: "#F97316", band: "66 – 75",  lock: 1000,  resp: "80%",  perks: "Featured placement, white-glove support." },
  { lvl: 7, key: "PRO",       color: "#EC4899", band: "76 – 85",  lock: 2500,  resp: "90%",  perks: "Top Ranking zone. Global visibility." },
  { lvl: 8, key: "VIP",       color: "#A855F7", band: "86 – 92",  lock: 5000,  resp: "95%",  perks: "On-chain proof, auto-refill, concierge." },
  { lvl: 9, key: "ELITE",     color: "#7B6EF6", band: "93 – 97",  lock: 10000, resp: "98%",  perks: "Franchise-tier trust, revenue boost." },
  { lvl: 10, key: "SUPREME",  color: "#2BBFA0", band: "98 – 100", lock: 25000, resp: "100%", perks: "Top 0.1%. Full EHB backing. Institutional trust." },
] as const;

const ENTITY_TYPES = [
  { code: "Personal",    color: "#38C878", desc: "User's own trust level. Master key — if low, all others freeze.", icon: "👤" },
  { code: "Product",     color: "#F0A030", desc: "Each product has its own STL. MIN-chained to seller STL.", icon: "📦" },
  { code: "Service",     color: "#7B6EF6", desc: "Service provider trust. Covers professional services (legal, medical, etc.).", icon: "🔧" },
  { code: "Franchise",   color: "#2BBFA0", desc: "Franchise entity STL. Country→Corporate→Sub→City→Online hierarchy.", icon: "🏢" },
  { code: "Production",  color: "#EC4899", desc: "Production company STL. Manufacturing + quality verification.", icon: "🏭" },
] as const;

const SOURCE_CAPS = [
  { source: "Auto (System)", cap: "L5 ADVANCED", color: "#F0A030", desc: "Maximum level achievable through automated verification only" },
  { source: "Franchise",     cap: "L8 VIP",      color: "#A855F7", desc: "Franchise-approved users can reach up to L8" },
  { source: "CRB",           cap: "L9 ELITE",    color: "#7B6EF6", desc: "CRB certification unlocks up to L9" },
  { source: "DMO",           cap: "L10 SUPREME",  color: "#2BBFA0", desc: "Only DMO full approval can grant L10" },
] as const;

export default function DmoStlPage() {
  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(43,191,160,0.12) 0%, rgba(19,22,42,0.95) 50%, rgba(123,110,246,0.12) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "#7B6EF6" }}
          />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              DMO · Verification · Complete Reference
            </div>
            <h1 className="mt-1 text-3xl font-bold">DMO STL — All-in-One Reference</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">
              Service Trust Level (STL) is the single trust number every user, seller, franchise,
              and entity carries across all EHB industries. Composite of <b>PSS × 0.4 + CRB × 0.3 + DMO × 0.3</b>,
              capped by the <b>MIN-rule</b>. 10 levels (L1–L10) + L0 pre-level. 5 entity types.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["#levels", "#formula", "#entities", "#token-lock", "#source-caps"].map((a) => (
                <a
                  key={a}
                  href={a}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 transition hover:border-[#7B6EF6]/40 hover:text-white"
                >
                  {a.replace("#", "").replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUICK STATS ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total Levels", value: "11", sub: "L0 + L1–L10", color: "#7B6EF6" },
            { label: "Entity Types", value: "5", sub: "Personal · Product · Service · Franchise · Production", color: "#2BBFA0" },
            { label: "Top Ranking", value: "L7+", sub: "PRO / VIP / ELITE / SUPREME", color: "#F0A030" },
            { label: "Components", value: "3", sub: "PSS 40% · CRB 30% · DMO 30%", color: "#38C878" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.08] bg-[#13162A] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</div>
              <div className="mt-1 text-2xl font-bold">{s.value}</div>
              <div className="mt-1 text-[10px] text-white/45">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── LEVELS L0–L10 ────────────────────────────────────── */}
        <section id="levels">
          <Hdr eyebrow="L0 → L10" title="The 10+1 STL Levels" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STL_LEVELS.map((l) => (
              <div
                key={l.lvl}
                className="rounded-xl p-5 transition-all hover:-translate-y-0.5"
                style={{
                  background: l.lvl === 0 ? "rgba(19,22,42,0.6)" : "rgba(19,22,42,0.85)",
                  border: `1px solid ${l.color}40`,
                  boxShadow: l.lvl >= 7 ? `0 0 20px ${l.color}25` : `0 8px 24px ${l.color}10`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ background: `${l.color}22`, color: l.color, border: `1px solid ${l.color}55` }}
                  >
                    L{l.lvl}
                  </div>
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: `${l.color}15`, color: l.color, border: `1px solid ${l.color}40` }}
                  >
                    {l.band}
                  </span>
                </div>
                <div className="mt-3 text-lg font-bold" style={{ color: l.color }}>
                  {l.key}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{l.perks}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
                  <span>🔒 {l.lock.toLocaleString()} EHBGC</span>
                  <span>🛡️ {l.resp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FORMULA ──────────────────────────────────────────── */}
        <section id="formula">
          <Hdr eyebrow="Composite Rule" title="STL Formula" />
          <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-6">
            <div
              className="rounded-lg p-4 font-mono text-sm leading-relaxed"
              style={{ background: "rgba(12,14,26,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-white/40">{"// Step 1: Weighted composite"}</div>
              <div>
                <span className="text-[#7B6EF6]">Score</span> ={" "}
                <span className="text-[#38C878]">PSS</span> × <span className="text-[#F0A030]">0.40</span> +{" "}
                <span className="text-[#F0A030]">CRB</span> × <span className="text-[#F0A030]">0.30</span> +{" "}
                <span className="text-[#2BBFA0]">DMO</span> × <span className="text-[#F0A030]">0.30</span>
              </div>
              <br />
              <div className="text-white/40">{"// Step 2: Anti-fraud MIN-cap"}</div>
              <div>
                <span className="text-[#7B6EF6]">Final_STL</span> ={" "}
                <span className="text-[#F05858]">MIN</span>(Score, lowest_component + 1)
              </div>
              <br />
              <div className="text-white/40">{"// Step 3: MIN-chain (multi-entity)"}</div>
              <div>
                <span className="text-[#7B6EF6]">FINAL_EHB_STL</span> ={" "}
                <span className="text-[#F05858]">MIN</span>(productSTL, sellerSTL, companySTL, ownerSTL)
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "PSS (Identity)", weight: 40, color: "#38C878" },
                { label: "CRB (Quality)",  weight: 30, color: "#F0A030" },
                { label: "DMO (Behavior)", weight: 30, color: "#2BBFA0" },
              ].map((f) => (
                <div key={f.label} className="rounded-lg border border-white/[0.06] bg-[#1A1D33] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: f.color }}>{f.label}</div>
                  <div className="mt-2 text-3xl font-bold">{f.weight}%</div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.weight}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 ENTITY TYPES ───────────────────────────────────── */}
        <section id="entities">
          <Hdr eyebrow="5 Entity Types" title="STL applies to multiple entity types" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ENTITY_TYPES.map((t) => (
              <div
                key={t.code}
                className="rounded-xl border p-5 transition hover:-translate-y-0.5"
                style={{ background: "rgba(19,22,42,0.85)", borderColor: `${t.color}35` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.code}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOKEN LOCK ───────────────────────────────────────── */}
        <section id="token-lock">
          <Hdr eyebrow="EHBGC Lock" title="Token Lock Requirements by Level" />
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-white/40">
                  <th className="px-5 py-3">Level</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">EHBGC Lock</th>
                  <th className="px-5 py-3">EHB Responsibility</th>
                </tr>
              </thead>
              <tbody>
                {STL_LEVELS.map((l) => (
                  <tr key={l.lvl} className="border-t border-white/5 transition hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5">
                      <span className="font-mono text-xs font-bold" style={{ color: l.color }}>L{l.lvl}</span>
                    </td>
                    <td className="px-5 py-2.5 font-semibold" style={{ color: l.color }}>{l.key}</td>
                    <td className="px-5 py-2.5 font-mono text-white/70">{l.lock.toLocaleString()}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-[#2BBFA0]" style={{ width: l.resp }} />
                        </div>
                        <span className="text-xs text-white/60">{l.resp}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SOURCE CAPS ──────────────────────────────────────── */}
        <section id="source-caps">
          <Hdr eyebrow="Verification Source" title="Maximum Level by Source" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SOURCE_CAPS.map((s) => (
              <div
                key={s.source}
                className="rounded-xl border p-5 transition hover:-translate-y-0.5"
                style={{ background: "rgba(19,22,42,0.85)", borderColor: `${s.color}40` }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{s.source}</div>
                <div className="mt-2 text-xl font-bold" style={{ color: s.color }}>{s.cap}</div>
                <p className="mt-2 text-[11px] text-white/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DOWNGRADE RULES ──────────────────────────────────── */}
        <section>
          <Hdr eyebrow="Enforcement" title="Downgrade Rules" />
          <div className="space-y-2">
            {[
              { rule: "Fraud Detected", effect: "Instant drop to L0", color: "#F05858", icon: "🚨" },
              { rule: "3 Complaints + 3 Weeks", effect: "-2 STL Levels", color: "#F0A030", icon: "⚠️" },
              { rule: "Inactivity (30 days)", effect: "-1 Level per month", color: "#F0A030", icon: "💤" },
              { rule: "Document Expiry", effect: "-2 Levels", color: "#F05858", icon: "📄" },
              { rule: "Token Lock Removed", effect: "-2 Levels after 15-day grace", color: "#F0A030", icon: "🔓" },
            ].map((r) => (
              <div
                key={r.rule}
                className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-[#1A1D33] px-5 py-3"
              >
                <span className="text-lg">{r.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.rule}</div>
                </div>
                <span className="rounded-md px-2.5 py-1 text-xs font-semibold" style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}40` }}>
                  {r.effect}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

function Hdr({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{eyebrow}</div>
      <h2 className="mt-0.5 text-xl font-bold">{title}</h2>
    </div>
  );
}
