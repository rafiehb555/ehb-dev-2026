import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getGosellrProductById } from "@/lib/marketplace/gosellrProducts";
import { GoSellrCartActions } from "@/components/gosellr/GoSellrCartActions";
import { GoSellrProductStlLine } from "@/components/gosellr/GoSellrProductStlLine";
import { TrustLevelStrip } from "@/components/gosellr/TrustLevelStrip";
import { StlTrustRingBadge } from "@/components/gosellr/StlTrustRingBadge";
import { PssCrbDmoTrustBars } from "@/components/gosellr/PssCrbDmoTrustBars";
import { GuaranteeStrip } from "@/components/gosellr/GuaranteeStrip";
import { StlMetaStrip } from "@/components/gosellr/StlMetaStrip";
import AIInsightCard from "@/components/AIInsightCard";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

export default function GosellrProductPage({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const raw = decodeURIComponent(params.productId);
  if (raw === "[productId]" || raw.includes("[productId]")) {
    redirect("/gosellr");
  }
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
  const locationAccent = selectedCountry?.accent ?? "#29ABE2";

  const locationQs = (() => {
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  const stlLevel = product.sellerStl ?? 1;
  const stlScore = product.sellerScore ?? 0;

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">GoSellr Product</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">{product.name}</h1>
            <p className="text-ehb-textMuted max-w-2xl text-sm">{product.short}</p>

            {locationLabel ? (
              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-ehb-textBody border border-white/10"
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
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-ehb-textBody hover:bg-white/10 transition-all duration-200"
            >
              Open cart
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-12 items-start">
          {/* Left column — Product image + badge */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl glass-card border overflow-hidden">
              {/* Trust Level Strip at top */}
              <TrustLevelStrip level={stlLevel} score={stlScore} />

              <div className="p-5">
                <div className="relative">
                  <div
                    className="relative h-[280px] rounded-2xl border bg-white/5 overflow-hidden"
                    style={{ borderColor: "rgba(51, 195, 255,0.25)" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Floating STL ring badge */}
                  <div className="absolute -top-3 -right-3">
                    <StlTrustRingBadge level={stlLevel} score={stlScore} size={72} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-ehb-textBody">
                    Badge: <span className="text-white font-semibold ml-1">{product.badge}</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-[2px] text-[11px] text-ehb-textBody">
                    Tier: <span className="text-white font-semibold ml-1">{product.tier}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Details + Trust info */}
          <div className="lg:col-span-6 space-y-4">
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

              {/* Guarantee Strip — full size */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ehb-textMuted mb-1.5">
                  Buyer Protection
                </p>
                <GuaranteeStrip
                  moneyBackDays={product.moneyBackDays ?? null}
                  replacementDays={product.replacementDays ?? null}
                />
              </div>

              {/* PSS / CRB / DMO Trust Bars — full size */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ehb-textMuted mb-1.5">
                  Seller Trust Dimensions
                </p>
                <PssCrbDmoTrustBars
                  pss={product.sellerPss ?? null}
                  crb={product.sellerCrb ?? null}
                  dmo={product.sellerDmo ?? null}
                />
              </div>

              <GoSellrProductStlLine productId={product.id} />

              <div className="flex items-center justify-between text-[11px] text-ehb-textMuted">
                <span className="flex items-center gap-2">
                  <span aria-hidden>⭐</span> Rating
                </span>
                <span className="text-white font-semibold">{product.rating.toFixed(1)} / 5.0</span>
              </div>

              {/* Meta Strip — full size */}
              <StlMetaStrip
                ruleNumber={product.sellerRule}
                rating={product.rating}
                refillingCount={product.sellerRefills}
                examInfo={product.sellerExam}
              />

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
