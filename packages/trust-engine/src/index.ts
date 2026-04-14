/**
 * EHB Trust Engine — shared PSS + CRB + DMO + STL logic.
 *
 * 🔒 The canonical STL formula lives in services/api/stl-replit/services/stlService.js
 *    and is protected by 58 gold-master tests (npm run test:stl).
 *    This package re-exports computed types + helpers, never re-implements the formula.
 */

export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TrustScores {
  pss: TrustLevel | null;
  crb: TrustLevel | null; // null = N/A (e.g. digital content)
  dmo: TrustLevel | null;
  stl: TrustLevel;
  score: number; // 0–100
}

export interface BuyerProtection {
  moneyBackDays: number | null;
  replacementDays: number | null;
}

/** Word label for an STL level (Weak → Supreme) */
export function stlLabel(level: TrustLevel): string {
  if (level <= 2) return "Weak";
  if (level <= 4) return "Basic";
  if (level <= 5) return "Moderate";
  if (level <= 6) return "Trusted";
  if (level <= 7) return "Strong";
  if (level <= 8) return "Excellent";
  return "Supreme";
}

/** Hex color for an STL level (matches design tokens) */
export function stlColor(level: TrustLevel): string {
  if (level <= 3) return "#F05858"; // red
  if (level <= 5) return "#F0A030"; // amber
  if (level <= 7) return "#2BBFA0"; // teal
  return "#7B6EF6";                  // purple
}

/** MIN-rule chain helper: final STL = min(product, seller, company, owner). */
export function minStlChain(...levels: Array<TrustLevel | null | undefined>): TrustLevel {
  const valid = levels.filter((l): l is TrustLevel => typeof l === "number");
  if (valid.length === 0) return 0 as TrustLevel;
  return valid.reduce<TrustLevel>((m, l) => (l < m ? l : m), valid[0]);
}

/** Guarantee → STL bonus (as per Master Info §94.4) */
export function guaranteeBonus(p: BuyerProtection): number {
  let bonus = 0;
  if (p.moneyBackDays && p.moneyBackDays > 0) bonus += 0.5;
  if (p.replacementDays && p.replacementDays > 0) bonus += 0.3;
  return bonus;
}
