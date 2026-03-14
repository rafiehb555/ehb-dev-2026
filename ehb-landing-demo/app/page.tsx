export default function LandingPage() {
  return (
    <div className="container-ehb section-pad space-y-5 sm:space-y-6 md:space-y-7">
      {/* Hero – advanced: gradient badge, gradient heading, mesh feel */}
      <section className="grid gap-4 sm:gap-5 md:grid-cols-[3fr,2fr] md:gap-6 items-start md:items-center">
        <div className="space-y-2 sm:space-y-3 relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-ehb.teal/60 bg-gradient-to-r from-ehb.teal/15 via-ehb.cyan/10 to-ehb.violet/10 px-3 py-1.5 text-[11px] xs:text-xs font-medium text-ehb.cyan tracking-wide shadow-[0_0_20px_-8px_rgba(34,211,238,0.4)]">
            EHB · Amazon + LinkedIn + Upwork + Web3
          </p>
          <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            <span className="text-white">Global Super App for </span>
            <span className="gradient-text">Verified Services</span>
            <span className="text-white">, </span>
            <span className="gradient-text-teal">Trust</span>
            <span className="text-white"> &amp; </span>
            <span className="gradient-text">AI Economy</span>
            <span className="text-white">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-white max-w-xl leading-relaxed">
            EHB connects 32+ industries into one unified marketplace – powered
            by STL trust scoring, PSS identity, CRB certification, DMO
            management and a full AI &amp; blockchain layer.
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            <a
              href="/development"
              className="min-h-touch btn-glow inline-flex items-center justify-center rounded-full bg-gradient-to-r from-ehb.teal to-ehb.cyan px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-950 hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-neon-teal"
            >
              View Development Map
            </a>
            <a
              href="#industries"
              className="min-h-touch inline-flex items-center justify-center rounded-full border border-slate-500 bg-slate-800/40 px-4 py-2.5 sm:py-2 text-xs font-semibold text-white hover:border-ehb.violet hover:bg-slate-800/60 hover:shadow-neon-violet active:scale-[0.98] transition-all duration-200"
            >
              Explore Industries
            </a>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 pt-3 text-[11px] xs:text-xs text-white">
            <div className="flex items-center gap-2 xs:block">
              <span className="text-base font-semibold text-white">32+</span>
              <span>Industries</span>
            </div>
            <div className="flex items-center gap-2 xs:block">
              <span className="text-base font-semibold text-white">4</span>
              <span>Core trust systems (STL, PSS, CRB, DMO)</span>
            </div>
            <div className="flex items-center gap-2 xs:block">
              <span className="text-base font-semibold text-white">1</span>
              <span>Unified AI &amp; blockchain backbone</span>
            </div>
          </div>
        </div>
        <div className="glass-card glass-card-hover card-glow space-y-1.5 sm:space-y-2 rounded-xl p-2.5 sm:p-3 text-[11px] xs:text-xs relative overflow-hidden">
          <div className="card-shine-inner rounded-xl" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />
          <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl bg-gradient-to-b from-white/40 via-white/25 to-transparent" aria-hidden />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ehb.teal/8 via-transparent to-ehb.violet/8 pointer-events-none" aria-hidden />
          <h2 className="text-xs font-semibold text-white mb-1.5 tracking-wide relative">
            EHB Verification Ecosystem
          </h2>
          <div className="space-y-2 relative">
            <EcosystemRow variant="teal" code="PSS" title="Proof & Security System" desc="KYC, identity, fraud & account security for all users and providers." />
            <EcosystemRow variant="violet" code="CRB" title="Certification & Registry Board" desc="Professional exams, license verification and industry registries." />
            <EcosystemRow variant="cyan" code="STL" title="Service Trust Level" desc="Multi-level trust score that drives ranking, visibility and eligibility." />
            <EcosystemRow variant="teal" code="DMO" title="Decentralized Management Office" desc="Business, service and franchise management for every industry." />
          </div>
        </div>
      </section>

      {/* Industries overview – section title with gradient accent */}
      <section id="industries" className="space-y-2">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-0.5">
          <h2 className="text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gradient-to-b from-ehb.cyan to-ehb.violet" />
            <span className="text-white">Connected Industries</span>
          </h2>
          <span className="text-[11px] xs:text-xs text-white">
            Reusing the same tools across 32+ industries.
          </span>
        </div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 text-[11px] xs:text-xs">
          <IndustryCard accent="teal" title="E‑commerce & Retail (GoSellr GSM)" items={["Product & wholesale marketplace", "Shared payments, reviews, logistics", "Seller dashboards & analytics"]} />
          <IndustryCard accent="violet" title="Legal Services (EHB OLS)" items={["Lawyer discovery & case management", "AI Lawyer & contract generator", "Deep verification via CRB + STL"]} />
          <IndustryCard accent="cyan" title="Medical & Health (WMS)" items={["Doctor & hospital booking", "Video consults & lab integrations", "AI diagnosis & report analysis"]} />
          <IndustryCard accent="teal" title="Jobs & HR (JPS)" items={["Global job & skill profiles", "AI CV builder & job matching", "Employer & career dashboards"]} />
          <IndustryCard accent="violet" title="Education & Learning (HPS / OBS)" items={["Courses, exams & teacher marketplace", "AI tutor & learning analytics", "Books & digital content via GoSellr"]} />
          <IndustryCard accent="cyan" title="Travel, Finance & More" items={["Travel booking with AGTS", "Unified wallet & escrow layer", "Extensible to 32+ industries"]} />
        </div>
      </section>

      {/* Investor focus */}
      <section className="space-y-2">
        <h2 className="text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-ehb.teal to-ehb.accent" />
          <span className="text-white">Why This Architecture Is Capital Efficient</span>
        </h2>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-[11px] xs:text-xs">
          <ValueCard
            title="Shared Core · Multiple Verticals"
            points={[
              "Core systems (PSS, CRB, STL, DMO, JPS, Wallet, AI, Blockchain) built once.",
              "Same booking, payments, messaging, reviews reused across industries.",
              "New industries launched mostly via configuration & data."
            ]}
          />
          <ValueCard
            title="AI‑First & Trust‑First"
            points={[
              "AI agents for search, matching, fraud, analytics & automation.",
              "Every provider scored and ranked via STL + CRB.",
              "Designed to meet regulator & enterprise expectations from day one."
            ]}
          />
          <ValueCard
            title="Franchise & Affiliate Growth Engine"
            points={[
              "Franchise tiers (country, corporate, sub) for physical expansion.",
              "Affiliate program wired into products, services and AI tools.",
              "Monetization from marketplace, subscriptions, verification & Web3."
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function EcosystemRow(props: { code: string; title: string; desc: string; variant?: "teal" | "violet" | "cyan" }) {
  const v = props.variant ?? "teal";
  const ring = v === "teal" ? "ring-ehb.teal/30" : v === "violet" ? "ring-ehb.violet/30" : "ring-ehb.cyan/30";
  const bg = v === "teal" ? "bg-ehb.teal/20" : v === "violet" ? "bg-ehb.violet/20" : "bg-ehb.cyan/20";
  const text = v === "teal" ? "text-ehb.teal" : v === "violet" ? "text-ehb.violet" : "text-ehb.cyan";
  return (
    <div className={`glass-card glass-card-hover card-3d relative flex gap-2 rounded-lg px-2 py-1.5 ring-1 ${ring} transition-shadow hover:shadow-neon-teal overflow-hidden`}>
      <div className="card-shine-inner rounded-lg" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-lg bg-gradient-to-r from-transparent via-white/45 to-transparent" aria-hidden />
      <div className="absolute left-0 top-0 bottom-0 w-px rounded-l-lg bg-gradient-to-b from-white/35 to-transparent" aria-hidden />
      <div className={`relative mt-0.5 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 rounded ${bg} ${text} text-[9px] sm:text-[10px] font-bold flex items-center justify-center`}>
        {props.code}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] xs:text-xs font-semibold text-white leading-tight">
          {props.title}
        </div>
        <div className="text-[11px] xs:text-xs text-white leading-snug">{props.desc}</div>
      </div>
    </div>
  );
}

function IndustryCard(props: { title: string; items: string[]; accent?: "teal" | "violet" | "cyan" }) {
  const a = props.accent ?? "teal";
  const borderHover = a === "teal" ? "" : a === "violet" ? "hover-glow-violet" : "hover-glow-cyan";
  const borderHoverColor = a === "teal" ? "hover:border-ehb.teal/40" : a === "violet" ? "hover:border-ehb.violet/40" : "hover:border-ehb.cyan/40";
  const accentBar = a === "teal" ? "from-ehb.teal" : a === "violet" ? "from-ehb.violet" : "from-ehb.cyan";
  const innerGradient = a === "teal" ? "from-ehb.teal/15 via-transparent to-transparent" : a === "violet" ? "from-ehb.violet/15 via-transparent to-transparent" : "from-ehb.cyan/15 via-transparent to-transparent";
  return (
    <div className={`group glass-card glass-card-hover card-3d relative rounded-xl overflow-hidden border-white/10 ${borderHoverColor} ${borderHover} transition-all duration-300 shadow-[inset_0_2px_14px_-4px_rgba(0,0,0,0.25)]`}>
      <div className="card-shine-inner rounded-xl" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl bg-gradient-to-b from-white/40 via-white/22 to-transparent" aria-hidden />
      {/* Left accent bar – mojoda color */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accentBar} to-transparent opacity-90`} aria-hidden />
      {/* Inner gradient – andar color */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${innerGradient} pointer-events-none`} aria-hidden />
      <div className="relative p-2 sm:p-2.5 pl-3 sm:pl-3 card-hover-text">
        <div className="card-title text-[11px] xs:text-xs font-semibold mb-1 leading-tight">
          {props.title}
        </div>
        <ul className="space-y-0.5 card-body text-[11px] xs:text-xs leading-snug">
          {props.items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ValueCard(props: { title: string; points: string[] }) {
  return (
    <div className="group glass-card glass-card-hover hover-glow-accent card-3d relative rounded-xl overflow-hidden border-white/10 hover:border-ehb.accent/40 transition-all duration-300 shadow-[inset_0_2px_14px_-4px_rgba(0,0,0,0.25)]">
      <div className="card-shine-inner rounded-xl" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl bg-gradient-to-b from-white/40 via-white/22 to-transparent" aria-hidden />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ehb.accent to-transparent opacity-90" aria-hidden />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ehb.accent/12 via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="relative p-2 sm:p-2.5 pl-3 sm:pl-3 card-hover-text">
        <div className="card-title text-[11px] xs:text-xs font-semibold mb-1 leading-tight">
          {props.title}
        </div>
        <ul className="space-y-0.5 card-body text-[11px] xs:text-xs leading-snug">
          {props.points.map((p) => (
            <li key={p}>• {p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

