import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">EHB Dashboard</h1>
          <p className="text-slate-400 mt-2">Profile, bookings, wallet, affiliate, settings.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/wallet" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Wallet</span>
            <p className="text-sm font-semibold text-white mt-1">Balance & earnings</p>
          </Link>
          <Link href="/home" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Home</span>
            <p className="text-sm font-semibold text-white mt-1">Operations view</p>
          </Link>
          <Link href="/ai-marketplace" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">AI Market</span>
            <p className="text-sm font-semibold text-white mt-1">Tools & products</p>
          </Link>
          <Link href="/settings" className="glass-panel card-hover p-4 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Settings</span>
            <p className="text-sm font-semibold text-white mt-1">Account & preferences</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
