import "./globals.css";
import type { ReactNode } from "react";
import Image from "next/image";
import { Sora } from "next/font/google";
import { IndustriesBar } from "@/components/IndustriesBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GlobalAiStatus } from "@/components/GlobalAiStatus";
import { TopNavTabs } from "@/components/TopNavTabs";

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
      <body className="min-h-screen font-sans text-slate-100 antialiased text-readability">
        <div className="min-h-[100dvh] flex flex-col page-mesh relative">
          {/* Center shine – hero jaisi lighting beech mein */}
          <div className="fixed inset-0 pointer-events-none z-0" aria-hidden style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0, 234, 255, 0.06) 0%, rgba(0, 174, 239, 0.03) 35%, transparent 60%)',
          }} />
          <div className="relative z-10 flex flex-col min-h-[100dvh]">
          <header className="nav-glass sticky top-0 z-50 pt-safe-t">
            <div className="container-ehb py-3 flex items-center justify-between gap-3 flex-wrap">
              <a href="/" className="flex items-center gap-2 min-h-touch flex-shrink-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-950/10 flex items-center justify-center flex-shrink-0 shadow-neon-electric ring-1 ring-white/20 overflow-hidden">
                  <Image
                    src="/ehb-logo.png"
                    alt="EHB logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="hidden xs:block leading-tight">
                  <span className="font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide">
                    EHB TECHNOLOGIES PRIVATE LIMITED
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-300 block">
                    EDUCATION · HEALTH · BUSINESS
                  </span>
                </div>
              </a>
              {/* Responsive search bar – full width on mobile, centered on desktop */}
              <div className="flex-1 min-w-[180px] w-full order-3 sm:order-none max-w-xl mx-0 sm:mx-2">
                <div className="flex items-center gap-2 rounded-xl glass-panel px-3 sm:px-4 py-1.5 sm:py-2 w-full text-[11px] sm:text-sm text-slate-400">
                  <span aria-hidden>🔍</span>
                  <span className="truncate">
                    Search apps, games, education, franchises...
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <TopNavTabs />
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-full h-7 w-7 text-xs text-slate-200 hover:bg-white/5 transition-colors"
                  aria-label="Notifications"
                >
                  <span aria-hidden>🔔</span>
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] px-[3px] rounded-full bg-rose-500 text-[9px] font-semibold text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <span className="text-xs sm:text-sm font-semibold text-[#00eaff] whitespace-nowrap">850.00 EHBGC</span>
              </div>
            </div>
          </header>
          <GlobalAiStatus />
          <Breadcrumb />
          <IndustriesBar />
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <footer className="nav-glass border-t border-white/5 pb-safe-b">
            <div className="container-ehb py-3 flex flex-col xs:flex-row justify-between gap-2 text-[11px] sm:text-xs text-slate-400">
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

