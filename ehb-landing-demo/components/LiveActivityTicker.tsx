"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  "Ali earned $20 from Web Design order.",
  "Sara completed a job in IT services.",
  "New order placed in Delivery services.",
  "Health provider completed 3 doctor consultations.",
  "New franchise inquiry from Dubai for Delivery services.",
  "User from Lahore booked a Travel package.",
];

export function LiveActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % EVENTS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 rounded-full bg-black/30 border border-white/10 px-3 py-2 text-[11px] sm:text-xs text-slate-300 overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
        <span className="font-medium text-slate-200">Live activity</span>
        <div className="relative flex-1 min-w-0 h-4 sm:h-5">
          <div key={index} className="absolute inset-0 flex items-center ticker-slide">
            <span className="truncate">{EVENTS[index]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

