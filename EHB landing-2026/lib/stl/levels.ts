export type EhbStlLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type EhbStlLevelMeta = {
  level: EhbStlLevel;
  code: string;
  name: string;
  min: number;
  max: number;
  requiresManualApproval?: boolean;
};

export const EHB_STL_LEVELS: EhbStlLevelMeta[] = [
  { level: 1, code: "L1", name: "FREE", min: 0, max: 20 },
  { level: 2, code: "L2", name: "BASIC", min: 21, max: 40 },
  { level: 3, code: "L3", name: "NORMAL", min: 41, max: 55 },
  { level: 4, code: "L4", name: "STANDARD", min: 56, max: 65 },
  { level: 5, code: "L5", name: "ADVANCED", min: 66, max: 75 },
  { level: 6, code: "L6", name: "HIGH", min: 76, max: 85 },
  { level: 7, code: "L7", name: "VIP", min: 86, max: 95 },
  { level: 8, code: "L8", name: "SUPREME 👑", min: 96, max: 100, requiresManualApproval: true },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getLevelMeta(level: number): EhbStlLevelMeta {
  const safe = clamp(Math.floor(level), 1, 8) as EhbStlLevel;
  return EHB_STL_LEVELS.find((l) => l.level === safe) ?? EHB_STL_LEVELS[0];
}

export function getLevelMetaForScore(score: number, supremeApproved: boolean): EhbStlLevelMeta {
  const s = clamp(Math.round(score), 0, 100);
  const meta = EHB_STL_LEVELS.find((l) => s >= l.min && s <= l.max) ?? EHB_STL_LEVELS[0];
  if (meta.level === 8 && !supremeApproved) {
    // Supreme cannot be auto-assigned until DMO approval.
    return getLevelMeta(7);
  }
  return meta;
}

export function getProgressToNextLevel(score: number, level: number): number {
  const s = clamp(Math.round(score), 0, 100);
  const current = getLevelMeta(level);
  if (current.level >= 8) return 100;
  const next = getLevelMeta(current.level + 1);
  const span = Math.max(1, next.min - current.min);
  const value = ((s - current.min) / span) * 100;
  return clamp(Math.round(value), 0, 100);
}

