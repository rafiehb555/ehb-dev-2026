import { getIndustry } from "@ehb/industry-registry";

export default function AgtsPage() {
  const industry = getIndustry("agts");
  if (!industry) return null;

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">
            {industry.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            {industry.name}
          </h1>
          <p className="text-ehb-textMuted max-w-2xl text-sm">
            AGTS — Travel hub powered by the EHB trust stack (PSS · CRB · DMO · STL).
          </p>
        </header>

        <section className="rounded-2xl glass-card border p-6 text-sm text-ehb-textBody">
          <p className="opacity-80">Status: <span className="font-semibold text-white">{industry.status}</span></p>
          <p className="opacity-60 mt-2">Page content is being prepared. This route is auto-registered via industry-registry.</p>
        </section>
      </div>
    </main>
  );
}
