import { GoSellrUserFlow } from "@/components/gosellr/GoSellrUserFlow";

export const metadata = {
  title: "My Seller Journey | GoSellr — EHB",
  description: "Track every gate of your GoSellr seller activation — PSS, CRB, DMO, Franchise, STL.",
};

export default function GoSellrJourneyPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <GoSellrUserFlow />
      </div>
    </main>
  );
}
