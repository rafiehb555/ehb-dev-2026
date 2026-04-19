"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GOSELLR_PRODUCTS } from "@/lib/marketplace/gosellrProducts";
import { useCart } from "@/components/gosellr/useCart";
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

// Mock seller data with proximity
const MOCK_SELLERS = [
  { id: "seller_1", name: "TechHub Warehouse", city: "Karachi", stl: 7, distance: 2.3 },
  { id: "seller_2", name: "Quality Imports Co.", city: "Karachi", stl: 5, distance: 5.1 },
  { id: "seller_3", name: "Premium Distribution", city: "Lahore", stl: 6, distance: 185.0 },
];

function getSellersForProducts(productIds: string[]): typeof MOCK_SELLERS {
  const sellerMap: Record<string, typeof MOCK_SELLERS[0]> = {};
  productIds.forEach((pid, idx) => {
    const seller = MOCK_SELLERS[idx % MOCK_SELLERS.length];
    sellerMap[seller.id] = seller;
  });
  return Object.values(sellerMap);
}

function calculateDeliveryFee(distance: number, isGrouped: boolean): number {
  const baseFee = Math.max(2, Math.ceil(distance / 10) * 1.5);
  return isGrouped ? Math.ceil(baseFee * 0.7) : baseFee;
}

export default function CartPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const router = useRouter();
  const { items, count, setQty, removeItem, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [groupingOption, setGroupingOption] = useState<"ai" | "manual">("ai");

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
    return selectedCountry?.accent ?? "#29ABE2";
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

  // Group products by seller proximity
  const groupedOrders = useMemo(() => {
    if (lines.length === 0) return [];

    // For demo: group items by sellers (2-3 sellers max)
    const groups: Array<{
      sellerId: string;
      seller: typeof MOCK_SELLERS[0];
      items: typeof lines;
      deliveryFee: number;
      estimatedDays: number;
    }> = [];

    const productIds = lines.map((l) => l.product.id);
    const sellers = getSellersForProducts(productIds);

    sellers.forEach((seller) => {
      const sellerItems = lines.filter((l, idx) => MOCK_SELLERS[idx % MOCK_SELLERS.length].id === seller.id);
      if (sellerItems.length > 0) {
        groups.push({
          sellerId: seller.id,
          seller,
          items: sellerItems,
          deliveryFee: groupingOption === "ai" ? calculateDeliveryFee(seller.distance, true) : calculateDeliveryFee(seller.distance, false),
          estimatedDays: groupingOption === "ai" ? 2 : 3,
        });
      }
    });

    return groups.sort((a, b) => a.seller.distance - b.seller.distance);
  }, [lines, groupingOption]);

  const totalDeliveryFee = useMemo(
    () => groupedOrders.reduce((sum, g) => sum + g.deliveryFee, 0),
    [groupedOrders]
  );

  const finalTotal = useMemo(() => totalUsd + totalDeliveryFee, [totalUsd, totalDeliveryFee]);

  const placeOrder = async () => {
    if (lines.length === 0) return;
    setCheckoutError(null);
    setBusy(true);

    try {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const meJson = await meRes.json();
      if (!meRes.ok || !meJson?.success || !meJson?.data?.user) {
        setCheckoutError("Please log in to place a real order (session required for marketplace API).");
        setBusy(false);
        return;
      }

      const dbOrderIds: string[] = [];
      const dmoApplicationIds: string[] = [];

      for (const line of lines) {
        const res = await fetch("/api/marketplace/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "PRODUCT",
            itemId: line.product.id,
            quantity: line.qty,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json?.success) {
          const msg = json?.error?.message ?? json?.message ?? `Order failed (${res.status})`;
          setCheckoutError(msg);
          setBusy(false);
          return;
        }
        const oid = json.data?.orderId as string | undefined;
        const dmoId = json.data?.dmoApplicationId as string | null | undefined;
        if (oid) dbOrderIds.push(oid);
        if (dmoId) dmoApplicationIds.push(dmoId);
      }

      const order: Order = {
        id: dbOrderIds[0] ?? `order_${Date.now()}`,
        createdAt: Date.now(),
        items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        totalUsd: finalTotal,
        dbOrderIds: dbOrderIds.length ? dbOrderIds : undefined,
        dmoApplicationIds: dmoApplicationIds.length ? dmoApplicationIds : undefined,
      };

      try {
        const prev = safeParseOrders(window.localStorage.getItem(ORDERS_KEY));
        const next = [order, ...prev].slice(0, 10);
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      clear();
      router.push(`/checkout${locationQs}`);
    } catch {
      setCheckoutError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Cart</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              {count > 0 ? `You have ${count} item(s)` : "Your cart is empty"}
            </h1>
            <p className="text-ehb-textMuted max-w-2xl text-sm">
              Add items from GoSellr, then proceed to checkout with AI-optimized grouping.
            </p>

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
              ← Back to GoSellr
            </Link>
            <Link
              href={`/orders${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-ehb-textBody hover:bg-white/10 transition-all duration-200"
            >
              Orders
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {lines.length === 0 ? (
              <div className="glass-panel border border-white/10 p-6 space-y-4">
                <p className="text-ehb-textBody">Your cart is empty.</p>
                <Link
                  href={`/gosellr${locationQs}`}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
                >
                  Browse Products →
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {lines.map((l) => (
                    <div key={l.product.id} className="glass-card rounded-3xl border border-white/10 p-4 flex gap-4 items-start hover:border-white/20 transition-all">
                      <div className="relative h-20 w-20 shrink-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#7B6EF6]/20 to-[#2BBFA0]/20 overflow-hidden">
                        <Image
                          src={l.product.image}
                          alt={l.product.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white line-clamp-2">{l.product.name}</p>
                            <p className="text-[11px] text-ehb-textMuted mt-1">{l.product.category}</p>
                            <div className="mt-2 inline-flex rounded-[5px] border border-[#7B6EF6]33 bg-[rgba(123,110,246,0.1)] px-2.5 py-1.5 text-[10px] font-medium text-[#7B6EF6]">
                              L5 ADVANCED
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Total</p>
                            <p className="text-sm font-semibold text-white mt-2">
                              {l.product.priceUsd === 0 ? "Free" : `$${l.lineUsd.toFixed(2)}`}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-ehb-textBody hover:bg-white/10 transition-all"
                            onClick={() => setQty(l.product.id, Math.max(0, l.qty - 1))}
                          >
                            −
                          </button>
                          <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-white font-semibold">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-ehb-textBody hover:bg-white/10 transition-all"
                            onClick={() => setQty(l.product.id, l.qty + 1)}
                          >
                            +
                          </button>

                          <button
                            type="button"
                            className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-ehb-textBody hover:bg-white/10 transition-all ml-auto text-[#F05858]"
                            onClick={() => removeItem(l.product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Cart Grouping */}
                <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#2BBFA0] font-semibold">AI Recommendations</p>
                      <p className="text-sm font-semibold text-white mt-2">Order Grouping</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[rgba(43,191,160,0.15)] border border-[rgba(43,191,160,0.3)] px-2.5 py-1.5 text-[10px] font-medium text-[#2BBFA0]">
                      AI optimized
                    </span>
                  </div>

                  <p className="text-[12px] text-ehb-textBody leading-relaxed">
                    We've grouped your orders by seller proximity to save 30% on delivery costs.
                  </p>

                  <div className="space-y-2">
                    {/* Option A: AI Recommended */}
                    <label className="block p-3 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: groupingOption === "ai" ? "#2BBFA0" : "rgba(255,255,255,0.1)",
                        backgroundColor: groupingOption === "ai" ? "rgba(43,191,160,0.08)" : "transparent"
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="grouping"
                          value="ai"
                          checked={groupingOption === "ai"}
                          onChange={(e) => setGroupingOption(e.target.value as "ai" | "manual")}
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">Option A: AI Grouped (Recommended)</p>
                          <p className="text-[11px] text-ehb-textMuted mt-1">
                            {groupedOrders.length} groups • Saves ~$
                            {(totalDeliveryFee * 0.3).toFixed(2)} • Delivery in 2 days
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Option B: Manual */}
                    <label className="block p-3 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: groupingOption === "manual" ? "#F0A030" : "rgba(255,255,255,0.1)",
                        backgroundColor: groupingOption === "manual" ? "rgba(240,160,48,0.08)" : "transparent"
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="grouping"
                          value="manual"
                          checked={groupingOption === "manual"}
                          onChange={(e) => setGroupingOption(e.target.value as "ai" | "manual")}
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">Option B: Manual Selection</p>
                          <p className="text-[11px] text-ehb-textMuted mt-1">
                            Manage each order separately • Higher cost • Delivery in 3-5 days
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Grouped Orders Preview */}
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Order Groups</p>
                    {groupedOrders.map((group, idx) => (
                      <div key={group.sellerId} className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-semibold text-white">{group.seller.name}</p>
                            <p className="text-[11px] text-ehb-textMuted">
                              {group.seller.city} • {group.seller.distance.toFixed(1)} km • {group.items.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Fee</p>
                            <p className="text-[12px] font-semibold text-white">${group.deliveryFee.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Order summary</p>

              <div className="space-y-3 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-3 text-ehb-textBody">
                  <span>Subtotal ({lines.length} items)</span>
                  <span className="text-white font-semibold">
                    {totalUsd === 0 ? "Free" : `$${totalUsd.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-ehb-textBody">
                  <span>Delivery ({groupedOrders.length} groups)</span>
                  <span className="text-white font-semibold">${totalDeliveryFee.toFixed(2)}</span>
                </div>
                {groupingOption === "ai" && (
                  <div className="flex items-center justify-between gap-3 text-[#2BBFA0]">
                    <span>AI Savings</span>
                    <span className="font-semibold">-${(totalDeliveryFee * 0.3).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">${finalTotal.toFixed(2)}</span>
              </div>

              <p className="text-[11px] text-ehb-textMuted leading-relaxed">
                Trust settlement: EHB‑STL secure payment via wallet or COD. Commission split: 85% seller · 10% franchise · 5% platform.
              </p>

              {checkoutError ? (
                <p className="text-[12px] text-rose-300 leading-snug">{checkoutError}</p>
              ) : null}

              <button
                type="button"
                onClick={placeOrder}
                disabled={lines.length === 0 || busy}
                className="min-h-touch w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#F0A030] to-[#F05858] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed btn-glow"
              >
                {busy ? "Processing..." : "Proceed to Checkout →"}
              </button>
            </div>

            {/* Trust Info */}
            <div className="glass-panel rounded-3xl border border-white/10 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#2BBFA0]">Trust Signals</p>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-start gap-2">
                  <span className="text-[#38C878] mt-0.5">✓</span>
                  <span className="text-ehb-textBody">Verified sellers only</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#38C878] mt-0.5">✓</span>
                  <span className="text-ehb-textBody">STL L5+ rating minimum</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#38C878] mt-0.5">✓</span>
                  <span className="text-ehb-textBody">Wallet escrow protection</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
