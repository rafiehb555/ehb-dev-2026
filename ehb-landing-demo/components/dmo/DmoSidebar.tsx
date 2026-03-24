"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DMO_NAV_SECTIONS } from "./navigation";

type DmoSidebarProps = {
  badges?: Record<string, number>;
  className?: string;
};

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DmoSidebar(props: DmoSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const autoExpanded = useMemo(() => {
    const current = DMO_NAV_SECTIONS.find(
      (section) => isPathActive(pathname, section.href) || section.items.some((item) => isPathActive(pathname, item.href))
    );
    return current?.key ?? null;
  }, [pathname]);

  const activeExpanded = expandedSection ?? autoExpanded;

  return (
    <aside className={props.className ?? ""}>
      <div
        className={[
          "glass-panel border border-white/10 transition-all duration-200",
          collapsed ? "p-2" : "p-3",
          "space-y-3",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2">
          {!collapsed ? (
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">DMO Panel</div>
              <div className="text-sm font-semibold text-white">Control Navigation</div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-white">DMO</div>
          )}
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
          {DMO_NAV_SECTIONS.map((section) => {
            const sectionActive =
              isPathActive(pathname, section.href) ||
              section.items.some((item) => isPathActive(pathname, item.href));
            const sectionOpen = !collapsed && activeExpanded === section.key;
            const sectionBadge = props.badges?.[section.key] ?? 0;
            return (
              <div key={section.key} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setExpandedSection((s) => (s === section.key ? null : section.key))}
                  className={[
                    "w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs border transition-all",
                    sectionActive
                      ? "border-cyan-400/35 bg-cyan-500/20 text-cyan-100 shadow-[0_0_0_1px_rgba(0,234,255,0.15)]"
                      : "border-transparent text-slate-200 hover:bg-white/5",
                  ].join(" ")}
                >
                  <span className="text-sm">{section.icon}</span>
                  {!collapsed ? <span className="flex-1 text-left font-medium">{section.label}</span> : null}
                  {!collapsed && sectionBadge > 0 ? (
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-100">
                      {sectionBadge}
                    </span>
                  ) : null}
                  {!collapsed ? <span className="text-[10px] text-slate-400">{sectionOpen ? "−" : "+"}</span> : null}
                </button>

                {sectionOpen ? (
                  <div className="space-y-1 pl-2">
                    {section.items.map((item) => {
                      const itemActive = isPathActive(pathname, item.href);
                      const badge = props.badges?.[item.key] ?? 0;
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className={[
                            "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] transition-colors border",
                            itemActive
                              ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-100"
                              : "border-transparent text-slate-300 hover:bg-white/5",
                          ].join(" ")}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500/70" />
                          <span className="flex-1">{item.label}</span>
                          {badge > 0 ? (
                            <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-100">
                              {badge}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

