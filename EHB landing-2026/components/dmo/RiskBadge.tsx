"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "low" | "medium" | "high";

export function RiskBadge({ risk }: { risk: RiskLevel | string | null | undefined }) {
  const normalized = String(risk ?? "").toUpperCase();
  const tone =
    normalized === "HIGH"
      ? "text-rose-300 border-rose-400/40 bg-rose-500/10"
      : normalized === "MEDIUM"
        ? "text-amber-200 border-amber-400/40 bg-amber-500/10"
        : "text-emerald-200 border-emerald-400/40 bg-emerald-500/10";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
      {normalized || "LOW"}
    </span>
  );
}

