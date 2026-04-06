"use client";

import { useState } from "react";

export function SellerOnboardingCta() {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    setMsg(null);
    if (storeName.trim().length < 2 || category.trim().length < 2) {
      setMsg({ ok: false, text: "Store name and category are required." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/gosellr/seller-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: storeName.trim(),
          category: category.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ ok: true, text: "Application created. DMO will review your seller profile." });
        setStoreName("");
        setCategory("");
        setNotes("");
        setOpen(false);
      } else {
        setMsg({ ok: false, text: json.error?.message ?? json.message ?? "Request failed" });
      }
    } catch {
      setMsg({ ok: false, text: "Network error — try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sell on GoSellr</p>
          <p className="text-sm text-slate-200 mt-1">
            Start seller onboarding — creates a DMO application for review.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="min-h-touch shrink-0 inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/20 transition-colors"
        >
          {open ? "Close" : "Become a seller"}
        </button>
      </div>

      {open ? (
        <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-white/10">
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-400">Store name</span>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              placeholder="My verified shop"
              maxLength={120}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-400">Primary category</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              placeholder="Electronics, fashion…"
              maxLength={120}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-[11px] text-slate-400">Notes (optional)</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              placeholder="Links, inventory size, regions…"
              maxLength={1000}
            />
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={submit}
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit to DMO"}
            </button>
            <span className="text-[11px] text-slate-500">Requires login.</span>
          </div>
        </div>
      ) : null}

      {msg ? (
        <p className={`text-xs ${msg.ok ? "text-emerald-300" : "text-rose-300"}`}>{msg.text}</p>
      ) : null}
    </div>
  );
}
