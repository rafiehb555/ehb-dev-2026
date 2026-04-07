"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accentColor?: string;
  href?: string;
}

export function FeatureCard({ title, description, icon, accentColor = "#00eaff", href }: FeatureCardProps) {
  const content = (
    <div
      className="h-full rounded-2xl glass-card card-hover p-6 border transition-all duration-300 flex flex-col"
      style={{
        borderColor: "rgba(148,163,184,0.25)",
        boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: `${accentColor}22`,
            boxShadow: `0 0 18px ${accentColor}44`,
          }}
        >
          <span aria-hidden style={{ color: accentColor }}>
            {icon}
          </span>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-ehb-textMuted flex-1">{description}</p>
      {href ? (
        <p className="mt-3 text-[11px] font-medium text-cyan-400/90 group-hover:text-cyan-300">Open →</p>
      ) : null}
    </div>
  );

  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className="group block will-change-transform hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(0,234,255,0.3)] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020c1b]"
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className="group block will-change-transform hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(0,234,255,0.3)] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="will-change-transform hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(0,234,255,0.3)] rounded-2xl">
      {content}
    </div>
  );
}
