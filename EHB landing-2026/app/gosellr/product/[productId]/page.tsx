import Link from "next/link";
import { notFound } from "next/navigation";
import { getGosellrProductById } from "@/lib/marketplace/gosellrProducts";
import { GoSellrCartActions } from "@/components/gosellr/GoSellrCartActions";
import AIInsightCard from "@/components/AIInsightCard";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

export default function GosellrProductPage({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const product = getGosellrProductById(params.productId);
  if (!product) notFound();

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
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">GoSellr Product</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">{product.name}</h1>
            <p className="text-ehb-textMuted max-w-2xl text-sm">{product.short}</p>

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
              href={`/gosellr${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to list
            </Link>
            <Link
              href={`/cart${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 hover:bg-white/10 transition-all duration-200"
            >
              Open cart
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6">
            <div className="rounded-3xl glass-card border p-5 overflow-hidden">
              <div
                className="h-[280px] rounded-2xl border bg-white/5 flex items-center justify-center overflow-hidden"
                style={{ borderColor: "rgba(0,234,255,0.25)" }}
              >
                <img src={product.image} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-slate-200">
                  Badge: <span className="text-white font-semibold ml-1">{product.badge}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-slate-200">
                  Tier: <span className="text-white font-semibold ml-1">{product.tier}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl glass-panel border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Category</p>
                  <p className="text-sm font-semibold text-white mt-2">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Price</p>
                  <p className="text-xl font-semibold text-white mt-2">
                    {product.priceUsd === 0 ? "Free" : `$${product.priceUsd}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ehb-textMuted">
                <span className="flex items-center gap-2">
                  <span aria-hidden>⭐</span> Rating
                </span>
                <span className="text-white font-semibold">{product.rating.toFixed(1)} / 5.0</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Verified trust</p>
                  <p className="text-sm text-ehb-textBody">
                    PSS verified • CRB certified • STL level trust (demo)
                  </p>
                </div>
              </div>

              <AIInsightCard limit={1} compact />

              <GoSellrCartActions productId={product.id} />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                  Next step after purchase
                </p>
                <p className="text-[12px] text-ehb-textBody leading-relaxed">
                  EHB uses DMO workflow approvals and EHB‑STL secure settlement to keep delivery and records trusted.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

