import { GoSellrStorefront } from "@/components/gosellr/GoSellrStorefront";

export const metadata = {
  title: "GoSellr Store | EHB",
  description: "Browse verified products from STL-certified sellers across 32 industries.",
};

export default function GoSellrStorePage() {
  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <GoSellrStorefront />
      </div>
    </main>
  );
}
