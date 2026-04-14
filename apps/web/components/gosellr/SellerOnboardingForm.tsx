"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Seller Onboarding Form
 *  Premium 4-step wizard with live STL preview, validation, and
 *  POST to /api/gosellr/seller-onboarding.
 *
 *  Steps:
 *    1. Store Basics     — name, category, country
 *    2. Contact & KYC    — email, phone, ID type
 *    3. Trust & Guarantee— money-back, replacement, coin lock intent
 *    4. Review & Submit  — live STL projection
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useMemo, useState } from "react";
import { STLUserCard } from "@/components/stl/STLUserCard";
import type { TrustLevel } from "@ehb/trust-engine";

type Step = 1 | 2 | 3 | 4;

interface FormState {
  // Step 1
  storeName: string;
  category: string;
  country: string;
  // Step 2
  email: string;
  phone: string;
  idType: "CNIC" | "Passport" | "Driver License" | "";
  // Step 3
  moneyBackDays: number;
  replacementDays: number;
  coinLock: 0 | 20 | 200 | 2000 | 4000 | 10000;
}

const INITIAL: FormState = {
  storeName: "",
  category: "",
  country: "",
  email: "",
  phone: "",
  idType: "",
  moneyBackDays: 0,
  replacementDays: 0,
  coinLock: 0,
};

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Food & Grocery",
  "Home & Garden",
  "Beauty & Health",
  "Sports & Outdoors",
  "Digital Goods",
  "Books & Education",
  "Automotive",
  "Other",
];

const COIN_TIERS: { value: FormState["coinLock"]; label: string; stl: TrustLevel }[] = [
  { value: 0, label: "No lock (FREE)", stl: 0 },
  { value: 20, label: "20 EHBGC (L2 Basic)", stl: 2 },
  { value: 200, label: "200 EHBGC (L5 Moderate)", stl: 5 },
  { value: 2000, label: "2,000 EHBGC (L8 Excellent)", stl: 8 },
  { value: 4000, label: "4,000 EHBGC (L9 Supreme)", stl: 8 },
  { value: 10000, label: "10,000 EHBGC (L10 Elite)", stl: 8 },
];

// Simple STL projection (preview only — real formula runs server-side)
function projectStl(f: FormState): { stl: TrustLevel; score: number } {
  let score = 10; // baseline
  if (f.storeName.length > 2) score += 5;
  if (f.category) score += 5;
  if (f.country) score += 5;
  if (f.email.includes("@")) score += 10;
  if (f.phone.length > 6) score += 8;
  if (f.idType) score += 12;
  if (f.moneyBackDays > 0) score += 8;
  if (f.replacementDays > 0) score += 5;
  const coinTier = COIN_TIERS.find((c) => c.value === f.coinLock);
  const coinStl = coinTier?.stl ?? 0;
  score += coinStl * 3;
  score = Math.min(100, score);
  let stl: TrustLevel = 0;
  if (score >= 86) stl = 8;
  else if (score >= 76) stl = 7;
  else if (score >= 61) stl = 6;
  else if (score >= 41) stl = 5;
  else if (score >= 21) stl = 3;
  else if (score > 0) stl = 1;
  // coin lock floor
  if (coinStl > stl) stl = coinStl;
  return { stl, score };
}

