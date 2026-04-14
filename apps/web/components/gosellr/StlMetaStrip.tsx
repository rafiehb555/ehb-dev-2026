"use client";

type Props = {
  ruleNumber?: string;        // e.g. "EHB-3847"
  rating?: number;            // e.g. 4.8
  refillingCount?: number;    // e.g. 3 (times refilled)
  examInfo?: string;          // e.g. "5x A+"
  compact?: boolean;
  className?: string;
};

/**
 * STL Meta Strip — Rule #, Rating, Refilling count, Exam info.
 * Horizontal row of compact meta chips below the card content.
 */
export function StlMetaStrip({
  ruleNumber,
  rating,
  refillingCount,
  examInfo,
  compact = false,
  className = "",
}: Props) {
  const items: { icon: string; label: string; value: string }[] = [];

  if (ruleNumber) {
    items.push({ icon: "#️⃣", label: "Rule", value: ruleNumber });
  }
  if (rating !== undefined) {
    items.push({ icon: "⭐", label: "Rating", value: rating.toFixed(1) });
  }
  if (refillingCount !== undefined) {
    items.push({ icon: "🔄", label: "Refill", value: `${refillingCount}×` });
  }
  if (examInfo) {
    items.push({ icon: "📝", label: "Exam", value: examInfo });
  }

  if (items.length === 0) return null;

  const textSize = compact ? "text-[8px]" : "text-[9px]";
  const valSize = compact ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-[10px]" aria-hidden>{item.icon}</span>
          <span className={`${textSize} uppercase tracking-wider text-white/40`}>{item.label}</span>
          <span className={`${valSize} font-semibold text-white/80 tabular-nums`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
