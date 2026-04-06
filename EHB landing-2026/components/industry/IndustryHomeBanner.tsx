import Image from "next/image";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";

/** Compact banner for Industry Home — shared or per-slug hero from designAssets. */
export function IndustryHomeBanner({ industry }: { industry: Industry }) {
  const accent = industry.accentColor;
  const assets = getIndustryDesignAssets(industry);

  return (
    <div className="relative w-full h-[120px] md:h-[140px] overflow-hidden rounded-2xl border border-white/10">
      <Image
        src={assets.heroImage}
        alt={assets.alt}
        fill
        loading="lazy"
        className="object-cover object-center opacity-95"
        sizes="(max-width: 768px) 100vw, 896px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020c1b]/95 via-[#020c1b]/65 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{ background: `linear-gradient(110deg, ${accent}66, transparent 50%)` }}
        aria-hidden
      />
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
