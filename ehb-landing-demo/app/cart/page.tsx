"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GOSELLR_PRODUCTS } from "@/lib/gosellrProducts";
import { useCart } from "@/components/gosellr/useCart";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type Order = {
  id: string;
  createdAt: number;
  items: { productId: string; qty: number }[];
  totalUsd: number;
};

const ORDERS_KEY = "ehb_gosellr_orders_v1";

function safeParseOrders(raw: string | null): Order[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Order[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export default function CartPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const router = useRouter();
  const { items, count, setQty, removeItem, clear } = useCart();
  const [busy, setBusy] = useState(false);

  const locationQs = useMemo(() => {
    const countryCode = searchParams?.country?.trim() || "";
    const stateCode = searchParams?.state?.trim() || "";
    const cityCode = searchParams?.city?.trim() || "";
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  }, [searchParams?.country, searchParams?.state, searchParams?.city]);

  const locationLabel = useMemo(() => {
    const countryCode = searchParams?.country?.trim() || "";
    const stateCode = searchParams?.state?.trim() || "";
    const cityCode = searchParams?.city?.trim() || "";

    const selectedCountry = countryCode ? getCountryByCode(countryCode) : undefined;
    const selectedState = countryCode && stateCode ? getStateByCode(countryCode, stateCode) : undefined;
    const selectedCity =
      countryCode && stateCode && cityCode ? getCityByCode(countryCode, stateCode, cityCode) : undefined;

    return selectedCity?.name || selectedState?.name || selectedCountry?.name || "";
  }, [searchParams?.country, searchParams?.state, searchParams?.city]);

  const locationAccent = useMemo(() => {
    const countryCode = searchParams?.country?.trim() || "";
    const selectedCountry = countryCode ? getCountryByCode(countryCode) : undefined;
    return selectedCountry?.accent ?? "#00AEEF";
  }, [searchParams?.country]);

  const productMap = useMemo(() => {
    const m = new Map<string, (typeof GOSELLR_PRODUCTS)[number]>();
    GOSELLR_PRODUCTS.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  const lines = useMemo(() => {
    return items
      .map((i) => {
        const p = productMap.get(i.productId);
        if (!p) return null;
        return { product: p, qty: i.qty, lineUsd: p.priceUsd * i.qty };
      })
      .filter(Boolean) as { product: (typeof GOSELLR_PRODUCTS)[number]; qty: number; lineUsd: number }[];
  }, [items, productMap]);

  const totalUsd = useMemo(() => lines.reduce((s, l) => s + l.lineUsd, 0), [lines]);

  const placeOrder = async () => {
    if (lines.length === 0) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));

    const order: Order = {
      id: `order_${Date.now()}`,
      createdAt: Date.now(),
      items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
      totalUsd,
    };

    try {
      const prev = safeParseOrders(window.localStorage.getItem(ORDERS_KEY));
      const next = [order, ...prev].slice(0, 10);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }

    clear();
    setBusy(false);
    router.push(`/orders${locationQs}`);
  };

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Cart</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              {count > 0 ? `You have ${count} item(s)` : "Your cart is empty"}
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm">
              Demo cart. Purchase creates a mock order record and clears cart.
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
              href={`/gosellr${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to GoSellr
            </Link>
            <Link
              href={`/orders${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 hover:bg-white/10 transition-all duration-200"
            >
              Orders
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {lines.length === 0 ? (
              <div className="glass-panel border border-white/10 p-5">
                <p className="text-slate-300">Add some verified products to your cart.</p>
              </div>
            ) : (
              lines.map((l) => (
                <div key={l.product.id} className="glass-card rounded-3xl border p-5 flex gap-4 items-start">
                  <div className="h-24 w-24 rounded-2xl border bg-white/5 flex items-center justify-center overflow-hidden">
                    <img src={l.product.image} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-2">{l.product.name}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{l.product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Total</p>
                        <p className="text-sm font-semibold text-white mt-2">
                          {l.product.priceUsd === 0 ? "Free" : `$${l.lineUsd.toFixed(2)}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200">
                        Qty
                      </div>
                      <button
                        type="button"
                        className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/10 transition-all"
                        onClick={() => setQty(l.product.id, Math.max(0, l.qty - 1))}
                      >
                        −
                      </button>
                      <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-white font-semibold">
                        {l.qty}
                      </span>
                      <button
                        type="button"
                        className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/10 transition-all"
                        onClick={() => setQty(l.product.id, l.qty + 1)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/10 transition-all ml-auto"
                        onClick={() => removeItem(l.product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Order summary</p>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span>Subtotal</span>
                <span className="text-white font-semibold">
                  {totalUsd === 0 ? "Free" : `$${totalUsd.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span>Trust settlement</span>
                <span className="text-white font-semibold">EHB‑STL (demo)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                In production: wallet escrow + verification approvals apply before settlement.
              </p>
              <button
                type="button"
                onClick={placeOrder}
                disabled={lines.length === 0 || busy}
                className="min-h-touch w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? "Placing..." : "Place order (demo) →"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

