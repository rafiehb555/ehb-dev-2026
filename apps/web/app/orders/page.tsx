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

type OrderTab = "all" | "active" | "completed" | "cancelled" | "refunded";
type OrderStatus = "placed" | "paid" | "packed" | "on-way" | "delivered" | "cancelled" | "refunded";

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

// Mock order data with status
const MOCK_ORDERS_WITH_STATUS: Array<Order & { status: OrderStatus; sellerId: string; sellerName: string; stl: number }> = [
  {
    id: "ORD-2026041900001",
    createdAt: Date.now() - 1000 * 60 * 60,
    items: [{ productId: "prod_1", qty: 1 }],
    totalUsd: 45.99,
    status: "on-way",
    sellerId: "seller_1",
    sellerName: "TechHub Warehouse",
    stl: 7,
  },
  {
    id: "ORD-2026041900002",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    items: [{ productId: "prod_2", qty: 2 }],
    totalUsd: 89.98,
    status: "delivered",
    sellerId: "seller_2",
    sellerName: "Quality Imports Co.",
    stl: 5,
  },
  {
    id: "ORD-2026041900003",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    items: [{ productId: "prod_3", qty: 1 }],
    totalUsd: 29.99,
    status: "delivered",
    sellerId: "seller_3",
    sellerName: "Premium Distribution",
    stl: 6,
  },
  {
    id: "ORD-2026041900004",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    items: [{ productId: "prod_1", qty: 3 }],
    totalUsd: 137.97,
    status: "cancelled",
    sellerId: "seller_1",
    sellerName: "TechHub Warehouse",
    stl: 7,
  },
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; dot: string; text: string; label: string }> = {
  placed: {
    bg: "bg-[rgba(240,160,48,0.1)]",
    dot: "bg-[#F0A030]",
    text: "text-[#F0A030]",
    label: "Placed",
  },
  paid: {
    bg: "bg-[rgba(123,110,246,0.1)]",
    dot: "bg-[#7B6EF6]",
    text: "text-[#7B6EF6]",
    label: "Paid",
  },
  packed: {
    bg: "bg-[rgba(160,120,240,0.1)]",
    dot: "bg-[#A098F8]",
    text: "text-[#A098F8]",
    label: "Packed",
  },
  "on-way": {
    bg: "bg-[rgba(123,110,246,0.1)]",
    dot: "bg-[#7B6EF6]",
    text: "text-[#7B6EF6]",
    label: "On Way",
  },
  delivered: {
    bg: "bg-[rgba(56,200,120,0.1)]",
    dot: "bg-[#38C878]",
    text: "text-[#38C878]",
    label: "Delivered",
  },
  cancelled: {
    bg: "bg-[rgba(240,88,88,0.1)]",
    dot: "bg-[#F05858]",
    text: "text-[#F05858]",
    label: "Cancelled",
  },
  refunded: {
    bg: "bg-[rgba(43,191,160,0.1)]",
    dot: "bg-[#2BBFA0]",
    text: "text-[#2BBFA0]",
    label: "Refunded",
  },
};

