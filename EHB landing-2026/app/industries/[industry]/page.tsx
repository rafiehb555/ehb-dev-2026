import Link from "next/link";
import { redirect } from "next/navigation";
import { getIndustryBySlug } from "@/lib/industry/config";

/** Old `/industries/[encoded title]` links from the previous template. */
const LEGACY_TITLE_TO_SLUG: Record<string, string> = {
  "e‑commerce & retail": "retail",
  "e-commerce & retail": "retail",
  "legal services": "law",
  "medical & health": "health",
  "education & learning": "education",
  "jobs & hr": "hr",
  "travel & tourism": "travel",
};

export default async function LegacyIndustryRoute({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry: raw } = await params;
  const decoded = decodeURIComponent(raw).trim();
  const asSlug = decoded.toLowerCase().replace(/\s+/g, "-");

  const direct = getIndustryBySlug(asSlug) ?? getIndustryBySlug(decoded);
  if (direct) redirect(`/industry/${direct.slug}`);

  const legacy = LEGACY_TITLE_TO_SLUG[decoded.toLowerCase()];
  if (legacy) {
    const ind = getIndustryBySlug(legacy);
    if (ind) redirect(`/industry/${ind.slug}`);
  }

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/industries" className="text-xs text-slate-400 hover:text-[#00eaff] transition-colors">
            ← All industries
          </Link>
        </div>
        <div className="glass-panel card-hover p-6 rounded-xl border border-white/10">
          <h1 className="text-xl font-semibold text-white">Industry not found</h1>
          <p className="text-slate-400 mt-2">
            Use a URL like <code className="text-slate-300">/industry/health</code> or choose from the full list.
          </p>
          <Link href="/industries" className="inline-flex mt-4 text-sm font-medium text-[#00eaff] hover:underline">
            Browse all 32 industries →
          </Link>
        </div>
      </div>
    </main>
  );
}
