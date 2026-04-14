/**
 * EHB Industry Registry — single source of truth for all 32 industries.
 *
 * ❌ NEVER import `data/ehb-data/industries.json` directly — always use this package.
 * ❌ NEVER hand-edit this file or `generated.ts` — run `scripts/add-industry.mjs`.
 *
 * Consumers: TopBar nav, Home cards, Dashboard grid, sitemap, search, AI assistant,
 *            routing guards, admin panel, BFF, tests.
 */

import industriesData from "../../../data/ehb-data/industries.json";

export type IndustryGroup = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type IndustryStatus = "active" | "beta" | "coming-soon";
export type IndustryPhase = 1 | 2 | 3;

export interface Industry {
  /** kebab-case URL slug, e.g. "gosellr" */
  code: string;
  /** Display name, e.g. "GoSellr" */
  name: string;
  /** Human category, e.g. "E-commerce" */
  category: string;
  /** 7 groups (A–G) for Home page card clusters */
  group: IndustryGroup;
  /** Hex brand accent, e.g. "#29ABE2" */
  accent: string;
  /** lucide-react icon name */
  icon: string;
  /** Lifecycle status */
  status: IndustryStatus;
  /** Minimum Seller STL to list in this industry */
  trustMinStl: number;
  /** Rollout phase (1 = now, 2 = Q3, 3 = Q4+) */
  phase: IndustryPhase;
}

export const INDUSTRIES: readonly Industry[] = industriesData as Industry[];

/** Get one industry by its URL code. Returns undefined if not found. */
export function getIndustry(code: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.code === code);
}

/** All industries in a given group (A–G). */
export function byGroup(group: IndustryGroup): Industry[] {
  return INDUSTRIES.filter((i) => i.group === group);
}

/** Only industries currently open to users. */
export function activeIndustries(): Industry[] {
  return INDUSTRIES.filter((i) => i.status === "active");
}

/** Industries in a given rollout phase. */
export function byPhase(phase: IndustryPhase): Industry[] {
  return INDUSTRIES.filter((i) => i.phase === phase);
}

/** Quick existence check — used by route guards. */
export function industryExists(code: string): boolean {
  return INDUSTRIES.some((i) => i.code === code);
}

/** All valid industry codes (for static params / type narrowing). */
export function allCodes(): string[] {
  return INDUSTRIES.map((i) => i.code);
}

/** Total count — used in Home hero ("32+ industries") */
export function industryCount(): number {
  return INDUSTRIES.length;
}
