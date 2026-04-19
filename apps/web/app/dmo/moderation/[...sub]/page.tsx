"use client";

import { SectionHeader } from "@/components/dmo/verification/VerificationUI";

export default function ModerationSubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0C0E1A" }}>
      <div className="p-8">
        <SectionHeader title="Moderation Sub-Page" subtitle="Content review details" />
        <div
          className="p-6 rounded-lg border mt-8"
          style={{
            backgroundColor: "#13162A",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <p className="text-gray-400">Moderation details...</p>
        </div>
      </div>
    </div>
  );
}
