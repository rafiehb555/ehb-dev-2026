import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "warning" | "danger";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-green-500 text-black hover:bg-green-400",
  secondary: "bg-blue-500 text-white hover:bg-blue-400",
  warning: "bg-amber-500 text-black hover:bg-amber-400",
  danger: "bg-red-500 text-white hover:bg-red-400",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition hover:scale-105 active:scale-95 ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

