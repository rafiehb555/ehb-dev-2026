"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  "Ali earned $20 from Web Design.",
  "Sara completed a job in IT services.",
  "New order placed for Delivery services.",
  "Service verified successfully by EHB.",
  "New job posted in IT: React Developer.",
];

export function LiveActivityCornerFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % EVENTS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed right-4 bottom-4 z-50 w-[290px] max-w-[calc(100vw-32px)] rounded-2xl glass-panel border border-white/10 overflow-hidden"
      style={{
        boxShadow: "0 0 26px rgba(0,234,255,0.14)",
        backgroundColor: "rgba(2,12,27,0.78)",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
          <p className="text-[11px] font-semibold text-slate-200 truncate">Live activity</p>
        </div>
        <span className="text-[10px] text-slate-500" aria-hidden>
          AI
        </span>
      </div>

      <div className="relative px-4 pb-3">
        <div key={index} className="absolute inset-0 flex items-center ticker-slide px-0">
          <p className="text-[11px] text-slate-300 leading-relaxed">{EVENTS[index]}</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
    </div>
  );
}

