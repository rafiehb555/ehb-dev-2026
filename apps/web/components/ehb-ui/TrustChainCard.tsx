"use client";

import React, { ReactNode, CSSProperties } from "react";
import "./ehb-theme.css";

interface TrustChainLink {
  label: string;
  stlLevel: number;
}

interface TrustChainCardProps {
  productSTL: number;
  sellerSTL: number;
  companySTL: number;
  ownerSTL: number;
  className?: string;
  children?: ReactNode;
}

export function TrustChainCard({
  productSTL,
  sellerSTL,
  companySTL,
  ownerSTL,
  className = "",
  children,
}: TrustChainCardProps) {
  const links: TrustChainLink[] = [
    { label: "Product", stlLevel: productSTL },
    { label: "Seller", stlLevel: sellerSTL },
    { label: "Company", stlLevel: companySTL },
    { label: "Owner", stlLevel: ownerSTL },
  ];

  // Calculate final STL (minimum of all)
  const finalSTL = Math.min(productSTL, sellerSTL, companySTL, ownerSTL);
  const weakestLink = Math.min(productSTL, sellerSTL, companySTL, ownerSTL);

  const containerStyle: CSSProperties = {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "var(--ehb-theme-surface)",
    border: "1px solid var(--ehb-theme-border)",
    padding: "1.5rem",
    boxShadow: "var(--ehb-theme-card-shadow)",
  };

  const glossStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1,
  };

  const contentStyle: CSSProperties = {
    position: "relative",
    zIndex: 2,
  };

  const headerStyle: CSSProperties = {
    marginBottom: "1.5rem",
  };

  const titleStyle: CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--ehb-theme-text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.5rem",
  };

  const finalSTLStyle: CSSProperties = {
    fontSize: "2rem",
    fontWeight: "800",
    background: `linear-gradient(135deg, #c89010 0%, #906000 100%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const chainStyle: CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const linkStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  };

  const linkLabelStyle: CSSProperties = {
    fontSize: "0.625rem",
    fontWeight: "600",
    color: "var(--ehb-theme-text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  const getSTLColor = (level: number): string => {
    if (level === weakestLink) {
      return "#f05858"; // Red for weakest
    }
    if (level >= 8) return "#c89010";
    if (level >= 6) return "#8838c8";
    if (level >= 4) return "#2898c8";
    if (level >= 2) return "#50a050";
    return "#b0b8c4";
  };

  const stlBadgeStyle = (level: number): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${getSTLColor(level)}, ${getSTLColor(level - 1)})`,
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "0.875rem",
    boxShadow: `0 2px 8px ${getSTLColor(level)}40`,
    border: level === weakestLink ? "2px solid #f05858" : "none",
  });

  const separatorStyle: CSSProperties = {
    width: "2px",
    height: "24px",
    backgroundColor: "var(--ehb-theme-border)",
  };

  const weakestWarningStyle: CSSProperties = {
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: "rgba(240, 88, 88, 0.1)",
    border: "1px solid rgba(240, 88, 88, 0.3)",
    fontSize: "0.75rem",
    color: "#f05858",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Gloss effect */}
      <div style={glossStyle} />

      {/* Content */}
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleStyle}>Trust Chain STL</div>
          <div style={finalSTLStyle}>L{finalSTL}</div>
        </div>

        {/* Chain links */}
        <div style={chainStyle}>
          {links.map((link, index) => (
            <React.Fragment key={link.label}>
              <div style={linkStyle}>
                <div style={stlBadgeStyle(link.stlLevel)}>L{link.stlLevel}</div>
                <div style={linkLabelStyle}>{link.label}</div>
              </div>
              {index < links.length - 1 && <div style={separatorStyle} />}
            </React.Fragment>
          ))}
        </div>

        {/* Weakest link warning */}
        {weakestLink < 5 && (
          <div style={weakestWarningStyle}>
            <span>⚠️</span>
            <span>Weakest link: {links.find((l) => l.stlLevel === weakestLink)?.label} (L{weakestLink})</span>
          </div>
        )}

        {/* Children */}
        {children && <div style={{ marginTop: "1rem" }}>{children}</div>}
      </div>
    </div>
  );
}

export default TrustChainCard;
