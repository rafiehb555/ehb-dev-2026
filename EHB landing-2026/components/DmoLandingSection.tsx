"use client";

import Image from "next/image";
import Link from "next/link";
import { homepageContent } from "@/lib/content/homepage";

export function DmoLandingSection() {
  const {
    continuousVerificationBullets,
    flow,
    onboardingCards,
    quickBenefits,
    trustSystemBullets,
    visionPills,
  } = homepageContent.dmoLanding;

  return (
    <section className="container-ultra section-pad-ultra space-y-8">
      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">How EHB Works</p>
            <h2 className="text-2xl md:text-4xl font-semibold leading-tight text-white">
              First-time users can understand EHB through one trust operating system
            </h2>
            <p className="text-ehb-textBody text-sm md:text-base">
              EHB combines verification, approvals, trust scoring, and business growth into one connected flow.
            </p>
            <p className="text-ehb-textMuted text-sm">
              These cards explain the six core parts that help users trust the platform quickly and take action with confidence.
            </p>
            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              {quickBenefits.map((benefit) => (
                <div key={benefit} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
                  {benefit}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/dmo/home"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
              >
                Explore the system
              </Link>
              <Link
                href="/dmo"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 transition-colors"
              >
                Open DMO dashboard
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
              <p className="text-xs text-ehb-textBody mb-3">Why new users trust it faster</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                  <div className="text-[11px] text-emerald-100">Verification</div>
                  <div className="text-sm font-semibold text-white">Clear</div>
                </div>
                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3">
                  <div className="text-[11px] text-cyan-100">Control</div>
                  <div className="text-sm font-semibold text-white">Centralized view</div>
                </div>
                <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
                  <div className="text-[11px] text-violet-100">Approvals</div>
                  <div className="text-sm font-semibold text-white">Tracked</div>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
                  <div className="text-[11px] text-amber-100">Trust score</div>
                  <div className="text-sm font-semibold text-white">Live updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Explainer Cards</p>
        <h3 className="text-2xl md:text-3xl font-semibold text-white">Six cards that explain EHB fast</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {onboardingCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group overflow-hidden rounded-3xl border bg-gradient-to-b ${card.tone} transition-transform duration-300 hover:-translate-y-1`}
            >
              <div className="relative aspect-[16/7] overflow-hidden border-b border-white/10 bg-[#020c1b]/90">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                />
              </div>
              <div className="p-3.5">
                <h4 className="text-[15px] font-semibold text-white">{card.title}</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-ehb-textBody">{card.subtitle}</p>
                <ul className="mt-2.5 space-y-2 text-[10px] leading-5 text-slate-200">
                  {card.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span className="mt-[2px] text-cyan-300" aria-hidden>
                        •
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                  {card.cta}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">How EHB Works</p>
        <h3 className="text-xl md:text-2xl font-semibold text-white mt-1">A simple trust flow behind every verified action</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-6">
          {flow.map((step, idx) => (
            <div key={step} className="rounded-xl border border-white/10 bg-[#020c1b]/70 p-3">
              <div className="text-[11px] font-semibold text-cyan-300">Step {idx + 1}</div>
              <div className="text-xs text-ehb-textBody mt-1">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-100">Trust System</p>
          <h4 className="text-lg font-semibold text-white mt-1">Why verified users feel safer to work with</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            {trustSystemBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-[#021713]/60 p-3 text-xs text-emerald-100">
            STL trust score updates instantly as approvals, inspections, and refill events happen.
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-100">Continuous Verification</p>
          <h4 className="text-lg font-semibold text-white mt-1">Refilling system keeps trust fresh</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            {continuousVerificationBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-amber-300/30 bg-[#1a1303]/60 p-3 text-xs text-amber-100">
            DMO automatically flags renewals and routes them to review queues before trust expiration.
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-400/25 bg-gradient-to-b from-violet-500/10 to-[#020b18]/90 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200">Global Control Vision</p>
        <h3 className="text-xl md:text-2xl font-semibold text-white mt-1">
          DMO is not just a dashboard, it is the operating layer behind the EHB ecosystem
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {visionPills.map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-[#020c1b]/80 p-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Enter the EHB trust operating system</h3>
        <p className="text-ehb-textBody text-sm mt-2 max-w-2xl mx-auto">
          Join the ecosystem where digital verification, physical inspection, and AI governance work together in one platform.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow"
          >
            Join EHB System
          </Link>
          <Link
            href="/dmo"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Open DMO
          </Link>
        </div>
      </div>
    </section>
  );
}

