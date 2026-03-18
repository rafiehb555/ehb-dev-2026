"use client";

import type { ReactNode } from "react";

interface AIFeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function AIFeatureItem({ icon, title, description }: AIFeatureItemProps) {
  return (
    <div className="rounded-2xl glass-panel border border-white/10 px-4 py-3 flex items-start gap-3 hover:border-violet-400/40 transition-colors">
      <div className="mt-0.5 text-base" aria-hidden>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

