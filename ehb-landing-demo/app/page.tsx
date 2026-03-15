import Link from "next/link";
import { INDUSTRIES } from "@/lib/industries";
import { LandingStats } from "@/components/LandingStats";
import { IndustryCard } from "@/components/IndustryCard";
import { HeroVisual } from "@/components/HeroVisual";
import { HeroParticles } from "@/components/HeroParticles";
import { SectionReveal } from "@/components/SectionReveal";

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
      {/* Section 1 — Hero Ultra: AI ecosystem visual, gradient bg, trust indicators */}
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-4">
              Verified Global Service Ecosystem
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text max-w-2xl mx-auto lg:mx-0 mb-6">
              EHB – The World&apos;s First Verified Global Service Ecosystem
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8">
              A unified platform connecting services, jobs, products, and businesses across 32 industries powered by AI.
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
              32+ Industries &nbsp;·&nbsp; 700+ Services &nbsp;·&nbsp; AI Powered Platform
            </p>
          </div>
          <div className="lg:col-span-6 flex justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      <SectionDivider />
      {/* Section 2 — EHB Core Features (3 cols × 2 rows) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Platform</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-10">EHB Core Features</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 card-gap-ultra">
          {[
            { title: "AI Marketplace", desc: "An intelligent marketplace that connects service providers and clients based on demand, location, and expertise.", href: "/ai-marketplace", icon: "◇" },
            { title: "GoSellr Global Commerce", desc: "A modern marketplace enabling businesses to sell products and reach customers worldwide.", href: "/ai-marketplace", icon: "▣" },
            { title: "JPS Professional Profiles", desc: "Verified professional profiles showcasing skills, services, and work experience.", href: "/home", icon: "◎" },
            { title: "Franchise Ecosystem", desc: "Local franchise partners managing service ecosystems and supporting businesses in their cities.", href: "/franchise", icon: "⬡" },
            { title: "AI Analytics", desc: "Demand prediction, insights, and business intelligence powered by AI across all industries.", href: "/dashboard", icon: "▤" },
            { title: "Global Ecosystem", desc: "One identity, one wallet, and one platform for services, jobs, and products worldwide.", href: "/", icon: "◈" },
          ].map(({ title, desc, href, icon }) => (
            <Link key={title} href={href} className="block rounded-2xl glass-card card-hover p-6 border border-white/10 hover:border-[#00eaff]/30 hover:shadow-neon-blue/30 transition-all duration-300">
              <span className="text-2xl text-[#00eaff] mb-3 block" aria-hidden>{icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 3 — 32 Industries Overview (4 cols, accent colors + icons + hover glow) */}
      <SectionReveal as="div">
      <section id="industries" className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Ecosystem</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">32 Industries Overview</h2>
        <p className="text-slate-400 max-w-2xl mb-10">
          Every industry uses the same trusted platform. Click a card to open its landing page.
        </p>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 card-gap-ultra">
          {INDUSTRIES.map((ind) => (
            <IndustryCard key={ind.slug} industry={ind} />
          ))}
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 4 — AI Intelligence (left description, right viz) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Intelligence</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">AI Intelligence System</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6">
            <p className="text-slate-400 max-w-xl mb-8">
              EHB uses artificial intelligence to analyze market demand, connect users with the right services, and provide smart business insights.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {["AI demand prediction", "AI smart matching", "AI affiliate insights", "AI fraud detection"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl glass-panel border border-white/10 px-4 py-3 hover:border-[#00eaff]/30 transition-colors">
                  <span className="h-2 w-2 rounded-full bg-[#00eaff] shrink-0" />
                  <span className="text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 rounded-2xl glass-card border border-[#00eaff]/20 p-8 min-h-[240px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,234,255,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
            <div className="relative text-center text-slate-400">
              <p className="text-[10px] uppercase tracking-widest mb-2">Data visualization</p>
              <div className="flex justify-center gap-2 mt-4 items-end h-20">
                {[40, 65, 45, 80, 55].map((h, i) => (
                  <div key={i} className="w-2 rounded-t bg-[#00eaff]/50 animate-float" style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 5 — Marketplace Preview (3 cols) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Live</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Marketplace Preview</h2>
        <p className="text-slate-400 max-w-2xl mb-8">
          Trending services, top products, and verified providers on EHB.
        </p>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { category: "Trending Services", name: "Web Development", meta: "IT · Verified" },
            { category: "Trending Services", name: "Delivery Services", meta: "Logistics · Verified" },
            { category: "Top Products", name: "Graphic Design", meta: "Creative · Verified" },
            { category: "Verified Providers", name: "Laptop Store", meta: "GoSellr · Top rated" },
          ].map(({ category, name, meta }) => (
            <Link key={name} href="/ai-marketplace" className="block rounded-2xl glass-card card-hover p-6 border border-white/10 hover:border-[#00eaff]/30">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{category}</p>
              <p className="text-lg font-semibold text-white mt-1">{name}</p>
              <p className="text-xs text-slate-400 mt-1">{meta}</p>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/ai-marketplace" className="text-sm font-medium text-[#00eaff] hover:underline">
            Explore full marketplace →
          </Link>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 6 — Franchise (3 cols) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Growth</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Franchise Opportunities</h2>
        <p className="text-slate-400 max-w-2xl mb-10">
          Become an EHB Franchise Partner and manage your city&apos;s service ecosystem.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { city: "Islamabad Franchise", investment: "$5,000", revenue: "$2,500" },
            { city: "Lahore Franchise", investment: "$5,000", revenue: "$2,200" },
            { city: "Karachi Franchise", investment: "$6,000", revenue: "$2,800" },
          ].map(({ city, investment, revenue }) => (
            <div key={city} className="rounded-2xl glass-card card-hover p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">{city}</h3>
              <p className="text-xs text-slate-400">Investment</p>
              <p className="text-sm font-medium text-[#00eaff]">{investment}</p>
              <p className="text-xs text-slate-400 mt-2">Potential Monthly Revenue</p>
              <p className="text-sm text-slate-200">{revenue}</p>
              <Link href="/franchise" className="mt-4 inline-block text-xs font-medium text-[#00eaff] hover:underline">Learn more →</Link>
            </div>
          ))}
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 7 — Platform Statistics (4 cols) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Scale</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-10">Platform Statistics</h2>
        <LandingStats />
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 8 — Global Vision (centered) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Mission</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Global Vision</h2>
        <div className="max-w-2xl rounded-2xl glass-card p-8 border border-[#8b5cf6]/20">
          <p className="text-slate-300 text-lg leading-relaxed">
            Our mission is to build the world&apos;s most trusted global service ecosystem where people can offer skills, products, and services across industries.
          </p>
        </div>
      </section>
      </SectionReveal>

      <SectionDivider />
      {/* Section 9 — CTA (glow gradient) */}
      <SectionReveal as="div">
      <section className="container-ultra section-pad-ultra">
        <div className="rounded-2xl glass-card p-10 md:p-14 text-center border border-[#00eaff]/20 bg-gradient-to-b from-[#00eaff]/[0.06] via-transparent to-[#8b5cf6]/[0.04]">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Start Your Journey with EHB</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Create your profile, explore services, or become a franchise partner.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-8 py-3.5 text-sm font-semibold text-slate-950 btn-glow"
            >
              Create Profile
            </Link>
            <Link
              href="/ai-marketplace"
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Explore Services
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
          <p className="mt-10 pt-6 border-t border-white/5 text-center text-slate-500 text-[11px]">
            EHB · The World&apos;s First Verified Global Service Ecosystem · Investor Demo
          </p>
        </div>
      </section>
    </main>
  );
}
