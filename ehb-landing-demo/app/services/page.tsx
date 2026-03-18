import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">EHB Services</h1>
          <p className="text-slate-400 mt-2">Browse services across industries.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/industries" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">By industry</span>
            <p className="text-sm font-semibold text-white mt-1">Browse by industry</p>
          </Link>
          <Link href="/ai-marketplace" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">AI tools</span>
            <p className="text-sm font-semibold text-white mt-1">AI Marketplace</p>
          </Link>
          <Link href="/home" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Home</span>
            <p className="text-sm font-semibold text-white mt-1">Core modules & flows</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
