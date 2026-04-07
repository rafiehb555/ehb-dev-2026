import Link from "next/link";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/services" className="text-xs text-ehb-textMuted hover:text-[#00eaff] transition-colors">← Services</Link>
        </div>
        <div className="glass-panel card-hover p-6">
          <h1 className="text-xl font-semibold text-white">Service: {serviceId}</h1>
          <p className="text-ehb-textMuted mt-2">Service detail – providers, pricing, booking. Connect real data later.</p>
        </div>
      </div>
    </main>
  );
}
