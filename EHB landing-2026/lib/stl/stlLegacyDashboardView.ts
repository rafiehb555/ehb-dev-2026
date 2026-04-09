import { getLevelMeta } from "@/lib/stl/levels";

/** Minimal snapshot shape for legacy STL dashboard derivations. */
export type StlLegacyDashboardSnapshot = {
  progressPercent?: number;
  progress?: { percent?: number };
  stlLevel: number;
  nextLevelLevel: number | null;
  blocked?: boolean;
  pss?: { complaints?: number };
};

export function stlLegacyProgressPercent(data: StlLegacyDashboardSnapshot): number {
  return data.progressPercent ?? data.progress?.percent ?? 0;
}

export function stlLegacyCurrentLevelName(level: number): string {
  return getLevelMeta(level).name;
}

export function stlLegacyNextLevelName(nextLevelLevel: number | null): string {
  if (nextLevelLevel == null) return "MAX";
  return getLevelMeta(nextLevelLevel).name;
}

/** Warning when complaints are high but upgrade is not yet blocked. */
export function stlLegacyComplaintWarning(
  complaints: number,
  blocked: boolean | undefined,
  threshold = 6,
): boolean {
  return complaints >= threshold && !blocked;
}

export function stlLegacyIsSupremeLevel(level: number): boolean {
  return level === 8;
}
