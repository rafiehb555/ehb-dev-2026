'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Search, Sparkles, FileText, Scale, Globe,
  Clock, Star, Bookmark, ExternalLink, ChevronRight,
  Loader2, Filter, Download, Copy, CheckCircle2, Brain
} from 'lucide-react';

interface LawReference {
  id: string;
  title: string;
  titleUrdu: string;
  jurisdiction: string;
  category: string;
  year: number;
  relevance: number;
  summary: string;
  summaryUrdu: string;
  source: string;
  url?: string;
}

interface CasePrecedent {
  id: string;
  caseTitle: string;
  court: string;
  year: number;
  outcome: 'plaintiff' | 'defendant' | 'settled';
  relevance: number;
  keyPoints: string[];
  keyPointsUrdu: string[];
}

interface LegalArgument {
  id: string;
  title: string;
  titleUrdu: string;
  strength: 'strong' | 'moderate' | 'weak';
  description: string;
  descriptionUrdu: string;
  supportingLaws: string[];
  supportingCases: string[];
}

const SAMPLE_LAWS: LawReference[] = [
  {
    id: 'law-1',
    title: 'Transfer of Property Act, 1882',
    titleUrdu: 'انتقال جائیداد ایکٹ 1882',
    jurisdiction: 'Pakistan',
    category: 'Property Law',
    year: 1882,
    relevance: 95,
    summary: 'Governs the transfer of immovable property and defines the rights of parties in property transactions.',
    summaryUrdu: 'غیر منقولہ جائیداد کی منتقلی کو کنٹرول کرتا ہے',
    source: 'Pakistan Code'
  },
  {
    id: 'law-2',
    title: 'Specific Relief Act, 1877',
    titleUrdu: 'مخصوص ریلیف ایکٹ 1877',
    jurisdiction: 'Pakistan',
    category: 'Civil Law',
    year: 1877,
    relevance: 88,
    summary: 'Provides for specific relief in cases where monetary compensation would be inadequate.',
    summaryUrdu: 'مخصوص ریلیف فراہم کرتا ہے',
    source: 'Pakistan Code'
  },
  {
    id: 'law-3',
    title: 'Land Revenue Act, 1967',
    titleUrdu: 'لینڈ ریونیو ایکٹ 1967',
    jurisdiction: 'Pakistan',
    category: 'Property Law',
    year: 1967,
    relevance: 82,
    summary: 'Deals with land revenue, record of rights, and mutation procedures.',
    summaryUrdu: 'زمین کے ریونیو اور حقوق سے متعلق',
    source: 'Pakistan Code'
  }
];

const SAMPLE_PRECEDENTS: CasePrecedent[] = [
  {
    id: 'prec-1',
    caseTitle: 'Muhammad Ali v. Abdul Rasheed (2019)',
    court: 'Lahore High Court',
    year: 2019,
    outcome: 'plaintiff',
    relevance: 92,
    keyPoints: [
      'Established clear chain of ownership documentation requirements',
      'Defined burden of proof in property disputes',
      'Set precedent for possession claims'
    ],
    keyPointsUrdu: [
      'ملکیت کی دستاویزات کی ضروریات',
      'جائیداد تنازعات میں ثبوت کی ذمہ داری',
      'قبضے کے دعووں کی مثال'
    ]
  },
  {
    id: 'prec-2',
    caseTitle: 'Kareem Brothers Ltd v. National Bank (2020)',
    court: 'Supreme Court of Pakistan',
    year: 2020,
    outcome: 'defendant',
    relevance: 78,
    keyPoints: [
      'Clarified rights of mortgagee in property disputes',
      'Defined timeline for property claims',
      'Set standards for evidence in property cases'
    ],
    keyPointsUrdu: [
      'رہن رکھنے والے کے حقوق',
      'جائیداد دعووں کی ٹائم لائن',
      'ثبوت کے معیارات'
    ]
  }
];

