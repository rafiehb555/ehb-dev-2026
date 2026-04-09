/** Archived - not used in production */

"use client";

import { useEffect, useRef, useState } from "react";

type Trend = "up" | "down" | "flat";

export function DmoKpiCard(props: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "violet";
  trend?: Trend;
  trendText?: string;
}) {
  const tone = props.tone ?? "cyan";
  const toneClasses =
    tone === "emerald"
      ? "border-emerald-400/30 bg-emerald-500/10"
      : tone === "amber"
        ? "border-amber-400/30 bg-amber-500/10"
        : tone === "rose"
          ? "border-rose-400/30 bg-rose-500/10"
          : tone === "violet"
            ? "border-violet-400/30 bg-violet-500/10"
            : "border-cyan-400/30 bg-cyan-500/10";

  const trendIcon = props.trend === "up" ? "↑" : props.trend === "down" ? "↓" : "•";
  const trendColor =
    props.trend === "up"
      ? "text-emerald-300"
      : props.trend === "down"
        ? "text-rose-200"
        : "text-ehb-textBody";

  const numeric = typeof props.value === "number" ? props.value : Number(props.value);
  const isNumeric = Number.isFinite(numeric);
  const [displayValue, setDisplayValue] = useState<number>(isNumeric ? 0 : 0);
  const prevRef = useRef<number>(isNumeric ? numeric : 0);

  useEffect(() => {
    if (!isNumeric) return;
    const from = prevRef.current;
    const to = numeric;
    const duration = 320;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const next = from + (to - from) * eased;
      setDisplayValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isNumeric, numeric]);

  const renderedValue = isNumeric ? Math.round(displayValue).toLocaleString() : props.value;

  return (
    <div className={`ehb-card-elevated ehb-hover-lift ${toneClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.14em] ehb-text-muted">{props.label}</div>
        {props.trendText ? (
          <div className={`text-[11px] font-semibold ${trendColor}`}>
            {trendIcon} {props.trendText}
          </div>
        ) : null}
      </div>
      <div className="mt-2 text-2xl font-semibold ehb-text-heading leading-none">{renderedValue}</div>
      {props.detail ? <div className="mt-2 text-xs text-[var(--ehb-text-body)]">{props.detail}</div> : null}
    </div>
  );
}

