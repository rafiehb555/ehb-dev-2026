"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  CRB Certify Wizard — user-facing certification flow.
 *
 *  Steps:
 *    1. Type + Industry      (SKILL / SERVICE / PRODUCT / COMPANY)
 *    2. Documents            (URL + type; add multiple rows)
 *    3. Review + Submit      → POST /api/crb/apply
 *    4. Status card          → GET /api/crb/applications (filtered to self)
 *
 *  Designed to pair with the EHB PSS wizard so sellers and service-providers
 *  can complete the full trust stack in one sitting.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CRBType = "SKILL" | "SERVICE" | "PRODUCT" | "COMPANY";
type DocType = "ID" | "LICENSE" | "PORTFOLIO" | "EXPERIENCE" | "OTHER";

interface DocRow {
  fileUrl: string;
  type: DocType;
}

interface CrbApp {
  id: string;
  type: string;
  industry: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  inspection?: { score?: number; status?: string } | null;
  certificate?: { status?: string; expiryDate?: string } | null;
}

const TYPES: { code: CRBType; label: string; icon: string; hint: string }[] = [
  { code: "SKILL",   label: "Skill",   icon: "🎓", hint: "Personal skill / teaching capability" },
  { code: "SERVICE", label: "Service", icon: "🛠", hint: "Service you offer (plumbing, legal, etc.)" },
  { code: "PRODUCT", label: "Product", icon: "📦", hint: "A specific product you manufacture or sell" },
  { code: "COMPANY", label: "Company", icon: "🏢", hint: "Full company / business entity" },
];

const DOC_TYPES: { code: DocType; label: string }[] = [
  { code: "ID",          label: "Government ID" },
  { code: "LICENSE",     label: "Trade / Professional License" },
  { code: "PORTFOLIO",   label: "Portfolio" },
  { code: "EXPERIENCE",  label: "Experience Letter" },
  { code: "OTHER",       label: "Other supporting doc" },
];

const INDUSTRIES = [
  "E-commerce", "Legal", "Medical", "Education", "Jobs", "Travel",
  "Finance", "Construction", "Agriculture", "Automotive", "Hospitality",
  "Real Estate", "Entertainment", "Media", "Fashion", "Beauty", "Fitness",
  "Logistics", "Manufacturing", "Energy", "Technology", "Telecom",
];

