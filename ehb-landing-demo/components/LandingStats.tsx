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
  return <span>{count}{suffix}</span>;
}

export function LandingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#00eaff]/20">
        <p className="text-2xl md:text-3xl font-bold gradient-text">
          <AnimatedNumber end={32} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Industries</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#00eaff]/20">
        <p className="text-2xl md:text-3xl font-bold gradient-text">
          <AnimatedNumber end={700} suffix="+" />
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Services</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#8b5cf6]/30">
        <p className="text-xl md:text-2xl font-bold text-white">Global</p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Franchise Network</p>
      </div>
      <div className="rounded-2xl glass-card card-hover p-6 text-center border border-[#00eaff]/20">
        <p className="text-xl md:text-2xl font-bold text-[#00eaff]">AI Powered</p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Marketplace</p>
      </div>
    </div>
  );
}
