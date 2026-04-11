"use client";

import { useEffect, useState } from "react";

function AnimatedNumber({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const step = end / steps;
    const stepMs = duration / steps;
    let current = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(t);
      } else setCount(Math.floor(current));
    }, stepMs);
    return () => clearInterval(t);
  }, [end]);
  return (
    <span className="font-mono tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

/** EHB_UIUX_DESIGN_PLAN Part 4 — Trust stats bar (demo numbers). */
export function LandingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#29ABE2]/35">
        <p className="text-2xl md:text-3xl font-bold text-[#29ABE2]">
          <AnimatedNumber end={1502} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Users</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#22b14c]/35">
        <p className="text-2xl md:text-3xl font-bold text-[#22b14c]">
          <AnimatedNumber end={35} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Industries</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#F59E0B]/35">
        <p className="text-2xl md:text-3xl font-bold text-[#F59E0B]">
          <AnimatedNumber end={700} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Services</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#7C3AED]/35">
        <p className="text-2xl md:text-3xl font-bold text-[#a78bfa]">
          <AnimatedNumber end={100} suffix="%" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Verified pipeline</p>
      </div>
    </div>
  );
}
