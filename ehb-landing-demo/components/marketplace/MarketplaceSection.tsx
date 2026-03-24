"use client";

import { useState } from "react";
import Link from "next/link";
import { INDUSTRY_SERVICES } from "@/lib/industryServices";
import { GOSELLR_PRODUCTS } from "@/lib/gosellrProducts";
import { GoSellrProductCard } from "@/components/gosellr/GoSellrProductCard";

/** Flatten first N industries for Services tab – industry, category, service. */
function getSampleServices(maxCards = 12): { industrySlug: string; categoryName: string; serviceName: string; accentColor: string }[] {
  const out: { industrySlug: string; categoryName: string; serviceName: string; accentColor: string }[] = [];
  for (const ind of INDUSTRY_SERVICES) {
    for (const cat of ind.categories) {
      for (const svc of cat.services) {
        if (out.length >= maxCards) return out;
        out.push({
          industrySlug: ind.industrySlug,
          categoryName: cat.name,
          serviceName: svc.name,
          accentColor: ind.accentColor,
        });
      }
    }
  }
  return out;
}

export function MarketplaceSection({ locationQs = "" }: { locationQs?: string }) {
  const [activeTab, setActiveTab] = useState<"services" | "products">("services");
  const sampleServices = getSampleServices(12);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xs font-semibold text-slate-100">Marketplace</h2>
        <div className="inline-flex rounded-full glass-panel border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`min-h-touch rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
              activeTab === "services"
                ? "bg-gradient-to-r from-[#00eaff]/30 to-[#3b82f6]/30 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`min-h-touch rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
              activeTab === "products"
                ? "bg-gradient-to-r from-[#00eaff]/30 to-[#3b82f6]/30 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Products
          </button>
        </div>
        <Link
          href={`/ai-marketplace${locationQs}`}
          className="text-[10px] text-slate-400 hover:text-[#00eaff] transition-colors"
        >
          AI Marketplace →
        </Link>
        <Link
          href={`/gosellr${locationQs}`}
          className="text-[10px] text-slate-400 hover:text-[#00eaff] transition-colors"
        >
          GoSellr →
        </Link>
      </div>

      {activeTab === "services" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sampleServices.map((s, i) => (
            <Link
              key={`${s.industrySlug}-${s.categoryName}-${s.serviceName}-${i}`}
              href={`/industry/${s.industrySlug}${locationQs}`}
              className="glass-card card-hover rounded-2xl border px-3 py-3 flex flex-col min-h-[88px]"
              style={{
                borderColor: `${s.accentColor}35`,
                boxShadow: `0 0 20px ${s.accentColor}15`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-white line-clamp-1">{s.serviceName}</span>
                <span aria-hidden className="text-[12px] opacity-70">↗</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {s.categoryName} · {s.industrySlug}
              </p>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "products" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOSELLR_PRODUCTS.map((p) => (
            <GoSellrProductCard key={p.id} product={p} locationQs={locationQs} />
          ))}
        </div>
      )}
    </section>
  );
}
