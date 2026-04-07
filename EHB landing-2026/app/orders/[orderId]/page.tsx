"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

type EscrowTimelineItem = { title: string; at: string; note?: string };

type OrderPayload = {
  order: {
    id: string;
    status: string;
    quantity: number;
    price: number;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    product: { id: string; name: string; slug: string; price: number; imageUrl: string | null };
    buyer: { id: string; name: string; email: string };
    seller: { id: string; name: string; email: string };
  };
  viewer: {
    canExtendEscrow: boolean;
    canUpdateStatus: boolean;
    actions: { pay: boolean; markShipped: boolean; markDelivered: boolean; cancel: boolean };
  };
  escrowTimeline: EscrowTimelineItem[];
};

function orderStatusBadgeClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/20 text-amber-100 border-amber-400/35";
    case "PAID":
      return "bg-sky-500/20 text-sky-100 border-sky-400/35";
    case "SHIPPED":
      return "bg-indigo-500/20 text-indigo-100 border-indigo-400/35";
    case "DELIVERED":
      return "bg-emerald-500/20 text-emerald-100 border-emerald-400/35";
    case "CANCELLED":
      return "bg-rose-500/15 text-rose-100 border-rose-400/35";
    default:
      return "bg-white/10 text-slate-200 border-white/15";
  }
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-8 w-3/4 max-w-md rounded bg-white/15" />
        <div className="h-3 w-full max-w-sm rounded bg-white/10" />
      </div>
      <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between gap-3">
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-4 w-24 rounded bg-white/15" />
          </div>
        ))}
      </div>
      <div className="h-32 rounded-3xl bg-white/5 border border-white/10" />
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";

  const [data, setData] = useState<OrderPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [extraDays, setExtraDays] = useState(3);
  const [reason, setReason] = useState("Dispute review");
  const [extendBusy, setExtendBusy] = useState(false);
  const [extendMsg, setExtendMsg] = useState<string | null>(null);

  const [statusBusy, setStatusBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [stripeCheckout, setStripeCheckout] = useState(false);
  const [stripeReturnPending, setStripeReturnPending] = useState(false);
  const [checkoutCancelledBanner, setCheckoutCancelledBanner] = useState(false);
  const stripePollRef = useRef<number | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  const loadOrder = useCallback(async (opts?: { silent?: boolean }) => {
    if (!orderId) return;
    if (opts?.silent) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/order/${orderId}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErr(json.error?.message ?? json.message ?? "Failed to load order");
        setData(null);
        return;
      }
      setData(json.data);
      setErr(null);
    } catch {
      setErr("Network error");
      setData(null);
    } finally {
      if (opts?.silent) setRefreshing(false);
      else setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    void fetch("/api/config/payments", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { success?: boolean; data?: { stripeCheckout?: boolean } }) => {
        if (j.success && j.data?.stripeCheckout) setStripeCheckout(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setStripeReturnPending(Boolean(params.get("session_id")));
    if (params.get("cancelled") === "1") setCheckoutCancelledBanner(true);
  }, []);

  useEffect(() => {
    if (!stripeReturnPending) {
      if (stripePollRef.current) {
        clearInterval(stripePollRef.current);
        stripePollRef.current = null;
      }
      return;
    }
    if (data?.order.status && data.order.status !== "PENDING") {
      if (stripePollRef.current) {
        clearInterval(stripePollRef.current);
        stripePollRef.current = null;
      }
      return;
    }
    let n = 0;
    stripePollRef.current = window.setInterval(() => {
      n += 1;
      void loadOrder({ silent: true });
      if (n >= 25 && stripePollRef.current) {
        clearInterval(stripePollRef.current);
        stripePollRef.current = null;
      }
    }, 2000);
    return () => {
      if (stripePollRef.current) {
        clearInterval(stripePollRef.current);
        stripePollRef.current = null;
      }
    };
  }, [stripeReturnPending, data?.order.status, loadOrder]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!data || data.order.status !== "PAID") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("session_id")) return;
    url.searchParams.delete("session_id");
    const next = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "");
    window.history.replaceState({}, "", next);
    setStripeReturnPending(false);
  }, [data?.order.status, data?.order.id]);

  const dismissCancelBanner = () => {
    setCheckoutCancelledBanner(false);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("cancelled");
    const next = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "");
    window.history.replaceState({}, "", next);
  };

  const extendEscrow = async () => {
    setExtendMsg(null);
    setExtendBusy(true);
    try {
      const res = await fetch("/api/gosellr/escrow/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, extraDays, reason: reason || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setExtendMsg(json.error?.message ?? "Extend failed");
        setExtendBusy(false);
        return;
      }
      setExtendMsg(`Extended. Next release: ${new Date(json.data.nextRelease).toLocaleString()}`);
      await loadOrder({ silent: true });
    } catch {
      setExtendMsg("Network error");
    } finally {
      setExtendBusy(false);
    }
  };

  const payNow = async () => {
    setStatusMsg(null);
    setPayBusy(true);
    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `pay-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const res = await fetch(`/api/marketplace/order/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMsg(json.error?.message ?? "Payment failed");
        setPayBusy(false);
        return;
      }
      const d = json.data as {
        paymentMode?: string;
        checkoutUrl?: string;
        order?: OrderPayload["order"];
        viewer?: OrderPayload["viewer"];
        escrowTimeline?: OrderPayload["escrowTimeline"];
      };
      if (d.paymentMode === "stripe" && d.checkoutUrl) {
        window.location.assign(d.checkoutUrl);
        return;
      }
      if (d.paymentMode === "demo" && d.order && d.viewer && d.escrowTimeline) {
        setData({
          order: d.order,
          viewer: d.viewer,
          escrowTimeline: d.escrowTimeline,
        });
      }
    } catch {
      setStatusMsg("Network error");
    } finally {
      setPayBusy(false);
    }
  };

  const patchStatus = async (status: "SHIPPED" | "DELIVERED" | "CANCELLED") => {
    setStatusMsg(null);
    setStatusBusy(true);
    try {
      const body: Record<string, unknown> = { status };
      if (status === "SHIPPED" && trackingInput.trim()) {
        body.trackingNumber = trackingInput.trim();
      }
      const res = await fetch(`/api/marketplace/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatusMsg(json.error?.message ?? "Update failed");
        setStatusBusy(false);
        return;
      }
      setData(json.data);
    } catch {
      setStatusMsg("Network error");
    } finally {
      setStatusBusy(false);
    }
  };

  if (!orderId) {
    return (
      <main className="min-h-screen text-slate-100 container-ehb py-10">
        <p className="text-ehb-textMuted">Invalid order.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6 max-w-2xl">
        <div className="flex flex-wrap gap-2">
          <Link href="/orders" className="text-sm text-cyan-300 hover:underline">
            ← Orders
          </Link>
          <span className="text-slate-600">·</span>
          <Link href="/cart" className="text-sm text-ehb-textMuted hover:text-white">
            Cart
          </Link>
        </div>

        {loading ? (
          <OrderDetailSkeleton />
        ) : err ? (
          <div className="glass-panel rounded-2xl border border-rose-500/30 p-5 text-rose-200">{err}</div>
        ) : data ? (
          <div className="space-y-6">
            {refreshing ? (
              <p className="text-[11px] text-cyan-400/90 flex items-center gap-1.5" role="status">
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
                Updating…
              </p>
            ) : null}

            <header>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Marketplace order</p>
              <h1 className="text-2xl font-semibold text-white mt-1">{data.order.product.name}</h1>
              <p className="text-xs font-mono text-slate-500 mt-2 break-all">{data.order.id}</p>
            </header>

            {checkoutCancelledBanner ? (
              <div className="rounded-2xl border border-slate-500/35 bg-slate-800/50 px-4 py-3 flex flex-wrap items-start justify-between gap-3">
                <p className="text-[13px] text-slate-200">
                  Checkout was cancelled — you can pay again when ready.
                </p>
                <button
                  type="button"
                  onClick={dismissCancelBanner}
                  className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            ) : null}

            {stripeReturnPending && data.order.status === "PENDING" ? (
              <div
                className="rounded-2xl border border-amber-400/35 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-100 flex gap-3 items-start"
                role="status"
              >
                <Loader2 className="h-4 w-4 animate-spin shrink-0 mt-0.5 text-amber-300" aria-hidden />
                <p>
                  Confirming Stripe payment… this page refreshes in the background until the order shows{" "}
                  <span className="font-semibold text-white">PAID</span> (webhook received).
                </p>
              </div>
            ) : null}

            <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3 items-center">
                <span className="text-ehb-textMuted">Status</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${orderStatusBadgeClass(data.order.status)}`}
                >
                  {data.order.status}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ehb-textMuted">Qty × unit</span>
                <span className="text-white">
                  {data.order.quantity} × ${data.order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ehb-textMuted">Buyer</span>
                <span className="text-slate-200">{data.order.buyer.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ehb-textMuted">Seller</span>
                <span className="text-slate-200">{data.order.seller.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ehb-textMuted">Created</span>
                <span className="text-ehb-textBody">{new Date(data.order.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="glass-panel rounded-3xl border border-cyan-500/15 bg-cyan-500/[0.03] p-5 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">Escrow timeline</p>
              {data.escrowTimeline.length === 0 ? (
                <p className="text-[13px] text-slate-500">No escrow milestones yet.</p>
              ) : (
                <ol className="space-y-3 border-l border-white/10 ml-2 pl-4">
                  {data.escrowTimeline.map((step, i) => (
                    <li key={`${step.title}-${step.at}-${i}`} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-cyan-400/80" />
                      <p className="text-sm text-white font-medium">{step.title}</p>
                      <p className="text-[11px] text-slate-500">{new Date(step.at).toLocaleString()}</p>
                      {step.note ? <p className="text-[12px] text-ehb-textMuted mt-1">{step.note}</p> : null}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {data.viewer.actions.pay ? (
              <div className="rounded-3xl border border-sky-500/25 bg-sky-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-sky-100">Payment</p>
                <p className="text-[12px] text-ehb-textMuted">
                  {stripeCheckout ? (
                    <>
                      Opens <span className="text-white">Stripe Checkout</span> when configured server-side; otherwise
                      instant <span className="text-white">demo wallet</span> capture to PAID.
                    </>
                  ) : (
                    <>
                      Demo wallet capture — moves order to <span className="text-white">PAID</span> so the seller can
                      ship. Set <code className="text-cyan-200/90">STRIPE_SECRET_KEY</code> for real Checkout.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  disabled={payBusy}
                  onClick={payNow}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500/25 border border-sky-400/40 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/35 disabled:opacity-50 min-w-[10rem]"
                >
                  {payBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Processing…
                    </>
                  ) : stripeCheckout ? (
                    "Pay with Stripe"
                  ) : (
                    "Pay with demo wallet"
                  )}
                </button>
              </div>
            ) : null}

            {(data.viewer.actions.markShipped ||
              data.viewer.actions.markDelivered ||
              data.viewer.actions.cancel) && (
              <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
                  Fulfillment
                  {statusBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-300/80" aria-hidden />
                  ) : null}
                </p>
                <p className="text-[12px] text-ehb-textMuted">
                  After payment, seller ships then delivers. Buyers can cancel while pending or paid. Uses{" "}
                  <code className="text-cyan-200/90">PATCH /api/marketplace/order/[id]</code>.
                </p>
                {data.viewer.actions.markShipped ? (
                  <label className="block text-[12px] text-ehb-textMuted">
                    Tracking (optional when marking shipped)
                    <input
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white text-sm"
                      placeholder="Carrier / tracking ID"
                      maxLength={120}
                    />
                  </label>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {data.viewer.actions.markShipped ? (
                    <button
                      type="button"
                      disabled={statusBusy}
                      onClick={() => patchStatus("SHIPPED")}
                      className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-50"
                    >
                      Mark shipped
                    </button>
                  ) : null}
                  {data.viewer.actions.markDelivered ? (
                    <button
                      type="button"
                      disabled={statusBusy}
                      onClick={() => patchStatus("DELIVERED")}
                      className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/30 disabled:opacity-50"
                    >
                      Mark delivered
                    </button>
                  ) : null}
                  {data.viewer.actions.cancel ? (
                    <button
                      type="button"
                      disabled={statusBusy}
                      onClick={() => patchStatus("CANCELLED")}
                      className="rounded-full bg-rose-500/15 border border-rose-400/35 px-4 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/25 disabled:opacity-50"
                    >
                      Cancel order
                    </button>
                  ) : null}
                </div>
                {statusMsg ? <p className="text-[12px] text-rose-300">{statusMsg}</p> : null}
              </div>
            )}

            <details className="glass-panel rounded-3xl border border-white/10 p-5">
              <summary className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted cursor-pointer">
                Raw metadata (debug)
              </summary>
              <pre className="text-[11px] text-slate-500 mt-3 overflow-x-auto whitespace-pre-wrap break-all">
                {data.order.metadata ? JSON.stringify(data.order.metadata, null, 2) : "— none —"}
              </pre>
            </details>

            {data.viewer.canExtendEscrow ? (
              <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-amber-100">Extend escrow (DMO / admin)</p>
                <p className="text-[12px] text-ehb-textMuted">
                  Calls <code className="text-cyan-200/90">POST /api/gosellr/escrow/extend</code>. Requires franchise or
                  admin session in production.
                </p>
                <div className="flex flex-wrap gap-3 items-end">
                  <label className="text-[12px] text-ehb-textMuted">
                    Extra days
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={extraDays}
                      onChange={(e) => setExtraDays(Number(e.target.value) || 1)}
                      className="mt-1 block w-24 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white"
                    />
                  </label>
                  <label className="flex-1 min-w-[200px] text-[12px] text-ehb-textMuted">
                    Reason
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white text-sm"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={extendBusy}
                  onClick={extendEscrow}
                  className="rounded-full bg-amber-500/20 border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-500/30 disabled:opacity-50"
                >
                  {extendBusy ? "Extending…" : "Extend escrow hold"}
                </button>
                {extendMsg ? <p className="text-[12px] text-emerald-300">{extendMsg}</p> : null}
              </div>
            ) : (
              <p className="text-[12px] text-slate-500">
                Escrow extension is available to franchise and admin operators when logged in with the right role.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