export default function OrdersPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  useEffect(() => {
    try {
      const localOrders = safeParseOrders(window.localStorage.getItem(ORDERS_KEY));
      setOrders(localOrders);
    } catch {
      // ignore
    }
  }, []);

  const productMap = useMemo(() => {
    const m = new Map<string, (typeof GOSELLR_PRODUCTS)[number]>();
    GOSELLR_PRODUCTS.forEach((p) => m.set(p.id, p));
    return m;
  }, []);

  // Combine local and mock orders
  const allOrdersWithStatus = useMemo(() => {
    const combined = [
      ...MOCK_ORDERS_WITH_STATUS,
      ...orders.map((o) => ({
        ...o,
        status: ("delivered" as OrderStatus),
        sellerId: "seller_unknown",
        sellerName: "Unknown Seller",
        stl: 4,
      })),
    ];
    return combined;
  }, [orders]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case "active":
        return allOrdersWithStatus.filter((o) => ["placed", "paid", "packed", "on-way"].includes(o.status));
      case "completed":
        return allOrdersWithStatus.filter((o) => o.status === "delivered");
      case "cancelled":
        return allOrdersWithStatus.filter((o) => o.status === "cancelled");
      case "refunded":
        return allOrdersWithStatus.filter((o) => o.status === "refunded");
      default:
        return allOrdersWithStatus;
    }
  }, [activeTab, allOrdersWithStatus]);

  const tabs = [
    { id: "all" as OrderTab, label: "All", count: allOrdersWithStatus.length },
    { id: "active" as OrderTab, label: "Active", count: allOrdersWithStatus.filter((o) => ["placed", "paid", "packed", "on-way"].includes(o.status)).length },
    { id: "completed" as OrderTab, label: "Completed", count: allOrdersWithStatus.filter((o) => o.status === "delivered").length },
    { id: "cancelled" as OrderTab, label: "Cancelled", count: allOrdersWithStatus.filter((o) => o.status === "cancelled").length },
    { id: "refunded" as OrderTab, label: "Refunded", count: allOrdersWithStatus.filter((o) => o.status === "refunded").length },
  ];

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Orders</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
              {filteredOrders.length > 0 ? `Your ${activeTab === "all" ? "orders" : activeTab}` : "No orders"}
            </h1>
            <p className="text-ehb-textMuted max-w-2xl text-sm">
              Track your purchases, delivery status, and manage returns.
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
              href={`/cart${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to Cart
            </Link>
            <Link
              href={`/gosellr${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1.5 font-semibold text-ehb-textBody hover:bg-white/10 transition-all duration-200"
            >
              Shop More
            </Link>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                color: activeTab === tab.id ? "white" : "rgba(255,255,255,0.6)",
                borderBottom: activeTab === tab.id ? "2px solid #7B6EF6" : "none",
                backgroundColor: activeTab === tab.id ? "rgba(123,110,246,0.1)" : "transparent",
              }}
            >
              {tab.label}
              <span className="ml-2 text-[11px] font-mono opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-6 text-center space-y-4">
            <p className="text-ehb-textBody">No {activeTab === "all" ? "orders" : activeTab} yet.</p>
            <Link
              href={`/gosellr${locationQs}`}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
            >
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((o) => {
              const statusColor = STATUS_COLORS[o.status];
              const isExpanded = expandedOrderId === o.id;

              return (
                <div
                  key={o.id}
                  className="glass-card rounded-3xl border border-white/10 overflow-hidden transition-all hover:border-white/20"
                >
                  {/* Order Card Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                    className="w-full px-5 py-4 flex items-start justify-between gap-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-white">{o.id}</p>
                        <div
                          className="rounded-[5px] px-2.5 py-1.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            borderColor: statusColor.dot + "33",
                            borderWidth: "1px",
                          }}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusColor.dot}`} />
                          {statusColor.label}
                        </div>
                      </div>
                      <p className="text-[11px] text-ehb-textMuted">
                        {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} item(s) • {o.sellerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${o.totalUsd.toFixed(2)}</p>
                      <p className="text-[11px] text-ehb-textMuted mt-1">
                        {isExpanded ? "Hide details" : "View details"}
                      </p>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <>
                      <div className="border-t border-white/10 px-5 py-4 space-y-4">
                        {/* Order Items */}
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2 font-semibold">
                            Items
                          </p>
                          <div className="space-y-1.5">
                            {o.items.map((item) => {
                              const p = productMap.get(item.productId);
                              return (
                                <div key={item.productId} className="flex items-center justify-between gap-2 text-[12px]">
                                  <span className="text-ehb-textBody line-clamp-1">
                                    {p?.name || "Unknown Product"}
                                  </span>
                                  <span className="font-semibold text-white">×{item.qty}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Tracking Timeline */}
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-3 font-semibold">
                            Delivery Status
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            {["placed", "paid", "packed", "on-way", "delivered"].map((step, idx, arr) => {
                              const stepStatus = step as OrderStatus;
                              const isComplete =
                                ["placed", "paid", "packed", "on-way", "delivered"].indexOf(o.status) >= idx;
                              const isActive = o.status === stepStatus;

                              return (
                                <div key={step} className="flex-1 flex flex-col items-center">
                                  {/* Node */}
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mb-2 transition-all"
                                    style={{
                                      backgroundColor: isComplete ? "#38C878" : "rgba(255,255,255,0.1)",
                                      color: isComplete ? "white" : "rgba(255,255,255,0.5)",
                                      animation: isActive ? "pulse 2s infinite" : "none",
                                      boxShadow: isActive ? "0 0 12px rgba(56,200,120,0.6)" : "none",
                                    }}
                                  >
                                    {isComplete ? "✓" : idx + 1}
                                  </div>
                                  {/* Connector */}
                                  {idx < arr.length - 1 && (
                                    <div
                                      className="absolute w-[calc(100%/5-8px)] h-0.5 mt-8"
                                      style={{
                                        backgroundColor: isComplete ? "#38C878" : "rgba(255,255,255,0.1)",
                                        marginLeft: "20px",
                                      }}
                                    />
                                  )}
                                  {/* Label */}
                                  <p className="text-[9px] text-ehb-textMuted text-center whitespace-nowrap">
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Seller & Delivery Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-ehb-textMuted mb-1 font-semibold">
                              Seller
                            </p>
                            <p className="text-[12px] font-semibold text-white">{o.sellerName}</p>
                            <div className="inline-flex rounded-[5px] border border-[#7B6EF6]33 bg-[rgba(123,110,246,0.1)] px-2 py-1 text-[9px] font-medium text-[#7B6EF6] mt-1.5">
                              L{o.stl}
                            </div>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-ehb-textMuted mb-1 font-semibold">
                              Est. Delivery
                            </p>
                            <p className="text-[12px] font-semibold text-white">
                              {o.status === "delivered" ? "Delivered" : "2 days"}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {o.status === "delivered" && (
                            <>
                              <button className="flex-1 rounded-lg bg-[rgba(56,200,120,0.1)] border border-[rgba(56,200,120,0.3)] px-3 py-2 text-[12px] font-semibold text-[#38C878] hover:bg-[rgba(56,200,120,0.2)] transition-all">
                                Review
                              </button>
                              <button className="flex-1 rounded-lg bg-[rgba(240,88,88,0.1)] border border-[rgba(240,88,88,0.3)] px-3 py-2 text-[12px] font-semibold text-[#F05858] hover:bg-[rgba(240,88,88,0.2)] transition-all">
                                Return
                              </button>
                            </>
                          )}
                          {["placed", "paid", "packed", "on-way"].includes(o.status) && (
                            <button className="flex-1 rounded-lg bg-[rgba(123,110,246,0.1)] border border-[rgba(123,110,246,0.3)] px-3 py-2 text-[12px] font-semibold text-[#7B6EF6] hover:bg-[rgba(123,110,246,0.2)] transition-all">
                              Track
                            </button>
                          )}
                          <Link
                            href={`/orders/${o.id}${locationQs}`}
                            className="flex-1 rounded-lg bg-[rgba(123,110,246,0.1)] border border-[rgba(123,110,246,0.3)] px-3 py-2 text-[12px] font-semibold text-[#7B6EF6] hover:bg-[rgba(123,110,246,0.2)] transition-all text-center"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </main>
  );
}
