"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Lightweight CSS tooltip (no portal). */
export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: {
  children: ReactNode;
  content: string;
  side?: "top" | "bottom";
  className?: string;
}) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-white/15 bg-slate-900 px-2 py-1 text-[10px] text-ehb-textBody opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          side === "top" ? "bottom-full left-1/2 mb-1 -translate-x-1/2" : "top-full left-1/2 mt-1 -translate-x-1/2",
        )}
      >
        {content}
      </span>
    </span>
  );
}
