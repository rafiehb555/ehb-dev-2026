'use client';

import React from 'react';
import { GlassCard } from './glass-card';

export interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ icon, label, value, subLabel, trend, onClick, className = '' }, ref) => {
    const trendColor =
      trend?.direction === 'up'
        ? 'text-[#38C878]'
        : trend?.direction === 'down'
          ? 'text-[#F05858]'
          : 'text-[rgba(255,255,255,0.5)]';

    const trendArrow =
      trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '→';

    return (
      <GlassCard
        ref={ref}
        onClick={onClick}
        hoverable={!!onClick}
        className={`p-6 flex flex-col gap-4 ${className}`.trim()}
      >
        {/* Icon and Label Row */}
        <div className="flex items-start justify-between">
          {icon && (
            <div className="text-3xl flex-shrink-0 drop-shadow-lg drop-shadow-[0_0_8px_rgba(123,110,246,0.3)]">
              {icon}
            </div>
          )}
          <div className="flex-1 ml-3">
            <p className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.6)] font-medium">
              {label}
            </p>
          </div>
        </div>

        {/* Value Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-mono font-bold text-white">{value}</span>
          {trend && (
            <span className={`text-sm font-semibold flex items-center gap-1 ${trendColor}`}>
              {trendArrow} {trend.percentage}%
            </span>
          )}
        </div>

        {/* Sub Label */}
        {subLabel && (
          <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed">
            {subLabel}
          </p>
        )}
      </GlassCard>
    );
  }
);

StatCard.displayName = 'StatCard';
