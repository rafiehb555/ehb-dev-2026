"use client";

import Link from "next/link";
import { CSSProperties } from "react";

export default function GoSellrPage() {
  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center">
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", textAlign: "center" }} className="space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">GoSellr Marketplace</h1>
          <p className="text-gray-400">
            AI-powered global marketplace with blockchain trust verification and transparent commission splits.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Link href="/gosellr/products">
            <button
              style={{
                background: "linear-gradient(135deg, #F0A030 0%, #E8942A 100%)",
                boxShadow: "0 4px 12px rgba(240, 160, 48, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              } as CSSProperties}
              className="w-full py-3 rounded-lg text-sm font-semibold text-gray-900 hover:shadow-lg transition-all"
            >
              Browse Products
            </button>
          </Link>
          <Link href="/gosellr/products/prod-001">
            <button
              style={{
                backgroundColor: "rgba(51, 195, 255, 0.15)",
                borderColor: "rgba(51, 195, 255, 0.5)",
              } as CSSProperties}
              className="w-full border py-3 rounded-lg text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10 transition-all"
            >
              View Sample Product
            </button>
          </Link>
        </div>

        {/* Features */}
        <div
          style={{
            backgroundColor: "rgba(19, 22, 42, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          } as CSSProperties}
          className="rounded-[12px] border p-6 space-y-4 text-left"
        >
          <h2 className="text-lg font-semibold text-white">Features</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Advanced filtering by price, rating, STL level, and category</li>
            <li>✓ Transparent STL trust chain visualization</li>
            <li>✓ Seller verification badges (PSS, CRB)</li>
            <li>✓ AI recommendations (Customers Also Bought)</li>
            <li>✓ Commission transparency (85% seller, 10% franchise, 5% platform)</li>
            <li>✓ Mock data with 12+ realistic products</li>
            <li>✓ Responsive grid design (4-col → 2-col → 1-col)</li>
            <li>✓ Product detail page with full trust chain breakdown</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
