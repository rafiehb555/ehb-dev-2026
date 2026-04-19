"use client";

import React, { ReactNode, CSSProperties } from "react";
import "./ehb-theme.css";

type PlasticCardVariant = "default" | "raised" | "inset";

interface PlasticCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: PlasticCardVariant;
}

export function PlasticCard({
  children,
  className = "",
  onClick,
  variant = "default",
}: PlasticCardProps) {
  const baseStyle: CSSProperties = {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "var(--ehb-theme-surface)",
    border: "1px solid var(--ehb-theme-border)",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  let variantStyle: CSSProperties = {};
  let shadowStyle = "var(--ehb-theme-card-shadow)";

  switch (variant) {
    case "raised":
      variantStyle = {
        boxShadow: "var(--ehb-theme-card-shadow), 0 8px 16px rgba(0, 0, 0, 0.1)",
        transform: "translateZ(0)",
      };
      break;
    case "inset":
      variantStyle = {
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
      };
      break;
    default:
      variantStyle = {
        boxShadow: shadowStyle,
      };
  }

  const hoverStyle: CSSProperties = onClick
    ? {
        boxShadow:
          variant === "inset"
            ? "inset 0 2px 4px rgba(0, 0, 0, 0.05)"
            : "var(--ehb-theme-card-hover)",
      }
    : {};

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...baseStyle,
        ...variantStyle,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, variantStyle);
      }}
    >
      {/* Top gloss layer (::before equivalent) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "48%",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Diagonal shimmer sweep (::after equivalent) */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
          animation: "ehb-sweep 4.5s infinite",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 0 }}>
        {children}
      </div>
    </div>
  );
}

export default PlasticCard;
