'use client';

import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type StatusSize = 'sm' | 'md';

export interface StatusChipProps {
  label: string;
  variant: StatusVariant;
  size?: StatusSize;
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; dot: string; text: string }> = {
  success: {
    bg: 'bg-[rgba(56,200,120,0.1)]',
    dot: 'bg-[#38C878]',
    text: 'text-[#38C878]',
  },
  warning: {
    bg: 'bg-[rgba(240,160,48,0.1)]',
    dot: 'bg-[#F0A030]',
    text: 'text-[#F0A030]',
  },
  danger: {
    bg: 'bg-[rgba(240,88,88,0.1)]',
    dot: 'bg-[#F05858]',
    text: 'text-[#F05858]',
  },
  info: {
    bg: 'bg-[rgba(123,110,246,0.1)]',
    dot: 'bg-[#7B6EF6]',
    text: 'text-[#7B6EF6]',
  },
  neutral: {
    bg: 'bg-[rgba(255,255,255,0.05)]',
    dot: 'bg-[rgba(255,255,255,0.4)]',
    text: 'text-[rgba(255,255,255,0.6)]',
  },
};

const sizeStyles: Record<StatusSize, { padding: string; gap: string; text: string; dot: string }> = {
  sm: {
    padding: 'px-2.5 py-1.5',
    gap: 'gap-1.5',
    text: 'text-xs',
    dot: 'w-1.5 h-1.5',
  },
  md: {
    padding: 'px-3 py-2',
    gap: 'gap-2',
    text: 'text-sm',
    dot: 'w-2 h-2',
  },
};

export const StatusChip = React.forwardRef<HTMLDivElement, StatusChipProps>(
  ({ label, variant, size = 'md', className = '' }, ref) => {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={`
          rounded-[5px]
          border border-solid
          ${variantStyle.bg}
          border-[${variantStyle.dot}33]
          flex items-center
          ${sizeStyle.gap}
          ${sizeStyle.padding}
          transition-all duration-200
          ${className}
        `.trim()}
      >
        <div className={`${sizeStyle.dot} ${variantStyle.dot} rounded-full flex-shrink-0`} />
        <span className={`${sizeStyle.text} font-medium ${variantStyle.text}`}>{label}</span>
      </div>
    );
  }
);

StatusChip.displayName = 'StatusChip';
