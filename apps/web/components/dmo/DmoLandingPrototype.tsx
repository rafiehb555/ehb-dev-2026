"use client";

/**
 * DmoLandingPrototype — Phase 9 silver-chrome landing rebuild (2026-04-11).
 *
 * Why this exists
 *   The live `/dmo` landing page (`apps/web/app/dmo/page.tsx`) uses the
 *   Phase 7 "cinematic" dark gradient theme and is wired to live `useSTL`
 *   data. That page is intentionally untouched — when the design is
 *   approved, a later sprint will migrate it with live wiring.
 *
 *   This component is the silver-chrome + neumorphism 3D *prototype*
 *   version of the landing, matching `DmoPrototypeWorkspace.tsx` (v1.9 /
 *   v1.10 / v1.11 of the design system). It uses inline mock data only
 *   and never calls the API. Mounted at `/dmo/preview` so Rafi can
 *   compare both in the same session.
 *
 * Anatomy
 *   1. Hero card (NEU_CARD) with group chip, headline, 4-up KPI tiles
 *   2. Verification Trinity (PSS / CRB / STL) — 3 cards with ring gauge +
 *      checklist + tone-mapped status chips
 *   3. Intelligence row — 4 cards (AI copilot · Blockchain · Franchise ·
 *      Activity)
 *   4. Earnings + benefits — 2-column (earnings bars + STL benefits)
 *   5. Module rail — 18 canonical DMO modules grouped 4 ways
 *
 * Scope
 *   DESIGN ONLY — no API calls, no hooks other than `useMemo` for grouping,
 *   no writes. Every action button is a non-wired `<Link>`.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  DMO_NAV_GROUPS,
  DMO_NAV_SECTIONS,
  groupDmoSections,
} from "@/components/dmo/navigation";
import {
  NEU_CARD,
  NEU_INSET,
  NEU_SMALL,
  TONE_BG,
  TONE_BORDER,
  TONE_FG,
  TONE_GLOW_HEX,
  type Tone,
} from "@/components/dmo/_shared/neumorphism";

// ───────────────────────────────────────────────────────────────────────
//  Shared atoms
// ───────────────────────────────────────────────────────────────────────

function Chip({ label, tone = "slate" }: { label: string; tone?: Tone }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
        TONE_BG[tone],
        TONE_BORDER[tone],
        TONE_FG[tone],
      ].join(" ")}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

function RingGauge({
  value,
  max = 100,
  tone = "purple",
  size = 88,
  label,
  sub,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  size?: number;
  label?: string;
  sub?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const glow = TONE_GLOW_HEX[tone];
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={glow}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          fill="none"
          style={{ filter: `drop-shadow(0 0 6px ${glow}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={["text-[15px] font-bold leading-none", TONE_FG[tone]].join(
            " ",
          )}
        >
          {label ?? value}
        </div>
        {sub && (
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone = "purple",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4" style={NEU_INSET}>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl opacity-50"
        style={{
          background: `radial-gradient(circle, ${TONE_GLOW_HEX[tone]}40, transparent 65%)`,
        }}
      />
      <div className="relative">
        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
          {label}
        </div>
        <div
          className={[
            "mt-1.5 text-[22px] font-bold leading-none",
            TONE_FG[tone],
          ].join(" ")}
        >
          {value}
        </div>
        {sub && (
          <div className="mt-1 text-[10px] text-white/55">{sub}</div>
        )}
      </div>
    </div>
  );
}

function ChecklistRow({
  label,
  detail,
  ok,
}: {
  label: string;
  detail: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={NEU_SMALL}>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={[
            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
            ok
              ? "border-[#38C878]/50 bg-[#38C878]/15 text-[#38C878]"
              : "border-[#F0A030]/50 bg-[#F0A030]/15 text-[#F0A030]",
          ].join(" ")}
        >
          {ok ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg> : "·"}
        </span>
        <span className="truncate text-[11px] font-medium text-white/85">{label}</span>
      </div>
      <span
        className={[
          "text-[10px] font-semibold",
          ok ? "text-[#38C878]" : "text-[#F0A030]",
        ].join(" ")}
      >
        {detail}
      </span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, right }: { eyebrow: string; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
          {eyebrow}
        </div>
        <div className="mt-0.5 text-[15px] font-semibold text-white">
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Accent visuals (compact for the landing)
// ───────────────────────────────────────────────────────────────────────

function EarningsBars() {
  const bars = [42, 58, 49, 71, 65, 82, 74];
  const max = Math.max(...bars);
  return (
    <div className="rounded-xl p-4" style={NEU_INSET}>
      <div className="flex items-end justify-between gap-2">
        {bars.map((b, i) => {
          const h = (b / max) * 80;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${h}px`,
                  background: "linear-gradient(180deg, #F0A030 0%, #7B6EF6 100%)",
                  boxShadow: "0 0 12px rgba(240,160,48,0.35)",
                }}
              />
              <div className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Mock data for the prototype (no useSTL wiring)
// ───────────────────────────────────────────────────────────────────────

const MOCK = {
  name: "EHB Operator",
  stlLevel: 4,
  levelName: "PREMIUM",
  nextLevelName: "GOLD",
  trustScore: 78,
  progressPct: 62,
  kycStatus: "VERIFIED",
  complaints: 2,
  complaintLimit: 8,
  crbVerifications: 3,
  requiredVerifications: 4,
  examsPassed: 3,
  requiredExams: 4,
  refills: 3,
  requiredRefills: 4,
  franchiseVerified: 12,
  franchisePending: 3,
  aiGuide:
    "3 trust tasks align hain — PSS liveness, CRB documents, aur refill schedule on-time rakhen.",
};

// ───────────────────────────────────────────────────────────────────────
//  Main component
// ───────────────────────────────────────────────────────────────────────

export function DmoLandingPrototype() {
  const grouped = useMemo(() => groupDmoSections(DMO_NAV_SECTIONS), []);

  const stlHealthy = MOCK.trustScore >= 70;
  const pssHealthy = MOCK.kycStatus === "VERIFIED" && MOCK.complaints < MOCK.complaintLimit - 2;
  const crbHealthy = MOCK.crbVerifications >= MOCK.requiredVerifications - 1;

  return (
    <main className="relative min-h-screen text-white">
      <div className="container-ehb py-6">
        <div className="space-y-5">
          {/* ══════════════════════════════════════════════════════
              1. HERO CARD
              ══════════════════════════════════════════════════════ */}
          <header className="relative overflow-hidden rounded-2xl p-6" style={NEU_CARD}>
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-60"
              style={{
                background: `radial-gradient(circle, ${TONE_GLOW_HEX.purple}33, transparent 60%)`,
              }}
            />
            <div
              className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full blur-3xl opacity-40"
              style={{
                background: `radial-gradient(circle, ${TONE_GLOW_HEX.teal}33, transparent 60%)`,
              }}
            />

            <div className="relative">
              {/* Eyebrow */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Chip label="DMO · Mission Control" tone="purple" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Phase 9 · Silver Chrome Prototype
                  </span>
                </div>
                <Chip label="Live · v9 preview" tone="teal" />
              </div>

              {/* Headline */}
              <div className="mt-3 flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={NEU_SMALL}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A098F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                </div>
                <div className="min-w-0">
                  <h1 className="text-[26px] font-bold tracking-tight text-white md:text-[32px]">
                    Mission control for{" "}
                    <span className="bg-gradient-to-r from-[#A098F8] via-[#7B6EF6] to-[#2BBFA0] bg-clip-text text-transparent">
                      EHB&apos;s 32 industries.
                    </span>
                  </h1>
                  <p className="mt-1 max-w-2xl text-[12px] text-white/60">
                    Welcome back, {MOCK.name}. Service Trust L{MOCK.stlLevel} {MOCK.levelName} ·
                    PSS KYC {MOCK.kycStatus} · CRB {MOCK.crbVerifications}/{MOCK.requiredVerifications} verified.
                    Anti-fraud MIN rule enforces truth across product, seller, company, aur owner scores.
                  </p>
                </div>
              </div>

              {/* 4-up KPI grid */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <KpiTile
                  label="STL Trust Score"
                  value={`${MOCK.trustScore}/100`}
                  sub={`L${MOCK.stlLevel} ${MOCK.levelName} · next → ${MOCK.nextLevelName}`}
                  tone="purple"
                />
                <KpiTile
                  label="PSS KYC"
                  value={MOCK.kycStatus}
                  sub={`Liveness · AML · ${MOCK.complaints}/${MOCK.complaintLimit} complaints`}
                  tone="teal"
                />
                <KpiTile
                  label="CRB Verifications"
                  value={`${MOCK.crbVerifications}/${MOCK.requiredVerifications}`}
                  sub={`Docs · exam ${MOCK.examsPassed}/${MOCK.requiredExams}`}
                  tone="green"
                />
                <KpiTile
                  label="DMO Refill"
                  value={`${MOCK.refills}/${MOCK.requiredRefills}`}
                  sub={`${MOCK.franchiseVerified} franchise · ${MOCK.franchisePending} pending`}
                  tone="amber"
                />
              </div>

              {/* AI copilot ribbon */}
              <Link
                href="/dmo/ai-assistant"
                className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:brightness-110"
                style={NEU_SMALL}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #A098F8, #7B6EF6 55%, #2BBFA0)",
                    boxShadow: "0 0 18px rgba(123,110,246,0.5)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A098F8]">
                    AI Copilot · Mission Brief
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-white/85">{MOCK.aiGuide}</div>
                </div>
                <Chip label="Open →" tone="purple" />
              </Link>

              {/* Action strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/dmo/stl"
                    className={[
                      "rounded-xl border px-4 py-2 text-[11px] font-semibold transition-colors",
                      TONE_BORDER.purple,
                      TONE_BG.purple,
                      TONE_FG.purple,
                      "hover:brightness-110",
                    ].join(" ")}
                  >
                    Open STL Management →
                  </Link>
                  <Link
                    href="/dmo/ehb-stl-level"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                  >
                    STL L1–L8 reference
                  </Link>
                  <Link
                    href="/dmo"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                  >
                    ↩ Live landing (Phase 7)
                  </Link>
                </div>
                <Chip label="All systems nominal" tone="green" />
              </div>
            </div>
          </header>

          {/* ══════════════════════════════════════════════════════
              2. VERIFICATION TRINITY
              ══════════════════════════════════════════════════════ */}
          <section>
            <SectionTitle
              eyebrow="Verification"
              title="PSS · CRB · STL trinity"
              right={<Chip label="Live check" tone="cyan" />}
            />
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {/* PSS */}
              <div className="relative overflow-hidden rounded-2xl p-5" style={NEU_CARD}>
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${TONE_GLOW_HEX.teal}35, transparent 65%)`,
                  }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Personal Security System
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2BBFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                      <div className="text-[15px] font-semibold text-white">PSS</div>
                      <Chip label={pssHealthy ? "HEALTHY" : "WATCH"} tone={pssHealthy ? "green" : "amber"} />
                    </div>
                  </div>
                  <RingGauge
                    value={pssHealthy ? 94 : 62}
                    tone="teal"
                    size={72}
                    label={pssHealthy ? "94%" : "62%"}
                    sub="PSS"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <ChecklistRow label="KYC liveness" detail={MOCK.kycStatus} ok={true} />
                  <ChecklistRow label="AML screening" detail="Clear" ok={true} />
                  <ChecklistRow
                    label="Complaint limit"
                    detail={`${MOCK.complaints}/${MOCK.complaintLimit}`}
                    ok={MOCK.complaints < MOCK.complaintLimit - 2}
                  />
                  <ChecklistRow label="Fraud flag" detail="LOW" ok={true} />
                </div>
                <Link
                  href="/dmo/pss"
                  className={[
                    "mt-4 inline-flex rounded-lg border px-3 py-2 text-[10px] font-semibold",
                    TONE_BORDER.teal,
                    TONE_BG.teal,
                    TONE_FG.teal,
                  ].join(" ")}
                >
                  Open PSS →
                </Link>
              </div>

              {/* CRB */}
              <div className="relative overflow-hidden rounded-2xl p-5" style={NEU_CARD}>
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${TONE_GLOW_HEX.green}35, transparent 65%)`,
                  }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Certification &amp; Registry Board
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38C878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
                      <div className="text-[15px] font-semibold text-white">CRB</div>
                      <Chip label={crbHealthy ? "HEALTHY" : "WATCH"} tone={crbHealthy ? "green" : "amber"} />
                    </div>
                  </div>
                  <RingGauge
                    value={(MOCK.crbVerifications / MOCK.requiredVerifications) * 100}
                    tone="green"
                    size={72}
                    label={`${MOCK.crbVerifications}/${MOCK.requiredVerifications}`}
                    sub="CRB"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <ChecklistRow
                    label="Documents verified"
                    detail={`${MOCK.crbVerifications}/${MOCK.requiredVerifications}`}
                    ok={MOCK.crbVerifications >= MOCK.requiredVerifications - 1}
                  />
                  <ChecklistRow
                    label="Exams passed"
                    detail={`${MOCK.examsPassed}/${MOCK.requiredExams}`}
                    ok={MOCK.examsPassed >= MOCK.requiredExams - 1}
                  />
                  <ChecklistRow label="Inspection reports" detail="Active" ok={true} />
                  <ChecklistRow label="Certificate hash" detail="On-chain" ok={true} />
                </div>
                <Link
                  href="/dmo/crb"
                  className={[
                    "mt-4 inline-flex rounded-lg border px-3 py-2 text-[10px] font-semibold",
                    TONE_BORDER.green,
                    TONE_BG.green,
                    TONE_FG.green,
                  ].join(" ")}
                >
                  Open CRB →
                </Link>
              </div>

              {/* STL */}
              <div className="relative overflow-hidden rounded-2xl p-5" style={NEU_CARD}>
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${TONE_GLOW_HEX.purple}35, transparent 65%)`,
                  }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Service Trust Level
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A098F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <div className="text-[15px] font-semibold text-white">STL</div>
                      <Chip label={stlHealthy ? "STRONG" : "RISE"} tone={stlHealthy ? "purple" : "amber"} />
                    </div>
                  </div>
                  <RingGauge
                    value={MOCK.trustScore}
                    tone="purple"
                    size={72}
                    label={`L${MOCK.stlLevel}`}
                    sub={MOCK.levelName}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <ChecklistRow label="Trust score" detail={`${MOCK.trustScore}/100`} ok={stlHealthy} />
                  <ChecklistRow label="Level progress" detail={`${MOCK.progressPct}% → ${MOCK.nextLevelName}`} ok={MOCK.progressPct >= 50} />
                  <ChecklistRow label="Complaint delta" detail="-0.4 WoW" ok={true} />
                  <ChecklistRow label="Anchor proofs" detail="On-chain" ok={true} />
                </div>
                <Link
                  href="/dmo/stl"
                  className={[
                    "mt-4 inline-flex rounded-lg border px-3 py-2 text-[10px] font-semibold",
                    TONE_BORDER.purple,
                    TONE_BG.purple,
                    TONE_FG.purple,
                  ].join(" ")}
                >
                  Open STL →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              3. INTELLIGENCE ROW (4-up)
              ══════════════════════════════════════════════════════ */}
          <section>
            <SectionTitle
              eyebrow="Intelligence"
              title="AI · Blockchain · Franchise · Activity"
              right={<Chip label="4 live signals" tone="purple" />}
            />
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {/* AI next steps */}
              <Link
                href="/dmo/ai-assistant"
                className="block rounded-2xl p-4 transition-all hover:-translate-y-[2px]"
                style={NEU_CARD}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A098F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>
                  <div className="text-[11px] font-semibold text-white">AI Next Steps</div>
                  <Chip label="3 tasks" tone="purple" />
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    "Escalate 3 P1 complaints past SLA",
                    "Auto-release 42 escrows passing checks",
                    "Add fraud rule for KHI delivery spike",
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-2 text-[11px] text-white/80"
                      style={NEU_SMALL}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </Link>

              {/* Blockchain */}
              <Link
                href="/dmo/blockchain-control"
                className="block rounded-2xl p-4 transition-all hover:-translate-y-[2px]"
                style={NEU_CARD}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2BBFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="6" height="10" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/><path d="M8 12h8"/><path d="M8 9h8"/><path d="M8 15h8"/></svg>
                  <div className="text-[11px] font-semibold text-white">Blockchain Proof</div>
                  <Chip label="Live" tone="teal" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg px-3 py-2" style={NEU_SMALL}>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Latest anchor</div>
                    <div className="mt-1 font-mono text-[10px] text-[#2BBFA0]">0xabc1…4412</div>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={NEU_SMALL}>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Block</div>
                    <div className="mt-1 text-[11px] text-white/90">#48,112 · 2m ago</div>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={NEU_SMALL}>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Confirmations</div>
                    <div className="mt-1 text-[11px] text-[#38C878]">6 / 6 finalised</div>
                  </div>
                </div>
              </Link>

              {/* Franchise */}
              <Link
                href="/dmo/franchise"
                className="block rounded-2xl p-4 transition-all hover:-translate-y-[2px]"
                style={NEU_CARD}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0A030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>
                  <div className="text-[11px] font-semibold text-white">Franchise Network</div>
                  <Chip label={`${MOCK.franchiseVerified} verified`} tone="amber" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <RingGauge
                    value={(MOCK.franchiseVerified / (MOCK.franchiseVerified + MOCK.franchisePending)) * 100}
                    tone="amber"
                    size={68}
                    label={String(MOCK.franchiseVerified)}
                    sub="nodes"
                  />
                  <div className="space-y-1.5 text-right">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Country</div>
                      <div className="text-[12px] font-semibold text-white">4</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Corporate</div>
                      <div className="text-[12px] font-semibold text-white">6</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.12em] text-white/45">Sub</div>
                      <div className="text-[12px] font-semibold text-white">{MOCK.franchisePending}</div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Activity */}
              <Link
                href="/dmo/activity-engine"
                className="block rounded-2xl p-4 transition-all hover:-translate-y-[2px]"
                style={NEU_CARD}
              >
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <div className="text-[11px] font-semibold text-white">Activity Engine</div>
                  <Chip label="24h" tone="cyan" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-2 text-center" style={NEU_SMALL}>
                    <div className="text-[16px] font-bold text-[#67E8F9]">184</div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-white/45">Events</div>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={NEU_SMALL}>
                    <div className="text-[16px] font-bold text-[#38C878]">42</div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-white/45">Approvals</div>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={NEU_SMALL}>
                    <div className="text-[16px] font-bold text-[#F0A030]">{MOCK.complaints}</div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-white/45">Complaints</div>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={NEU_SMALL}>
                    <div className="text-[16px] font-bold text-[#A098F8]">12</div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-white/45">Refills</div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              4. EARNINGS + BENEFITS (2-column)
              ══════════════════════════════════════════════════════ */}
          <section>
            <SectionTitle
              eyebrow="Wallet"
              title="Earnings + STL benefits"
              right={<Chip label="40/25/20/15" tone="amber" />}
            />
            <div className="mt-3 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
              {/* Earnings */}
              <div className="rounded-2xl p-5" style={NEU_CARD}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Earnings 7d
                    </div>
                    <div className="mt-1 text-[22px] font-bold text-white">$184,200</div>
                    <div className="mt-0.5 text-[11px] text-[#38C878]">+12% WoW</div>
                  </div>
                  <div className="flex gap-2">
                    <Chip label="Seller 40%" tone="purple" />
                    <Chip label="EHB 25%" tone="teal" />
                    <Chip label="Franchise 20%" tone="amber" />
                    <Chip label="Affiliate 15%" tone="cyan" />
                  </div>
                </div>
                <div className="mt-4">
                  <EarningsBars />
                </div>
              </div>

              {/* Benefits ladder */}
              <div className="rounded-2xl p-5" style={NEU_CARD}>
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  STL Benefits Ladder
                </div>
                <div className="mt-1 text-[14px] font-semibold text-white">
                  Unlocked at L{MOCK.stlLevel} {MOCK.levelName}
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { level: "L1 FREE", perk: "Basic listing", unlocked: true },
                    { level: "L2 BASIC", perk: "Wallet enabled", unlocked: true },
                    { level: "L3 NORMAL", perk: "Escrow access", unlocked: true },
                    { level: "L4 PREMIUM", perk: "Featured placement", unlocked: true, current: true },
                    { level: "L5 GOLD", perk: "AI recommendations", unlocked: false },
                    { level: "L6 PLATINUM", perk: "Franchise invite", unlocked: false },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className={[
                        "flex items-center justify-between rounded-xl px-3 py-2",
                        b.current ? "border border-[#7B6EF6]/30 bg-[#7B6EF6]/10" : "",
                      ].join(" ")}
                      style={!b.current ? NEU_SMALL : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "text-[10px] font-bold",
                            b.unlocked ? "text-[#A098F8]" : "text-white/30",
                          ].join(" ")}
                        >
                          {b.level}
                        </span>
                        <span
                          className={[
                            "text-[11px]",
                            b.unlocked ? "text-white/85" : "text-white/40",
                          ].join(" ")}
                        >
                          {b.perk}
                        </span>
                      </div>
                      {b.current ? (
                        <Chip label="Current" tone="purple" />
                      ) : b.unlocked ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38C878" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                      ) : (
                        <span className="text-[10px] text-white/30">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              5. MODULE RAIL — bento grouped (18 modules)
              ══════════════════════════════════════════════════════ */}
          <section>
            <SectionTitle
              eyebrow="Navigation"
              title="DMO modules"
              right={<Chip label="18 modules · 4 groups" tone="slate" />}
            />
            <div className="mt-4 space-y-5">
              {DMO_NAV_GROUPS.map((group) => {
                const sections = grouped.find((g) => g.key === group.key)?.sections ?? [];
                if (sections.length === 0) return null;
                const groupTone: Tone =
                  group.key === "overview"
                    ? "cyan"
                    : group.key === "verification"
                    ? "green"
                    : group.key === "operations"
                    ? "amber"
                    : "purple";
                return (
                  <div key={group.key} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Chip label={group.label} tone={groupTone} />
                      <div className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        {sections.length} modules
                      </span>
                    </div>
                    <div
                      className="grid gap-3"
                      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
                    >
                      {sections.map((section) => (
                        <Link
                          key={section.key}
                          href={section.href}
                          className="group relative overflow-hidden rounded-2xl p-3 transition-all hover:-translate-y-[2px]"
                          style={NEU_CARD}
                        >
                          <div
                            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                            style={{
                              background: `radial-gradient(circle, ${TONE_GLOW_HEX[groupTone]}40, transparent 65%)`,
                            }}
                          />
                          <div className="relative flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[15px]"
                              style={NEU_SMALL}
                            >
                              {section.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12px] font-semibold text-white">
                                {section.label}
                              </div>
                              <div className="mt-0.5 truncate text-[10px] text-white/50">
                                {section.items.length} sub-pages · open →
                              </div>
                            </div>
                            <span className={["text-[13px] opacity-40 transition-all group-hover:opacity-100", TONE_FG[groupTone]].join(" ")}>
                              →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Footer watermark */}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[10px] text-white/45">
            <span>Phase 9 · Silver chrome prototype · DESIGN ONLY</span>
            <span>Mock data only — no API wiring</span>
          </div>
        </div>
      </div>
    </main>
  );
}
