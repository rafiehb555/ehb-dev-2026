'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Briefcase, Search, FileText, CreditCard, MessageSquare, Star, Plus, 
  UserCheck, ShieldCheck, Loader2, Clock, CheckCircle2, AlertCircle,
  ArrowRight, Bot, Scale, TrendingUp, Calendar, Bell, Settings,
  ChevronRight, Globe, Zap, Crown, Upload, Download, Eye
} from 'lucide-react';

// Mock Cases Data
const MOCK_CASES = [
  { 
    id: 1, 
    title: 'Divorce Case - Khula Filing', 
    caseNumber: 'EHB-2026-001',
    status: 'in_progress', 
    progress: 45,
    lawyer: { name: 'Adv. Sarah Ahmed', image: '👩‍⚖️', rating: 4.9 },
    nextHearing: '2026-03-20',
    created_at: '2026-03-01',
    category: 'Family Law'
  },
  { 
    id: 2, 
    title: 'Property Dispute - Land Transfer', 
    caseNumber: 'EHB-2026-002',
    status: 'pending', 
    progress: 15,
    lawyer: null,
    nextHearing: null,
    created_at: '2026-03-10',
    category: 'Property Law'
  },
  { 
    id: 3, 
    title: 'Business Contract Review', 
    caseNumber: 'EHB-2026-003',
    status: 'completed', 
    progress: 100,
    lawyer: { name: 'Adv. Ahmed Khan', image: '👨‍⚖️', rating: 4.8 },
    nextHearing: null,
    created_at: '2026-02-15',
    category: 'Corporate Law'
  }
];

// Quick Stats
const DASHBOARD_STATS = [
  { label: 'Active Cases', value: 2, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { label: 'Completed', value: 1, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
  { label: 'Documents', value: 12, icon: FileText, color: 'from-violet-500 to-purple-500' },
  { label: 'Pending Payments', value: '$450', icon: CreditCard, color: 'from-orange-500 to-amber-500' },
];

// Recent Activity
const RECENT_ACTIVITY = [
  { type: 'document', title: 'Document uploaded: Marriage Certificate', time: '2 hours ago', icon: Upload },
  { type: 'message', title: 'New message from Adv. Sarah Ahmed', time: '5 hours ago', icon: MessageSquare },
  { type: 'update', title: 'Case status updated to "In Progress"', time: '1 day ago', icon: TrendingUp },
  { type: 'payment', title: 'Payment of $150 received', time: '2 days ago', icon: CreditCard },
];

export default function ClientDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState(MOCK_CASES);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredCases = cases.filter(c => {
    if (activeTab === 'active') return c.status !== 'completed';
    if (activeTab === 'completed') return c.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-ehb-textMuted border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome Back!</h1>
                  <p className="text-ehb-textMuted">Manage your legal cases and documents</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/ai-agent"
                className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Bot size={18} />
                AI Assistant
              </Link>
              <Link
                href="/create-case"
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                New Case
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {DASHBOARD_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-ehb-textMuted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cases */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Cases' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#D4AF37] text-slate-900' 
                        : 'bg-white/5 text-ehb-textMuted hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <Link href="/marketplace" className="text-[#D4AF37] hover:text-yellow-400 flex items-center gap-1 text-sm">
                Find Lawyer <ChevronRight size={16} />
              </Link>
            </div>

            {/* Cases List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
                </div>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((caseItem, index) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">{caseItem.caseNumber}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{caseItem.title}</h3>
                        <p className="text-sm text-ehb-textMuted">{caseItem.category}</p>
                      </div>
                      
                      {caseItem.lawyer && (
                        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2">
                          <span className="text-2xl">{caseItem.lawyer.image}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{caseItem.lawyer.name}</p>
                            <p className="text-xs text-yellow-400">⭐ {caseItem.lawyer.rating}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-ehb-textMuted">Progress</span>
                        <span className="text-[#D4AF37] font-medium">{caseItem.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${caseItem.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${
                            caseItem.progress === 100 
                              ? 'bg-emerald-500' 
                              : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {caseItem.nextHearing && (
                          <div className="flex items-center gap-2 text-xs text-ehb-textMuted">
                            <Calendar size={14} />
                            Next: {new Date(caseItem.nextHearing).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-ehb-textMuted">
                          <Clock size={14} />
                          Created: {new Date(caseItem.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                          <MessageSquare className="text-ehb-textMuted" size={16} />
                        </button>
                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                          <Eye className="text-ehb-textMuted" size={16} />
                        </button>
                        <Link 
                          href={`/case/${caseItem.caseNumber}`}
                          className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-sm font-medium hover:bg-[#D4AF37]/30 transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <Briefcase className="mx-auto text-slate-600 mb-4" size={48} />
                  <p className="text-ehb-textMuted mb-4">No cases found</p>
                  <Link 
                    href="/create-case"
                    className="inline-flex items-center gap-2 text-[#D4AF37] font-medium hover:underline"
                  >
                    <Plus size={16} />
                    Start a new case
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/ai-agent"
                className="group bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all"
              >
                <Bot className="text-blue-400 mb-4" size={32} />
                <h3 className="text-lg font-bold text-white mb-2">AI Legal Advisor</h3>
                <p className="text-sm text-ehb-textMuted mb-4">Get instant AI-powered legal guidance</p>
                <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ask AI <ArrowRight size={16} />
                </span>
              </Link>
              
              <Link 
                href="/document-generator"
                className="group bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all"
              >
                <FileText className="text-emerald-400 mb-4" size={32} />
                <h3 className="text-lg font-bold text-white mb-2">Document Generator</h3>
                <p className="text-sm text-ehb-textMuted mb-4">Create legal documents instantly</p>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Generate <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column - Activity & Info */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Bell size={18} className="text-[#D4AF37]" />
                  Recent Activity
                </h3>
                <button className="text-xs text-ehb-textMuted hover:text-white">View All</button>
              </div>
              
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <activity.icon className="text-[#D4AF37]" size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-white">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-[#D4AF37]" />
                  Recent Documents
                </h3>
                <button className="text-xs text-ehb-textMuted hover:text-white">View All</button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Marriage_Certificate.pdf', size: '2.4 MB' },
                  { name: 'ID_Verification.jpg', size: '1.1 MB' },
                  { name: 'Contract_Draft.docx', size: '450 KB' },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                        <FileText className="text-[#D4AF37]" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <Download className="text-ehb-textMuted" size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 border-2 border-dashed border-white/10 rounded-xl text-sm font-medium text-ehb-textMuted hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2">
                <Upload size={16} />
                Upload Document
              </button>
            </div>

            {/* Pending Payment */}
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-orange-400" size={20} />
                <h3 className="font-bold text-white">Pending Payment</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">$450.00</p>
                  <p className="text-xs text-orange-400">Due by Mar 15, 2026</p>
                </div>
                <span className="text-xs text-ehb-textMuted">Case #EHB-2026-001</span>
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
