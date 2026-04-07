"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { EHB_MOTION } from "./motion";

export type ToastKind = "success" | "error" | "info";

export type ToastState = {
  open: boolean;
  kind: ToastKind;
  title: string;
  message?: string;
};

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(t);
  }, [toast.open, onClose]);

  const tone =
    toast.kind === "success"
      ? "border-emerald-400/40 text-emerald-100"
      : toast.kind === "error"
        ? "border-rose-400/40 text-rose-100"
        : "border-white/15 text-slate-100";

  return (
    <div className="fixed bottom-4 right-4 z-[80] w-[calc(100%-32px)] sm:w-[420px] pointer-events-none">
      <AnimatePresence>
        {toast.open ? (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={EHB_MOTION}
            className={`pointer-events-auto rounded-2xl glass-panel border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${tone}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-semibold text-white">{toast.title}</div>
                {toast.message ? <div className="text-[11px] text-slate-200">{toast.message}</div> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel border border-white/10 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

