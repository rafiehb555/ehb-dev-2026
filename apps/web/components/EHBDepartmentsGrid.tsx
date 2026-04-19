import Link from "next/link";
import React from "react";

function DeptCard({
  icon,
  title,
  standFor,
  desc,
  accent,
  href,
}: {
  icon: string;
  title: string;
  standFor: string;
  desc: string;
  accent: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl glass-panel border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_26px_rgba(51, 195, 255,0.18)] card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
      style={{
        borderColor: `${accent}40`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset`,
      }}
    >
      <div className="p-5">
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center text-lg border"
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}33`,
            boxShadow: `0 0 18px ${accent}25`,
          }}
          aria-hidden
        >
          {icon}
        </div>
        <p className="mt-4 text-sm font-semibold text-white">{title}</p>
        <p className="text-[10px] text-ehb-textBody mt-1 leading-relaxed">{standFor}</p>
        <p className="text-xs text-ehb-textMuted mt-1 leading-relaxed">{desc}</p>
        <p className="text-[10px] font-medium text-cyan-400/80 mt-3">View module →</p>
      </div>
    </Link>
  );
}

export function EHBDepartmentsGrid() {
  const items = [
    {
      icon: "🛡️",
      title: "PSS",
      standFor: "Proof & Security System",
      desc: "Identity verification: KYC, document checks, and fraud protection.",
      accent: "#29ABE2",
      href: "/dmo/pss",
    },
    {
      icon: "📊",
      title: "DMO",
      standFor: "Decentralized Management Office",
      desc: "Governance + verification coordination, and EAP affiliate engine control.",
      accent: "#8B5CF6",
      href: "/dmo/home",
    },
    {
      icon: "🤝",
      title: "JPS",
      standFor: "Job Profile & Skill",
      desc: "Professional identity layer: skills, services, jobs, and listings.",
      accent: "#29ABE2",
      href: "/jobs",
    },
    {
      icon: "🧾",
      title: "CRB",
      standFor: "Central Record Blockchain",
      desc: "Certifies skills/services/products and records them on the registry.",
      accent: "#8B5CF6",
      href: "/dmo/crb",
    },
    {
      icon: "⭐",
      title: "STL",
      standFor: "Service Trust Level",
      desc: "AI trust scoring that controls visibility, ranking, and verification strength.",
      accent: "#29ABE2",
      href: "/dmo/stl",
    },
    {
      icon: "💳",
      title: "EHW",
      standFor: "EHB Wallet",
      desc: "Wallet + payments + earnings + affiliate payouts via trusted transactions.",
      accent: "#8B5CF6",
      href: "/wallet",
    },
  ];

  return (
    <section className="container-ultra section-pad-ultra">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Departments</p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">EHB Departments</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <DeptCard
            key={it.title}
            icon={it.icon}
            title={it.title}
            standFor={it.standFor}
            desc={it.desc}
            accent={it.accent}
            href={it.href}
          />
        ))}
      </div>
    </section>
  );
}
