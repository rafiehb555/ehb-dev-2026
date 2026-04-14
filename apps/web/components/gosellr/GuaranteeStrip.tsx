"use client";

type Props = {
  moneyBackDays: number | null;   // null = not offered
  replacementDays: number | null; // null = not offered
  compact?: boolean;               // smaller for card view
  className?: string;
};

/**
 * Guarantee Strip — Money Back Guarantee + Replacement time.
 * Shows green chips with days if offered, red "Not Offered" if not.
 */
export function GuaranteeStrip({ moneyBackDays, replacementDays, compact = false, className = "" }: Props) {
  const chipBase = compact
    ? "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-semibold"
    : "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {/* Money Back Guarantee */}
      {moneyBackDays !== null && moneyBackDays > 0 ? (
        <span
          className={chipBase}
          style={{
            color: "#22B14C",
            background: "rgba(34,177,76,0.12)",
            border: "1px solid rgba(34,177,76,0.25)",
          }}
        >
          <span aria-hidden>💰</span>
          Money Back {moneyBackDays}d
        </span>
      ) : (
        <span
          className={chipBase}
          style={{
            color: "#F05858",
            background: "rgba(240,88,88,0.08)",
            border: "1px solid rgba(240,88,88,0.2)",
          }}
        >
          <span aria-hidden>❌</span>
          No Money Back
        </span>
      )}

      {/* Replacement */}
      {replacementDays !== null && replacementDays > 0 ? (
        <span
          className={chipBase}
          style={{
            color: "#2BBFA0",
            background: "rgba(43,191,160,0.12)",
            border: "1px solid rgba(43,191,160,0.25)",
          }}
        >
          <span aria-hidden>🔄</span>
          Replace {replacementDays}d
        </span>
      ) : (
        <span
          className={chipBase}
          style={{
            color: "#F05858",
            background: "rgba(240,88,88,0.08)",
            border: "1px solid rgba(240,88,88,0.2)",
          }}
        >
          <span aria-hidden>❌</span>
          No Replacement
        </span>
      )}
    </div>
  );
}
