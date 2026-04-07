"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, getIndustryBySlug } from "@/lib/industry/config";
import { getIndustryServices } from "@/lib/industry/services";
import { LocationSelector } from "@/components/LocationSelector";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type StepKey = 1 | 2 | 3 | 4;

export function ServiceCreationForm() {
  const router = useRouter();

  const [step, setStep] = useState<StepKey>(1);
  const [industrySlug, setIndustrySlug] = useState<string>("it");
  const industry = useMemo(() => getIndustryBySlug(industrySlug), [industrySlug]);
  const servicesConfig = useMemo(() => getIndustryServices(industrySlug), [industrySlug]);

  const categories = servicesConfig?.categories ?? [];

  const [categorySlug, setCategorySlug] = useState<string>(() => getIndustryServices("it")?.categories?.[0]?.slug ?? "");
  const [serviceSlug, setServiceSlug] = useState<string>(() => getIndustryServices("it")?.categories?.[0]?.services?.[0]?.slug ?? "");

  const selectedCategory = categories.find((c) => c.slug === categorySlug) ?? categories[0];
  const servicesList = selectedCategory?.services ?? [];
  const selectedService = servicesList.find((s) => s.slug === serviceSlug) ?? servicesList[0];

  const [priceUsd, setPriceUsd] = useState<string>("200");
  const [locationValue, setLocationValue] = useState({
    countryCode: "PK",
    stateCode: "punjab",
    cityCode: "rawalpindi",
  });
  const [serviceNotes, setServiceNotes] = useState<string>("Beginner-friendly service with verified trust flow.");

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<null | { title: string; body: string }>(null);

  const accentColor = industry?.accentColor ?? "#3B82F6";

  const resetStep2And3 = (nextIndustrySlug: string) => {
    const nextConfig = getIndustryServices(nextIndustrySlug);
    const nextCat = nextConfig?.categories?.[0];
    const nextService = nextCat?.services?.[0];
    setCategorySlug(nextCat?.slug ?? "");
    setServiceSlug(nextService?.slug ?? "");
    setStep(2);
  };

  const canContinueFromStep = () => {
    if (step === 1) return Boolean(industrySlug);
    if (step === 2) return Boolean(categorySlug);
    if (step === 3) return Boolean(serviceSlug);
    return Boolean(priceUsd.trim().length) && Boolean(String(locationValue.cityCode).trim().length);
  };

  const selectedCountry = useMemo(
    () => getCountryByCode(String(locationValue.countryCode)),
    [locationValue.countryCode]
  );
  const selectedState = useMemo(
    () => getStateByCode(String(locationValue.countryCode), String(locationValue.stateCode)),
    [locationValue.countryCode, locationValue.stateCode]
  );
  const selectedCity = useMemo(
    () => getCityByCode(String(locationValue.countryCode), String(locationValue.stateCode), String(locationValue.cityCode)),
    [locationValue.countryCode, locationValue.stateCode, locationValue.cityCode]
  );

  const submit = async () => {
    if (!canContinueFromStep()) return;
    setBusy(true);

    await new Promise((r) => setTimeout(r, 900));

    const createdId = `APP_${Date.now()}`;
    setToast({
      title: "Application submitted to DMO (demo)",
      body: "Your listing draft is queued for officer workflow. Use the DMO Applications Board to review it.",
    });

    setBusy(false);

    // For demo: open DMO workflow queue with your application marked as New.
    router.push(
      `/dmo/applications?industry=${encodeURIComponent(industrySlug)}&createdId=${encodeURIComponent(createdId)}&country=${encodeURIComponent(
        String(locationValue.countryCode)
      )}&state=${encodeURIComponent(String(locationValue.stateCode))}&city=${encodeURIComponent(String(locationValue.cityCode))}`
    );
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel card-hover p-4 space-y-3 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Service creation</p>
            <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">
              Select industry → category → service → details
            </h1>
            <p className="text-ehb-textMuted text-sm max-w-2xl">
              This is a demo flow. In production it will connect to your DMO workflow, wallet escrow, and STL trust engine.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 w-full sm:w-[260px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Step</span>
              <span className="text-sm font-semibold text-white">
                {step}/4
              </span>
            </div>
            <div className="mt-3 w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(step / 4) * 100}%`,
                  background: `linear-gradient(90deg, ${accentColor}, rgba(34,197,94,0.9))`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {([
            { key: 1 as const, label: "Industry" },
            { key: 2 as const, label: "Category" },
            { key: 3 as const, label: "Service" },
            { key: 4 as const, label: "Details" },
          ] as const).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(s.key)}
              className="min-h-touch inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all duration-200"
              style={{
                borderColor: step === s.key ? `${accentColor}55` : "rgba(255,255,255,0.12)",
                background: step === s.key ? `${accentColor}10` : "rgba(255,255,255,0.03)",
                boxShadow: step === s.key ? `0 0 26px ${accentColor}30` : "none",
                color: step === s.key ? "rgba(226,232,240,0.98)" : "rgba(226,232,240,0.85)",
              }}
              aria-pressed={step === s.key}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="glass-panel border border-white/10 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Industry</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {INDUSTRIES.slice(0, 6).map((ind) => (
              <button
                key={ind.slug}
                type="button"
                onClick={() => resetStep2And3(ind.slug)}
                className="rounded-2xl glass-card card-hover border p-4 text-left transition-all duration-200"
                style={{
                  borderColor: industrySlug === ind.slug ? `${ind.accentColor}55` : "rgba(255,255,255,0.12)",
                  boxShadow: industrySlug === ind.slug ? `0 0 28px ${ind.accentColor}18` : "none",
                }}
                aria-pressed={industrySlug === ind.slug}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{ind.name}</span>
                  <span aria-hidden style={{ color: ind.accentColor }} className="text-lg">
                    ↗
                  </span>
                </div>
                <div className="text-[11px] text-ehb-textMuted mt-2">Verified ecosystem (demo)</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-panel border border-white/10 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <div className="text-ehb-textMuted text-sm">No categories available for this industry.</div>
            ) : (
              categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    const nextService = c.services?.[0];
                    setCategorySlug(c.slug);
                    setServiceSlug(nextService?.slug ?? "");
                    setStep(3);
                  }}
                  className="min-h-touch inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all duration-200"
                  style={{
                    borderColor: c.slug === categorySlug ? `${accentColor}55` : "rgba(255,255,255,0.12)",
                    background: c.slug === categorySlug ? `${accentColor}10` : "rgba(255,255,255,0.03)",
                    boxShadow: c.slug === categorySlug ? `0 0 26px ${accentColor}30` : "none",
                    color: c.slug === categorySlug ? "rgba(226,232,240,0.98)" : "rgba(226,232,240,0.85)",
                  }}
                  aria-pressed={c.slug === categorySlug}
                >
                  {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass-panel border border-white/10 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Service</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setServiceSlug(s.slug)}
                className="rounded-2xl glass-card card-hover border p-4 text-left transition-all duration-200"
                style={{
                  borderColor: s.slug === serviceSlug ? `${accentColor}55` : "rgba(255,255,255,0.12)",
                  boxShadow: s.slug === serviceSlug ? `0 0 28px ${accentColor}18` : "none",
                }}
                aria-pressed={s.slug === serviceSlug}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                  <span aria-hidden className="text-[12px] text-ehb-textMuted">•</span>
                </div>
                <div className="text-[11px] text-ehb-textMuted mt-2">Draft listing (demo)</div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!serviceSlug}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue to details →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass-panel border border-white/10 rounded-2xl p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Price (USD)</span>
              <input
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                className="w-full rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm text-white outline-none"
                inputMode="decimal"
              />
            </label>
            <div className="sm:col-span-2">
              <LocationSelector value={locationValue} onChange={setLocationValue} />
            </div>
          </div>
          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Service notes</span>
            <textarea
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm text-white outline-none min-h-[96px]"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Preview</p>
            <div className="mt-2 text-sm text-ehb-textBody space-y-1">
              <div>
                <span className="text-ehb-textMuted">Industry:</span> <span className="font-semibold">{industry?.name}</span>
              </div>
              <div>
                <span className="text-ehb-textMuted">Service:</span> <span className="font-semibold">{selectedService?.name}</span>
              </div>
              <div>
                <span className="text-ehb-textMuted">Price:</span> <span className="font-semibold">${priceUsd}</span>
              </div>
              <div>
                <span className="text-ehb-textMuted">Location:</span>{" "}
                <span className="font-semibold">
                  {selectedCountry?.name ?? "—"} · {selectedState?.name ?? "—"} · {selectedCity?.name ?? "—"}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-ehb-textMuted mt-3">
              After submit: DMO workflows + PSS/CRB/STL trust badges appear on marketplace (demo).
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all"
              disabled={busy}
            >
              Back
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canContinueFromStep() || busy}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? "Submitting..." : "Create service listing →"}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="glass-panel border border-emerald-400/30 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">{toast.title}</div>
              <div className="text-sm text-ehb-textBody">{toast.body}</div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-[11px] font-semibold text-ehb-textBody hover:underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

