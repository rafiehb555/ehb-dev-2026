/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DMO STL — Consolidated ALL-STL page
 *  One page, every STL concept. For DMO / Admin operators.
 *
 *  Sections:
 *    1. Hero              — what STL is, in 3 lines
 *    2. Levels L0 → L8    — 9 cards with color, band, perks
 *    3. Formula           — master MIN-rule + input bands (PSS/CRB/DMO)
 *    4. 4 STL types       — PSS-STL / CRB-STL / DMO-STL / EHB-STL
 *    5. Coin lock tiers   — lock → level boost mapping
 *    6. Live preview      — STLUserCard rendered at every level
 * ═══════════════════════════════════════════════════════════════════════
 */

import { STLUserCard } from "@/components/stl/STLUserCard";

export const metadata = {
  title: "DMO STL — All STL on one page | EHB",
  description: "Consolidated DMO STL reference: levels, formula, 4 STL types, coin-lock tiers, and live preview cards.",
};

const STL_LEVELS = [
  { lvl: 0, key: "FREE",        color: "#9CA3AF", band: "0 – 9",     perks: "View-only. No commerce." },
  { lvl: 1, key: "BASIC",       color: "#60A5FA", band: "10 – 24",   perks: "Can transact, low limits." },
  { lvl: 2, key: "NORMAL",      color: "#22B14C", band: "25 – 39",   perks: "Standard commerce, full product listing." },
  { lvl: 3, key: "HIGH",        color: "#F59E0B", band: "40 – 54",   perks: "Priority search rank, higher escrow." },
  { lvl: 4, key: "VIP",         color: "#F97316", band: "55 – 69",   perks: "Featured placement, advanced analytics." },
  { lvl: 5, key: "ULTRA",       color: "#EC4899", band: "70 – 79",   perks: "Global visibility, white-glove support." },
  { lvl: 6, key: "DIAMOND",     color: "#A855F7", band: "80 – 87",   perks: "On-chain proof, auto-refill, concierge." },
  { lvl: 7, key: "PLATINUM",    color: "#7B6EF6", band: "88 – 94",   perks: "Franchise-tier trust, revenue boost." },
  { lvl: 8, key: "SUPREME",     color: "#29ABE2", band: "95 – 100",  perks: "Top 0.1%. Institutional-grade trust." },
] as const;

const STL_TYPES = [
  {
    code: "PSS-STL",
    name: "Personal Security System STL",
    color: "#22B14C",
    desc: "Identity trust — KYC + liveness + AML risk. Max L4 on identity alone.",
    capLevel: 4,
  },
  {
    code: "CRB-STL",
    name: "Certification & Registry Board STL",
    color: "#F59E0B",
    desc: "Physical + legal verification. Certification hash pushed on-chain. Max L6.",
    capLevel: 6,
  },
  {
    code: "DMO-STL",
    name: "DMO Governance STL",
    color: "#7B6EF6",
    desc: "Admin policy bonus. Approved onboarding + franchise + compliance. Max L7.",
    capLevel: 7,
  },
  {
    code: "EHB-STL",
    name: "EHB Master STL (shipped)",
    color: "#29ABE2",
    desc: "Final STL = MIN(PSS, CRB, DMO, Coin-Lock tier). This is the one the user sees.",
    capLevel: 8,
  },
] as const;

const COIN_LOCK_TIERS = [
  { tier: "None",       months: 0,  boost: "—",   cap: 3 },
  { tier: "Bronze",     months: 3,  boost: "+1",  cap: 4 },
  { tier: "Silver",     months: 6,  boost: "+2",  cap: 5 },
  { tier: "Gold",       months: 12, boost: "+3",  cap: 6 },
  { tier: "Platinum",   months: 24, boost: "+4",  cap: 7 },
  { tier: "Supreme",    months: 36, boost: "+5",  cap: 8 },
] as const;

const FORMULA_INPUTS = [
  { label: "Identity (PSS)",    w: 30, color: "#22B14C" },
  { label: "Certification (CRB)", w: 25, color: "#F59E0B" },
  { label: "DMO Governance",    w: 20, color: "#7B6EF6" },
  { label: "Coin Lock",         w: 15, color: "#29ABE2" },
  { label: "Activity Score",    w: 10, color: "#EC4899" },
] as const;

