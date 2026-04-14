"use client";

import { useEffect, useRef } from "react";

type Props = {
  level: number;       // 1-10
  score: number;       // 0-100
  size?: number;       // px, default 68
  className?: string;
};

/** Gradient ID → stop colors by level tier. */
function ringGradient(level: number): [string, string] {
  if (level >= 9)  return ["#FFD700", "#FF6B00"];   // supreme gold-orange
  if (level >= 7)  return ["#A78BFA", "#7B6EF6"];   // purple elite
  if (level >= 5)  return ["#2BBFA0", "#22B14C"];   // teal-green
  if (level >= 3)  return ["#29ABE2", "#7B6EF6"];   // blue-purple
  return ["#F05858", "#F0A030"];                      // red-amber (low)
}

/**
 * Animated SVG ring badge showing EHB-STL-LEVEL.
 * Renders a circular progress ring with gradient stroke,
 * glow pulse, and center level text — matches the HTML demo cards.
 */
export function StlTrustRingBadge({ level, score, size = 68, className = "" }: Props) {
  const ringRef = useRef<SVGCircleElement>(null);

  const stroke = 5;
  const r = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = circumference - (pct / 100) * circumference;
  const gradId = `stlRing-${level}-${size}`;

  const [c1, c2] = ringGradient(level);

  // Animate ring on mount
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    el.style.strokeDashoffset = `${circumference}`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.strokeDashoffset = `${offset}`;
      });
    });
  }, [circumference, offset]);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow pulse */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, ${c1}15 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            filter: `drop-shadow(0 0 6px ${c1}55)`,
          }}
        />
      </svg>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: c1 }}
        >
          EHB
        </span>
        <span className="text-sm font-black tabular-nums text-white leading-none">
          L{level}
        </span>
        <span className="text-[8px] font-medium tabular-nums text-white/50">
          {score}
        </span>
      </div>
    </div>
  );
}
