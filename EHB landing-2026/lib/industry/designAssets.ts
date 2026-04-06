import type { Industry } from "@/lib/industry/config";

/**
 * Optional static files under public/images/industries/<slug>/.
 * When absent, UI uses accent-based gradients (IndustryCard, hero, banners).
 */
export type IndustryDesignAssets = {
  /** Small card thumbnail (e.g. card.webp) */
  cardThumb?: string;
  /** Wide hero image (e.g. hero.webp) */
  heroImage?: string;
  alt: string;
};

/** Manual overrides when files exist in public/ */
const PATH_OVERRIDES: Partial<Record<string, { cardThumb?: string; heroImage?: string }>> = {
  // Example — uncomment when assets are added:
  // health: { cardThumb: "/images/industries/health/card.webp", heroImage: "/images/industries/health/hero.webp" },
};

export function getIndustryDesignAssets(industry: Pick<Industry, "slug" | "name" | "shortName">): IndustryDesignAssets {
  const o = PATH_OVERRIDES[industry.slug];
  return {
    cardThumb: o?.cardThumb,
    heroImage: o?.heroImage,
    alt: `${industry.name} — EHB industry`,
  };
}
