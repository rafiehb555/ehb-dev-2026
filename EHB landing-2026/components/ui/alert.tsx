import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  default: "border-cyan-500/25 bg-cyan-950/35 text-cyan-50 [&>svg]:text-cyan-300",
  warning: "border-amber-500/30 bg-amber-950/40 text-amber-50 [&>svg]:text-amber-300",
  destructive: "border-rose-500/30 bg-rose-950/40 text-rose-50 [&>svg]:text-rose-300",
  success: "border-emerald-500/25 bg-emerald-950/35 text-emerald-50 [&>svg]:text-emerald-300",
} as const;

export function Alert({
  variant = "default",
  className,
  children,
  icon,
  title,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
  icon?: ReactNode;
  title?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("relative flex gap-3 rounded-xl border px-4 py-3 text-[12px] leading-snug", variants[variant], className)}
      {...props}
    >
      {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <div className="font-semibold text-[13px]">{title}</div> : null}
        <div className="text-[11px] opacity-95">{children}</div>
      </div>
    </div>
  );
}
