'use client';

import React from 'react';
import Link from 'next/link';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  nested?: boolean;
  onClick?: () => void;
  href?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', hoverable = true, nested = false, onClick, href }, ref) => {
    const baseClasses = `
      rounded-[12px]
      border border-solid
      backdrop-blur-md
      transition-all duration-200
      ${nested ? 'bg-[#1A1D33] border-[rgba(255,255,255,0.07)]' : 'bg-[#13162A] border-[rgba(255,255,255,0.08)]'}
      ${hoverable ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : ''}
      ${onClick ? 'cursor-pointer' : ''}
    `;

    const content = (
      <div
        ref={ref}
        className={`${baseClasses} ${className}`.trim()}
        onClick={onClick}
      >
        {children}
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="block">
          {content}
        </Link>
      );
    }

    return content;
  }
);

GlassCard.displayName = 'GlassCard';
