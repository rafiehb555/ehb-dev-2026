import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Separator({ className, orientation = "horizontal" }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0 bg-gradient-to-r from-transparent via-white/15 to-transparent",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px min-h-[1rem] bg-white/15",
        className,
      )}
    />
  );
}
