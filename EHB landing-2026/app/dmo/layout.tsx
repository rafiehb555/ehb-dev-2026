"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dmo/Sidebar";
import { DMO_NAV_SECTIONS } from "@/components/dmo/navigation";

export default function DmoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSectionFromPath = useMemo(() => {
    const current = DMO_NAV_SECTIONS.find(
      (section) => pathname === section.href || pathname.startsWith(`${section.href}/`) || section.items.some((item) => pathname === item.href)
    );
    return current?.key ?? DMO_NAV_SECTIONS[0]?.key ?? null;
  }, [pathname]);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(activeSectionFromPath);

  useEffect(() => {
    setSelectedSectionKey(activeSectionFromPath);
  }, [activeSectionFromPath]);

  const selectedSection =
    DMO_NAV_SECTIONS.find((section) => section.key === selectedSectionKey) ??
    DMO_NAV_SECTIONS.find((section) => section.key === activeSectionFromPath) ??
    DMO_NAV_SECTIONS[0];

  const PRIMARY_MODULE_COUNT = 7;
  const primarySections = useMemo(() => DMO_NAV_SECTIONS.slice(0, PRIMARY_MODULE_COUNT), []);
  const overflowSections = useMemo(() => DMO_NAV_SECTIONS.slice(PRIMARY_MODULE_COUNT), []);
  const [moreModulesOpen, setMoreModulesOpen] = useState(false);

  useEffect(() => {
    setMoreModulesOpen(overflowSections.some((s) => s.key === selectedSection.key));
  }, [selectedSection.key, overflowSections]);

  const moduleChipClass = (isActive: boolean) =>
    [
      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
      isActive
        ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-100 shadow-[0_0_0_1px_rgba(51, 195, 255,0.15)]"
        : "border-white/10 bg-white/5 text-ehb-textBody hover:bg-white/10",
    ].join(" ");

  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 h-screen w-[320px] p-3 hidden lg:block">
        <Sidebar selectedSectionKey={selectedSection.key} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F14]/90 backdrop-blur-xl">
          <div className="container-ehb py-3 space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">DMO Workspace</p>
                <p className="text-sm text-ehb-textBody">
                  Pick a main module — left sidebar shows that module&apos;s items.
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

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ehb-textMuted">Module Switcher</p>
                  <h2 className="mt-1 text-base font-semibold text-white">Main sidebar options</h2>
                  <p className="mt-1 text-sm text-ehb-textBody">
                    <span className="font-medium text-cyan-100">{selectedSection.label}</span> is active. Extra modules live under{" "}
                    <span className="text-white/90">More</span>.
                  </p>
                </div>
                <Link
                  href={selectedSection.href}
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-500/20"
                  onClick={() => setSelectedSectionKey(selectedSection.key)}
                >
                  Open {selectedSection.label}
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {primarySections.map((section) => {
                  const isActive = section.key === selectedSection.key;
                  return (
                    <Link
                      key={section.key}
                      href={section.href}
                      onClick={() => setSelectedSectionKey(section.key)}
                      className={moduleChipClass(isActive)}
                    >
                      <span className="text-sm">{section.icon}</span>
                      <span>{section.label}</span>
                    </Link>
                  );
                })}
                {overflowSections.length > 0 ? (
                  <details
                    className="group relative"
                    open={moreModulesOpen}
                    onToggle={(e) => setMoreModulesOpen((e.target as HTMLDetailsElement).open)}
                  >
                    <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-ehb-textBody marker:content-none [&::-webkit-details-marker]:hidden hover:bg-white/10">
                      <span className="text-sm" aria-hidden>
                        ⋯
                      </span>
                      <span>
                        More{" "}
                        <span className="text-ehb-textMuted">
                          ({overflowSections.length})
                        </span>
                      </span>
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                      {overflowSections.map((section) => {
                        const isActive = section.key === selectedSection.key;
                        return (
                          <Link
                            key={section.key}
                            href={section.href}
                            onClick={() => setSelectedSectionKey(section.key)}
                            className={moduleChipClass(isActive)}
                          >
                            <span className="text-sm">{section.icon}</span>
                            <span>{section.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

