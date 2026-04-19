'use client';

import React from 'react';

export interface MetricRingProps {
  value: number;
  label?: string;
  color?: string;
  size?: number;
  className?: string;
}

export const MetricRing = React.forwardRef<SVGSVGElement, MetricRingProps>(
  ({ value, label, color = '#7B6EF6', size = 200, className = '' }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const radius = size / 2 - 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedValue / 100) * circumference;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`.trim()}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: `drop-shadow(0 0 20px ${color}20)` }}
        >
          {/* Background Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />

          {/* Progress Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-out',
              filter: `drop-shadow(0 0 8px ${color}60)`,
            }}
          />

          {/* Center Value */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-mono font-bold"
            fontSize={size * 0.2}
            fill="white"
          >
            {clampedValue}
          </text>

          {/* Center Percent Sign */}
          <text
            x={centerX + size * 0.08}
            y={centerY - size * 0.08}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-semibold"
            fontSize={size * 0.08}
            fill={color}
          >
            %
          </text>
        </svg>

        {label && (
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">{label}</p>
        )}
      </div>
    );
  }
);

MetricRing.displayName = 'MetricRing';
