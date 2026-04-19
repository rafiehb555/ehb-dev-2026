"use client";

import React, { ReactNode, CSSProperties } from "react";
import "./ehb-theme.css";

type ButtonVariant = "gold" | "blue" | "green" | "red";
type ButtonSize = "sm" | "md" | "lg";

interface EHBButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, { from: string; to: string; shadow: string; gloss: string }> = {
  gold: {
    from: "#f5b857",
    to: "#d4841f",
    shadow: "0 5px 15px rgba(240, 160, 48, 0.4)",
    gloss: "rgba(255, 255, 255, 0.5)",
  },
  blue: {
    from: "#40a8e0",
    to: "#1868a0",
    shadow: "0 5px 15px rgba(40, 152, 200, 0.4)",
    gloss: "rgba(255, 255, 255, 0.4)",
  },
  green: {
    from: "#52d582",
    to: "#1e8a3d",
    shadow: "0 5px 15px rgba(56, 200, 120, 0.4)",
    gloss: "rgba(255, 255, 255, 0.4)",
  },
  red: {
    from: "#f57a7a",
    to: "#c02828",
    shadow: "0 5px 15px rgba(240, 88, 88, 0.4)",
    gloss: "rgba(255, 255, 255, 0.4)",
  },
};

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    minHeight: "32px",
  },
  md: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    minHeight: "40px",
  },
  lg: {
    padding: "1rem 2rem",
    fontSize: "1.125rem",
    minHeight: "48px",
  },
};

export function EHBButton({
  children,
  variant = "gold",
  onClick,
  disabled = false,
  size = "md",
  fullWidth = false,
  className = "",
}: EHBButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const [isActive, setIsActive] = React.useState(false);

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: fullWidth ? "100%" : "auto",
    minHeight: sizeStyle.minHeight,
    padding: sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    fontWeight: "600",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    background: `linear-gradient(135deg, ${variantStyle.from} 0%, ${variantStyle.to} 100%)`,
    boxShadow: isActive ? "0 0px 0px rgba(0, 0, 0, 0)" : variantStyle.shadow,
    transform: isActive ? "translateY(5px)" : "translateY(0)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: disabled ? 0.5 : 1,
    overflow: "hidden",
  };

  return (
    <button
      className={className}
      style={baseStyle}
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      disabled={disabled}
    >
      {/* Top gloss layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: `linear-gradient(180deg, ${variantStyle.gloss} 0%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)",
          animation: "ehb-sweep 4.5s infinite",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Button text */}
      <span style={{ position: "relative", zIndex: 3 }}>
        {children}
      </span>
    </button>
  );
}

export default EHBButton;
