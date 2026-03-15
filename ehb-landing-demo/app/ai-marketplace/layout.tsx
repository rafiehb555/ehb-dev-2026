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
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00eaff] to-[#3b82f6] flex items-center justify-center text-sm font-bold shadow-neon-electric">
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
                  ? "bg-[#00eaff]/20 text-[#00eaff] border border-[#00eaff]/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Trusty Wallet</p>
          <p className="text-sm font-semibold text-[#00eaff]">850.0 EHBGC</p>
          <div className="h-8 w-full rounded-lg bg-[#020617] border border-[#00eaff]/20" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="nav-glass h-14 shrink-0 flex items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-slate-400" aria-label="Menu">☰</button>
            <span className="text-sm font-medium text-slate-300">AI Marketplace</span>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <div className="flex items-center gap-2 rounded-xl glass-panel px-4 py-2.5 text-sm text-slate-400">
              <span>🔍</span>
              <span>Search apps, games, education, franchises...</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#00eaff]">850.00 EHBGC</span>
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
            <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-slate-400" aria-label="Close">✕</button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
