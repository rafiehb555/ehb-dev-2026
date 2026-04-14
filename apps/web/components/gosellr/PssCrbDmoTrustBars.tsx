"use client";

type TrustDimension = {
  label: string;
  level: number | null;  // 1-10, null = N/A
  maxLevel?: number;      // default 10
};

type Props = {
  pss: number | null;
  crb: number | null;
  dmo: number | null;
  compact?: boolean;       // smaller variant for product cards
  className?: string;
};

/** Color by level range matching EHB design system. */
function barColor(level: number | null): string {
  if (level === null) return "rgba(255,255,255,0.1)";
  if (level >= 8) return "#7B6EF6";   // Purple — elite+
  if (level >= 6) return "#2BBFA0";   // Teal — trusted+
  if (level >= 4) return "#F0A030";   // Amber — moderate
  return "#F05858";                     // Red — low
}

function barGlow(level: number | null): string {
  if (level === null) return "none";
  const c = barColor(level);
  return `0 0 8px ${c}40`;
}

/**
 * PSS / CRB / DMO horizontal trust bars.
 * Shows seller's 3-dimensional trust levels as labeled progress bars.
 */
export function PssCrbDmoTrustBars({ pss, crb, dmo, compact = false, className = "" }: Props) {
  const dims: TrustDimension[] = [
    { label: "PSS", level: pss },
    { label: "CRB", level: crb },
    { label: "DMO", level: dmo },
  ];

  const h = compact ? "h-1.5" : "h-2";
  const textSize = compact ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`space-y-1.5 ${className}`}>
      {dims.map((d) => {
        const pct = d.level !== null ? (d.level / (d.maxLevel ?? 10)) * 100 : 0;
        const color = barColor(d.level);

        return (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className={`${textSize} font-semibold uppercase tracking-wider w-7 shrink-0`}
              style={{ color: d.level !== null ? color : "rgba(255,255,255,0.25)" }}
            >
              {d.label}
            </span>

            <div className={`flex-1 ${h} rounded-full overflow-hidden`} style={{ background: "rgba(255,255,255,0.06)" }}>
              {d.level !== null ? (
                <div
                  className={`${h} rounded-full transition-all duration-700 ease-out`}
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}CC, ${color})`,
                    boxShadow: barGlow(d.level),
                  }}
                />
              ) : null}
            </div>

            <span
              className={`${textSize} font-mono tabular-nums w-8 text-right shrink-0`}
              style={{ color: d.level !== null ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}
            >
              {d.level !== null ? `L${d.level}` : "N/A"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
