"use client";

import Image from "next/image";
import Link from "next/link";

const onboardingCards = [
  {
    title: "Central Control System",
    subtitle: "Manage approvals, alerts, applications, and live operations in one place.",
    details: [
      "DMO gives users, teams, and administrators one central place to understand what is happening across the platform at any moment.",
      "Instead of checking separate systems for approvals, alerts, applications, and performance, everything is tracked through one clear control layer.",
      "This makes the platform easier to trust, easier to manage, and easier to scale as more services and industries are added.",
    ],
    cta: "Explore DMO",
    href: "/dmo/home",
    image: "/images/cards/dmo-control-center.svg",
    alt: "DMO control center with connected analytics cards and system flow",
    tone: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
  },
  {
    title: "Identity & Security Verification",
    subtitle: "Verify people and businesses with KYC, AML, and fraud protection.",
    details: [
      "PSS checks whether a user or business is real before they start offering services, products, or professional work inside the ecosystem.",
      "It combines identity verification, AML review, and fraud signals so risky profiles can be filtered before they affect other users.",
      "For first-time users, this means the platform feels safer because trust starts before the transaction begins.",
    ],
    cta: "See Security",
    href: "/verification",
    image: "/images/cards/pss-identity-security.svg",
    alt: "PSS identity verification with shield, user profile, and secure checkmarks",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
  },
  {
    title: "Certification & Registry",
    subtitle: "Certify skills, services, products, and companies with trusted records.",
    details: [
      "CRB helps users understand that important claims are not just words, they are supported by formal review, inspection, and registry records.",
      "Skills, services, products, and companies can all be certified so buyers and partners can make better decisions with more confidence.",
      "It also keeps approval history, certification status, and renewal information visible and organized.",
    ],
    cta: "View Certification",
    href: "/certification",
    image: "/images/cards/crb-certification.svg",
    alt: "CRB certification card with certificate ribbon and verified compliance blocks",
    tone: "from-violet-500/20 to-indigo-500/10 border-violet-400/30",
  },
  {
    title: "Ground Verification Network",
    subtitle: "Real-world inspections and franchise validation build real trust.",
    details: [
      "Franchise verification adds a physical layer to the digital system, so important checks can also be confirmed in the real world when required.",
      "This is useful for business locations, service claims, local operations, and any case where on-ground inspection increases trust.",
      "It helps new users feel that EHB is not only online verification, but a complete trust network backed by real action.",
    ],
    cta: "See Franchise Model",
    href: "/franchise",
    image: "/images/cards/franchise-field-network.svg",
    alt: "Franchise field network with city nodes, inspections, and location markers",
    tone: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
  },
  {
    title: "Trust Score Engine",
    subtitle: "A smart trust level that improves visibility, ranking, and confidence.",
    details: [
      "STL turns verification, performance, and behavior into one trust score that helps users quickly understand who is more reliable on the platform.",
      "A higher trust score can improve ranking, visibility, and buyer confidence, while weak trust signals can reduce exposure and credibility.",
      "For first-time visitors, this makes the system easier to understand because trust is shown clearly instead of being hidden.",
    ],
    cta: "Understand STL",
    href: "/dmo/stl",
    image: "/images/cards/stl-trust-score.svg",
    alt: "STL trust score dashboard with score meter and ranking signals",
    tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
  },
  {
    title: "Multi-Industry Verification",
    subtitle: "Add extra trust by verifying businesses across multiple industry sectors.",
    details: [
      "Industry verification shows whether a business or service can be trusted within one or more specific sectors such as health, technology, or manufacturing.",
      "This adds a deeper layer of confidence because users can see that trust is not general only, it is connected to real industry standards.",
      "It strengthens the entire ecosystem by helping businesses build credibility in the exact fields where they operate.",
    ],
    cta: "Explore Industries",
    href: "/industries",
    image: "/images/cards/industry-verification.svg",
    alt: "Industry verification with connected sectors like health, tech, and manufacturing",
    tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
  },
];

const flow = [
  "Start with one EHB account for your profile or business.",
  "PSS checks identity, risk, and compliance details.",
  "CRB validates service quality, products, or company claims.",
  "Franchise teams handle real-world inspection when needed.",
  "DMO records the decision and controls approvals centrally.",
  "STL updates trust score, visibility, and platform confidence.",
];

const quickBenefits = [
  "Understand the platform in under one minute",
  "See how trust is built before buying or selling",
  "Know why verified users rank higher in the system",
];

export function DmoLandingSection() {
  return (
    <section className="container-ultra section-pad-ultra space-y-8">
      <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">How EHB Works</p>
            <h2 className="text-2xl md:text-4xl font-semibold leading-tight text-white">
              First-time users can understand EHB through one trust operating system
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              EHB combines verification, approvals, trust scoring, and business growth into one connected flow.
            </p>
            <p className="text-slate-400 text-sm">
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
              <p className="text-xs text-slate-300 mb-3">Why new users trust it faster</p>
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
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3.5">
                <h4 className="text-[15px] font-semibold text-white">{card.title}</h4>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-300">{card.subtitle}</p>
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
              <div className="text-xs text-slate-300 mt-1">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-100">Trust System</p>
          <h4 className="text-lg font-semibold text-white mt-1">Why verified users feel safer to work with</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            <li>✔ Verified Identity</li>
            <li>✔ Verified Business</li>
            <li>✔ Verified Product</li>
            <li>✔ Verified Performance</li>
          </ul>
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-[#021713]/60 p-3 text-xs text-emerald-100">
            STL trust score updates instantly as approvals, inspections, and refill events happen.
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-100">Continuous Verification</p>
          <h4 className="text-lg font-semibold text-white mt-1">Refilling system keeps trust fresh</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-100">
            <li>⏳ Six-month verification cycle</li>
            <li>🔄 Mandatory renewal workflow</li>
            <li>⚠ Expiry triggers trust downgrade</li>
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
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Multi-country support</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Franchise-driven physical verification</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">Blockchain-ready trust infrastructure</div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-[#020c1b]/80 p-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Enter the EHB trust operating system</h3>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl mx-auto">
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

