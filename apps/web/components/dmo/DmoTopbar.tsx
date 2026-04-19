"use client";

/**
 * DMO Topbar — Phase 1 Foundation Layout (2026-04-19).
 *
 * Features:
 *   - Breadcrumb: EHB > DMO > Group > Module
 *   - Global search bar
 *   - Quick actions: notifications bell + user menu
 *   - Mobile: hamburger menu button
 *   - Sticky top with glass background + blur
 */

import Link from "next/link";
import { useState } from "react";
import type { DmoNavGroup, DmoNavSection } from "./navigation";

type DmoTopbarProps = {
  group: DmoNavGroup | null;
  section: DmoNavSection | null;
  notificationCount?: number;
  onMobileMenuToggle?: () => void;
};

export function DmoTopbar({
  group,
  section,
  notificationCount = 0,
  onMobileMenuToggle,
}: DmoTopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/45"
        >
          <Link href="/" className="text-[#7B6EF6] hover:text-[#A098F8] transition-colors">
            EHB
          </Link>
          <span aria-hidden>·</span>
          <Link href="/dmo" className="text-white/55 hover:text-white/75 transition-colors">
            DMO
          </Link>
          {group ? (
            <>
              <span aria-hidden>·</span>
              <span className={group.tint}>{group.label}</span>
            </>
          ) : null}
          {section ? (
            <>
              <span aria-hidden>·</span>
              <span className="text-white">{section.label}</span>
            </>
          ) : null}
        </nav>

        <div className="mt-2 flex items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-white">
            {section?.label ?? "DMO Workspace"}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38C878]/35 bg-[#38C878]/10 px-2 py-0.5 text-[10px] font-semibold text-[#38C878]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38C878] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#38C878]" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 focus-within:border-[#7B6EF6]/50 focus-within:bg-[#7B6EF6]/10 transition-all">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search modules, cases..."
            className="w-32 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
          />
        </div>

        <button
          className="relative rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          aria-label="Notifications"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#F05858] bg-[#F05858]/20 text-[10px] font-bold text-[#F05858]">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <div className="h-6 w-6 overflow-hidden rounded-md bg-gradient-to-br from-[#7B6EF6] to-[#2BBFA0]">
              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
                R
              </div>
            </div>
            <span className="hidden sm:inline">Rafi</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-white/10 bg-[#13162A]/95 shadow-2xl backdrop-blur-xl">
              <div className="space-y-1 p-2">
                <Link
                  href="/dmo/settings/users"
                  className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/dmo/settings/roles"
                  className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  Roles & Permissions
                </Link>
                <Link
                  href="/dmo/settings"
                  className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  System Settings
                </Link>
                <div className="border-t border-white/8 my-2" />
                <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/75 hover:bg-white/[0.08] hover:text-white transition-all">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
