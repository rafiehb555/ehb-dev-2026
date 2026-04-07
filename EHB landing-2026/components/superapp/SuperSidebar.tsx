"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/home", icon: "🏠" },
  { label: "DMO", href: "/dmo", icon: "🧠" },
  { label: "Marketplace", href: "/marketplace", icon: "🛒" },
  { label: "Profile (JPS)", href: "/profile", icon: "👤" },
  { label: "Verification (PSS)", href: "/verification", icon: "🔐" },
  { label: "Certification (CRB)", href: "/certification", icon: "🏛" },
  { label: "Trust Score (STL)", href: "/dmo/stl", icon: "📊" },
  { label: "Franchise", href: "/franchise", icon: "🏢" },
  { label: "Industries", href: "/industries", icon: "🌐" },
  { label: "Wallet", href: "/wallet", icon: "💰" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export function SuperSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#041326]/90 to-[#020b18]/90 p-3 shadow-[0_20px_50px_rgba(2,8,23,0.55)]">
      <div className="px-2 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="text-[11px] uppercase tracking-[0.18em] ehb-text-muted">EHB Super App</div>
        <div className="text-sm font-semibold text-white mt-1">Unified Systems</div>
        <div className="text-[10px] text-cyan-200/80 mt-1">Mode: Command Center</div>
      </div>

      <nav className="mt-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={[
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                active
                  ? "bg-cyan-500/20 border border-cyan-400/45 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.28)]"
                  : "text-ehb-textBody border border-transparent hover:bg-white/5 hover:border-white/10",
              ].join(" ")}
            >
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

