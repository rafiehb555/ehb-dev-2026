"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  PSS Verification Wizard — 4-step user-facing flow
 *  Consumes: GET/POST /api/pss/submit
 *
 *  Steps:
 *    1. IDENTITY  — ID type + ID file
 *    2. DOCUMENTS — Address proof
 *    3. LIVENESS  — Selfie + liveness check
 *    4. AML_RISK  — Source of funds declaration
 *
 *  Live status sidebar shows current case state from GET endpoint.
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useState } from "react";
import { STLUserCard } from "@/components/stl/STLUserCard";
import type { TrustLevel } from "@ehb/trust-engine";

type PSSStep = "IDENTITY" | "DOCUMENTS" | "LIVENESS" | "AML_RISK" | "FINAL_DECISION";
type PSSStatus = "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "REFILL_REQUIRED";

interface CaseState {
  id: string;
  status: PSSStatus;
  currentStep: PSSStep;
  phaseCompleted: number;
  riskScore?: number | null;
  riskLevel?: string | null;
  lastVerifiedAt?: string | null;
}

interface DocRecord {
  id: string;
  step: PSSStep;
  type: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const STEP_ORDER: PSSStep[] = ["IDENTITY", "DOCUMENTS", "LIVENESS", "AML_RISK"];
const STEP_TITLES: Record<PSSStep, string> = {
  IDENTITY: "Identity",
  DOCUMENTS: "Documents",
  LIVENESS: "Liveness",
  AML_RISK: "AML Risk",
  FINAL_DECISION: "Decision",
};

// Document types allowed per step (matches API Zod enum)
const DOC_TYPES_BY_STEP: Record<PSSStep, string[]> = {
  IDENTITY: ["CNIC", "PASSPORT", "LICENSE"],
  DOCUMENTS: ["ADDRESS_PROOF", "OTHER"],
  LIVENESS: ["SELFIE", "VIDEO"],
  AML_RISK: ["AML_EVIDENCE", "OTHER"],
  FINAL_DECISION: [],
};

export function PssVerificationWizard() {
  const [loading, setLoading] = useState(true);
  const [caseState, setCaseState] = useState<CaseState | null>(null);
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [activeStep, setActiveStep] = useState<PSSStep>("IDENTITY");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-step form fields
  const [idType, setIdType] = useState<"CNIC" | "PASSPORT" | "LICENSE">("CNIC");
  const [idFileUrl, setIdFileUrl] = useState("");
  const [addressFileUrl, setAddressFileUrl] = useState("");
  const [selfieFileUrl, setSelfieFileUrl] = useState("");
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [amlFileUrl, setAmlFileUrl] = useState("");
  const [amlSource, setAmlSource] = useState("");

  // ─── Load case ────────────────────────────────────────────────────
  const loadCase = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pss/submit", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setCaseState(json.data.case);
        setDocs(json.data.documents ?? []);
        if (json.data.nextStep && json.data.nextStep !== "FINAL_DECISION") {
          setActiveStep(json.data.nextStep as PSSStep);
        }
      }
    } catch (e) {
      // swallow — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  // ─── Submit ───────────────────────────────────────────────────────
  const submitStep = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const documents = buildDocuments(activeStep);
      if (documents.length === 0) {
        throw new Error("Please provide at least one file URL.");
      }

      const payload: Record<string, unknown> = {
        step: activeStep,
        documents,
      };
      if (activeStep === "LIVENESS") payload.livenessPassed = livenessPassed;
      if (typeof navigator !== "undefined") {
        payload.clientMeta = { userAgent: navigator.userAgent.slice(0, 400) };
      }

      const res = await fetch("/api/pss/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? "Submission failed");
      }
      // reset inputs + reload state
      resetInputs();
      await loadCase();
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const buildDocuments = (step: PSSStep) => {
    const out: any[] = [];
    if (step === "IDENTITY" && idFileUrl) {
      out.push({ step, type: idType, fileUrl: idFileUrl });
    }
    if (step === "DOCUMENTS" && addressFileUrl) {
      out.push({ step, type: "ADDRESS_PROOF", fileUrl: addressFileUrl });
    }
    if (step === "LIVENESS" && selfieFileUrl) {
      out.push({ step, type: "SELFIE", fileUrl: selfieFileUrl, notes: livenessPassed ? "liveness:passed" : "liveness:pending" });
    }
    if (step === "AML_RISK" && amlFileUrl) {
      out.push({ step, type: "AML_EVIDENCE", fileUrl: amlFileUrl, notes: `source:${amlSource}` });
    }
    return out;
  };

  const resetInputs = () => {
    setIdFileUrl("");
    setAddressFileUrl("");
    setSelfieFileUrl("");
    setAmlFileUrl("");
    setAmlSource("");
  };

  // ─── Derived ──────────────────────────────────────────────────────
  const phaseCompleted = caseState?.phaseCompleted ?? 0;
  const projectedStl: TrustLevel = Math.min(phaseCompleted * 2, 8) as TrustLevel;
  const projectedScore = Math.min(100, 15 + phaseCompleted * 20);
  const status = caseState?.status ?? "UNDER_REVIEW";

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/5 bg-[#13162A] p-10 text-center text-white/50">
        Loading your PSS case…
      </div>
    );
  }

  if (status === "VERIFIED") {
    return (
      <SuccessPanel
        title="PSS Verified"
        message="Your identity is verified across all phases. Your Service Trust Level reflects this."
      />
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
      {/* LEFT: Wizard */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "rgba(19,22,42,0.9)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header + stepper */}
        <div className="border-b border-white/5 px-6 py-5">
          <h1 className="text-xl font-bold text-white">PSS Verification</h1>
          <p className="mt-1 text-[12px] text-white/50">
            Personal Security System — KYC, liveness & AML screening for your EHB profile.
          </p>
          <div className="mt-4 flex gap-1.5">
            {STEP_ORDER.map((s, i) => {
              const done = i < phaseCompleted;
              const current = s === activeStep;
              return (
                <button
                  key={s}
                  onClick={() => setActiveStep(s)}
                  className="flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition-all"
                  style={{
                    background: done
                      ? "rgba(34,177,76,0.15)"
                      : current
                      ? "rgba(41,171,226,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      done ? "rgba(34,177,76,0.4)" : current ? "rgba(41,171,226,0.4)" : "rgba(255,255,255,0.06)"
                    }`,
                    color: done ? "#22B14C" : current ? "#29ABE2" : "rgba(255,255,255,0.5)",
                    boxShadow: current ? "0 0 12px rgba(41,171,226,0.3)" : "none",
                  }}
                >
                  {done ? "✓ " : `${i + 1}. `}
                  {STEP_TITLES[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step body */}
        <div className="px-6 py-6">
          {activeStep === "IDENTITY" && (
            <div className="space-y-4">
              <div className="text-sm text-white/70">Upload a valid government-issued ID.</div>
              <div>
                <Label>ID Type</Label>
                <div className="flex gap-2">
                  {(["CNIC", "PASSPORT", "LICENSE"] as const).map((t) => (
                    <Pill key={t} active={idType === t} onClick={() => setIdType(t)}>{t}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <Label>ID File URL</Label>
                <Input value={idFileUrl} onChange={setIdFileUrl} placeholder="https://uploads.ehb.com/…" />
                <Hint>Upload your file first; paste the returned URL here.</Hint>
              </div>
            </div>
          )}

          {activeStep === "DOCUMENTS" && (
            <div className="space-y-4">
              <div className="text-sm text-white/70">Upload an address proof (utility bill, bank statement, etc.).</div>
              <div>
                <Label>Address Proof URL</Label>
                <Input value={addressFileUrl} onChange={setAddressFileUrl} placeholder="https://uploads.ehb.com/…" />
              </div>
            </div>
          )}

          {activeStep === "LIVENESS" && (
            <div className="space-y-4">
              <div className="text-sm text-white/70">Capture a live selfie and confirm the liveness check.</div>
              <div>
                <Label>Selfie URL</Label>
                <Input value={selfieFileUrl} onChange={setSelfieFileUrl} placeholder="https://uploads.ehb.com/…" />
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={livenessPassed}
                  onChange={(e) => setLivenessPassed(e.target.checked)}
                  className="accent-[#29ABE2]"
                />
                <span className="text-sm text-white/80">Liveness check passed</span>
              </label>
            </div>
          )}

          {activeStep === "AML_RISK" && (
            <div className="space-y-4">
              <div className="text-sm text-white/70">Declare your primary source of funds and attach supporting evidence.</div>
              <div>
                <Label>Source of Funds</Label>
                <Input value={amlSource} onChange={setAmlSource} placeholder="e.g. Salary / Business / Investments" />
              </div>
              <div>
                <Label>AML Evidence URL</Label>
                <Input value={amlFileUrl} onChange={setAmlFileUrl} placeholder="https://uploads.ehb.com/…" />
              </div>
            </div>
          )}

          {error && (
            <div
              className="mt-4 rounded-lg px-3 py-2 text-[13px]"
              style={{
                background: "rgba(240,88,88,0.12)",
                border: "1px solid rgba(240,88,88,0.35)",
                color: "#F05858",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <div className="text-[11px] text-white/40">
            Step {STEP_ORDER.indexOf(activeStep) + 1} of {STEP_ORDER.length}
          </div>
          <button
            type="button"
            onClick={submitStep}
            disabled={submitting}
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)",
              boxShadow: "0 4px 16px rgba(41,171,226,0.3)",
            }}
          >
            {submitting ? "Submitting…" : `Submit ${STEP_TITLES[activeStep]}`}
          </button>
        </div>
      </div>

      {/* RIGHT: Live status + STL projection */}
      <aside className="space-y-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Current Status</div>
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(19,22,42,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <StatusRow label="Case" value={caseState?.id ? caseState.id.slice(-8) : "—"} />
          <StatusRow label="Status" value={status} color={statusColor(status)} />
          <StatusRow
            label="Risk"
            value={caseState?.riskLevel ?? "—"}
            color={caseState?.riskLevel === "low" ? "#22B14C" : caseState?.riskLevel === "high" ? "#F05858" : "#F0A030"}
          />
          <StatusRow label="Phases done" value={`${phaseCompleted} / 4`} />
          <StatusRow label="Documents" value={String(docs.length)} />
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Projected STL</div>
        <STLUserCard
          variant="standard"
          name="Your Profile"
          role="Buyer"
          stl={projectedStl}
          pss={projectedStl}
          crb={null}
          dmo={Math.max(1, Math.min(projectedStl, 4)) as TrustLevel}
          score={projectedScore}
          verified={projectedStl >= 3}
          industry="EHB"
          industryAccent="#7B6EF6"
        />
        <p className="text-[11px] text-white/40">
          Preview only. Final STL is computed by the protected server-side formula after admin review.
        </p>
      </aside>
    </div>
  );
}

// ─── primitives ───────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-[12px] font-semibold text-white/70">{children}</div>;
}
function Hint({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-[11px] text-white/40">{children}</div>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    />
  );
}
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
      style={{
        background: active ? "rgba(41,171,226,0.2)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? "rgba(41,171,226,0.5)" : "rgba(255,255,255,0.08)"}`,
        color: active ? "#29ABE2" : "rgba(255,255,255,0.7)",
      }}
    >
      {children}
    </button>
  );
}
function StatusRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold" style={{ color: color ?? "#FFFFFF" }}>
        {value}
      </span>
    </div>
  );
}
function statusColor(s: PSSStatus) {
  if (s === "VERIFIED") return "#22B14C";
  if (s === "REJECTED") return "#F05858";
  if (s === "REFILL_REQUIRED") return "#F0A030";
  return "#29ABE2";
}
function SuccessPanel({ title, message }: { title: string; message: string }) {
  return (
    <div
      className="mx-auto max-w-2xl rounded-2xl p-10 text-center"
      style={{
        background: "linear-gradient(135deg, rgba(34,177,76,0.12) 0%, rgba(19,22,42,0.95) 100%)",
        border: "1px solid rgba(34,177,76,0.35)",
        boxShadow: "0 0 40px rgba(34,177,76,0.2)",
      }}
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl" style={{ background: "#22B14C" }}>
        ✓
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{message}</p>
    </div>
  );
}

export default PssVerificationWizard;
