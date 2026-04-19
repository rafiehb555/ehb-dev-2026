"use client";

import React, { CSSProperties } from "react";
import "./ehb-theme.css";

interface LivePillProps {
  className?: string;
}

export function LivePill({ className = "" }: LivePillProps) {
  const containerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.375rem 0.75rem",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.35)",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#22c55e",
    letterSpacing: "0.05em",
  };

  const dotStyle: CSSProperties = {
    display: "inline-block",
    width: "6px",
    height: "6px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    animation: "live-blink 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  };

  return (
    <div className={className} style={containerStyle}>
      <span style={dotStyle} />
      <span>LIVE</span>
    </div>
  );
}

export default LivePill;
