'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, TrendingUp, TrendingDown, MapPin, Users,
  DollarSign, Briefcase, BarChart2, PieChart, Target,
  Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Map, Globe, ArrowUp, ArrowDown, Plus, Zap
} from 'lucide-react';

interface FranchiseData {
  id: string;
  name: string;
  city: string;
  region: string;
  totalLawyers: number;
  activeCases: number;
  completedCases: number;
  revenue: number;
  monthlyGrowth: number;
  performanceScore: number;
  demand: 'very_high' | 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

interface CityDemand {
  city: string;
  region: string;
  demand: number;
  caseTypes: string[];
  recommendation: string;
  recommendationUrdu: string;
  potentialRevenue: number;
  competitorCount: number;
}

interface Recommendation {
  type: 'expansion' | 'optimization' | 'alert';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionUrdu?: string;
}

const MOCK_FRANCHISES: FranchiseData[] = [
  {
    id: '1',
    name: 'EHB Karachi Central',
    city: 'Karachi',
    region: 'Sindh',
    totalLawyers: 45,
    activeCases: 156,
    completedCases: 892,
    revenue: 450000,
    monthlyGrowth: 12,
    performanceScore: 92,
    demand: 'very_high',
    trend: 'up'
  },
  {
    id: '2',
    name: 'EHB Lahore Main',
    city: 'Lahore',
    region: 'Punjab',
    totalLawyers: 38,
    activeCases: 134,
    completedCases: 756,
    revenue: 380000,
    monthlyGrowth: 8,
    performanceScore: 88,
    demand: 'high',
    trend: 'up'
  },
  {
    id: '3',
    name: 'EHB Islamabad',
    city: 'Islamabad',
    region: 'Federal',
    totalLawyers: 28,
    activeCases: 98,
    completedCases: 534,
    revenue: 290000,
    monthlyGrowth: 5,
    performanceScore: 85,
    demand: 'high',
    trend: 'stable'
  },
  {
    id: '4',
    name: 'EHB Rawalpindi',
    city: 'Rawalpindi',
    region: 'Punjab',
    totalLawyers: 18,
    activeCases: 67,
    completedCases: 312,
    revenue: 156000,
    monthlyGrowth: -2,
    performanceScore: 72,
    demand: 'medium',
    trend: 'down'
  },
  {
    id: '5',
    name: 'EHB Faisalabad',
    city: 'Faisalabad',
    region: 'Punjab',
    totalLawyers: 15,
    activeCases: 54,
    completedCases: 245,
    revenue: 125000,
    monthlyGrowth: 6,
    performanceScore: 78,
    demand: 'medium',
    trend: 'up'
  }
];

const CITY_DEMANDS: CityDemand[] = [
  {
    city: 'Karachi',
    region: 'Sindh',
    demand: 95,
    caseTypes: ['Property', 'Business', 'Family'],
    recommendation: 'Open 2 additional franchise offices',
    recommendationUrdu: '2 اضافی فرنچائز آفس کھولیں',
    potentialRevenue: 250000,
    competitorCount: 12
  },
  {
    city: 'Lahore',
    region: 'Punjab',
    demand: 88,
    caseTypes: ['Family', 'Criminal', 'Property'],
    recommendation: 'Expand team by 15 lawyers',
    recommendationUrdu: '15 وکلاء کے ساتھ ٹیم میں اضافہ کریں',
    potentialRevenue: 180000,
    competitorCount: 8
  },
  {
    city: 'Peshawar',
    region: 'KPK',
    demand: 75,
    caseTypes: ['Family', 'Criminal'],
    recommendation: 'New franchise opportunity',
    recommendationUrdu: 'نئی فرنچائز کا موقع',
    potentialRevenue: 120000,
    competitorCount: 3
  },
  {
    city: 'Multan',
    region: 'Punjab',
    demand: 65,
    caseTypes: ['Property', 'Family'],
    recommendation: 'Consider opening new office',
    recommendationUrdu: 'نیا آفس کھولنے پر غور کریں',
    potentialRevenue: 85000,
    competitorCount: 5
  },
  {
    city: 'Quetta',
    region: 'Balochistan',
    demand: 60,
    caseTypes: ['Family', 'Property'],
    recommendation: 'First franchise opportunity',
    recommendationUrdu: 'پہلی فرنچائز کا موقع',
    potentialRevenue: 70000,
    competitorCount: 2
  }
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    type: 'expansion',
    title: 'High Growth Opportunity in Karachi',
    titleUrdu: 'کراچی میں اعلی ترقی کا موقع',
    description: 'Demand is 35% higher than capacity. Consider opening new branches.',
    descriptionUrdu: 'طلب صلاحیت سے 35% زیادہ ہے۔ نئی شاخیں کھولنے پر غور کریں۔',
    priority: 'high',
    action: 'Open New Branch',
    actionUrdu: 'نئی شاخ کھولیں'
  },
  {
    type: 'optimization',
    title: 'Rawalpindi Performance Declining',
    titleUrdu: 'راولپنڈی کی کارکردگی گر رہی ہے',
    description: 'Revenue dropped 2% this month. Review lawyer assignments.',
    descriptionUrdu: 'اس ماہ آمدنی میں 2% کمی آئی۔ وکیل تفویض کا جائزہ لیں۔',
    priority: 'medium',
    action: 'Review & Optimize',
    actionUrdu: 'جائزہ لیں اور بہتر کریں'
  },
  {
    type: 'alert',
    title: 'New Market Entry: Peshawar',
    titleUrdu: 'نئی مارکیٹ: پشاور',
    description: 'No EHB presence but high demand detected. First mover advantage available.',
    descriptionUrdu: 'کوئی EHB موجودگی نہیں لیکن زیادہ مانگ۔ پہلے داخل ہونے کا فائدہ۔',
    priority: 'high',
    action: 'Explore Opportunity',
    actionUrdu: 'موقع دریافت کریں'
  }
];

