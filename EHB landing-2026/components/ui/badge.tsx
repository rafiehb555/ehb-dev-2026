import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  default: "border-white/15 bg-slate-800/80 text-slate-200",
  secondary: "border-slate-500/25 bg-slate-800/60 text-ehb-textBody",
  cyan: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
  violet: "border-violet-400/30 bg-violet-500/15 text-violet-100",
  amber: "border-amber-400/30 bg-amber-500/15 text-amber-100",
  emerald: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
  rose: "border-rose-400/30 bg-rose-500/15 text-rose-100",
  blue: "border-blue-400/30 bg-blue-500/15 text-blue-100",
  outline: "border-white/20 bg-transparent text-ehb-textBody",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
