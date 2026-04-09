/** Archived - not used in production */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type RouteConditionalProps = {
  children: ReactNode;
  hideOnStartsWith: string[];
};

export function RouteConditional({ children, hideOnStartsWith }: RouteConditionalProps) {
  const pathname = usePathname();
  const shouldHide = hideOnStartsWith.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (shouldHide) return null;
  return <>{children}</>;
}

