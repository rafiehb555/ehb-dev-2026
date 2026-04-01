import React from "react";

function ValueCard({
  icon,
  title,
  desc,
  accent,
}: {
  icon: string;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl glass-panel border p-6 transition-all duration-300 card-hover"
      style={{
        borderColor: `${accent}40`,
        boxShadow: `0 0 26px ${accent}18`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center border text-xl"
          aria-hidden
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}33`,
            boxShadow: `0 0 18px ${accent}25`,
          }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export function EHBValueForEveryone() {
  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Value for Everyone</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Why EHB Works for Users, Companies, and Franchise</h2>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <ValueCard
          icon="🧑‍💼"
          title="User"
          desc="Earn from services, jobs, and products"
          accent="#22C55E"
        />
        <ValueCard
          icon="🏢"
          title="Company"
          desc="Access verified users and global customers"
          accent="#00AEEF"
        />
        <ValueCard
          icon="🏢"
          title="Franchise"
          desc="Earn from every transaction in your area"
          accent="#F59E0B"
        />
      </div>
    </section>
  );
}

