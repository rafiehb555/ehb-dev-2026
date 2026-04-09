import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardSize = "small" | "medium" | "large";

const sizeClass: Record<CardSize, string> = {
  small: "p-3 rounded-xl",
  medium: "p-4 rounded-xl",
  large: "p-5 rounded-2xl",
};

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-950/40 text-white shadow-sm backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export default function EhbCard({
  children,
  size = "medium",
  className = "",
}: {
  children: ReactNode;
  size?: CardSize;
  className?: string;
}) {
  return (
    <Card className={cn("border-gray-800 bg-[#111827]", sizeClass[size], className)}>
      {children}
    </Card>
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-4 sm:p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-semibold leading-none tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[11px] text-ehb-textMuted", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 pt-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center border-t border-white/5 p-4 sm:px-5", className)} {...props} />;
}

export function CardIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/25 to-blue-600/15 text-cyan-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
