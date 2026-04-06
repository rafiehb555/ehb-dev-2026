"use client";

import Link from "next/link";

interface FranchiseLevelCardProps {
  title: string;
  description: string;
  color: string;
  highlighted?: boolean;
  href: string;
}

export function FranchiseLevelCard({ title, description, color, highlighted, href }: FranchiseLevelCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl glass-card card-hover p-6 border transition-all duration-300 flex flex-col gap-2 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
      style={{
        borderColor: highlighted ? `${color}80` : `${color}40`,
        boxShadow: highlighted ? `0 0 28px ${color}55` : undefined,
      }}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {highlighted ? "Recommended" : "Franchise Level"}
      </p>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
      <p className="text-[10px] font-medium text-cyan-400/90 mt-1">Open in DMO →</p>
    </Link>
  );
}
