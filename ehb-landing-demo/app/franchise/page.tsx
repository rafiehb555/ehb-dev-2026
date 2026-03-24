import Link from "next/link";

export default function FranchisePage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">EHB Franchise</h1>
          <p className="text-slate-400 mt-2">Country / Corporate / Sub franchise – apply & revenue.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel card-hover p-4">
            <h2 className="text-sm font-semibold text-white mb-1">Country Franchise</h2>
            <p className="text-slate-300 text-xs">Operate EHB at country level. Apply for rights and revenue share.</p>
            <Link href="/admin" className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-xs font-semibold text-slate-950 btn-glow">Learn more</Link>
          </div>
          <div className="glass-panel card-hover p-4">
            <h2 className="text-sm font-semibold text-white mb-1">Inspection Dashboard</h2>
            <p className="text-slate-300 text-xs">Assigned CRB inspections. Upload report & score for CRB decision.</p>
            <Link
              href="/franchise/inspections"
              className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-xs font-semibold text-slate-950 btn-glow"
            >
              Open inspections
            </Link>
          </div>
          <div className="glass-panel card-hover p-4">
            <h2 className="text-sm font-semibold text-white mb-1">Master Franchise</h2>
            <p className="text-slate-300 text-xs">
              Control multiple cities or regions under one license. Manage corporate and sub franchise partners.
            </p>
            <Link
              href="/admin"
              className="mt-3 inline-flex items-center rounded-full glass-panel px-4 py-2 text-xs font-semibold text-slate-200 hover:shadow-neon-blue transition-all"
            >
              Learn more
            </Link>
          </div>
          <div className="glass-panel card-hover p-4">
            <h2 className="text-sm font-semibold text-white mb-1">Corporate Franchise</h2>
            <p className="text-slate-300 text-xs">City or sector operations. Onboard providers and manage orders.</p>
            <Link href="/admin" className="mt-3 inline-flex items-center rounded-full glass-panel px-4 py-2 text-xs font-semibold text-slate-200 hover:shadow-neon-blue transition-all">Learn more</Link>
          </div>
          <div className="glass-panel card-hover p-4">
            <h2 className="text-sm font-semibold text-white mb-1">Sub Franchise</h2>
            <p className="text-slate-300 text-xs">Local onboarding, inspections, support. Part of corporate network.</p>
            <Link href="/admin" className="mt-3 inline-flex items-center rounded-full glass-panel px-4 py-2 text-xs font-semibold text-slate-200 hover:shadow-neon-blue transition-all">Learn more</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
