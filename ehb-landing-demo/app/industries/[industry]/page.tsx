export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  return (
    <div className="container-ehb py-8">
      <h1 className="text-xl font-semibold text-white">
        Industry: {decodeURIComponent(industry)}
      </h1>
      <p className="text-slate-400 mt-2">Industry template – same UI, different data.</p>
    </div>
  );
}
