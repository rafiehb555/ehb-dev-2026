import Link from "next/link";

export function DmoTopNav() {
  return (
    <section className="bg-white/[0.04] hover:bg-white/[0.06] transition-colors p-3 sm:p-4 border border-white/10">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Link
            href="/dmo/super-admin"
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#33C3FF]/10 border border-[#33C3FF]/30 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#33C3FF]/15 transition-all"
          >
            Super Admin Panel
          </Link>
          <Link
            href="/dmo"
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/70 hover:bg-white/10 transition-all"
          >
            DMO User Side
          </Link>
          <Link
            href="/dmo/franchise"
            className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/70 hover:bg-white/10 transition-all"
          >
            Franchise Model
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/50">
          <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 border border-white/10">Top navigation</span>
          <span>All DMO routes</span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {[
          { href: "/dmo/franchise/country", title: "Country Franchise" },
          { href: "/dmo/franchise/corporate", title: "Corporate Franchise" },
          { href: "/dmo/franchise/master", title: "Master Franchise" },
          { href: "/dmo/franchise/sub", title: "Sub Franchise" },
        ].map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="min-h-[44px] inline-flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2 text-[11px] text-white/70 hover:bg-white/5 transition-all"
          >
            {i.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

