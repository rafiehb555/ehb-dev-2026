"use client";

/**
 * DMO Mobile Navigation — Phase 1 Foundation Layout (2026-04-19).
 *
 * Bottom navigation bar for mobile devices. Shows 5 primary tabs:
 *   - Dashboard
 *   - PSS (Personal Security System)
 *   - STL (Service Trust Level)
 *   - Wallet
 *   - More (menu)
 *
 * Only visible on mobile (hidden lg+). Active tab has purple indicator.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MobileNavTab = {
  key: string;
  label: string;
  icon: string;
  href: string;
};

const MOBILE_NAV_TABS: MobileNavTab[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    href: "/dmo",
  },
  {
    key: "pss",
    label: "PSS",
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    href: "/dmo/pss",
  },
  {
    key: "stl",
    label: "STL",
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    href: "/dmo/stl",
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    href: "/dmo/wallet-control",
  },
  {
    key: "more",
    label: "More",
    icon: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    href: "#",
  },
];

type DmoMobileNavProps = {
  onMoreClick?: () => void;
};

export function DmoMobileNav({ onMoreClick }: DmoMobileNavProps) {
  const pathname = usePathname() ?? "";
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const getActiveTab = (): string => {
    if (pathname.startsWith("/dmo/pss")) return "pss";
    if (pathname.startsWith("/dmo/stl")) return "stl";
    if (pathname.startsWith("/dmo/wallet")) return "wallet";
    return "dashboard";
  };

  const activeTab = getActiveTab();
  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
    onMoreClick?.();
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden border-t border-white/8 bg-[#13162A]/95 backdrop-blur-xl">
        {MOBILE_NAV_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "more" ? "#" : tab.href}
            onClick={(e) => {
              if (tab.key === "more") {
                e.preventDefault();
                handleMoreClick();
              }
            }}
            className={[
              "flex-1 flex flex-col items-center justify-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all relative",
              activeTab === tab.key && tab.key !== "more"
                ? "text-[#7B6EF6]"
                : "text-white/60 hover:text-white",
            ].join(" ")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: tab.icon }}
            />
            <span>{tab.label}</span>
            {activeTab === tab.key && tab.key !== "more" && (
              <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#7B6EF6] to-[#A098F8]" />
            )}
          </Link>
        ))}
      </nav>

      {/* More Menu (dropdown) */}
      {showMoreMenu && (
        <div className="fixed bottom-20 right-4 z-50 lg:hidden rounded-lg border border-white/10 bg-[#13162A]/95 shadow-2xl backdrop-blur-xl w-48">
          <div className="space-y-1 p-2">
            <Link
              href="/dmo/applications"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              Applications
            </Link>
            <Link
              href="/dmo/approvals"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              Approvals
            </Link>
            <Link
              href="/dmo/complaints"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              Complaints
            </Link>
            <Link
              href="/dmo/ai-assistant"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              AI Assistant
            </Link>
            <Link
              href="/dmo/analytics"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              Analytics
            </Link>
            <Link
              href="/dmo/settings"
              className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={() => setShowMoreMenu(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* Spacer for bottom nav on mobile */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
