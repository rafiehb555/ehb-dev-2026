import { SellerOnboardingForm } from "@/components/gosellr/SellerOnboardingForm";

export const metadata = {
  title: "Become a Seller | GoSellr — EHB",
  description: "Join EHB GoSellr as a verified seller. AI + Blockchain trust. 32 industries.",
};

export default function SellerOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-10 text-white">
      <div className="mx-auto mb-8 max-w-5xl">
        <h1 className="text-3xl font-bold">Become a GoSellr Seller</h1>
        <p className="mt-2 text-sm text-white/55">
          Complete the 4-step application. Your projected Service Trust Level updates live on the right.
        </p>
      </div>
      <SellerOnboardingForm />
    </main>
  );
}
