'use client';

import React from 'react';
import { GlassCard } from './glass-card';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, ctaLabel, onCtaClick, className = '' }, ref) => {
    return (
      <GlassCard ref={ref} className={`py-16 px-8 flex flex-col items-center text-center gap-6 ${className}`.trim()}>
        {icon && (
          <div className="text-6xl mb-2 drop-shadow-lg drop-shadow-[0_0_16px_rgba(123,110,246,0.25)]">
            {icon}
          </div>
        )}

        <h3 className="text-xl font-semibold text-white">{title}</h3>

        {description && (
          <p className="max-w-sm text-sm text-[rgba(255,255,255,0.6)] leading-relaxed">
            {description}
          </p>
        )}

        {ctaLabel && onCtaClick && (
          <button
            onClick={onCtaClick}
            className="
              mt-2
              px-6 py-2.5
              rounded-[8px]
              bg-[#7B6EF6]
              hover:bg-[#A098F8]
              text-white
              font-semibold
              text-sm
              transition-all duration-200
              hover:shadow-lg hover:shadow-[rgba(123,110,246,0.4)]
            "
          >
            {ctaLabel}
          </button>
        )}
      </GlassCard>
    );
  }
);

EmptyState.displayName = 'EmptyState';
