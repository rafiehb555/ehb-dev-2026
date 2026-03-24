import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden page-mesh-new text-ehbNew-white">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* EHB brand – new theme */}
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 glass-panel-new border border-ehbNew-border/80 hover:shadow-neon-emerald hover:border-ehbNew-emerald/50 transition-all duration-300"
          >
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-ehbNew-emerald to-ehbNew-violet flex items-center justify-center text-sm font-bold text-ehbNew-bg shadow-neon-emerald">
              EHB
            </span>
            <span className="text-sm font-semibold text-ehbNew-white">
              EHB Platform · Global Super App
            </span>
          </Link>
        </div>

        {/* Main 404 card – new theme only */}
        <div className="w-full max-w-lg mx-auto glass-card-new card-hover-new relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center">
          {/* 404 – new gradient + glow */}
          <div className="relative mb-3">
            <span
              className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter gradient-text-new"
              style={{
                textShadow: "0 0 50px rgba(16, 185, 129, 0.35), 0 0 100px rgba(167, 139, 250, 0.2)",
              }}
            >
              404
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ehbNew-white mb-2">
            Page not found
          </h1>
          <p className="text-ehbNew-muted text-sm sm:text-base max-w-sm mx-auto mb-6">
            Yeh page maujood nahi ya URL galat hai. EHB Home se dubara shuru karein.
          </p>

          {/* Helper – dev server tip */}
          <div className="rounded-xl p-4 mb-6 text-left border border-ehbNew-border/60 bg-ehbNew-surfaceSoft/80 backdrop-blur">
            <p className="text-xs text-ehbNew-muted leading-relaxed">
              Agar aapko ye 404 dikh raha hai to dev server{" "}
              <code className="px-1.5 py-0.5 rounded bg-ehbNew-surface text-ehbNew-emerald font-mono text-[11px]">
                ehb-landing-demo
              </code>{" "}
              folder se chalao, aur browser mein terminal mein jo port likha ho (jaise{" "}
              <code className="px-1.5 py-0.5 rounded bg-ehbNew-surface text-ehbNew-amber font-mono text-[11px]">
                localhost:3007
              </code>
              ) wohi URL open karein.
            </p>
          </div>

          {/* Primary CTA – new theme gradient */}
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ehbNew-emerald to-ehbNew-violet px-8 py-3.5 text-sm font-semibold text-ehbNew-bg btn-glow-new shadow-neon-emerald"
          >
            <span>EHB Home par jao</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>

          {/* Quick links – new theme pills */}
          <div className="mt-8 pt-6 border-t border-ehbNew-border/50">
            <p className="text-xs text-ehbNew-muted mb-3">Tez links</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/landing" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                Landing
              </Link>
              <Link href="/home" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                Home
              </Link>
              <Link href="/ai-marketplace" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                AI Market
              </Link>
              <Link href="/development" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                Development
              </Link>
              <Link href="/admin" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                Admin
              </Link>
              <Link href="/dmo" className="px-3 py-1.5 rounded-full glass-panel-new text-xs text-ehbNew-muted hover:text-ehbNew-emerald hover:shadow-neon-emerald transition-all duration-200">
                DMO
              </Link>
            </div>
          </div>
        </div>

        <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-ehbNew-muted">
          EHB · Unified global services, trust & AI platform · Investor Demo
        </p>
      </div>
    </div>
  );
}
