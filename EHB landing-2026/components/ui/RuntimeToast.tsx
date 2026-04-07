"use client";

import { useEffect } from "react";

export type RuntimeToastPayload = { type: "ok" | "err"; text: string } | null;

type RuntimeToastProps = {
  toast: RuntimeToastPayload;
  onDismiss: () => void;
  durationMs?: number;
};

export function RuntimeToast(props: RuntimeToastProps) {
  const { toast, onDismiss, durationMs = 4500 } = props;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => onDismiss(), durationMs);
    return () => window.clearTimeout(id);
  }, [toast, onDismiss, durationMs]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 z-[100] max-w-[min(100vw-2rem,24rem)] rounded-2xl border px-4 py-3 text-[12px] shadow-lg backdrop-blur-md sm:text-[13px] ${
        toast.type === "ok"
          ? "border-emerald-400/30 bg-emerald-950/90 text-emerald-100"
          : "border-rose-400/30 bg-rose-950/90 text-rose-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span>{toast.text}</span>
        <button
          type="button"
          className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ehb-textBody hover:border-white/30"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
