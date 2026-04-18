"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export default function PssSubmitPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    fullName: "",
    cnic: "",
    phone: "",
    address: "",
    platform: "gosellr",
    entityType: "product",
    entityTitle: "",
  });
  const [docs, setDocs] = useState({ cnicFront: false, cnicBack: false, selfie: false, licence: false });

  const canNext =
    (step === 1 && form.fullName && form.cnic.length >= 13 && form.phone.length >= 10) ||
    (step === 2 && form.entityTitle.length >= 10) ||
    (step === 3 && docs.cnicFront && docs.cnicBack && docs.selfie) ||
    step === 4;

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-6 pb-20 pt-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[#8A8FAE]">
          EHB · <span className="text-[#A098F8]">PSS verification</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Submit for verification</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A8FAE]">
          PSS aap ki identity + entity ko verify karta hai, score calculate karta hai, aur platform ko STL
          level assign karta hai. Har step auditable hai.
        </p>

        {/* Stepper */}
        <div className="my-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition ${
                  n <= step ? "bg-gradient-to-r from-[#7B6EF6] to-[#A098F8]" : "bg-white/10"
                }`}
              />
              <div className={`mt-1.5 text-[10px] uppercase tracking-wider ${n === step ? "text-[#E7E9F5]" : "text-[#8A8FAE]"}`}>
                {["Identity", "Entity", "Documents", "Review"][n - 1]}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#13162A] p-6">
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full legal name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
              <Field label="CNIC (13 digits)" value={form.cnic} onChange={(v) => setForm({ ...form, cnic: v.replace(/\D/g, "").slice(0, 13) })} />
              <Field label="Mobile number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Platform" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })}
                  opts={["gosellr", "ols", "hps", "jps", "wms", "obs", "agts"]} />
                <Select label="Entity type" value={form.entityType} onChange={(v) => setForm({ ...form, entityType: v })}
                  opts={["product", "seller_profile", "service_listing", "doctor_profile", "lawyer_profile"]} />
              </div>
              <Field label="Entity title / description (≥ 20 chars)" value={form.entityTitle} onChange={(v) => setForm({ ...form, entityTitle: v })} />
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3">
              {[
                { k: "cnicFront", label: "CNIC front photo", req: true },
                { k: "cnicBack", label: "CNIC back photo", req: true },
                { k: "selfie", label: "Live selfie + liveness", req: true },
                { k: "licence", label: "Category licence (medical / import / etc)", req: false },
              ].map((d) => (
                <label key={d.k} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-3 text-sm">
                  <span>
                    {d.label}{" "}
                    {d.req && <span className="ml-1 rounded bg-[#F05858]/20 px-1.5 py-[1px] text-[10px] text-[#F05858]">required</span>}
                  </span>
                  <input
                    type="checkbox"
                    checked={(docs as any)[d.k]}
                    onChange={(e) => setDocs({ ...docs, [d.k]: e.target.checked })}
                    className="h-4 w-4 accent-[#7B6EF6]"
                  />
                </label>
              ))}
              <p className="text-[11px] text-[#8A8FAE]">Files are stored encrypted; PSS ops never see raw CNIC outside masked view.</p>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 text-sm">
              <h3 className="text-lg font-semibold">Review & submit</h3>
              <div className="rounded-lg border border-white/[0.08] bg-[#0C0E1A] p-4">
                <Row k="Name" v={form.fullName} />
                <Row k="CNIC" v={form.cnic.slice(0, 5) + "-xxxxxxx-" + form.cnic.slice(-1)} />
                <Row k="Platform" v={form.platform} />
                <Row k="Entity" v={`${form.entityType} — ${form.entityTitle.slice(0, 40)}...`} />
                <Row k="Documents" v={`${Object.values(docs).filter(Boolean).length}/4 uploaded`} />
              </div>
              <p className="text-[11px] text-[#8A8FAE]">
                Submit karne ke baad aap ki request <span className="text-[#A098F8]">stl_request</span> queue mein jati hai.
                Expected SLA: auto-approve ≤ 2 min · franchise review ≤ 24 h · CRB ≤ 72 h.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              disabled={step === 1}
              className="rounded-lg border border-white/[0.08] bg-[#1A1D33] px-4 py-2 text-xs font-semibold text-[#8A8FAE] disabled:opacity-40 hover:text-[#E7E9F5]"
            >
              ← Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => canNext && setStep((s) => ((s + 1) as Step))}
                disabled={!canNext}
                className="rounded-lg bg-gradient-to-r from-[#7B6EF6] to-[#6557e6] px-5 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:shadow-[0_6px_20px_rgba(123,110,246,0.35)]"
              >
                Next →
              </button>
            ) : (
              <Link
                href="/pss/status/case_new_demo"
                className="rounded-lg bg-gradient-to-r from-[#2BBFA0] to-[#1fa48a] px-5 py-2 text-xs font-semibold text-white hover:shadow-[0_6px_20px_rgba(43,191,160,0.35)]"
              >
                Submit for verification
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#8A8FAE]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-[#0C0E1A] px-3 py-2 text-sm text-[#E7E9F5] outline-none focus:border-[#7B6EF6]/60"
      />
    </div>
  );
}

function Select({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-[#8A8FAE]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-[#0C0E1A] px-3 py-2 text-sm text-[#E7E9F5] outline-none focus:border-[#7B6EF6]/60"
      >
        {opts.map((o) => (
          <option key={o} value={o} className="bg-[#0C0E1A]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-white/[0.07] py-2 last:border-0">
      <span className="text-[#8A8FAE]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
