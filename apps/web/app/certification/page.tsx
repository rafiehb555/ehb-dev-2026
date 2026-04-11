"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CRBApplicationStatus,
  CRBApplicationType,
  CRBDocumentType,
} from "@/lib/crb/schemas";

type CRBDocument = { id: string; type: CRBDocumentType; fileUrl: string };
type CRBInspection = { id: string; status: string; score: string | number | null; updatedAt: string };
type CRBCertificate = { id: string; status: string; expiryDate: string; issuedAt: string };
type CRBApplication = {
  id: string;
  type: CRBApplicationType;
  industry: string;
  status: CRBApplicationStatus;
  notes: string | null;
  dmoTaskId: string | null;
  createdAt: string;
  documents: CRBDocument[];
  inspection: CRBInspection | null;
  certificate: CRBCertificate | null;
};

type ListResp = { ok: true; data: { items: CRBApplication[]; total: number; take: number; skip: number } };
type ApiErr = { ok: false; error: { message: string } };

const types: CRBApplicationType[] = ["SKILL", "SERVICE", "PRODUCT", "COMPANY"];
const docTypes: CRBDocumentType[] = ["ID", "LICENSE", "PORTFOLIO", "EXPERIENCE", "OTHER"];

export default function CertificationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [type, setType] = useState<CRBApplicationType>("SKILL");
  const [industry, setIndustry] = useState("IT / Software");
  const [notes, setNotes] = useState("");
  const [docs, setDocs] = useState<Array<{ type: CRBDocumentType; fileUrl: string }>>([{ type: "ID", fileUrl: "" }]);

  const [items, setItems] = useState<CRBApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const canSubmit = useMemo(() => {
    if (!industry.trim()) return false;
    const filtered = docs.filter((d) => d.fileUrl.trim().length > 0);
    return filtered.length >= 1 && filtered.every((d) => {
      try {
        new URL(d.fileUrl);
        return true;
      } catch {
        return false;
      }
    });
  }, [industry, docs]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/crb/applications?take=50&skip=0", { cache: "no-store" });
      const json = (await res.json()) as ListResp | ApiErr;
      if (!res.ok || !("ok" in json) || json.ok === false) throw new Error((json as any)?.error?.message ?? "Failed");
      setItems(json.data.items);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit() {
    setSubmitting(true);
    setErr(null);
    setSuccess(null);
    try {
      const payload = {
        type,
        industry: industry.trim(),
        notes: notes.trim() ? notes.trim() : undefined,
        documents: docs.filter((d) => d.fileUrl.trim()).map((d) => ({ type: d.type, fileUrl: d.fileUrl.trim() })),
      };
      const res = await fetch("/api/crb/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.error?.message ?? "Submit failed");
      setSuccess("Application submitted. It is now in CRB + DMO queue.");
      setDocs([{ type: "ID", fileUrl: "" }]);
      setNotes("");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">CRB Certification</h1>
          <p className="text-ehb-textMuted text-sm">
            Apply for Skill / Service / Product / Company verification. Real workflow: CRB → Franchise inspection → Certificate → Registry → STL boost.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <section className="glass-panel p-4 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">New Application</h2>
              <span className="text-[11px] text-ehb-textMuted">Step 1–3 (v1)</span>
            </div>

            {err ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div> : null}
            {success ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div>
            ) : null}

            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-ehb-textBody">Type</span>
                <select
                  className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  value={type}
                  onChange={(e) => setType(e.target.value as CRBApplicationType)}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-ehb-textBody">Industry</span>
                <input
                  className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Construction, Healthcare, IT"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-ehb-textBody">Notes (optional)</span>
                <textarea
                  className="min-h-[90px] rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Experience summary, portfolio highlights, etc."
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-ehb-textBody">Documents (URLs)</h3>
                <button
                  className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
                  onClick={() => setDocs((d) => [...d, { type: "OTHER", fileUrl: "" }])}
                  type="button"
                >
                  + Add
                </button>
              </div>

              <div className="grid gap-2">
                {docs.map((d, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <select
                      className="col-span-4 rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                      value={d.type}
                      onChange={(e) =>
                        setDocs((prev) => prev.map((x, i) => (i === idx ? { ...x, type: e.target.value as CRBDocumentType } : x)))
                      }
                    >
                      {docTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <input
                      className="col-span-8 rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                      value={d.fileUrl}
                      onChange={(e) => setDocs((prev) => prev.map((x, i) => (i === idx ? { ...x, fileUrl: e.target.value } : x)))}
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-ehb-textMuted">
                v1 uses URL-based docs (works now). Next step: direct upload to S3/R2 with signed URLs.
              </p>
            </div>

            <button
              disabled={submitting || !canSubmit}
              className="w-full rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-4 py-2 text-sm font-semibold text-slate-950 btn-glow disabled:opacity-40"
              onClick={submit}
            >
              {submitting ? "Submitting..." : "Submit to CRB"}
            </button>
          </section>

          <section className="glass-panel p-4 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">My Applications</h2>
              <button
                className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
                type="button"
                onClick={() => load()}
              >
                Refresh
              </button>
            </div>

            {loading ? <div className="text-sm text-ehb-textMuted">Loading...</div> : null}

            {!loading && items.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-ehb-textBody">
                No applications yet. Submit your first CRB certification.
              </div>
            ) : null}

            <div className="grid gap-3">
              {items.map((a) => (
                <div key={a.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs rounded-full bg-white/10 px-2 py-1">{a.type}</span>
                      <span className="text-xs rounded-full bg-white/10 px-2 py-1">{a.status}</span>
                      {a.certificate?.status === "ACTIVE" ? (
                        <span className="text-xs rounded-full bg-emerald-500/15 text-emerald-200 px-2 py-1">CERT ACTIVE</span>
                      ) : null}
                    </div>
                    <div className="text-[11px] text-ehb-textMuted">#{a.id.slice(0, 8)} • {new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-ehb-textBody">{a.industry}</div>
                  <div className="mt-2 grid gap-1 text-[12px] text-ehb-textMuted">
                    <div>Docs: {a.documents.length}</div>
                    <div>
                      Inspection: {a.inspection ? `${a.inspection.status}${a.inspection.score ? ` • score ${a.inspection.score}` : ""}` : "Not assigned"}
                    </div>
                    <div>
                      Certificate: {a.certificate ? `${a.certificate.status} • exp ${new Date(a.certificate.expiryDate).toLocaleDateString()}` : "—"}
                    </div>
                    <div>DMO Task: {a.dmoTaskId ? a.dmoTaskId.slice(0, 10) : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

