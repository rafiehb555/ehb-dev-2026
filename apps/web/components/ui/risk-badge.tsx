'use client';

import React from 'react';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskStyles: Record<RiskLevel, { bg: string; border: string; text: string; dot: string; pulse?: boolean }> = {
  LOW: {
    bg: 'bg-[rgba(56,200,120,0.1)]',
    border: 'border-[rgba(56,200,120,0.4)]',
    text: 'text-[#38C878]',
    dot: 'bg-[#38C878]',
    pulse: false,
  },
  MEDIUM: {
    bg: 'bg-[rgba(240,160,48,0.1)]',
    border: 'border-[rgba(240,160,48,0.4)]',
    text: 'text-[#F0A030]',
    dot: 'bg-[#F0A030]',
    pulse: false,
  },
  HIGH: {
    bg: 'bg-[rgba(240,88,88,0.1)]',
    border: 'border-[rgba(240,88,88,0.4)]',
    text: 'text-[#F05858]',
    dot: 'bg-[#F05858]',
    pulse: false,
  },
  CRITICAL: {
    bg: 'bg-[rgba(240,88,88,0.15)]',
    border: 'border-[rgba(240,88,88,0.5)]',
    text: 'text-[#FF6B6B]',
    dot: 'bg-[#FF6B6B] animate-pulse',
    pulse: true,
  },
};

export const RiskBadge = React.forwardRef<HTMLDivElement, RiskBadgeProps>(
  ({ level, className = '' }, ref) => {
    const styles = riskStyles[level];

    return (
      <div
        ref={ref}
        className={`
          rounded-[5px]
          border border-solid
          ${styles.bg}
          ${styles.border}
          px-3 py-2
          flex items-center gap-2
          transition-all duration-200
          ${className}
        `.trim()}
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
        <span className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`}>
          {level}
        </span>
      </div>
    );
  }
);

RiskBadge.displayName = 'RiskBadge';
