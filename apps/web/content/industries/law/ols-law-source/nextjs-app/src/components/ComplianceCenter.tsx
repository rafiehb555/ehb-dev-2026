'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Globe, Scale, FileText, 
  AlertCircle, CheckCircle2, Lock,
  ChevronRight, Award, BookOpen, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ComplianceCenter() {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  
  const countries = [
    { name: 'Pakistan', flag: '🇵🇰', rules: ['Bar Council License Required', 'Data Protection Act 2023', 'Sharia Law Compliance'] },
    { name: 'United Kingdom', flag: '🇬🇧', rules: ['SRA Regulation', 'GDPR Compliance', 'Solicitor Indemnity Insurance'] },
    { name: 'UAE', flag: '🇦🇪', rules: ['MOJ License', 'DIFC Courts Compliance', 'Cybercrime Law 2021'] },
    { name: 'USA', flag: '🇺🇸', rules: ['State Bar Admission', 'ABA Ethics Rules', 'CCPA/HIPAA Compliance'] },
  ];

  const complianceStats = [
    { label: 'Verified Lawyers', value: '1,240', icon: Scale, color: 'text-emerald-500' },
    { label: 'Active Policies', value: '45', icon: FileText, color: 'text-brand-primary' },
    { label: 'Compliance Rate', value: '99.8%', icon: ShieldCheck, color: 'text-brand-primary' },
  ];

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-2 text-white">Global Compliance System</h1>
          <p className="text-sm text-ehb-textMuted">Ensuring EHB Law operates within the legal framework of 120+ countries.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {complianceStats.map((stat, idx) => (
            <div key={idx} className="ms-card px-3 sm:px-6 py-2 sm:py-4 flex items-center gap-2 sm:gap-4">
              <stat.icon className={stat.color} size={18} />
              <div>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                <p className="text-xs sm:text-sm font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Country Compliance Selector */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6 lg:p-8">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Country Regulations
            </h3>
            <div className="space-y-2">
              {countries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => setSelectedCountry(country.name)}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                    selectedCountry === country.name 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'hover:bg-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">{country.flag}</span>
                    <span className="text-xs sm:text-sm font-bold">{country.name}</span>
                  </div>
                  <ChevronRight size={14} className={`sm:w-4 sm:h-4 ${selectedCountry === country.name ? 'text-white/70' : 'text-zinc-400'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6 lg:p-8 bg-slate-900 text-white border border-slate-800">
            <Award className="text-brand-primary mb-3 sm:mb-4" size={28} />
            <h4 className="font-bold mb-2 text-sm sm:text-base">Professional Ethics</h4>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-relaxed mb-4 sm:mb-6">
              All lawyers on EHB must adhere to our Global Professional Conduct Code.
            </p>
            <button className="w-full py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all">
              View Ethics Code
            </button>
          </div>
        </div>

        {/* Compliance Details */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCountry}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ms-card p-4 sm:p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl">{countries.find(c => c.name === selectedCountry)?.flag}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedCountry} Compliance</h2>
                    <p className="text-[10px] sm:text-xs text-zinc-500">Regulatory framework and licensing.</p>
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 text-emerald-500 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                  Fully Compliant
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 sm:mb-4">Mandatory Requirements</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {countries.find(c => c.name === selectedCountry)?.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800">
                        <ShieldCheck className="text-brand-primary shrink-0" size={16} />
                        <span className="text-[10px] sm:text-xs font-bold text-white">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl sm:rounded-3xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2 text-white text-sm sm:text-base">
                      <Lock size={14} className="sm:w-4 sm:h-4 text-brand-primary" />
                      Data Privacy
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed">
                      User data in {selectedCountry} is stored locally in compliance with regional data residency laws.
                    </p>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800">
                    <h4 className="font-bold mb-2 flex items-center gap-2 text-orange-500 text-sm sm:text-base">
                      <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                      Service Restrictions
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed">
                      Certain legal services are subject to additional licensing in this jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="ms-card p-4 sm:p-6 lg:p-8">
            <h3 className="font-bold mb-6 sm:mb-8 flex items-center gap-2 text-white text-sm sm:text-base">
              <FileText size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
              Platform Policies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: 'Terms of Service', icon: BookOpen, date: 'Updated Mar 01' },
                { title: 'Privacy Policy', icon: Lock, date: 'Updated Feb 15' },
                { title: 'Lawyer Agreement', icon: Scale, date: 'Updated Jan 20' },
              ].map((policy, idx) => (
                <div key={idx} className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 group cursor-pointer hover:border-brand-primary/30 transition-all">
                  <policy.icon className="text-zinc-400 group-hover:text-brand-primary transition-colors mb-3 sm:mb-4" size={20} />
                  <h4 className="font-bold text-xs sm:text-sm mb-1 text-white">{policy.title}</h4>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500">{policy.date}</p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Policy <ExternalLink size={10} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
