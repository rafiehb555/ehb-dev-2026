'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText?: string;
  onClick?: () => void;
}

export default function ServiceCard({ title, description, icon: Icon, buttonText, onClick }: ServiceCardProps) {
  return (
    <div 
      onClick={onClick}
      className="ms-card p-3 sm:p-4 group cursor-pointer hover:border-brand-primary transition-all flex flex-col items-center text-center"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 text-brand-primary rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-brand-primary group-hover:text-white transition-all">
        <Icon size={16} className="sm:w-5 sm:h-5" />
      </div>
      <h4 className="text-[10px] sm:text-xs font-bold mb-1 text-white">{title}</h4>
      <p className="text-[8px] sm:text-[9px] text-slate-400 leading-tight mb-2 sm:mb-3 line-clamp-2">{description}</p>
      {buttonText && (
        <button className="text-[8px] sm:text-[9px] font-bold text-brand-primary hover:underline uppercase tracking-wider mt-auto">
          {buttonText}
        </button>
      )}
    </div>
  );
}
