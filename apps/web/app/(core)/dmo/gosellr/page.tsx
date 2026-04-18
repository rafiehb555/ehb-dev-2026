import { GoSellrDmoQueue } from "@/components/dmo/GoSellrDmoQueue";

export const metadata = {
  title: "GoSellr Review Queue | DMO — EHB",
  description: "DMO admin dashboard for approving GoSellr seller onboarding applications and assigning franchises.",
};

export default function DmoGoSellrPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <GoSellrDmoQueue />
      </div>
    </main>
  );
}
