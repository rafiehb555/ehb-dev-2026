"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INDUSTRIES } from "@/lib/industry/config";
import { useEffect, useState } from "react";

function getIndustryFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2 && (segments[0] === "landing" || segments[0] === "industry")) {
    const slug = segments[1];
    return INDUSTRIES.find((i) => i.slug === slug);
  }
  return undefined;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [pathname]);

  const segments = pathname.split("/").filter(Boolean);
  const industry = getIndustryFromPath(pathname);
  const accent = industry?.accentColor ?? "#33C3FF";

  const items: { label: string; href?: string }[] = [];

  // Always start with EHB
  items.push({ label: "EHB", href: "/" });

  // Industry context
  if (industry) {
    items.push({ label: industry.name, href: `/landing/${industry.slug}` });
  }

  // Page-level context
  if (segments.length === 0) {
    // root landing
    items.push({ label: "Landing" });
  } else if (segments[0] === "landing") {
    items.push({ label: "Landing" });
  } else if (segments[0] === "industry") {
    items.push({ label: "Home" });
  } else if (segments[0] === "dashboard") {
    items.push({ label: "Dashboard" });
  } else if (segments[0] === "service") {
    items.push({ label: "Services" });
    if (segments[1]) items.push({ label: segments[1] });
  } else if (segments[0] === "product") {
    items.push({ label: "Products" });
    if (segments[1]) items.push({ label: segments[1] });
  } else if (segments[0] === "home") {
    items.push({ label: "Home" });
  } else {
    // generic fallback
    const label = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    items.push({ label });
  }

  const lastIndex = items.length - 1;

  return (
    <div
      className={`container-ultra mt-2 mb-1 text-[11px] sm:text-xs text-ehb-textMuted transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
    >
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 sm:gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === lastIndex;
          const content = isLast ? (
            <span className="font-semibold" style={{ color: accent }}>
              {item.label}
            </span>
          ) : item.href ? (
            <Link href={item.href} className="hover:text-ehb-textBody transition-colors">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          );

          return (
            <span key={`${item.label}-${idx}`} className="flex items-center gap-1">
              {idx > 0 && <span className="opacity-60" aria-hidden>{">"}</span>}
              {content}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

