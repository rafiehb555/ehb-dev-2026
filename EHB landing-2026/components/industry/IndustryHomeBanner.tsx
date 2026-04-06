import Image from "next/image";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";

/** Compact banner for Industry Home — uses hero asset when present. */
export function IndustryHomeBanner({ industry }: { industry: Industry }) {
  const accent = industry.accentColor;
  const assets = getIndustryDesignAssets(industry);

  return (
    <div className="relative w-full h-[120px] md:h-[140px] overflow-hidden rounded-2xl border border-white/10">
      {assets.heroImage ? (
        <>
          <Image
            src={assets.heroImage}
            alt={assets.alt}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020c1b]/95 via-[#020c1b]/70 to-transparent" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(110deg, ${accent}44 0%, rgba(2,12,27,0.95) 45%, #020c1b 100%)`,
          }}
        />
      )}
      <div className="relative z-10 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">EHB marketplace</p>
          <p className="text-sm md:text-base font-semibold text-white">{industry.heroTitle}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-2xl line-clamp-2">{industry.overview}</p>
        </div>
      </div>
    </div>
  );
}
