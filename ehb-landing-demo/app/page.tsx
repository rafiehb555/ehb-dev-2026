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
import { RecommendedForYou } from "@/components/RecommendedForYou";
import { QuickActionsStrip } from "@/components/QuickActionsStrip";
import { DmoLandingSection } from "@/components/DmoLandingSection";

function SectionDivider() {
  return (
    <div className="container-ultra py-0" aria-hidden>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen text-slate-100">
      {/* Section 1 — Hero: simple, powerful, beginner-friendly */}
      <section className="relative min-h-hero flex flex-col justify-center overflow-hidden border-b border-white/5 hero-bg-ecosystem">
        {/* Layer 2: mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Layer 3: glow lights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,174,239,0.18),transparent_50%),radial-gradient(ellipse_60%_40%_at_100%_15%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(ellipse_50%_30%_at_0%_70%,rgba(139,92,246,0.08),transparent_50%)]" />
        <HeroParticles />
        <div className="container-ultra relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-16 lg:py-24">
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-3">
              Earn Online · Even If You Are New
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text max-w-2xl mx-auto lg:mx-0 mb-5">
              EHB – Earn, Hire, and Grow in One Global Platform
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-3">
              A powerful AI-based platform where you can find jobs, offer services, sell products, and build your own business across 32 industries.
            </p>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto lg:mx-0 mb-6">
              Even if you have no experience, you can start and grow with EHB.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              <Link
                href="#industries"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#22C55E] px-8 py-3.5 text-sm font-semibold text-white btn-glow transition-all duration-300 hover:opacity-95 hover:scale-[1.02]"
              >
                Explore Industries
              </Link>
              <Link
                href="/dashboard"
                className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#00AEEF]/50 hover:shadow-[0_0_20px_rgba(0,174,239,0.2)] transition-all duration-300"
              >
                Create Profile
              </Link>
            </div>
            <p className="text-slate-500 text-xs font-medium tracking-wide">
              32+ Industries &nbsp;•&nbsp; 700+ Services &nbsp;•&nbsp; AI Powered &nbsp;•&nbsp; Verified System
            </p>
          </div>
          <div className="lg:col-span-6 flex justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Live activity ticker just under hero */}
      <section className="container-ultra pt-4 pb-8">
        <LiveActivityTicker />
      </section>

      {/* Daily reward teaser */}
      <section className="container-ultra pb-4">
        <div className="rounded-2xl glass-panel border border-amber-400/40 px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-amber-100">
            <span aria-hidden>🎁</span>
            <p className="font-medium">
              Daily reward available — log in and claim bonus points for today.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-950 px-4 py-1.5 text-[11px] sm:text-xs font-semibold hover:bg-amber-300 transition-colors"
          >
            View in dashboard
          </Link>
        </div>
      </section>

      <SectionDivider />
      {/* DMO Landing Section — trust system introduction */}
      <SectionReveal as="div">
        <DmoLandingSection />
      </SectionReveal>

      <SectionDivider />
      {/* Section 2 — How You Can Earn (4 earning methods) */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Earning Made Simple</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Start Earning in Multiple Ways
          </h2>
          <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
            Choose the path that fits you today. You can always add more ways to earn later.
          </p>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 card-gap-ultra">
            <FeatureCard
              title="Work as a User"
              description="Offer your skills, complete jobs, and earn from local and global clients."
              icon="🧑‍💼"
              accentColor="#22c55e"
            />
            <FeatureCard
              title="Freelance Globally"
              description="Work online in IT, design, marketing, and more from anywhere."
              icon="💻"
              accentColor="#f59e0b"
            />
            <FeatureCard
              title="Sell Products"
              description="List your products and sell to customers worldwide."
              icon="🛒"
              accentColor="#3b82f6"
            />
            <FeatureCard
              title="Become a Franchise Partner"
              description="Manage your area and earn from every order in your region."
              icon="🏢"
              accentColor="#e11d48"
            />
          </div>
        </section>
      </SectionReveal>

      {/* Quick actions to reduce friction */}
      <QuickActionsStrip />

      <SectionDivider />
      {/* Section 3 — EHB vs Market comparison (Fiverr, Amazon, LinkedIn, Upwork) */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Why EHB Is Different</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Why EHB is Better Than Other Platforms</h2>
          <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
            EHB combines the good parts of Fiverr, Amazon, LinkedIn, and Upwork in one simple place.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl glass-card border border-emerald-400/40 p-6 md:p-7">
              <p className="text-sm font-semibold text-emerald-300 mb-3">EHB</p>
              <ul className="space-y-2 text-xs md:text-sm text-slate-200">
                <li>✔ All industries in one platform</li>
                <li>✔ AI-powered matching</li>
                <li>✔ Verified users and services</li>
                <li>✔ Earn in multiple ways</li>
                <li>✔ Franchise business model</li>
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-red-400/40 p-6 md:p-7">
              <p className="text-sm font-semibold text-red-300 mb-3">Others (Fiverr, Amazon, LinkedIn, Upwork)</p>
              <ul className="space-y-2 text-xs md:text-sm text-slate-200">
                <li>❌ Limited to one category</li>
                <li>❌ No AI matching</li>
                <li>❌ No full verification system</li>
                <li>❌ Only one main income source</li>
                <li>❌ No franchise or local business ownership</li>
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
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Why EHB Is Powerful</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Why EHB is a Powerful Global Platform</h2>
        <p className="text-slate-400 max-w-2xl mb-4 text-sm md:text-base">
          EHB combines multiple platforms into one system.
        </p>
        <p className="text-slate-400 max-w-2xl mb-6 text-sm md:text-base">
          Instead of using Fiverr, Amazon, LinkedIn, and Upwork separately, you can do everything in one place. This makes EHB faster, smarter, and more valuable than traditional platforms.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <AIFeatureItem
              icon="🌍"
              title="Global buyers and sellers"
              description="People from different countries can buy and sell services and products with one simple, verified EHB account."
            />
            <AIFeatureItem
              icon="🧩"
              title="All services in one place"
              description="From education and health to IT and logistics, EHB connects 32 industries so you don&apos;t need separate platforms."
            />
            <AIFeatureItem
              icon="🛡️"
              title="100% verified services and products"
              description="Strong verification checks help remove fake listings so users can trust that services and products are real."
            />
            <AIFeatureItem
              icon="⛓️"
              title="Blockchain-inspired franchise model"
              description="Franchise layers work like a secure network, so city, regional, and country partners can grow together with clear rules."
            />
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
      {/* Monetization model, pricing, premium, and token positioning */}
      <SectionReveal as="div">
        <section className="container-ultra section-pad-ultra">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
            Monetization &amp; Pricing
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            How EHB Creates Value and Revenue
          </h2>
          <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
            EHB is designed so that users, franchise partners, and the platform itself can all grow together
            in a simple and transparent way.
          </p>

          {/* Earning model */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="rounded-2xl glass-card border border-[#3b82f6]/40 p-6">
              <p className="text-xs font-semibold text-[#3b82f6] mb-1">User earning</p>
              <p className="text-sm text-white mb-2">Earn from services, jobs, and products.</p>
              <p className="text-xs text-slate-400">
                Individuals and teams make money by completing jobs, selling services, and offering products in
                32 industries.
              </p>
            </div>
            <div className="rounded-2xl glass-card border border-[#22c55e]/40 p-6">
              <p className="text-xs font-semibold text-[#22c55e] mb-1">Franchise earning</p>
              <p className="text-sm text-white mb-2">Earn from every order in your area.</p>
              <p className="text-xs text-slate-400">
                City, regional, and country partners earn a share of all verified orders that pass through
                their zone.
              </p>
            </div>
            <div className="rounded-2xl glass-card border border-amber-400/40 p-6">
              <p className="text-xs font-semibold text-amber-300 mb-1">Platform earning</p>
              <p className="text-sm text-white mb-2">EHB earns small fees per transaction.</p>
              <p className="text-xs text-slate-400">
                A low, transparent service fee is charged on successful orders, creating a scalable revenue
                engine.
              </p>
            </div>
          </div>

          {/* Pricing & tiers */}
          <div className="grid gap-6 lg:grid-cols-3 items-start mb-10">
            <div className="rounded-2xl glass-card border border-white/15 p-6">
              <p className="text-xs font-semibold text-slate-200 mb-1">Pricing &amp; fees</p>
              <p className="text-sm text-white mb-2">Simple and transparent.</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Clear fee shown before confirmation.</li>
                <li>• No hidden charges or surprise deductions.</li>
                <li>• Lower fees for high‑quality, verified users.</li>
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-[#3b82f6]/40 p-6">
              <p className="text-xs font-semibold text-[#3b82f6] mb-1">Free vs Premium (future‑ready)</p>
              <p className="text-sm text-white mb-2">Upgrade path for power users.</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Free: basic access to jobs, services, and marketplace.</li>
                <li>• Premium: more visibility in search and listings.</li>
                <li>• Premium: stronger AI recommendations and insights.</li>
                <li>• Premium: potentially lower service fees.</li>
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-violet-400/40 p-6">
              <p className="text-xs font-semibold text-violet-200 mb-1">EHBGC token vision</p>
              <p className="text-sm text-white mb-2">Utility for fees, rewards, and premium.</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Use EHBGC in the future to lower platform fees.</li>
                <li>• Unlock premium features and higher visibility.</li>
                <li>• Earn rewards and bonuses for positive activity.</li>
                <li>• Positioned for a future blockchain ecosystem.</li>
              </ul>
            </div>
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
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Earnings Potential</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Your Earning Potential</h2>
          <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
            These are example ranges to help you imagine what is possible. Real results depend on your activity and performance.
          </p>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl glass-card border border-[#3b82f6]/40 p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">Individual User</p>
              <p className="text-xl md:text-2xl font-semibold text-[#3b82f6] mb-4">Users</p>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                <li>• Earn <strong>$100 to $1000 per month</strong> by offering services or doing jobs.</li>
                <li>• Start small and grow your income as your skills and ratings improve.</li>
              </ul>
            </div>
            <div className="rounded-2xl glass-card border border-[#22c55e]/40 p-6 md:p-7 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,197,94,0.25),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.18),transparent_55%)]" />
              <div className="relative">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300 mb-2">Franchise Partner</p>
                <p className="text-xl md:text-2xl font-semibold text-emerald-300 mb-4">Franchise</p>
                <p className="text-xs md:text-sm text-slate-300 mb-3">
                  Earn <strong>$500 to $5000 per month</strong> by managing your area and services and earning from every order in your region.
                </p>
                <div className="flex items-end gap-2 h-20 mb-3">
                  {[20, 40, 55, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-t bg-gradient-to-t from-emerald-400/80 to-sky-400/80 animate-float"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">Earnings depend on your activity, local demand, and how well you manage your area.</p>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 8 — Franchise (business opportunity, with urgency) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Franchise</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Own the EHB Network in Your City</h2>
        <p className="text-slate-400 max-w-2xl mb-8 text-sm md:text-base">
          You do not need to build a tech company. EHB gives you the system. You focus on people, partners, and local growth.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
          <div className="space-y-3">
            {[
              "Reserve a city or region before someone else does.",
              "Onboard local services, shops, and riders under one brand.",
              "Earn a share from every completed order in your zone.",
              "Use AI and dashboards to see which areas need more focus.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
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
          <div className="rounded-3xl glass-card border border-[#22c55e]/40 p-6 md:p-7 min-h-[220px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(34,197,94,0.25),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(56,189,248,0.18),transparent_55%)]" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300 mb-2">Simple Snapshot</p>
              <p className="text-2xl md:text-3xl font-semibold text-emerald-300 mb-1">Growing Monthly Volume</p>
              <p className="text-[11px] text-slate-400 mb-4">More active users and services in your city can mean more volume for you.</p>
              <div className="flex items-end gap-2 h-20 mb-3">
                {[30, 60, 40, 80, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t bg-gradient-to-t from-emerald-400/80 to-sky-400/80 animate-float"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Talk to our team to understand your city size, expected users, and realistic earning plans.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <FranchiseLevelCard
            title="Sub Franchise"
            description="Manage local city-level operations, onboard providers, and earn from every order in your zone."
            color="#3b82f6"
          />
          <FranchiseLevelCard
            title="Master Franchise"
            description="Control multiple cities or regions with higher earning potential and operational scope."
            color="#f59e0b"
            highlighted
          />
          <FranchiseLevelCard
            title="Corporate Franchise"
            description="National or country-level franchise with maximum earning power and ecosystem influence."
            color="#f97316"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Next franchise batch is being planned now. Early partners get extra onboarding support.
          </p>
          <Link
            href="/franchise"
            className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-8 py-3 text-xs md:text-sm font-semibold text-slate-950 btn-glow"
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
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Scale</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Platform Statistics</h2>
        <p className="text-slate-400 text-sm md:text-base mb-8">
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
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
          Investor Perspective
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          Why EHB is a High-Growth Opportunity
        </h2>
        <p className="text-slate-400 max-w-2xl mb-6 text-sm md:text-base">
          EHB combines marketplace, SaaS, and franchise economics in one platform, positioned for
          long‑term, global expansion.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl glass-panel p-6 border border-white/15">
            <p className="text-xs font-semibold text-slate-200 mb-1">Multi-industry platform</p>
            <p className="text-sm text-slate-300">
              32 industries under one roof reduce fragmentation and increase cross‑selling potential.
            </p>
          </div>
          <div className="rounded-2xl glass-panel p-6 border border-white/15">
            <p className="text-xs font-semibold text-slate-200 mb-1">AI‑driven ecosystem</p>
            <p className="text-sm text-slate-300">
              Matching, recommendations, and risk controls improve as more users and transactions flow
              through the system.
            </p>
          </div>
          <div className="rounded-2xl glass-panel p-6 border border-white/15">
            <p className="text-xs font-semibold text-slate-200 mb-1">Scalable franchise model</p>
            <p className="text-sm text-slate-300">
              City, regional, and country layers allow rapid geographic expansion with aligned incentives.
            </p>
          </div>
          <div className="rounded-2xl glass-panel p-6 border border-white/15">
            <p className="text-xs font-semibold text-slate-200 mb-1">Global expansion potential</p>
            <p className="text-sm text-slate-300">
              The same core engine can serve multiple countries with localized providers and franchises.
            </p>
          </div>
        </div>
        <div className="max-w-2xl rounded-2xl glass-card p-6 border border-[#8b5cf6]/30 mt-8">
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
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
        <div className="rounded-2xl glass-card p-10 md:p-14 text-center border border-[#00eaff]/20 bg-gradient-to-b from-[#00eaff]/[0.06] via-transparent to-[#8b5cf6]/[0.04]">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Start Your Journey with EHB Today</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Join thousands of users building their future with EHB.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-slate-950 btn-glow"
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
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:bg-[#8b5cf6]/20 transition-all"
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
            <div>
              <p className="font-semibold text-white mb-3">Industries</p>
              <Link href="#industries" className="block text-slate-400 hover:text-[#00eaff] py-1">Browse all</Link>
              <Link href="/landing/health" className="block text-slate-400 hover:text-[#00eaff] py-1">Health</Link>
              <Link href="/landing/education" className="block text-slate-400 hover:text-[#00eaff] py-1">Education</Link>
              <Link href="/landing/it" className="block text-slate-400 hover:text-[#00eaff] py-1">IT</Link>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Marketplace</p>
              <Link href="/ai-marketplace" className="block text-slate-400 hover:text-[#00eaff] py-1">AI Marketplace</Link>
              <Link href="/services" className="block text-slate-400 hover:text-[#00eaff] py-1">Services</Link>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Franchise</p>
              <Link href="/franchise" className="block text-slate-400 hover:text-[#00eaff] py-1">Opportunities</Link>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Jobs</p>
              <Link href="/home" className="block text-slate-400 hover:text-[#00eaff] py-1">JPS & Jobs</Link>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">About EHB</p>
              <Link href="/development" className="block text-slate-400 hover:text-[#00eaff] py-1">Development</Link>
              <Link href="/admin" className="block text-slate-400 hover:text-[#00eaff] py-1">Admin</Link>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Help Center</p>
              <Link href="/dashboard" className="block text-slate-400 hover:text-[#00eaff] py-1">Dashboard</Link>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p className="">
              EHB is a global AI-powered platform connecting services, jobs, and businesses across multiple industries.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#" className="hover:text-slate-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-300">
                Terms of Use
              </Link>
              <Link href="#" className="hover:text-slate-300">
                Company Info
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
