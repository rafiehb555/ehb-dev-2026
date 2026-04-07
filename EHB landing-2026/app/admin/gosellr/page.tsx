import Link from "next/link";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";

export default function AdminGosellrPage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const locationQs = (() => {
    const countryCode = searchParams?.country?.trim() || "";
    const stateCode = searchParams?.state?.trim() || "";
    const cityCode = searchParams?.city?.trim() || "";
    const sp = new URLSearchParams();
    if (countryCode) sp.set("country", countryCode);
    if (stateCode) sp.set("state", stateCode);
    if (cityCode) sp.set("city", cityCode);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  })();

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Admin Â· GoSellr</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">Products Marketplace Control</h1>
            <p className="text-ehb-textBody max-w-2xl">
              Configure verified product listings, cart flows and order settlements (demo UI).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              â† Back to Super Admin
            </Link>
            <Link
              href={`/gosellr${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#22b14c] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              Open GoSellr
            </Link>
          </div>
        </header>

        <UniversalStructuredAdminBlocks />
      </div>
    </main>
  );
}

