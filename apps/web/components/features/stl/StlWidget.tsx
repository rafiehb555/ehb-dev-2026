"use client";

/**
 * EHB STL Widget — Neumorphism 3D edition (v1.8, 2026-04-11)
 * ----------------------------------------------------------
 * Requested by Rafi: match the reference "UI DASHBOARD" neumorphic card
 * (dark raised container, circular ring gauge with neon gradient stroke,
 * soft inset pill progress bars).
 *
 * Data layer (fetch from /api/stl/full-snapshot) is UNCHANGED — only the
 * visual structure was rebuilt. STL formula untouched.
 */

import { useEffect, useState } from "react";
import { StlLiveDataBadge } from "@/components/features/stl/StlLiveDataBadge";
import { STL_BAR_CONFIG } from "@/lib/stl/stlBars";
import type { StlBreakdown } from "@/lib/stl/engine";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

type ApiOk = { success: true; data: StlFullSnapshot };

/* ============================================================
   Shared 3D neumorphic base (dark raised + inset shadow stack)
   ============================================================ */
const NEU_BASE: React.CSSProperties = {
  background:
    "linear-gradient(145deg, #1e2131 0%, #14162a 55%, #0d0f1c 100%)",
  boxShadow:
    // Outer drop shadow (card lifted off the page)
    "22px 22px 60px rgba(0, 0, 0, 0.55), " +
    "-10px -10px 40px rgba(255, 255, 255, 0.035), " +
    // Inset chrome highlight (top edge)
    "inset 2px 2px 4px rgba(255, 255, 255, 0.08), " +
    // Inset bottom shadow (bevel)
    "inset -2px -2px 6px rgba(0, 0, 0, 0.55)",
};

const NEU_INSET: React.CSSProperties = {
  background:
    "linear-gradient(145deg, #0d0f1c 0%, #15182a 100%)",
  boxShadow:
    "inset 6px 6px 14px rgba(0, 0, 0, 0.70), " +
    "inset -4px -4px 12px rgba(255, 255, 255, 0.04)",
};

/* ============================================================
   NeonPillBar — thin neumorphic pill with neon gradient fill,
   inline label + glowing % tag (matches reference "GPU 10%" bar)
   ============================================================ */
function NeonPillBar({
  label,
  value,
  displayValue,
  min,
  max,
  fromColor,
  toColor,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  fromColor: string;
  toColor: string;
}) {
  const range = Math.max(1, max - min);
  const pct = Math.max(0, Math.min(100, ((value - min) / range) * 100));
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-[110px] shrink-0 text-[10px] font-semibold uppercase text-white/60"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      <div
        className="relative flex-1 h-[14px] rounded-full overflow-hidden"
        style={NEU_INSET}
      >
        {/* Neon gradient fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 100%)`,
            boxShadow:
              `0 0 10px ${toColor}aa, ` +
              `0 0 18px ${fromColor}66, ` +
              `inset 0 1px 0 rgba(255, 255, 255, 0.45), ` +
              `inset 0 -1px 0 rgba(0, 0, 0, 0.25)`,
            transition: "width 900ms cubic-bezier(.2,.8,.2,1)",
          }}
        />
        {/* % tag pinned to the right of the fill */}
        <span
          className="absolute top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[9px] font-black text-[#0d0f1c]"
          style={{
            right: pct > 12 ? `calc(${100 - pct}% + 4px)` : "6px",
            background: `linear-gradient(180deg, ${fromColor}, ${toColor})`,
            boxShadow: `0 0 8px ${toColor}88`,
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   CircularGauge — reference image ring gauge.
   Dark inset dish → neon gradient stroke → embossed inner disk
   with big percentage + label + "total" eyebrow.
   ============================================================ */
function CircularGauge({
  percent,
  levelName,
}: {
  percent: number;
  levelName: string;
}) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = (clamped / 100) * c;

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        padding: 10,
        ...NEU_INSET,
      }}
    >
      <svg
        width={size - 20}
        height={size - 20}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-[10px]"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="stlRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7B6EF6" />
            <stop offset="55%"  stopColor="#A098F8" />
            <stop offset="100%" stopColor="#2BBFA0" />
          </linearGradient>
          <filter id="stlRingGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={stroke}
        />
        {/* Neon progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#stlRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          filter="url(#stlRingGlow)"
          style={{
            transition:
              "stroke-dasharray 1200ms cubic-bezier(.2,.8,.2,1)",
          }}
        />
      </svg>

      {/* Embossed inner disk with the number */}
      <div
        className="relative flex h-[146px] w-[146px] flex-col items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #262a3f 0%, #15182a 65%, #0c0e1a 100%)",
          boxShadow:
            "inset 4px 4px 10px rgba(0, 0, 0, 0.65), " +
            "inset -3px -3px 9px rgba(255, 255, 255, 0.05), " +
            "0 0 30px rgba(123, 110, 246, 0.18)",
        }}
      >
        {/* Tiny chip icon like the reference */}
        <span
          className="mb-1 flex h-5 w-8 items-center justify-center rounded-[4px] text-[9px] font-bold text-[#2BBFA0]"
          style={{
            background:
              "linear-gradient(180deg, rgba(43,191,160,0.18), rgba(43,191,160,0.04))",
            border: "1px solid rgba(43, 191, 160, 0.5)",
            boxShadow: "0 0 10px rgba(43, 191, 160, 0.35)",
          }}
        >
          STL
        </span>
        <div
          className="text-[38px] font-black leading-none text-white"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            letterSpacing: "-0.8px",
            textShadow:
              "0 0 18px rgba(160, 152, 248, 0.45), 0 2px 3px rgba(0, 0, 0, 0.6)",
          }}
        >
          {clamped}
          <span className="ml-0.5 text-[16px] font-bold text-white/55">
            %
          </span>
        </div>
        <p
          className="mt-0.5 text-[9px] font-semibold uppercase text-[#A098F8]"
          style={{ letterSpacing: "0.22em" }}
        >
          Trust Score
        </p>
        <p
          className="mt-0.5 text-[7px] font-bold uppercase text-white/35"
          style={{ letterSpacing: "0.24em" }}
        >
          {levelName}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   Color pairs per STL bar (brand gradient spectrum)
   ============================================================ */
