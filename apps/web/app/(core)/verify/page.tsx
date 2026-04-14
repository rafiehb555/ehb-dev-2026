import { PssVerificationWizard } from "@/components/pss/PssVerificationWizard";

export const metadata = {
  title: "PSS Verification | EHB",
  description: "Complete Personal Security System verification — KYC, liveness, AML. Boost your Service Trust Level.",
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-10 text-white">
      <div className="mx-auto mb-8 max-w-6xl">
        <h1 className="text-3xl font-bold">Verify Your Identity</h1>
        <p className="mt-2 text-sm text-white/55">
          Complete all 4 PSS phases to unlock higher STL levels across all 32 EHB industries.
        </p>
      </div>
      <PssVerificationWizard />
    </main>
  );
}
