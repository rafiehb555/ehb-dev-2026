"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CheckoutStep = "shipping" | "delivery" | "payment" | "review";
type DeliveryOption = "standard" | "express" | "pickup";
type PaymentMethod = "wallet" | "cod";

const STEPS: { id: CheckoutStep; label: string; number: number }[] = [
  { id: "shipping", label: "Shipping", number: 1 },
  { id: "delivery", label: "Delivery", number: 2 },
  { id: "payment", label: "Payment", number: 3 },
  { id: "review", label: "Review", number: 4 },
];

const COMMISSION_SPLIT = {
  seller: 0.85,
  franchise: 0.1,
  platform: 0.05,
};

export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [busy, setBusy] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form state
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");

  // Mock order data
  const mockOrderTotal = 145.99;
  const mockDeliveryFee = 8.5;
  const mockSubtotal = mockOrderTotal - mockDeliveryFee;
  const finalTotal = mockOrderTotal;

  const commissionBreakdown = useMemo(() => ({
    seller: parseFloat((mockSubtotal * COMMISSION_SPLIT.seller).toFixed(2)),
    franchise: parseFloat((mockSubtotal * COMMISSION_SPLIT.franchise).toFixed(2)),
    platform: parseFloat((mockSubtotal * COMMISSION_SPLIT.platform).toFixed(2)),
  }), [mockSubtotal]);

  const deliveryOptions = [
    { id: "standard", label: "Standard Delivery", days: "3-5 days", cost: 0, icon: "📦" },
    { id: "express", label: "Express Delivery", days: "1-2 days", cost: 12.99, icon: "⚡" },
    { id: "pickup", label: "Self Pickup", days: "Today", cost: 0, icon: "🏪" },
  ] as const;

  const paymentOptions = [
    { id: "wallet", label: "EHB Wallet (EHBGC)", desc: "Instant payment from your wallet balance", icon: "💰" },
    { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "🏠", note: "Trusty Wallet required" },
  ] as const;

  const canProceed = (): boolean => {
    if (currentStep === "shipping") {
      return !!(shippingData.fullName && shippingData.address && shippingData.city && shippingData.phone);
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  const placeOrder = async () => {
    setBusy(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOrderPlaced(true);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const currentStepNum = STEPS[currentStepIndex].number;

  // Success State
  if (orderPlaced) {
    return (
      <main className="min-h-screen text-white">
        <div className="container-ehb py-12 space-y-6">
          <div className="max-w-2xl mx-auto glass-card rounded-3xl border border-white/10 p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#38C878] to-[#2BBFA0] flex items-center justify-center text-2xl">
              ✓
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold gradient-text">Order Confirmed!</h1>
              <p className="text-ehb-textMuted text-sm">
                Order #ORD-2026041900123 has been successfully placed.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ehb-textMuted text-sm">Order Total</span>
                <span className="text-white font-semibold">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ehb-textMuted text-sm">Delivery Address</span>
                <span className="text-white font-semibold text-right">{shippingData.city}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ehb-textMuted text-sm">Estimated Delivery</span>
                <span className="text-white font-semibold">
                  {deliveryOption === "standard"
                    ? "3-5 days"
                    : deliveryOption === "express"
                      ? "1-2 days"
                      : "Today"}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-ehb-textMuted leading-relaxed">
              A confirmation email has been sent to your registered email. You can track your order from the Orders page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/orders"
                className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
              >
                View Orders →
              </Link>
              <Link
                href="/gosellr"
                className="flex-1 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Checkout</p>
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text mt-2">
              Step {currentStepNum} of {STEPS.length}
            </h1>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => idx < currentStepIndex && setCurrentStep(step.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                  style={{
                    backgroundColor:
                      idx < currentStepIndex
                        ? "#38C878"
                        : idx === currentStepIndex
                          ? "#7B6EF6"
                          : "rgba(255,255,255,0.1)",
                    color: idx <= currentStepIndex ? "white" : "rgba(255,255,255,0.5)",
                    cursor: idx < currentStepIndex ? "pointer" : "default",
                  }}
                >
                  {idx < currentStepIndex ? "✓" : step.number}
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor: idx < currentStepIndex ? "#38C878" : "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-ehb-textMuted focus:border-[#7B6EF6] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-ehb-textMuted focus:border-[#7B6EF6] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        placeholder="Karachi"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-ehb-textMuted focus:border-[#7B6EF6] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-ehb-textMuted focus:border-[#7B6EF6] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Step */}
            {currentStep === "delivery" && (
              <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Delivery Options</h2>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className="block p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: deliveryOption === option.id ? "#7B6EF6" : "rgba(255,255,255,0.1)",
                        backgroundColor: deliveryOption === option.id ? "rgba(123,110,246,0.08)" : "transparent",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {option.icon} {option.label}
                          </p>
                          <p className="text-[11px] text-ehb-textMuted mt-1">{option.days}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">
                            {option.cost === 0 ? "Free" : `+$${option.cost.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className="block p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: paymentMethod === option.id ? "#2BBFA0" : "rgba(255,255,255,0.1)",
                        backgroundColor: paymentMethod === option.id ? "rgba(43,191,160,0.08)" : "transparent",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={paymentMethod === option.id}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {option.icon} {option.label}
                          </p>
                          <p className="text-[11px] text-ehb-textMuted mt-1">{option.desc}</p>
                          {option.note && (
                            <p className="text-[10px] text-[#F0A030] mt-2 font-medium">{option.note}</p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Order Review</h2>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Shipping To</p>
                    <p className="text-sm font-semibold text-white">{shippingData.fullName}</p>
                    <p className="text-[12px] text-ehb-textBody mt-1">{shippingData.address}</p>
                    <p className="text-[12px] text-ehb-textBody">{shippingData.city}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Delivery</p>
                    <p className="text-sm font-semibold text-white">
                      {deliveryOptions.find((d) => d.id === deliveryOption)?.label}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Payment</p>
                    <p className="text-sm font-semibold text-white">
                      {paymentOptions.find((p) => p.id === paymentMethod)?.label}
                    </p>
                  </div>
                </div>

                {/* Commission Breakdown */}
                <div className="rounded-2xl bg-gradient-to-br from-[#7B6EF6]/10 to-[#2BBFA0]/10 border border-white/10 p-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-3 font-semibold">
                    Commission Transparency
                  </p>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-ehb-textBody">Seller Earnings</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">${commissionBreakdown.seller.toFixed(2)}</span>
                        <span className="text-[#38C878]">(85%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ehb-textBody">Franchise Share</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">${commissionBreakdown.franchise.toFixed(2)}</span>
                        <span className="text-[#F0A030]">(10%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ehb-textBody">Platform Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">${commissionBreakdown.platform.toFixed(2)}</span>
                        <span className="text-[#7B6EF6]">(5%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex-1 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              {currentStep !== "review" ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={busy}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#F0A030] to-[#F05858] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                >
                  {busy ? "Placing Order..." : "Place Order →"}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl border border-white/10 p-5 space-y-4 sticky top-20">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Order Summary</p>

              <div className="space-y-2 pb-4 border-b border-white/10 text-sm">
                <div className="flex items-center justify-between gap-2 text-ehb-textBody">
                  <span>4 Items</span>
                  <span className="text-white font-semibold">${mockSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-ehb-textBody">
                  <span>Delivery</span>
                  <span className="text-white font-semibold">
                    {deliveryOption === "pickup" ? "Free" : `$${mockDeliveryFee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-lg">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">${finalTotal.toFixed(2)}</span>
              </div>

              <div className="rounded-xl bg-[rgba(43,191,160,0.1)] border border-[rgba(43,191,160,0.3)] p-3">
                <p className="text-[11px] text-[#2BBFA0] font-semibold mb-1">Secure Payment</p>
                <p className="text-[11px] text-ehb-textMuted">
                  Your transaction is protected by EHB‑STL wallet escrow and settlement security.
                </p>
              </div>

              <Link
                href="/cart"
                className="block text-center text-[12px] font-semibold text-[#7B6EF6] hover:text-white transition-colors"
              >
                ← Edit Cart
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
