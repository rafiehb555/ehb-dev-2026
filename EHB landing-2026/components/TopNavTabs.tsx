"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Landing", href: "/", color: "from-[#33C3FF] to-[#3b82f6]" },
  { label: "Home", href: "/home", color: "from-[#22b14c] to-[#16a34a]" },
  { label: "AI Market", href: "/ai-marketplace", color: "from-[#8b5cf6] to-[#6366f1]" },
  { label: "Development", href: "/development", color: "from-[#f59e0b] to-[#f97316]" },
  { label: "Admin", href: "/admin", color: "from-[#38bdf8] to-[#0ea5e9]" },
  { label: "DMO", href: "/dmo", color: "from-[#ec4899] to-[#f97316]" },
  { label: "Auth", href: "/auth", color: "from-[#34d399] to-[#10b981]" },
];

export function TopNavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
      {TABS.map((tab) => {
        const active =
          tab.href === "/"
            ? pathname === "/" || pathname.startsWith("/landing/")
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              "min-h-touch min-w-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs transition-all duration-200",
              active
                ? `bg-gradient-to-r ${tab.color} text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.5)]`
                : "text-ehb-textBody hover:text-white hover:bg-white/5",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

