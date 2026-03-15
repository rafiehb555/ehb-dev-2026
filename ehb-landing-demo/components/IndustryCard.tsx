"use client";

import Link from "next/link";
import type { Industry } from "@/lib/industries";
import { IndustryIcon } from "./IndustryIcon";

interface IndustryCardProps {
  industry: Industry;
}

/** Hex to rgba with alpha for glow */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  const accent = industry.accentColor;
  const glowColor = hexToRgba(accent, 0.35);

  return (
    <Link
      href={`/landing/${industry.slug}`}
      className="group block rounded-xl glass-panel p-4 border border-white/10 transition-all duration-300 ease-out hover:border-[var(--card-accent)] hover:shadow-[0_0_24px_var(--card-glow)] hover:-translate-y-1.5 hover:scale-[1.03] will-change-transform"
      style={
        {
          "--card-accent": accent,
          "--card-glow": glowColor,
        } as React.CSSProperties
      }
      aria-label={`View ${industry.name} services`}
    >
      <div className="mb-3">
        <IndustryIcon name={industry.icon} accentColor={accent} size={28} />
      </div>
      <p className="font-semibold text-white text-sm group-hover:text-white transition-colors">
        {industry.shortName}
      </p>
      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{industry.overview}</p>
      <div
        className="mt-3 h-0.5 w-12 rounded-full transition-opacity group-hover:opacity-100 opacity-80"
        style={{ backgroundColor: accent }}
      />
    </Link>
  );
}
