const coreSystems = [
  "AI Department",
  "Blockchain Department",
  "Finance Department",
  "Affiliate System",
  "Franchise System",
  "JPS – Job Profile & Skill",
  "Verification (PSS, CRB, STL)",
  "DMO – Decentralized Management Office"
];

const industries = [
  { name: "E‑commerce & Retail", progress: 60 },
  { name: "Legal Services", progress: 30 },
  { name: "Medical & Health", progress: 20 },
  { name: "Education & Learning", progress: 15 },
  { name: "Jobs & HR", progress: 10 },
  { name: "Travel & Tourism", progress: 5 }
];

export default function DevelopmentPage() {
  return (
    <div className="container-ehb py-6 sm:py-8 space-y-6 sm:space-y-8 text-[10px] xs:text-[11px]">
      <section className="space-y-1 sm:space-y-2">
        <h1 className="text-sm sm:text-base font-semibold text-white">
          EHB Development Center
        </h1>
        <p className="text-slate-300 text-[10px] xs:text-[11px] max-w-2xl">
          Demo control panel for tracking EHB platform architecture, progress,
          shared tools and system flows.
        </p>
      </section>

      {/* Top summary */}
      <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <SummaryCard
          title="Core Systems"
          value="8"
          subtitle="AI, Blockchain, Finance, Affiliate, Franchise, JPS, PSS/CRB/STL, DMO."
        />
        <SummaryCard
          title="Industries (Phase‑1 focus)"
          value="6 / 32"
          subtitle="E‑commerce, Legal, Medical, Education, Jobs, Travel."
        />
        <SummaryCard
          title="Shared Tools Reuse"
          value="≈70%"
          subtitle="Booking, payments, messaging, reviews, analytics shared across domains."
        />
      </section>

      {/* 1. Platform structure */}
      <Section title="1. Platform Structure">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="font-semibold text-slate-100 mb-1.5">
              Core Systems
            </div>
            <ul className="space-y-1 text-slate-300">
              {coreSystems.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="font-semibold text-slate-100 mb-1.5">
              Industries (Phase‑1)
            </div>
            <ul className="space-y-1 text-slate-300">
              <li>• E‑commerce (GoSellr GSM)</li>
              <li>• Legal Services (EHB OLS)</li>
              <li>• Medical &amp; Health (WMS)</li>
              <li>• Education &amp; Learning (HPS / OBS)</li>
              <li>• Jobs &amp; HR (JPS)</li>
              <li>• Travel &amp; Tourism (AGTS)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 2. Development progress */}
      <Section title="2. Development Progress (Demo)">
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          <ProgressBlock
            title="Core Systems"
            items={[
              { label: "AI Department", value: 40 },
              { label: "Blockchain", value: 10 },
              { label: "Finance (Wallet, Escrow)", value: 35 },
              { label: "Affiliate System", value: 20 },
              { label: "Franchise System", value: 15 },
              { label: "Verification (PSS, CRB, STL)", value: 25 }
            ]}
          />
          <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="font-semibold text-slate-100 mb-1.5 text-[10px] xs:text-[11px]">
              Industries – Phase‑1 Readiness
            </div>
            <div className="space-y-2">
              {industries.map((ind) => (
                <div key={ind.name}>
                  <div className="flex justify-between">
                    <span className="text-slate-200">{ind.name}</span>
                    <span className="text-slate-400">{ind.progress}%</span>
                  </div>
                  <ProgressBar value={ind.progress} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 3. System flow monitor */}
      <Section title="3. System Flow Monitor">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FlowCard
            title="User Flow"
            steps={[
              "User signup",
              "PSS verification",
              "JPS profile creation",
              "Service access (consumer)"
            ]}
          />
          <FlowCard
            title="Provider Flow"
            steps={[
              "Provider signup",
              "PSS identity verification",
              "CRB certification",
              "STL level assignment",
              "Service listing via DMO",
              "Orders & earnings"
            ]}
          />
          <FlowCard
            title="Franchise Flow"
            steps={[
              "Country franchise",
              "Corporate franchise",
              "Sub franchise",
              "Providers onboarding",
              "Local orders management"
            ]}
          />
        </div>
        <div className="mt-3 rounded-lg sm:rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-amber-100 text-[10px] xs:text-[11px]">
          <div className="font-semibold mb-1 flex items-center gap-1">
            ⚠ Demo Warnings (Example)
          </div>
          <ul className="space-y-1">
            <li>• AI recommendation not yet wired to marketplace listings.</li>
            <li>• Wallet escrow not fully linked to all booking flows.</li>
            <li>• STL scoring rules pending final calibration per industry.</li>
          </ul>
        </div>
      </Section>

      {/* 4–8. Maps */}
      <Section title="4. Shared Tools Map">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <MapCard
            title="Cross‑Industry Shared Tools"
            items={[
              "Booking system – Medical, Legal, Education, Travel, Local services.",
              "Payment gateway & EHB Wallet – all industries.",
              "Messaging & notifications – all industries.",
              "Reviews & ratings – marketplace + services.",
              "Analytics dashboards – DMO, franchises, affiliates."
            ]}
          />
          <MapCard
            title="Industry‑Specific Extensions"
            items={[
              "Medical: prescriptions, lab reports, medical records.",
              "Legal: contracts, case files, court documents.",
              "Education: LMS, exams, assignments, course builder.",
              "Travel: flight/hotel search, itineraries, visa flows."
            ]}
          />
        </div>
      </Section>

      <Section title="5. AI Integration Map">
        <MapCard
          title="AI Tools by Industry (Examples)"
          items={[
            "AI Lawyer – Legal (case triage, document drafting, risk analysis).",
            "AI Diagnosis – Medical (symptom triage, report explanation).",
            "AI Resume Builder – Jobs (CV generation & optimization).",
            "AI Course Tutor – Education (adaptive learning paths).",
            "AI Business Advisor – Commerce & SME services."
          ]}
        />
      </Section>

      <Section title="6. Affiliate Integration Map">
        <MapCard
          title="Affiliate Touchpoints"
          items={[
            "Product affiliate (GoSellr GSM).",
            "Services affiliate (doctors, lawyers, local experts).",
            "AI tools affiliate (AI marketplace).",
            "Franchise recruitment affiliate (lead generation)."
          ]}
        />
      </Section>

      <Section title="7. Franchise System Map">
        <MapCard
          title="Franchise Hierarchy"
          items={[
            "Global Super Admin – overall control & policy.",
            "Country Franchise – country‑level operations & validation.",
            "Corporate Franchise – city/sector operations.",
            "Sub Franchise – local onboarding, inspections, support."
          ]}
        />
      </Section>

      <Section title="8. Industries Development Map">
        <p className="text-slate-300 mb-2 text-[10px] xs:text-[11px]">
          High‑level snapshot of which industries are prioritized for Phase‑1
          and how much of their demo stack is in place.
        </p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="font-semibold text-slate-100 mb-1.5 text-[10px] xs:text-[11px]">
                {ind.name}
              </div>
              <ProgressBar value={ind.progress} />
              <p className="mt-1 text-slate-400">
                Demo readiness: <span className="font-semibold">{ind.progress}%</span>
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function SummaryCard(props: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="text-[10px] xs:text-[11px] font-semibold text-slate-200 mb-1">
        {props.title}
      </div>
      <div className="text-base sm:text-lg font-semibold text-white">{props.value}</div>
      <div className="mt-1 text-[10px] xs:text-[11px] text-slate-400">{props.subtitle}</div>
    </div>
  );
}

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-[11px] sm:text-xs font-semibold text-slate-100">{props.title}</h2>
      {props.children}
    </section>
  );
}

function ProgressBlock(props: {
  title: string;
  items: { label: string; value: number }[];
}) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="font-semibold text-slate-100 mb-1.5 text-[10px] xs:text-[11px]">
        {props.title}
      </div>
      <div className="space-y-2">
        {props.items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between">
              <span className="text-slate-200">{item.label}</span>
              <span className="text-slate-400">{item.value}%</span>
            </div>
            <ProgressBar value={item.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-ehb.teal"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function FlowCard(props: { title: string; steps: string[] }) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="font-semibold text-slate-100 mb-1.5 text-[10px] xs:text-[11px]">
        {props.title}
      </div>
      <ol className="space-y-1 text-slate-300">
        {props.steps.map((s, i) => (
          <li key={s}>
            <span className="text-slate-500 mr-1">{i + 1}.</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function MapCard(props: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="font-semibold text-slate-100 mb-1.5 text-[10px] xs:text-[11px]">
        {props.title}
      </div>
      <ul className="space-y-1 text-slate-300">
        {props.items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

