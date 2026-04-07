"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, ShoppingBag, User, Wallet } from "lucide-react";

const items = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/gosellr", label: "Shop", Icon: ShoppingBag },
  { href: "/jobs", label: "Jobs", Icon: Briefcase },
  { href: "/wallet", label: "Wallet", Icon: Wallet },
  { href: "/dashboard", label: "Me", Icon: User }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-white/[0.08] bg-[#0d1017]/95 backdrop-blur-xl pb-safe-b"
      aria-label="Primary mobile"
    >
      <ul className="flex items-stretch justify-around max-w-lg mx-auto">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href} className="flex-1 min-w-0">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-[#29ABE2]"
                    : "text-ehb-textMuted hover:text-ehb-textBody"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#29ABE2]" : ""}`} aria-hidden />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
