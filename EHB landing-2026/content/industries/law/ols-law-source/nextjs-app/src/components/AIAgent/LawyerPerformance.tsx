'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Star, TrendingUp, TrendingDown, Award, Clock,
  CheckCircle2, AlertTriangle, BarChart2, Target, Filter,
  ChevronRight, ChevronDown, Shield, Briefcase, MessageSquare,
  Sparkles, ArrowUp, ArrowDown, Medal, Crown, Zap
} from 'lucide-react';

interface LawyerMetrics {
  id: string;
  name: string;
  image?: string;
  specialization: string;
  sqlLevel: string;
  city: string;
  performanceScore: number;
  caseSuccessRate: number;
  clientRating: number;
  totalReviews: number;
  completedCases: number;
  avgResponseTime: string;
  avgCaseDuration: string;
  revenueGenerated: number;
  activeCases: number;
  trend: 'up' | 'down' | 'stable';
  badges: string[];
  weeklyChange: number;
}

interface PerformanceInsight {
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
}

const MOCK_LAWYERS: LawyerMetrics[] = [
  {
    id: '1',
    name: 'Adv. Ahmed Khan',
    specialization: 'Family Law',
    sqlLevel: 'SQL-5',
    city: 'Karachi',
    performanceScore: 94,
    caseSuccessRate: 87,
    clientRating: 4.9,
    totalReviews: 156,
    completedCases: 234,
    avgResponseTime: '15 min',
    avgCaseDuration: '4.2 months',
    revenueGenerated: 125000,
    activeCases: 12,
    trend: 'up',
    badges: ['Top Performer', 'Quick Responder', 'Client Favorite'],
    weeklyChange: 5
  },
  {
    id: '2',
    name: 'Adv. Sarah Malik',
    specialization: 'Property Law',
    sqlLevel: 'SQL-4',
    city: 'Lahore',
    performanceScore: 91,
    caseSuccessRate: 82,
    clientRating: 4.8,
    totalReviews: 98,
    completedCases: 178,
    avgResponseTime: '20 min',
    avgCaseDuration: '5.1 months',
    revenueGenerated: 98000,
    activeCases: 8,
    trend: 'up',
    badges: ['Expert Negotiator', 'Highly Rated'],
    weeklyChange: 3
  },
  {
    id: '3',
    name: 'Adv. Imran Ali',
    specialization: 'Criminal Law',
    sqlLevel: 'SQL-5',
    city: 'Islamabad',
    performanceScore: 88,
    caseSuccessRate: 79,
    clientRating: 4.7,
    totalReviews: 124,
    completedCases: 312,
    avgResponseTime: '30 min',
    avgCaseDuration: '6.3 months',
    revenueGenerated: 156000,
    activeCases: 15,
    trend: 'stable',
    badges: ['Veteran Lawyer', 'Complex Case Expert'],
    weeklyChange: 0
  },
  {
    id: '4',
    name: 'Adv. Fatima Hassan',
    specialization: 'Business Law',
    sqlLevel: 'SQL-3',
    city: 'Multan',
    performanceScore: 82,
    caseSuccessRate: 75,
    clientRating: 4.5,
    totalReviews: 67,
    completedCases: 89,
    avgResponseTime: '45 min',
    avgCaseDuration: '3.8 months',
    revenueGenerated: 45000,
    activeCases: 6,
    trend: 'down',
    badges: ['Rising Star'],
    weeklyChange: -2
  },
  {
    id: '5',
    name: 'Adv. Zainab Shah',
    specialization: 'Immigration',
    sqlLevel: 'SQL-4',
    city: 'Rawalpindi',
    performanceScore: 85,
    caseSuccessRate: 80,
    clientRating: 4.6,
    totalReviews: 89,
    completedCases: 145,
    avgResponseTime: '25 min',
    avgCaseDuration: '2.5 months',
    revenueGenerated: 78000,
    activeCases: 10,
    trend: 'up',
    badges: ['Immigration Expert', 'Fast Processor'],
    weeklyChange: 4
  }
];

