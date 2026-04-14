"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GosellrProduct } from "@/lib/marketplace/gosellrProducts";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";
import { TrustLevelStrip } from "./TrustLevelStrip";
import { StlTrustRingBadge } from "./StlTrustRingBadge";
import { PssCrbDmoTrustBars } from "./PssCrbDmoTrustBars";
import { GuaranteeStrip } from "./GuaranteeStrip";
import { StlMetaStrip } from "./StlMetaStrip";

type TrustPayload = {
  trustScore: number;
  badge: { badge: string; level: string };
  stl: { score: number; level: number; label: string; source: "db" | "synthetic" };
};

export function GoSellrProductCard({
  product,
  locationQs,
}: {
  product: GosellrProduct;
  locationQs?: string;
}) {
  const [trust, setTrust] = useState<TrustPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gosellr/trust?productId=${encodeURIComponent(product.id)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setTrust(json.data as TrustPayload);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  // Use API trust data if available, otherwise fall back to product static data
  const stlLevel = trust?.stl?.level ?? product.sellerStl ?? 1;
  const stlScore = trust?.stl?.score ?? product.sellerScore ?? 0;

  return (
    <div className="rounded-2xl glass-card card-hover border overflow-hidden">
      {/* Trust Level Strip — top of card */}
      <TrustLevelStrip level={stlLevel} score={stlScore} />

      <div className="p-4 space-y-3">
        {/* Product Image + Ring Badge overlay */}
        <div className="relative">
          <div
            className="relative h-28 rounded-xl border overflow-hidden"
            style={{
              borderColor: "rgba(51, 195, 255,0.25)",
              background:
                "radial-gradient(circle at 30% 20%, rgba(51, 195, 255,0.25), transparent 55%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.20), transparent 55%), linear-gradient(135deg, rgba(2,12,27,0.85), rgba(2,12,27,0.95))",
            }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>

          {/* Floating ring badge — top right */}
          <div className="absolute -top-2 -right-2">
            <StlTrustRingBadge level={stlLevel} score={stlScore} size={56} />
          </div>
        </div>

        {/* Name + Category */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white line-clamp-2">{product.name}</p>
            <p className="text-[11px] text-ehb-textMuted mt-0.5">{product.category}</p>
          </div>
        </div>

        {/* Guarantee Strip */}
        <GuaranteeStrip
          moneyBackDays={product.moneyBackDays ?? null}
          replacementDays={product.replacementDays ?? null}
          compact
        />

        {/* PSS / CRB / DMO Trust Bars */}
        <PssCrbDmoTrustBars
          pss={product.sellerPss ?? null}
          crb={product.sellerCrb ?? null}
          dmo={product.sellerDmo ?? null}
          compact
        />

        {/* Price + Rating row */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-white">
            {product.priceUsd === 0 ? "Free" : `$${product.priceUsd}`}
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span aria-hidden>⭐</span>
            <span>{product.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Seller STL chip */}
        {(trust?.stl || product.sellerStl) ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-ehb-textMuted">Seller · EHB-STL-LEVEL</span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${stlLevelChipClasses(stlLevel)}`}
            >
              L{stlLevel} · {stlScore.toFixed(0)}
            </span>
          </div>
        ) : null}

        {/* Meta Strip */}
        <StlMetaStrip
          ruleNumber={product.sellerRule}
          rating={product.rating}
          refillingCount={product.sellerRefills}
          examInfo={product.sellerExam}
          compact
        />

        {/* Action row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[10px] text-ehb-textMuted">
            {trust ? trust.badge.level : product.tier}
          </span>
          <Link
            href={`/gosellr/product/${product.id}${locationQs ?? ""}`}
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#22b14c] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
