"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GOSELLR_PRODUCTS } from "@/lib/marketplace/gosellrProducts";

type OrderStatus = "placed" | "paid" | "packed" | "on-way" | "delivered" | "cancelled" | "refunded";
type ReviewRating = 1 | 2 | 3 | 4 | 5;

const COMMISSION_SPLIT = {
  seller: 0.85,
  franchise: 0.1,
  platform: 0.05,
};

// Mock detailed order data
const MOCK_ORDER_DETAILS = {
  id: "ORD-2026041900001",
  status: "delivered" as OrderStatus,
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  items: [
    { productId: "prod_1", qty: 2, name: "Wireless Headphones", price: 29.99 },
    { productId: "prod_3", qty: 1, name: "USB-C Cable", price: 9.99 },
  ],
  subtotal: 69.97,
  deliveryFee: 8.5,
  total: 78.47,
  shippingAddress: {
    name: "Ali Hassan",
    address: "123 Main Street, Apt 4B",
    city: "Karachi",
    phone: "+92 300 1234567",
  },
  deliveryOption: "Express (1-2 days)",
  paymentMethod: "EHB Wallet",
  seller: {
    id: "seller_1",
    name: "TechHub Warehouse",
    city: "Karachi",
    stl: 7,
    rating: 4.8,
    reviews: 2341,
  },
  rider: {
    name: "Muhammad Ahmed",
    stl: 6,
    phone: "+92 321 9876543",
    estimatedArrival: "Today by 6 PM",
  },
  timeline: [
    { step: "placed", label: "Order Placed", time: "2 days ago", completed: true },
    { step: "paid", label: "Payment Confirmed", time: "2 days ago", completed: true },
    { step: "packed", label: "Packed & Ready", time: "1 day ago", completed: true },
    { step: "on-way", label: "Out for Delivery", time: "2 hours ago", completed: true },
    { step: "delivered", label: "Delivered", time: "Just now", completed: true },
  ],
};

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState<ReviewRating>(5);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const order = useMemo(() => {
    // In a real app, fetch by orderId
    return MOCK_ORDER_DETAILS;
  }, []);

  const statusColor = STATUS_COLORS[order.status];
  const commissionBreakdown = useMemo(() => ({
    seller: parseFloat((order.subtotal * COMMISSION_SPLIT.seller).toFixed(2)),
    franchise: parseFloat((order.subtotal * COMMISSION_SPLIT.franchise).toFixed(2)),
    platform: parseFloat((order.subtotal * COMMISSION_SPLIT.platform).toFixed(2)),
  }), [order.subtotal]);

  const handleSubmitReview = () => {
    setSubmitted(true);
    setShowReview(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Order Details</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">{order.id}</h1>
            <p className="text-ehb-textMuted text-sm mt-1">
              {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
            </p>
          </div>
          <Link
            href="/orders"
            className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
          >
            ← Back to Orders
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-4">
            {/* Order Status */}
            <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: statusColor.bg,
                    borderColor: statusColor.dot + "33",
                    borderWidth: "1px",
                  }}
                >
                  {order.status === "delivered" ? "✓" : "⏳"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{statusColor.label}</p>
                  <p className="text-[11px] text-ehb-textMuted">Order Status</p>
                </div>
              </div>

              <p className="text-[12px] text-ehb-textBody leading-relaxed">
                {order.status === "delivered"
                  ? "Your order has been successfully delivered."
                  : "Your order is on the way and will arrive soon."}
              </p>
            </div>

            {/* Delivery Timeline */}
            <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
              <p className="text-sm font-semibold text-white mb-4">Delivery Timeline</p>
              <div className="space-y-3">
                {order.timeline.map((event, idx) => (
                  <div key={event.step} className="flex gap-4">
                    {/* Timeline Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2"
                        style={{
                          backgroundColor: event.completed ? "#38C878" : "rgba(255,255,255,0.1)",
                          color: event.completed ? "white" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {event.completed ? "✓" : idx + 1}
                      </div>
                      {idx < order.timeline.length - 1 && (
                        <div
                          className="w-0.5 h-12"
                          style={{
                            backgroundColor: event.completed ? "#38C878" : "rgba(255,255,255,0.1)",
                          }}
                        />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="pt-1 pb-3 flex-1">
                      <p className="text-sm font-semibold text-white">{event.label}</p>
                      <p className="text-[11px] text-ehb-textMuted mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Information (if on-way or delivered) */}
            {["on-way", "delivered"].includes(order.status) && (
              <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-3">
                <p className="text-sm font-semibold text-white mb-3">Delivery Partner</p>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-white">{order.rider.name}</p>
                    <p className="text-[11px] text-ehb-textMuted mt-1">STL L{order.rider.stl}</p>
                    <p className="text-[11px] text-ehb-textMuted mt-2">
                      <span className="text-[#2BBFA0]">Est. Arrival:</span> {order.rider.estimatedArrival}
                    </p>
                  </div>
                  <button className="min-h-touch rounded-lg bg-[rgba(123,110,246,0.1)] border border-[rgba(123,110,246,0.3)] px-3 py-2 text-[11px] font-semibold text-[#7B6EF6] hover:bg-[rgba(123,110,246,0.2)] transition-all">
                    Call
                  </button>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">Items Ordered</p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 last:border-0">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-ehb-textMuted">Qty: {item.qty}</p>
                    </div>
                    <p className="text-[12px] font-semibold text-white">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Order Summary */}
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3 sticky top-20">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-3">Order Summary</p>

              <div className="space-y-2 pb-3 border-b border-white/10 text-sm">
                <div className="flex items-center justify-between gap-2 text-ehb-textBody">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-ehb-textBody">
                  <span>Delivery</span>
                  <span className="text-white font-semibold">${order.deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-lg">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2 font-semibold">
                Shipping Address
              </p>
              <div className="space-y-1 text-[12px]">
                <p className="font-semibold text-white">{order.shippingAddress.name}</p>
                <p className="text-ehb-textBody">{order.shippingAddress.address}</p>
                <p className="text-ehb-textBody">{order.shippingAddress.city}</p>
                <p className="text-ehb-textMuted">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Seller Information */}
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2 font-semibold">
                Seller
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">{order.seller.name}</p>
                <p className="text-[11px] text-ehb-textMuted">{order.seller.city}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="rounded-[6px] border border-[#7B6EF6]33 bg-[rgba(123,110,246,0.15)] px-3 py-1.5">
                    <span className="font-mono font-bold text-[11px] text-[#7B6EF6]">
                      L{order.seller.stl}
                    </span>
                  </div>
                  <p className="text-[11px] text-ehb-textMuted">
                    {order.seller.rating} ★ ({order.seller.reviews.toLocaleString()} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Breakdown */}
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-3 font-semibold">
                Commission Split
              </p>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-ehb-textBody">Seller</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">${commissionBreakdown.seller.toFixed(2)}</span>
                    <span className="text-[#38C878] font-mono text-[10px]">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ehb-textBody">Franchise</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">${commissionBreakdown.franchise.toFixed(2)}</span>
                    <span className="text-[#F0A030] font-mono text-[10px]">10%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ehb-textBody">Platform</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">${commissionBreakdown.platform.toFixed(2)}</span>
                    <span className="text-[#7B6EF6] font-mono text-[10px]">5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {order.status === "delivered" && !showReview && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowReview(true)}
                  className="w-full rounded-lg bg-gradient-to-r from-[#38C878] to-[#2BBFA0] px-3 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
                >
                  Leave Review
                </button>
                <button className="w-full rounded-lg bg-[rgba(240,88,88,0.1)] border border-[rgba(240,88,88,0.3)] px-3 py-2.5 text-sm font-semibold text-[#F05858] hover:bg-[rgba(240,88,88,0.2)] transition-all">
                  Return Item
                </button>
              </div>
            )}

            {/* Review Form */}
            {showReview && (
              <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-3 bg-[rgba(123,110,246,0.05)]">
                <p className="text-sm font-semibold text-white">Share Your Experience</p>

                {/* Star Rating */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star as ReviewRating)}
                      className="text-2xl transition-all"
                    >
                      {star <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>

                {/* Review Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think about this product?"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[12px] text-white placeholder:text-ehb-textMuted focus:border-[#7B6EF6] focus:outline-none transition-colors resize-none h-20"
                />

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReview(false)}
                    className="flex-1 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-[12px] font-semibold text-ehb-textBody hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={!reviewText.trim()}
                    className="flex-1 rounded-lg bg-[#38C878] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Submitted Confirmation */}
            {submitted && (
              <div className="glass-panel rounded-3xl border border-[#38C878] bg-[rgba(56,200,120,0.08)] p-4">
                <p className="text-[12px] text-[#38C878] font-semibold flex items-center gap-2">
                  ✓ Thank you for your review!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