const BAR_COLORS: { from: string; to: string }[] = [
  { from: "#7B6EF6", to: "#A098F8" }, // PSS · purple
  { from: "#2BBFA0", to: "#5FDCBF" }, // CRB · teal
  { from: "#A098F8", to: "#2BBFA0" }, // DMO · purple→teal
  { from: "#F0A030", to: "#F5BB66" }, // Franchise · amber
  { from: "#F05858", to: "#F89090" }, // Penalty · red
];

/* ============================================================
   StlWidget (neumorphic 3D)
   ============================================================ */
export function StlWidget() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<StlFullSnapshot | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/stl/full-snapshot", { cache: "no-store" });
        const json = (await res.json()) as
          | ApiOk
          | { success: false; error: { message: string } };
        if (!res.ok || !("success" in json) || json.success === false) {
          throw new Error(
            "success" in json && !json.success ? json.error.message : `HTTP ${res.status}`,
          );
        }
        if (!alive) return;
        setSnapshot(json.data);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load STL");
        setSnapshot(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const breakdown = snapshot?.breakdown as StlBreakdown | null | undefined;
  const live = snapshot?.dataSource === "live";
  const trustScore = snapshot?.trustScore ?? 0;
  const levelName = snapshot?.levelName ?? "—";

  return (
    <section
      className="relative overflow-hidden rounded-[28px] p-6 md:p-8"
      style={NEU_BASE}
    >
      {/* Header row — title + live badge */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-semibold uppercase text-[#A098F8]"
            style={{ letterSpacing: "0.24em" }}
          >
            EHB · STL Engine
          </p>
          <h2 className="mt-1 text-[20px] font-black text-white md:text-[22px]">
            Service Trust Level
          </h2>
          <p className="mt-1 text-[11px] text-white/45">
            Unified snapshot — same engine as DMO dashboard.
          </p>
        </div>
        <StlLiveDataBadge mode={live ? "live" : "demo"} />
      </div>

      {loading ? (
        <div
          className="rounded-2xl p-6 text-center text-[12px] text-white/60"
          style={NEU_INSET}
        >
          Loading STL…
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border border-rose-400/30 p-6 text-[12px] text-rose-100"
          style={{
            ...NEU_INSET,
            background:
              "linear-gradient(145deg, rgba(240,88,88,0.12), rgba(13,15,28,1))",
          }}
        >
          {error}
        </div>
      ) : snapshot && breakdown ? (
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10">
          {/* ─── Circular gauge (left) ─── */}
          <div className="flex-shrink-0">
            <CircularGauge percent={trustScore} levelName={levelName} />
          </div>

          {/* ─── Neon pill bars (right) ─── */}
          <div className="flex w-full flex-col gap-3">
            {STL_BAR_CONFIG.map((row, i) => {
              const raw = breakdown[row.key];
              const isPenalty = row.key === "behavior";
              // For penalty, display absolute magnitude but still show fill
              // proportional to how much of the -35..0 range is used.
              const display = isPenalty
                ? `${raw}`
                : `${raw}/${row.max}`;
              const color = BAR_COLORS[i] ?? BAR_COLORS[0];
              return (
                <NeonPillBar
                  key={row.key}
                  label={row.label}
                  value={raw}
                  displayValue={display}
                  min={row.min}
                  max={row.max}
                  fromColor={color.from}
                  toColor={color.to}
                />
              );
            })}

            {/* Footnote */}
            <div
              className="mt-2 flex items-center justify-between rounded-full px-4 py-2"
              style={NEU_INSET}
            >
              <span
                className="text-[9px] font-semibold uppercase text-white/45"
                style={{ letterSpacing: "0.16em" }}
              >
                0 → 100 · Next
              </span>
              <span className="text-[11px] font-bold text-[#A098F8]">
                {snapshot.nextLevelName ?? "—"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
