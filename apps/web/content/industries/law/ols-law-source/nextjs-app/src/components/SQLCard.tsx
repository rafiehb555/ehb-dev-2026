'use client';

import React, { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Zap, Crown, LucideIcon, X, CheckCircle2 } from 'lucide-react';

interface SQLCardProps {
  level: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

const SQL_LEVEL_DETAILS: Record<string, { benefits: string[]; requirements: string[]; fee: string }> = {
  'Free': {
    benefits: ['Basic listing in marketplace', 'Access to public cases', 'Standard support'],
    requirements: ['Valid ID proof', 'Basic profile completion'],
    fee: 'Free'
  },
  'Basic': {
    benefits: ['Identity verified badge', 'Priority in search results', 'Access to more cases', 'Customer reviews enabled'],
    requirements: ['Government ID verification', 'Address verification', 'Professional credentials'],
    fee: '$50/month'
  },
  'Normal': {
    benefits: ['Skill tested badge', 'Featured in category pages', 'Advanced analytics', 'Priority support'],
    requirements: ['Pass skill assessment', 'Minimum 10 completed cases', '4.0+ rating'],
    fee: '$100/month'
  },
  'High': {
    benefits: ['Expert verified badge', 'Top placement in searches', 'Dedicated account manager', 'Marketing support'],
    requirements: ['Expert panel interview', 'Minimum 50 cases', '4.5+ rating', '90%+ success rate'],
    fee: '$250/month'
  },
  'VIP': {
    benefits: ['Elite VIP badge', 'Homepage featured listing', 'Personal branding support', 'Exclusive high-value cases', 'Premium support 24/7'],
    requirements: ['Invitation only', 'Top 1% performer', '4.8+ rating', '95%+ success rate', '100+ cases'],
    fee: '$500/month'
  }
};

export default function SQLCard({ level, description, color, icon: Icon }: SQLCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const levelKey = level.replace(' Level', '');
  const details = SQL_LEVEL_DETAILS[levelKey] || SQL_LEVEL_DETAILS['Free'];

  return (
    <>
      <div 
        className="ms-card p-3 sm:p-4 min-w-[180px] sm:min-w-[200px] flex flex-col items-center text-center gap-2 sm:gap-3 border-b-4 cursor-pointer hover:scale-[1.02] transition-transform" 
        style={{ borderBottomColor: color }}
        onClick={() => setShowDetails(true)}
      >
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1" 
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-tighter" style={{ color: color }}>{level}</h3>
          <p className="text-[8px] sm:text-[10px] text-ehb-textMuted mt-1 leading-tight">{description}</p>
        </div>
        <button className="mt-auto text-[8px] sm:text-[10px] font-bold hover:underline" style={{ color: color }}>
          Learn More
        </button>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{level}</h2>
                  <p className="text-xs sm:text-sm text-ehb-textMuted">{description}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetails(false)} 
                className="text-ehb-textMuted hover:text-white transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ehb-textMuted mb-2 sm:mb-3">Benefits</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {details.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" style={{ color: color }} />
                      <span className="text-xs sm:text-sm text-ehb-textBody">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ehb-textMuted mb-2 sm:mb-3">Requirements</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {details.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs sm:text-sm text-ehb-textMuted">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl" 
              style={{ backgroundColor: `${color}10` }}
            >
              <span className="text-xs sm:text-sm font-bold text-white">Monthly Fee</span>
              <span className="text-base sm:text-lg font-bold" style={{ color: color }}>{details.fee}</span>
            </div>

            <button 
              onClick={() => setShowDetails(false)}
              className="w-full mt-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Apply for {level}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
