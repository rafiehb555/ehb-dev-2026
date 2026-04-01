import Link from "next/link";
import Sidebar from "@/components/dmo/Sidebar";

export default function DmoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-white">
      <div className="sticky top-0 h-screen w-[320px] p-3 hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F14]/90 backdrop-blur-xl">
          <div className="container-ehb py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">DMO Workspace</p>
                <p className="text-sm text-slate-300">Sidebar ke sab modules me yeh top controls visible rahenge.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/dmo" className="ehb-btn-primary ehb-press">
                  DMO Dashboard
                </Link>
                <Link href="/home" className="ehb-btn-secondary ehb-press">
                  EHB Home
                </Link>
                <Link href="/" className="ehb-btn-secondary ehb-press">
                  EHB Landing
                </Link>
                <Link href="/admin" className="ehb-btn-secondary ehb-press">
                  Super Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