export function CrbCertifyWizard() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<CRBType>("SERVICE");
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [notes, setNotes] = useState("");
  const [docs, setDocs] = useState<DocRow[]>([{ fileUrl: "", type: "ID" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState<CrbApp[]>([]);

  const canNext = useMemo(() => {
    if (step === 1) return !!type && !!industry;
    if (step === 2) return docs.length > 0 && docs.every((d) => d.fileUrl.trim().startsWith("http"));
    return true;
  }, [step, type, industry, docs]);

  const loadMine = async () => {
    try {
      const res = await fetch("/api/crb/applications?mine=1", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        const rows = Array.isArray(json.data) ? json.data : json.data?.rows ?? [];
        setMine(rows);
      }
    } catch {}
  };
  useEffect(() => { loadMine(); }, []);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/crb/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, industry, notes: notes || undefined, documents: docs }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json?.error?.message ?? "Submit failed");
      setStep(4);
      loadMine();
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* ── MAIN PANEL ───────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Stepper */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex h-8 flex-1 items-center justify-center rounded-lg text-[11px] font-semibold uppercase tracking-wider"
              style={{
                background: step >= n ? "linear-gradient(135deg, #F59E0B 0%, #7B6EF6 100%)" : "rgba(255,255,255,0.04)",
                color: step >= n ? "white" : "rgba(255,255,255,0.4)",
                border: step >= n ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {n === 1 ? "Type" : n === 2 ? "Documents" : "Review"}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <Label>Certification Type</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {TYPES.map((t) => {
                  const active = t.code === type;
                  return (
                    <button
                      key={t.code}
                      type="button"
                      onClick={() => setType(t.code)}
                      className="relative rounded-xl p-4 text-left transition-all"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(19,22,42,0.9) 100%)"
                          : "rgba(26,29,51,0.7)",
                        border: `1px solid ${active ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: active ? "0 0 18px rgba(245,158,11,0.15)" : "none",
                      }}
                    >
                      <div className="flex items-center gap-2 text-lg">{t.icon} <span className="font-semibold">{t.label}</span></div>
                      <div className="mt-1 text-[12px] text-white/55">{t.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Industry</Label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg bg-[#1A1D33] px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Anything the CRB reviewer should know…"
                className="w-full rounded-lg bg-[#1A1D33] px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Label>Upload supporting documents (file URLs)</Label>
            <p className="text-[12px] text-white/45">
              Paste a URL for each document. For the pilot you can use any HTTPS upload (S3, Drive, etc.).
            </p>
            {docs.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={d.type}
                  onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, type: e.target.value as DocType } : x)))}
                  className="rounded-lg bg-[#1A1D33] px-3 py-2.5 text-sm outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {DOC_TYPES.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
                </select>
                <input
                  value={d.fileUrl}
                  onChange={(e) => setDocs(docs.map((x, j) => (j === i ? { ...x, fileUrl: e.target.value } : x)))}
                  placeholder="https://…"
                  className="flex-1 rounded-lg bg-[#1A1D33] px-3 py-2.5 text-sm outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  type="button"
                  onClick={() => setDocs(docs.filter((_, j) => j !== i))}
                  disabled={docs.length === 1}
                  className="rounded-lg border border-white/10 px-3 py-2.5 text-xs text-white/60 transition-colors hover:text-white disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDocs([...docs, { fileUrl: "", type: "OTHER" }])}
              className="rounded-lg border border-dashed border-white/15 px-3 py-2 text-[12px] text-white/60 hover:text-white"
            >
              + Add another document
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <Label>Review</Label>
            <div className="space-y-2 rounded-xl p-4" style={{ background: "rgba(26,29,51,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Row k="Type" v={type} />
              <Row k="Industry" v={industry} />
              <Row k="Notes" v={notes || "—"} />
              <Row k="Documents" v={`${docs.length} file(s)`} />
            </div>
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — SUCCESS */}
        {step === 4 && (
          <div className="space-y-3 rounded-xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(34,177,76,0.12) 0%, rgba(19,22,42,0.9) 100%)", border: "1px solid rgba(34,177,76,0.35)" }}>
            <div className="text-4xl">🎉</div>
            <div className="text-xl font-bold">Application submitted</div>
            <div className="text-sm text-white/60">
              Your CRB certification request has been queued. You can track it below.
            </div>
          </div>
        )}

        {/* Nav */}
        {step < 4 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:text-white disabled:opacity-30"
            >
              ← Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #F59E0B 0%, #7B6EF6 100%)",
                  boxShadow: "0 6px 18px rgba(245,158,11,0.25)",
                }}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={submit}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #22B14C 0%, #29ABE2 100%)",
                  boxShadow: "0 6px 18px rgba(34,177,76,0.35)",
                }}
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── SIDEBAR: MY APPLICATIONS ─────────────────────────────── */}
      <aside
        className="rounded-2xl p-5"
        style={{ background: "rgba(19,22,42,0.85)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/45">
          My CRB applications
        </div>
        {mine.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-[12px] text-white/45">
            None yet
          </div>
        ) : (
          <div className="space-y-2">
            {mine.slice(0, 6).map((a) => (
              <div key={a.id} className="rounded-lg p-3" style={{ background: "rgba(26,29,51,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-white/70">{a.type}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-1 text-sm font-semibold text-white">{a.industry}</div>
                <div className="mt-0.5 text-[11px] text-white/40">{new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/gosellr/my-journey"
          className="mt-4 block text-[12px] text-[#29ABE2] hover:text-white"
        >
          → Back to my GoSellr journey
        </Link>
      </aside>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/55">{children}</div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{k}</span>
      <span className="font-semibold text-white">{v}</span>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUBMITTED: "#29ABE2", REVIEW: "#F59E0B", INSPECTION: "#A855F7",
    APPROVED: "#22B14C", REJECTED: "#E53935",
  };
  const c = map[status] ?? "rgba(255,255,255,0.5)";
  return (
    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: c, background: `${c}1a`, border: `1px solid ${c}55` }}>
      {status}
    </span>
  );
}

export default CrbCertifyWizard;
