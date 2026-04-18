import { CrbCertifyWizard } from "@/components/crb/CrbCertifyWizard";

export const metadata = {
  title: "CRB Certification | EHB",
  description: "Apply for CRB (Certification & Registry Board) verification for your skill, service, product, or company.",
};

export default function CrbCertifyPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
            Trust · CRB
          </div>
          <h1 className="text-2xl font-bold">CRB Certification</h1>
          <p className="mt-1 text-sm text-white/55">
            Get your skill, service, product, or company officially certified. This unlocks higher STL and on-chain proof.
          </p>
        </div>
        <CrbCertifyWizard />
      </div>
    </main>
  );
}
