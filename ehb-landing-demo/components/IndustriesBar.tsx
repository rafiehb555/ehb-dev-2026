"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INDUSTRIES } from "@/lib/industries";

export function IndustriesBar() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/5 bg-[#020c1b]/80 backdrop-blur-sm sticky top-[57px] z-40">
      <div className="container-ehb">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide min-h-[44px]" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <Link
            href="/"
            className={`shrink-0 min-h-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
              pathname === "/"
                ? "bg-[#00eaff]/20 text-[#00eaff] border border-[#00eaff]/40 shadow-neon-blue"
                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            EHB Home
          </Link>
          {INDUSTRIES.map((ind) => {
            const landingPath = `/landing/${ind.slug}`;
            const industryHomePath = `/industry/${ind.slug}`;
            const isLanding = pathname === landingPath;
            const isIndustryHome = pathname === industryHomePath;
            const isActive = isLanding || isIndustryHome;
            return (
              <Link
                key={ind.slug}
                href={landingPath}
                className={`shrink-0 min-h-touch inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#00eaff]/20 text-[#00eaff] border border-[#00eaff]/40 shadow-neon-blue"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {ind.shortName}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
