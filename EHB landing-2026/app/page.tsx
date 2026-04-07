import Link from "next/link";
import { LandingStats } from "@/components/LandingStats";
import { IndustriesExplorer } from "@/components/IndustriesExplorer";
import { HeroVisual } from "@/components/HeroVisual";
import { HeroParticles } from "@/components/HeroParticles";
import { SectionReveal } from "@/components/SectionReveal";
import { FeatureCard } from "@/components/FeatureCard";
import { AIVisual } from "@/components/AIVisual";
import { AIFeatureItem } from "@/components/AIFeatureItem";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { FranchiseLevelCard } from "@/components/FranchiseLevelCard";
import { LiveActivityTicker } from "@/components/LiveActivityTicker";
import { LiveActivityCornerFeed } from "@/components/LiveActivityCornerFeed";
import { RecommendedForYou } from "@/components/RecommendedForYou";
import { EarningHookMoment } from "@/components/EarningHookMoment";
import { GoSellrGSMFranchiseMini } from "@/components/GoSellrGSMFranchiseMini";
import { QuickActionsStrip } from "@/components/QuickActionsStrip";
import { EHBSystem3D } from "@/components/EHBSystem3D";
import { EHBDepartmentsGrid } from "@/components/EHBDepartmentsGrid";
import { EHBVerificationSystemFlow } from "@/components/EHBVerificationSystemFlow";
import { EHBValueForEveryone } from "@/components/EHBValueForEveryone";
import { EHBHowItWorks3DInteractive } from "@/components/EHBHowItWorks3DInteractive";
import { DailyRewardClaimMini } from "@/components/DailyRewardClaimMini";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";
import { RoadmapPhasesSection } from "@/components/RoadmapPhasesSection";
import { homepageContent } from "@/lib/content/homepage";

