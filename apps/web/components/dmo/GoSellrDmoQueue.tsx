"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  DMO Review Queue — GoSellr Seller Onboarding
 *  Admin dashboard consuming:
 *    GET  /api/gosellr/dmo/queue
 *    POST /api/gosellr/dmo/approve
 *    POST /api/gosellr/franchise/assign (manual override)
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  status: string;
  priority: string;
  riskScore: number | null;
  riskLevel: string | null;
  createdAt: string;
  applicant: { id: string; email: string };
  storeName: string | null;
  category: string | null;
  country: string | null;
  onboardingState: string | null;
  franchiseName: string | null;
};

type QueueResponse = {
  total: number;
  statusCounts: Record<string, number>;
  rows: Row[];
};

const FILTERS = [
  { key: "PENDING", label: "Pending",     statuses: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] },
  { key: "NEW",     label: "New",         statuses: ["NEW"] },
  { key: "IN_REVIEW", label: "In Review", statuses: ["IN_REVIEW"] },
  { key: "APPROVED", label: "Approved",   statuses: ["APPROVED"] },
  { key: "REJECTED", label: "Rejected",   statuses: ["REJECTED"] },
] as const;

export function GoSellrDmoQueue() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("PENDING");
  const [data, setData] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs =
        filter === "PENDING"
          ? ""
          : `?status=${encodeURIComponent(filter)}`;
      const res = await fetch(`/api/gosellr/dmo/queue${qs}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const decide = async (app: Row, decision: "APPROVED" | "REJECTED" | "IN_REVIEW") => {
    setBusyId(app.id);
    setToast(null);
    try {
      const res = await fetch("/api/gosellr/dmo/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          decision,
          notes: notes || undefined,
          autoAssignFranchise: decision === "APPROVED",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message ?? "Failed");
      const franchiseAttached = json.data?.franchiseLink ? " + Franchise auto-assigned" : "";
      setToast({
        kind: "ok",
        msg: `Application ${decision.toLowerCase()}${decision === "APPROVED" ? franchiseAttached : ""}.`,
      });
      setSelected(null);
      setNotes("");
      await load();
    } catch (e: any) {
      setToast({ kind: "err", msg: e?.message ?? "Decision failed" });
    } finally {
      setBusyId(null);
    }
  };

  const counts = data?.statusCounts ?? {};
  const pendingCount =
    (counts.NEW ?? 0) + (counts.IN_REVIEW ?? 0) + (counts.UNDER_INSPECTION ?? 0);

  const filterBadge = useMemo(() => (key: string) => {
    if (key === "PENDING") return pendingCount;
    return counts[key] ?? 0;
  }, [counts, pendingCount]);

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(19,22,42,0.95) 100%)",
          border: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              DMO Control Center
            </div>
            <h1 className="mt-0.5 text-2xl font-bold text-white">GoSellr Seller Review Queue</h1>
            <p className="mt-1 text-sm text-white/55">
              Approve, reject, or send back applications. Approval auto-assigns a franchise by country.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#F59E0B]">{pendingCount}</div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Pending</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const badge = filterBadge(f.key);
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(41,171,226,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(41,171,226,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: active ? "#29ABE2" : "rgba(255,255,255,0.7)",
                boxShadow: active ? "0 0 12px rgba(41,171,226,0.25)" : "none",
              }}
            >
              {f.label}
              {badge > 0 && (
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(41,171,226,0.3)" : "rgba(255,255,255,0.06)",
                    color: active ? "#29ABE2" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className="rounded-lg px-4 py-2.5 text-sm"
          style={{
            background: toast.kind === "ok" ? "rgba(34,177,76,0.12)" : "rgba(240,88,88,0.12)",
            border: `1px solid ${toast.kind === "ok" ? "rgba(34,177,76,0.35)" : "rgba(240,88,88,0.35)"}`,
            color: toast.kind === "ok" ? "#22B14C" : "#F05858",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* TABLE */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {loading && !data ? (
          <div className="p-10 text-center text-white/50">Loading queue…</div>
        ) : !data || data.rows.length === 0 ? (
          <div className="p-10 text-center text-white/50">No applications in this view.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="text-[11px] uppercase tracking-wider text-white/40"
                style={{ background: "rgba(26,29,51,0.6)" }}
              >
                <tr>
                  <Th>Store</Th>
                  <Th>Applicant</Th>
                  <Th>Category</Th>
                  <Th>Country</Th>
                  <Th>Risk</Th>
                  <Th>Status</Th>
                  <Th>Franchise</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/5 transition-colors hover:bg-white/3">
                    <Td>
                      <div className="font-semibold text-white">{r.storeName ?? "—"}</div>
                      <div className="text-[11px] text-white/40">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </Td>
                    <Td className="text-white/80">{r.applicant?.email ?? r.applicant?.id?.slice(-6)}</Td>
                    <Td className="text-white/70">{r.category ?? "—"}</Td>
                    <Td className="text-white/70">{r.country ?? "—"}</Td>
                    <Td>
                      <RiskChip level={r.riskLevel} score={r.riskScore} />
                    </Td>
                    <Td>
                      <StatusChip status={r.status} />
                    </Td>
                    <Td className="text-white/70">
                      {r.franchiseName ? (
                        <span className="inline-flex items-center gap-1 text-[12px]">
                          <span style={{ color: "#22B14C" }}>●</span> {r.franchiseName}
                        </span>
                      ) : (
                        <span className="text-white/35">—</span>
                      )}
                    </Td>
                    <Td>
                      <button
                        onClick={() => { setSelected(r); setNotes(""); }}
                        disabled={busyId === r.id}
                        className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5"
                        style={{
                          background: "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)",
                          boxShadow: "0 2px 8px rgba(41,171,226,0.25)",
                        }}
                      >
                        Review →
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(4,6,12,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(19,22,42,0.98) 0%, rgba(26,29,51,0.98) 100%)",
              border: "1px solid rgba(41,171,226,0.25)",
              boxShadow: "0 0 60px rgba(41,171,226,0.2)",
            }}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
                  Application · {selected.id.slice(-8)}
                </div>
                <h2 className="mt-0.5 text-lg font-bold text-white">{selected.storeName ?? "Unnamed Store"}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <div className="grid gap-3 px-5 py-5 text-sm">
              <Field k="Applicant" v={selected.applicant?.email ?? "—"} />
              <Field k="Category" v={selected.category ?? "—"} />
              <Field k="Country" v={selected.country ?? "—"} />
              <Field k="Risk" v={selected.riskLevel ? `${selected.riskLevel} (${selected.riskScore ?? "—"})` : "—"} />
              <Field k="Onboarding" v={selected.onboardingState ?? "—"} />
              <Field k="Franchise" v={selected.franchiseName ?? "Not assigned"} />

              <div className="mt-2">
                <div className="mb-1.5 text-[12px] font-semibold text-white/70">Notes (optional)</div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Missing tax ID; please resubmit with attachment."
                  className="min-h-[90px] w-full resize-y rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>
            <div className="flex gap-2 border-t border-white/5 px-5 py-4">
              <button
                onClick={() => decide(selected, "REJECTED")}
                disabled={busyId === selected.id}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  background: "rgba(240,88,88,0.15)",
                  border: "1px solid rgba(240,88,88,0.4)",
                  color: "#F05858",
                }}
              >
                Reject
              </button>
              <button
                onClick={() => decide(selected, "IN_REVIEW")}
                disabled={busyId === selected.id}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  color: "#F59E0B",
                }}
              >
                Needs Review
              </button>
              <button
                onClick={() => decide(selected, "APPROVED")}
                disabled={busyId === selected.id}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #22B14C 0%, #29ABE2 100%)",
                  boxShadow: "0 4px 12px rgba(34,177,76,0.3)",
                }}
              >
                {busyId === selected.id ? "Working…" : "Approve + Assign Franchise"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── primitives ───────────────────────────────────────────────────────
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border border-white/5 bg-black/20 px-3 py-2">
      <span className="text-white/50">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  );
}
function StatusChip({ status }: { status: string }) {
  const map: Record<string, { c: string; bg: string }> = {
    NEW:              { c: "#29ABE2", bg: "rgba(41,171,226,0.15)" },
    IN_REVIEW:        { c: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    UNDER_INSPECTION: { c: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    APPROVED:         { c: "#22B14C", bg: "rgba(34,177,76,0.15)" },
    REJECTED:         { c: "#E53935", bg: "rgba(229,57,53,0.15)" },
  };
  const t = map[status] ?? { c: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.05)" };
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ background: t.bg, color: t.c, border: `1px solid ${t.c}55` }}
    >
      {status}
    </span>
  );
}
function RiskChip({ level, score }: { level: string | null; score: number | null }) {
  if (!level && score == null) return <span className="text-white/35">—</span>;
  const map: Record<string, { c: string; bg: string }> = {
    low:    { c: "#22B14C", bg: "rgba(34,177,76,0.15)" },
    medium: { c: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
    high:   { c: "#E53935", bg: "rgba(229,57,53,0.15)" },
  };
  const t = map[String(level ?? "").toLowerCase()] ?? { c: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.05)" };
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[11px] font-bold"
      style={{ background: t.bg, color: t.c, border: `1px solid ${t.c}55` }}
    >
      {(level ?? "—").toUpperCase()} {score != null ? `· ${score}` : ""}
    </span>
  );
}

export default GoSellrDmoQueue;
