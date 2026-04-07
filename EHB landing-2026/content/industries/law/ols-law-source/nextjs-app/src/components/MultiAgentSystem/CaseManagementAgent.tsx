'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale, Plus, Search, Filter, Clock, CheckCircle2,
  AlertTriangle, FileText, User, Calendar, MapPin,
  MoreVertical, Eye, Edit, Trash2, RefreshCw, Loader2,
  ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2
} from 'lucide-react';

interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  titleUrdu: string;
  type: string;
  typeUrdu: string;
  status: 'new' | 'assigned' | 'in_progress' | 'hearing' | 'completed' | 'closed';
  client: {
    name: string;
    email: string;
    phone: string;
  };
  lawyer?: {
    name: string;
    specialization: string;
  };
  country: string;
  city: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  nextHearing?: Date;
  stages: CaseStage[];
}

interface CaseStage {
  id: string;
  name: string;
  nameUrdu: string;
  status: 'pending' | 'completed' | 'current';
  date?: Date;
  notes?: string;
}

const MOCK_CASES: LegalCase[] = [
  {
    id: 'case-1',
    caseNumber: 'EHB-2026-001234',
    title: 'Property Dispute - Land Ownership',
    titleUrdu: 'پراپرٹی تنازعہ - زمین کی ملکیت',
    type: 'Property Law',
    typeUrdu: 'پراپرٹی قانون',
    status: 'in_progress',
    client: { name: 'Ahmad Khan', email: 'ahmad@email.com', phone: '+92300-1234567' },
    lawyer: { name: 'Adv. Imran Sheikh', specialization: 'Property Law' },
    country: 'Pakistan',
    city: 'Lahore',
    priority: 'high',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-03-10'),
    nextHearing: new Date('2026-03-25'),
    stages: [
      { id: 's1', name: 'Case Filed', nameUrdu: 'کیس داخل', status: 'completed', date: new Date('2026-02-15') },
      { id: 's2', name: 'Documents Submitted', nameUrdu: 'دستاویزات جمع', status: 'completed', date: new Date('2026-02-20') },
      { id: 's3', name: 'Lawyer Assigned', nameUrdu: 'وکیل مقرر', status: 'completed', date: new Date('2026-02-22') },
      { id: 's4', name: 'Legal Notice Sent', nameUrdu: 'قانونی نوٹس', status: 'completed', date: new Date('2026-03-01') },
      { id: 's5', name: 'Court Hearing', nameUrdu: 'عدالتی سماعت', status: 'current' },
      { id: 's6', name: 'Final Judgment', nameUrdu: 'حتمی فیصلہ', status: 'pending' }
    ]
  },
  {
    id: 'case-2',
    caseNumber: 'EHB-2026-001235',
    title: 'Divorce Settlement',
    titleUrdu: 'طلاق کا تصفیہ',
    type: 'Family Law',
    typeUrdu: 'خاندانی قانون',
    status: 'assigned',
    client: { name: 'Fatima Ali', email: 'fatima@email.com', phone: '+92321-9876543' },
    lawyer: { name: 'Adv. Sara Malik', specialization: 'Family Law' },
    country: 'Pakistan',
    city: 'Karachi',
    priority: 'medium',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-08'),
    stages: [
      { id: 's1', name: 'Case Filed', nameUrdu: 'کیس داخل', status: 'completed', date: new Date('2026-03-01') },
      { id: 's2', name: 'Documents Submitted', nameUrdu: 'دستاویزات جمع', status: 'completed', date: new Date('2026-03-05') },
      { id: 's3', name: 'Lawyer Assigned', nameUrdu: 'وکیل مقرر', status: 'current' },
      { id: 's4', name: 'Mediation', nameUrdu: 'ثالثی', status: 'pending' },
      { id: 's5', name: 'Settlement', nameUrdu: 'تصفیہ', status: 'pending' }
    ]
  },
  {
    id: 'case-3',
    caseNumber: 'EHB-2026-001236',
    title: 'Business Contract Breach',
    titleUrdu: 'کاروباری معاہدے کی خلاف ورزی',
    type: 'Corporate Law',
    typeUrdu: 'کارپوریٹ قانون',
    status: 'new',
    client: { name: 'Tech Solutions Ltd', email: 'legal@techsol.com', phone: '+92333-5555555' },
    country: 'UAE',
    city: 'Dubai',
    priority: 'critical',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
    stages: [
      { id: 's1', name: 'Case Filed', nameUrdu: 'کیس داخل', status: 'current' },
      { id: 's2', name: 'Review Pending', nameUrdu: 'جائزہ زیر التوا', status: 'pending' },
      { id: 's3', name: 'Lawyer Assignment', nameUrdu: 'وکیل مقرر', status: 'pending' }
    ]
  }
];

