"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { homepageContent } from "@/lib/content/homepage";

export function RecommendedForYou() {
  const [step, setStep] = useState(0);
  const { aiStatusOptions, jobs, services, trends } = homepageContent.recommended;

  useEffect(() => {
    const id = window.setInterval(() => setStep((v) => (v + 1) % aiStatusOptions.length), 4500);
    return () => window.clearInterval(id);
  }, [aiStatusOptions.length]);

  const cards = useMemo(() => {
    return {
      job: jobs[step % jobs.length],
      service: services[(step + 1) % services.length],
      trend: trends[(step + 2) % trends.length],
    };
  }, [jobs, services, step, trends]);

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        Recommended For You
      </p>
      <p className="text-[11px] text-slate-400 mb-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          {aiStatusOptions[step]}
        </span>
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Smart suggestions to help you earn faster
      </h2>
      <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
        These examples show how EHB can guide new users. In the real product, AI will use your skills and location to personalize them.
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="rounded-2xl glass-card card-hover border border-sky-500/40 p-6">
          <p className="text-xs font-semibold text-sky-300 mb-1">{cards.job.title}</p>
          <p className="text-sm text-white mb-2">{cards.job.headline}</p>
          <p className="text-xs text-slate-400 mb-4">{cards.job.desc}</p>
          <Link href={cards.job.href} className="text-[11px] font-semibold text-sky-300 hover:underline">
            {cards.job.cta}
          </Link>
        </div>
        <div className="rounded-2xl glass-card card-hover border border-emerald-500/40 p-6">
          <p className="text-xs font-semibold text-emerald-300 mb-1">{cards.service.title}</p>
          <p className="text-sm text-white mb-2">{cards.service.headline}</p>
          <p className="text-xs text-slate-400 mb-4">{cards.service.desc}</p>
          <Link href={cards.service.href} className="text-[11px] font-semibold text-emerald-300 hover:underline">
            {cards.service.cta}
          </Link>
        </div>
        <div className="rounded-2xl glass-card card-hover border border-amber-500/40 p-6">
          <p className="text-xs font-semibold text-amber-300 mb-1">{cards.trend.title}</p>
          <p className="text-sm text-white mb-2">{cards.trend.headline}</p>
          <p className="text-xs text-slate-400 mb-4">{cards.trend.desc}</p>
          <Link href={cards.trend.href} className="text-[11px] font-semibold text-amber-300 hover:underline">
            {cards.trend.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

