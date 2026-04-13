"use client";

import Link from "next/link";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";
import { DmoFranchiseDashboard } from "@/components/dmo/DmoFranchiseDashboard";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

export default function SubFranchisePage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string; industry?: string };
}) {
  const countryCode = searchParams?.country?.trim() || "";
  const stateCode = searchParams?.state?.trim() || "";
  const cityCode = searchParams?.city?.trim() || "";
  const industry = searchParams?.industry?.trim() || "it";

  const selectedCountry = countryCode ? getCountryByCode(countryCode) : undefined;
  const selectedState = countryCode && stateCode ? getStateByCode(countryCode, stateCode) : undefined;
  const selectedCity =
    countryCode && stateCode && cityCode ? getCityByCode(countryCode, stateCode, cityCode) : undefined;

  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";

  const locationQs = (() => {
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">DMO · Sub Franchise</p>
          <h1 className="text-lg sm:text-xl font-semibold leading-tight text-white">Local onboarding & trust</h1>
          <p className="text-white/70 max-w-2xl">Handle local onboarding, trust checks, and task execution for the selected franchise context.</p>
        </header>

        <DmoTopNav />

        <DmoFranchiseDashboard level="Sub" locationLabel={locationLabel} initialIndustrySlug={industry} locationQs={locationQs} />

        <div className="pt-2 flex flex-wrap gap-2">
          <Link
            href="/dmo/applications"
            className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/70 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all"
          >
            Open queue without filters
          </Link>
        </div>
      </div>
    </main>
  );
}

