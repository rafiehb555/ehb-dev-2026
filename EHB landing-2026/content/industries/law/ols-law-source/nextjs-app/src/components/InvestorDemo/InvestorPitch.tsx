'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Globe, Users, DollarSign, Target, Rocket,
  Building2, Bot, Scale, CreditCard, ChevronRight, CheckCircle2,
  MapPin, Calendar, BarChart3, PieChart, ArrowUpRight, Zap,
  Crown, Shield, Layers, Clock, Star, Award
} from 'lucide-react';

// ============================================================================
// MARKET OPPORTUNITY COMPONENT
// ============================================================================

export function MarketOpportunity({ language = 'en' }: { language?: 'en' | 'ur' }) {
  const marketData = {
    tam: { value: 900, label: 'Total Addressable Market', unit: 'B' },
    sam: { value: 120, label: 'Serviceable Available Market', unit: 'B' },
    som: { value: 9, label: 'Target Market (1%)', unit: 'B' },
  };

  const growthStats = [
    { label: 'Global Lawyers', value: '10M+', icon: Users },
    { label: 'Annual Growth', value: '8.5%', icon: TrendingUp },
    { label: 'Online Adoption', value: '35%', icon: Globe },
    { label: 'AI Opportunity', value: '5x', icon: Bot },
  ];

  const problems = [
    { problem: 'Expensive Lawyers', impact: '$200-500/hour average cost' },
    { problem: 'Slow Process', impact: 'Weeks to months for simple cases' },
    { problem: 'Limited Access', impact: '80% population underserved' },
    { problem: 'No Transparency', impact: 'Hidden fees, unclear process' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Target className="text-brand-gold" />
          {language === 'ur' ? 'مارکیٹ کا موقع' : 'Market Opportunity'}
        </h2>
        <p className="text-slate-400">
          {language === 'ur' 
            ? '$900 بلین کی عالمی قانونی مارکیٹ'
            : '$900 Billion Global Legal Services Market'}
        </p>
      </div>

      {/* TAM/SAM/SOM Funnel */}
      <div className="relative max-w-2xl mx-auto">
        {/* TAM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-blue-600/30 to-blue-500/30 rounded-t-3xl p-6 border border-blue-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">TAM - Total Addressable Market</p>
                <p className="text-white text-lg">Global Legal Services</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">${marketData.tam.value}B</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SAM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-8"
        >
          <div className="bg-gradient-to-r from-violet-600/30 to-violet-500/30 p-6 border-x border-b border-violet-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-400 text-sm font-medium">SAM - Serviceable Available Market</p>
                <p className="text-white text-lg">Online Legal Platforms</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">${marketData.sam.value}B</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SOM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-16"
        >
          <div className="bg-gradient-to-r from-brand-primary/30 to-brand-gold/30 rounded-b-3xl p-6 border-x border-b border-brand-gold/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-gold text-sm font-medium">SOM - Target (1% Market Share)</p>
                <p className="text-white text-lg">EHB Revenue Potential</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-gold">${marketData.som.value}B</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Growth Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {growthStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700"
          >
            <stat.icon className="mx-auto text-brand-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Problems in Market */}
      <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30 mt-8">
        <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
          <Shield size={20} />
          {language === 'ur' ? 'موجودہ مارکیٹ کے مسائل' : 'Current Market Problems'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 font-bold text-sm">{i + 1}</span>
              </div>
              <div>
                <p className="text-white font-medium">{item.problem}</p>
                <p className="text-slate-400 text-sm">{item.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Message */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/30 text-center mt-8">
        <Globe className="mx-auto text-brand-gold mb-3" size={32} />
        <p className="text-white font-bold text-xl mb-2">
          {language === 'ur' 
            ? 'قانونی خدمات ایک ٹریلین ڈالر کی صنعت ہے، لیکن زیادہ تر آف لائن اور غیر موثر ہے'
            : 'Legal services is a trillion-dollar industry, but mostly offline and inefficient'}
        </p>
        <p className="text-brand-gold font-medium">
          EHB is digitizing this massive opportunity
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// REVENUE MODEL COMPONENT
// ============================================================================

export function RevenueModel({ language = 'en' }: { language?: 'en' | 'ur' }) {
  const revenueStreams = [
    {
      id: 'legal-fees',
      name: 'Legal Service Fees',
      nameUrdu: 'قانونی خدمات فیس',
      type: 'Commission',
      percentage: 35,
      description: '10-15% commission on every legal service transaction',
      example: '$50 consultation → $5-7.50 commission',
      icon: Scale,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'subscriptions',
      name: 'Lawyer Subscriptions',
      nameUrdu: 'وکیل سبسکرپشنز',
      type: 'Recurring',
      percentage: 25,
      description: 'Monthly/annual subscription plans for lawyers',
      example: 'Basic $30/mo, Premium $100/mo, Enterprise $500/mo',
      icon: CreditCard,
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 'franchise',
      name: 'Franchise Network',
      nameUrdu: 'فرنچائز نیٹ ورک',
      type: 'Licensing',
      percentage: 20,
      description: 'City franchise licenses and ongoing royalties',
      example: '$5,000-20,000 license + 5% royalty',
      icon: Building2,
      color: 'from-emerald-500 to-green-500',
    },
    {
      id: 'ai-tools',
      name: 'AI Legal Tools',
      nameUrdu: 'AI قانونی ٹولز',
      type: 'SaaS',
      percentage: 12,
      description: 'Premium AI features and document generation',
      example: '$10-50 per document, $25/mo for premium AI',
      icon: Bot,
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Solutions',
      nameUrdu: 'انٹرپرائز حل',
      type: 'B2B',
      percentage: 8,
      description: 'Corporate legal advisory and bulk services',
      example: '$2,000-10,000/mo for corporate packages',
      icon: Crown,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const projections = [
    { year: 'Year 1', users: '50K', lawyers: '2K', revenue: '$2M' },
    { year: 'Year 2', users: '250K', lawyers: '10K', revenue: '$15M' },
    { year: 'Year 3', users: '1M', lawyers: '50K', revenue: '$75M' },
    { year: 'Year 5', users: '5M', lawyers: '200K', revenue: '$500M' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <DollarSign className="text-brand-gold" />
          {language === 'ur' ? 'آمدنی کا ماڈل' : 'Revenue Model'}
        </h2>
        <p className="text-slate-400">
          {language === 'ur'
            ? 'متعدد آمدنی کے ذرائع'
            : 'Multiple Revenue Streams for Sustainable Growth'}
        </p>
      </div>

      {/* Revenue Streams */}
      <div className="space-y-4">
        {revenueStreams.map((stream, index) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${stream.color} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <stream.icon className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold">
                    {language === 'ur' ? stream.nameUrdu : stream.name}
                  </h4>
                  <p className="text-white/70 text-xs">{stream.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stream.percentage}%</p>
                <p className="text-white/70 text-xs">of revenue</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-slate-300 text-sm mb-2">{stream.description}</p>
              <p className="text-slate-500 text-xs bg-slate-900/50 px-3 py-1.5 rounded inline-block">
                Example: {stream.example}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <PieChart className="text-brand-gold" size={20} />
          Revenue Mix
        </h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {revenueStreams.map((stream) => (
            <div key={stream.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stream.color}`} />
              <span className="text-slate-400 text-sm">{stream.name}: {stream.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Projections */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/30">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <BarChart3 className="text-brand-gold" size={20} />
          5-Year Growth Projection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projections.map((proj, index) => (
            <motion.div
              key={proj.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 rounded-xl p-4 text-center"
            >
              <p className="text-brand-gold font-bold mb-3">{proj.year}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xl font-bold text-white">{proj.users}</p>
                  <p className="text-xs text-slate-500">Users</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-violet-400">{proj.lawyers}</p>
                  <p className="text-xs text-slate-500">Lawyers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400">{proj.revenue}</p>
                  <p className="text-xs text-slate-500">Revenue</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Message */}
      <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700">
        <p className="text-white font-bold text-lg mb-2">
          {language === 'ur'
            ? 'EHB قانونی خدمات، وکیل سبسکرپشنز، AI ٹولز، اور فرنچائز پارٹنرشپس سے آمدنی کماتا ہے'
            : 'EHB generates revenue from legal service transactions, lawyer subscriptions, AI tools, and franchise partnerships'}
        </p>
        <p className="text-slate-400">
          Hybrid model = Multiple revenue streams = Sustainable growth
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// GROWTH STRATEGY COMPONENT
// ============================================================================

export function GrowthStrategy({ language = 'en' }: { language?: 'en' | 'ur' }) {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      titleUrdu: 'بنیاد',
      timeline: 'Months 1-6',
      focus: 'Product Development & Initial Launch',
      goals: [
        'Complete MVP development',
        'Launch in Pakistan (home market)',
        'Onboard 500+ lawyers',
        'Acquire 10,000 initial users',
      ],
      metrics: { users: '10K', lawyers: '500', countries: '1' },
      color: 'from-blue-500 to-cyan-500',
    },
    {
      phase: 'Phase 2',
      title: 'Expansion',
      titleUrdu: 'توسیع',
      timeline: 'Months 7-12',
      focus: 'Regional Growth & Feature Enhancement',
      goals: [
        'Launch in UAE & UK',
        'Introduce franchise model',
        'Launch AI premium features',
        'Scale to 5 city franchises',
      ],
      metrics: { users: '50K', lawyers: '2K', countries: '3' },
      color: 'from-violet-500 to-purple-500',
    },
    {
      phase: 'Phase 3',
      title: 'Scale',
      titleUrdu: 'پیمانہ',
      timeline: 'Year 2',
      focus: 'Global Expansion & Market Leadership',
      goals: [
        'Expand to 10+ countries',
        'Launch enterprise solutions',
        'Scale franchise network to 50+ cities',
        'Introduce EHBGC platform coin',
      ],
      metrics: { users: '250K', lawyers: '10K', countries: '10' },
      color: 'from-emerald-500 to-green-500',
    },
    {
      phase: 'Phase 4',
      title: 'Dominance',
      titleUrdu: 'غلبہ',
      timeline: 'Years 3-5',
      focus: 'Market Leadership & Ecosystem Completion',
      goals: [
        'Presence in 50+ countries',
        'Full AI automation',
        '500+ franchise locations',
        'IPO preparation',
      ],
      metrics: { users: '5M', lawyers: '200K', countries: '50' },
      color: 'from-brand-primary to-brand-gold',
    },
  ];

  const strategies = [
    {
      icon: MapPin,
      title: 'Geographic Expansion',
      items: ['Start in home market', 'Expand to similar markets', 'Enter developed markets'],
    },
    {
      icon: Users,
      title: 'User Acquisition',
      items: ['SEO & content marketing', 'Social media presence', 'Referral programs'],
    },
    {
      icon: Building2,
      title: 'Franchise Model',
      items: ['Local partnerships', 'City-level franchises', 'Revenue sharing'],
    },
    {
      icon: Bot,
      title: 'AI Development',
      items: ['Continuous AI improvement', 'New AI features', 'Automation expansion'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Rocket className="text-brand-gold" />
          {language === 'ur' ? 'ترقی کی حکمت عملی' : 'Growth Strategy'}
        </h2>
        <p className="text-slate-400">
          {language === 'ur'
            ? '5 سال میں عالمی توسیع کا منصوبہ'
            : '5-Year Global Expansion Roadmap'}
        </p>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-6">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative"
          >
            {/* Connection Line */}
            {index < phases.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-6 bg-gradient-to-b from-slate-600 to-transparent" />
            )}

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.color} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {phase.phase}: {language === 'ur' ? phase.titleUrdu : phase.title}
                    </h4>
                    <p className="text-white/70 text-sm">{phase.timeline}</p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-white/70 text-sm">{phase.focus}</p>
                </div>
              </div>

              {/* Phase Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Goals */}
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-3">Key Goals</p>
                    <ul className="space-y-2">
                      {phase.goals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2 text-white text-sm">
                          <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-3">Target Metrics</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-white">{phase.metrics.users}</p>
                        <p className="text-xs text-slate-500">Users</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-violet-400">{phase.metrics.lawyers}</p>
                        <p className="text-xs text-slate-500">Lawyers</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-brand-gold">{phase.metrics.countries}</p>
                        <p className="text-xs text-slate-500">Countries</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Growth Strategies */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            <strategy.icon className="text-brand-gold mb-3" size={24} />
            <h4 className="text-white font-bold mb-2">{strategy.title}</h4>
            <ul className="space-y-1">
              {strategy.items.map((item, i) => (
                <li key={i} className="text-slate-400 text-sm flex items-center gap-1">
                  <ChevronRight className="text-brand-gold" size={12} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Why Now */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/30">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="text-brand-gold" size={20} />
          Why Now?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Bot, title: 'AI Revolution', desc: 'AI technology is mature enough for legal automation' },
            { icon: Globe, title: 'Digital Shift', desc: 'Post-pandemic acceleration of online services' },
            { icon: TrendingUp, title: 'Market Gap', desc: 'No dominant global AI legal platform yet' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center shrink-0">
                <item.icon className="text-brand-gold" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Message */}
      <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700">
        <Star className="mx-auto text-brand-gold mb-3" size={32} />
        <p className="text-white font-bold text-xl mb-2">
          {language === 'ur'
            ? 'EHB دنیا کا سب سے بڑا AI قانونی پلیٹ فارم بننے کا ارادہ رکھتا ہے'
            : 'EHB aims to become the world\'s largest AI-powered legal platform'}
        </p>
        <p className="text-slate-400">
          With a clear roadmap from local launch to global dominance
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT - COMPLETE PITCH DECK
// ============================================================================

interface InvestorPitchProps {
  language?: 'en' | 'ur';
}

export default function InvestorPitch({ language = 'en' }: InvestorPitchProps) {
  const [activeSlide, setActiveSlide] = useState<'market' | 'revenue' | 'growth'>('market');

  const slides = [
    { id: 'market', name: 'Market Opportunity', icon: Target },
    { id: 'revenue', name: 'Revenue Model', icon: DollarSign },
    { id: 'growth', name: 'Growth Strategy', icon: Rocket },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800">
      {/* Slide Navigation */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(slide.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSlide === slide.id
                ? 'bg-brand-gold text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <slide.icon size={18} />
            {slide.name}
          </button>
        ))}
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        {activeSlide === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MarketOpportunity language={language} />
          </motion.div>
        )}
        {activeSlide === 'revenue' && (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RevenueModel language={language} />
          </motion.div>
        )}
        {activeSlide === 'growth' && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GrowthStrategy language={language} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
