'use client';

import React from 'react';

export type ProgressSize = 'sm' | 'md';

export interface ProgressBarProps {
  value: number;
  label?: string;
  size?: ProgressSize;
  className?: string;
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-2',
  md: 'h-3',
};

const getGradientAndColor = (value: number) => {
  if (value <= 33) {
    return {
      gradient: 'from-[#38C878] to-[#38C878]',
      color: 'text-[#38C878]',
    };
  } else if (value <= 66) {
    return {
      gradient: 'from-[#38C878] via-[#F0A030] to-[#F0A030]',
      color: 'text-[#F0A030]',
    };
  } else {
    return {
      gradient: 'from-[#F0A030] to-[#F05858]',
      color: 'text-[#F05858]',
    };
  }
};

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, label, size = 'md', className = '' }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const { gradient, color } = getGradientAndColor(clampedValue);

    return (
      <div ref={ref} className={`w-full ${className}`.trim()}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[rgba(255,255,255,0.7)]">{label}</span>
            <span className={`text-sm font-semibold ${color}`}>{clampedValue}%</span>
          </div>
        )}

        {/* Progress Track */}
        <div className={`w-full ${sizeClasses[size]} bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden`}>
          {/* Progress Fill */}
          <div
            className={`
              h-full
              ${sizeClasses[size]}
              bg-gradient-to-r
              ${gradient}
              rounded-full
              transition-all duration-500 ease-out
            `.trim()}
            style={{
              width: `${clampedValue}%`,
            }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
