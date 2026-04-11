import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/franchise", label: "Home" },
  { href: "/franchise/bookings", label: "Bookings" },
  { href: "/franchise/inspections", label: "Inspections" },
  { href: "/dmo/franchise", label: "DMO Franchise" },
];

export default function FranchiseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F14]/90 backdrop-blur-xl">
        <div className="container-ehb py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Franchise Workspace</p>
              <p className="text-sm text-ehb-textBody">
                Home, booking queue, inspections, and DMO coordination in one workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="ehb-btn-secondary ehb-press">
                  {item.label}
                </Link>
              ))}
              <Link href="/home" className="ehb-btn-primary ehb-press">
                EHB Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
