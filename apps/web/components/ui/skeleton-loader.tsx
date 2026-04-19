'use client';

import React from 'react';

export type SkeletonVariant = 'card' | 'row' | 'stat' | 'table';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

export const SkeletonLoader = React.forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ variant = 'card', count = 1, className = '' }, ref) => {
    const renderSkeleton = () => {
      switch (variant) {
        case 'card':
          return (
            <div className="rounded-[12px] bg-[#13162A] p-6 space-y-4">
              <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/3" />
              <div className="space-y-2">
                <div className="h-8 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-2/3" />
                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-full" />
              </div>
            </div>
          );

        case 'row':
          return (
            <div className="rounded-[8px] bg-[#13162A] p-4 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-2/3" />
                <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/2" />
              </div>
            </div>
          );

        case 'stat':
          return (
            <div className="rounded-[12px] bg-[#13162A] p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] animate-pulse flex-shrink-0" />
                <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/4" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/2" />
                <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-3/4" />
              </div>
            </div>
          );

        case 'table':
          return (
            <div className="rounded-[12px] bg-[#13162A] overflow-hidden">
              <div className="p-6 border-b border-[rgba(255,255,255,0.07)] flex gap-4">
                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/4" />
                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/3" />
                <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse flex-1" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 border-b border-[rgba(255,255,255,0.04)] flex gap-4"
                >
                  <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div ref={ref} className={`space-y-4 ${className}`.trim()}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';
