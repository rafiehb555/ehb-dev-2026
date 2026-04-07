"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Industry } from "@/lib/industry/config";
import { getIndustryDesignAssets } from "@/lib/industry/designAssets";
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
  const assets = getIndustryDesignAssets(industry);
  const [thumbFailed, setThumbFailed] = useState(false);

  const miniFlow = (() => {
    switch (industry.slug) {
      case "it":
      case "ai":
      case "blockchain":
        return [
          { label: "Client", emoji: "🧑‍💻" },
          { label: "Developer", emoji: "🛠️" },
          { label: "Payment", emoji: "🔒" },
        ];
      case "health":
        return [
          { label: "Patient", emoji: "👤" },
          { label: "Doctor", emoji: "🩺" },
          { label: "Treatment", emoji: "✅" },
        ];
      case "education":
        return [
          { label: "Student", emoji: "📚" },
          { label: "Teacher", emoji: "🧑‍🏫" },
          { label: "Progress", emoji: "📈" },
        ];
      default:
        return [
          { label: "Request", emoji: "📝" },
          { label: "Verified", emoji: "🛡️" },
          { label: "Secure", emoji: "🔒" },
        ];
    }
  })();

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
      aria-label={`Open ${industry.name} landing page`}
    >
      <div className="relative -mx-4 -mt-4 mb-3 h-[88px] overflow-hidden rounded-t-xl border-b border-white/10 isolate bg-[#020c1b]">
        {/* next/image: public/ paths + SVG; onError → gradient. Optimizer off in next.config.mjs. */}
        {assets.cardThumb && !thumbFailed ? (
          <Image
            src={assets.cardThumb}
            alt={assets.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 220px"
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}55 0%, #020c1b 50%, #0f172a 100%)`,
            }}
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ background: `linear-gradient(135deg, ${accent}88, transparent 60%)` }}
          aria-hidden
        />
      </div>
      <div className="mb-3">
        <IndustryIcon name={industry.icon} accentColor={accent} size={28} />
      </div>
      <p className="font-semibold text-white text-sm group-hover:text-white transition-colors">
        {industry.shortName}
      </p>
      <p className="text-[11px] text-ehb-textMuted mt-0.5 line-clamp-2">{industry.overview}</p>
      <div
        className="mt-3 h-0.5 w-12 rounded-full transition-opacity group-hover:opacity-100 opacity-80"
        style={{ backgroundColor: accent }}
      />

      {/* Mini industry flow preview */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {miniFlow.map((n, idx) => (
            <div key={n.label} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 rounded-full border px-2 py-1 glass-panel"
                style={{
                  borderColor: `${accent}33`,
                  backgroundColor: "rgba(2,12,27,0.35)",
                  boxShadow: `0 0 18px ${glowColor}`,
                }}
              >
                <span aria-hidden className="text-[13px]">
                  {n.emoji}
                </span>
                <span className="text-[10px] text-ehb-textBody max-w-[70px] truncate">
                  {n.label}
                </span>
              </div>
              {idx !== miniFlow.length - 1 && (
                <span
                  className="text-[12px] text-ehb-textMuted animate-pulse"
                  aria-hidden
                  style={{ color: accent }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
