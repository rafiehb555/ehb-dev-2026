"use client";

import React, { CSSProperties } from "react";
import "./ehb-theme.css";

type STLLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type BadgeSize = "sm" | "md" | "lg";

interface STLBadgeProps {
  level: STLLevel;
  current?: boolean;
  locked?: boolean;
  size?: BadgeSize;
  className?: string;
}

const levelGradients: Record<STLLevel, { from: string; to: string; shadow: string }> = {
  1: { from: "var(--stl-l1-from)", to: "var(--stl-l1-to)", shadow: "var(--stl-l1-shadow)" },
  2: { from: "var(--stl-l2-from)", to: "var(--stl-l2-to)", shadow: "var(--stl-l2-shadow)" },
  3: { from: "var(--stl-l3-from)", to: "var(--stl-l3-to)", shadow: "var(--stl-l3-shadow)" },
  4: { from: "var(--stl-l4-from)", to: "var(--stl-l4-to)", shadow: "var(--stl-l4-shadow)" },
  5: { from: "var(--stl-l5-from)", to: "var(--stl-l5-to)", shadow: "var(--stl-l5-shadow)" },
  6: { from: "var(--stl-l6-from)", to: "var(--stl-l6-to)", shadow: "var(--stl-l6-shadow)" },
  7: { from: "var(--stl-l7-from)", to: "var(--stl-l7-to)", shadow: "var(--stl-l7-shadow)" },
  8: { from: "var(--stl-l8-from)", to: "var(--stl-l8-to)", shadow: "var(--stl-l8-shadow)" },
  9: { from: "var(--stl-l9-from)", to: "var(--stl-l9-to)", shadow: "var(--stl-l9-shadow)" },
  10: { from: "var(--stl-l10-from)", to: "var(--stl-l10-to)", shadow: "var(--stl-l10-shadow)" },
};

const sizeStyles: Record<BadgeSize, { size: string; fontSize: string; iconSize: string }> = {
  sm: { size: "24px", fontSize: "0.625rem", iconSize: "12px" },
  md: { size: "32px", fontSize: "0.75rem", iconSize: "16px" },
  lg: { size: "40px", fontSize: "0.875rem", iconSize: "20px" },
};

export function STLBadge({
  level,
  current = false,
  locked = false,
  size = "md",
  className = "",
}: STLBadgeProps) {
  const gradient = levelGradients[level];
  const sizeStyle = sizeStyles[size];

  const containerStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: sizeStyle.size,
    height: sizeStyle.size,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
    boxShadow: `0 4px 12px ${gradient.shadow}`,
    opacity: locked ? 0.58 : 1,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Add glowing ring if current
  if (current) {
    containerStyle.animation = "ehb-ring-pulse 2s infinite";
    containerStyle.boxShadow = `0 4px 12px ${gradient.shadow}, 0 0 0 3px rgba(240, 160, 48, 0.4)`;
  }

  const textStyle: CSSProperties = {
    fontSize: sizeStyle.fontSize,
    fontWeight: "800",
    color: "#ffffff",
    position: "relative",
    zIndex: 2,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  };

  const glossStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)",
    borderRadius: "50% 50% 0 0",
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Top gloss */}
      <div style={glossStyle} />

      {/* Level text or lock icon */}
      {locked ? (
        <svg
          style={{
            width: sizeStyle.iconSize,
            height: sizeStyle.iconSize,
            position: "relative",
            zIndex: 2,
            color: "#ffffff",
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1C6.48 1 2 5.48 2 11v10c0 .55.45 1 1 1h1v3c0 1.66 1.34 3 3 3s3-1.34 3-3v-3h6v3c0 1.66 1.34 3 3 3s3-1.34 3-3v-3h1c.55 0 1-.45 1-1V11c0-5.52-4.48-10-10-10zm0 2c4.42 0 8 3.58 8 8v9H4v-9c0-4.42 3.58-8 8-8z" />
        </svg>
      ) : (
        <span style={textStyle}>L{level}</span>
      )}
    </div>
  );
}

export default STLBadge;