export function SellerOnboardingForm({ onSuccess }: { onSuccess?: (applicationId: string) => void }) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const projected = useMemo(() => projectStl(form), [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const validateStep = (s: Step): string | null => {
    if (s === 1) {
      if (form.storeName.trim().length < 2) return "Store name must be at least 2 characters.";
      if (!form.category) return "Please select a category.";
      if (!form.country.trim()) return "Country is required.";
    }
    if (s === 2) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email.";
      if (form.phone.replace(/\D/g, "").length < 7) return "Enter a valid phone number.";
      if (!form.idType) return "Select an ID type for KYC.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setStep((s) => Math.min(4, (s + 1) as Step));
  };
  const prev = () => setStep((s) => Math.max(1, (s - 1) as Step));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/gosellr/seller-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: form.storeName,
          category: form.category,
          notes: `Country: ${form.country} | Phone: ${form.phone} | ID: ${form.idType} | MoneyBack: ${form.moneyBackDays}d | Replacement: ${form.replacementDays}d | CoinLock: ${form.coinLock} EHBGC | Email: ${form.email}`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error?.message ?? json?.message ?? "Submission failed");
      }
      const appId = json.data?.application?.id ?? "created";
      setSuccess(appId);
      onSuccess?.(appId);
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="mx-auto max-w-2xl rounded-2xl p-10 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(34,177,76,0.12) 0%, rgba(19,22,42,0.95) 100%)",
          border: "1px solid rgba(34,177,76,0.35)",
          boxShadow: "0 0 40px rgba(34,177,76,0.2)",
        }}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl" style={{ background: "#22B14C" }}>✓</div>
        <h2 className="text-2xl font-bold text-white">Application Submitted</h2>
        <p className="mt-2 text-sm text-white/60">
          Your seller onboarding is now pending DMO approval. Ref: <code className="text-white/80">{success}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
      {/* LEFT: Form card */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "rgba(19,22,42,0.9)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Stepper header */}
        <div className="border-b border-white/5 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Become a GoSellr Seller</h1>
              <p className="mt-1 text-[12px] text-white/50">Step {step} of 4</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-1.5 w-10 rounded-full transition-all"
                  style={{
                    background: n <= step ? "linear-gradient(90deg, #29ABE2 0%, #7B6EF6 100%)" : "rgba(255,255,255,0.08)",
                    boxShadow: n === step ? "0 0 10px rgba(41,171,226,0.5)" : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Store Name" required>
                <Input value={form.storeName} onChange={(v) => update("storeName", v)} placeholder="e.g. Ali's Electronics" />
              </Field>
              <Field label="Category" required>
                <Select value={form.category} onChange={(v) => update("category", v)} options={CATEGORIES} placeholder="Select a category" />
              </Field>
              <Field label="Country" required>
                <Input value={form.country} onChange={(v) => update("country", v)} placeholder="e.g. Pakistan" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Business Email" required>
                <Input type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@store.com" />
              </Field>
              <Field label="Phone" required>
                <Input value={form.phone} onChange={(v) => update("phone", v)} placeholder="+92 300 1234567" />
              </Field>
              <Field label="ID Type (for KYC / PSS)" required>
                <div className="flex flex-wrap gap-2">
                  {(["CNIC", "Passport", "Driver License"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("idType", t)}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                      style={{
                        background: form.idType === t ? "rgba(41,171,226,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${form.idType === t ? "rgba(41,171,226,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: form.idType === t ? "#29ABE2" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Field label="Money-Back Guarantee (days)">
                <SliderInput value={form.moneyBackDays} onChange={(v) => update("moneyBackDays", v)} max={30} />
              </Field>
              <Field label="Replacement Window (days)">
                <SliderInput value={form.replacementDays} onChange={(v) => update("replacementDays", v)} max={30} />
              </Field>
              <Field label="EHBGC Coin Lock (boosts STL)">
                <div className="grid gap-2 sm:grid-cols-2">
                  {COIN_TIERS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update("coinLock", t.value)}
                      className="rounded-lg px-4 py-3 text-left text-sm transition-all"
                      style={{
                        background: form.coinLock === t.value ? "rgba(123,110,246,0.18)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.coinLock === t.value ? "rgba(123,110,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                        color: form.coinLock === t.value ? "#A098F8" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      <div className="font-semibold">{t.label}</div>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-white/60">Review your application</h2>
              <div className="grid gap-2 rounded-lg border border-white/5 bg-black/20 p-4 text-sm">
                <Row k="Store" v={form.storeName} />
                <Row k="Category" v={form.category} />
                <Row k="Country" v={form.country} />
                <Row k="Email" v={form.email} />
                <Row k="Phone" v={form.phone} />
                <Row k="ID Type" v={form.idType} />
                <Row k="Money-Back" v={form.moneyBackDays ? `${form.moneyBackDays} days` : "None"} />
                <Row k="Replacement" v={form.replacementDays ? `${form.replacementDays} days` : "None"} />
                <Row k="Coin Lock" v={form.coinLock ? `${form.coinLock.toLocaleString()} EHBGC` : "None"} />
              </div>
              <p className="text-[12px] text-white/45">
                By submitting, you confirm the above is accurate. Your application enters DMO review queue.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg px-3 py-2 text-[13px]"
              style={{ background: "rgba(240,88,88,0.12)", border: "1px solid rgba(240,88,88,0.35)", color: "#F05858" }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-lg px-6 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)", boxShadow: "0 4px 16px rgba(41,171,226,0.3)" }}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded-lg px-6 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #22B14C 0%, #29ABE2 100%)", boxShadow: "0 4px 16px rgba(34,177,76,0.35)" }}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: Live STL projection */}
      <aside className="space-y-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Projected STL</div>
        <STLUserCard
          variant="hero"
          name={form.storeName || "Your Store"}
          role="Seller"
          stl={projected.stl}
          pss={Math.min(projected.stl, 7) as TrustLevel}
          crb={projected.stl > 0 ? (Math.min(projected.stl, 6) as TrustLevel) : null}
          dmo={projected.stl}
          score={projected.score}
          verified={projected.stl >= 3}
          industry="GoSellr"
          industryAccent="#29ABE2"
        />
        <p className="text-[11px] text-white/40">
          This is a preview. Final STL is computed server-side by the protected formula after DMO + CRB verification.
        </p>
      </aside>
    </div>
  );
}

// ─── small primitives ─────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-semibold text-white/70">
        {label} {required && <span className="text-[#F05858]">*</span>}
      </div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:ring-2"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <option value="" style={{ background: "#13162A" }}>{placeholder ?? "Select…"}</option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#13162A" }}>{o}</option>
      ))}
    </select>
  );
}

function SliderInput({ value, onChange, max }: { value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[#29ABE2]"
      />
      <span className="w-16 rounded-md px-2 py-1 text-center text-xs font-bold text-white"
        style={{ background: "rgba(41,171,226,0.15)", border: "1px solid rgba(41,171,226,0.3)" }}>
        {value}d
      </span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{k}</span>
      <span className="font-medium text-white">{v || <span className="text-white/30">—</span>}</span>
    </div>
  );
}

export default SellerOnboardingForm;
