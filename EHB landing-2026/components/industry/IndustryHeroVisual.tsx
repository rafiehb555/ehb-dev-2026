import Image from "next/image";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";

export function IndustryHeroVisual({ industry }: { industry: Industry }) {
  const accent = industry.accentColor;
  const assets = getIndustryDesignAssets(industry);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-square rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.35)]">
      {assets.heroImage ? (
        <Image
          src={assets.heroImage}
          alt={assets.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 28rem"
          priority
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 50%), radial-gradient(circle at 80% 80%, ${accent}33, #020c1b 70%)`,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/70 text-center">{industry.shortName}</p>
          <p className="text-lg font-semibold text-white text-center leading-snug">{industry.heroTitle}</p>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        aria-hidden
      />
    </div>
  );
}
