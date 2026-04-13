"use client";

/**
 * DmoPrototypeWorkspace — Phase 9 UI/UX prototype rebuild (2026-04-11).
 *
 * Purpose
 *   The legacy `DmoSectionWorkspace.tsx` only covers 14 section keys. The
 *   canonical navigation (`navigation.ts`) declares 18 modules with ~73 sub
 *   routes. The 10 missing modules fall through the catch-all route and
 *   render a "not configured yet" error.
 *
 *   This component covers those 10 missing modules in the SILVER-CHROME
 *   + NEUMORPHISM 3D theme (v1.7/v1.8 of the design system). It is a
 *   DESIGN PROTOTYPE only — data is inline mock, no API calls, no
 *   writes. Backend wiring will come in a later sprint per the user's
 *   instruction ("abhi sirf design pe kaam ho raha hai").
 *
 * Covered modules
 *   1. up-guard          (Verification)
 *   2. wallet-control    (Operations)
 *   3. earnings-engine   (Operations)       — stub
 *   4. refill-management (Operations)       — stub
 *   5. complaints        (Operations)
 *   6. activity-engine   (Intelligence)     — stub
 *   7. task-system       (Intelligence)     — stub
 *   8. ai-assistant      (Intelligence)     — stub
 *   9. analytics         (Intelligence)     — stub
 *  10. blockchain-control (Intelligence)    — stub
 *
 * Iteration 1 (this commit) fleshes out 3 modules fully (wallet-control,
 * up-guard, complaints) as a direction proof. Remaining 7 modules are
 * scaffolded with minimum views so routes do not 404 and can be fleshed
 * out next iteration once direction is approved.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
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
//  Types
// ───────────────────────────────────────────────────────────────────────

type StatTile = {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
};

type Pill = {
  label: string;
  tone?: Tone;
};

type DrawerField = {
  label: string;
  value: ReactNode;
  tone?: Tone;
};

type DrawerTimelineItem = {
  time: string;
  label: string;
  body?: string;
  tone?: Tone;
};

type DrawerAction = {
  label: string;
  tone?: Tone;
  disabled?: boolean;
};

type DrawerBlueprint = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: Tone;
  fields: DrawerField[];
  timeline?: DrawerTimelineItem[];
  evidence?: { label: string; body: string; tone?: Tone }[];
  actions?: DrawerAction[];
};

type RowTile = {
  id: string;
  cells: ReactNode[];
  pill?: Pill;
  drawer?: DrawerBlueprint;
};

type InsightCard = {
  icon: ReactNode;
  title: string;
  body: string;
  tone?: Tone;
};

type ViewBlueprint = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  stats: StatTile[];
  mainTitle: string;
  mainDescription: string;
  columns: string[];
  rows: RowTile[];
  insights?: InsightCard[];
  quickActions?: { label: string; href: string; tone?: Tone }[];
  accentVisual?: ReactNode;
};

type ModuleBlueprint = {
  key: string;
  icon: ReactNode;
  label: string;
  href: string;
  accent: Tone;
  groupLabel: string;
  tagline: string;
  navItems: { key: string; label: string; href: string; description?: string }[];
  views: Record<string, ViewBlueprint>;
};

// Design tokens (Tone palette + neumorphism styles) are imported from
// `@/components/dmo/_shared/neumorphism` — see the top of this file.

// ───────────────────────────────────────────────────────────────────────
//  Small UI atoms
// ───────────────────────────────────────────────────────────────────────

function Chip({ label, tone = "slate" }: Pill) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        TONE_FG[tone],
        TONE_BG[tone],
        "border",
        TONE_BORDER[tone],
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function StatCard({ stat, accent }: { stat: StatTile; accent: Tone }) {
  const tone = stat.tone ?? accent;
  return (
    <div className="relative rounded-2xl p-4" style={NEU_SMALL}>
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
          {stat.label}
        </div>
        <span
          className={[
            "h-2 w-2 rounded-full",
            TONE_BG[tone].replace("/14", "/80"),
          ].join(" ")}
          style={{ boxShadow: `0 0 10px ${TONE_GLOW_HEX[tone]}` }}
        />
      </div>
      <div className="mt-3 text-2xl font-semibold text-white tabular-nums">
        {stat.value}
      </div>
      {stat.hint ? (
        <div className={["mt-1 text-[10px] font-medium", TONE_FG[tone]].join(" ")}>
          {stat.hint}
        </div>
      ) : null}
    </div>
  );
}

function MiniBar({
  value,
  max = 100,
  tone = "purple",
}: {
  value: number;
  max?: number;
  tone?: Tone;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${TONE_GLOW_HEX[tone]}, ${TONE_GLOW_HEX[tone]}cc)`,
          boxShadow: `0 0 8px ${TONE_GLOW_HEX[tone]}55`,
        }}
      />
    </div>
  );
}

function RingGauge({
  value,
  max = 100,
  tone = "purple",
  size = 72,
  label,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  size?: number;
  label?: string;
}) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const dash = pct * circumference;
  const id = `ring-${tone}-${label ?? "x"}`.replace(/\s+/g, "-");
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TONE_GLOW_HEX[tone]} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 40 40)"
          style={{
            filter: `drop-shadow(0 0 4px ${TONE_GLOW_HEX[tone]}88)`,
            transition: "stroke-dasharray 900ms ease-out",
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-semibold text-white tabular-nums">
          {Math.round(pct * 100)}%
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Accent visuals (module-specific hero mini visuals)
// ───────────────────────────────────────────────────────────────────────

function PenaltyLadder() {
  const rungs: { level: string; label: string; tone: Tone; pct: number }[] = [
    { level: "L0", label: "Warning", tone: "slate", pct: 100 },
    { level: "L1", label: "Soft caution", tone: "cyan", pct: 62 },
    { level: "L2", label: "Fine", tone: "amber", pct: 38 },
    { level: "L3", label: "Restriction", tone: "amber", pct: 22 },
    { level: "L4", label: "Suspension", tone: "red", pct: 12 },
    { level: "L5", label: "Ban", tone: "red", pct: 3 },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Penalty Ladder
          </div>
          <div className="text-sm font-semibold text-white">
            Active offenders by level
          </div>
        </div>
        <Chip label="Last 30d" tone="slate" />
      </div>
      <div className="space-y-2">
        {rungs.map((r) => (
          <div key={r.level} className="flex items-center gap-3">
            <div
              className={[
                "w-10 rounded-md px-2 py-1 text-center text-[10px] font-bold",
                TONE_FG[r.tone],
                TONE_BG[r.tone],
              ].join(" ")}
            >
              {r.level}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <div className="text-[11px] font-medium text-white/85">
                  {r.label}
                </div>
                <div className="text-[10px] tabular-nums text-white/55">
                  {r.pct}%
                </div>
              </div>
              <div className="mt-1">
                <MiniBar value={r.pct} tone={r.tone} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletSplitRing() {
  // 40 / 25 / 20 / 15 revenue split — segmented arc visual
  const segments: { label: string; pct: number; tone: Tone }[] = [
    { label: "Seller", pct: 40, tone: "purple" },
    { label: "EHB", pct: 25, tone: "teal" },
    { label: "Franchise", pct: 20, tone: "amber" },
    { label: "Affiliate", pct: 15, tone: "cyan" },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Wallet routing
          </div>
          <div className="text-sm font-semibold text-white">
            40 / 25 / 20 / 15 split
          </div>
        </div>
        <Chip label="Live" tone="teal" />
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className={[
                "w-14 rounded-md px-2 py-1 text-center text-[10px] font-semibold",
                TONE_FG[s.tone],
                TONE_BG[s.tone],
              ].join(" ")}
            >
              {s.pct}%
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium text-white/85">
                {s.label}
              </div>
              <div className="mt-1">
                <MiniBar value={s.pct} max={40} tone={s.tone} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpGuardRadar() {
  const pts: { label: string; risk: number; tone: Tone }[] = [
    { label: "Auth drift", risk: 72, tone: "red" },
    { label: "Geo anomaly", risk: 48, tone: "amber" },
    { label: "Velocity", risk: 34, tone: "amber" },
    { label: "Device", risk: 22, tone: "cyan" },
    { label: "Network", risk: 12, tone: "green" },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Up-Guard radar
          </div>
          <div className="text-sm font-semibold text-white">
            Signal heat (last 24h)
          </div>
        </div>
        <Chip label="Live" tone="cyan" />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {pts.map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-2">
            <RingGauge value={p.risk} tone={p.tone} size={58} />
            <div className="text-center text-[10px] font-medium text-white/70">
              {p.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Iteration-2 accent visuals
// ───────────────────────────────────────────────────────────────────────

function LivePulseTimeline() {
  const events: { id: string; time: string; label: string; tone: Tone; icon: ReactNode }[] = [
    { id: "e1", time: "2m", label: "STL score updated for 14 entities", tone: "purple", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: "e2", time: "4m", label: "Complaint P1 escalated to Director", tone: "red", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: "e3", time: "6m", label: "Escrow auto-released · $1,200", tone: "teal", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: "e4", time: "8m", label: "PSS case approved · KYC pass", tone: "green", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> },
    { id: "e5", time: "12m", label: "Up-Guard signal cleared", tone: "cyan", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id: "e6", time: "14m", label: "CRB certificate issued", tone: "amber", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg> },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Live pulse
          </div>
          <div className="text-sm font-semibold text-white">Real-time event stream</div>
        </div>
        <Chip label="Live" tone="purple" />
      </div>
      <div className="relative">
        <div className="absolute bottom-1 left-[14px] top-1 w-px bg-white/10" />
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="relative flex items-start gap-3">
              <div
                className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[11px]"
                style={{
                  background: `radial-gradient(circle at center, ${TONE_GLOW_HEX[e.tone]}55, transparent 70%)`,
                  boxShadow: `0 0 10px ${TONE_GLOW_HEX[e.tone]}80, inset 0 0 0 1px ${TONE_GLOW_HEX[e.tone]}55`,
                }}
              >
                {e.icon}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className={["text-[11px] font-semibold", TONE_FG[e.tone]].join(" ")}>
                    {e.label}
                  </div>
                  <div className="shrink-0 text-[10px] tabular-nums text-white/45">
                    {e.time} ago
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiSparkGrid() {
  const kpis: {
    label: string;
    value: string;
    delta: string;
    tone: Tone;
    path: string;
  }[] = [
    {
      label: "Approval rate",
      value: "87%",
      delta: "+2%",
      tone: "green",
      path: "M0 20 L10 18 L20 15 L30 14 L40 10 L50 12 L60 8 L70 6 L80 7 L90 4 L100 2",
    },
    {
      label: "SLA hit",
      value: "94%",
      delta: "+1%",
      tone: "teal",
      path: "M0 14 L10 12 L20 13 L30 10 L40 9 L50 11 L60 7 L70 8 L80 5 L90 6 L100 3",
    },
    {
      label: "MTTR",
      value: "4h 21m",
      delta: "-18%",
      tone: "cyan",
      path: "M0 4 L10 6 L20 5 L30 8 L40 10 L50 9 L60 12 L70 14 L80 13 L90 15 L100 18",
    },
    {
      label: "STL average",
      value: "L4.6",
      delta: "+0.1",
      tone: "purple",
      path: "M0 12 L10 11 L20 13 L30 10 L40 9 L50 10 L60 8 L70 9 L80 7 L90 8 L100 6",
    },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            KPI pulse
          </div>
          <div className="text-sm font-semibold text-white">Live operator KPIs</div>
        </div>
        <Chip label="7d" tone="cyan" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => {
          const gid = `spark-${k.label.replace(/\s+/g, "-")}`;
          return (
            <div key={k.label} className="rounded-xl p-3" style={NEU_SMALL}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
                  {k.label}
                </div>
                <Chip label={k.delta} tone={k.tone} />
              </div>
              <div className="mt-2 text-xl font-semibold tabular-nums text-white">
                {k.value}
              </div>
              <div className="mt-2 h-8">
                <svg
                  viewBox="0 0 100 24"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={TONE_GLOW_HEX[k.tone]} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={TONE_GLOW_HEX[k.tone]} />
                    </linearGradient>
                  </defs>
                  <path
                    d={k.path}
                    fill="none"
                    stroke={`url(#${gid})`}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 3px ${TONE_GLOW_HEX[k.tone]}88)` }}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatBubbleMock() {
  const msgs: { from: "user" | "ai"; text: string }[] = [
    { from: "user", text: "Show me complaints with fraud signals from Up-Guard" },
    {
      from: "ai",
      text: "Found 3 complaints flagged by Up-Guard. 2 are P1 severity past SLA. Shall I escalate to Director?",
    },
    { from: "user", text: "Yes, escalate both P1s" },
    {
      from: "ai",
      text: "Escalated. Director paged. Created incident tickets INC-4413 and INC-4414 with full audit trail.",
    },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            AI Assistant
          </div>
          <div className="text-sm font-semibold text-white">
            Decision-support preview
          </div>
        </div>
        <Chip label="Claude" tone="purple" />
      </div>
      <div className="space-y-2">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={[
              "flex",
              m.from === "user" ? "justify-end" : "justify-start",
            ].join(" ")}
          >
            <div
              className={[
                "max-w-[85%] rounded-xl border px-3 py-2 text-[11px] leading-relaxed",
                m.from === "user"
                  ? "border-[#7B6EF6]/30 bg-[#7B6EF6]/15 text-white/90"
                  : "border-white/10 bg-white/[0.04] text-white/80",
              ].join(" ")}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockchainExplorerRow() {
  const blocks: {
    id: number;
    events: number;
    hash: string;
    age: string;
    tone: Tone;
  }[] = [
    { id: 48112, events: 12, hash: "0xabc1f28e…4412", age: "2m", tone: "teal" },
    { id: 48111, events: 9, hash: "0xabc0e41a…4411", age: "12m", tone: "teal" },
    { id: 48110, events: 14, hash: "0xabbf2c98…4410", age: "24m", tone: "teal" },
    { id: 48109, events: 18, hash: "0xabbe8811…4409", age: "38m", tone: "teal" },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Polkadot relay
          </div>
          <div className="text-sm font-semibold text-white">
            Recent blocks with EHB events
          </div>
        </div>
        <Chip label="Live" tone="teal" />
      </div>
      <div className="space-y-2">
        {blocks.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={NEU_SMALL}
          >
            <div
              className="flex h-10 w-14 items-center justify-center rounded-md text-[10px] font-bold"
              style={{
                background: `linear-gradient(145deg, ${TONE_GLOW_HEX[b.tone]}22, ${TONE_GLOW_HEX[b.tone]}0a)`,
                border: `1px solid ${TONE_GLOW_HEX[b.tone]}44`,
                color: TONE_GLOW_HEX[b.tone],
              }}
            >
              #{b.id.toString().slice(-4)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-mono text-[11px] text-white/80">{b.hash}</div>
                <div className="text-[10px] tabular-nums text-white/45">{b.age}</div>
              </div>
              <div className="mt-0.5 text-[10px] text-white/50">
                {b.events} EHB events anchored · block {b.id.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefillCountdownGrid() {
  const items: { user: string; days: number; type: string; tone: Tone }[] = [
    { user: "Usman T.", days: 3, type: "PSS", tone: "amber" },
    { user: "Ayesha M.", days: 2, type: "CRB", tone: "red" },
    { user: "Omar K.", days: 5, type: "PSS", tone: "amber" },
    { user: "Fatima S.", days: 7, type: "CRB", tone: "cyan" },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Expiry countdown
          </div>
          <div className="text-sm font-semibold text-white">
            Users needing refill within 7 days
          </div>
        </div>
        <Chip label="Action needed" tone="amber" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.user}
            className="flex flex-col items-center gap-2 rounded-xl p-3"
            style={NEU_SMALL}
          >
            <RingGauge value={7 - it.days} max={7} tone={it.tone} size={68} />
            <div className="text-center">
              <div className="text-[11px] font-semibold text-white/90">{it.user}</div>
              <div className="text-[10px] text-white/55">
                {it.type} · {it.days}d left
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlaRingGrid() {
  const timers: { id: string; label: string; pct: number; remaining: string; tone: Tone }[] = [
    { id: "T-8821", label: "Complaint P1", pct: 92, remaining: "12m", tone: "red" },
    { id: "T-8820", label: "Complaint P1", pct: 64, remaining: "1h 8m", tone: "amber" },
    { id: "T-8819", label: "PSS review", pct: 48, remaining: "2h", tone: "amber" },
    { id: "T-8818", label: "CRB inspect", pct: 22, remaining: "6h", tone: "cyan" },
  ];
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            SLA timers
          </div>
          <div className="text-sm font-semibold text-white">
            Tasks approaching breach
          </div>
        </div>
        <Chip label="Live" tone="red" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {timers.map((t) => (
          <div
            key={t.id}
            className="flex flex-col items-center gap-2 rounded-xl p-3"
            style={NEU_SMALL}
          >
            <RingGauge value={t.pct} tone={t.tone} size={68} />
            <div className="text-center">
              <div className="text-[11px] font-semibold text-white/90">{t.id}</div>
              <div className="text-[10px] text-white/55">
                {t.label} · {t.remaining}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayoutSparkline() {
  // Stacked bar preview of last 7 days payouts
  const days = [
    { d: "Mon", v: 62 },
    { d: "Tue", v: 78 },
    { d: "Wed", v: 54 },
    { d: "Thu", v: 92 },
    { d: "Fri", v: 88 },
    { d: "Sat", v: 44 },
    { d: "Sun", v: 71 },
  ];
  const max = 100;
  return (
    <div className="rounded-2xl p-5" style={NEU_INSET}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Payout volume
          </div>
          <div className="text-sm font-semibold text-white">
            Last 7 days · $ thousands
          </div>
        </div>
        <Chip label="7d" tone="amber" />
      </div>
      <div className="flex h-32 items-end gap-2">
        {days.map((d) => {
          const h = Math.max(8, (d.v / max) * 100);
          return (
            <div key={d.d} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-md"
                style={{
                  height: `${h}%`,
                  background:
                    "linear-gradient(180deg, #F0A030, #F0A03055 80%, #F0A03022)",
                  boxShadow: "0 0 10px rgba(240,160,48,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              />
              <div className="text-[9px] font-medium text-white/55">{d.d}</div>
              <div className="text-[9px] tabular-nums text-white/75">${d.v}K</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Registry — 10 modules × multiple views
//  (Iteration 2 — all 10 modules fleshed with rich content)
// ───────────────────────────────────────────────────────────────────────

const MODULES: Record<string, ModuleBlueprint> = {
  // ═════════════════════════════════════════════════════════════════════
  //  1. UP-GUARD  (Verification · cyan)
  // ═════════════════════════════════════════════════════════════════════
  "up-guard": {
    key: "up-guard",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    label: "Up-Guard",
    href: "/dmo/up-guard",
    accent: "cyan",
    groupLabel: "Verification",
    tagline: "Continuous signal intelligence across PSS, CRB, and STL.",
    navItems: [
      { key: "overview", label: "Overview", href: "/dmo/up-guard", description: "Unified risk pulse across EHB." },
      { key: "signals", label: "Signals", href: "/dmo/up-guard/signals", description: "Live anomaly stream." },
      { key: "incidents", label: "Incidents", href: "/dmo/up-guard/incidents", description: "Open & recent incidents." },
      { key: "policy", label: "Policy", href: "/dmo/up-guard/policy", description: "Active detection rules." },
    ],
    views: {
      signals: {
        key: "signals",
        eyebrow: "Verification · Up-Guard",
        title: "Live signals",
        description: "Real-time anomaly stream fed by PSS, CRB, STL, and AI detectors.",
        stats: [
          { label: "Signals 24h", value: "184", hint: "+12% vs yesterday", tone: "cyan" },
          { label: "Critical", value: "7", hint: "Needs immediate triage", tone: "red" },
          { label: "Under watch", value: "23", hint: "Auto-monitored", tone: "amber" },
          { label: "Cleared", value: "154", hint: "False positive", tone: "green" },
        ],
        mainTitle: "Live signal stream",
        mainDescription: "Sorted by risk. Newest first.",
        columns: ["ID", "Source", "Signal", "Risk", "Detected"],
        rows: [
          {
            id: "sig-01",
            cells: ["SIG-0912", "PSS", "KYC document mismatch", <Chip key="p" label="HIGH" tone="red" />, "12m ago"],
            drawer: {
              eyebrow: "Verification · Up-Guard · Signal",
              title: "SIG-0912 · KYC document mismatch",
              subtitle: "PSS detector flagged a biometric and document inconsistency for user ali-1184.",
              accent: "red",
              fields: [
                { label: "Signal ID", value: "SIG-0912" },
                { label: "Source", value: "PSS · Liveness", tone: "teal" },
                { label: "Risk", value: "HIGH", tone: "red" },
                { label: "Confidence", value: "0.94", tone: "purple" },
                { label: "Entity", value: "user · ali-1184" },
                { label: "Detected", value: "12m ago" },
              ],
              timeline: [
                { time: "12m ago", label: "Signal raised", body: "PSS L1 detector flagged document photo vs liveness mismatch.", tone: "red" },
                { time: "11m ago", label: "Auto-enrichment", body: "STL pulled last 30d activity, 2 prior anomalies found.", tone: "amber" },
                { time: "10m ago", label: "Routed", body: "Routed to PSS L2 pool for human review.", tone: "cyan" },
                { time: "4m ago", label: "Under review", body: "Picked up by operator Sara A.", tone: "teal" },
              ],
              evidence: [
                { label: "KYC doc hash", body: "sha256:84a1…c992 — captured 14 days ago", tone: "teal" },
                { label: "Liveness capture", body: "Frame delta 0.18 — below 0.42 threshold. Auto-flag.", tone: "red" },
                { label: "Prior anomalies", body: "2 wallet velocity spikes in last 14d.", tone: "amber" },
              ],
              actions: [
                { label: "Escalate to L3", tone: "red" },
                { label: "Clear signal", tone: "green" },
                { label: "Hold for review", tone: "amber" },
              ],
            },
          },
          { id: "sig-02", cells: ["SIG-0911", "CRB", "Geo-spoof attempt", <Chip key="p" label="HIGH" tone="red" />, "28m ago"] },
          { id: "sig-03", cells: ["SIG-0910", "STL", "Score drop > 25", <Chip key="p" label="MED" tone="amber" />, "41m ago"] },
          { id: "sig-04", cells: ["SIG-0909", "AI", "Fraud pattern match", <Chip key="p" label="HIGH" tone="red" />, "1h ago"] },
          { id: "sig-05", cells: ["SIG-0908", "PSS", "Velocity anomaly", <Chip key="p" label="MED" tone="amber" />, "1h ago"] },
          { id: "sig-06", cells: ["SIG-0907", "Network", "IP reputation low", <Chip key="p" label="LOW" tone="cyan" />, "2h ago"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Surge detected", body: "PSS document-mismatch signals up 34% in last 3h.", tone: "red" as const },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "AI recommendation", body: "Auto-escalate geo-spoof signals to Up-Guard L2 rule.", tone: "purple" as const },
        ],
        accentVisual: <UpGuardRadar />,
      },
      incidents: {
        key: "incidents",
        eyebrow: "Verification · Up-Guard",
        title: "Incidents",
        description: "Confirmed incidents promoted from signals. Track ownership and resolution SLA.",
        stats: [
          { label: "Open", value: "9", hint: "4 critical", tone: "red" },
          { label: "In progress", value: "14", hint: "Avg age 6h", tone: "amber" },
          { label: "Resolved 7d", value: "62", hint: "SLA hit 94%", tone: "green" },
          { label: "MTTR", value: "4h 21m", hint: "-18% WoW", tone: "teal" },
        ],
        mainTitle: "Active incidents",
        mainDescription: "Ownership and SLA timers. Click row to open incident ticket.",
        columns: ["Incident", "Severity", "Owner", "Age", "Status"],
        rows: [
          { id: "inc-01", cells: ["INC-4412 · KYC tamper", <Chip key="s" label="P1" tone="red" />, "Ali R.", "42m", <Chip key="x" label="Investigating" tone="amber" />] },
          { id: "inc-02", cells: ["INC-4411 · Geo cluster", <Chip key="s" label="P1" tone="red" />, "Sara A.", "1h 12m", <Chip key="x" label="Contained" tone="cyan" />] },
          { id: "inc-03", cells: ["INC-4410 · Refund abuse", <Chip key="s" label="P2" tone="amber" />, "Usman T.", "3h", <Chip key="x" label="Tracking" tone="slate" />] },
          { id: "inc-04", cells: ["INC-4409 · STL drop wave", <Chip key="s" label="P2" tone="amber" />, "Ayesha M.", "4h", <Chip key="x" label="Mitigated" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "P1 load heavy", body: "2 P1 incidents exceeded 1h age - page on-call director.", tone: "red" as const },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "MTTR improving", body: "Mean time to resolve down 18% week-over-week.", tone: "green" as const },
        ],
      },
      policy: {
        key: "policy",
        eyebrow: "Verification · Up-Guard",
        title: "Detection policy",
        description: "Rules, thresholds, and auto-actions that turn signals into incidents.",
        stats: [
          { label: "Active rules", value: "46", tone: "purple" },
          { label: "Auto-actions", value: "18", hint: "Hybrid + auto", tone: "teal" },
          { label: "Human-only", value: "12", tone: "amber" },
          { label: "Disabled", value: "4", tone: "slate" },
        ],
        mainTitle: "Active detection rules",
        mainDescription: "Toggle, tune thresholds, or send to A/B for shadow testing.",
        columns: ["Rule", "Trigger", "Action", "Mode", "Updated"],
        rows: [
          { id: "rul-01", cells: ["Geo-spoof L2", "Device ≠ billing geo", "Auto-escalate", <Chip key="m" label="Auto" tone="teal" />, "2d ago"] },
          { id: "rul-02", cells: ["Velocity burst", ">15 txn/min", "Freeze + review", <Chip key="m" label="Hybrid" tone="amber" />, "5d ago"] },
          { id: "rul-03", cells: ["KYC mismatch", "OCR ≠ form", "Route to PSS", <Chip key="m" label="Auto" tone="teal" />, "1w ago"] },
          { id: "rul-04", cells: ["STL freefall", "Score -25 in 1h", "Page analyst", <Chip key="m" label="Human" tone="purple" />, "1w ago"] },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  2. WALLET-CONTROL  (Operations · purple)
  // ═════════════════════════════════════════════════════════════════════
  "wallet-control": {
    key: "wallet-control",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    label: "Wallet Control",
    href: "/dmo/wallet-control",
    accent: "purple",
    groupLabel: "Operations",
    tagline: "EHB Coin · USDT · PKR wallets, escrow, coin lock, and revenue split.",
    navItems: [
      { key: "overview", label: "Overview", href: "/dmo/wallet-control", description: "Wallet engine pulse." },
      { key: "balances", label: "Balances", href: "/dmo/wallet-control/balances", description: "All wallets by asset." },
      { key: "escrow", label: "Escrow", href: "/dmo/wallet-control/escrow", description: "Active escrow holds." },
      { key: "lock", label: "Coin lock", href: "/dmo/wallet-control/lock", description: "Refundable trust stake." },
    ],
    views: {
      balances: {
        key: "balances",
        eyebrow: "Operations · Wallet Control",
        title: "Wallet balances",
        description: "Assets held across custodial EHB wallets, broken down by locked vs available.",
        stats: [
          { label: "Total AUM", value: "$2.41M", hint: "Across 3 assets", tone: "purple" },
          { label: "EHB Coin", value: "18.4M", hint: "63% of AUM", tone: "purple" },
          { label: "USDT", value: "$612K", hint: "25% of AUM", tone: "teal" },
          { label: "PKR", value: "₨34.2M", hint: "12% of AUM", tone: "amber" },
        ],
        mainTitle: "All custodial wallets",
        mainDescription: "Click a wallet to see transactions, unlock schedule, and escrow refs.",
        columns: ["Wallet", "Asset", "Balance", "Locked", "Available"],
        rows: [
          { id: "w-01", cells: ["ehb-custody-01", <Chip key="a" label="EHB" tone="purple" />, "12,400,000", "3,200,000", "9,200,000"] },
          { id: "w-02", cells: ["ehb-custody-02", <Chip key="a" label="USDT" tone="teal" />, "$412,000", "$80,000", "$332,000"] },
          { id: "w-03", cells: ["franchise-escrow", <Chip key="a" label="USDT" tone="teal" />, "$200,000", "$200,000", "$0"] },
          { id: "w-04", cells: ["payout-pkr", <Chip key="a" label="PKR" tone="amber" />, "₨34,200,000", "₨8,100,000", "₨26,100,000"] },
        ],
        accentVisual: <WalletSplitRing />,
      },
      escrow: {
        key: "escrow",
        eyebrow: "Operations · Wallet Control",
        title: "Escrow holds",
        description: "Buyer ↔ seller escrow with automatic release windows and fraud-hold triggers.",
        stats: [
          { label: "Active escrows", value: "128", hint: "+14 today", tone: "purple" },
          { label: "On hold (fraud)", value: "6", hint: "Up-Guard flagged", tone: "red" },
          { label: "Ready to release", value: "42", hint: "Within 24h", tone: "teal" },
          { label: "Total held", value: "$184K", tone: "amber" },
        ],
        mainTitle: "Active escrows",
        mainDescription: "Time-to-release and fraud flags from Up-Guard.",
        columns: ["Deal", "Buyer", "Seller", "Amount", "Release"],
        rows: [
          {
            id: "e-01",
            cells: ["DEAL-9921 · GoSellr", "Ali R.", "Shop-441", "$1,200", <Chip key="r" label="In 14h" tone="teal" />],
            drawer: {
              eyebrow: "Operations · Wallet Control · Escrow",
              title: "DEAL-9921 · Escrow hold",
              subtitle: "Automatic release scheduled after buyer confirmation window.",
              accent: "teal",
              fields: [
                { label: "Deal ID", value: "DEAL-9921" },
                { label: "Module", value: "GoSellr", tone: "purple" },
                { label: "Buyer", value: "Ali R." },
                { label: "Seller", value: "Shop-441" },
                { label: "Amount", value: "$1,200", tone: "teal" },
                { label: "Release", value: "In 14h", tone: "cyan" },
              ],
              timeline: [
                { time: "2d ago", label: "Escrow opened", body: "Buyer payment captured. Funds frozen.", tone: "teal" },
                { time: "2d ago", label: "Seller dispatched", body: "Courier pickup confirmed by 3PL.", tone: "cyan" },
                { time: "6h ago", label: "Delivery confirmed", body: "Tracking API reported delivery.", tone: "green" },
                { time: "6h ago", label: "Auto-release armed", body: "14h buyer window started.", tone: "amber" },
              ],
              evidence: [
                { label: "Courier tracking", body: "AWB 844112 · delivered · signature on file", tone: "teal" },
                { label: "STL check", body: "Shop-441 STL L4.2 — above release threshold (L3).", tone: "green" },
              ],
              actions: [
                { label: "Release now", tone: "green" },
                { label: "Hold + investigate", tone: "amber" },
                { label: "Refund buyer", tone: "red" },
              ],
            },
          },
          { id: "e-02", cells: ["DEAL-9920 · OLS", "Sara A.", "Advocate-22", "$850", <Chip key="r" label="Hold · Fraud" tone="red" />] },
          { id: "e-03", cells: ["DEAL-9919 · WMS", "Usman T.", "Clinic-12", "$420", <Chip key="r" label="In 3d" tone="slate" />] },
          { id: "e-04", cells: ["DEAL-9918 · HPS", "Ayesha M.", "Tutor-07", "$180", <Chip key="r" label="Ready" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Auto-release eligible", body: "42 escrows pass all STL + PSS checks and can auto-release.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Fraud hold", body: "6 escrows held by Up-Guard. Review before acting.", tone: "red" },
        ],
      },
      lock: {
        key: "lock",
        eyebrow: "Operations · Wallet Control",
        title: "Coin lock",
        description: "Refundable EHB Coin stake required at STL L4+ to signal trust commitment.",
        stats: [
          { label: "Locked coins", value: "3.2M", hint: "EHB", tone: "purple" },
          { label: "Unique stakers", value: "1,284", tone: "teal" },
          { label: "Unlocks 7d", value: "212", tone: "amber" },
          { label: "Slashed 30d", value: "14", hint: "Complaint penalty", tone: "red" },
        ],
        mainTitle: "Active coin locks",
        mainDescription: "Lock age, STL tier, and scheduled unlock date.",
        columns: ["User", "STL", "Locked", "Unlock", "Status"],
        rows: [
          { id: "l-01", cells: ["Ali R.", <Chip key="t" label="L6" tone="teal" />, "2,000 EHB", "12 Apr", <Chip key="s" label="Healthy" tone="green" />] },
          { id: "l-02", cells: ["Sara A.", <Chip key="t" label="L4" tone="amber" />, "500 EHB", "18 Apr", <Chip key="s" label="Complaint" tone="amber" />] },
          { id: "l-03", cells: ["Usman T.", <Chip key="t" label="L7" tone="teal" />, "5,000 EHB", "25 Apr", <Chip key="s" label="Healthy" tone="green" />] },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  3. COMPLAINTS  (Operations · red)
  // ═════════════════════════════════════════════════════════════════════
  complaints: {
    key: "complaints",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 8l7-5 7 5"/></svg>,
    label: "Complaints",
    href: "/dmo/complaints",
    accent: "red",
    groupLabel: "Operations",
    tagline: "Penalty ladder enforcement, appeals, and resolution history.",
    navItems: [
      { key: "open", label: "Open", href: "/dmo/complaints/open", description: "Unresolved complaints." },
      { key: "ladder", label: "Penalty ladder", href: "/dmo/complaints/ladder", description: "L0 → L5 enforcement map." },
      { key: "appeals", label: "Appeals", href: "/dmo/complaints/appeals", description: "Under appeal." },
      { key: "history", label: "History", href: "/dmo/complaints/history", description: "Resolved archive." },
    ],
    views: {
      open: {
        key: "open",
        eyebrow: "Operations · Complaints",
        title: "Open complaints",
        description: "Live complaint queue from GoSellr, OLS, WMS, HPS, JPS, and AGTS modules.",
        stats: [
          { label: "Open", value: "87", hint: "+12 today", tone: "red" },
          { label: "P1 severity", value: "9", hint: "SLA 2h", tone: "red" },
          { label: "Avg age", value: "4h 38m", tone: "amber" },
          { label: "SLA hit 7d", value: "92%", tone: "green" },
        ],
        mainTitle: "Live complaint queue",
        mainDescription: "Sorted by severity then age. Click row to view evidence and timeline.",
        columns: ["Complaint", "Module", "Severity", "Assignee", "Age"],
        rows: [
          {
            id: "c-01",
            cells: ["CMP-8821 · Item not delivered", <Chip key="m" label="GoSellr" tone="purple" />, <Chip key="s" label="P1" tone="red" />, "Ali R.", "38m"],
            drawer: {
              eyebrow: "Operations · Complaints · Open",
              title: "CMP-8821 · Item not delivered",
              subtitle: "P1 complaint on GoSellr · SLA breach in 82 minutes.",
              accent: "red",
              fields: [
                { label: "Complaint ID", value: "CMP-8821" },
                { label: "Module", value: "GoSellr", tone: "purple" },
                { label: "Severity", value: "P1", tone: "red" },
                { label: "Assignee", value: "Ali R." },
                { label: "Age", value: "38m" },
                { label: "SLA left", value: "82m", tone: "amber" },
              ],
              timeline: [
                { time: "38m ago", label: "Filed", body: "Buyer reported item not delivered for DEAL-9811.", tone: "red" },
                { time: "36m ago", label: "Auto-triaged", body: "Classified P1 by severity model (0.96 confidence).", tone: "amber" },
                { time: "34m ago", label: "Routed", body: "Assigned to Ali R. from GoSellr complaints pool.", tone: "cyan" },
                { time: "12m ago", label: "Evidence attached", body: "Courier tracking + AI pattern match uploaded.", tone: "teal" },
              ],
              evidence: [
                { label: "Courier tracking", body: "Last scan 4d ago at ISB-HUB. No delivery event.", tone: "red" },
                { label: "Buyer history", body: "Clean · no prior complaints, L4 buyer tier.", tone: "green" },
                { label: "Seller trend", body: "Shop-441 had 3 similar complaints in last 14 days.", tone: "amber" },
              ],
              actions: [
                { label: "Apply L3 penalty", tone: "red" },
                { label: "Refund buyer", tone: "amber" },
                { label: "Escalate to Director", tone: "purple" },
              ],
            },
          },
          { id: "c-02", cells: ["CMP-8820 · Doctor no-show", <Chip key="m" label="WMS" tone="teal" />, <Chip key="s" label="P1" tone="red" />, "Sara A.", "1h 14m"] },
          { id: "c-03", cells: ["CMP-8819 · Bad advice", <Chip key="m" label="OLS" tone="amber" />, <Chip key="s" label="P2" tone="amber" />, "Usman T.", "2h"] },
          { id: "c-04", cells: ["CMP-8818 · Tutor late", <Chip key="m" label="HPS" tone="cyan" />, <Chip key="s" label="P3" tone="cyan" />, "Ayesha M.", "4h"] },
          { id: "c-05", cells: ["CMP-8817 · Job scam", <Chip key="m" label="JPS" tone="purple" />, <Chip key="s" label="P1" tone="red" />, "Omar K.", "5h"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "P1 escalation", body: "3 P1 complaints past SLA. Escalate to DMO Director.", tone: "red" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Pattern detected", body: "GoSellr delivery complaints spiking from Karachi region.", tone: "amber" },
        ],
        accentVisual: <PenaltyLadder />,
      },
      ladder: {
        key: "ladder",
        eyebrow: "Operations · Complaints",
        title: "Penalty ladder",
        description: "Six-level enforcement map. Each rung auto-triggers STL deductions and coin lock actions.",
        stats: [
          { label: "L0 Warnings", value: "214", tone: "slate" },
          { label: "L2 Fines", value: "46", hint: "-12% WoW", tone: "amber" },
          { label: "L4 Suspensions", value: "8", tone: "red" },
          { label: "L5 Bans", value: "2", hint: "Auto + review", tone: "red" },
        ],
        mainTitle: "Enforcement events (last 30d)",
        mainDescription: "Level applied, STL impact, coin lock action, and review status.",
        columns: ["Event", "User", "Level", "STL Δ", "Coin lock"],
        rows: [
          { id: "p-01", cells: ["Refund abuse", "Shop-441", <Chip key="l" label="L3" tone="amber" />, "-18", "Frozen 14d"] },
          { id: "p-02", cells: ["No-show (repeat)", "Advocate-22", <Chip key="l" label="L2" tone="amber" />, "-10", "—"] },
          { id: "p-03", cells: ["Fraud ring", "Shop-112", <Chip key="l" label="L5" tone="red" />, "-50", "Slashed 100%"] },
          { id: "p-04", cells: ["Late delivery", "Shop-89", <Chip key="l" label="L1" tone="cyan" />, "-4", "—"] },
        ],
        accentVisual: <PenaltyLadder />,
      },
      appeals: {
        key: "appeals",
        eyebrow: "Operations · Complaints",
        title: "Appeals",
        description: "Complaints under user-initiated appeal. Must be reviewed within 72h.",
        stats: [
          { label: "Under appeal", value: "22", tone: "amber" },
          { label: "Due 24h", value: "8", hint: "Critical", tone: "red" },
          { label: "Overturned 30d", value: "11", hint: "29% rate", tone: "cyan" },
          { label: "Upheld 30d", value: "27", tone: "green" },
        ],
        mainTitle: "Active appeals",
        mainDescription: "Clock shows time remaining to decision. Decision auto-restores STL on overturn.",
        columns: ["Appeal", "Original level", "User claim", "Clock", "Reviewer"],
        rows: [
          { id: "a-01", cells: ["APL-541 · CMP-8812", <Chip key="l" label="L3" tone="amber" />, "Product delivered", "18h", "Ali R."] },
          { id: "a-02", cells: ["APL-540 · CMP-8804", <Chip key="l" label="L2" tone="amber" />, "Payment proof", "32h", "Sara A."] },
          { id: "a-03", cells: ["APL-539 · CMP-8799", <Chip key="l" label="L4" tone="red" />, "Mistaken identity", "4h", "Director"] },
        ],
      },
      history: {
        key: "history",
        eyebrow: "Operations · Complaints",
        title: "Resolution history",
        description: "Archived complaints with final decision, penalty applied, and STL restoration if any.",
        stats: [
          { label: "Resolved 30d", value: "612", tone: "green" },
          { label: "Penalty applied", value: "438", tone: "amber" },
          { label: "Dismissed", value: "174", tone: "slate" },
          { label: "Avg resolve", value: "2d 4h", tone: "teal" },
        ],
        mainTitle: "Recent resolutions",
        mainDescription: "Last 20 closed complaints.",
        columns: ["Complaint", "Module", "Final level", "Days to close", "Outcome"],
        rows: [
          { id: "h-01", cells: ["CMP-8744", <Chip key="m" label="GoSellr" tone="purple" />, <Chip key="l" label="L2" tone="amber" />, "2d", <Chip key="o" label="Penalty" tone="amber" />] },
          { id: "h-02", cells: ["CMP-8743", <Chip key="m" label="OLS" tone="amber" />, <Chip key="l" label="—" tone="slate" />, "4d", <Chip key="o" label="Dismissed" tone="slate" />] },
          { id: "h-03", cells: ["CMP-8742", <Chip key="m" label="WMS" tone="teal" />, <Chip key="l" label="L4" tone="red" />, "3d", <Chip key="o" label="Banned" tone="red" />] },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  4. EARNINGS-ENGINE  (Operations · amber)  — scaffold
  // ═════════════════════════════════════════════════════════════════════
  "earnings-engine": {
    key: "earnings-engine",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    label: "Earnings Engine",
    href: "/dmo/earnings-engine",
    accent: "amber",
    groupLabel: "Operations",
    tagline: "40/25/20/15 revenue split across seller, EHB, franchise, affiliate.",
    navItems: [
      { key: "overview", label: "Overview", href: "/dmo/earnings-engine", description: "Engine pulse." },
      { key: "split", label: "40/25/20/15 split", href: "/dmo/earnings-engine/split", description: "Live routing." },
      { key: "payouts", label: "Payouts", href: "/dmo/earnings-engine/payouts", description: "Scheduled + sent." },
      { key: "history", label: "History", href: "/dmo/earnings-engine/history", description: "Payout archive." },
    ],
    views: {
      split: {
        key: "split",
        eyebrow: "Operations · Earnings Engine",
        title: "40 / 25 / 20 / 15 split",
        description: "Every transaction is routed across 4 destinations per the EHB revenue model.",
        stats: [
          { label: "Routed 24h", value: "$184K", tone: "amber" },
          { label: "Seller (40%)", value: "$73.6K", tone: "purple" },
          { label: "EHB (25%)", value: "$46.0K", tone: "teal" },
          { label: "Franchise (20%)", value: "$36.8K", tone: "amber" },
        ],
        mainTitle: "Routing breakdown",
        mainDescription: "Live wallet routing preview.",
        columns: ["Destination", "Share", "Amount 24h", "Count", "Queue"],
        rows: [
          { id: "s-01", cells: ["Seller", <Chip key="p" label="40%" tone="purple" />, "$73.6K", "1,284", "0"] },
          { id: "s-02", cells: ["EHB treasury", <Chip key="p" label="25%" tone="teal" />, "$46.0K", "1,284", "0"] },
          { id: "s-03", cells: ["Franchise", <Chip key="p" label="20%" tone="amber" />, "$36.8K", "412", "3"] },
          { id: "s-04", cells: ["Affiliate", <Chip key="p" label="15%" tone="cyan" />, "$27.6K", "238", "0"] },
        ],
        accentVisual: <WalletSplitRing />,
      },
      payouts: {
        key: "payouts",
        eyebrow: "Operations · Earnings Engine",
        title: "Scheduled payouts",
        description: "Outbound payouts to sellers, franchise networks, and the affiliate chain. Auto-dispatch respects STL + PSS health checks.",
        stats: [
          { label: "Scheduled 24h", value: "$82.4K", hint: "42 payouts", tone: "amber" },
          { label: "Due today", value: "$14.6K", hint: "18 payouts", tone: "red" },
          { label: "Franchise share", value: "$56.2K", tone: "amber" },
          { label: "Affiliate share", value: "$26.2K", tone: "cyan" },
        ],
        mainTitle: "Payout queue",
        mainDescription: "Next 48 hours. Auto-dispatched when STL + PSS pass.",
        columns: ["Payout", "Target", "Amount", "Send at", "Status"],
        rows: [
          { id: "po-01", cells: ["PO-3312", "Franchise · Karachi Sub", "$12,400", "Today 18:00", <Chip key="s" label="Scheduled" tone="amber" />] },
          { id: "po-02", cells: ["PO-3311", "Affiliate · Level 2 chain", "$3,200", "Today 18:00", <Chip key="s" label="Scheduled" tone="amber" />] },
          { id: "po-03", cells: ["PO-3310", "Franchise · Lahore Corp", "$18,900", "Tomorrow 09:00", <Chip key="s" label="Queued" tone="slate" />] },
          {
            id: "po-04",
            cells: ["PO-3309", "Seller · Shop-441", "$1,200", "Today 18:00", <Chip key="s" label="Hold · STL" tone="red" />],
            drawer: {
              eyebrow: "Operations · Earnings Engine · Payout",
              title: "PO-3309 · Hold on Shop-441",
              subtitle: "Automatic dispatch blocked — seller STL dropped below L3 threshold.",
              accent: "red",
              fields: [
                { label: "Payout ID", value: "PO-3309" },
                { label: "Target", value: "Shop-441" },
                { label: "Amount", value: "$1,200", tone: "amber" },
                { label: "Schedule", value: "Today 18:00" },
                { label: "STL", value: "L2.8", tone: "red" },
                { label: "Status", value: "Hold", tone: "red" },
              ],
              timeline: [
                { time: "3h ago", label: "Payout queued", body: "Auto-generated from DEAL-9811 settlement batch.", tone: "amber" },
                { time: "1h ago", label: "STL check failed", body: "Shop-441 STL dropped from L3.2 → L2.8 after complaint CMP-8821.", tone: "red" },
                { time: "1h ago", label: "Hold applied", body: "Auto-dispatch blocked. Queue notified DMO operator.", tone: "amber" },
              ],
              evidence: [
                { label: "Hold rule", body: "Payouts require STL ≥ L3 for auto-dispatch.", tone: "teal" },
                { label: "Linked complaint", body: "CMP-8821 · P1 · item not delivered (live).", tone: "red" },
                { label: "Revenue split", body: "40/25/20/15 · seller share = $480 frozen.", tone: "amber" },
              ],
              actions: [
                { label: "Override + release", tone: "amber" },
                { label: "Freeze indefinitely", tone: "red" },
                { label: "Split to escrow", tone: "teal" },
              ],
            },
          },
          { id: "po-05", cells: ["PO-3308", "Franchise · ISB Country", "$24,100", "Tomorrow 09:00", <Chip key="s" label="Queued" tone="slate" />] },
          { id: "po-06", cells: ["PO-3307", "Affiliate · Level 3", "$820", "Today 18:00", <Chip key="s" label="Scheduled" tone="amber" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Auto-dispatch eligible", body: "18 payouts passed all health checks and will auto-dispatch at 18:00.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "1 payout on hold", body: "Shop-441 payout blocked — STL dropped below L3. Manual review required.", tone: "red" },
        ],
        accentVisual: <PayoutSparkline />,
      },
      history: {
        key: "history",
        eyebrow: "Operations · Earnings Engine",
        title: "Payout history",
        description: "Archive of completed payouts with transaction hashes and settlement proofs.",
        stats: [
          { label: "Sent 30d", value: "$1.84M", hint: "412 tx", tone: "green" },
          { label: "Avg size", value: "$4,466", tone: "amber" },
          { label: "Failed", value: "2", hint: "0.48%", tone: "red" },
          { label: "Settlement p95", value: "4.2s", tone: "teal" },
        ],
        mainTitle: "Recent completed payouts",
        mainDescription: "Last 20 transactions, newest first.",
        columns: ["Tx", "Target", "Amount", "Date", "Status"],
        rows: [
          { id: "h-01", cells: [<span key="t" className="font-mono text-[10px]">0xabc1…4412</span>, "Franchise · KHI", "$14,100", "Yesterday", <Chip key="s" label="Sent" tone="green" />] },
          { id: "h-02", cells: [<span key="t" className="font-mono text-[10px]">0xabc0…4411</span>, "Affiliate L3", "$2,800", "Yesterday", <Chip key="s" label="Sent" tone="green" />] },
          { id: "h-03", cells: [<span key="t" className="font-mono text-[10px]">0xabbf…4410</span>, "Franchise · LHE", "$18,400", "2d ago", <Chip key="s" label="Sent" tone="green" />] },
          { id: "h-04", cells: [<span key="t" className="font-mono text-[10px]">0xabbe…4409</span>, "Affiliate L2", "$5,100", "2d ago", <Chip key="s" label="Sent" tone="green" />] },
          { id: "h-05", cells: [<span key="t" className="font-mono text-[10px]">0xabbd…4408</span>, "Franchise · ISB", "$22,200", "3d ago", <Chip key="s" label="Sent" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Settlement health", body: "P95 settlement time improved to 4.2s this week (-18%).", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "2 failed", body: "Both retry-ready. Auto-retry scheduled in next batch.", tone: "amber" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  5. REFILL-MANAGEMENT  (Operations · teal)  — scaffold
  // ═════════════════════════════════════════════════════════════════════
  "refill-management": {
    key: "refill-management",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    label: "Refill Management",
    href: "/dmo/refill-management",
    accent: "teal",
    groupLabel: "Operations",
    tagline: "Periodic re-verification for PSS, CRB, and industry entities.",
    navItems: [
      { key: "active", label: "Active", href: "/dmo/refill-management/active", description: "Healthy refills." },
      { key: "expiring", label: "Expiring", href: "/dmo/refill-management/expiring", description: "Due within 7 days." },
      { key: "expired", label: "Expired", href: "/dmo/refill-management/expired", description: "Overdue and impacting STL." },
      { key: "completed", label: "Completed", href: "/dmo/refill-management/completed", description: "Successfully refilled." },
    ],
    views: {
      active: {
        key: "active",
        eyebrow: "Operations · Refill Management",
        title: "Active refills",
        description: "Users and entities with healthy, up-to-date verification cycles across PSS and CRB.",
        stats: [
          { label: "Active", value: "2,184", hint: "PSS + CRB", tone: "teal" },
          { label: "PSS", value: "1,412", tone: "teal" },
          { label: "CRB", value: "772", tone: "amber" },
          { label: "Avg cycle", value: "90d", tone: "cyan" },
        ],
        mainTitle: "Active refill tracking",
        mainDescription: "All users currently within their verification window.",
        columns: ["User", "Type", "Last refill", "Next due", "Status"],
        rows: [
          { id: "a-01", cells: ["Ali R.", <Chip key="t" label="PSS" tone="teal" />, "01 Mar", "28 May", <Chip key="s" label="Healthy" tone="green" />] },
          { id: "a-02", cells: ["Sara A.", <Chip key="t" label="CRB" tone="amber" />, "12 Feb", "12 May", <Chip key="s" label="Healthy" tone="green" />] },
          { id: "a-03", cells: ["Shop-441", <Chip key="t" label="CRB" tone="amber" />, "28 Jan", "28 Apr", <Chip key="s" label="Healthy" tone="green" />] },
          { id: "a-04", cells: ["Clinic-12", <Chip key="t" label="CRB" tone="amber" />, "15 Feb", "15 May", <Chip key="s" label="Healthy" tone="green" />] },
          { id: "a-05", cells: ["Tutor-07", <Chip key="t" label="PSS" tone="teal" />, "22 Feb", "22 May", <Chip key="s" label="Healthy" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "All healthy", body: "No action needed. Next refill batch auto-starts in 28 days.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Cycle adherence", body: "98% of active users complete refills within the 90-day window.", tone: "teal" },
        ],
      },
      expiring: {
        key: "expiring",
        eyebrow: "Operations · Refill Management",
        title: "Expiring soon",
        description: "Users whose verification is due within the next 7 days. Auto-reminder has been sent.",
        stats: [
          { label: "Expiring 7d", value: "312", hint: "+42 today", tone: "amber" },
          { label: "Due today", value: "42", hint: "Urgent", tone: "red" },
          { label: "Due in 3d", value: "128", tone: "amber" },
          { label: "Notified", value: "100%", tone: "teal" },
        ],
        mainTitle: "Expiry countdown queue",
        mainDescription: "Sorted by days remaining. Click row to resend reminder or escalate.",
        columns: ["User", "Type", "Last refill", "Due", "Countdown"],
        rows: [
          { id: "e-01", cells: ["Usman T.", <Chip key="t" label="PSS" tone="teal" />, "08 Feb", "15 Apr", <Chip key="s" label="3 days" tone="amber" />] },
          { id: "e-02", cells: ["Ayesha M.", <Chip key="t" label="CRB" tone="amber" />, "06 Feb", "13 Apr", <Chip key="s" label="2 days" tone="red" />] },
          { id: "e-03", cells: ["Omar K.", <Chip key="t" label="PSS" tone="teal" />, "10 Feb", "17 Apr", <Chip key="s" label="5 days" tone="amber" />] },
          { id: "e-04", cells: ["Fatima S.", <Chip key="t" label="CRB" tone="amber" />, "12 Feb", "19 Apr", <Chip key="s" label="7 days" tone="cyan" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>, title: "42 due today", body: "Auto-reminders already sent. SMS + email + in-app push.", tone: "amber" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "STL impact warning", body: "If 42 users miss today's deadline, STL impact is ~-320 points across the network.", tone: "red" },
        ],
        accentVisual: <RefillCountdownGrid />,
      },
      expired: {
        key: "expired",
        eyebrow: "Operations · Refill Management",
        title: "Expired refills",
        description: "Overdue verifications. STL score automatically reduced per the penalty ladder.",
        stats: [
          { label: "Expired", value: "48", hint: "30d total", tone: "red" },
          { label: "STL avg drop", value: "-5", hint: "Per user", tone: "red" },
          { label: "Critical", value: "12", hint: "Overdue >14d", tone: "red" },
          { label: "Auto-notify", value: "36", hint: "Sent", tone: "amber" },
        ],
        mainTitle: "Overdue entries",
        mainDescription: "Sorted by days overdue. Grace period is 3 days before STL deduction starts.",
        columns: ["User", "Type", "Was due", "Overdue", "STL Δ"],
        rows: [
          { id: "x-01", cells: ["Omar K.", <Chip key="t" label="PSS" tone="teal" />, "05 Apr", <Chip key="s" label="-6 days" tone="red" />, "-6"] },
          { id: "x-02", cells: ["Shop-99", <Chip key="t" label="CRB" tone="amber" />, "02 Apr", <Chip key="s" label="-9 days" tone="red" />, "-12"] },
          { id: "x-03", cells: ["Clinic-44", <Chip key="t" label="CRB" tone="amber" />, "28 Mar", <Chip key="s" label="-14 days" tone="red" />, "-18"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "Critical batch", body: "12 users overdue more than 14 days. STL auto-drop to L0 triggered.", tone: "red" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, title: "Manual outreach", body: "Franchise inspectors should contact critical batch within 24h.", tone: "amber" },
        ],
      },
      completed: {
        key: "completed",
        eyebrow: "Operations · Refill Management",
        title: "Completed refills",
        description: "Successfully renewed verifications in the last 30 days with STL restoration events.",
        stats: [
          { label: "Completed 30d", value: "412", hint: "98% success", tone: "green" },
          { label: "STL restored", value: "284", hint: "Auto", tone: "teal" },
          { label: "Avg processing", value: "4h", tone: "cyan" },
          { label: "Auto-completed", value: "384", hint: "93%", tone: "green" },
        ],
        mainTitle: "Recently completed",
        mainDescription: "Last 20 refills, newest first.",
        columns: ["User", "Type", "Completed", "Cycle", "Status"],
        rows: [
          { id: "c-01", cells: ["Ali R.", <Chip key="t" label="PSS" tone="teal" />, "Yesterday", "3 months", <Chip key="s" label="Renewed" tone="green" />] },
          { id: "c-02", cells: ["Sara A.", <Chip key="t" label="CRB" tone="amber" />, "Yesterday", "3 months", <Chip key="s" label="Renewed" tone="green" />] },
          { id: "c-03", cells: ["Usman T.", <Chip key="t" label="PSS" tone="teal" />, "2d ago", "3 months", <Chip key="s" label="Renewed" tone="green" />] },
          { id: "c-04", cells: ["Shop-89", <Chip key="t" label="CRB" tone="amber" />, "3d ago", "3 months", <Chip key="s" label="Renewed" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Renewal rate", body: "98% of expiring users successfully renew within grace period.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Auto-completion", body: "93% of renewals are fully automated (no human review).", tone: "teal" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  6. ACTIVITY-ENGINE  (Intelligence · purple)  — scaffold
  // ═════════════════════════════════════════════════════════════════════
  "activity-engine": {
    key: "activity-engine",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    label: "Activity Engine",
    href: "/dmo/activity-engine",
    accent: "purple",
    groupLabel: "Intelligence",
    tagline: "Live event stream, rollups, and audit trail for DMO operators.",
    navItems: [
      { key: "live", label: "Live feed", href: "/dmo/activity-engine", description: "Real-time event stream." },
      { key: "last-24h", label: "Last 24h", href: "/dmo/activity-engine/last-24h", description: "Rolled up metrics." },
      { key: "last-7d", label: "Last 7d", href: "/dmo/activity-engine/last-7d", description: "Weekly rollup." },
      { key: "audit", label: "Audit log", href: "/dmo/activity-engine/audit", description: "Immutable decision log." },
    ],
    views: {
      "last-24h": {
        key: "last-24h",
        eyebrow: "Intelligence · Activity Engine",
        title: "Last 24 hours",
        description: "Aggregated activity metrics and live event pulse across all EHB modules.",
        stats: [
          { label: "Events 24h", value: "4,812", hint: "+8% WoW", tone: "purple" },
          { label: "Approvals", value: "298", hint: "+3%", tone: "teal" },
          { label: "New users", value: "184", hint: "+12%", tone: "cyan" },
          { label: "Fraud flags", value: "6", hint: "Up-Guard", tone: "red" },
        ],
        mainTitle: "Metric rollup",
        mainDescription: "Module-level activity counts for the last 24 hours.",
        columns: ["Module", "Metric", "Count", "Δ", "Health"],
        rows: [
          { id: "m-01", cells: [<Chip key="m" label="GoSellr" tone="purple" />, "Orders", "1,284", "+12%", <Chip key="h" label="OK Healthy" tone="green" />] },
          { id: "m-02", cells: [<Chip key="m" label="WMS" tone="teal" />, "Bookings", "412", "+4%", <Chip key="h" label="OK Healthy" tone="green" />] },
          { id: "m-03", cells: [<Chip key="m" label="OLS" tone="amber" />, "Cases", "184", "-2%", <Chip key="h" label="OK Healthy" tone="green" />] },
          { id: "m-04", cells: [<Chip key="m" label="PSS" tone="teal" />, "Checks", "1,184", "+12%", <Chip key="h" label="OK Healthy" tone="green" />] },
          { id: "m-05", cells: [<Chip key="m" label="CRB" tone="amber" />, "Reviews", "298", "+8%", <Chip key="h" label="OK Healthy" tone="green" />] },
          { id: "m-06", cells: [<Chip key="m" label="Complaints" tone="red" />, "New", "87", "+14%", <Chip key="h" label="W Spike" tone="amber" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Activity spike", body: "2× normal at 14:00–17:00 — holiday sale traffic to GoSellr.", tone: "amber" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Pattern detected", body: "Complaint volume up 14% — mostly delivery issues in Karachi.", tone: "amber" },
        ],
        accentVisual: <LivePulseTimeline />,
      },
      "last-7d": {
        key: "last-7d",
        eyebrow: "Intelligence · Activity Engine",
        title: "Last 7 days",
        description: "Weekly rollup showing trajectory across the full EHB network.",
        stats: [
          { label: "Events 7d", value: "28,412", hint: "+12% WoW", tone: "purple" },
          { label: "Peak day", value: "Wed", hint: "5,124 events", tone: "teal" },
          { label: "Avg daily", value: "4,058", tone: "cyan" },
          { label: "Off-peak", value: "Sun", hint: "2,814 events", tone: "slate" },
        ],
        mainTitle: "Weekly metric trends",
        mainDescription: "Core KPIs with week-over-week delta.",
        columns: ["Metric", "7d count", "Δ WoW", "Trajectory"],
        rows: [
          { id: "w-01", cells: ["Applications", "2,814", "+4%", <Chip key="t" label="Steady" tone="green" />] },
          { id: "w-02", cells: ["Approvals", "2,112", "+2%", <Chip key="t" label="Steady" tone="green" />] },
          { id: "w-03", cells: ["STL updates", "18,412", "+6%", <Chip key="t" label="Growing" tone="teal" />] },
          { id: "w-04", cells: ["PSS checks", "8,184", "+12%", <Chip key="t" label="Growing" tone="teal" />] },
          { id: "w-05", cells: ["Complaints", "412", "+14%", <Chip key="t" label="Spike" tone="amber" />] },
          { id: "w-06", cells: ["Penalty events", "84", "-8%", <Chip key="t" label="Improving" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Growth steady", body: "Core metrics all positive. STL engine handling 18K updates/week cleanly.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Weekly cadence", body: "Midweek peak (Wed) aligns with small-business activity windows.", tone: "cyan" },
        ],
      },
      audit: {
        key: "audit",
        eyebrow: "Intelligence · Activity Engine",
        title: "Audit log",
        description: "Immutable, hash-verified record of every DMO operator decision.",
        stats: [
          { label: "Records 30d", value: "18,412", tone: "purple" },
          { label: "DMO actions", value: "1,284", tone: "teal" },
          { label: "Officer actions", value: "16,128", tone: "cyan" },
          { label: "Hash-verified", value: "100%", hint: "SHA-256", tone: "green" },
        ],
        mainTitle: "Recent decisions",
        mainDescription: "Last 20 operator decisions with hash proof.",
        columns: ["Actor", "Action", "Target", "When", "Hash"],
        rows: [
          { id: "au-01", cells: ["Ali R.", <Chip key="a" label="APP.APPROVE" tone="green" />, "app-1021", "2m ago", <span key="h" className="font-mono text-[10px] text-white/55">0xab…4412</span>] },
          { id: "au-02", cells: ["Sara A.", <Chip key="a" label="CMP.ESCALATE" tone="amber" />, "cmp-8820", "14m ago", <span key="h" className="font-mono text-[10px] text-white/55">0xab…4411</span>] },
          { id: "au-03", cells: ["Director", <Chip key="a" label="USER.SUSPEND" tone="red" />, "usr-4412", "28m ago", <span key="h" className="font-mono text-[10px] text-white/55">0xab…4410</span>] },
          { id: "au-04", cells: ["Usman T.", <Chip key="a" label="STL.OVERRIDE" tone="purple" />, "ent-1184", "42m ago", <span key="h" className="font-mono text-[10px] text-white/55">0xab…4409</span>] },
          { id: "au-05", cells: ["Ayesha M.", <Chip key="a" label="CRB.ISSUE" tone="teal" />, "crb-882", "1h ago", <span key="h" className="font-mono text-[10px] text-white/55">0xab…4408</span>] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: "Integrity verified", body: "All 18,412 records hash-chained on Polkadot relay. Zero tampering detected.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>, title: "Compliance ready", body: "Full 30-day audit trail available for regulator export.", tone: "teal" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  7. TASK-SYSTEM  (Intelligence · cyan)
  // ═════════════════════════════════════════════════════════════════════
  "task-system": {
    key: "task-system",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    label: "Task System",
    href: "/dmo/task-system",
    accent: "cyan",
    groupLabel: "Intelligence",
    tagline: "Operator inbox, queues, SLA timers, and routing rules.",
    navItems: [
      { key: "inbox", label: "Inbox", href: "/dmo/task-system", description: "My tasks." },
      { key: "queues", label: "Queues", href: "/dmo/task-system/queues", description: "Shared queues." },
      { key: "sla", label: "SLA timers", href: "/dmo/task-system/sla", description: "Breach risk." },
      { key: "routing", label: "Routing rules", href: "/dmo/task-system/routing", description: "Auto-assignment." },
    ],
    views: {
      queues: {
        key: "queues",
        eyebrow: "Intelligence · Task System",
        title: "Shared work queues",
        description: "Cross-module queues feeding every operator pool. Depth, wait time, and health are tracked live.",
        stats: [
          { label: "Total open", value: "214", hint: "+28 today", tone: "cyan" },
          { label: "Avg wait", value: "3h 12m", tone: "teal" },
          { label: "At risk", value: "14", hint: "SLA <2h", tone: "amber" },
          { label: "Operators", value: "38", hint: "Online", tone: "green" },
        ],
        mainTitle: "Active queues",
        mainDescription: "All shared work queues sorted by health.",
        columns: ["Queue", "Depth", "Avg wait", "Operators", "Health"],
        rows: [
          { id: "q-01", cells: ["PSS L1 review", "42", "4h 12m", "8", <Chip key="h" label="Healthy" tone="green" />] },
          { id: "q-02", cells: ["CRB inspection", "18", "11h 04m", "6", <Chip key="h" label="Healthy" tone="green" />] },
          { id: "q-03", cells: ["Complaints P1", "9", "42m", "4", <Chip key="h" label="At risk" tone="amber" />] },
          { id: "q-04", cells: ["Wallet unlock", "14", "22m", "3", <Chip key="h" label="Healthy" tone="green" />] },
          { id: "q-05", cells: ["Up-Guard triage", "22", "1h 48m", "5", <Chip key="h" label="Healthy" tone="green" />] },
          { id: "q-06", cells: ["Refund disputes", "6", "3h 20m", "2", <Chip key="h" label="At risk" tone="amber" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>, title: "Inflow spike", body: "Complaints P1 queue grew 42% in last 2 hours — consider surge routing.", tone: "amber" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Load balance", body: "Wallet unlock queue healthy — 3 operators handling 14 items in 22m avg.", tone: "teal" },
        ],
        accentVisual: <SlaRingGrid />,
      },
      sla: {
        key: "sla",
        eyebrow: "Intelligence · Task System",
        title: "SLA timers",
        description: "Tasks approaching or past their SLA window. Breach triggers auto-escalation to DMO Director.",
        stats: [
          { label: "At risk", value: "14", hint: "<2h left", tone: "amber" },
          { label: "Critical", value: "4", hint: "<15m left", tone: "red" },
          { label: "Breached 24h", value: "2", tone: "red" },
          { label: "SLA hit 7d", value: "94%", tone: "green" },
        ],
        mainTitle: "Tasks nearing breach",
        mainDescription: "Sorted by time remaining. Auto-escalation at 0.",
        columns: ["Task", "Type", "Ref", "Owner", "Remaining"],
        rows: [
          { id: "s-01", cells: ["T-8821", <Chip key="t" label="Complaint P1" tone="red" />, "CMP-8821", "Ali R.", <Chip key="r" label="12m" tone="red" />] },
          { id: "s-02", cells: ["T-8820", <Chip key="t" label="Complaint P1" tone="red" />, "CMP-8820", "Sara A.", <Chip key="r" label="1h 04m" tone="amber" />] },
          { id: "s-03", cells: ["T-8819", <Chip key="t" label="CRB inspect" tone="amber" />, "APP-4412", "Usman T.", <Chip key="r" label="1h 48m" tone="amber" />] },
          { id: "s-04", cells: ["T-8818", <Chip key="t" label="PSS L2" tone="teal" />, "KYC-9921", "Ayesha M.", <Chip key="r" label="1h 52m" tone="amber" />] },
          { id: "s-05", cells: ["T-8817", <Chip key="t" label="Wallet lock" tone="purple" />, "WAL-3112", "Omar K.", <Chip key="r" label="2h 08m" tone="cyan" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "Auto-escalation armed", body: "T-8821 will escalate to DMO Director in 12m if unresolved.", tone: "red" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "SLA trend", body: "7-day SLA hit rate holding steady at 94% — above 90% target.", tone: "green" },
        ],
        accentVisual: <SlaRingGrid />,
      },
      routing: {
        key: "routing",
        eyebrow: "Intelligence · Task System",
        title: "Routing rules",
        description: "Auto-assignment rules that route tasks to the right pool based on type, severity, and geography.",
        stats: [
          { label: "Active rules", value: "42", tone: "cyan" },
          { label: "Auto-routed 24h", value: "1,184", hint: "94%", tone: "green" },
          { label: "Manual override", value: "68", tone: "amber" },
          { label: "Failures", value: "2", tone: "red" },
        ],
        mainTitle: "Rule catalog",
        mainDescription: "All active routing rules, ordered by priority.",
        columns: ["Rule", "Trigger", "Target", "Mode", "Status"],
        rows: [
          { id: "r-01", cells: ["PSS L1 → PSS pool", "KYC doc review", "PSS ops", <Chip key="m" label="Auto" tone="teal" />, <Chip key="s" label="Active" tone="green" />] },
          { id: "r-02", cells: ["CRB inspect → Franchise", "Local franchise", "Franchise sub", <Chip key="m" label="Auto" tone="teal" />, <Chip key="s" label="Active" tone="green" />] },
          { id: "r-03", cells: ["Complaint P1 → Director", "Severity=P1", "DMO Director", <Chip key="m" label="Manual" tone="amber" />, <Chip key="s" label="Active" tone="green" />] },
          { id: "r-04", cells: ["Wallet unlock → Wallet ops", "Amount <$500", "Wallet pool", <Chip key="m" label="Auto" tone="teal" />, <Chip key="s" label="Active" tone="green" />] },
          { id: "r-05", cells: ["Up-Guard critical → SRE", "Confidence >0.9", "SRE oncall", <Chip key="m" label="Auto" tone="teal" />, <Chip key="s" label="Active" tone="green" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/></svg>, title: "Auto-route rate", body: "94% of tasks auto-routed this week — only 68 needed manual override.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/></svg>, title: "New rule in draft", body: "Draft: 'Karachi delivery complaints → regional team'. Awaiting approval.", tone: "purple" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  8. AI-ASSISTANT  (Intelligence · purple)
  // ═════════════════════════════════════════════════════════════════════
  "ai-assistant": {
    key: "ai-assistant",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>,
    label: "AI Assistant",
    href: "/dmo/ai-assistant",
    accent: "purple",
    groupLabel: "Intelligence",
    tagline: "Claude-powered decision support, proactive suggestions, and audited history.",
    navItems: [
      { key: "chat", label: "Chat", href: "/dmo/ai-assistant", description: "Conversational assistant." },
      { key: "suggestions", label: "Suggestions", href: "/dmo/ai-assistant/suggestions", description: "Proactive insights." },
      { key: "recommendations", label: "Recommendations", href: "/dmo/ai-recommendations", description: "Module recommendations." },
      { key: "history", label: "History", href: "/dmo/ai-assistant/history", description: "Past conversations." },
    ],
    views: {
      suggestions: {
        key: "suggestions",
        eyebrow: "Intelligence · AI Assistant",
        title: "Active suggestions",
        description: "Proactive insights generated from live DMO signals — escalations, optimizations, and pattern detections.",
        stats: [
          { label: "Open", value: "18", hint: "+6 today", tone: "purple" },
          { label: "High priority", value: "7", tone: "red" },
          { label: "Accepted 7d", value: "84%", tone: "green" },
          { label: "Confidence avg", value: "0.91", tone: "teal" },
        ],
        mainTitle: "Live suggestion queue",
        mainDescription: "Sorted by priority. One-click accept routes to the target module.",
        columns: ["", "Suggestion", "Priority", "Source", "Confidence"],
        rows: [
          { id: "g-01", cells: [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, "Escalate 3 P1 complaints past SLA", <Chip key="p" label="High" tone="red" />, "Complaints · CMP-8821 +2", "0.96"] },
          { id: "g-02", cells: [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, "Auto-release 42 escrows passing all checks", <Chip key="p" label="Medium" tone="amber" />, "Wallet · Escrow", "0.92"] },
          { id: "g-03", cells: [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, "Add fraud rule for Karachi delivery spike", <Chip key="p" label="High" tone="red" />, "Up-Guard · Signals", "0.89"] },
          { id: "g-04", cells: [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, "Raise STL threshold for OLS advocates", <Chip key="p" label="Medium" tone="amber" />, "STL · Scores", "0.84"] },
          { id: "g-05", cells: [<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>, "Shorten PSS refill window from 90d → 60d", <Chip key="p" label="Low" tone="cyan" />, "Refill Mgmt", "0.78"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, title: "High acceptance", body: "Operators accepted 84% of suggestions this week — a 7-point improvement.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Pattern model learning", body: "Karachi delivery complaint pattern detected 3x faster than last month.", tone: "purple" },
        ],
        accentVisual: <ChatBubbleMock />,
      },
      history: {
        key: "history",
        eyebrow: "Intelligence · AI Assistant",
        title: "Conversation history",
        description: "Audited archive of every AI chat, suggestion, and decision. Every interaction is stored on-chain for compliance.",
        stats: [
          { label: "Sessions 30d", value: "1,284", tone: "purple" },
          { label: "Unique users", value: "42", tone: "cyan" },
          { label: "Avg length", value: "6 turns", tone: "teal" },
          { label: "Cited actions", value: "312", hint: "audited", tone: "green" },
        ],
        mainTitle: "Recent conversations",
        mainDescription: "Last 20 AI interactions with operators and directors.",
        columns: ["Actor", "Prompt", "Module", "Outcome", "When"],
        rows: [
          { id: "h-01", cells: ["Ali R.", "Draft response for CMP-8821", <Chip key="m" label="Complaints" tone="red" />, <Chip key="o" label="Accepted" tone="green" />, "2m ago"] },
          { id: "h-02", cells: ["Sara A.", "Why did Shop-441 STL drop?", <Chip key="m" label="STL" tone="teal" />, <Chip key="o" label="Explained" tone="cyan" />, "18m ago"] },
          { id: "h-03", cells: ["Director", "Forecast weekly load for complaints", <Chip key="m" label="Analytics" tone="cyan" />, <Chip key="o" label="Charted" tone="teal" />, "1h ago"] },
          { id: "h-04", cells: ["Usman T.", "Recommend next queue to take", <Chip key="m" label="Tasks" tone="cyan" />, <Chip key="o" label="Routed" tone="green" />, "2h ago"] },
          { id: "h-05", cells: ["Ayesha M.", "Explain new penalty ladder L3", <Chip key="m" label="Complaints" tone="red" />, <Chip key="o" label="Explained" tone="cyan" />, "3h ago"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: "Audit trail", body: "Every conversation is hashed + anchored to the Polkadot chain for compliance.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Operator adoption", body: "42 unique operators used the AI assistant this month — 88% of ops team.", tone: "purple" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  9. ANALYTICS  (Intelligence · cyan)
  // ═════════════════════════════════════════════════════════════════════
  analytics: {
    key: "analytics",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    label: "Analytics",
    href: "/dmo/analytics",
    accent: "cyan",
    groupLabel: "Intelligence",
    tagline: "Operator KPIs, trajectory trends, and user segment insights across the EHB super-app.",
    navItems: [
      { key: "overview", label: "Overview", href: "/dmo/analytics", description: "Top-line KPIs." },
      { key: "kpis", label: "KPIs", href: "/dmo/analytics/kpis", description: "Tracked metrics." },
      { key: "trends", label: "Trends", href: "/dmo/analytics/trends", description: "Trajectory analysis." },
      { key: "segments", label: "Segments", href: "/dmo/analytics/segments", description: "User segmentation." },
    ],
    views: {
      kpis: {
        key: "kpis",
        eyebrow: "Intelligence · Analytics",
        title: "Key performance indicators",
        description: "Top-line operator health metrics, tracked live against weekly and monthly targets.",
        stats: [
          { label: "Approval rate", value: "87%", hint: "+2% WoW", tone: "green" },
          { label: "SLA hit", value: "94%", hint: "Target 90%", tone: "green" },
          { label: "MTTR", value: "4h 21m", hint: "-18% WoW", tone: "teal" },
          { label: "STL avg", value: "L4.6", hint: "+0.1 WoW", tone: "purple" },
        ],
        mainTitle: "Tracked KPIs",
        mainDescription: "All KPIs under active measurement. Click to see breakdown by module.",
        columns: ["KPI", "Current", "Δ 7d", "Target", "Health"],
        rows: [
          { id: "k-01", cells: ["Approval rate", "87%", "+2%", "85%", <Chip key="h" label="Above" tone="green" />] },
          { id: "k-02", cells: ["SLA hit", "94%", "+1%", "90%", <Chip key="h" label="Above" tone="green" />] },
          { id: "k-03", cells: ["MTTR", "4h 21m", "-18%", "<5h", <Chip key="h" label="Above" tone="green" />] },
          { id: "k-04", cells: ["STL avg", "L4.6", "+0.1", "L4.5", <Chip key="h" label="Above" tone="green" />] },
          { id: "k-05", cells: ["Active users", "18,412", "+4%", "17,000", <Chip key="h" label="Above" tone="green" />] },
          { id: "k-06", cells: ["Complaint rate", "0.42%", "+0.06", "<0.5%", <Chip key="h" label="Watch" tone="amber" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>, title: "5 of 6 green", body: "Five of six tracked KPIs are above target. Only complaint rate needs attention.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "MTTR improvement", body: "MTTR dropped 18% week-over-week — best result since Q1 launch.", tone: "teal" },
        ],
        accentVisual: <KpiSparkGrid />,
      },
      trends: {
        key: "trends",
        eyebrow: "Intelligence · Analytics",
        title: "Trajectory trends",
        description: "7-day rolling trends for core operator metrics. Flags spikes, drops, and anomalies.",
        stats: [
          { label: "Tracked metrics", value: "24", tone: "cyan" },
          { label: "Healthy", value: "19", hint: "79%", tone: "green" },
          { label: "Watch", value: "4", tone: "amber" },
          { label: "Critical", value: "1", tone: "red" },
        ],
        mainTitle: "7-day trend snapshot",
        mainDescription: "Trajectory + signal for every tracked metric.",
        columns: ["Metric", "7d trend", "Direction", "Signal", "Note"],
        rows: [
          { id: "t-01", cells: ["Applications", "+12%", "↑", <Chip key="s" label="Healthy" tone="green" />, "Steady growth"] },
          { id: "t-02", cells: ["Complaints", "+14%", "↑", <Chip key="s" label="Watch" tone="amber" />, "Karachi delivery spike"] },
          { id: "t-03", cells: ["STL score avg", "+0.1", "→", <Chip key="s" label="Healthy" tone="green" />, "Holding band"] },
          { id: "t-04", cells: ["Approval rate", "+2%", "↑", <Chip key="s" label="Healthy" tone="green" />, "Trending up"] },
          { id: "t-05", cells: ["Refund rate", "-0.4%", "↓", <Chip key="s" label="Healthy" tone="green" />, "Down MoM"] },
          { id: "t-06", cells: ["Wallet lock rate", "+6%", "↑", <Chip key="s" label="Watch" tone="amber" />, "Manual review queue up"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>, title: "Anomaly detected", body: "Complaints rising faster than applications — investigate delivery network.", tone: "amber" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>, title: "Refunds improving", body: "Refund rate down 0.4 points this month — seller quality improving.", tone: "teal" },
        ],
        accentVisual: <KpiSparkGrid />,
      },
      segments: {
        key: "segments",
        eyebrow: "Intelligence · Analytics",
        title: "User segments",
        description: "Behavior-based segmentation across all 32 industries. Retention, STL tier, and revenue contribution tracked per segment.",
        stats: [
          { label: "Segments", value: "12", tone: "cyan" },
          { label: "Total users", value: "18,412", tone: "purple" },
          { label: "Power users", value: "412", hint: "L6+", tone: "teal" },
          { label: "At-risk", value: "318", hint: "L0–L1", tone: "red" },
        ],
        mainTitle: "Segment breakdown",
        mainDescription: "All active segments with count, tier, retention, and revenue share.",
        columns: ["Segment", "Count", "Tier", "Retention", "Revenue share"],
        rows: [
          { id: "g-01", cells: ["Power sellers", "412", <Chip key="t" label="L6+" tone="purple" />, "94%", "38%"] },
          { id: "g-02", cells: ["Active sellers", "2,184", <Chip key="t" label="L4–L5" tone="teal" />, "82%", "31%"] },
          { id: "g-03", cells: ["Casual buyers", "12,184", <Chip key="t" label="L2–L4" tone="cyan" />, "68%", "18%"] },
          { id: "g-04", cells: ["Professional svc", "2,122", <Chip key="t" label="L4+" tone="amber" />, "88%", "12%"] },
          { id: "g-05", cells: ["At risk", "318", <Chip key="t" label="L0–L1" tone="red" />, "28%", "1%"] },
          { id: "g-06", cells: ["New joiners", "1,192", <Chip key="t" label="L0" tone="slate" />, "—", "0%"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>, title: "Power users dominate", body: "Top 412 sellers (2% of users) drive 38% of revenue.", tone: "purple" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "At-risk attrition", body: "At-risk segment retention only 28% — targeted re-engagement needed.", tone: "red" },
        ],
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  //  10. BLOCKCHAIN-CONTROL  (Intelligence · teal)
  // ═════════════════════════════════════════════════════════════════════
  "blockchain-control": {
    key: "blockchain-control",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="6" height="10" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/><path d="M8 12h8"/></svg>,
    label: "Blockchain Control",
    href: "/dmo/blockchain-control",
    accent: "teal",
    groupLabel: "Intelligence",
    tagline: "Polkadot-anchored STL proofs, CRB certificate hashes, and an immutable event ledger.",
    navItems: [
      { key: "overview", label: "Overview", href: "/dmo/blockchain-control", description: "Chain pulse." },
      { key: "stl-proofs", label: "STL proofs", href: "/dmo/blockchain-control/stl-proofs", description: "On-chain STL anchors." },
      { key: "crb-hashes", label: "CRB hashes", href: "/dmo/blockchain-control/crb-hashes", description: "Certificate hashes." },
      { key: "explorer", label: "Explorer", href: "/dmo/blockchain-control/explorer", description: "Block browser." },
    ],
    views: {
      "stl-proofs": {
        key: "stl-proofs",
        eyebrow: "Intelligence · Blockchain Control",
        title: "STL proofs",
        description: "Every STL score change is anchored to the Polkadot chain as a cryptographic proof — auditors can verify without trusting EHB.",
        stats: [
          { label: "Anchored 24h", value: "412", hint: "STL events", tone: "teal" },
          { label: "Total anchors", value: "184.2K", tone: "cyan" },
          { label: "Avg latency", value: "6.2s", tone: "green" },
          { label: "Failures", value: "0", tone: "green" },
        ],
        mainTitle: "Recent STL anchors",
        mainDescription: "Latest STL score changes committed to chain.",
        columns: ["Tx hash", "Entity", "Change", "Block", "When"],
        rows: [
          {
            id: "p-01",
            cells: [<span key="t" className="font-mono text-[10px]">0xabc1…4412</span>, "entity-1184", <Chip key="c" label="L5 → L6" tone="green" />, "48,112", "2m ago"],
            drawer: {
              eyebrow: "Intelligence · Blockchain · STL Proof",
              title: "0xabc1…4412 · STL anchor",
              subtitle: "On-chain proof of an STL score change, verifiable against the Polkadot parachain.",
              accent: "teal",
              fields: [
                { label: "Tx hash", value: "0xabc1…4412", tone: "teal" },
                { label: "Block", value: "#48,112" },
                { label: "Entity", value: "entity-1184" },
                { label: "Change", value: "L5 → L6", tone: "green" },
                { label: "Confirmations", value: "6 / 6", tone: "green" },
                { label: "Anchored", value: "2m ago" },
              ],
              timeline: [
                { time: "2m ago", label: "STL computed", body: "New STL score L6.1 from latest activity window.", tone: "green" },
                { time: "2m ago", label: "Proof hashed", body: "sha256(entity, score, ts) = 0xabc1…4412", tone: "teal" },
                { time: "2m ago", label: "Broadcast", body: "Submitted to parachain mempool.", tone: "cyan" },
                { time: "1m ago", label: "Finalised", body: "6 confirmations reached. Anchor finalised.", tone: "green" },
              ],
              evidence: [
                { label: "Hash recipe", body: "sha256(entity_id || stl_score || timestamp_utc)", tone: "teal" },
                { label: "Verifier", body: "Anyone can recompute the hash — EHB cannot forge.", tone: "green" },
                { label: "Peer count", body: "42 healthy peers — above 30-peer resilience target.", tone: "purple" },
              ],
              actions: [
                { label: "View on explorer", tone: "teal" },
                { label: "Copy tx hash", tone: "cyan" },
                { label: "Re-verify", tone: "purple" },
              ],
            },
          },
          { id: "p-02", cells: [<span key="t" className="font-mono text-[10px]">0xabc0…4411</span>, "entity-0921", <Chip key="c" label="L3 → L4" tone="green" />, "48,111", "12m ago"] },
          { id: "p-03", cells: [<span key="t" className="font-mono text-[10px]">0xabbf…4410</span>, "entity-4412", <Chip key="c" label="L4 → L3" tone="amber" />, "48,110", "24m ago"] },
          { id: "p-04", cells: [<span key="t" className="font-mono text-[10px]">0xabbe…4409</span>, "entity-3301", <Chip key="c" label="L6 → L7" tone="purple" />, "48,109", "38m ago"] },
          { id: "p-05", cells: [<span key="t" className="font-mono text-[10px]">0xabbd…4408</span>, "entity-2218", <Chip key="c" label="L2 → L3" tone="cyan" />, "48,108", "52m ago"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: "Zero failures", body: "All 412 STL events successfully anchored in the last 24h.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Fast finality", body: "Average anchor latency 6.2s — well below the 12s target.", tone: "teal" },
        ],
        accentVisual: <BlockchainExplorerRow />,
      },
      "crb-hashes": {
        key: "crb-hashes",
        eyebrow: "Intelligence · Blockchain Control",
        title: "CRB certificate hashes",
        description: "Content-addressed proofs of CRB certificates. Anyone can re-hash the certificate and match the chain — EHB cannot forge.",
        stats: [
          { label: "Issued 30d", value: "1,218", tone: "teal" },
          { label: "Pending verify", value: "18", tone: "amber" },
          { label: "Revoked", value: "4", tone: "red" },
          { label: "Active on-chain", value: "42.1K", tone: "cyan" },
        ],
        mainTitle: "Recent CRB certificate anchors",
        mainDescription: "Hash, cert ID, industry, and status.",
        columns: ["Hash", "Cert ID", "Type", "Status", "Issued"],
        rows: [
          { id: "c-01", cells: [<span key="t" className="font-mono text-[10px]">0xdef1…8821</span>, "CRB-88212", <Chip key="m" label="Medical" tone="teal" />, <Chip key="s" label="Issued" tone="green" />, "1h ago"] },
          { id: "c-02", cells: [<span key="t" className="font-mono text-[10px]">0xdef0…8820</span>, "CRB-88211", <Chip key="m" label="Legal" tone="amber" />, <Chip key="s" label="Issued" tone="green" />, "2h ago"] },
          { id: "c-03", cells: [<span key="t" className="font-mono text-[10px]">0xdeef…8819</span>, "CRB-88210", <Chip key="m" label="Education" tone="cyan" />, <Chip key="s" label="Issued" tone="green" />, "3h ago"] },
          { id: "c-04", cells: [<span key="t" className="font-mono text-[10px]">0xdeee…8818</span>, "CRB-88209", <Chip key="m" label="GoSellr" tone="purple" />, <Chip key="s" label="Revoked" tone="red" />, "4h ago"] },
          { id: "c-05", cells: [<span key="t" className="font-mono text-[10px]">0xdeed…8817</span>, "CRB-88208", <Chip key="m" label="Travel" tone="amber" />, <Chip key="s" label="Issued" tone="green" />, "5h ago"] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, title: "Verifiable without trust", body: "Any auditor can re-hash a CRB cert and match the chain — no EHB trust needed.", tone: "teal" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, title: "1 revocation", body: "CRB-88209 (GoSellr) revoked 4h ago after fraud detection on Shop-441.", tone: "red" },
        ],
        accentVisual: <BlockchainExplorerRow />,
      },
      explorer: {
        key: "explorer",
        eyebrow: "Intelligence · Blockchain Control",
        title: "Block explorer",
        description: "Recent blocks on the EHB Polkadot parachain, with event counts, gas usage, and hash shortcuts.",
        stats: [
          { label: "Latest block", value: "48,112", hint: "2m ago", tone: "teal" },
          { label: "Events 24h", value: "4,184", tone: "cyan" },
          { label: "Avg block time", value: "6.0s", tone: "green" },
          { label: "Peers", value: "42", tone: "purple" },
        ],
        mainTitle: "Recent blocks",
        mainDescription: "Newest blocks first. Click to drill into events.",
        columns: ["Block", "Events", "Age", "Hash", "Type"],
        rows: [
          { id: "b-01", cells: ["48,112", "12", "2m ago", <span key="h" className="font-mono text-[10px]">0xabc1…</span>, <Chip key="t" label="STL + CRB" tone="teal" />] },
          { id: "b-02", cells: ["48,111", "9", "12m ago", <span key="h" className="font-mono text-[10px]">0xabc0…</span>, <Chip key="t" label="STL only" tone="cyan" />] },
          { id: "b-03", cells: ["48,110", "14", "24m ago", <span key="h" className="font-mono text-[10px]">0xabbf…</span>, <Chip key="t" label="Mixed" tone="purple" />] },
          { id: "b-04", cells: ["48,109", "8", "38m ago", <span key="h" className="font-mono text-[10px]">0xabbe…</span>, <Chip key="t" label="STL only" tone="cyan" />] },
          { id: "b-05", cells: ["48,108", "11", "52m ago", <span key="h" className="font-mono text-[10px]">0xabbd…</span>, <Chip key="t" label="CRB only" tone="teal" />] },
          { id: "b-06", cells: ["48,107", "6", "1h ago", <span key="h" className="font-mono text-[10px]">0xabbc…</span>, <Chip key="t" label="Mixed" tone="purple" />] },
        ],
        insights: [
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: "42 peers", body: "Parachain holding 42 healthy peers — above the 30-peer resilience target.", tone: "green" },
          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: "Block time healthy", body: "Avg block time 6.0s — matching Polkadot mainnet cadence.", tone: "teal" },
        ],
        accentVisual: <BlockchainExplorerRow />,
      },
    },
  },
};

// ───────────────────────────────────────────────────────────────────────
//  DetailDrawer — Iteration 3 interactive row drawer (design-only)
// ───────────────────────────────────────────────────────────────────────

function DetailDrawer({
  drawer,
  onClose,
}: {
  drawer: DrawerBlueprint | null;
  onClose: () => void;
}) {
  // Lock scroll + esc to close while drawer open
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawer, onClose]);

  const accent: Tone = drawer?.accent ?? "purple";
  const glow = drawer ? TONE_GLOW_HEX[accent] : TONE_GLOW_HEX.purple;

  return (
    <div
      aria-hidden={!drawer}
      className={[
        "fixed inset-0 z-[80] transition-opacity duration-300",
        drawer ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close detail drawer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={[
          "absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col overflow-hidden",
          "transition-transform duration-300 ease-out",
          drawer ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={NEU_CARD}
      >
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -left-10 -top-24 h-64 w-64 rounded-full blur-3xl opacity-60"
          style={{ background: `radial-gradient(circle, ${glow}33, transparent 65%)` }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              {drawer?.eyebrow ?? "Detail"}
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              {drawer?.title ?? ""}
            </div>
            {drawer?.subtitle && (
              <div className="mt-0.5 text-[11px] text-white/60">{drawer.subtitle}</div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[13px] text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-auto px-5 py-4">
          {/* Fields grid */}
          {drawer && drawer.fields.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {drawer.fields.map((f, i) => (
                <div
                  key={`f-${i}`}
                  className="rounded-xl p-3"
                  style={NEU_INSET}
                >
                  <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {f.label}
                  </div>
                  <div
                    className={[
                      "mt-1 text-[13px] font-semibold",
                      f.tone ? TONE_FG[f.tone] : "text-white/90",
                    ].join(" ")}
                  >
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {drawer?.timeline && drawer.timeline.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Timeline
              </div>
              <div className="space-y-2">
                {drawer.timeline.map((t, i) => {
                  const tone: Tone = t.tone ?? "slate";
                  return (
                    <div
                      key={`t-${i}`}
                      className="rounded-xl p-3"
                      style={NEU_INSET}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className={[
                            "text-[11px] font-semibold",
                            TONE_FG[tone],
                          ].join(" ")}
                        >
                          {t.label}
                        </div>
                        <div className="text-[10px] text-white/50">{t.time}</div>
                      </div>
                      {t.body && (
                        <div className="mt-1 text-[11px] leading-snug text-white/70">
                          {t.body}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evidence */}
          {drawer?.evidence && drawer.evidence.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Evidence
              </div>
              <div className="space-y-2">
                {drawer.evidence.map((e, i) => {
                  const tone: Tone = e.tone ?? "cyan";
                  return (
                    <div
                      key={`e-${i}`}
                      className={[
                        "rounded-xl border p-3",
                        TONE_BORDER[tone],
                        TONE_BG[tone],
                      ].join(" ")}
                    >
                      <div className={["text-[11px] font-semibold", TONE_FG[tone]].join(" ")}>
                        {e.label}
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-white/80">
                        {e.body}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer · actions */}
        {drawer?.actions && drawer.actions.length > 0 && (
          <div className="relative flex flex-wrap gap-2 border-t border-white/[0.06] px-5 py-3">
            {drawer.actions.map((a, i) => {
              const tone: Tone = a.tone ?? accent;
              return (
                <button
                  key={`a-${i}`}
                  type="button"
                  disabled={a.disabled}
                  onClick={(e) => e.preventDefault()}
                  className={[
                    "rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors",
                    a.disabled
                      ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/35"
                      : `${TONE_BORDER[tone]} ${TONE_BG[tone]} ${TONE_FG[tone]} hover:brightness-110`,
                  ].join(" ")}
                >
                  {a.label}
                </button>
              );
            })}
            <div className="ml-auto self-center text-[9px] uppercase tracking-[0.14em] text-white/35">
              Prototype · design-only
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Main component
// ───────────────────────────────────────────────────────────────────────

export const PROTOTYPE_SECTION_KEYS = Object.keys(MODULES);

export function isPrototypeSection(key: string): boolean {
  return key in MODULES;
}

export function DmoPrototypeWorkspace({
  sectionKey,
  viewKey,
}: {
  sectionKey: string;
  viewKey?: string;
}) {
  const [openDrawer, setOpenDrawer] = useState<DrawerBlueprint | null>(null);

  const mod = MODULES[sectionKey];
  if (!mod) return <NotFound />;

  // Pick first view if none given (usually the catch-all provides one)
  const resolvedViewKey =
    viewKey && mod.views[viewKey] ? viewKey : Object.keys(mod.views)[0];
  const view = mod.views[resolvedViewKey];
  if (!view) return <NotFound moduleLabel={mod.label} />;

  const accent = view.stats[0]?.tone ?? mod.accent;
  const rowsWithDrawers = view.rows.filter((r) => r.drawer).length;

  return (
    <main className="relative min-h-screen text-white">
      <div className="container-ehb py-6">
        <div className="space-y-5">
          {/* Hero header */}
          <header
            className="relative overflow-hidden rounded-2xl p-6"
            style={NEU_CARD}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-70"
              style={{
                background: `radial-gradient(circle at center, ${TONE_GLOW_HEX[mod.accent]}33, transparent 65%)`,
              }}
            />
            <div className="relative flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Chip label={`${mod.groupLabel}`} tone={mod.accent} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    {view.eyebrow}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                    style={NEU_SMALL}
                  >
                    {mod.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {view.title}
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-white/65">
                      {view.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dmo"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                >
                  Back to DMO
                </Link>
                <Link
                  href={mod.href}
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                    "border",
                    TONE_BORDER[mod.accent],
                    TONE_BG[mod.accent],
                    TONE_FG[mod.accent],
                  ].join(" ")}
                >
                  {mod.label} home
                </Link>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-medium text-white/55">
              {mod.tagline}
            </div>
          </header>

          {/* Stat row */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {view.stats.map((stat, idx) => (
              <StatCard key={`${stat.label}-${idx}`} stat={stat} accent={accent} />
            ))}
          </section>

          {/* Main grid */}
          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            {/* Data card */}
            <div className="space-y-5">
              <div
                className="rounded-2xl p-5"
                style={NEU_CARD}
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {view.mainTitle}
                    </div>
                    <div className="mt-0.5 text-[11px] text-white/55">
                      {view.mainDescription}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rowsWithDrawers > 0 && (
                      <Chip label={`${rowsWithDrawers} clickable`} tone={mod.accent} />
                    )}
                    <Chip label={`${view.rows.length} entries`} tone="slate" />
                  </div>
                </div>
                <div
                  className="overflow-hidden rounded-xl"
                  style={NEU_INSET}
                >
                  <div className="overflow-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          {view.columns.map((c) => (
                            <th
                              key={c}
                              className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50"
                            >
                              {c}
                            </th>
                          ))}
                          {rowsWithDrawers > 0 && (
                            <th
                              aria-label="Details"
                              className="w-8 px-2 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50"
                            />
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {view.rows.map((row) => {
                          const clickable = Boolean(row.drawer);
                          return (
                            <tr
                              key={row.id}
                              role={clickable ? "button" : undefined}
                              tabIndex={clickable ? 0 : undefined}
                              aria-label={clickable ? `Open details for ${row.id}` : undefined}
                              onClick={
                                clickable
                                  ? () => setOpenDrawer(row.drawer ?? null)
                                  : undefined
                              }
                              onKeyDown={
                                clickable
                                  ? (e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setOpenDrawer(row.drawer ?? null);
                                      }
                                    }
                                  : undefined
                              }
                              className={[
                                "border-b border-white/[0.04] transition-colors last:border-0",
                                clickable
                                  ? "cursor-pointer hover:bg-white/[0.05] focus:bg-white/[0.06] focus:outline-none"
                                  : "hover:bg-white/[0.02]",
                              ].join(" ")}
                            >
                              {row.cells.map((cell, i) => (
                                <td
                                  key={`${row.id}-${i}`}
                                  className="px-3 py-3 align-middle text-white/85"
                                >
                                  {cell}
                                </td>
                              ))}
                              {rowsWithDrawers > 0 && (
                                <td className="px-2 py-3 text-right align-middle text-[13px]">
                                  {clickable ? (
                                    <span className="text-white/50">›</span>
                                  ) : (
                                    <span className="text-white/15">·</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {view.accentVisual}
            </div>

            {/* Side column */}
            <div className="space-y-4">
              {/* Sub navigation */}
              <div className="rounded-2xl p-4" style={NEU_CARD}>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {mod.label} · Views
                </div>
                <div className="space-y-2">
                  {mod.navItems.map((item) => {
                    const isActive =
                      item.key === resolvedViewKey ||
                      (item.href.endsWith(mod.href) && resolvedViewKey === Object.keys(mod.views)[0]);
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={[
                          "block rounded-xl px-3 py-2.5 transition-all",
                          "border",
                          isActive
                            ? `${TONE_BORDER[mod.accent]} ${TONE_BG[mod.accent]}`
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "text-[11px] font-semibold",
                            isActive ? TONE_FG[mod.accent] : "text-white/90",
                          ].join(" ")}
                        >
                          {item.label}
                        </div>
                        {item.description ? (
                          <div className="mt-0.5 text-[10px] text-white/50">
                            {item.description}
                          </div>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              {view.insights && view.insights.length > 0 ? (
                <div className="rounded-2xl p-4" style={NEU_CARD}>
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                    Insights
                  </div>
                  <div className="space-y-2">
                    {view.insights.map((ins) => (
                      <div
                        key={ins.title}
                        className="rounded-xl p-3"
                        style={NEU_SMALL}
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-base">{ins.icon}</div>
                          <div className="min-w-0">
                            <div
                              className={[
                                "text-[11px] font-semibold",
                                TONE_FG[ins.tone ?? mod.accent],
                              ].join(" ")}
                            >
                              {ins.title}
                            </div>
                            <div className="mt-0.5 text-[10px] text-white/60">
                              {ins.body}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Prototype notice */}
              <div
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"
                style={NEU_SMALL}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Prototype mode
                </div>
                <div className="mt-1 text-[11px] text-white/70">
                  Phase 9 design preview. Mock data only. Frontend wiring
                  starts when theme is approved.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <DetailDrawer
        drawer={openDrawer}
        onClose={() => setOpenDrawer(null)}
      />
    </main>
  );
}

// ───────────────────────────────────────────────────────────────────────
//  Not-found fallback
// ───────────────────────────────────────────────────────────────────────

function NotFound({ moduleLabel }: { moduleLabel?: string } = {}) {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6">
        <div className="rounded-2xl p-6" style={NEU_CARD}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            Prototype route
          </div>
          <h1 className="mt-2 text-lg font-semibold text-white">
            View not configured yet
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {moduleLabel
              ? `The requested view in "${moduleLabel}" has not been built in the Phase 9 prototype yet.`
              : "The requested DMO module has not been built in the Phase 9 prototype yet."}
          </p>
          <Link
            href="/dmo"
            className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/[0.08]"
          >
            Back to DMO dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
