'use client';

import React from 'react';

export type STLLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type STLSize = 'sm' | 'md' | 'lg';

export interface STLBadgeProps {
  level: STLLevel;
  showLabel?: boolean;
  size?: STLSize;
  className?: string;
}

const STL_LABELS: Record<STLLevel, string> = {
  0: 'UNVERIFIED',
  1: 'FREE',
  2: 'BASIC',
  3: 'NORMAL',
  4: 'STANDARD',
  5: 'ADVANCED',
  6: 'HIGH',
  7: 'PRO',
  8: 'VIP',
  9: 'ELITE',
  10: 'SUPREME',
};

const STL_COLORS: Record<STLLevel, { bg: string; border: string; text: string; glow: string }> = {
  0: {
    bg: 'bg-[rgba(128,128,128,0.15)]',
    border: 'border-[rgba(128,128,128,0.3)]',
    text: 'text-[rgba(200,200,200,0.8)]',
    glow: '',
  },
  1: {
    bg: 'bg-[rgba(100,150,200,0.15)]',
    border: 'border-[rgba(100,150,200,0.3)]',
    text: 'text-[#6496C8]',
    glow: '',
  },
  2: {
    bg: 'bg-[rgba(120,170,150,0.15)]',
    border: 'border-[rgba(120,170,150,0.3)]',
    text: 'text-[#78AAA0]',
    glow: '',
  },
  3: {
    bg: 'bg-[rgba(123,110,246,0.15)]',
    border: 'border-[rgba(123,110,246,0.3)]',
    text: 'text-[#7B6EF6]',
    glow: '',
  },
  4: {
    bg: 'bg-[rgba(160,120,240,0.15)]',
    border: 'border-[rgba(160,120,240,0.3)]',
    text: 'text-[#A098F8]',
    glow: '',
  },
  5: {
    bg: 'bg-[rgba(240,160,48,0.15)]',
    border: 'border-[rgba(240,160,48,0.3)]',
    text: 'text-[#F0A030]',
    glow: '',
  },
  6: {
    bg: 'bg-[rgba(43,191,160,0.15)]',
    border: 'border-[rgba(43,191,160,0.3)]',
    text: 'text-[#2BBFA0]',
    glow: '',
  },
  7: {
    bg: 'bg-[rgba(56,200,120,0.15)]',
    border: 'border-[rgba(56,200,120,0.3)]',
    text: 'text-[#38C878]',
    glow: 'drop-shadow-lg drop-shadow-[0_0_12px_rgba(56,200,120,0.4)]',
  },
  8: {
    bg: 'bg-[rgba(240,88,88,0.15)]',
    border: 'border-[rgba(240,88,88,0.3)]',
    text: 'text-[#F05858]',
    glow: 'drop-shadow-lg drop-shadow-[0_0_12px_rgba(240,88,88,0.4)]',
  },
  9: {
    bg: 'bg-[rgba(255,200,100,0.15)]',
    border: 'border-[rgba(255,200,100,0.3)]',
    text: 'text-[#FFC864]',
    glow: 'drop-shadow-lg drop-shadow-[0_0_12px_rgba(255,200,100,0.4)]',
  },
  10: {
    bg: 'bg-[rgba(255,255,150,0.15)]',
    border: 'border-[rgba(255,255,150,0.3)]',
    text: 'text-[#FFFF96]',
    glow: 'drop-shadow-lg drop-shadow-[0_0_16px_rgba(255,255,150,0.5)]',
  },
};

const sizeStyles: Record<STLSize, { padding: string; levelSize: string; labelSize: string }> = {
  sm: {
    padding: 'px-2 py-1',
    levelSize: 'text-xs',
    labelSize: 'text-[10px]',
  },
  md: {
    padding: 'px-3 py-1.5',
    levelSize: 'text-sm',
    labelSize: 'text-xs',
  },
  lg: {
    padding: 'px-4 py-2',
    levelSize: 'text-base',
    labelSize: 'text-sm',
  },
};

export const STLBadge = React.forwardRef<HTMLDivElement, STLBadgeProps>(
  ({ level, showLabel = true, size = 'md', className = '' }, ref) => {
    const colors = STL_COLORS[level];
    const sizeStyle = sizeStyles[size];
    const label = STL_LABELS[level];

    return (
      <div
        ref={ref}
        className={`
          rounded-[6px]
          border border-solid
          ${colors.bg}
          ${colors.border}
          ${colors.glow}
          flex items-center gap-2
          ${sizeStyle.padding}
          transition-all duration-200
          ${className}
        `.trim()}
      >
        <span className={`font-mono font-bold ${sizeStyle.levelSize} ${colors.text}`}>
          L{level}
        </span>
        {showLabel && (
          <span className={`font-semibold ${sizeStyle.labelSize} ${colors.text} uppercase tracking-wider`}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

STLBadge.displayName = 'STLBadge';
