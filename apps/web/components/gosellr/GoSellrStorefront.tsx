"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Public Storefront
 *  Consumes GET /api/gosellr/products.
 *
 *  Features:
 *    • Search by name (debounced 300ms)
 *    • Category filter chips
 *    • Sort: STL ↓ · Price ↑ · Price ↓
 *    • Premium product cards with STL trust badge
 *    • Quick-view opens ProductQuickViewModal
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useEffect, useMemo, useState } from "react";
import { ProductQuickViewModal } from "@/components/gosellr/ProductQuickViewModal";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  rating: number | null;
  seller: { id: string; email: string };
  stlLevel: number;
  stlScore: number;
}

const SORTS = [
  { code: "stl",        label: "Trust (STL ↓)" },
  { code: "price_asc",  label: "Price ↑" },
  { code: "price_desc", label: "Price ↓" },
];

const CATEGORIES = [
  "All", "Electronics", "Fashion", "Home", "Beauty", "Sports",
  "Grocery", "Books", "Toys", "Automotive",
];

const STL_COLOR: Record<number, string> = {
  0: "#9CA3AF", 1: "#60A5FA", 2: "#22B14C", 3: "#F59E0B", 4: "#F97316",
  5: "#EC4899", 6: "#A855F7", 7: "#7B6EF6", 8: "#29ABE2",
};
const STL_LABEL: Record<number, string> = {
  0: "FREE", 1: "BASIC", 2: "NORMAL", 3: "HIGH", 4: "VIP",
  5: "ULTRA", 6: "DIAMOND", 7: "PLATINUM", 8: "SUPREME",
};

export function GoSellrStorefront() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("stl");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProductRow | null>(null);

  const qs = useMemo(() => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (category && category !== "All") u.set("category", category);
    u.set("sort", sort);
    u.set("take", "24");
    return u.toString();
  }, [q, category, sort]);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gosellr/products?${qs}`, { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setRows(json.data.rows);
          setTotal(json.data.total);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [qs]);

  return (
    <div className="space-y-6">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(41,171,226,0.12) 0%, rgba(19,22,42,0.95) 50%, rgba(34,177,76,0.12) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{ background: "#29ABE2" }}
        />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">GoSellr · Storefront</div>
          <h1 className="mt-1 text-3xl font-bold">Verified Products Across 32 Industries</h1>
          <p className="mt-1 text-sm text-white/60">
            Every seller here has passed PSS + CRB + DMO verification. Buy with confidence.
          </p>

          {/* Search + sort */}
          <div className="mt-5 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg bg-[#1A1D33] px-4 py-3 pl-10 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg bg-[#1A1D33] px-3 py-3 text-sm outline-none"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {SORTS.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all"
                  style={{
                    background: active ? "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)" : "rgba(255,255,255,0.04)",
                    color: active ? "white" : "rgba(255,255,255,0.6)",
                    border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RESULTS HEADER ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-white/50">
          {loading ? "Loading…" : `${total} product${total === 1 ? "" : "s"} found`}
        </div>
      </div>

      {/* ── GRID ─────────────────────────────────────────────── */}
      {loading && rows.length === 0 ? (
        <div className="rounded-2xl p-12 text-center text-white/50" style={{ background: "rgba(19,22,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
          Loading products…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl p-12 text-center text-white/50" style={{ background: "rgba(19,22,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
          No products match those filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((p) => (
            <ProductCard key={p.id} p={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      {/* ── QUICK VIEW MODAL ─────────────────────────────────── */}
      {selected && (
        <ProductQuickViewModal
          open={!!selected}
          onClose={() => setSelected(null)}
          product={{
            id: selected.id,
            name: selected.name,
            description: selected.description ?? "",
            price: selected.price,
            imageUrl: selected.imageUrl ?? undefined,
            category: selected.category ?? undefined,
            stock: selected.stock,
            rating: selected.rating ?? undefined,
            seller: {
              id: selected.seller.id,
              name: selected.seller.email.split("@")[0],
              email: selected.seller.email,
              stlLevel: selected.stlLevel,
              stlScore: selected.stlScore,
            },
          }}
        />
      )}
    </div>
  );
}

function ProductCard({ p, onClick }: { p: ProductRow; onClick: () => void }) {
  const stlC = STL_COLOR[p.stlLevel] ?? "#9CA3AF";
  const stlL = STL_LABEL[p.stlLevel] ?? "FREE";
  const outOfStock = p.stock <= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl text-left transition-all hover:-translate-y-1"
      style={{
        background: "rgba(19,22,42,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: "#1A1D33" }}>
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-white/20">🛍</div>
        )}
        {/* STL badge */}
        <div
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
          style={{ background: `${stlC}33`, color: stlC, border: `1px solid ${stlC}77` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: stlC, boxShadow: `0 0 6px ${stlC}` }} />
          L{p.stlLevel} · {stlL}
        </div>
        {outOfStock && (
          <div className="absolute right-3 top-3 rounded-full bg-red-500/20 px-2.5 py-1 text-[10px] font-bold uppercase text-red-300 backdrop-blur-md border border-red-500/40">
            Out of stock
          </div>
        )}
      </div>
      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        {p.category && (
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/35">{p.category}</div>
        )}
        <div className="mt-1 line-clamp-2 text-[14px] font-semibold text-white">{p.name}</div>
        <div className="mt-1 truncate text-[11px] text-white/45">by {p.seller.email}</div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="text-lg font-bold" style={{ color: "#29ABE2" }}>
            ${p.price.toFixed(2)}
          </div>
          {p.rating != null && (
            <div className="flex items-center gap-1 text-[11px] text-white/60">
              <span className="text-yellow-400">★</span>
              {p.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default GoSellrStorefront;
