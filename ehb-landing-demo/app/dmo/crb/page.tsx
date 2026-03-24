"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CrbType = "SKILL" | "SERVICE" | "PRODUCT" | "COMPANY";
type CrbStatus = "SUBMITTED" | "REVIEW" | "INSPECTION" | "APPROVED" | "REJECTED";

type CrbRow = {
  id: string;
  type: CrbType;
  industry: string;
  status: CrbStatus;
  notes: string | null;
  dmoTaskId: string | null;
  createdAt: string;
  applicant: { id: string; name: string; email: string; role: string };
  documents: Array<{ id: string; type: string; fileUrl: string }>;
  inspection: { id: string; status: string; score: number | null; report: string | null; inspectorId: string } | null;
  certificate: { id: string; status: string; issuedAt: string; expiryDate: string } | null;
};

function fmt(v: string) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

export default function DmoCrbPage() {
  const [rows, setRows] = useState<CrbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | CrbStatus>("ALL");
  const [type, setType] = useState<"ALL" | CrbType>("ALL");
  const [selected, setSelected] = useState<CrbRow | null>(null);
  const [assignInspectorId, setAssignInspectorId] = useState("");
  const [reportScore, setReportScore] = useState("");
  const [reportText, setReportText] = useState("");
  const [decisionNotes, setDecisionNotes] = useState("");
  const [toast, setToast] = useState<{ open: boolean; kind: "ok" | "err"; text: string }>({ open: false, kind: "ok", text: "" });

  const stats = useMemo(() => {
    const total = rows.length;
    const inInspection = rows.filter((r) => r.status === "INSPECTION").length;
    const approved = rows.filter((r) => r.status === "APPROVED").length;
    const rejected = rows.filter((r) => r.status === "REJECTED").length;
    return { total, inInspection, approved, rejected };
  }, [rows]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (status !== "ALL") qs.set("status", status);
      if (type !== "ALL") qs.set("type", type);
      if (query.trim()) qs.set("query", query.trim());
      qs.set("take", "100");
      const res = await fetch(`/api/crb/applications?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false || json?.ok === false) {
        throw new Error(json?.error?.message ?? `Failed: ${res.status}`);
      }
      const items = (json?.data?.items ?? json?.data ?? json?.items ?? []) as CrbRow[];
      setRows(items);
      if (selected) {
        const latest = items.find((x) => x.id === selected.id) ?? null;
        setSelected(latest);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load CRB applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [status, type, query]);

  async function assignInspection() {
    if (!selected || !assignInspectorId.trim()) return;
    try {
      const res = await fetch("/api/crb/assign-inspection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ applicationId: selected.id, inspectorId: assignInspectorId.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Assign failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: "Inspection assigned." });
      await load();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Assign failed" });
    }
  }

  async function submitReport() {
    if (!selected?.inspection?.id || !reportScore.trim() || !reportText.trim()) return;
    try {
      const res = await fetch("/api/crb/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          inspectionId: selected.inspection.id,
          score: Number(reportScore),
          report: reportText.trim(),
          media: [],
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Report failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: "Inspection report submitted." });
      setReportScore("");
      setReportText("");
      await load();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Report failed" });
    }
  }

  async function finalDecision(decision: "APPROVED" | "REJECTED") {
    if (!selected) return;
    try {
      const res = await fetch("/api/crb/decision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          applicationId: selected.id,
          decision,
          notes: decisionNotes.trim() ? decisionNotes.trim() : undefined,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Decision failed: ${res.status}`);
      setToast({ open: true, kind: "ok", text: decision === "APPROVED" ? "CRB approved + certificate issued." : "CRB rejected." });
      await load();
    } catch (e) {
      setToast({ open: true, kind: "err", text: e instanceof Error ? e.message : "Decision failed" });
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
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">CRB Module</p>
                  <h1 className="mt-1 text-2xl font-semibold gradient-text">Certification & Registry Board</h1>
                  <p className="mt-1 text-xs text-slate-300">Real workflow: apply -&gt; document review -&gt; inspection -&gt; decision -&gt; certificate + DMO integration.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/dmo" className="ehb-btn-secondary ehb-press">Back to DMO</Link>
                  <button type="button" onClick={() => void load()} className="ehb-btn-primary ehb-press">Refresh</button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Total</div><div className="text-2xl font-semibold">{stats.total}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">In Inspection</div><div className="text-2xl font-semibold text-amber-200">{stats.inInspection}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Approved</div><div className="text-2xl font-semibold text-emerald-200">{stats.approved}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Rejected</div><div className="text-2xl font-semibold text-rose-200">{stats.rejected}</div></div>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs">
                  <option value="ALL">All status</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="INSPECTION">INSPECTION</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs">
                  <option value="ALL">All type</option>
                  <option value="SKILL">SKILL</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="PRODUCT">PRODUCT</option>
                  <option value="COMPANY">COMPANY</option>
                </select>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name/email/industry" className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs min-w-[220px]" />
              </div>

              {loading ? <div className="text-xs text-slate-400">Loading applications...</div> : null}
              {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{error}</div> : null}

              <div className="overflow-auto rounded-xl border border-white/10">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 text-left">Applicant</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Industry</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading
                      ? rows.map((r) => (
                          <tr key={r.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(r)}>
                            <td className="px-3 py-2">
                              <div className="font-semibold">{r.applicant?.name ?? "Unknown"}</div>
                              <div className="text-[11px] text-slate-400">{r.applicant?.email ?? "-"}</div>
                            </td>
                            <td className="px-3 py-2">{r.type}</td>
                            <td className="px-3 py-2">{r.industry}</td>
                            <td className="px-3 py-2">{r.status}</td>
                            <td className="px-3 py-2 text-slate-400">{fmt(r.createdAt)}</td>
                          </tr>
                        ))
                      : null}
                    {!loading && rows.length === 0 ? (
                      <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-400">No CRB applications found.</td></tr>
                    ) : null}
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
              <motion.section initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="absolute right-0 top-0 h-full w-full sm:w-[620px] bg-[#020c1b]/95 border-l border-white/10 backdrop-blur-xl p-4 overflow-auto space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">CRB Application Review</h2>
                  <button className="ehb-btn-secondary ehb-press" onClick={() => setSelected(null)}>Close</button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs space-y-1">
                  <div><span className="text-slate-400">Applicant:</span> {selected.applicant?.name} ({selected.applicant?.email})</div>
                  <div><span className="text-slate-400">Type:</span> {selected.type}</div>
                  <div><span className="text-slate-400">Industry:</span> {selected.industry}</div>
                  <div><span className="text-slate-400">Status:</span> {selected.status}</div>
                  <div><span className="text-slate-400">DMO Task:</span> {selected.dmoTaskId ?? "Not linked yet"}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Documents</div>
                  {selected.documents.length === 0 ? (
                    <div className="text-[11px] text-slate-400">No documents.</div>
                  ) : (
                    selected.documents.map((d) => (
                      <div key={d.id} className="rounded-lg border border-white/10 bg-black/20 p-2 text-[11px]">
                        <div className="font-semibold">{d.type}</div>
                        <a className="text-cyan-300 underline" href={d.fileUrl} target="_blank" rel="noreferrer">Open document</a>
                      </div>
                    ))
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Inspection Assignment</div>
                  <div className="text-[11px] text-slate-300">Inspector ID</div>
                  <input value={assignInspectorId} onChange={(e) => setAssignInspectorId(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs" placeholder="Enter franchise inspector userId (cuid)" />
                  <button className="ehb-btn-primary ehb-press" onClick={() => void assignInspection()}>Assign Inspection</button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Inspection Report</div>
                  <div className="text-[11px] text-slate-300">Current inspection: {selected.inspection?.id ?? "Not assigned"}</div>
                  <input value={reportScore} onChange={(e) => setReportScore(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs" placeholder="Score (0-100)" />
                  <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} className="w-full h-24 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs" placeholder="Inspection report..." />
                  <button className="ehb-btn-secondary ehb-press" onClick={() => void submitReport()} disabled={!selected.inspection}>Submit Report</button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="text-xs font-semibold">Final Decision</div>
                  <textarea value={decisionNotes} onChange={(e) => setDecisionNotes(e.target.value)} className="w-full h-20 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs" placeholder="Decision notes..." />
                  <div className="flex gap-2">
                    <button className="ehb-btn-primary ehb-press" onClick={() => void finalDecision("APPROVED")}>Approve + Issue Certificate</button>
                    <button className="ehb-btn-danger ehb-press" onClick={() => void finalDecision("REJECTED")}>Reject</button>
                  </div>
                  {selected.certificate ? (
                    <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-2 text-[11px] text-emerald-100">
                      Certificate: {selected.certificate.id} ({selected.certificate.status}) • exp {new Date(selected.certificate.expiryDate).toLocaleDateString()}
                    </div>
                  ) : null}
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

