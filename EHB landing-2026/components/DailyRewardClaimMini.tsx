"use client";

import { useEffect, useMemo, useState } from "react";

type ToastState = {
  id: number;
  label: string;
  amountUsd: number;
  points: number;
  secondary: string;
} | null;

export function DailyRewardClaimMini({
  onClaim,
}: {
  onClaim?: (payload: { label: string; amountUsd: number; points: number; dayKey: string }) => void;
}) {
  const industryIcons = [
    { icon: "📚", accent: "#E53935" }, // Education
    { icon: "🩺", accent: "#00AEEF" }, // Health
    { icon: "💻", accent: "#3B82F6" }, // IT
    { icon: "⚖️", accent: "#6B7280" }, // Law
    { icon: "💰", accent: "#F59E0B" }, // Finance
    { icon: "🚚", accent: "#FB923C" }, // Delivery
    { icon: "🏢", accent: "#22C55E" }, // Business
    { icon: "🌐", accent: "#8B5CF6" }, // Blockchain-ish connection
  ];


  const [claimed, setClaimed] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [btnBusy, setBtnBusy] = useState(false);
  const [dayKey, setDayKey] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    setDayKey(key);
  }, []);

  const uiLabel = useMemo(() => {
    if (claimed) return "Claimed today ✓";
    return "Claim bonus";
  }, [claimed]);

  useEffect(() => {
    if (!dayKey) return;
    try {
      const v = window.localStorage.getItem(`ehb_daily_reward_claimed_${dayKey}`);
      setClaimed(v === "1");
    } catch {
      // ignore
    }
  }, [dayKey]);

  const claim = () => {
    if (btnBusy) return;
    if (claimed) return;
    setBtnBusy(true);

    // UI-demo: random bonus range
    const amountUsd = Math.floor(8 + Math.random() * 15); // 8..22
    const points = Math.floor(20 + Math.random() * 60); // 20..79

    window.setTimeout(() => {
      setClaimed(true);
      setToast({
        id: Date.now(),
        label: "Daily Reward",
        amountUsd,
        points,
        secondary: "New client received",
      });

      onClaim?.({ label: "Daily Reward", amountUsd, points, dayKey });

      try {
        window.localStorage.setItem(`ehb_daily_reward_claimed_${dayKey}`, "1");
      } catch {
        // ignore
      }
      setBtnBusy(false);
    }, 420);
  };

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast?.id]);

  return (
    <>
      <style>{`
        @keyframes ehbToastIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          60% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ehbToastGlow {
          0%,100% { box-shadow: 0 0 0 rgba(0,234,255,0); }
          50% { box-shadow: 0 0 26px rgba(0,234,255,0.22); }
        }

        @keyframes ehbGlobePulse {
          0%,100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
          50% { transform: translate(-50%, -50%) scale(1.04); filter: brightness(1.18); }
        }

        @keyframes ehbOrbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ehbOrbitFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div className="relative rounded-2xl glass-panel border border-amber-400/40 px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-3 overflow-hidden">
        {/* Animated globe (lightweight orbit icons) */}
        <div
          aria-hidden
          className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 110,
            height: 110,
            opacity: 0.95,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 82,
              height: 82,
              transform: "translate(-50%,-50%)",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.14), transparent 52%), radial-gradient(circle at 65% 70%, rgba(0,234,255,0.22), transparent 55%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35), rgba(0,0,0,0.65))",
              border: "1px solid rgba(0,234,255,0.35)",
              boxShadow: "0 0 34px rgba(0,234,255,0.20), inset 0 0 0 1px rgba(255,255,255,0.05)",
              animation: "ehbGlobePulse 2.6s ease-in-out infinite",
            }}
          />

          {/* orbit glow ring */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 96,
              height: 96,
              border: "1px dashed rgba(0,234,255,0.25)",
              boxShadow: "0 0 26px rgba(0,234,255,0.10)",
              opacity: 0.9,
            }}
          />

          {/* Icons below the globe (so they are not hidden) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[72px] w-[92px] flex flex-wrap justify-center gap-2 pointer-events-none"
            style={{ transformOrigin: "center" }}
          >
            {industryIcons.map((it, idx) => (
              <div
                key={it.icon}
                className="rounded-full flex items-center justify-center border glass-panel"
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: "rgba(2,12,27,0.55)",
                  borderColor: `${it.accent}55`,
                  boxShadow: `0 0 18px ${it.accent}2a`,
                  animation: `ehbOrbitFloat ${2.8 + idx * 0.15}s ease-in-out infinite`,
                  animationDelay: `${idx * 0.08}s`,
                }}
                title={it.icon}
              >
                <span className="text-[13px]">{it.icon}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-100">
          <span aria-hidden>🎁</span>
          <p className="font-medium">
            {claimed ? "Bonus claimed for today ✓ 🎁" : "Daily reward available 🎁 Login today and get bonus"}
          </p>
        </div>

        <button
          type="button"
          onClick={claim}
          disabled={btnBusy || claimed || !dayKey}
          className="min-h-touch inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-950 px-4 py-1.5 text-[11px] sm:text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-300"
          aria-label={uiLabel}
        >
          {btnBusy ? "Claiming..." : uiLabel}
        </button>
      </div>

      {toast && (
        <div
          key={toast.id}
          className="fixed right-4 bottom-4 z-[60] rounded-2xl glass-panel border border-amber-400/30 bg-slate-950/60 px-4 py-3"
          style={{
            animation: "ehbToastIn 0.35s ease-out both, ehbToastGlow 1.2s ease-in-out infinite",
          }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-xl">
              ✨
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                {toast.label} Claimed
              </p>
              <p className="text-sm font-semibold text-white">
                +${toast.amountUsd} earned
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{toast.secondary}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

