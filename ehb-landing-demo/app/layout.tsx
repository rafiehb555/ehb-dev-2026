import "./globals.css";
import type { ReactNode } from "react";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

export const metadata = {
  title: "EHB Platform – Investor Demo",
  description: "EHB global super app – landing and development demo."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${sora.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased text-readability">
        <div className="min-h-[100dvh] flex flex-col page-mesh relative">
          {/* Fluid blob gradients – optional animation (mojoda colors) */}
          <div className="fluid-bg-blob fluid-bg-blob-1" aria-hidden />
          <div className="fluid-bg-blob fluid-bg-blob-2" aria-hidden />
          <div className="fluid-bg-blob fluid-bg-blob-3" aria-hidden />
          <div className="relative z-10 flex flex-col min-h-[100dvh]">
          <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/85 backdrop-blur-md pt-safe-t shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
            <div className="container-ehb py-3 flex items-center justify-between gap-3">
              <a href="/" className="flex items-center gap-2 min-h-touch flex-shrink-0">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-ehb.teal to-ehb.cyan flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-[0_0_20px_-6px_rgba(20,184,166,0.5)] ring-1 ring-white/10">
                  EHB
                </div>
                <div className="hidden xs:block leading-tight">
                  <span className="font-semibold text-xs sm:text-sm">EHB Platform</span>
                  <span className="text-[11px] sm:text-xs text-white/90">
                    Global Super App · Investor Demo
                  </span>
                </div>
              </a>
              <nav className="flex items-center gap-1 sm:gap-3">
                <a
                  href="/"
                  className="min-h-touch min-w-touch inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm text-white hover:text-ehb.cyan hover:bg-slate-800/60 hover:shadow-[0_0_12px_-4px_rgba(34,211,238,0.3)] transition-all duration-200"
                >
                  Landing
                </a>
                <a
                  href="/development"
                  className="min-h-touch min-w-touch inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm text-white hover:text-ehb.violet hover:bg-slate-800/60 hover:shadow-[0_0_12px_-4px_rgba(139,92,246,0.3)] transition-all duration-200"
                >
                  Development
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <footer className="border-t border-slate-800/90 bg-slate-950/85 backdrop-blur-md pb-safe-b shadow-[0_-1px_0_0_rgba(255,255,255,0.02)]">
            <div className="container-ehb py-3 flex flex-col xs:flex-row justify-between gap-2 text-[11px] sm:text-xs text-white/80">
              <span className="text-center xs:text-left">EHB · Unified global services, trust & AI platform.</span>
              <span className="text-center xs:text-right">Investor Demo · Not final production UI.</span>
            </div>
          </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

