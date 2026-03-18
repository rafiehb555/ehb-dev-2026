import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div className="glass-panel card-hover p-6">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">EHB Landing</h1>
          <p className="text-slate-400 mt-2">Landing page – EHB Super App.</p>
          <Link href="/" className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-4 py-2 text-sm font-semibold text-slate-950 btn-glow">Go to main landing</Link>
        </div>
      </div>
    </main>
  );
}