export default function DmoStlPage() {
  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(41,171,226,0.12) 0%, rgba(19,22,42,0.95) 50%, rgba(123,110,246,0.12) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "#29ABE2" }}
          />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              DMO · Verification
            </div>
            <h1 className="mt-1 text-3xl font-bold">DMO STL — All STL on One Page</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/65">
              Service Trust Level (STL) is the single trust number every user, seller, franchise,
              and service provider carries across all 32 EHB industries. It's computed from PSS
              (identity), CRB (certification), DMO governance, coin-lock, and activity — then
              capped by the <b>MIN-rule</b>. This page is your one-stop reference.
            </p>
          </div>
        </section>

        {/* ── LEVELS ───────────────────────────────────────────── */}
        <section id="levels">
          <SectionHeader eyebrow="L0 → L8" title="The 9 STL Levels" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STL_LEVELS.map((l) => (
              <div
                key={l.lvl}
                className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(19,22,42,0.85)",
                  border: `1px solid ${l.color}40`,
                  boxShadow: `0 8px 24px ${l.color}12`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
                    style={{ background: `${l.color}22`, color: l.color, border: `1px solid ${l.color}66` }}
                  >
                    L{l.lvl}
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: `${l.color}18`, color: l.color, border: `1px solid ${l.color}55` }}
                  >
                    {l.band}
                  </span>
                </div>
                <div className="mt-3 text-[18px] font-bold" style={{ color: l.color }}>
                  {l.key}
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{l.perks}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FORMULA ──────────────────────────────────────────── */}
        <section id="formula">
          <SectionHeader eyebrow="Master Rule" title="STL Formula & Inputs" />
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="rounded-xl p-4 font-mono text-[13px] leading-relaxed"
              style={{ background: "rgba(8,10,20,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-white/40">// EHB STL = MIN of all gates</span>
              <br />
              <span className="text-[#29ABE2]">STL</span> =
              MIN(
              <span className="text-[#22B14C]">pssLevel</span>,
              <span className="text-[#F59E0B]">crbLevel</span>,
              <span className="text-[#7B6EF6]">dmoLevel</span>,
              <span className="text-[#29ABE2]">coinLockTier</span>
              )
              <br />
              <span className="text-white/40">// score = weighted sum of 5 inputs below</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {FORMULA_INPUTS.map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(26,29,51,0.9)", border: `1px solid ${f.color}30` }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: f.color }}>
                    {f.label}
                  </div>
                  <div className="mt-2 text-2xl font-bold">{f.w}%</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${f.w * 3}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 STL TYPES ──────────────────────────────────────── */}
        <section id="types">
          <SectionHeader eyebrow="Four STL types" title="PSS · CRB · DMO · EHB" />
          <div className="grid gap-3 md:grid-cols-2">
            {STL_TYPES.map((t) => (
              <div
                key={t.code}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(19,22,42,0.85)",
                  border: `1px solid ${t.color}40`,
                  boxShadow: `0 8px 20px ${t.color}10`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
                    style={{ background: `${t.color}1a`, color: t.color, border: `1px solid ${t.color}55` }}
                  >
                    {t.code}
                  </span>
                  <span className="text-[11px] text-white/40">Cap: L{t.capLevel}</span>
                </div>
                <div className="mt-3 text-[16px] font-semibold">{t.name}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COIN LOCK ────────────────────────────────────────── */}
        <section id="coin-lock">
          <SectionHeader eyebrow="Stake to boost" title="Coin Lock Tiers" />
          <div
            className="overflow-hidden rounded-2xl"
            style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-white/45">
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3">Lock duration</th>
                  <th className="px-5 py-3">Level boost</th>
                  <th className="px-5 py-3">Max STL cap</th>
                </tr>
              </thead>
              <tbody>
                {COIN_LOCK_TIERS.map((t, i) => (
                  <tr
                    key={t.tier}
                    className="border-t border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-semibold">{t.tier}</td>
                    <td className="px-5 py-3 text-white/60">{t.months === 0 ? "—" : `${t.months} months`}</td>
                    <td className="px-5 py-3">
                      <span
                        className="rounded px-2 py-0.5 text-[11px] font-bold"
                        style={{ background: "rgba(41,171,226,0.12)", color: "#29ABE2" }}
                      >
                        {t.boost}
                      </span>
                    </td>
                    <td className="px-5 py-3">L{t.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── LIVE PREVIEW ─────────────────────────────────────── */}
        <section id="preview">
          <SectionHeader eyebrow="Live" title="STLUserCard — Rendered at Every Level" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STL_LEVELS.map((l) => (
              <STLUserCard
                key={l.lvl}
                variant="compact"
                name={`Sample ${l.key}`}
                email={`${l.key.toLowerCase()}@ehb.com`}
                stlLevel={l.lvl}
                stlScore={Number(l.band.split("–")[1]?.trim() ?? l.band) - 1}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
        {eyebrow}
      </div>
      <h2 className="mt-0.5 text-xl font-bold text-white">{title}</h2>
    </div>
  );
}
