'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
}

export default function SectionHeader({ title, subtitle, linkText, linkHref, onLinkClick }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold font-display text-white">{title}</h2>
        {subtitle && <p className="text-ehb-textMuted text-[9px] sm:text-[10px] mt-0.5">{subtitle}</p>}
      </div>
      {linkText && (
        linkHref ? (
          <Link 
            href={linkHref}
            className="text-[9px] sm:text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 uppercase tracking-wider"
          >
            {linkText}
            <ChevronRight size={10} className="sm:w-3 sm:h-3" />
          </Link>
        ) : (
          <button 
            onClick={onLinkClick}
            className="text-[9px] sm:text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 uppercase tracking-wider"
          >
            {linkText}
            <ChevronRight size={10} className="sm:w-3 sm:h-3" />
          </button>
        )
      )}
    </div>
  );
}
