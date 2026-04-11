"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface AIFeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  accentColor?: string;
  href?: string;
}

export function AIFeatureItem({
  icon,
  title,
  description,
  badge,
  accentColor = "#8b5cf6",
  href,
}: AIFeatureItemProps) {
  const body = (
    <div
      className="rounded-2xl glass-panel border px-4 py-3 flex items-start gap-3 transition-all duration-300 group-hover:border-white/20"
      style={{
        borderColor: `${accentColor}2a`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset`,
      }}
    >
      <div
        className="mt-0.5 text-base h-9 w-9 rounded-xl flex items-center justify-center border shrink-0"
        style={{
          backgroundColor: `${accentColor}18`,
          borderColor: `${accentColor}33`,
          boxShadow: `0 0 16px ${accentColor}35`,
        }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
          {badge && (
            <span
              className="inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-medium"
              style={{
                backgroundColor: `${accentColor}14`,
                borderColor: `${accentColor}40`,
                color: "rgba(226,232,240,0.95)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-ehb-textMuted">{description}</p>
        {href ? (
          <p className="text-[10px] font-medium text-cyan-400/80 mt-2 group-hover:text-cyan-300">Tap to explore →</p>
        ) : null}
      </div>
    </div>
  );

  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
      >
        {body}
      </Link>
    );
  }

  return body;
}
