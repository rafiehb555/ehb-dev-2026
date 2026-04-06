"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GOSELLR_PRODUCTS } from "@/lib/marketplace/gosellrProducts";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type Order = {
  id: string;
  createdAt: number;
  items: { productId: string; qty: number }[];
  totalUsd: number;
  dbOrderIds?: string[];
  dmoApplicationIds?: string[];
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

export default function OrdersPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const [orders, setOrders] = useState<Order[]>([]);

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

  useEffect(() => {
    try {
      setOrders(safeParseOrders(window.localStorage.getItem(ORDERS_KEY)));
    } catch {
      // ignore
    }
  }, []);

  const productMap = useMemo(() => {
    const m = new Map<string, (typeof GOSELLR_PRODUCTS)[number]>();
    GOSELLR_PRODUCTS.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Orders</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              {orders.length ? `Your latest orders (${orders.length})` : "No orders yet"}
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm">
              Recent checkouts from cart (local snapshot). DB order ids appear when checkout used the marketplace API.
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
              href={`/cart${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to cart
            </Link>
            <Link
              href={`/gosellr${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 hover:bg-white/10 transition-all duration-200"
            >
              GoSellr
            </Link>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-6">
            <p className="text-slate-300">Place an order from your cart to see it here.</p>
          </div>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {orders.map((o) => (
              <div key={o.id} className="glass-card rounded-3xl border p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Order id</p>
                    <p className="text-sm font-semibold text-white mt-2">{o.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-white mt-2">
                      {o.totalUsd === 0 ? "Free" : `$${o.totalUsd.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {o.items.map((it) => {
                    const p = productMap.get(it.productId);
                    if (!p) return null;
                    return (
                      <div key={it.productId} className="flex items-center justify-between gap-3 text-slate-300 text-[12px]">
                        <span className="line-clamp-1">{p.name}</span>
                        <span className="font-semibold text-white">
                          Qty {it.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">Settlement</p>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    EHB‑STL secure settlement after verification (demo). Created at:{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                  {o.dbOrderIds?.length ? (
                    <p className="text-[11px] text-slate-400 font-mono break-all">
                      DB orders: {o.dbOrderIds.join(", ")}
                    </p>
                  ) : null}
                  {o.dmoApplicationIds?.length ? (
                    <p className="text-[11px] text-amber-200/90">
                      DMO review:{" "}
                      <Link href="/dmo/applications" className="underline hover:text-white">
                        {o.dmoApplicationIds.length} application(s)
                      </Link>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

