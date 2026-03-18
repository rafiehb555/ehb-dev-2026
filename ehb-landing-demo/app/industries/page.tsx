import Link from "next/link";

const sampleIndustries = [
  "E‑commerce & Retail",
  "Legal Services",
  "Medical & Health",
  "Education & Learning",
  "Jobs & HR",
  "Travel & Tourism"
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">EHB Industries</h1>
          <p className="text-slate-400 mt-2">32 industries – browse by industry.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {sampleIndustries.map((name) => (
            <Link key={name} href={`/industries/${encodeURIComponent(name)}`} className="glass-panel card-hover p-4 block">
              <p className="text-sm font-semibold text-white">{name}</p>
              <span className="text-xs text-slate-400 mt-1">Browse services →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
