import Link from "next/link";
import { DmoTopNav } from "@/components/dmo/DmoTopNav";
import { DmoFranchiseDashboard } from "@/components/dmo/DmoFranchiseDashboard";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

export default function CorporateFranchisePage({
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
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">DMO · Corporate Franchise</p>
          <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Corporate batch control</h1>
          <p className="text-ehb-textBody max-w-2xl">Track corporate-level franchise batches, operational load, and review focus by industry and region.</p>
        </header>

        <DmoTopNav />

        <DmoFranchiseDashboard level="Corporate" locationLabel={locationLabel} initialIndustrySlug={industry} locationQs={locationQs} />

        <div className="pt-2 flex flex-wrap gap-2">
          <Link
            href="/dmo/applications"
            className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 text-[11px] font-semibold text-ehb-textBody border border-white/10 hover:bg-white/5 transition-all"
          >
            Open queue without filters
          </Link>
        </div>
      </div>
    </main>
  );
}

