'use client';

import React, { useState } from 'react';
import { 
  Scale, ShieldCheck, 
  Zap, CheckCircle2,
  Database, Lock, Table, Code, Layers, Cpu, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PLATFORM_ARCHITECTURE } from '@/data/architecture';

export default function PlatformArchitecture() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-3 sm:mb-4">
          <Zap size={12} className="sm:w-3.5 sm:h-3.5" /> Phase 20: Final Master Blueprint
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display mb-3 sm:mb-4 text-white">EHB Law Platform Architecture</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto px-4">
          The complete master blueprint of the EHB Law Services ecosystem, integrating AI, blockchain, and global legal networks.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'database', label: 'Database', icon: Table },
          { id: 'ai', label: 'AI Intelligence', icon: Cpu },
          { id: 'security', label: 'Security', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <tab.icon size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {PLATFORM_ARCHITECTURE.coreModules.map((module, idx) => (
                <div key={module.id} className="ms-card p-6 sm:p-8 group hover:border-brand-primary transition-all">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Database size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 text-white">{module.name}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{module.description}</p>
                </div>
              ))}
            </div>

            <div className="ms-card p-6 sm:p-10 bg-slate-900 text-white relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-primary/10 blur-[100px]" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold font-display mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-white">
                  <Scale className="text-brand-primary" size={20} /> User Ecosystem
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                  {PLATFORM_ARCHITECTURE.userTypes.map((user, idx) => (
                    <div key={idx} className="space-y-2 sm:space-y-4">
                      <h4 className="text-brand-primary font-bold text-[10px] sm:text-sm uppercase tracking-widest">{user.type}</h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {user.permissions.map((p, i) => (
                          <li key={i} className="text-[8px] sm:text-[10px] text-slate-400 flex items-center gap-1.5 sm:gap-2">
                            <div className="w-1 h-1 rounded-full bg-slate-600 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'database' && (
          <motion.div 
            key="database"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="ms-card p-6 sm:p-8 border-dashed border-2 border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold font-display flex items-center gap-2 sm:gap-3 text-white">
                  <Table className="text-brand-primary" size={20} /> Core Database Schema
                </h3>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-300 px-2 sm:px-3 py-1 rounded-full">500+ Tables Planned</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                {PLATFORM_ARCHITECTURE.databaseSchema.coreTables.map((table, idx) => (
                  <div key={idx} className="p-3 sm:p-4 bg-slate-900 rounded-lg sm:rounded-xl border border-slate-800 flex items-center gap-2 sm:gap-3 group hover:bg-brand-primary/5 transition-colors">
                    <Code size={12} className="sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:text-brand-primary shrink-0" />
                    <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-300 truncate">{table}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-900 text-white rounded-xl sm:rounded-2xl border border-slate-800">
                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                  The database is designed for high availability and global sharding. Each region (Country Franchise) maintains its own data partition while syncing critical governance data to the Global Master Ledger.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div 
            key="ai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            {PLATFORM_ARCHITECTURE.aiModules.map((ai, idx) => (
              <div key={idx} className="ms-card p-6 sm:p-8 flex items-start gap-4 sm:gap-6 group hover:border-brand-primary transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Cpu size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-white">{ai.name}</h3>
                  <p className="text-[10px] sm:text-sm text-slate-400 leading-relaxed">{ai.task}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            <div className="ms-card p-6 sm:p-8 bg-slate-900 text-white border border-slate-800">
              <h3 className="text-lg sm:text-xl font-bold font-display mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Lock className="text-brand-primary" size={20} /> Security Protocols
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { title: 'Identity Verification', desc: 'Biometric and document-based KYC for all users.' },
                  { title: 'Fraud Detection', desc: 'AI-driven monitoring of financial transactions.' },
                  { title: 'Encrypted Comms', desc: 'End-to-end encryption for all legal consultations.' },
                ].map((item, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                    <h4 className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1">{item.title}</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="ms-card p-6 sm:p-8 bg-brand-primary text-white">
              <h3 className="text-lg sm:text-xl font-bold font-display mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Globe size={20} /> Global Compliance
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { title: 'Data Sovereignty', desc: 'Compliant with GDPR, CCPA, and local privacy laws.' },
                  { title: 'Professional Licensing', desc: 'Verified Bar Association credentials for all lawyers.' },
                  { title: 'Jurisdictional Logic', desc: 'AI adapts advice based on local country statutes.' },
                ].map((item, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl border border-white/10">
                    <h4 className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1">{item.title}</h4>
                    <p className="text-[9px] sm:text-[10px] text-white/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Status Footer */}
      <div className="mt-12 sm:mt-20 text-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 text-white rounded-2xl sm:rounded-3xl font-bold text-sm sm:text-lg shadow-xl shadow-emerald-500/20">
          <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> All 20 Phases Completed Successfully
        </div>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400 font-bold">
          EHB Law Platform is now Development-Ready.
        </p>
      </div>
    </div>
  );
}
