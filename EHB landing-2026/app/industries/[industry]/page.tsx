import Link from "next/link";

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const name = decodeURIComponent(industry);
  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/industries" className="text-xs text-slate-400 hover:text-[#00eaff] transition-colors">← Industries</Link>
        </div>
        <div className="glass-panel card-hover p-6">
          <h1 className="text-xl font-semibold text-white">Industry: {name}</h1>
          <p className="text-slate-400 mt-2">Industry template – same UI, different data. Services and providers will load here.</p>
        </div>
      </div>
    </main>
  );
}
