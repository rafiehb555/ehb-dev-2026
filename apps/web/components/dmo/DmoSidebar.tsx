"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { DMO_NAV_SECTIONS, getDmoSectionKeyFromPathname } from "./navigation";

type DmoSidebarProps = {
  badges?: Record<string, number>;
  className?: string;
  selectedSectionKey?: string | null;
};

export function DmoSidebar(props: DmoSidebarProps) {
  const pathname = usePathname() ?? "";

  const activeModuleKey = useMemo(
    () => props.selectedSectionKey ?? getDmoSectionKeyFromPathname(pathname),
    [pathname, props.selectedSectionKey]
  );

  return (
    <aside className={props.className ?? ""}>
      <div className="glass-panel flex h-full min-h-0 flex-col space-y-3 border border-white/10 p-3 transition-all duration-200">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">DMO Panel</div>
          <div className="text-sm font-semibold text-white">Modules</div>
          <p className="mt-1 text-[10px] leading-relaxed text-ehb-textBody">
            Pick a module here. Its sub-pages appear in the top bar.
          </p>
        </div>

        <nav
          className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-0.5"
          aria-label="DMO main modules"
        >
          {DMO_NAV_SECTIONS.map((section) => {
            const isActive = section.key === activeModuleKey;
            const badge = props.badges?.[section.key] ?? 0;
            return (
              <Link
                key={section.key}
                href={section.href}
                className={[
                  "flex items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-left text-xs transition-colors",
                  isActive
                    ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    : "border-transparent text-ehb-textBody hover:border-white/10 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {section.icon}
                </span>
                <span className="min-w-0 flex-1 font-medium leading-snug">{section.label}</span>
                {badge > 0 ? (
                  <span className="shrink-0 rounded-full border border-amber-400/35 bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-100">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
