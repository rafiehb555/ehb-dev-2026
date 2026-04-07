import Link from "next/link";
import React from "react";

function ValueCard({
  icon,
  title,
  desc,
  accent,
  href,
}: {
  icon: string;
  title: string;
  desc: string;
  accent: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl glass-panel border p-6 transition-all duration-300 card-hover hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
      style={{
        borderColor: `${accent}40`,
        boxShadow: `0 0 26px ${accent}18`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center border text-xl shrink-0"
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
          <p className="text-[11px] text-ehb-textBody mt-1 leading-relaxed">{desc}</p>
          <p className="text-[10px] font-medium text-cyan-400/80 mt-2 group-hover:text-cyan-300">Go →</p>
        </div>
      </div>
    </Link>
  );
}

export function EHBValueForEveryone() {
  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Value for Everyone</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Why EHB Works for Users, Companies, and Franchise</h2>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <ValueCard
          icon="🧑‍💼"
          title="User"
          desc="Earn from services, jobs, and products"
          accent="#22C55E"
          href="/home"
        />
        <ValueCard
          icon="🏢"
          title="Company"
          desc="Access verified users and global customers"
          accent="#00AEEF"
          href="/services"
        />
        <ValueCard
          icon="🏢"
          title="Franchise"
          desc="Earn from every transaction in your area"
          accent="#F59E0B"
          href="/franchise"
        />
      </div>
    </section>
  );
}