function SectionDivider() {
  return (
    <div className="container-ultra py-0" aria-hidden>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  const {
    aiFeatures,
    dmoOverviewCards,
    earningMethods,
    earningsPotential,
    footer,
    franchise,
    investorReasons,
    monetizationCards,
    platformComparison,
    pricingTiers,
  } = homepageContent.sections;

  return (
    <main className="min-h-screen text-white">
      <LiveActivityCornerFeed />
      {/* Section 1 — Hero: simple, powerful, beginner-friendly */}
      <section className="relative min-h-hero flex flex-col justify-start overflow-hidden border-b border-white/5 hero-bg-ecosystem pt-safe-t pb-8">
        {/* Layer 2: mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Layer 3: glow lights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(41, 171, 226,0.18),transparent_50%),radial-gradient(ellipse_60%_40%_at_100%_15%,rgba(34, 177, 76,0.1),transparent_50%),radial-gradient(ellipse_50%_30%_at_0%_70%,rgba(139,92,246,0.08),transparent_50%)]" />
        <HeroParticles />
        <div className="container-ultra relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 lg:py-8">
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-ehb-textMuted mb-2">
              EHB Technologies Limited
            </p>
            <p className="text-sm text-[#06B6D4] font-medium mb-3">
              Education · Health · Business
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug gradient-text max-w-2xl mx-auto lg:mx-0 mb-4">
              Pakistan&apos;s First AI-Powered Trust-Verified Super Platform
            </h1>
            <p className="text-ehb-textBody text-sm md:text-base max-w-xl mx-auto lg:mx-0 mb-3">
              Connect with verified doctors, lawyers, sellers &amp; employers — all in one place, all trust-scored, all blockchain-backed.
            </p>
            <p className="text-ehb-textBody text-xs md:text-sm max-w-xl mx-auto lg:mx-0 mb-5">
              Jobs, services, GoSellr GSM, franchise, and wallet — guided by EHB-STL-LEVEL (Service Trust Level).
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              <Link
                href="/onboarding"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] px-8 py-3.5 text-sm font-semibold text-white btn-glow transition-all duration-300 hover:opacity-95 hover:scale-[1.02]"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-ehb-works"
                className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#29ABE2]/50 hover:shadow-[0_0_20px_rgba(41, 171, 226,0.2)] transition-all duration-300"
              >
                See how it works
              </Link>
            </div>
            <p className="text-ehb-textMuted text-xs font-medium tracking-wide flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1">
              <span>✔ 1,500+ users</span>
              <span>✔ 35+ industries</span>
              <span>✔ CRB-ready verification</span>
            </p>
          </div>
          <div className="lg:col-span-6 flex justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* PHASE 3 — You can earn now moment */}
      <SectionReveal as="div">
        <EarningHookMoment />
      </SectionReveal>

      {/* Franchise opportunity preview (GoSellr GSM live booking) */}
      <SectionReveal as="div">
        <GoSellrGSMFranchiseMini />
      </SectionReveal>

      {/* PHASE 1 — How EHB Works & Why It’s Powerful (NEW) */}
      <SectionReveal as="div">
        <section id="how-ehb-works" className="container-ultra section-pad-ultra pt-6 pb-10 scroll-mt-24">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">How EHB Works</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              How EHB Works &amp; Why It&apos;s Powerful
            </h2>
            <p className="text-ehb-textMuted text-sm md:text-base max-w-2xl">
              Hover nodes to see verified departments. Data flows through the system and outcomes stay trusted.
            </p>
            <EHBHowItWorks3DInteractive />
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />

      {/* NEXT SECTION: DEPARTMENTS (CARDS GRID) */}
      <SectionReveal as="div">
        <EHBDepartmentsGrid />
      </SectionReveal>

      {/* NEXT SECTION: VERIFICATION SYSTEM */}
      <SectionReveal as="div">
        <EHBVerificationSystemFlow />
      </SectionReveal>

      {/* NEXT SECTION: TRUST BADGES + STL LEVELS */}
      <SectionReveal as="div">
        <TrustBadgeLegend />
      </SectionReveal>
      <SectionReveal as="div">
        <STLLevelsAndSecurity />
      </SectionReveal>

      {/* NEXT SECTION: VALUE FOR EVERYONE */}
      <SectionReveal as="div">
        <EHBValueForEveryone />
      </SectionReveal>

      {/* Live activity ticker */}
      <section className="container-ultra pt-6 pb-8">
        <LiveActivityTicker />
      </section>

      {/* Daily reward teaser */}
      <section className="container-ultra pb-4">
        <DailyRewardClaimMini />
      </section>

      <SectionDivider />
      {/* EHB system visual – ecosystem level */}
      <SectionReveal as="div">
        <EHBSystem3D />
      </SectionReveal>

      <SectionReveal as="div">
        <AIToolsSection />
      </SectionReveal>

      <SectionReveal as="div">
        <RoadmapPhasesSection />
      </SectionReveal>

      <SectionDivider />
      {/* Section 2 — How You Can Earn (4 earning methods) */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Earning Made Simple</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Start Earning in Multiple Ways
          </h2>
          <p className="text-ehb-textMuted max-w-2xl mb-8 text-sm md:text-base">
            Choose the path that fits you today. You can always add more ways to earn later.
          </p>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 card-gap-ultra">
            {earningMethods.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* Quick actions to reduce friction */}
      <QuickActionsStrip />

      <SectionDivider />
      {/* Section 3 — EHB vs Market comparison (Fiverr, Amazon, LinkedIn, Upwork) */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Why EHB Is Different</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Why EHB is Better Than Other Platforms</h2>
          <p className="text-ehb-textMuted max-w-2xl mb-8 text-sm md:text-base">
            EHB combines the good parts of Fiverr, Amazon, LinkedIn, and Upwork in one simple place.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl glass-card border border-emerald-400/40 p-6 md:p-7">
              <p className="text-sm font-semibold text-emerald-300 mb-3">EHB</p>
              <ul className="space-y-2 text-xs md:text-sm text-ehb-textBody">
                {platformComparison.ehb.map((item) => (
                  <li key={item}>✔ {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-red-400/40 p-6 md:p-7">
              <p className="text-sm font-semibold text-red-300 mb-3">Others (Fiverr, Amazon, LinkedIn, Upwork)</p>
              <ul className="space-y-2 text-xs md:text-sm text-ehb-textBody">
                {platformComparison.others.map((item) => (
                  <li key={item}>❌ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 4 — 32 Industries Overview (interactive explorer) */}
      <SectionReveal as="div">
        <IndustriesExplorer />
      </SectionReveal>

      <SectionDivider />
      {/* Section 5 — Value explanation + AI simplified */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Why EHB Is Powerful</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Why EHB is a Powerful Global Platform</h2>
        <p className="text-ehb-textMuted max-w-2xl mb-4 text-sm md:text-base">
          EHB combines multiple platforms into one system.
        </p>
        <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
          Instead of using Fiverr, Amazon, LinkedIn, and Upwork separately, you can do everything in one place. This makes EHB faster, smarter, and more valuable than traditional platforms.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            {aiFeatures.map((item) => (
              <AIFeatureItem key={item.title} {...item} />
            ))}
            <div className="pt-2">
              <Link
                href="/ai-marketplace"
                className="inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium text-violet-200 hover:bg-violet-500/20 transition-colors"
              >
                <span>Smart AI that works for you</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-3xl glass-card border border-violet-500/40 p-6 md:p-8 min-h-[260px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.25),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.2),transparent_55%)]" />
            <div className="relative w-full max-w-lg">
              <AIVisual />
            </div>
          </div>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 6 — Marketplace Section (services + products tabs) */}
      <SectionReveal as="div">
        <MarketplaceSection />
      </SectionReveal>

      <SectionDivider />
      {/* DMO department overview */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
            EHB Departments
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            DMO – Digital Management Office
          </h2>
          <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
            DMO (Digital Management Office) is the main department that keeps the EHB platform running
            smoothly. It connects all online operations, data, and teams so that users, franchises, and
            admins see one clean and professional experience.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dmoOverviewCards.map((card) => (
              <Link
                key={card.title}
                href={card.href ?? "/dmo"}
                className={`block rounded-2xl glass-card border p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 ${card.accentClass}`}
              >
                <p className={`text-xs font-semibold mb-1 uppercase tracking-[0.12em] ${card.toneClass}`}>
                  {card.title}
                </p>
                <p className="text-sm text-white mb-2">{card.subtitle}</p>
                <p className="text-xs text-ehb-textMuted">{card.description}</p>
                <p className="text-[10px] font-medium text-cyan-400/80 mt-3">Open in app →</p>
              </Link>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />
      {/* Monetization model, pricing, premium, and token positioning */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
            Monetization &amp; Pricing
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            How EHB Creates Value and Revenue
          </h2>
          <p className="text-ehb-textMuted max-w-2xl mb-8 text-sm md:text-base">
            EHB is designed so that users, franchise partners, and the platform itself can all grow together
            in a simple and transparent way.
          </p>

          {/* Earning model */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {monetizationCards.map((card) => (
              <Link
                key={card.title}
                href={card.href ?? "/home"}
                className={`block rounded-2xl glass-card border p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 ${card.accentClass}`}
              >
                <p className={`text-xs font-semibold mb-1 ${card.toneClass}`}>{card.title}</p>
                <p className="text-sm text-white mb-2">{card.subtitle}</p>
                <p className="text-xs text-ehb-textMuted">{card.description}</p>
                <p className="text-[10px] font-medium text-cyan-400/80 mt-3">Explore →</p>
              </Link>
            ))}
          </div>

          {/* Pricing & tiers */}
          <div className="grid gap-6 lg:grid-cols-3 items-start mb-10">
            {pricingTiers.map((tier) => (
              <Link
                key={tier.title}
                href={tier.href}
                className={`block rounded-2xl glass-card border p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 ${tier.accentClass}`}
              >
                <p className={`text-xs font-semibold mb-1 ${tier.toneClass}`}>{tier.title}</p>
                <p className="text-sm text-white mb-2">{tier.subtitle}</p>
                <ul className="space-y-1.5 text-xs text-ehb-textMuted">
                  {tier.description.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <p className="text-[10px] font-medium text-cyan-400/80 mt-3">View related flow →</p>
              </Link>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />
      {/* Recommended by AI-style helper section */}
      <SectionReveal as="div">
        <RecommendedForYou />
      </SectionReveal>

      <SectionDivider />
      {/* Section 7 — Earnings potential (user + franchise) */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Earnings Potential</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Your Earning Potential</h2>
          <p className="text-ehb-textMuted max-w-2xl mb-8 text-sm md:text-base">
            These are example ranges to help you imagine what is possible. Real results depend on your activity and performance.
          </p>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl glass-card border border-[#3b82f6]/40 p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Individual User</p>
              <p className="text-xl md:text-2xl font-semibold text-[#3b82f6] mb-4">Users</p>
              <ul className="space-y-2 text-xs md:text-sm text-ehb-textBody">
                {earningsPotential.userPoints.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-[#22b14c]/40 p-6 md:p-7 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34, 177, 76,0.25),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.18),transparent_55%)]" />
              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textBody mb-2">Franchise Partner</p>
                <p className="text-xl md:text-2xl font-semibold text-emerald-300 mb-4">Franchise</p>
                <p className="text-xs md:text-sm text-ehb-textBody mb-3">
                  Earn <strong>$500 to $5000 per month</strong> by managing your area and services and earning from every order in your region.
                </p>
                <div className="flex items-end gap-2 h-20 mb-3">
                  {earningsPotential.franchiseBars.map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t bg-gradient-to-t from-emerald-400/80 to-sky-400/80 animate-float"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-ehb-textMuted">Earnings depend on your activity, local demand, and how well you manage your area.</p>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 8 — Franchise (business opportunity, with urgency) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Franchise</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Own the EHB Network in Your City</h2>
        <p className="text-ehb-textMuted max-w-2xl mb-8 text-sm md:text-base">
          You do not need to build a tech company. EHB gives you the system. You focus on people, partners, and local growth.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
          <div className="space-y-3">
            {franchise.benefitLines.map((line) => (
              <div key={line} className="flex items-start gap-3 text-xs md:text-sm text-ehb-textBody">
                <span className="mt-[3px] text-emerald-400" aria-hidden>
                  ✔
                </span>
                <p>{line}</p>
              </div>
            ))}
            <p className="text-[11px] text-amber-300 mt-3">
              Limited franchise slots per region to protect partner earnings. Once a city is taken, it may not open again.
            </p>
          </div>
          <div className="rounded-3xl glass-card border border-[#22b14c]/40 p-6 md:p-7 min-h-[220px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34, 177, 76,0.25),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.18),transparent_55%)]" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textBody mb-2">Simple Snapshot</p>
              <p className="text-2xl md:text-3xl font-semibold text-emerald-300 mb-1">Growing Monthly Volume</p>
              <p className="text-[11px] text-ehb-textMuted mb-4">More active users and services in your city can mean more volume for you.</p>
              <div className="flex items-end gap-2 h-20 mb-3">
                {franchise.snapshotBars.map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t bg-gradient-to-t from-emerald-400/80 to-sky-400/80 animate-float"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-ehb-textMuted">
                Talk to our team to understand your city size, expected users, and realistic earning plans.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          {franchise.levels.map((level) => (
            <FranchiseLevelCard key={level.title} {...level} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-ehb-textMuted">
            Next franchise batch is being planned now. Early partners get extra onboarding support.
          </p>
          <Link
            href="/franchise"
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#22b14c] to-[#16a34a] px-8 py-3 text-xs md:text-sm font-semibold text-slate-950 btn-glow"
          >
            Become a Franchise Partner
          </Link>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 9 — Platform Statistics (4 cols) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Scale</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Platform Statistics</h2>
        <p className="text-ehb-textMuted text-sm md:text-base mb-8">
          Over 10,000 users and hundreds of services across 32 industries – growing daily as new regions
          and franchises come online.
        </p>
        <LandingStats />
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 10 — Investor opportunity */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">
          Investor Perspective
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Why EHB is a High-Growth Opportunity
        </h2>
        <p className="text-ehb-textMuted max-w-2xl mb-6 text-sm md:text-base">
          EHB combines marketplace, SaaS, and franchise economics in one platform, positioned for
          long‑term, global expansion.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {investorReasons.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block rounded-2xl glass-panel p-6 border border-white/15 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/35"
            >
              <p className="text-xs font-semibold text-ehb-textBody mb-1">{item.title}</p>
              <p className="text-sm text-ehb-textBody">{item.description}</p>
              <p className="text-[10px] font-medium text-cyan-400/80 mt-3">Learn more →</p>
            </Link>
          ))}
        </div>
        <div className="max-w-2xl rounded-2xl glass-card p-6 border border-[#8b5cf6]/30 mt-8">
          <p className="text-ehb-textBody text-sm md:text-base leading-relaxed">
            Our mission is to build the world&apos;s most trusted global service ecosystem where people can
            offer skills, products, and services across industries – with clear revenue models for users,
            partners, and investors.
          </p>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 11 — CTA (glow gradient) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <div className="rounded-2xl glass-card p-10 md:p-14 text-center border border-[#33C3FF]/20 bg-gradient-to-b from-[#33C3FF]/[0.06] via-transparent to-[#8b5cf6]/[0.04]">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Start Your Journey with EHB Today</h2>
          <p className="text-ehb-textMuted max-w-lg mx-auto mb-8">
            Join thousands of users building their future with EHB.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-slate-950 btn-glow"
            >
              Create Profile
            </Link>
            <Link
              href="/home"
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
              Explore Platform
            </Link>
            <Link
              href="/franchise"
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-8 py-3.5 text-sm font-semibold text-ehb-textBody hover:bg-[#8b5cf6]/20 transition-all"
            >
              Become Franchise Partner
            </Link>
          </div>
        </div>
      </section>
      </SectionReveal>

      {/* Section 10 — Footer */}
      <section className="border-t border-white/5 bg-[#020c1b]/60">
        <div className="container-ultra py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
            {footer.groups.map((group) => (
              <div key={group.title}>
                <p className="font-semibold text-white mb-3">{group.title}</p>
                {group.links.map((item) => (
                  <Link
                    key={`${group.title}-${item.label}`}
                    href={item.href}
                    className="block text-ehb-textMuted hover:text-[#33C3FF] py-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-ehb-textMuted">
            <p className="">
              EHB is a global AI-powered platform connecting services, jobs, and businesses across multiple industries.
            </p>
            <div className="flex flex-wrap gap-3">
              {footer.policyLinks.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-ehb-textBody">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
