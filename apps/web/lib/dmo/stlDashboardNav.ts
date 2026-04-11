import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Diamond,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
  Store,
} from "lucide-react";

export const STL_DASHBOARD_NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (p: string) => boolean;
}[] = [
  { href: "/dmo", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/dmo" || p === "/dmo/" },
  {
    href: "/dmo/ehb-stl-level",
    label: "STL Level",
    icon: Sparkles,
    match: (p) => p.startsWith("/dmo/ehb-stl-level"),
  },
  { href: "/dmo/pss", label: "PSS", icon: Shield, match: (p) => p.startsWith("/dmo/pss") },
  { href: "/dmo/crb", label: "CRB", icon: Building2, match: (p) => p.startsWith("/dmo/crb") },
  { href: "/dmo/refilling", label: "DMO", icon: Diamond, match: (p) => p.startsWith("/dmo/refilling") },
  { href: "/dmo/franchise", label: "Franchise", icon: Store, match: (p) => p.startsWith("/dmo/franchise") },
  { href: "/dmo/super-admin", label: "Settings", icon: Settings, match: (p) => p.startsWith("/dmo/super-admin") },
];
