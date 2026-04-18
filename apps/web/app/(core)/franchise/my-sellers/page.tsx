import { FranchiseSellersPanel } from "@/components/franchise/FranchiseSellersPanel";

export const metadata = {
  title: "My Sellers | Franchise — EHB",
  description: "Sellers assigned to your franchise after DMO approval.",
};

export default function FranchiseMySellersPage() {
  return (
    <main className="min-h-screen bg-[#080A14] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <FranchiseSellersPanel />
      </div>
    </main>
  );
}
