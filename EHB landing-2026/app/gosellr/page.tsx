import Link from "next/link";
import { GOSELLR_PRODUCTS } from "@/lib/marketplace/gosellrProducts";
import { GoSellrProductCard } from "@/components/gosellr/GoSellrProductCard";
import { SellerOnboardingCta } from "@/components/gosellr/SellerOnboardingCta";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

export default function GoSellrListPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const countryCode = searchParams?.country?.trim() || "";
  const stateCode = searchParams?.state?.trim() || "";
  const cityCode = searchParams?.city?.trim() || "";

  const selectedCountry = countryCode ? getCountryByCode(countryCode) : undefined;
  const selectedState = countryCode && stateCode ? getStateByCode(countryCode, stateCode) : undefined;
  const selectedCity =
    countryCode && stateCode && cityCode ? getCityByCode(countryCode, stateCode, cityCode) : undefined;

  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";
  const locationAccent = selectedCountry?.accent ?? "#00AEEF";

  const locationQs = (() => {
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">GoSellr</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              GoSellr Marketplace (Products)
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm">
              Verified product listings powered by the EHB trust stack (demo data).
            </p>

            {locationLabel ? (
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-slate-200 border border-white/10"
                style={{
                  borderColor: `${locationAccent}55`,
                  boxShadow: `0 0 28px ${locationAccent}22`,
                }}
              >
                <span aria-hidden>📍</span>
                <span>
                  Near you: <span className="text-white font-semibold">{locationLabel}</span>
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/cart${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              Open cart
            </Link>
            <Link
              href={`/orders${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 hover:bg-white/10 transition-all duration-200"
            >
              Orders
            </Link>
          </div>
        </header>

        <SellerOnboardingCta />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOSELLR_PRODUCTS.map((p) => (
            <GoSellrProductCard key={p.id} product={p} locationQs={locationQs} />
          ))}
        </section>
      </div>
    </main>
  );
}

