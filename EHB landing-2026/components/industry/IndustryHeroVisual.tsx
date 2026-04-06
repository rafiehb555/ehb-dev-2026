import Image from "next/image";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";

export function IndustryHeroVisual({ industry }: { industry: Industry }) {
  const accent = industry.accentColor;
  const assets = getIndustryDesignAssets(industry);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-square rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.35)]">
      <Image
        src={assets.heroImage}
        alt={assets.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 28rem"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020c1b]/90 via-[#020c1b]/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ background: `radial-gradient(circle at 70% 30%, ${accent}, transparent 55%)` }}
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">{industry.shortName}</p>
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{industry.heroTitle}</p>
      </div>
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        aria-hidden
      />
    </div>
  );
}
