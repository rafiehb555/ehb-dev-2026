import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">EHB Services</h1>
          <p className="text-ehb-textMuted mt-2">Browse services across industries.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/industries" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-ehb-textMuted">By industry</span>
            <p className="text-sm font-semibold text-white mt-1">Browse by industry</p>
          </Link>
          <Link href="/ai-marketplace" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-ehb-textMuted">AI tools</span>
            <p className="text-sm font-semibold text-white mt-1">AI Marketplace</p>
          </Link>
          <Link href="/home" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-ehb-textMuted">Home</span>
            <p className="text-sm font-semibold text-white mt-1">Core modules & flows</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
