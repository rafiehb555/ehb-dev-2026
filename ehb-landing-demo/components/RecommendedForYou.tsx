"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function RecommendedForYou() {
  const [step, setStep] = useState(0);

  const aiStatusOptions = useMemo(
    () => [
      "AI is analyzing opportunities...",
      "Finding best match for you...",
      "Optimizing your growth path...",
      "Boosting earning signals...",
    ],
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => setStep((v) => (v + 1) % aiStatusOptions.length), 4500);
    return () => window.clearInterval(id);
  }, [aiStatusOptions.length]);

  const cards = useMemo(() => {
    const bestJob = [
      {
        title: "Best job for you",
        headline: "Simple web design project",
        desc: "3–5 page website for a local business. Great if you know basic design or development.",
        cta: "View jobs",
        href: "/home",
      },
      {
        title: "Best job for you",
        headline: "Verified tutoring session",
        desc: "Teach math, English, or programming with trusted matching.",
        cta: "Find tutoring",
        href: "/home",
      },
      {
        title: "Best job for you",
        headline: "Small marketing campaign",
        desc: "SEO + social posts for a local shop. Start simple and grow fast.",
        cta: "See campaigns",
        href: "/home",
      },
    ];

    const bestService = [
      {
        title: "Best service to offer",
        headline: "Profile setup & optimization",
        desc: "Help others create strong EHB profiles. Perfect if you understand photos, descriptions, and pricing.",
        cta: "Create service",
        href: "/dashboard",
      },
      {
        title: "Best service to offer",
        headline: "Website + landing page package",
        desc: "Offer a complete mini site with verified checkout and fast delivery.",
        cta: "Create service",
        href: "/dashboard",
      },
      {
        title: "Best service to offer",
        headline: "Basic cybersecurity audit",
        desc: "A beginner-friendly security starter: checks, reports, and verified recommendations.",
        cta: "Create service",
        href: "/dashboard",
      },
    ];

    const trending = [
      {
        title: "Trending in your area",
        headline: "Delivery + small business services",
        desc: "Local delivery, printing, basic tech help, and tutoring stay in demand in most cities.",
        cta: "Explore ideas",
        href: "/ai-marketplace",
      },
      {
        title: "Trending in your area",
        headline: "Health appointments + verified care",
        desc: "Patients book doctors faster with AI suggestions and verified outcomes.",
        cta: "Explore care",
        href: "/landing/health",
      },
      {
        title: "Trending in your area",
        headline: "IT support for businesses",
        desc: "Small companies need fast help: apps, websites, and tech troubleshooting.",
        cta: "Explore IT",
        href: "/landing/it",
      },
    ];

    return {
      job: bestJob[step % bestJob.length],
      service: bestService[(step + 1) % bestService.length],
      trend: trending[(step + 2) % trending.length],
    };
  }, [step]);

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

