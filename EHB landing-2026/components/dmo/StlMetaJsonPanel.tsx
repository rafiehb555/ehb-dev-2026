"use client";

import { useCallback, useState } from "react";

export function StlMetaJsonPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const load = useCallback(async (forceRefresh: boolean) => {
    if (!forceRefresh && text !== null) return;
    if (forceRefresh) setText(null);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stl/meta", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
      }
      setText(JSON.stringify(json, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setText(null);
    } finally {
      setLoading(false);
    }
  }, [text]);

  async function copyJson() {
    if (!text) return;
    setCopyHint(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint("Copied");
      window.setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint("Copy failed");
      window.setTimeout(() => setCopyHint(null), 2500);
    }
  }

  return (
    <section className="ehb-card-elevated space-y-3">
      <p className="sr-only" aria-live="polite">
        {copyHint ? `Clipboard: ${copyHint}` : ""}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-white">API — raw JSON</h2>
        <div className="flex flex-wrap gap-2">
          {open && text ? (
            <>
              <button
                type="button"
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-50"
                onClick={() => void copyJson()}
                disabled={loading}
              >
                {copyHint ?? "Copy JSON"}
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-ehb-textBody hover:bg-white/10"
                onClick={() => void load(true)}
                disabled={loading}
              >
                Refresh
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="ehb-btn-secondary ehb-press text-xs"
            onClick={() => {
              const next = !open;
              setOpen(next);
              if (next) void load(false);
            }}
            aria-expanded={open}
          >
            {open ? "Hide" : "View"} GET /api/stl/meta
          </button>
        </div>
      </div>
      {!open ? (
        <p className="text-[11px] text-ehb-textMuted">
          Same bundle as this page — live route for integrations and mobile clients.
        </p>
      ) : loading ? (
        <p className="text-xs text-ehb-textMuted">Loading…</p>
      ) : error ? (
        <div className="space-y-2">
          <p className="text-xs text-rose-200">{error}</p>
          <button type="button" className="text-[11px] text-cyan-300 underline" onClick={() => void load(true)}>
            Retry
          </button>
        </div>
      ) : text ? (
        <pre className="max-h-[min(420px,50vh)] overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[10px] leading-relaxed text-cyan-100/85 font-mono">
          {text}
        </pre>
      ) : null}
    </section>
  );
}
