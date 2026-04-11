"use client";

import { useState } from "react";
import Link from "next/link";
import {
  homepageContent,
  type MarketplaceProductItem,
  type MarketplaceServiceItem,
} from "@/lib/content/homepage";

type ServiceCardProps = MarketplaceServiceItem;

type ProductCardProps = MarketplaceProductItem;

function getThumbEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("logo") || t.includes("design")) return "🎨";
  if (t.includes("website") || t.includes("web")) return "💻";
  if (t.includes("seo")) return "📈";
  if (t.includes("social")) return "📱";
  if (t.includes("laptop")) return "💻";
  if (t.includes("medical")) return "🏥";
  if (t.includes("education") || t.includes("course") || t.includes("books")) return "📚";
  if (t.includes("delivery") || t.includes("rider")) return "🚚";
  return "✨";
}

function getIndustryAccent(title: string): { color: string; label: string } {
  const t = title.toLowerCase();
  if (t.includes("medical") || t.includes("health") || t.includes("doctor")) return { color: "#29ABE2", label: "Health" };
  if (t.includes("education") || t.includes("course") || t.includes("books") || t.includes("tutor")) return { color: "#E53935", label: "Education" };
  if (t.includes("website") || t.includes("web") || t.includes("seo") || t.includes("software") || t.includes("app")) return { color: "#3B82F6", label: "IT" };
  if (t.includes("delivery") || t.includes("rider") || t.includes("logistics")) return { color: "#FB923C", label: "Delivery" };
  if (t.includes("laptop") || t.includes("store") || t.includes("product")) return { color: "#F59E0B", label: "E‑commerce" };
  return { color: "#22B14C", label: "Business" };
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2 py-[2px] text-[10px] font-medium text-emerald-200">
      <span aria-hidden>✔</span>
      <span>Verified</span>
    </span>
  );
}

type TrustBadgesCompactProps = { deptHint?: string };

function TrustBadgesCompact({ deptHint }: TrustBadgesCompactProps) {
  const hint = (deptHint ?? "").toLowerCase();

  const chips = [
    {
      key: "pss",
      icon: "🛡️",
      label: "PSS Verified",
      accent: "rgba(34, 177, 76,0.55)",
      keywords: ["pss"],
    },
    {
      key: "crb",
      icon: "🏛️",
      label: "CRB Certified",
      accent: "rgba(59,130,246,0.55)",
      keywords: ["crb"],
    },
    {
      key: "stl",
      icon: "⭐",
      label: "STL Level",
      accent: "rgba(245,158,11,0.55)",
      keywords: ["stl"],
    },
    {
      key: "dmo",
      icon: "🌐",
      label: "DMO Registered",
      accent: "rgba(139,92,246,0.55)",
      keywords: ["dmo"],
    },
    {
      key: "franchise",
      icon: "🏢",
      label: "Franchise Verified",
      accent: "rgba(249,115,22,0.55)",
      keywords: ["franchise"],
    },
    {
      key: "refilling",
      icon: "🔁",
      label: "Refilling Count",
      accent: "rgba(148,163,184,0.55)",
      keywords: ["refilling", "renewals"],
    },
    {
      key: "complaints",
      icon: "⚠️",
      label: "Complaints",
      accent: "rgba(239,68,68,0.55)",
      keywords: ["complaints", "complaint"],
    },
  ];

  const matched = chips.filter((c) => c.keywords.some((k) => hint.includes(k)));
  const finalChips = hint.trim().length === 0 ? chips : matched.length ? matched : chips.filter((c) => c.key === "pss");

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {finalChips.map((c) => (
        <span
          key={c.label}
          className="inline-flex items-center gap-1 rounded-full border px-2 py-[1px] text-[9px] font-medium text-ehb-textBody bg-white/5"
          style={{
            borderColor: c.accent,
            boxShadow: `0 0 18px ${c.accent}`,
          }}
        >
          <span aria-hidden>{c.icon}</span>
          <span>{c.label}</span>
        </span>
      ))}
    </div>
  );
}

