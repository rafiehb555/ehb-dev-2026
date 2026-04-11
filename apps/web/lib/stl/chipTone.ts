/**
 * Shared Tailwind classes for EHB-STL-LEVEL chips (L1–L8) on cards and inline badges.
 */
export function stlLevelChipClasses(level: number): string {
  if (level >= 8) return "border-amber-300/60 bg-amber-500/20 text-amber-100";
  if (level >= 7) return "border-fuchsia-400/45 bg-fuchsia-500/15 text-fuchsia-100";
  if (level >= 6) return "border-emerald-400/45 bg-emerald-500/10 text-emerald-100";
  if (level >= 5) return "border-sky-400/45 bg-sky-500/10 text-sky-100";
  if (level === 4) return "border-cyan-400/45 bg-cyan-500/10 text-cyan-100";
  if (level === 3) return "border-violet-400/45 bg-violet-500/10 text-violet-100";
  if (level === 2) return "border-amber-400/45 bg-amber-500/10 text-amber-100";
  return "border-rose-400/45 bg-rose-500/10 text-rose-100";
}
