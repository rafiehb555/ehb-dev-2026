"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Industry = { id: string; name: string; description: string | null; slug?: string };
type Verification = {
  id: string;
  entityType: "SERVICE" | "PRODUCT" | "COMPANY";
  entityId: string;
  industryId: string;
  industry: Industry;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
  score: number | null;
  weight: number;
  expiryDate: string | null;
  issuedAt: string | null;
  dmoTaskId: string | null;
  updatedAt: string;
};

function fmt(v: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

export default function DmoIndustryPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"SERVICE" | "PRODUCT" | "COMPANY">("COMPANY");
  const [entityId, setEntityId] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [weight, setWeight] = useState("1");
  const [status, setStatus] = useState<"ALL" | Verification["status"]>("ALL");
  const [selected, setSelected] = useState<Verification | null>(null);
  const [decisionScore, setDecisionScore] = useState("");
  const [attachIds, setAttachIds] = useState("");
  const [toast, setToast] = useState<{ open: boolean; kind: "ok" | "err"; text: string }>({ open: false, kind: "ok", text: "" });

  const stats = useMemo(() => {
    const total = verifications.length;
    const verified = verifications.filter((v) => v.status === "VERIFIED").length;
    const pending = verifications.filter((v) => v.status === "PENDING").length;
    const avgScore = verified > 0 ? Math.round(verifications.filter((v) => v.status === "VERIFIED").reduce((s, v) => s + (v.score ?? 0), 0) / verified) : 0;
    return { total, verified, pending, avgScore };
  }, [verifications]);

  const loadIndustries = useCallback(async () => {
    const res = await fetch("/api/industries?take=64&skip=0", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Industries load failed");
    const items = (json?.data?.items ?? []) as Industry[];
    setIndustries(items);
    setIndustryId((prev) => prev || (items[0]?.id ?? ""));
  }, []);

  const loadVerifications = useCallback(async () => {
    const qs = new URLSearchParams();
    qs.set("take", "100");
    if (status !== "ALL") qs.set("status", status);
    const res = await fetch(`/api/industry/verifications?${qs.toString()}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Verifications load failed");
    setVerifications((json?.data?.items ?? []) as Verification[]);
  }, [status]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadIndustries(), loadVerifications()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load industry data");
    } finally {
      setLoading(false);
    }
  }, [loadIndustries, loadVerifications]);

  useEffect(() => {
    void load();
  }, [load]);

  async function requestVerification() {
    if (!entityId.trim() || !industryId) return;
    try {
      const res = await fetch("/api/industry/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "REQUEST",
          entityType,
          entityId: entityId.trim(),
          industryId,
          weight: Number(weight),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Request failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: "Industry verification requested and DMO task created." });
      await loadVerifications();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Request failed" });
    }
  }

  async function decide(status: "VERIFIED" | "REJECTED") {
    if (!selected) return;
    try {
      const res = await fetch("/api/industry/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "DECISION",
          verificationId: selected.id,
          status,
          score: decisionScore.trim() ? Number(decisionScore) : undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Decision failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: status === "VERIFIED" ? "Verification approved." : "Verification rejected." });
      setDecisionScore("");
      await loadVerifications();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Decision failed" });
    }
  }

  async function attachIndustries() {
    if (!entityId.trim() || !attachIds.trim()) return;
    const ids = attachIds.split(",").map((x) => x.trim()).filter(Boolean);
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/industry/attach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId: entityId.trim(),
          industryIds: ids,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Attach failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: "Entity industries mapping updated." });
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Attach failed" });
    }
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6">
        <div className="space-y-4">
          <section className="space-y-4">
            <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Industry Module</p>
                  <h1 className="mt-1 text-2xl font-semibold gradient-text">Multi-Industry Verification</h1>
                  <p className="mt-1 text-xs text-ehb-textBody">Global trust layer: verify entity across multiple sectors with weighted score impact.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/dmo" className="ehb-btn-secondary ehb-press">Back to DMO</Link>
                  <button type="button" onClick={() => void load()} className="ehb-btn-primary ehb-press">Refresh</button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Verifications</div><div className="text-2xl font-semibold">{stats.total}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Verified</div><div className="text-2xl font-semibold text-emerald-200">{stats.verified}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Pending</div><div className="text-2xl font-semibold text-amber-200">{stats.pending}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Avg Score</div><div className="text-2xl font-semibold text-cyan-200">{stats.avgScore}</div></div>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">Request Industry Verification</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <select value={entityType} onChange={(e) => setEntityType(e.target.value as any)} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody">
                  <option value="COMPANY">COMPANY</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="PRODUCT">PRODUCT</option>
                </select>
                <input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="Entity ID (cuid)" className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody placeholder:text-ehb-textMuted" />
                <select value={industryId} onChange={(e) => setIndustryId(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody">
                  {industries.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.slug ? `${i.name} (${i.slug})` : i.name}
                    </option>
                  ))}
                </select>
                <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (0.1 - 5)" className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody placeholder:text-ehb-textMuted" />
              </div>
              {(() => {
                const sel = industries.find((i) => i.id === industryId);
                if (!sel?.slug) return null;
                return (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-cyan-200/90">
                    <span className="text-ehb-textMuted">EHB surfaces:</span>
                    <Link className="hover:underline" href={`/landing/${sel.slug}`}>
                      Landing
                    </Link>
                    <span className="text-slate-600">·</span>
                    <Link className="hover:underline" href={`/industry/${sel.slug}`}>
                      Industry home
                    </Link>
                    <span className="text-slate-600">·</span>
                    <Link className="hover:underline" href={`/ai-marketplace?industry=${sel.slug}`}>
                      AI marketplace
                    </Link>
                  </div>
                );
              })()}
              <div className="flex gap-2">
                <button className="ehb-btn-primary ehb-press" onClick={() => void requestVerification()}>Request Verification</button>
              </div>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">Entity Mapping (Multi-Industry)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="Entity ID (cuid)" className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody placeholder:text-ehb-textMuted" />
                <input value={attachIds} onChange={(e) => setAttachIds(e.target.value)} placeholder="Industry IDs comma-separated" className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody placeholder:text-ehb-textMuted" />
              </div>
              <button className="ehb-btn-secondary ehb-press" onClick={() => void attachIndustries()}>Update Mapping</button>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold">Verification Queue</div>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-xl bg-white/5 border border-white/15 px-2 py-1 text-[11px] text-ehb-textBody">
                  <option value="ALL">All</option>
                  <option value="PENDING">PENDING</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>
              {loading ? <div className="text-xs text-ehb-textMuted">Loading queue...</div> : null}
              {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{error}</div> : null}
              <div className="overflow-auto rounded-xl border border-white/10">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/5 text-ehb-textBody">
                    <tr>
                      <th className="px-3 py-2 text-left">Industry</th>
                      <th className="px-3 py-2 text-left">Entity</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Weight</th>
                      <th className="px-3 py-2 text-left">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? verifications.map((v) => (
                      <tr key={v.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(v)}>
                        <td className="px-3 py-2">{v.industry?.name ?? v.industryId}</td>
                        <td className="px-3 py-2"><div>{v.entityType}</div><div className="text-[11px] text-ehb-textMuted">{v.entityId}</div></td>
                        <td className="px-3 py-2">{v.status}</td>
                        <td className="px-3 py-2">{v.score ?? "—"}</td>
                        <td className="px-3 py-2">{Number(v.weight).toFixed(2)}</td>
                        <td className="px-3 py-2 text-ehb-textMuted">{fmt(v.updatedAt)}</td>
                      </tr>
                    )) : null}
                    {!loading && verifications.length === 0 ? <tr><td colSpan={6} className="px-3 py-8 text-center text-ehb-textMuted">No industry verifications found.</td></tr> : null}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>

        <AnimatePresence>
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70]">
              <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
              <motion.section initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-[#020c1b]/95 border-l border-white/10 backdrop-blur-xl p-4 overflow-auto space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Industry Verification Decision</h2>
                  <button className="ehb-btn-secondary ehb-press" onClick={() => setSelected(null)}>Close</button>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs space-y-1">
                  <div><span className="text-ehb-textMuted">Industry:</span> {selected.industry?.name ?? selected.industryId}</div>
                  <div><span className="text-ehb-textMuted">Entity:</span> {selected.entityType} / {selected.entityId}</div>
                  <div><span className="text-ehb-textMuted">Current Status:</span> {selected.status}</div>
                  <div><span className="text-ehb-textMuted">DMO Task:</span> {selected.dmoTaskId ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Decision Score</div>
                  <input value={decisionScore} onChange={(e) => setDecisionScore(e.target.value)} placeholder="0 - 100 (optional)" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-ehb-textBody placeholder:text-ehb-textMuted" />
                  <div className="flex gap-2">
                    <button className="ehb-btn-primary ehb-press" onClick={() => void decide("VERIFIED")}>Approve (Verified)</button>
                    <button className="ehb-btn-danger ehb-press" onClick={() => void decide("REJECTED")}>Reject</button>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {toast.open ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={`fixed bottom-6 right-6 z-[80] rounded-xl border px-4 py-3 text-xs ${toast.kind === "ok" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" : "border-rose-400/40 bg-rose-500/10 text-rose-100"}`}>
              <div className="font-semibold">{toast.kind === "ok" ? "Success" : "Error"}</div>
              <div>{toast.text}</div>
              <button className="mt-2 underline" onClick={() => setToast((t) => ({ ...t, open: false }))}>Close</button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

