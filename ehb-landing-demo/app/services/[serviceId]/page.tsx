export default async function ServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return (
    <div className="container-ehb py-8">
      <h1 className="text-xl font-semibold text-white">Service: {serviceId}</h1>
      <p className="text-slate-400 mt-2">Service detail – providers, pricing, booking.</p>
    </div>
  );
}
