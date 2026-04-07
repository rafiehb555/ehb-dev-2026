"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";

type Item = {
  kind: "SERVICE_PROVIDER" | "PRODUCT";
  id: string;
  name: string;
  category: string | null;
  subtitle: string;
  industry: { id: string; name: string; slug: string } | null;
  stlScore: number;
  stlLevel: number;
  rating: number | null;
  availability: boolean;
  location: string | null;
  distanceKm: number | null;
  industryBadges: Array<{ id: string; name: string; slug: string }>;
  rankScore: number;
};

type Industry = { id: string; name: string; slug: string };

function MarketplaceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
        <div className="w-12 space-y-2">
          <div className="h-3 w-10 rounded bg-white/10" />
          <div className="h-6 w-12 rounded bg-white/10" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-24 rounded-full bg-white/10" />
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/10" />
      </div>
      <div className="h-8 rounded bg-white/10" />
      <div className="h-8 w-36 rounded bg-white/10" />
    </div>
  );
}

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"ALL" | "SERVICES" | "PRODUCTS">("ALL");
  const [industry, setIndustry] = useState("");
  const [minStlLevel, setMinStlLevel] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [toast, setToast] = useState<{ open: boolean; kind: "ok" | "err"; text: string }>({ open: false, kind: "ok", text: "" });
  const [demoFallback, setDemoFallback] = useState(false);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    p.set("type", type);
    if (industry) p.set("industry", industry);
    if (minStlLevel > 0) p.set("minStlLevel", String(minStlLevel));
    if (minRating > 0) p.set("minRating", String(minRating));
    p.set("take", "30");
    p.set("skip", "0");
    return p.toString();
  }, [query, type, industry, minStlLevel, minRating]);

  async function loadIndustries() {
    const res = await fetch("/api/industries?take=200&skip=0", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || json?.success === false) return;
    setIndustries((json?.data?.items ?? []) as Industry[]);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query.trim().length > 0 ? "/api/marketplace/search" : "/api/marketplace/list";
      const res = await fetch(`${endpoint}?${qs}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Marketplace load failed");
      setItems((json?.data?.items ?? []) as Item[]);
      setSuggestions((json?.data?.suggestions ?? []) as string[]);
      setDemoFallback(Boolean(json?.data?.demoFallback));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Marketplace load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIndustries();
    void load();
    // Intentional mount bootstrap; filters apply when user clicks Search (load uses latest `qs` from closure on click).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function placeOrder(item: Item) {
    try {
      const res = await fetch("/api/marketplace/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: item.kind,
          itemId: item.id,
          quantity: 1,
          notes: "Marketplace quick order",
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Order failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: `Order created: ${json?.data?.orderId ?? "success"}` });
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Order failed" });
    }
  }

  async function submitReview(item: Item) {
    try {
      const res = await fetch("/api/marketplace/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: item.kind,
          itemId: item.id,
          rating: Number(reviewRating),
          comment: reviewComment.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Review failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: "Review submitted and trust updated." });
      setReviewComment("");
      await load();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Review failed" });
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-[#0a1628] via-[#0d1017] to-[#051a24] p-6 md:p-8 shadow-[0_0_60px_-12px_rgba(51,195,255,0.2)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(34,197,94,0.08),transparent_50%)]" aria-hidden />
          <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">AI Marketplace</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-semibold gradient-text">Trust-based Smart Marketplace</h1>
              <p className="mt-2 text-sm text-ehb-textBody max-w-2xl leading-relaxed">
                Ranking blends EHB-STL-LEVEL with industry badges, reviews, distance, and availability — order &amp; review
                flows work end-to-end in demo mode.
              </p>
            </div>
            <Link
              href="/local-demo"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-cyan-100 hover:bg-white/10 transition-colors"
            >
              Local demo guide
            </Link>
          </div>
        </section>

        {demoFallback ? (
          <div
            role="status"
            className="flex flex-wrap items-start gap-3 rounded-2xl border border-amber-400/35 bg-gradient-to-r from-amber-500/15 to-transparent px-4 py-3 text-sm text-amber-50/95"
          >
            <span className="shrink-0 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
              Demo data
            </span>
            <p className="min-w-0 flex-1 text-amber-100/90 leading-relaxed">
              No rows in your database — showing sample listings. Connect MongoDB + seed for production-like data.
            </p>
          </div>
        ) : null}

        <section className="ehb-card-elevated space-y-3 rounded-2xl border border-white/10">
          {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{error}</div> : null}
          <div className="grid gap-2 lg:grid-cols-12">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search providers/products..." className="lg:col-span-4 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs" />
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="lg:col-span-2 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs">
              <option value="ALL">All</option>
              <option value="SERVICES">Services</option>
              <option value="PRODUCTS">Products</option>
            </select>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="lg:col-span-2 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs">
              <option value="">Any Industry</option>
              {industries.map((i) => <option key={i.id} value={i.slug}>{i.name}</option>)}
            </select>
            <select value={String(minStlLevel)} onChange={(e) => setMinStlLevel(Number(e.target.value))} className="lg:col-span-2 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs">
              <option value="0">Any EHB-STL</option>
              <option value="2">L2+</option>
              <option value="3">L3+</option>
              <option value="4">L4+</option>
              <option value="5">L5</option>
            </select>
            <button onClick={() => void load()} className="lg:col-span-2 ehb-btn-primary ehb-press">{loading ? "Loading..." : "Search"}</button>
          </div>
          {suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setQuery(s); void load(); }} className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100">
                  {s}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <MarketplaceCardSkeleton key={`mkt-sk-${idx}`} />)
            : null}
          {!loading
            ? items.map((item) => (
            <div
              key={`${item.kind}-${item.id}`}
              className={`rounded-2xl border p-4 space-y-3 transition-shadow ${
                demoFallback
                  ? "border-cyan-400/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-[0_0_40px_-16px_rgba(51,195,255,0.35)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-[11px] text-ehb-textBody">{item.subtitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-ehb-textMuted">Rank</div>
                  <div className="text-lg font-semibold text-cyan-200">{item.rankScore.toFixed(1)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {demoFallback ? (
                  <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 font-medium text-amber-100">
                    Demo
                  </span>
                ) : null}
                <span
                  className={`rounded-full border px-2 py-0.5 font-medium ${stlLevelChipClasses(item.stlLevel)}`}
                  title="EHB-STL-LEVEL (Service Trust Level)"
                >
                  EHB-STL L{item.stlLevel} ({item.stlScore.toFixed(1)})
                </span>
                <span className="rounded-full border border-white/20 px-2 py-0.5">{item.kind === "PRODUCT" ? "Product" : "Service"}</span>
                <span className="rounded-full border border-white/20 px-2 py-0.5">{item.rating !== null ? `★ ${item.rating.toFixed(1)}` : "No ratings"}</span>
              </div>
              <div className="text-[11px] text-ehb-textBody">
                Industry: {item.industry?.name ?? "—"} {item.location ? `• ${item.location}` : ""}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.industryBadges.map((b) => (
                  <span key={b.id} className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
                    {b.slug}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => void placeOrder(item)} className="ehb-btn-primary ehb-press">Order</button>
                <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-2 py-1 text-xs">
                  <option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                </select>
                <button onClick={() => void submitReview(item)} className="ehb-btn-secondary ehb-press">Review</button>
              </div>
            </div>
              ))
            : null}
          {!loading && items.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-ehb-textBody">
              No marketplace results found.
            </div>
          ) : null}
        </section>

        <section className="ehb-card-elevated space-y-2">
          <div className="text-xs font-semibold">Review Comment</div>
          <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full h-20 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs" placeholder="Optional review comment used for quality signals..." />
        </section>

        {toast.open ? (
          <div className={`fixed bottom-6 right-6 z-[80] rounded-xl border px-4 py-3 text-xs ${toast.kind === "ok" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" : "border-rose-400/40 bg-rose-500/10 text-rose-100"}`}>
            <div className="font-semibold">{toast.kind === "ok" ? "Success" : "Error"}</div>
            <div>{toast.text}</div>
            <button className="mt-2 underline" onClick={() => setToast((t) => ({ ...t, open: false }))}>Close</button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

