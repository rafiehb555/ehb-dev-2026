"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageSwitchProps {
  industrySlug?: string;
}

export function PageSwitch({ industrySlug }: PageSwitchProps) {
  const pathname = usePathname();

  const isLanding = pathname === "/" || pathname.startsWith("/landing");
  const isHome = pathname.startsWith("/industry");
  const isDashboard = pathname.startsWith("/dashboard");

  const landingHref = industrySlug ? `/landing/${industrySlug}` : "/";
  const homeHref = industrySlug ? `/industry/${industrySlug}` : "/industries";
  const dashboardHref = "/dashboard";

  const baseClass =
    "flex-1 min-w-[90px] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-250 transform will-change-transform";

  const activeClass =
    "bg-gradient-to-r from-[#00eaff] to-[#22c55e] text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.4)] scale-[1.03] border border-white/60";

  const inactiveClass =
    "glass-panel border border-white/15 text-ehb-textBody hover:text-white hover:border-[#00eaff]/40 hover:shadow-[0_0_16px_rgba(0,234,255,0.25)]";

  const items = [
    { key: "landing", label: "Landing", href: landingHref, active: isLanding },
    { key: "home", label: "Home", href: homeHref, active: isHome },
    { key: "dashboard", label: "Dashboard", href: dashboardHref, active: isDashboard },
  ];

  return (
    <div className="container-ultra pt-6 pb-2">
      <div className="flex gap-2 sm:gap-3">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`${baseClass} ${item.active ? activeClass : inactiveClass}`}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              {item.active && (
                <div className="h-0.5 w-8 rounded-full bg-white/80 mb-0.5" aria-hidden />
              )}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

