import type { HTMLAttributes } from "react";

export type StlLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const LEVEL_META: Record<
  StlLevel,
  { label: string; short: string; className: string }
> = {
  1: {
    label: "EHB-STL-LEVEL L1 — FREE",
    short: "FREE",
    className:
      "border border-[#CC2200] text-[#FF6644] bg-[#CC2200]/10 shadow-[0_0_12px_rgba(204,34,0,0.25)]"
  },
  2: {
    label: "EHB-STL-LEVEL L2 — BASIC",
    short: "BASIC",
    className:
      "border border-[#F7941D]/80 text-[#F7941D] bg-[#F7941D]/15 shadow-[0_0_12px_rgba(247,148,29,0.25)]"
  },
  3: {
    label: "EHB-STL-LEVEL L3 — NORMAL",
    short: "NORMAL",
    className:
      "border border-[#29ABE2]/80 text-[#33C3FF] bg-[#29ABE2]/15 shadow-[0_0_14px_rgba(41,171,226,0.35)]"
  },
  4: {
    label: "EHB-STL-LEVEL L4 — STANDARD",
    short: "STANDARD",
    className:
      "border border-[#7C3AED]/80 text-[#a78bfa] bg-[#7C3AED]/15 stl-l4-glow"
  },
  5: {
    label: "EHB-STL-LEVEL L5 — ADVANCED",
    short: "ADVANCED",
    className:
      "border border-[#F59E0B]/70 text-amber-200 bg-gradient-to-r from-[#F59E0B]/25 to-[#22B14C]/20 vip-glow"
  },
  6: {
    label: "EHB-STL-LEVEL L6 — HIGH",
    short: "HIGH",
    className:
      "border border-emerald-400/60 text-emerald-200 bg-emerald-500/20 shadow-[0_0_16px_rgba(16,185,129,0.35)]",
  },
  7: {
    label: "EHB-STL-LEVEL L7 — VIP",
    short: "VIP",
    className:
      "border border-fuchsia-400/60 text-fuchsia-100 bg-fuchsia-500/20 shadow-[0_0_16px_rgba(217,70,239,0.35)]",
  },
  8: {
    label: "EHB-STL-LEVEL L8 — SUPREME 👑",
    short: "SUPREME",
    className:
      "border border-amber-300/60 text-amber-100 bg-gradient-to-r from-amber-500/25 to-yellow-300/20 shadow-[0_0_18px_rgba(251,191,36,0.45)]",
  },
};

type EhbStlBadgeProps = {
  level: StlLevel;
  score?: number;
} & HTMLAttributes<HTMLSpanElement>;

/** EHB STL Level Badge — L1–L8 (names from `lib/stl/levels.ts`). */
export function EhbStlBadge({ level, score, className = "", ...rest }: EhbStlBadgeProps) {
  const m = LEVEL_META[level];
  return (
    <span
      role="status"
      title={m.label}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-ui-badge uppercase tracking-wide ${m.className} ${className}`}
      {...rest}
    >
      <span className="font-semibold">{m.short}</span>
      {score != null && (
        <span className="font-mono tabular-nums text-[10px] opacity-95">{score}/100</span>
      )}
    </span>
  );
}
