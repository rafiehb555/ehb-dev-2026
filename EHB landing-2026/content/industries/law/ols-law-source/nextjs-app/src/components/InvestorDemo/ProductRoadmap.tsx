'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, CheckCircle2, Clock, Code, Rocket, Globe,
  Bot, Users, CreditCard, Shield, Zap, Building2,
  ChevronRight, Star, Target, TrendingUp, Layers,
  FileText, Scale, MessageSquare, Video, Award
} from 'lucide-react';

interface RoadmapQuarter {
  quarter: string;
  title: string;
  titleUrdu: string;
  timeline: string;
  goal: string;
  goalUrdu: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  color: string;
  icon: React.ElementType;
  features: {
    name: string;
    nameUrdu: string;
    status: 'done' | 'in_progress' | 'planned';
    priority: 'critical' | 'high' | 'medium';
  }[];
  metrics: {
    users: string;
    lawyers: string;
    countries: string;
  };
  deliverables: string[];
}

const ROADMAP_DATA: RoadmapQuarter[] = [
  {
    quarter: 'Q1',
    title: 'Product Prototype',
    titleUrdu: 'پروڈکٹ پروٹوٹائپ',
    timeline: 'Months 1-3',
    goal: 'Launch working demo platform',
    goalUrdu: 'ورکنگ ڈیمو پلیٹ فارم لانچ کریں',
    status: 'in_progress',
    color: 'from-blue-500 to-cyan-500',
    icon: Code,
    features: [
      { name: 'AI Legal Assistant', nameUrdu: 'AI قانونی معاون', status: 'done', priority: 'critical' },
      { name: 'Legal Services Marketplace', nameUrdu: 'قانونی خدمات مارکیٹ', status: 'done', priority: 'critical' },
      { name: 'Lawyer Profiles & Listing', nameUrdu: 'وکیل پروفائلز', status: 'done', priority: 'critical' },
      { name: 'Case Creation Wizard', nameUrdu: 'کیس بنانے کا وزرڈ', status: 'done', priority: 'critical' },
      { name: 'Document Generator', nameUrdu: 'دستاویز جنریٹر', status: 'done', priority: 'high' },
      { name: 'Voice Interaction', nameUrdu: 'وائس انٹریکشن', status: 'done', priority: 'high' },
      { name: 'Bilingual Support (EN/UR)', nameUrdu: 'دو زبانی سپورٹ', status: 'done', priority: 'high' },
    ],
    metrics: { users: '1K', lawyers: '100', countries: '1' },
    deliverables: ['Demo-ready platform', 'Investor presentation', 'Core UI/UX complete'],
  },
  {
    quarter: 'Q2',
    title: 'Core Platform Development',
    titleUrdu: 'کور پلیٹ فارم ڈیولپمنٹ',
    timeline: 'Months 4-6',
    goal: 'Build production backend',
    goalUrdu: 'پروڈکشن بیک اینڈ بنائیں',
    status: 'upcoming',
    color: 'from-violet-500 to-purple-500',
    icon: Layers,
    features: [
      { name: 'User Authentication System', nameUrdu: 'صارف تصدیقی نظام', status: 'planned', priority: 'critical' },
      { name: 'Database Integration', nameUrdu: 'ڈیٹابیس انٹیگریشن', status: 'planned', priority: 'critical' },
      { name: 'Payment Gateway', nameUrdu: 'پیمنٹ گیٹ وے', status: 'planned', priority: 'critical' },
      { name: 'Escrow System', nameUrdu: 'ایسکرو سسٹم', status: 'planned', priority: 'critical' },
      { name: 'Consultation Booking', nameUrdu: 'مشاورت بکنگ', status: 'planned', priority: 'high' },
      { name: 'Case Management Dashboard', nameUrdu: 'کیس مینجمنٹ ڈیش بورڈ', status: 'planned', priority: 'high' },
      { name: 'Lawyer Verification Flow', nameUrdu: 'وکیل تصدیق فلو', status: 'planned', priority: 'high' },
      { name: 'Real-time Messaging', nameUrdu: 'ریئل ٹائم میسجنگ', status: 'planned', priority: 'medium' },
    ],
    metrics: { users: '10K', lawyers: '500', countries: '2' },
    deliverables: ['Beta version launch', 'Payment processing', 'User onboarding flow'],
  },
  {
    quarter: 'Q3',
    title: 'AI Automation',
    titleUrdu: 'AI آٹومیشن',
    timeline: 'Months 7-9',
    goal: 'Implement intelligent AI features',
    goalUrdu: 'ذہین AI فیچرز نافذ کریں',
    status: 'upcoming',
    color: 'from-emerald-500 to-green-500',
    icon: Bot,
    features: [
      { name: 'AI Case Analysis Engine', nameUrdu: 'AI کیس تجزیہ انجن', status: 'planned', priority: 'critical' },
      { name: 'AI Lawyer Matching Algorithm', nameUrdu: 'AI وکیل میچنگ الگورتھم', status: 'planned', priority: 'critical' },
      { name: 'AI Legal Research System', nameUrdu: 'AI قانونی تحقیق نظام', status: 'planned', priority: 'high' },
      { name: 'AI Document Automation', nameUrdu: 'AI دستاویز آٹومیشن', status: 'planned', priority: 'high' },
      { name: 'Case Success Prediction', nameUrdu: 'کیس کامیابی کی پیشگوئی', status: 'planned', priority: 'high' },
      { name: 'Multi-Agent Orchestration', nameUrdu: 'ملٹی ایجنٹ آرکیسٹریشن', status: 'planned', priority: 'medium' },
      { name: 'Video Consultation', nameUrdu: 'ویڈیو مشاورت', status: 'planned', priority: 'medium' },
    ],
    metrics: { users: '50K', lawyers: '2K', countries: '3' },
    deliverables: ['AI-powered platform', 'LLM integration', 'Smart recommendations'],
  },
  {
    quarter: 'Q4',
    title: 'Global Expansion',
    titleUrdu: 'عالمی توسیع',
    timeline: 'Months 10-12',
    goal: 'Scale to international markets',
    goalUrdu: 'بین الاقوامی مارکیٹوں میں توسیع',
    status: 'upcoming',
    color: 'from-brand-primary to-brand-gold',
    icon: Globe,
    features: [
      { name: 'Multi-Language Support (6+)', nameUrdu: 'ملٹی لینگویج سپورٹ', status: 'planned', priority: 'critical' },
      { name: 'Global Payment Systems', nameUrdu: 'عالمی ادائیگی سسٹم', status: 'planned', priority: 'critical' },
      { name: 'Franchise Management System', nameUrdu: 'فرنچائز مینجمنٹ سسٹم', status: 'planned', priority: 'critical' },
      { name: 'Enterprise Legal Services', nameUrdu: 'انٹرپرائز قانونی خدمات', status: 'planned', priority: 'high' },
      { name: 'EHBGC Platform Coin', nameUrdu: 'EHBGC پلیٹ فارم کوائن', status: 'planned', priority: 'medium' },
      { name: 'White-label Solution', nameUrdu: 'وائٹ لیبل حل', status: 'planned', priority: 'medium' },
      { name: 'Mobile Apps (iOS/Android)', nameUrdu: 'موبائل ایپس', status: 'planned', priority: 'high' },
    ],
    metrics: { users: '100K', lawyers: '5K', countries: '5' },
    deliverables: ['Global platform launch', 'Franchise network', 'Enterprise clients'],
  },
];

