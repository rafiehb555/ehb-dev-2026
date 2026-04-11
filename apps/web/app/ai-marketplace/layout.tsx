import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { label: "AI Marketplace", href: "/ai-marketplace", icon: "⌂", active: true },
  { label: "Home", href: "/home", icon: "◉" },
  { label: "AI Tools", href: "/ai-marketplace#tools", icon: "◇" },
  { label: "Products", href: "/ai-marketplace#products", icon: "▣" },
  { label: "Sellers", href: "/ai-marketplace#sellers", icon: "◎" },
  { label: "Orders", href: "/dashboard", icon: "▤" },
  { label: "Franchise", href: "/franchise", icon: "⬡" },
  { label: "Trusty Wallet", href: "/dashboard", icon: "◈" },
  { label: "Verification (STL)", href: "/admin", icon: "▥" },
  { label: "Analytics", href: "/admin", icon: "▦" },
  { label: "Settings", href: "/dashboard", icon: "⚙" },
];

export default function AIMarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex text-white">
      <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col bg-[#020c1b]/90 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#33C3FF] to-[#3b82f6] flex items-center justify-center text-sm font-bold shadow-neon-electric">
              EHB
            </div>
            <span className="font-semibold text-sm">EHB</span>
          </Link>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-[#33C3FF]/20 text-[#33C3FF] border border-[#33C3FF]/30"
                  : "text-ehb-textMuted hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