const INSIGHTS: PerformanceInsight[] = [
  {
    type: 'positive',
    title: 'Top Performers Identified',
    titleUrdu: 'بہترین کارکردگی والے شناخت ہوئے',
    description: '3 lawyers have achieved 90%+ performance score this month',
    descriptionUrdu: 'اس ماہ 3 وکلاء نے 90% سے زیادہ کارکردگی کا اسکور حاصل کیا'
  },
  {
    type: 'warning',
    title: 'Response Time Alert',
    titleUrdu: 'جوابی وقت کی تنبیہ',
    description: '2 lawyers have average response time above 1 hour',
    descriptionUrdu: '2 وکلاء کا اوسط جوابی وقت 1 گھنٹے سے زیادہ ہے'
  },
  {
    type: 'suggestion',
    title: 'Training Recommendation',
    titleUrdu: 'تربیت کی سفارش',
    description: 'Consider advanced training for 3 lawyers with declining scores',
    descriptionUrdu: 'گرتے ہوئے اسکور والے 3 وکلاء کو ایڈوانس ٹریننگ دیں'
  }
];

interface LawyerPerformanceProps {
  language?: 'en' | 'ur';
}

export default function LawyerPerformance({ language = 'en' }: LawyerPerformanceProps) {
  const [lawyers, setLawyers] = useState<LawyerMetrics[]>(MOCK_LAWYERS);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerMetrics | null>(null);
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'performance' | 'success' | 'rating'>('performance');
  const [showFilters, setShowFilters] = useState(false);

  const specializations = ['all', ...new Set(lawyers.map(l => l.specialization))];

  const filteredLawyers = lawyers
    .filter(l => filterSpecialization === 'all' || l.specialization === filterSpecialization)
    .sort((a, b) => {
      if (sortBy === 'performance') return b.performanceScore - a.performanceScore;
      if (sortBy === 'success') return b.caseSuccessRate - a.caseSuccessRate;
      return b.clientRating - a.clientRating;
    });

  const topPerformers = lawyers.filter(l => l.performanceScore >= 90);
  const avgPerformance = Math.round(lawyers.reduce((acc, l) => acc + l.performanceScore, 0) / lawyers.length);
  const avgSuccessRate = Math.round(lawyers.reduce((acc, l) => acc + l.caseSuccessRate, 0) / lawyers.length);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="text-green-400" size={16} />;
    if (trend === 'down') return <ArrowDown className="text-red-400" size={16} />;
    return <span className="text-slate-400">—</span>;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Crown className="text-yellow-400" size={20} />;
    if (index === 1) return <Medal className="text-slate-300" size={20} />;
    if (index === 2) return <Medal className="text-orange-400" size={20} />;
    return <span className="text-slate-500 font-bold">#{index + 1}</span>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-indigo-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-brand-gold flex items-center justify-center">
            <Users className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI وکیل کارکردگی انٹیلیجنس' : 'AI Lawyer Performance Intelligence'}
            </h2>
            <p className="text-slate-400">
              {language === 'ur' 
                ? 'وکلاء کی کارکردگی کا تجزیہ اور بہترین وکیل کی سفارش'
                : 'Analyze lawyer performance and recommend top lawyers'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Users size={16} />
              {language === 'ur' ? 'کل وکلاء' : 'Total Lawyers'}
            </div>
            <p className="text-white font-bold text-2xl">{lawyers.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Award size={16} />
              {language === 'ur' ? 'ٹاپ پرفارمرز' : 'Top Performers'}
            </div>
            <p className="text-green-400 font-bold text-2xl">{topPerformers.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Target size={16} />
              {language === 'ur' ? 'اوسط اسکور' : 'Avg Score'}
            </div>
            <p className="text-brand-gold font-bold text-2xl">{avgPerformance}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <TrendingUp size={16} />
              {language === 'ur' ? 'کامیابی کی شرح' : 'Success Rate'}
            </div>
            <p className="text-blue-400 font-bold text-2xl">{avgSuccessRate}%</p>
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="text-brand-gold" size={20} />
          {language === 'ur' ? 'AI بصیرت' : 'AI Insights'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INSIGHTS.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                insight.type === 'positive' ? 'bg-green-500/10 border-green-500/30' :
                insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {insight.type === 'positive' && <CheckCircle2 className="text-green-400" size={18} />}
                {insight.type === 'warning' && <AlertTriangle className="text-orange-400" size={18} />}
                {insight.type === 'suggestion' && <Sparkles className="text-blue-400" size={18} />}
                <span className="text-white font-medium text-sm">
                  {language === 'ur' ? insight.titleUrdu : insight.title}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                {language === 'ur' ? insight.descriptionUrdu : insight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-4"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
        >
          <Filter size={18} />
          {language === 'ur' ? 'فلٹرز' : 'Filters'}
          <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-4"
            >
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="bg-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec} className="bg-slate-800">
                    {spec === 'all' ? (language === 'ur' ? 'تمام' : 'All') : spec}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                <option value="performance" className="bg-slate-800">
                  {language === 'ur' ? 'کارکردگی' : 'Performance'}
                </option>
                <option value="success" className="bg-slate-800">
                  {language === 'ur' ? 'کامیابی' : 'Success Rate'}
                </option>
                <option value="rating" className="bg-slate-800">
                  {language === 'ur' ? 'ریٹنگ' : 'Rating'}
                </option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lawyer Rankings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <BarChart2 className="text-brand-gold" size={20} />
            {language === 'ur' ? 'وکلاء کی درجہ بندی' : 'Lawyer Rankings'}
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {filteredLawyers.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedLawyer(selectedLawyer?.id === lawyer.id ? null : lawyer)}
              className={`p-4 cursor-pointer transition-all ${
                selectedLawyer?.id === lawyer.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-10 flex-shrink-0 flex justify-center">
                  {getRankBadge(index)}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center text-white font-bold flex-shrink-0">
                  {lawyer.name.split(' ').slice(-1)[0][0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold truncate">{lawyer.name}</h4>
                    <span className="text-xs bg-brand-primary/30 text-brand-primary px-2 py-0.5 rounded">
                      {lawyer.sqlLevel}
                    </span>
                    {getTrendIcon(lawyer.trend)}
                    {lawyer.weeklyChange !== 0 && (
                      <span className={`text-xs ${lawyer.weeklyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {lawyer.weeklyChange > 0 ? '+' : ''}{lawyer.weeklyChange}%
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{lawyer.specialization} • {lawyer.city}</p>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <p className={`font-bold text-lg ${getScoreColor(lawyer.performanceScore)}`}>
                      {lawyer.performanceScore}%
                    </p>
                    <p className="text-slate-500 text-xs">{language === 'ur' ? 'اسکور' : 'Score'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{lawyer.caseSuccessRate}%</p>
                    <p className="text-slate-500 text-xs">{language === 'ur' ? 'کامیابی' : 'Success'}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={14} />
                      <p className="text-white font-bold">{lawyer.clientRating}</p>
                    </div>
                    <p className="text-slate-500 text-xs">({lawyer.totalReviews})</p>
                  </div>
                </div>

                <ChevronRight 
                  className={`text-slate-400 transition-transform ${selectedLawyer?.id === lawyer.id ? 'rotate-90' : ''}`} 
                  size={20} 
                />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3 ml-14">
                {lawyer.badges.map((badge, i) => (
                  <span key={i} className="px-2 py-0.5 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedLawyer?.id === lawyer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-slate-400 text-xs mb-1">
                          {language === 'ur' ? 'مکمل کیسز' : 'Completed Cases'}
                        </p>
                        <p className="text-white font-bold">{lawyer.completedCases}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-slate-400 text-xs mb-1">
                          {language === 'ur' ? 'فعال کیسز' : 'Active Cases'}
                        </p>
                        <p className="text-white font-bold">{lawyer.activeCases}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-slate-400 text-xs mb-1">
                          {language === 'ur' ? 'جوابی وقت' : 'Response Time'}
                        </p>
                        <p className="text-white font-bold">{lawyer.avgResponseTime}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-slate-400 text-xs mb-1">
                          {language === 'ur' ? 'آمدنی' : 'Revenue'}
                        </p>
                        <p className="text-green-400 font-bold">${lawyer.revenueGenerated.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        {language === 'ur' ? 'پیغام بھیجیں' : 'Send Message'}
                      </button>
                      <button className="flex-1 py-2 bg-white/10 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <Briefcase size={16} />
                        {language === 'ur' ? 'کیس تفویض کریں' : 'Assign Case'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10 rounded-2xl p-6 border border-brand-gold/20"
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="text-brand-gold" size={20} />
          {language === 'ur' ? 'AI سفارش: آج کے ٹاپ وکلاء' : 'AI Recommendation: Today\'s Top Lawyers'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformers.slice(0, 3).map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold">{lawyer.name}</h4>
                  <p className="text-slate-400 text-sm">{lawyer.specialization}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {language === 'ur' ? 'کامیابی' : 'Success'}: {lawyer.caseSuccessRate}%
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  {lawyer.clientRating}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
