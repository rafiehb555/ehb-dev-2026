"use client";

import Link from "next/link";
import type { AppRole } from "@/types/user.types";

const menu: Record<AppRole, string[]> = {
  USER: ["Dashboard", "STL", "Profile"],
  SELLER: ["Dashboard", "Orders", "Products", "Payouts"],
  FRANCHISE: ["Dashboard", "Network", "Earnings", "STL"],
  ADMIN: ["Dashboard", "Users", "Approvals", "AI Alerts"],
  DMO_ADMIN: ["Dashboard", "Users", "Approvals", "AI Alerts"],
  SUPER_ADMIN: ["Dashboard", "Users", "Approvals", "AI Alerts"],
  SERVICE_PROVIDER: ["Dashboard", "Jobs", "Clients", "Ratings"],
};

const hrefFor = (label: string) => {
  switch (label) {
    case "STL":
      return "/dmo/ehb-stl-level";
    case "Profile":
      return "/profile";
    case "Users":
      return "/admin";
    case "Approvals":
      return "/dmo";
    default:
      return "/dashboard";
  }
};

export default function RoleBasedSidebar({ role }: { role: AppRole }) {
  return (
    <aside className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Role Menu</p>
      <p className="mt-1 text-sm font-semibold text-white">{role}</p>
      <nav className="mt-3 space-y-2">
        {menu[role].map((item) => (
          <Link key={item} href={hrefFor(item)} className="block rounded-lg border border-gray-800 bg-[#0f172a] px-3 py-2 text-sm text-gray-200 transition hover:border-green-500/40 hover:text-white">
            {item}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

