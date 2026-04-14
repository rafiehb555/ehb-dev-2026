"use client";

type Props = {
  level: number;   // 1-10
  score: number;   // 0-100
  className?: string;
};

/** Human-readable trust word by level — from Master Info §92. */
function trustWord(level: number): string {
  if (level <= 1) return "Weak";
  if (level === 2) return "Basic";
  if (level <= 4) return "Moderate";
  if (level <= 6) return "Trusted";
  if (level === 7) return "Strong";
  if (level <= 9) return "Excellent";
  return "Supreme";
}

/** Color for trust word and progress bar. */
function trustColor(level: number): string {
  if (level <= 1) return "#F05858";
  if (level === 2) return "#F0A030";
  if (level <= 4) return "#29ABE2";
  if (level <= 6) return "#2BBFA0";
  if (level === 7) return "#22B14C";
  if (level <= 9) return "#7B6EF6";
  return "#FFD700";
}

/**
 * Trust Level Strip — colored bar at top of STL cards.
 * Shows "Trust Level: Strong" with a filled progress bar.
 */
export function TrustLevelStrip({ level, score, className = "" }: Props) {
  const word = trustWord(level);
  const color = trustColor(level);
  const pct = Math.min(100, Math.max(0, score));

  return (
    <div
      className={`rounded-t-xl px-3 py-1.5 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        borderBottom: `1px solid ${color}30`,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
          Trust Level: {word}
        </span>
        <span className="text-[9px] font-mono tabular-nums" style={{ color: `${color}BB` }}>
          {pct}/100
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
