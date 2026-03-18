"use client";

import { useState } from "react";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  seller: string;
  price: string;
  rating: number;
  tag?: string;
  badge?: string;
}

interface ProductCardProps {
  title: string;
  price: string;
  rating: number;
  tag?: string;
  badge?: string;
}

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

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-2 py-[2px] text-[10px] font-medium text-emerald-200">
      <span aria-hidden>✔</span>
      <span>Verified</span>
    </span>
  );
}

function ServiceCard({ title, seller, price, rating, tag, badge }: ServiceCardProps) {
  return (
    <div className="rounded-2xl glass-card card-hover border border-white/10 p-4 flex flex-col gap-2 hover:border-[#00eaff]/40 hover:shadow-[0_0_22px_rgba(0,234,255,0.35)] transition-all duration-300">
      {/* Thumbnail – simple visual related to title */}
      <div className="h-24 rounded-xl bg-gradient-to-br from-sky-500/30 via-slate-900 to-violet-600/30 mb-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-1" aria-hidden>
            {getThumbEmoji(title)}
          </div>
          <p className="text-[10px] text-slate-100/80 line-clamp-1">{title}</p>
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
      <p className="text-[11px] text-slate-400">By {seller}</p>
      <div className="flex items-center justify-between text-[11px] mt-1">
        <span className="font-semibold text-slate-100">{price}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </span>
      </div>
      <div className="mt-2">
        <VerifiedBadge />
      </div>
    </div>
  );
}

function ProductCard({ title, price, rating, tag, badge }: ProductCardProps) {
  return (
    <div className="rounded-2xl glass-card card-hover border border-white/10 p-4 flex flex-col gap-2 hover:border-[#22c55e]/40 hover:shadow-[0_0_22px_rgba(34,197,94,0.35)] transition-all duration-300">
      {/* Thumbnail – simple visual related to title */}
      <div className="h-24 rounded-xl bg-gradient-to-br from-emerald-500/25 via-slate-900 to-sky-500/25 mb-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-1" aria-hidden>
            {getThumbEmoji(title)}
          </div>
          <p className="text-[10px] text-slate-100/80 line-clamp-1">{title}</p>
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
        <span className="font-semibold text-slate-100">{price}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </span>
      </div>
      <div className="mt-2">
        <VerifiedBadge />
      </div>
    </div>
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
                ? "bg-gradient-to-r from-[#00eaff] to-[#22c55e] text-slate-950 shadow-[0_0_18px_rgba(34,197,94,0.5)]"
                : "text-slate-300 hover:text-white"
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

  const services: ServiceCardProps[] = [
    { title: "Logo Design", seller: "Creative Studio", price: "$25", rating: 4.8, tag: "Top Rated", badge: "Pro Seller" },
    { title: "Website Development", seller: "Rafi Web Studio", price: "$200", rating: 4.9, tag: "Trending", badge: "🔥 Hot" },
    { title: "SEO Optimization", seller: "Growth Agency", price: "$50", rating: 4.7, tag: "Fast Delivery" },
    { title: "Social Media Management", seller: "Brand Boosters", price: "$80", rating: 4.6, tag: "New" },
  ];

  const products: ProductCardProps[] = [
    { title: "Laptop (GoSellr Store)", price: "$850", rating: 4.9, tag: "Popular", badge: "Top Rated" },
    { title: "Medical Equipment Kit", price: "$320", rating: 4.7, tag: "Health" },
    { title: "Education Bundle: Books + Courses", price: "$99", rating: 4.8, tag: "Education", badge: "Best for beginners" },
    { title: "Delivery Rider Gear Pack", price: "$60", rating: 4.5, tag: "New" },
  ];

  const grid =
    activeTab === "services"
      ? services.map((s) => <ServiceCard key={s.title} {...s} />)
      : products.map((p) => <ProductCard key={p.title} {...p} />);

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Marketplace</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Explore Services &amp; Products</h2>
      <p className="text-slate-400 max-w-2xl mb-2 text-sm md:text-base">
        Hire experts, offer services, or shop verified products — all in one marketplace.
      </p>
      <p className="text-[11px] text-slate-500 mb-8">
        Examples only – tags like Trending, Top Rated, New, and Pro show how discovery will guide users.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <TabsSwitch active={activeTab} onChange={setActiveTab} />
        <div className="hidden sm:flex gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Top Rated</span>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Trending</span>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Fast Delivery</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {grid}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-[11px] text-slate-400 sm:hidden">
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Top Rated</span>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Trending</span>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          <Link
            href="/ai-marketplace"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-6 py-2.5 text-xs md:text-sm font-semibold text-slate-950 btn-glow"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