const DEVELOPMENT_PRIORITIES = [
  { priority: 1, name: 'Core User Flow', description: 'Homepage → AI → Case → Payment → Dashboard', icon: Users },
  { priority: 2, name: 'Lawyer Marketplace', description: 'Profiles, ratings, hiring, payments', icon: Scale },
  { priority: 3, name: 'Case Management', description: 'Timeline, documents, communication', icon: FileText },
  { priority: 4, name: 'AI Automation', description: 'Analysis, matching, research, documents', icon: Bot },
  { priority: 5, name: 'Global Features', description: 'Languages, payments, franchise', icon: Globe },
];

interface ProductRoadmapProps {
  language?: 'en' | 'ur';
}

export default function ProductRoadmap({ language = 'en' }: ProductRoadmapProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const selectedData = ROADMAP_DATA.find(q => q.quarter === selectedQuarter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Done</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-500/20 text-ehb-textMuted text-xs rounded-full">Planned</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">High</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-500/20 text-ehb-textMuted text-xs rounded-full">Medium</span>;
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Calendar className="text-brand-gold" />
          {language === 'ur' ? 'پروڈکٹ روڈ میپ' : 'Product Roadmap'}
        </h2>
        <p className="text-ehb-textMuted">
          {language === 'ur'
            ? '12 ماہ کا ترقیاتی منصوبہ'
            : '12-Month Development Plan'}
        </p>
      </div>

      {/* Quarter Timeline Navigation */}
      <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {ROADMAP_DATA.map((quarter, index) => {
          const QuarterIcon = quarter.icon;
          const isSelected = selectedQuarter === quarter.quarter;
          
          return (
            <button
              key={quarter.quarter}
              onClick={() => setSelectedQuarter(quarter.quarter)}
              className={`relative flex flex-col items-center min-w-[100px] p-4 rounded-xl transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${quarter.color} text-white shadow-lg`
                  : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
              }`}
            >
              {/* Connection line */}
              {index < ROADMAP_DATA.length - 1 && (
                <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-slate-600 translate-x-full" />
              )}
              
              <QuarterIcon size={24} className="mb-2" />
              <span className="font-bold">{quarter.quarter}</span>
              <span className="text-xs opacity-80">{quarter.timeline}</span>
              
              {/* Status indicator */}
              {quarter.status === 'in_progress' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Quarter Details */}
      <AnimatePresence mode="wait">
        {selectedData && (
          <motion.div
            key={selectedData.quarter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Quarter Header */}
            <div className={`bg-gradient-to-r ${selectedData.color} rounded-2xl p-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/80 text-sm">{selectedData.quarter}</span>
                    {selectedData.status === 'in_progress' && (
                      <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Current Phase
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {language === 'ur' ? selectedData.titleUrdu : selectedData.title}
                  </h3>
                  <p className="text-white/80 mt-1">
                    {language === 'ur' ? selectedData.goalUrdu : selectedData.goal}
                  </p>
                </div>
                
                {/* Metrics */}
                <div className="flex gap-4">
                  <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                    <p className="text-xl font-bold text-white">{selectedData.metrics.users}</p>
                    <p className="text-xs text-white/70">Users</p>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                    <p className="text-xl font-bold text-white">{selectedData.metrics.lawyers}</p>
                    <p className="text-xs text-white/70">Lawyers</p>
                  </div>
                  <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                    <p className="text-xl font-bold text-white">{selectedData.metrics.countries}</p>
                    <p className="text-xs text-white/70">Countries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Zap className="text-brand-gold" size={18} />
                  Features & Development
                </h4>
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="text-sm text-brand-gold hover:underline"
                >
                  {showAllFeatures ? 'Show Less' : 'Show All'}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {(showAllFeatures ? selectedData.features : selectedData.features.slice(0, 6)).map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {feature.status === 'done' ? (
                        <CheckCircle2 className="text-green-400" size={18} />
                      ) : feature.status === 'in_progress' ? (
                        <Clock className="text-blue-400" size={18} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                      )}
                      <span className="text-white text-sm">
                        {language === 'ur' ? feature.nameUrdu : feature.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(feature.status)}
                      {getPriorityBadge(feature.priority)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Target className="text-brand-gold" size={18} />
                Key Deliverables
              </h4>
              <div className="flex flex-wrap gap-3">
                {selectedData.deliverables.map((deliverable, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-xl text-sm"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Priorities */}
      <div className="mt-8 bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/30">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <Award className="text-brand-gold" size={20} />
          Development Priorities
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          {DEVELOPMENT_PRIORITIES.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connection arrow */}
              {index < DEVELOPMENT_PRIORITIES.length - 1 && (
                <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-brand-gold hidden md:block" size={20} />
              )}
              
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-brand-gold font-bold">{item.priority}</span>
              </div>
              <item.icon className="mx-auto text-ehb-textMuted mb-2" size={20} />
              <p className="text-white font-medium text-sm">{item.name}</p>
              <p className="text-slate-500 text-xs mt-1">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Year Overview Timeline */}
      <div className="mt-8 relative">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <TrendingUp className="text-brand-gold" size={20} />
          12-Month Overview
        </h3>
        
        <div className="relative h-24 bg-slate-800/50 rounded-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="absolute inset-0 flex">
            {ROADMAP_DATA.map((quarter, index) => (
              <div
                key={quarter.quarter}
                className={`flex-1 bg-gradient-to-r ${quarter.color} ${
                  quarter.status === 'completed' ? 'opacity-100' :
                  quarter.status === 'in_progress' ? 'opacity-70' : 'opacity-20'
                } flex items-center justify-center border-r border-white/10 last:border-0`}
              >
                <div className="text-center">
                  <p className="text-white font-bold">{quarter.quarter}</p>
                  <p className="text-white/80 text-xs">{quarter.title}</p>
                  <p className="text-white/60 text-xs">{quarter.metrics.users} users</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current progress indicator */}
          <div className="absolute top-0 left-[12.5%] w-0.5 h-full bg-white animate-pulse" />
        </div>
        
        {/* Month labels */}
        <div className="flex justify-between mt-2 px-4">
          {['Month 1', 'Month 3', 'Month 6', 'Month 9', 'Month 12'].map((month) => (
            <span key={month} className="text-slate-500 text-xs">{month}</span>
          ))}
        </div>
      </div>

      {/* Key Message */}
      <div className="mt-8 text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700">
        <Rocket className="mx-auto text-brand-gold mb-3" size={32} />
        <p className="text-white font-bold text-lg mb-2">
          {language === 'ur'
            ? 'اگلے 12 مہینوں میں، ہم EHB کو پروٹو ٹائپ سے مکمل طور پر آپریشنل AI قانونی پلیٹ فارم میں تبدیل کریں گے'
            : 'Over the next 12 months, we will evolve EHB from a prototype into a fully operational AI legal platform'}
        </p>
        <p className="text-ehb-textMuted">
          Clear milestones, measurable goals, scalable architecture
        </p>
      </div>
    </div>
  );
}
