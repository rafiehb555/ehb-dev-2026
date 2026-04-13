"use client";

import Link from "next/link";
import type { DmoNavSection } from "./navigation";
import { isDmoPathActive } from "./navigation";

type Props = {
  section: DmoNavSection;
  pathname: string;
};

export function DmoTopSubNav({ section, pathname }: Props) {
  return (
    <div className="border-t border-white/10 bg-[#0B0F14]/95">
      <div className="container-ehb py-2">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400/90">In this module</p>
          <p className="text-xs text-white/70">
            <span className="font-medium text-white/90">{section.label}</span>
            <span className="text-white/50"> — sub-pages</span>
          </p>
        </div>
        <div
          className="-mx-1 flex gap-1.5 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]"
          role="navigation"
          aria-label={`${section.label} sub-navigation`}
        >
          {section.items.map((item) => {
            const active = isDmoPathActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap",
                  active
                    ? "border-cyan-400/45 bg-cyan-500/20 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
