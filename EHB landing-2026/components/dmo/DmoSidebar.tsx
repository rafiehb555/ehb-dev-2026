"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DMO_NAV_SECTIONS } from "./navigation";

type DmoSidebarProps = {
  badges?: Record<string, number>;
  className?: string;
  selectedSectionKey?: string | null;
};

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DmoSidebar(props: DmoSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const autoExpanded = useMemo(() => {
    const current = DMO_NAV_SECTIONS.find(
      (section) => isPathActive(pathname, section.href) || section.items.some((item) => isPathActive(pathname, item.href))
    );
    return current?.key ?? null;
  }, [pathname]);

  const activeSection =
    DMO_NAV_SECTIONS.find((section) => section.key === props.selectedSectionKey) ??
    DMO_NAV_SECTIONS.find((section) => section.key === autoExpanded) ??
    DMO_NAV_SECTIONS[0];
  const sectionBadge = props.badges?.[activeSection.key] ?? 0;

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
              <div className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">DMO Panel</div>
              <div className="text-sm font-semibold text-white">Module Navigation</div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-white">DMO</div>
          )}
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-ehb-textBody hover:bg-white/10"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {!collapsed ? (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/8 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
                {activeSection.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-white">{activeSection.label}</div>
                  {sectionBadge > 0 ? (
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-100">
                      {sectionBadge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[11px] leading-5 text-ehb-textBody">
                  Main module upar card se select hota hai. Yahan us module ke andar ke options milenge.
                </p>
              </div>
            </div>
            <Link
              href={activeSection.href}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-ehb-textBody transition-colors hover:bg-white/10"
            >
              <span>Open {activeSection.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}

        <nav className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
          {activeSection.items.map((item) => {
            const itemActive = isPathActive(pathname, item.href);
            const badge = props.badges?.[item.key] ?? 0;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors border",
                  itemActive
                    ? "border-cyan-400/30 bg-cyan-500/15 text-cyan-100"
                    : "border-transparent text-ehb-textBody hover:bg-white/5",
                ].join(" ")}
              >
                <span className="h-2 w-2 rounded-full bg-slate-500/70" />
                {!collapsed ? <span className="flex-1">{item.label}</span> : null}
                {badge > 0 ? (
                  <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-100">
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

