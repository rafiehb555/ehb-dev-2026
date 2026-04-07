"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STL_DASHBOARD_NAV } from "./stlNav";

export function StlDashboardSidebar() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      className="flex flex-col gap-1 border-r border-white/10 bg-black/20 p-3 backdrop-blur-md lg:w-[210px] lg:shrink-0"
      aria-label="STL dashboard navigation"
    >
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">Navigate</p>
      {STL_DASHBOARD_NAV.map((item) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                : "border border-transparent text-ehb-textBody hover:border-white/10 hover:bg-white/[0.06] hover:text-white",
            ].join(" ")}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-cyan-300" : "text-ehb-textMuted group-hover:text-cyan-200/80"}`} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
