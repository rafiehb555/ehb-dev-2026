'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Fingerprint, 
  Eye, AlertTriangle, UserCheck, FileWarning,
  Activity, Bell, Shield, Smartphone,
  CheckCircle2, MoreVertical, Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'verification' | 'alerts'>('monitoring');

  const securityStats = [
    { label: 'System Status', value: 'Secure', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Active Threats', value: '0', icon: ShieldAlert, color: 'text-zinc-400' },
    { label: 'Verified Users', value: '98.2%', icon: UserCheck, color: 'text-brand-primary' },
  ];

  const alerts = [
    { id: 'a1', type: 'Login Alert', title: 'New Device Detected', desc: 'Login attempt from Chrome on Linux', time: '10 mins ago', severity: 'medium' },
    { id: 'a2', type: 'Document Risk', title: 'Potential Alteration', desc: 'Case #EHB-1022: Property deed shows editing signs.', time: '1 hour ago', severity: 'high' },
    { id: 'a3', type: 'Payment', title: 'Unusual Transaction', desc: 'Large payment attempt ($5,000) from unverified wallet.', time: '3 hours ago', severity: 'low' },
  ];

  const verificationRequests = [
    { id: 'v1', name: 'Adv. Sarah Jenkins', type: 'Lawyer License', status: 'Pending', country: 'UK' },
    { id: 'v2', name: 'John Doe', type: 'Identity (Passport)', status: 'Verified', country: 'USA' },
    { id: 'v3', name: 'Zubair Ahmed', type: 'Identity (CNIC)', status: 'Rejected', country: 'Pakistan' },
  ];

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-2 text-white">Security & Fraud Detection</h1>
          <p className="text-sm text-slate-400">Enterprise-level protection for your legal data.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {securityStats.map((stat, idx) => (
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
        {/* Security Controls */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6 lg:p-8">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <Lock size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Account Security
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: 'Two-Factor Auth', status: 'Enabled', icon: Smartphone, active: true },
                { label: 'Biometric Login', status: 'Disabled', icon: Fingerprint, active: false },
                { label: 'Login Alerts', status: 'Enabled', icon: Bell, active: true },
                { label: 'Data Encryption', status: 'AES-256', icon: Shield, active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <item.icon size={14} className={`sm:w-[18px] sm:h-[18px] ${item.active ? 'text-brand-primary' : 'text-zinc-400'}`} />
                    <span className="text-[10px] sm:text-xs font-bold text-white">{item.label}</span>
                  </div>
                  <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${item.active ? 'text-emerald-500' : 'text-zinc-400'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-slate-900 text-white border border-slate-800 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-800 transition-all">
              Update Security Settings
            </button>
          </div>

          <div className="ms-card p-4 sm:p-6 lg:p-8 bg-slate-900 text-white relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-brand-primary/20 blur-3xl" />
            <div className="relative z-10">
              <Activity className="text-brand-primary mb-3 sm:mb-4" size={28} />
              <h4 className="font-bold mb-2 text-sm sm:text-base">Real-time Monitoring</h4>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-relaxed mb-4 sm:mb-6">
                Our AI monitors every transaction to detect fraudulent patterns.
              </p>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-emerald-500">
                <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
                AI Guardian Active
              </div>
            </div>
          </div>
        </div>

        {/* Security Dashboard Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="ms-card p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-white">Security Monitoring Center</h2>
              <div className="flex gap-1 sm:gap-2 p-1 bg-slate-900 rounded-lg sm:rounded-xl">
                {['monitoring', 'verification', 'alerts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-800 text-brand-primary shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'monitoring' && (
                <motion.div 
                  key="monitoring"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800">
                      <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 sm:mb-4">Identity Verification</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          { label: 'Email Verified', done: true },
                          { label: 'Phone Verified', done: true },
                          { label: 'ID Documents', done: false, text: 'Reviewing' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-bold text-white">{item.label}</span>
                            {item.done ? (
                              <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                            ) : (
                              <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary">{item.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800">
                      <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 sm:mb-4">Network Security</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {['SSL Encryption', 'Firewall Status', 'DDoS Protection'].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-bold text-white">{item}</span>
                            <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8 lg:p-12 border border-dashed border-slate-700 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center">
                    <Activity size={36} className="sm:w-10 sm:h-10 text-zinc-500 mb-3 sm:mb-4" />
                    <p className="text-[10px] sm:text-xs font-bold text-zinc-400">No unusual activity detected in the last 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'verification' && (
                <motion.div 
                  key="verification"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {verificationRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 gap-3">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                          {req.name[0]}
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs font-bold text-white">{req.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-zinc-500">{req.type} • {req.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full ${
                          req.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                          req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {req.status}
                        </span>
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreVertical size={14} className="sm:w-4 sm:h-4 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div 
                  key="alerts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-all group ${
                      alert.severity === 'high' ? 'bg-rose-500/5 border-rose-500/10' :
                      alert.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/10' :
                      'bg-slate-900 border-slate-800'
                    }`}>
                      <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shrink-0 ${
                        alert.severity === 'high' ? 'bg-rose-500/10 text-rose-500' :
                        alert.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="grow">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">{alert.type}</p>
                          <span className="text-[8px] sm:text-[10px] text-zinc-400">{alert.time}</span>
                        </div>
                        <h4 className="font-bold mb-1 text-white text-sm sm:text-base">{alert.title}</h4>
                        <p className="text-[10px] sm:text-sm text-zinc-500">{alert.desc}</p>
                      </div>
                      <div className="flex sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg text-zinc-400 hover:text-brand-primary">
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg text-zinc-400 hover:text-rose-500">
                          <Ban size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ms-card p-4 sm:p-6 lg:p-8">
            <h3 className="font-bold mb-6 sm:mb-8 flex items-center gap-2 text-white text-sm sm:text-base">
              <ShieldCheck size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
              Fraud Prevention AI
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: 'Doc Verification', desc: 'AI checks for fake or altered documents.', icon: FileWarning },
                { title: 'Payment Monitoring', desc: 'Detects suspicious transaction patterns.', icon: Activity },
                { title: 'Lawyer Validation', desc: 'Real-time license verification.', icon: UserCheck },
              ].map((feature, idx) => (
                <div key={idx} className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800">
                  <feature.icon className="text-brand-primary mb-3 sm:mb-4" size={20} />
                  <h4 className="font-bold text-xs sm:text-sm mb-1 text-white">{feature.title}</h4>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
