"use client";

import { SectionHeader } from "@/components/dmo/verification/VerificationUI";

export default function UpGuardSubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8">
        <SectionHeader title="Up-Guard Sub-Page" subtitle="Security management details" />
        <div
          className="p-6 rounded-lg border mt-8"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <p className="text-gray-400">Security details...</p>
        </div>
      </div>
    </div>
  );
}
