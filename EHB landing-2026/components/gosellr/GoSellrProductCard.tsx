"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GosellrProduct } from "@/lib/marketplace/gosellrProducts";

export function GoSellrProductCard({
  product,
  locationQs,
}: {
  product: GosellrProduct;
  locationQs?: string;
}) {
  const [trust, setTrust] = useState<{ trustScore: number; badge: { badge: string; level: string } } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/gosellr/trust?productId=${product.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setTrust(json.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  return (
    <div className="rounded-2xl glass-card card-hover border p-5 space-y-3">
      <div
        className="relative h-28 rounded-xl border overflow-hidden"
        style={{
          borderColor: "rgba(0,234,255,0.25)",
          background:
            "radial-gradient(circle at 30% 20%, rgba(0,234,255,0.25), transparent 55%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.20), transparent 55%), linear-gradient(135deg, rgba(2,12,27,0.85), rgba(2,12,27,0.95))",
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

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white line-clamp-2">{product.name}</p>
          <p className="text-[11px] text-ehb-textMuted mt-1">{product.category}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-[2px] text-[10px] text-ehb-textBody">
          {trust ? `${trust.badge.badge} ${trust.badge.level}` : product.badge}
        </span>
      </div>

      <p className="text-[12px] text-ehb-textBody leading-relaxed">{product.short}</p>

      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-white">
          {product.priceUsd === 0 ? "Free" : `$${product.priceUsd}`}
        </span>
        <span className="flex items-center gap-1 text-amber-300">
          <span aria-hidden>⭐</span>
          <span>{product.rating.toFixed(1)}</span>
        </span>
      </div>

      {trust && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[11px] text-cyan-100">
          TrustScore {trust.trustScore}/100
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-ehb-textMuted">{trust ? trust.badge.level : product.tier}</span>
        <Link
          href={`/gosellr/product/${product.id}${locationQs ?? ""}`}
          className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
        >
          View
        </Link>
      </div>
    </div>
  );
}

