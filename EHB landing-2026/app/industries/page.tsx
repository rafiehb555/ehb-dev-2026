import Link from "next/link";
import { INDUSTRIES } from "@/lib/industry/config";

export default function IndustriesPage() {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">EHB Industries</h1>
          <p className="text-ehb-textMuted mt-2">
            32 industries — open a landing page or industry home for full services and AI tools.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/landing/${ind.slug}`}
              className="glass-panel card-hover p-4 block rounded-xl border border-white/10 hover:border-[#00eaff]/40 transition-colors"
            >
              <p className="text-sm font-semibold text-white">{ind.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{ind.shortName}</p>
              <span className="text-xs text-[#00eaff] mt-2 inline-block">Industry landing →</span>
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          <Link href="/" className="text-ehb-textMuted hover:text-[#00eaff] underline-offset-2">
            Back to main landing
          </Link>
        </p>
      </div>
    </main>
  );
}
