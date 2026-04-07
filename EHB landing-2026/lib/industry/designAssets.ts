import type { Industry } from "@/lib/industry/config";

/**
 * Optional static files under public/images/industries/<slug>/.
 * When absent, UI uses accent-based gradients (IndustryCard, hero, banners).
 * Card/hero URLs are rendered with `next/image` in IndustryCard and IndustryHomeBanner (`next.config` may use `images.unoptimized`).
 */
export type IndustryDesignAssets = {
  /** Small card thumbnail — defaults to shared SVG until PATH_OVERRIDES / per-slug files */
  cardThumb: string;
  /** Wide hero image — defaults to shared SVG */
  heroImage: string;
  alt: string;
};

/** Shared branded placeholders — replace per slug via PATH_OVERRIDES when you add real webp/png. */
const DEFAULT_CARD = "/images/industries/shared/card.svg";
const DEFAULT_HERO = "/images/industries/shared/hero.svg";

/** Manual overrides when files exist in public/images/industries/<slug>/ */
const PATH_OVERRIDES: Partial<Record<string, { cardThumb?: string; heroImage?: string }>> = {};

export function getIndustryDesignAssets(industry: Pick<Industry, "slug" | "name" | "shortName">): IndustryDesignAssets {
  const o = PATH_OVERRIDES[industry.slug];
  return {
    cardThumb: o?.cardThumb ?? DEFAULT_CARD,
    heroImage: o?.heroImage ?? DEFAULT_HERO,
    alt: `${industry.name} — EHB industry`,
  };
}
