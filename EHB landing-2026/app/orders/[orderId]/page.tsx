"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    actions: { markShipped: boolean; markDelivered: boolean; cancel: boolean };
  };
  escrowTimeline: EscrowTimelineItem[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";

  const [data, setData] = useState<OrderPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [extraDays, setExtraDays] = useState(3);
  const [reason, setReason] = useState("Dispute review");
  const [extendBusy, setExtendBusy] = useState(false);
  const [extendMsg, setExtendMsg] = useState<string | null>(null);

  const [statusBusy, setStatusBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
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
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

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
      await loadOrder();
    } catch {
      setExtendMsg("Network error");
    } finally {
      setExtendBusy(false);
    }
  };

  const patchStatus = async (status: "SHIPPED" | "DELIVERED" | "CANCELLED") => {
    setStatusMsg(null);
    setStatusBusy(true);
    try {
      const res = await fetch(`/api/marketplace/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
        <p className="text-slate-400">Invalid order.</p>
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
          <Link href="/cart" className="text-sm text-slate-400 hover:text-white">
            Cart
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading order…</p>
        ) : err ? (
          <div className="glass-panel rounded-2xl border border-rose-500/30 p-5 text-rose-200">{err}</div>
        ) : data ? (
          <div className="space-y-6">
            <header>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Marketplace order</p>
              <h1 className="text-2xl font-semibold text-white mt-1">{data.order.product.name}</h1>
              <p className="text-xs font-mono text-slate-500 mt-2 break-all">{data.order.id}</p>
            </header>

            <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Status</span>
                <span className="text-white font-semibold">{data.order.status}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Qty × unit</span>
                <span className="text-white">
                  {data.order.quantity} × ${data.order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Buyer</span>
                <span className="text-slate-200">{data.order.buyer.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Seller</span>
                <span className="text-slate-200">{data.order.seller.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-300">{new Date(data.order.createdAt).toLocaleString()}</span>
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
                      {step.note ? <p className="text-[12px] text-slate-400 mt-1">{step.note}</p> : null}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {(data.viewer.actions.markShipped ||
              data.viewer.actions.markDelivered ||
              data.viewer.actions.cancel) && (
              <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-emerald-100">Fulfillment</p>
                <p className="text-[12px] text-slate-400">
                  Sellers update shipping; buyers can cancel while pending. Uses{" "}
                  <code className="text-cyan-200/90">PATCH /api/marketplace/order/[id]</code>.
                </p>
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
              <summary className="text-[11px] uppercase tracking-[0.22em] text-slate-400 cursor-pointer">
                Raw metadata (debug)
              </summary>
              <pre className="text-[11px] text-slate-500 mt-3 overflow-x-auto whitespace-pre-wrap break-all">
                {data.order.metadata ? JSON.stringify(data.order.metadata, null, 2) : "— none —"}
              </pre>
            </details>

            {data.viewer.canExtendEscrow ? (
              <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-amber-100">Extend escrow (DMO / admin)</p>
                <p className="text-[12px] text-slate-400">
                  Calls <code className="text-cyan-200/90">POST /api/gosellr/escrow/extend</code>. Requires franchise or
                  admin session in production.
                </p>
                <div className="flex flex-wrap gap-3 items-end">
                  <label className="text-[12px] text-slate-400">
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
                  <label className="flex-1 min-w-[200px] text-[12px] text-slate-400">
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