interface FranchiseIntelligenceProps {
  language?: 'en' | 'ur';
}

export default function FranchiseIntelligence({ language = 'en' }: FranchiseIntelligenceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'demand' | 'recommendations'>('overview');
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseData | null>(null);

  const totalRevenue = MOCK_FRANCHISES.reduce((acc, f) => acc + f.revenue, 0);
  const totalLawyers = MOCK_FRANCHISES.reduce((acc, f) => acc + f.totalLawyers, 0);
  const totalCases = MOCK_FRANCHISES.reduce((acc, f) => acc + f.activeCases, 0);
  const avgGrowth = Math.round(MOCK_FRANCHISES.reduce((acc, f) => acc + f.monthlyGrowth, 0) / MOCK_FRANCHISES.length);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'very_high': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-green-400 bg-green-400/20';
    }
  };

  const getDemandLabel = (demand: string) => {
    const labels: Record<string, { en: string; ur: string }> = {
      very_high: { en: 'Very High', ur: 'بہت زیادہ' },
      high: { en: 'High', ur: 'زیادہ' },
      medium: { en: 'Medium', ur: 'درمیانی' },
      low: { en: 'Low', ur: 'کم' }
    };
    return language === 'ur' ? labels[demand]?.ur : labels[demand]?.en;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-emerald-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-gold flex items-center justify-center">
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI فرنچائز انٹیلیجنس' : 'AI Franchise Intelligence'}
            </h2>
            <p className="text-ehb-textMuted">
              {language === 'ur' 
                ? 'فرنچائز نیٹ ورک کا تجزیہ اور توسیع کی تجاویز'
                : 'Franchise network analysis and expansion recommendations'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-sm mb-1">
              <Building2 size={16} />
              {language === 'ur' ? 'فرنچائزز' : 'Franchises'}
            </div>
            <p className="text-white font-bold text-2xl">{MOCK_FRANCHISES.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-sm mb-1">
              <Users size={16} />
              {language === 'ur' ? 'کل وکلاء' : 'Total Lawyers'}
            </div>
            <p className="text-white font-bold text-2xl">{totalLawyers}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-sm mb-1">
              <Briefcase size={16} />
              {language === 'ur' ? 'فعال کیسز' : 'Active Cases'}
            </div>
            <p className="text-white font-bold text-2xl">{totalCases}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-sm mb-1">
              <DollarSign size={16} />
              {language === 'ur' ? 'کل آمدنی' : 'Total Revenue'}
            </div>
            <p className="text-green-400 font-bold text-2xl">${(totalRevenue/1000).toFixed(0)}K</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {[
          { id: 'overview', label: language === 'ur' ? 'جائزہ' : 'Overview', icon: BarChart2 },
          { id: 'demand', label: language === 'ur' ? 'شہری مانگ' : 'City Demand', icon: Map },
          { id: 'recommendations', label: language === 'ur' ? 'AI تجاویز' : 'AI Recommendations', icon: Zap }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-gold text-brand-dark'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Franchise List */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Building2 className="text-brand-gold" size={20} />
                  {language === 'ur' ? 'فرنچائز کارکردگی' : 'Franchise Performance'}
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {MOCK_FRANCHISES.map((franchise, index) => (
                  <motion.div
                    key={franchise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => setSelectedFranchise(selectedFranchise?.id === franchise.id ? null : franchise)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-brand-gold flex items-center justify-center text-white font-bold">
                        {franchise.city[0]}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{franchise.name}</h4>
                        <p className="text-ehb-textMuted text-sm flex items-center gap-1">
                          <MapPin size={14} />
                          {franchise.city}, {franchise.region}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-center">
                        <div>
                          <p className="text-white font-bold">{franchise.totalLawyers}</p>
                          <p className="text-slate-500 text-xs">{language === 'ur' ? 'وکلاء' : 'Lawyers'}</p>
                        </div>
                        <div>
                          <p className="text-white font-bold">{franchise.activeCases}</p>
                          <p className="text-slate-500 text-xs">{language === 'ur' ? 'کیسز' : 'Cases'}</p>
                        </div>
                        <div>
                          <p className="text-green-400 font-bold">${(franchise.revenue/1000).toFixed(0)}K</p>
                          <p className="text-slate-500 text-xs">{language === 'ur' ? 'آمدنی' : 'Revenue'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {franchise.trend === 'up' ? (
                            <ArrowUp className="text-green-400" size={16} />
                          ) : franchise.trend === 'down' ? (
                            <ArrowDown className="text-red-400" size={16} />
                          ) : (
                            <span className="text-ehb-textMuted">—</span>
                          )}
                          <span className={franchise.monthlyGrowth > 0 ? 'text-green-400' : franchise.monthlyGrowth < 0 ? 'text-red-400' : 'text-ehb-textMuted'}>
                            {franchise.monthlyGrowth > 0 ? '+' : ''}{franchise.monthlyGrowth}%
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${getDemandColor(franchise.demand)}`}>
                        {getDemandLabel(franchise.demand)}
                      </span>
                      <ChevronRight className="text-ehb-textMuted" size={20} />
                    </div>

                    <AnimatePresence>
                      {selectedFranchise?.id === franchise.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-ehb-textMuted text-xs mb-1">{language === 'ur' ? 'کارکردگی اسکور' : 'Performance Score'}</p>
                            <p className="text-brand-gold font-bold text-xl">{franchise.performanceScore}%</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-ehb-textMuted text-xs mb-1">{language === 'ur' ? 'مکمل کیسز' : 'Completed Cases'}</p>
                            <p className="text-white font-bold text-xl">{franchise.completedCases}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-ehb-textMuted text-xs mb-1">{language === 'ur' ? 'ماہانہ ترقی' : 'Monthly Growth'}</p>
                            <p className={`font-bold text-xl ${franchise.monthlyGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {franchise.monthlyGrowth > 0 ? '+' : ''}{franchise.monthlyGrowth}%
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3">
                            <p className="text-ehb-textMuted text-xs mb-1">{language === 'ur' ? 'مانگ کی سطح' : 'Demand Level'}</p>
                            <p className="text-white font-bold text-xl">{getDemandLabel(franchise.demand)}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'demand' && (
          <motion.div
            key="demand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Map className="text-brand-gold" size={20} />
              {language === 'ur' ? 'شہروں میں قانونی خدمات کی مانگ' : 'Legal Service Demand by City'}
            </h3>

            <div className="space-y-4">
              {CITY_DEMANDS.map((city, index) => (
                <motion.div
                  key={city.city}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center text-white font-bold">
                        {city.city[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{city.city}</h4>
                        <p className="text-ehb-textMuted text-sm">{city.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">${city.potentialRevenue.toLocaleString()}</p>
                      <p className="text-ehb-textMuted text-xs">{language === 'ur' ? 'ممکنہ آمدنی' : 'Potential Revenue'}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ehb-textMuted">{language === 'ur' ? 'مانگ کی سطح' : 'Demand Level'}</span>
                      <span className="text-white font-bold">{city.demand}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${city.demand}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${
                          city.demand >= 80 ? 'bg-red-500' :
                          city.demand >= 60 ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {city.caseTypes.map((type, i) => (
                      <span key={i} className="px-2 py-1 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-ehb-textBody text-sm">
                      {language === 'ur' ? city.recommendationUrdu : city.recommendation}
                    </p>
                    <span className="text-ehb-textMuted text-xs">
                      {city.competitorCount} {language === 'ur' ? 'مقابلے' : 'competitors'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {RECOMMENDATIONS.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border ${
                  rec.type === 'expansion' ? 'border-green-500/30' :
                  rec.type === 'alert' ? 'border-orange-500/30' :
                  'border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    rec.type === 'expansion' ? 'bg-green-500/20' :
                    rec.type === 'alert' ? 'bg-orange-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {rec.type === 'expansion' && <Plus className="text-green-400" size={24} />}
                    {rec.type === 'alert' && <AlertTriangle className="text-orange-400" size={24} />}
                    {rec.type === 'optimization' && <Target className="text-blue-400" size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-bold">
                        {language === 'ur' ? rec.titleUrdu : rec.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-ehb-textMuted mb-4">
                      {language === 'ur' ? rec.descriptionUrdu : rec.description}
                    </p>
                    {rec.action && (
                      <button className={`px-4 py-2 rounded-xl font-medium text-sm ${
                        rec.type === 'expansion' ? 'bg-green-500 text-white' :
                        rec.type === 'alert' ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {language === 'ur' ? rec.actionUrdu : rec.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
