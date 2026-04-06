"use client";

import { useState } from "react";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";

/**
 * Hero visual: optional image from public/; on error or missing, CSS gradient only (no broken icon).
 */
export function IndustryHeroVisual({ industry }: { industry: Industry }) {
  const accent = industry.accentColor;
  const assets = getIndustryDesignAssets(industry);
  const [imgFailed, setImgFailed] = useState(false);

  const showImg = assets.heroImage && !imgFailed;

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-square rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.35)] bg-[#020c1b] isolate">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- intentional: SVG + reliable onError fallback
        <img
          src={assets.heroImage}
          alt={assets.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accent}66, transparent 50%), radial-gradient(circle at 80% 80%, ${accent}33, #020c1b 75%), linear-gradient(165deg, #0f172a 0%, #020c1b 100%)`,
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020c1b]/90 via-[#020c1b]/25 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ background: `radial-gradient(circle at 70% 30%, ${accent}, transparent 55%)` }}
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-[1]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/90">{industry.shortName}</p>
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2 drop-shadow-sm">{industry.heroTitle}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 z-[1]" aria-hidden />
    </div>
  );
}