function ServiceCard({ title, seller, price, rating, tag, badge, deptHint }: ServiceCardProps) {
  const accent = getIndustryAccent(title);
  return (
    <Link
      href="/services"
      className="block rounded-2xl glass-card card-hover border p-4 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
      style={{
        borderColor: `${accent.color}2a`,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Thumbnail – simple visual related to title */}
      <div
        className="h-24 rounded-xl mb-2 flex items-center justify-center border"
        style={{
          borderColor: `${accent.color}30`,
          background: `radial-gradient(circle at 30% 20%, ${accent.color}40, transparent 55%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.22), transparent 55%), linear-gradient(135deg, rgba(2,12,27,0.85), rgba(2,12,27,0.95))`,
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1" aria-hidden>
            {getThumbEmoji(title)}
          </div>
          <p className="text-[10px] text-white/80 line-clamp-1">{title}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white line-clamp-2">{title}</p>
        <div className="flex flex-col items-end gap-1">
          {tag && (
            <span className="rounded-full bg-amber-500/15 border border-amber-400/40 px-2 py-[2px] text-[10px] font-medium text-amber-200">
              {tag}
            </span>
          )}
          {badge && (
            <span className="rounded-full bg-sky-500/15 border border-sky-400/40 px-2 py-[1px] text-[9px] font-medium text-sky-200">
              {badge}
            </span>
          )}
        </div>
      </div>
      <p className="text-[11px] text-ehb-textMuted">By {seller}</p>
      <div className="flex items-center justify-between text-[11px] mt-1">
        <span className="font-semibold text-white">{price}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        <VerifiedBadge />
        <span
          className="text-[10px] rounded-full px-2 py-[2px] border"
          style={{
            borderColor: `${accent.color}35`,
            backgroundColor: `${accent.color}12`,
            color: "rgba(226,232,240,0.85)",
          }}
        >
          {accent.label}
        </span>
      </div>
      <TrustBadgesCompact deptHint={deptHint} />
      <div className="mt-2">
        <p className="text-[10px] text-ehb-textMuted">
          {deptHint ?? "PSS + EHB‑STL protected"}
        </p>
      </div>
      <p className="text-[10px] font-medium text-cyan-400/80 mt-1">Browse services →</p>
    </Link>
  );
}

function ProductCard({ title, price, rating, tag, badge, deptHint }: ProductCardProps) {
  const accent = getIndustryAccent(title);
  return (
    <Link
      href="/gosellr"
      className="block rounded-2xl glass-card card-hover border p-4 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
      style={{
        borderColor: `${accent.color}2a`,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Thumbnail – simple visual related to title */}
      <div
        className="h-24 rounded-xl mb-2 flex items-center justify-center border"
        style={{
          borderColor: `${accent.color}30`,
          background: `radial-gradient(circle at 30% 20%, ${accent.color}40, transparent 55%), radial-gradient(circle at 80% 90%, rgba(34, 177, 76,0.18), transparent 55%), linear-gradient(135deg, rgba(2,12,27,0.85), rgba(2,12,27,0.95))`,
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1" aria-hidden>
            {getThumbEmoji(title)}
          </div>
          <p className="text-[10px] text-white/80 line-clamp-1">{title}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white line-clamp-2">{title}</p>
        <div className="flex flex-col items-end gap-1">
          {tag && (
            <span className="rounded-full bg-sky-500/15 border border-sky-400/40 px-2 py-[2px] text-[10px] font-medium text-sky-200">
              {tag}
            </span>
          )}
          {badge && (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2 py-[1px] text-[9px] font-medium text-emerald-200">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] mt-1">
        <span className="font-semibold text-white">{price}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        <VerifiedBadge />
        <span
          className="text-[10px] rounded-full px-2 py-[2px] border"
          style={{
            borderColor: `${accent.color}35`,
            backgroundColor: `${accent.color}12`,
            color: "rgba(226,232,240,0.85)",
          }}
        >
          {accent.label}
        </span>
      </div>
      <TrustBadgesCompact deptHint={deptHint} />
      <div className="mt-2">
        <p className="text-[10px] text-ehb-textMuted">
          {deptHint ?? "PSS + EHB‑STL protected"}
        </p>
      </div>
      <p className="text-[10px] font-medium text-cyan-400/80 mt-1">Open GoSellr →</p>
    </Link>
  );
}

function TabsSwitch({ active, onChange }: { active: "services" | "products"; onChange: (v: "services" | "products") => void }) {
  return (
    <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1 text-xs sm:text-sm mb-6">
      {[
        { key: "services", label: "Services" },
        { key: "products", label: "Products" },
      ].map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key as "services" | "products")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-[#33C3FF] to-[#22b14c] text-slate-950 shadow-[0_0_18px_rgba(34, 177, 76,0.5)]"
                : "text-ehb-textBody hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function MarketplaceSection() {
  const [activeTab, setActiveTab] = useState<"services" | "products">("services");
  const { filterChips, products, services } = homepageContent.marketplace;

  const grid =
    activeTab === "services"
      ? services.map((s) => <ServiceCard key={s.title} {...s} />)
      : products.map((p) => <ProductCard key={p.title} {...p} />);

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Marketplace</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Explore Services &amp; Products</h2>
      <p className="text-ehb-textMuted max-w-2xl mb-2 text-sm md:text-base">
        Hire experts, offer services, or shop verified products — all in one marketplace.
      </p>
      <p className="text-[11px] text-ehb-textMuted mb-8">
        Examples only – tags like Trending, Top Rated, New, and Pro show how discovery will guide users.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <TabsSwitch active={activeTab} onChange={setActiveTab} />
        <div className="hidden sm:flex gap-2 text-[11px] text-ehb-textMuted">
          {filterChips.map((chip) => (
            <span key={chip} className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {grid}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-[11px] text-ehb-textMuted sm:hidden">
          {filterChips.slice(0, 2).map((chip) => (
            <span key={chip} className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {chip}
            </span>
          ))}
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          <Link
            href="/ai-marketplace"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-6 py-2.5 text-xs md:text-sm font-semibold text-slate-950 btn-glow"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