const SAMPLE_ARGUMENTS: LegalArgument[] = [
  {
    id: 'arg-1',
    title: 'Adverse Possession Claim',
    titleUrdu: 'منفی قبضے کا دعویٰ',
    strength: 'strong',
    description: 'If client has possessed the property openly and continuously for 12+ years, adverse possession may apply.',
    descriptionUrdu: 'اگر موکل نے 12+ سال سے جائیداد پر قبضہ کیا ہے',
    supportingLaws: ['Limitation Act, 1908', 'Transfer of Property Act'],
    supportingCases: ['Muhammad Ali v. Abdul Rasheed']
  },
  {
    id: 'arg-2',
    title: 'Documentary Evidence Chain',
    titleUrdu: 'دستاویزی ثبوت',
    strength: 'strong',
    description: 'Present complete chain of ownership documents including sale deed, mutation, and registry.',
    descriptionUrdu: 'فروخت کی دستاویزات پیش کریں',
    supportingLaws: ['Registration Act', 'Evidence Act'],
    supportingCases: []
  },
  {
    id: 'arg-3',
    title: 'Injunction Request',
    titleUrdu: 'حکم امتناعی',
    strength: 'moderate',
    description: 'Request temporary injunction to prevent further damage to property during litigation.',
    descriptionUrdu: 'عارضی حکم امتناعی کی درخواست',
    supportingLaws: ['Specific Relief Act', 'CPC Order XXXIX'],
    supportingCases: []
  }
];

interface LegalResearchAgentProps {
  language?: 'en' | 'ur';
}

