export type ChooserBadgeVariant = "cyan" | "violet" | "amber" | "emerald" | "rose" | "blue" | "secondary";

/** Visual theme per chooser scenario category — distinct cards & badges. */
export function getChooserCategoryTheme(category: string): {
  card: string;
  badge: ChooserBadgeVariant;
  bar: string;
} {
  const map: Record<string, { card: string; badge: ChooserBadgeVariant; bar: string }> = {
    planning: {
      card: "border-cyan-500/35 bg-gradient-to-br from-cyan-950/45 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.12)]",
      badge: "cyan",
      bar: "from-cyan-400 to-teal-500",
    },
    flow: {
      card: "border-violet-500/35 bg-gradient-to-br from-violet-950/45 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)]",
      badge: "violet",
      bar: "from-violet-400 to-fuchsia-500",
    },
    operations: {
      card: "border-amber-500/35 bg-gradient-to-br from-amber-950/40 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.1)]",
      badge: "amber",
      bar: "from-amber-400 to-orange-500",
    },
    franchise: {
      card: "border-emerald-500/35 bg-gradient-to-br from-emerald-950/40 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.1)]",
      badge: "emerald",
      bar: "from-emerald-400 to-cyan-500",
    },
    trust: {
      card: "border-rose-500/35 bg-gradient-to-br from-rose-950/40 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(251,113,133,0.1)]",
      badge: "rose",
      bar: "from-rose-400 to-orange-400",
    },
    deploy: {
      card: "border-blue-500/35 bg-gradient-to-br from-blue-950/45 via-slate-950/90 to-slate-950 shadow-[inset_0_1px_0_0_rgba(96,165,250,0.12)]",
      badge: "blue",
      bar: "from-blue-400 to-indigo-500",
    },
  };
  return map[category] ?? map.planning;
}
