"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type BookingStatus = "NEW" | "IN_REVIEW" | "UNDER_INSPECTION" | "APPROVED" | "REJECTED";

type BookingRow = {
  id: string;
  applicant: { id?: string; name: string; email: string };
  provider: { id?: string; name: string; serviceName: string };
  quantity: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo: { id: string; name: string } | null;
  notes: string | null;
  scheduledFor: string | null;
};

type BookingListResp = {
  success: true;
  data: { items: BookingRow[]; total: number; take: number; skip: number };
};

export default function FranchiseBookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"ALL" | BookingStatus>("ALL");
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      params.set("take", "100");
      const res = await fetch(`/api/franchise/bookings?${params.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as BookingListResp | { error?: { message?: string }; success?: false };
      if (!res.ok || "success" in json && json.success === false) {
        throw new Error((json as any)?.error?.message ?? "Failed to load bookings");
      }
      setRows((json as BookingListResp).data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      fresh: rows.filter((item) => item.status === "NEW").length,
      active: rows.filter((item) => item.status === "IN_REVIEW" || item.status === "UNDER_INSPECTION").length,
      completed: rows.filter((item) => item.status === "APPROVED").length,
    };
  }, [rows]);

  function openRow(row: BookingRow) {
    setSelected(row);
    setNotes(row.notes ?? "");
    setScheduledFor(row.scheduledFor ? row.scheduledFor.slice(0, 16) : "");
  }

  async function updateBooking(payload: {
    status?: BookingStatus;
    assignToMe?: boolean;
  }) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/franchise/bookings/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          notes,
          scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to update booking");
      setSelected(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Franchise Booking Desk</p>
          <h1 className="mt-1 text-2xl font-semibold gradient-text">Service Booking Queue</h1>
          <p className="mt-1 text-sm text-ehb-textBody">
            Claim, schedule, review, and resolve marketplace service orders from this queue.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Total</div><div className="mt-2 text-2xl font-semibold">{stats.total}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">New</div><div className="mt-2 text-2xl font-semibold text-violet-200">{stats.fresh}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Active</div><div className="mt-2 text-2xl font-semibold text-cyan-200">{stats.active}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Approved</div><div className="mt-2 text-2xl font-semibold text-emerald-200">{stats.completed}</div></div>
        </section>

        <section className="ehb-card-elevated space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "ALL" | BookingStatus)}
              className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs"
            >
              <option value="ALL">All status</option>
              <option value="NEW">NEW</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="UNDER_INSPECTION">UNDER_INSPECTION</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button type="button" onClick={() => void load()} className="ehb-btn-secondary ehb-press">
              Refresh
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">
              {error}
            </div>
          ) : null}

          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-ehb-textBody">
                <tr>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Provider</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Assigned</th>
                  <th className="px-3 py-2 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => openRow(row)}
                  >
                    <td className="px-3 py-2">
                      <div className="font-semibold text-white">{row.applicant.name}</div>
                      <div className="text-[11px] text-ehb-textMuted">{row.applicant.email}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-white">{row.provider.name}</div>
                      <div className="text-[11px] text-ehb-textMuted">{row.provider.serviceName}</div>
                    </td>
                    <td className="px-3 py-2">{row.quantity}</td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">{row.assignedTo?.name ?? "Unassigned"}</td>
                    <td className="px-3 py-2 text-ehb-textMuted">{new Date(row.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-ehb-textMuted">
                      No booking requests found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        {selected ? (
          <section className="ehb-card-elevated space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-white">Booking #{selected.id}</div>
                <div className="text-xs text-ehb-textMuted">
                  {selected.provider.serviceName} · {selected.provider.name}
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="ehb-btn-secondary ehb-press">
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 text-xs text-ehb-textBody">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div>Customer: {selected.applicant.name}</div>
                <div className="mt-1 text-ehb-textMuted">{selected.applicant.email}</div>
                <div className="mt-1">Quantity: {selected.quantity}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div>Status: {selected.status}</div>
                <div className="mt-1">Assigned: {selected.assignedTo?.name ?? "Unassigned"}</div>
                <div className="mt-1">Created: {new Date(selected.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs text-ehb-textBody">Booking Notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-[120px] rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm"
                placeholder="Add handling notes, customer coordination, operator remarks..."
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-ehb-textBody">Scheduled Visit</span>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void updateBooking({ assignToMe: true, status: "IN_REVIEW" })}
                disabled={saving}
                className="ehb-btn-primary ehb-press disabled:opacity-60"
              >
                Claim & Review
              </button>
              <button
                type="button"
                onClick={() => void updateBooking({ status: "UNDER_INSPECTION" })}
                disabled={saving}
                className="ehb-btn-secondary ehb-press disabled:opacity-60"
              >
                Send to Inspection
              </button>
              <button
                type="button"
                onClick={() => void updateBooking({ status: "APPROVED" })}
                disabled={saving}
                className="ehb-btn-secondary ehb-press disabled:opacity-60"
              >
                Approve Booking
              </button>
              <button
                type="button"
                onClick={() => void updateBooking({ status: "REJECTED" })}
                disabled={saving}
                className="ehb-btn-danger ehb-press disabled:opacity-60"
              >
                Reject Booking
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