export default function LegalResearchAgent({ language = 'en' }: LegalResearchAgentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'laws' | 'precedents' | 'arguments'>('laws');
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const performResearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
    }, 2000);
  }, [searchQuery]);

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const getStrengthColor = (strength: LegalArgument['strength']) => {
    const colors = {
      strong: 'text-green-400 bg-green-500/20',
      moderate: 'text-yellow-400 bg-yellow-500/20',
      weak: 'text-red-400 bg-red-500/20'
    };
    return colors[strength];
  };

  const getOutcomeColor = (outcome: CasePrecedent['outcome']) => {
    const colors = {
      plaintiff: 'text-green-400',
      defendant: 'text-red-400',
      settled: 'text-yellow-400'
    };
    return colors[outcome];
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-emerald-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={20} />
              {language === 'ur' ? 'قانونی تحقیق ایجنٹ' : 'Legal Research Agent'}
            </h2>
            <p className="text-slate-400 text-sm">
              {language === 'ur' ? 'AI سے خودکار قانونی تحقیق' : 'AI-powered intelligent legal research'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performResearch()}
              placeholder={language === 'ur' ? 'قانونی موضوع تلاش کریں...' : 'Search legal topic, case type, or law...'}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
          >
            <option value="Pakistan">Pakistan</option>
            <option value="UAE">UAE</option>
            <option value="UK">United Kingdom</option>
            <option value="USA">United States</option>
            <option value="India">India</option>
          </select>
          <button
            onClick={performResearch}
            disabled={isSearching || !searchQuery.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {language === 'ur' ? 'تلاش جاری...' : 'Searching...'}
              </>
            ) : (
              <>
                <Brain size={20} />
                {language === 'ur' ? 'AI تحقیق' : 'AI Research'}
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'laws', label: language === 'ur' ? 'متعلقہ قوانین' : 'Relevant Laws', count: SAMPLE_LAWS.length },
                { id: 'precedents', label: language === 'ur' ? 'سابقہ کیسز' : 'Case Precedents', count: SAMPLE_PRECEDENTS.length },
                { id: 'arguments', label: language === 'ur' ? 'قانونی دلائل' : 'Legal Arguments', count: SAMPLE_ARGUMENTS.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Laws Tab */}
            {activeTab === 'laws' && (
              <div className="space-y-4">
                {SAMPLE_LAWS.map((law, index) => (
                  <motion.div
                    key={law.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Scale className="text-emerald-400" size={16} />
                          <span className="text-slate-400 text-xs">{law.jurisdiction} • {law.category}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                            {law.relevance}% {language === 'ur' ? 'متعلقہ' : 'relevant'}
                          </span>
                        </div>
                        <h4 className="text-white font-bold text-lg">
                          {language === 'ur' ? law.titleUrdu : law.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => toggleBookmark(law.id)}
                        className={`p-2 rounded-lg ${bookmarked.includes(law.id) ? 'bg-brand-gold/20 text-brand-gold' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark size={18} fill={bookmarked.includes(law.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      {language === 'ur' ? law.summaryUrdu : law.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {law.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        {law.source}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Precedents Tab */}
            {activeTab === 'precedents' && (
              <div className="space-y-4">
                {SAMPLE_PRECEDENTS.map((prec, index) => (
                  <motion.div
                    key={prec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-400 text-xs">{prec.court} • {prec.year}</span>
                          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-xs font-medium">
                            {prec.relevance}% {language === 'ur' ? 'متعلقہ' : 'match'}
                          </span>
                        </div>
                        <h4 className="text-white font-bold">{prec.caseTitle}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getOutcomeColor(prec.outcome)}`}>
                        {prec.outcome === 'plaintiff' ? (language === 'ur' ? 'مدعی جیتا' : 'Plaintiff Won') :
                         prec.outcome === 'defendant' ? (language === 'ur' ? 'مدعا علیہ جیتا' : 'Defendant Won') :
                         (language === 'ur' ? 'تصفیہ' : 'Settled')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-400 text-sm font-medium">{language === 'ur' ? 'اہم نکات:' : 'Key Points:'}</p>
                      {(language === 'ur' ? prec.keyPointsUrdu : prec.keyPoints).map((point, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <ChevronRight className="text-emerald-400 flex-shrink-0 mt-0.5" size={14} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Arguments Tab */}
            {activeTab === 'arguments' && (
              <div className="space-y-4">
                {SAMPLE_ARGUMENTS.map((arg, index) => (
                  <motion.div
                    key={arg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-bold text-lg">
                          {language === 'ur' ? arg.titleUrdu : arg.title}
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStrengthColor(arg.strength)}`}>
                        {arg.strength === 'strong' ? (language === 'ur' ? 'مضبوط' : 'Strong') :
                         arg.strength === 'moderate' ? (language === 'ur' ? 'معتدل' : 'Moderate') :
                         (language === 'ur' ? 'کمزور' : 'Weak')}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">
                      {language === 'ur' ? arg.descriptionUrdu : arg.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arg.supportingLaws.map((law, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                          {law}
                        </span>
                      ))}
                      {arg.supportingCases.map((caseRef, i) => (
                        <span key={i} className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs">
                          {caseRef}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium hover:bg-emerald-500/30">
                <Download size={18} />
                {language === 'ur' ? 'رپورٹ ڈاؤن لوڈ' : 'Download Report'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl font-medium hover:bg-violet-500/30">
                <Copy size={18} />
                {language === 'ur' ? 'کاپی کریں' : 'Copy Citations'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-gold/20 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/30">
                <Sparkles size={18} />
                {language === 'ur' ? 'مزید تحقیق' : 'Deeper Research'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasResults && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Brain className="mx-auto text-slate-600 mb-4" size={64} />
          <h3 className="text-white font-bold text-xl mb-2">
            {language === 'ur' ? 'AI قانونی تحقیق' : 'AI Legal Research'}
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {language === 'ur' 
              ? 'قانونی موضوع یا کیس ٹائپ تلاش کریں اور AI خودکار طور پر متعلقہ قوانین، سابقہ فیصلے اور دلائل تلاش کرے گا'
              : 'Search for any legal topic or case type and AI will automatically find relevant laws, precedents, and arguments'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
