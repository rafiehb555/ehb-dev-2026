'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FranchiseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function FranchiseCard({ title, description, icon: Icon }: FranchiseCardProps) {
  return (
    <Link 
      href="/franchise"
      className="ms-card p-3 sm:p-4 min-w-[200px] sm:min-w-[220px] group cursor-pointer block"
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 text-brand-primary rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-brand-primary group-hover:text-white transition-all">
        <Icon size={18} className="sm:w-5 sm:h-5" />
      </div>
      <h3 className="text-[10px] sm:text-xs font-bold mb-1 text-white">{title}</h3>
      <p className="text-[8px] sm:text-[10px] text-ehb-textMuted leading-tight mb-3 sm:mb-4">{description}</p>
      <span className="text-[8px] sm:text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider">
        Apply Franchise
      </span>
    </Link>
  );
}
