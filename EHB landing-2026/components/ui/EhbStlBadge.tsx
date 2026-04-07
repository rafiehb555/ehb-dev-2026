import type { HTMLAttributes } from "react";

export type StlLevel = 1 | 2 | 3 | 4 | 5;

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
    label: "EHB-STL-LEVEL L3 — TRUSTED",
    short: "TRUSTED",
    className:
      "border border-[#29ABE2]/80 text-[#33C3FF] bg-[#29ABE2]/15 shadow-[0_0_14px_rgba(41,171,226,0.35)]"
  },
  4: {
    label: "EHB-STL-LEVEL L4 — PREMIUM",
    short: "PREMIUM",
    className:
      "border border-[#7C3AED]/80 text-[#a78bfa] bg-[#7C3AED]/15 stl-l4-glow"
  },
  5: {
    label: "EHB-STL-LEVEL L5 — VIP ELITE",
    short: "VIP ELITE",
    className:
      "border border-[#F59E0B]/70 text-amber-200 bg-gradient-to-r from-[#F59E0B]/25 to-[#22B14C]/20 vip-glow"
  }
};

type EhbStlBadgeProps = {
  level: StlLevel;
  score?: number;
} & HTMLAttributes<HTMLSpanElement>;

/** EHB_UIUX_DESIGN_PLAN Part 3 — STL Level Badge (reusable L1–L5). */
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
