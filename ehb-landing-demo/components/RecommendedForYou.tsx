"use client";

import Link from "next/link";

export function RecommendedForYou() {
  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
        Recommended For You
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
        Smart suggestions to help you earn faster
      </h2>
      <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
        These examples show how EHB can guide new users. In the real product, AI will use your skills and location to personalize them.
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="rounded-2xl glass-card card-hover border border-sky-500/40 p-6">
          <p className="text-xs font-semibold text-sky-300 mb-1">Best job for you</p>
          <p className="text-sm text-white mb-2">Simple web design project</p>
          <p className="text-xs text-slate-400 mb-4">
            3–5 page website for a local business. Good starting point if you know basic design or development.
          </p>
          <Link href="/home" className="text-[11px] font-semibold text-sky-300 hover:underline">
            View jobs
          </Link>
        </div>
        <div className="rounded-2xl glass-card card-hover border border-emerald-500/40 p-6">
          <p className="text-xs font-semibold text-emerald-300 mb-1">Best service to offer</p>
          <p className="text-sm text-white mb-2">Profile setup & optimization</p>
          <p className="text-xs text-slate-400 mb-4">
            Help others create strong EHB profiles. Perfect if you understand good photos, descriptions, and pricing.
          </p>
          <Link href="/dashboard" className="text-[11px] font-semibold text-emerald-300 hover:underline">
            Create service
          </Link>
        </div>
        <div className="rounded-2xl glass-card card-hover border border-amber-500/40 p-6">
          <p className="text-xs font-semibold text-amber-300 mb-1">Trending in your area</p>
          <p className="text-sm text-white mb-2">Delivery + small business services</p>
          <p className="text-xs text-slate-400 mb-4">
            Local delivery, printing, basic tech help, and tutoring stay in demand in most cities.
          </p>
          <Link href="/ai-marketplace" className="text-[11px] font-semibold text-amber-300 hover:underline">
            Explore ideas
          </Link>
        </div>
      </div>
    </section>
  );
}

