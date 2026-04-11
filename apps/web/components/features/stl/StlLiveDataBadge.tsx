type Props = {
  mode: "live" | "demo";
  className?: string;
};

export function StlLiveDataBadge({ mode, className = "" }: Props) {
  const live = mode === "live";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        live
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
          : "border-amber-400/40 bg-amber-500/15 text-amber-100",
        className,
      ].join(" ")}
      title={live ? "Data from Trust Engine APIs" : "Offline / demo snapshot"}
    >
      {live ? "Live data" : "Demo data"}
    </span>
  );
}
