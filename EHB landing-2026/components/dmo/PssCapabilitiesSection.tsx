"use client";

import { useMemo, useState } from "react";
import {
  PSS_CAPABILITY_CATEGORIES,
  PSS_CAPABILITIES,
  type PssCapabilityCategory,
} from "@/lib/pss/pssCapabilities";

const CAT_ORDER: PssCapabilityCategory[] = [
  "identity",
  "aml",
  "monitoring",
  "business",
  "risk_signals",
  "operations",
];

export function PssCapabilitiesSection() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<PssCapabilityCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PSS_CAPABILITIES.filter((c) => (cat === "all" ? true : c.category === cat)).filter(
      (c) =>
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.purpose.toLowerCase().includes(q) ||
        c.useCase.toLowerCase().includes(q) ||
        c.short.toLowerCase().includes(q)
    );
  }, [query, cat]);

  return (
    <section className="space-y-4" aria-labelledby="pss-cap-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/90">PSS capability matrix</p>
          <h2 id="pss-cap-title" className="mt-1 text-xl font-semibold text-white">
            KYC · AML · Monitoring stack
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-ehb-textBody">
            Har module ka purpose aur typical use-case — baad mein vendor integration / feature flags se enable/disable
            kiya ja sakta hai.
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search capabilities..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-ehb-textMuted outline-none focus:border-cyan-400/40"
            aria-label="Search PSS capabilities"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCat("all")}
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
            cat === "all"
              ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-100"
              : "border-white/10 bg-white/5 text-ehb-textBody hover:bg-white/10"
          }`}
        >
          All ({PSS_CAPABILITIES.length})
        </button>
        {CAT_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCat(key)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
              cat === key
                ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-100"
                : "border-white/10 bg-white/5 text-ehb-textBody hover:bg-white/10"
            }`}
          >
            {PSS_CAPABILITY_CATEGORIES[key].label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article
            key={c.id}
            className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-[#0a0f14]/90 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-cyan-400/25 hover:shadow-[0_0_32px_rgba(34,211,238,0.08)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{c.title}</h3>
              <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-cyan-200/90">
                {c.short}
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-ehb-textMuted">
              {PSS_CAPABILITY_CATEGORIES[c.category].label}
            </p>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-ehb-textBody">
              <span className="text-white/80">Purpose: </span>
              {c.purpose}
            </p>
            <p className="mt-2 border-t border-white/5 pt-2 text-xs leading-relaxed text-ehb-textMuted">
              <span className="text-cyan-200/80">Use case: </span>
              {c.useCase}
            </p>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-ehb-textMuted">No capabilities match your search.</p>
      ) : null}
    </section>
  );
}
