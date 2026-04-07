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
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function LandingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#3b82f6]/30">
        <p className="text-2xl md:text-3xl font-bold text-[#3b82f6]">
          <AnimatedNumber end={10000} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Users</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#22b14c]/30">
        <p className="text-2xl md:text-3xl font-bold text-[#22b14c]">
          <AnimatedNumber end={700} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Services</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#f59e0b]/30">
        <p className="text-2xl md:text-3xl font-bold text-[#f59e0b]">
          <AnimatedNumber end={32} />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Industries</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#8b5cf6]/30">
        <p className="text-2xl md:text-3xl font-bold text-[#8b5cf6]">
          <AnimatedNumber end={120} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-ehb-textMuted mt-1">Countries</p>
      </div>
    </div>
  );
}

