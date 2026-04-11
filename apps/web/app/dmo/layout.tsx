"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Sidebar from "@/components/dmo/Sidebar";
import { DmoTopSubNav } from "@/components/dmo/DmoTopSubNav";
import { DMO_NAV_SECTIONS, getDmoSectionKeyFromPathname } from "@/components/dmo/navigation";

export default function DmoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const activeSectionKey = useMemo(() => getDmoSectionKeyFromPathname(pathname), [pathname]);

  const selectedSection =
    DMO_NAV_SECTIONS.find((section) => section.key === activeSectionKey) ?? DMO_NAV_SECTIONS[0];

  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 z-30 h-screen w-[min(100%,280px)] shrink-0 overflow-y-auto p-3 hidden sm:block">
        <Sidebar selectedSectionKey={activeSectionKey} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F14]/95 backdrop-blur-xl">
          <div className="container-ehb py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">DMO Workspace</p>
                <p className="text-sm text-ehb-textBody">
                  Main modules: left sidebar. Current module:{" "}
                  <span className="font-medium text-cyan-100/90">{selectedSection.label}</span>.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/dmo" className="ehb-btn-primary ehb-press">
                  DMO Dashboard
                </Link>
                <Link href="/home" className="ehb-btn-secondary ehb-press">
                  EHB Home
                </Link>
                <Link href="/" className="ehb-btn-secondary ehb-press">
                  EHB Landing
                </Link>
                <Link href="/admin" className="ehb-btn-secondary ehb-press">
                  Super Admin Panel
                </Link>
              </div>
            </div>
          </div>
          <DmoTopSubNav section={selectedSection} pathname={pathname} />
        </div>
        {children}
      </div>
    </div>
  );
}
