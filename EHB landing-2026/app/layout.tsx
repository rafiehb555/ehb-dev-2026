import "./globals.css";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { IndustriesBar } from "@/components/IndustriesBar";
import { TopNavTabs } from "@/components/TopNavTabs";
import { HeaderSearch } from "@/components/HeaderSearch";
import { NotificationsBell } from "@/components/NotificationsBell";

/** Ships with HTML so base theme applies even if `/_next/static/css/*.css` fails to load. */
const EHB_CRITICAL_CSS = `
html{-webkit-text-size-adjust:100%;background-color:#0d1017!important}
body{margin:0;min-height:100vh;background-color:#0d1017!important;color:#e5e7eb;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
main{background:transparent!important}
`;

/** EHB_UIUX_DESIGN_PLAN.md — primary UI font Inter */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: EHB_CRITICAL_CSS }} />
      </head>
      <body className="min-h-screen font-sans text-white antialiased text-readability">
        <div className="min-h-[100dvh] flex flex-col page-mesh relative">
          {/* Center shine – hero jaisi lighting beech mein */}
          <div className="fixed inset-0 pointer-events-none z-0" aria-hidden style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(41, 171, 226, 0.07) 0%, rgba(51, 195, 255, 0.04) 35%, transparent 60%)',
          }} />
          <div className="relative z-10 flex flex-col min-h-[100dvh]">
          {process.env.NODE_ENV === "development" ? (
            <div className="bg-amber-950/50 border-b border-amber-500/25 px-3 py-2 text-center text-[11px] sm:text-xs text-amber-50/95 leading-snug">
              <span className="text-amber-200/90">Dev:</span>{" "}
              <Link href="/local-demo" className="font-semibold text-cyan-200 underline underline-offset-2 hover:text-cyan-100">
                Local demo guide
              </Link>
              {" · "}
              <code className="text-amber-100/90">/api/…</code> routes return JSON — open UI pages from the guide, not raw API URLs.
            </div>
          ) : null}
          <header className="nav-glass sticky top-0 z-50 pt-safe-t">
            <div className="container-ehb py-3 flex items-center justify-between gap-3 flex-wrap">
              <a href="/" className="flex items-center gap-2 min-h-touch flex-shrink-0">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-950/10 flex items-center justify-center flex-shrink-0 shadow-neon-electric ring-1 ring-white/20 overflow-hidden">
                  <Image
                    src="/ehb-logo.png"
                    alt="EHB logo"
                    width={40}
                    height={40}
                    priority
                    className="object-contain h-full w-full"
                  />
                </div>
                <div className="hidden xs:block leading-tight">
                  <span className="font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide">
                    EHB TECHNOLOGIES (Pvt.) Ltd.
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-ehb-textBody block">
                    EDUCATION · HEALTH · BUSINESS
                  </span>
                </div>
              </a>
              {/* Global search – routes to best matching industry landing page */}
              <HeaderSearch />
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <TopNavTabs />
                <NotificationsBell />
                <span className="text-xs sm:text-sm font-semibold text-[#33C3FF] whitespace-nowrap">850.00 EHBGC</span>
              </div>
            </div>
          </header>
          <IndustriesBar />
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <footer className="nav-glass border-t border-white/5 pb-safe-b">
            <div className="container-ehb py-3 flex flex-col xs:flex-row justify-between gap-2 text-[11px] sm:text-xs text-ehb-textMuted">
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