interface CaseManagementAgentProps {
  language?: 'en' | 'ur';
}

export default function CaseManagementAgent({ language = 'en' }: CaseManagementAgentProps) {
  const [cases, setCases] = useState<LegalCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: LegalCase['status']) => {
    const colors = {
      new: 'bg-blue-500',
      assigned: 'bg-yellow-500',
      in_progress: 'bg-violet-500',
      hearing: 'bg-orange-500',
      completed: 'bg-green-500',
      closed: 'bg-gray-500'
    };
    return colors[status];
  };

  const getStatusLabel = (status: LegalCase['status']) => {
    const labels = {
      new: language === 'ur' ? 'نیا' : 'New',
      assigned: language === 'ur' ? 'تفویض شدہ' : 'Assigned',
      in_progress: language === 'ur' ? 'جاری' : 'In Progress',
      hearing: language === 'ur' ? 'سماعت' : 'Hearing',
      completed: language === 'ur' ? 'مکمل' : 'Completed',
      closed: language === 'ur' ? 'بند' : 'Closed'
    };
    return labels[status];
  };

  const getPriorityColor = (priority: LegalCase['priority']) => {
    const colors = {
      low: 'text-green-400 bg-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      high: 'text-orange-400 bg-orange-500/20',
      critical: 'text-red-400 bg-red-500/20'
    };
    return colors[priority];
  };

  const filteredCases = cases.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = searchQuery === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: cases.length,
    new: cases.filter(c => c.status === 'new').length,
    inProgress: cases.filter(c => c.status === 'in_progress' || c.status === 'assigned').length,
    completed: cases.filter(c => c.status === 'completed').length
  };

  const simulateAutoAssign = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCases(prev => prev.map(c => {
        if (c.status === 'new' && !c.lawyer) {
          return {
            ...c,
            status: 'assigned' as const,
            lawyer: { name: 'Adv. Auto-Assigned', specialization: c.type }
          };
        }
        return c;
      }));
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Scale className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">
                {language === 'ur' ? 'کیس مینجمنٹ ایجنٹ' : 'Case Management Agent'}
              </h2>
              <p className="text-ehb-textMuted text-sm">
                {language === 'ur' ? 'قانونی کیس کا مکمل انتظام' : 'Complete legal case lifecycle management'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={simulateAutoAssign}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl font-medium hover:bg-violet-500/30 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {language === 'ur' ? 'آٹو اسائن' : 'Auto-Assign'}
            </button>
            <button
              onClick={() => setIsCreatingCase(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-xl font-medium"
            >
              <Plus size={18} />
              {language === 'ur' ? 'نیا کیس' : 'New Case'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-ehb-textMuted text-xs">{language === 'ur' ? 'کل کیسز' : 'Total Cases'}</div>
              <BarChart2 className="text-brand-gold" size={16} />
            </div>
            <p className="text-white font-bold text-2xl mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-ehb-textMuted text-xs">{language === 'ur' ? 'نئے کیسز' : 'New Cases'}</div>
              <ArrowUpRight className="text-blue-400" size={16} />
            </div>
            <p className="text-blue-400 font-bold text-2xl mt-1">{stats.new}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-ehb-textMuted text-xs">{language === 'ur' ? 'جاری کیسز' : 'In Progress'}</div>
              <TrendingUp className="text-violet-400" size={16} />
            </div>
            <p className="text-violet-400 font-bold text-2xl mt-1">{stats.inProgress}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-ehb-textMuted text-xs">{language === 'ur' ? 'مکمل' : 'Completed'}</div>
              <CheckCircle2 className="text-green-400" size={16} />
            </div>
            <p className="text-green-400 font-bold text-2xl mt-1">{stats.completed}</p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ehb-textMuted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ur' ? 'کیس تلاش کریں...' : 'Search cases...'}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'new', 'assigned', 'in_progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-brand-gold text-slate-900' 
                  : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? (language === 'ur' ? 'سب' : 'All') :
               f === 'new' ? (language === 'ur' ? 'نیا' : 'New') :
               f === 'assigned' ? (language === 'ur' ? 'تفویض' : 'Assigned') :
               f === 'in_progress' ? (language === 'ur' ? 'جاری' : 'In Progress') :
               (language === 'ur' ? 'مکمل' : 'Completed')}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCases.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCase(selectedCase?.id === caseItem.id ? null : caseItem)}
            className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border cursor-pointer transition-all ${
              selectedCase?.id === caseItem.id ? 'border-brand-gold' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-gold text-xs font-mono">{caseItem.caseNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-white font-bold">
                  {language === 'ur' ? caseItem.titleUrdu : caseItem.title}
                </h4>
                <p className="text-ehb-textMuted text-sm">
                  {language === 'ur' ? caseItem.typeUrdu : caseItem.type}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(caseItem.status)} bg-opacity-20 text-white`}>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(caseItem.status)} inline-block mr-1`} />
                {getStatusLabel(caseItem.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div className="flex items-center gap-2 text-ehb-textMuted">
                <User size={14} />
                <span className="truncate">{caseItem.client.name}</span>
              </div>
              <div className="flex items-center gap-2 text-ehb-textMuted">
                <MapPin size={14} />
                <span>{caseItem.city}, {caseItem.country}</span>
              </div>
              {caseItem.lawyer && (
                <div className="flex items-center gap-2 text-green-400">
                  <Scale size={14} />
                  <span className="truncate">{caseItem.lawyer.name}</span>
                </div>
              )}
              {caseItem.nextHearing && (
                <div className="flex items-center gap-2 text-orange-400">
                  <Calendar size={14} />
                  <span>{caseItem.nextHearing.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="relative h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(caseItem.stages.filter(s => s.status === 'completed').length / caseItem.stages.length) * 100}%` 
                }}
                className="h-full bg-gradient-to-r from-brand-primary to-brand-gold"
              />
            </div>
            <p className="text-ehb-textMuted text-xs mt-1">
              {caseItem.stages.filter(s => s.status === 'completed').length}/{caseItem.stages.length} {language === 'ur' ? 'مراحل مکمل' : 'stages complete'}
            </p>

            {/* Expanded Details */}
            <AnimatePresence>
              {selectedCase?.id === caseItem.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  <h5 className="text-white font-semibold mb-3">
                    {language === 'ur' ? 'کیس ٹائم لائن' : 'Case Timeline'}
                  </h5>
                  <div className="space-y-2">
                    {caseItem.stages.map((stage, idx) => (
                      <div key={stage.id} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          stage.status === 'completed' ? 'bg-green-500' :
                          stage.status === 'current' ? 'bg-brand-gold animate-pulse' :
                          'bg-slate-600'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm ${
                            stage.status === 'completed' ? 'text-green-400' :
                            stage.status === 'current' ? 'text-brand-gold' :
                            'text-ehb-textMuted'
                          }`}>
                            {language === 'ur' ? stage.nameUrdu : stage.name}
                          </p>
                          {stage.date && (
                            <p className="text-ehb-textMuted text-xs">{stage.date.toLocaleDateString()}</p>
                          )}
                        </div>
                        {stage.status === 'completed' && <CheckCircle2 className="text-green-500" size={16} />}
                        {stage.status === 'current' && <Clock className="text-brand-gold" size={16} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-gold/20 text-brand-gold rounded-lg text-sm font-medium hover:bg-brand-gold/30">
                      <Eye size={16} />
                      {language === 'ur' ? 'تفصیلات' : 'Details'}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-500/30">
                      <Edit size={16} />
                      {language === 'ur' ? 'ترمیم' : 'Edit'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <Scale className="mx-auto text-ehb-textMuted mb-4" size={48} />
          <p className="text-ehb-textMuted">
            {language === 'ur' ? 'کوئی کیس نہیں ملا' : 'No cases found'}
          </p>
        </div>
      )}
    </div>
  );
}
