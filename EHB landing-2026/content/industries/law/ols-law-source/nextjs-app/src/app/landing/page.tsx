'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  Scale, Globe, Bot, Users, Building2, CreditCard, Shield,
  ChevronRight, ArrowRight, Sparkles, Target, TrendingUp,
  Play, Star, Check, Zap, Award, Crown, Rocket, Heart,
  FileText, MessageSquare, Video, Calendar, Lock, Layers,
  BarChart3, PieChart, MapPin, Phone, Mail, Linkedin,
  Twitter, ExternalLink, ArrowUpRight, CheckCircle2,
  Database, Brain, CircuitBoard, Cpu, Briefcase, Gavel
} from 'lucide-react';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Stats Data
const HERO_STATS = [
  { label: 'Global Market', value: 900, suffix: 'B+', prefix: '$', icon: Globe },
  { label: 'Target Countries', value: 50, suffix: '+', icon: MapPin },
  { label: 'AI Agents', value: 14, suffix: '', icon: Bot },
  { label: 'Legal Services', value: 32, suffix: '+', icon: Scale },
];

// AI Agent Features
const AI_AGENT_FEATURES = [
  {
    id: 'agent',
    title: 'AI Legal Agent',
    titleUrdu: 'AI قانونی ایجنٹ',
    description: 'File cases automatically with AI assistance',
    icon: Bot,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'monitoring',
    title: 'Case Monitoring',
    titleUrdu: 'کیس کی نگرانی',
    description: 'Track your case progress in real-time',
    icon: Scale,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'strategy',
    title: 'Legal Strategy',
    titleUrdu: 'قانونی حکمت عملی',
    description: 'AI-powered legal strategy suggestions',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'documents',
    title: 'Document Drafter',
    titleUrdu: 'دستاویز ڈرافٹر',
    description: 'Generate legal documents automatically',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'prediction',
    title: 'Case Prediction',
    titleUrdu: 'کیس کی پیشن گوئی',
    description: 'Predict your case success probability',
    icon: BarChart3,
    color: 'from-orange-500 to-yellow-500',
  },
  {
    id: 'communication',
    title: 'Smart Communication',
    titleUrdu: 'ذہین رابطہ',
    description: 'Chat with your lawyer and get updates',
    icon: MessageSquare,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'lawyers',
    title: 'Lawyer Intelligence',
    titleUrdu: 'وکیل انٹیلیجنس',
    description: 'Analyze lawyer performance and rankings',
    icon: Users,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'franchise',
    title: 'Franchise Intelligence',
    titleUrdu: 'فرنچائز انٹیلیجنس',
    description: 'Franchise analytics and expansion',
    icon: Building2,
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'global',
    title: 'Global Legal',
    titleUrdu: 'عالمی قانون',
    description: 'International legal procedures',
    icon: Globe,
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'autonomous',
    title: 'Autonomous System',
    titleUrdu: 'خود مختار نظام',
    description: 'Full AI automation control center',
    icon: CircuitBoard,
    color: 'from-violet-500 to-purple-500',
  },
];

// Platform Features
const FEATURES = [
  {
    icon: Bot,
    title: 'AI Legal Assistant',
    description: 'Voice & text powered AI that understands legal problems in multiple languages',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Scale,
    title: 'Global Lawyer Marketplace',
    description: '25,000+ verified lawyers across 50+ countries with transparent pricing',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: FileText,
    title: 'AI Document Generator',
    description: 'Generate legal notices, contracts, and petitions in seconds',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Shield,
    title: 'Secure Escrow System',
    description: 'Protected payments released only when milestones are completed',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Building2,
    title: 'Franchise Network',
    description: 'Scalable city-level franchises for rapid global expansion',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Layers,
    title: 'Multi-Agent AI System',
    description: '14 specialized AI agents working together for automation',
    color: 'from-indigo-500 to-blue-500',
  },
];

// Legal Services
const LEGAL_SERVICES = [
  { name: 'Family Law', icon: Heart, cases: '15,000+' },
  { name: 'Property Law', icon: Building2, cases: '12,000+' },
  { name: 'Corporate Law', icon: BriefcaseIcon, cases: '8,000+' },
  { name: 'Immigration', icon: Globe, cases: '10,000+' },
  { name: 'Criminal Defense', icon: Shield, cases: '5,000+' },
  { name: 'Tax Law', icon: FileText, cases: '7,000+' },
];

// Briefcase icon component
function BriefcaseIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

// Presentation icon
function Presentation({ className, size }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h20"/>
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>
      <path d="m7 21 5-5 5 5"/>
    </svg>
  );
}

// Revenue Streams
const REVENUE_STREAMS = [
  { name: 'Legal Service Fees', percentage: 35, color: 'bg-blue-500' },
  { name: 'Lawyer Subscriptions', percentage: 25, color: 'bg-violet-500' },
  { name: 'Franchise Network', percentage: 20, color: 'bg-emerald-500' },
  { name: 'AI Tools Premium', percentage: 12, color: 'bg-orange-500' },
  { name: 'Enterprise Solutions', percentage: 8, color: 'bg-pink-500' },
];

// Roadmap
const ROADMAP = [
  { quarter: 'Q1', title: 'Prototype', status: 'current', metrics: '1K Users' },
  { quarter: 'Q2', title: 'Beta Launch', status: 'upcoming', metrics: '10K Users' },
  { quarter: 'Q3', title: 'AI Automation', status: 'upcoming', metrics: '50K Users' },
  { quarter: 'Q4', title: 'Global Launch', status: 'upcoming', metrics: '100K Users' },
];

// Competitors
const COMPETITORS = [
  { name: 'EHB Law', ai: true, global: true, franchise: true, multiAgent: true, highlight: true },
  { name: 'LegalZoom', ai: false, global: false, franchise: false, multiAgent: false, highlight: false },
  { name: 'Rocket Lawyer', ai: false, global: false, franchise: false, multiAgent: false, highlight: false },
  { name: 'Avvo', ai: false, global: false, franchise: false, multiAgent: false, highlight: false },
  { name: 'LawDepot', ai: false, global: false, franchise: false, multiAgent: false, highlight: false },
];

// Ecosystem Layers
const ECOSYSTEM_LAYERS = [
  {
    name: 'User Interaction',
    color: 'from-blue-500 to-cyan-500',
    items: ['AI Voice Assistant', 'AI Chat', 'AI Search', 'Document Generator']
  },
  {
    name: 'Legal Services',
    color: 'from-violet-500 to-purple-500',
    items: ['Family Law', 'Property Law', 'Corporate Law', 'Immigration']
  },
  {
    name: 'Lawyer Marketplace',
    color: 'from-emerald-500 to-green-500',
    items: ['Verified Lawyers', 'Ratings', 'Consultations', 'Hiring']
  },
  {
    name: 'AI Automation',
    color: 'from-orange-500 to-amber-500',
    items: ['Case Analysis', 'Lawyer Matching', 'Document Gen', 'Prediction']
  },
  {
    name: 'Business Ecosystem',
    color: 'from-pink-500 to-rose-500',
    items: ['Franchise Network', 'Global Expansion', 'Subscriptions', 'AI Tools']
  },
];

// Database Stats
const DATABASE_STATS = [
  { name: 'Total Tables', value: 25, icon: Database },
  { name: 'Core Entities', value: 8, icon: Layers },
  { name: 'Extended Tables', value: 17, icon: FileText },
  { name: 'Data Fields', value: '350+', icon: BarChart3 },
];

// Demo Flow
const DEMO_FLOW = [
  { step: 1, title: 'AI Welcome', desc: 'Homepage with AI assistant', icon: Bot },
  { step: 2, title: 'Voice Command', desc: 'Say "I want to file divorce case"', icon: MessageSquare },
  { step: 3, title: 'AI Agent', desc: 'AI case creation flow', icon: Brain },
  { step: 4, title: 'Lawyer Match', desc: 'AI recommends lawyers', icon: Users },
  { step: 5, title: 'Payment', desc: 'Payment & escrow system', icon: CreditCard },
  { step: 6, title: 'Dashboard', desc: 'Client case dashboard', icon: BarChart3 },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'ecosystem' | 'demo'>('overview');

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                <Scale className="text-white" size={20} />
              </div>
              <div>
                <span className="font-bold text-lg text-white">EHB Law</span>
                <span className="text-[#D4AF37] ml-1 text-sm">AI Platform</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-ehb-textMuted hover:text-white transition-colors text-sm">Features</a>
              <a href="#ai-agents" className="text-ehb-textMuted hover:text-white transition-colors text-sm">AI Agents</a>
              <a href="#market" className="text-ehb-textMuted hover:text-white transition-colors text-sm">Market</a>
              <a href="#ecosystem" className="text-ehb-textMuted hover:text-white transition-colors text-sm">Ecosystem</a>
              <Link href="/database" className="flex items-center gap-2 text-[#D4AF37] hover:text-yellow-400 transition-colors text-sm font-medium">
                <Database size={16} />
                Database
              </Link>
            </div>

            <Link
              href="/"
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
            >
              Enter Platform
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-8"
            >
              <Sparkles size={16} />
              World's First AI-Powered Legal Ecosystem
              <Crown size={16} />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Transforming</span>
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-[#D4AF37] bg-clip-text text-transparent">
                Legal Services
              </span>
              <br />
              <span className="text-white">with AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-ehb-textMuted mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              EHB combines AI technology, global lawyer marketplace, and franchise network 
              to make legal services accessible, affordable, and efficient worldwide.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Link
                href="/"
                className="group px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-3 text-lg"
              >
                <Rocket size={22} />
                Launch Platform
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/investor-demo"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 text-lg"
              >
                <Play size={22} />
                Watch Demo
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                >
                  <stat.icon className="mx-auto text-[#D4AF37] mb-3" size={28} />
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.prefix}<AnimatedCounter end={stat.value} />{stat.suffix}
                  </p>
                  <p className="text-sm text-ehb-textMuted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="text-[#D4AF37] rotate-90" size={32} />
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-3xl p-8 border border-red-500/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                <Target className="text-red-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">The Problem</h3>
              <ul className="space-y-4">
                {[
                  'Legal services cost $200-500/hour on average',
                  '80% of population cannot afford legal help',
                  'Finding the right lawyer is confusing',
                  'Cross-border legal services nearly impossible',
                ].map((problem, i) => (
                  <li key={i} className="flex items-start gap-3 text-ehb-textBody">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-400 text-sm">{i + 1}</span>
                    </div>
                    {problem}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-3xl p-8 border border-emerald-500/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <Zap className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Solution</h3>
              <ul className="space-y-4">
                {[
                  'AI reduces legal costs by up to 70%',
                  'Voice-powered assistant in 6+ languages',
                  'Intelligent lawyer matching algorithm',
                  'Global platform, local expertise',
                ].map((solution, i) => (
                  <li key={i} className="flex items-start gap-3 text-ehb-textBody">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-emerald-400" size={14} />
                    </div>
                    {solution}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Powerful AI Legal Tools
            </h2>
            <p className="text-ehb-textMuted max-w-2xl mx-auto">
              Everything you need to access legal services, powered by artificial intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all hover:shadow-xl hover:shadow-[#D4AF37]/5"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-ehb-textMuted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agent System Section */}
      <section id="ai-agents" className="py-20 relative bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">AI Agent System</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              14 Specialized AI Agents
            </h2>
            <p className="text-ehb-textMuted max-w-2xl mx-auto">
              Our multi-agent AI system handles everything from case filing to prediction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {AI_AGENT_FEATURES.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#D4AF37]/50 transition-all text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                  <agent.icon className="text-white" size={24} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{agent.title}</h4>
                <p className="text-xs text-slate-500">{agent.description}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Agent CTA */}
          <div className="text-center mt-12">
            <Link
              href="/ai-agent"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <Bot size={22} />
              Try AI Agent System
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Ecosystem Map Section */}
      <section id="ecosystem" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Platform Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              5-Layer Architecture
            </h2>
            <p className="text-ehb-textMuted max-w-2xl mx-auto">
              A complete legal services ecosystem from user interaction to global expansion
            </p>
          </motion.div>

          <div className="space-y-4">
            {ECOSYSTEM_LAYERS.map((layer, index) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${layer.color} bg-opacity-10 rounded-2xl p-6 border border-white/10`}
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${layer.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">{layer.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {layer.items.map((item) => (
                        <span key={item} className="px-3 py-1 bg-white/10 rounded-full text-sm text-ehb-textBody">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Database Architecture Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#D4AF37] font-medium">Technical Architecture</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Enterprise Database
            </h2>
            <p className="text-ehb-textMuted max-w-2xl mx-auto">
              25-table database architecture supporting global legal operations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {DATABASE_STATS.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
              >
                <stat.icon className="mx-auto text-[#D4AF37] mb-3" size={28} />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-ehb-textMuted">{stat.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/database"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              <Database size={22} />
              View Database Architecture
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Market Opportunity Section */}
      <section id="market" className="py-20 relative bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Market Opportunity</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              $900 Billion Market
            </h2>
          </motion.div>

          {/* TAM SAM SOM */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-t-3xl p-6 border border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">TAM - Total Addressable Market</p>
                    <p className="text-white text-lg">Global Legal Services</p>
                  </div>
                  <p className="text-4xl font-bold text-white">$900B</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mx-8 bg-gradient-to-r from-violet-500/20 to-violet-500/10 p-6 border-x border-b border-violet-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-400 text-sm font-medium">SAM - Serviceable Available Market</p>
                    <p className="text-white text-lg">Online Legal Platforms</p>
                  </div>
                  <p className="text-3xl font-bold text-white">$120B</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-16 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-b-3xl p-6 border-x border-b border-[#D4AF37]/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#D4AF37] text-sm font-medium">SOM - Target (1% Market Share)</p>
                    <p className="text-white text-lg">EHB Revenue Potential</p>
                  </div>
                  <p className="text-3xl font-bold text-[#D4AF37]">$9B</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Legal Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEGAL_SERVICES.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
              >
                <service.icon className="mx-auto text-[#D4AF37] mb-2" size={24} />
                <p className="text-white font-medium text-sm">{service.name}</p>
                <p className="text-slate-500 text-xs">{service.cases}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Competitive Advantage</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Why EHB Wins
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-ehb-textMuted font-medium">Platform</th>
                    <th className="text-center p-4 text-ehb-textMuted font-medium">AI-Powered</th>
                    <th className="text-center p-4 text-ehb-textMuted font-medium">Global</th>
                    <th className="text-center p-4 text-ehb-textMuted font-medium">Franchise</th>
                    <th className="text-center p-4 text-ehb-textMuted font-medium">Multi-Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((comp) => (
                    <tr key={comp.name} className={`border-b border-white/5 ${comp.highlight ? 'bg-[#D4AF37]/10' : ''}`}>
                      <td className="p-4">
                        <span className={`font-medium ${comp.highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
                          {comp.name}
                          {comp.highlight && <Crown className="inline ml-2 text-[#D4AF37]" size={16} />}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {comp.ai ? <CheckCircle2 className="mx-auto text-emerald-400" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {comp.global ? <CheckCircle2 className="mx-auto text-emerald-400" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {comp.franchise ? <CheckCircle2 className="mx-auto text-emerald-400" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-600 mx-auto" />}
                      </td>
                      <td className="p-4 text-center">
                        {comp.multiAgent ? <CheckCircle2 className="mx-auto text-emerald-400" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-600 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Flow Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Live Demo Flow</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              7-Minute Demo Journey
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {DEMO_FLOW.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#D4AF37] font-bold text-xl">{item.step}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="text-[#D4AF37]" size={18} />
                    <h4 className="text-white font-bold">{item.title}</h4>
                  </div>
                  <p className="text-sm text-ehb-textMuted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/investor-demo"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <Play size={22} />
              Start Full Demo
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Revenue Model Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Business Model</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Multiple Revenue Streams
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="space-y-6">
                {REVENUE_STREAMS.map((stream, index) => (
                  <motion.div
                    key={stream.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white font-medium">{stream.name}</span>
                      <span className="text-[#D4AF37]">{stream.percentage}%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stream.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${stream.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-white">$500M</p>
                  <p className="text-sm text-ehb-textMuted">Year 5 Target</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">5</p>
                  <p className="text-sm text-ehb-textMuted">Revenue Streams</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">50+</p>
                  <p className="text-sm text-ehb-textMuted">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#D4AF37] font-medium">Product Roadmap</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              12-Month Plan
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {ROADMAP.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex-1 min-w-[200px] max-w-[250px] p-6 rounded-2xl border ${
                  item.status === 'current'
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {item.status === 'current' && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#D4AF37] rounded-full animate-pulse" />
                )}
                <p className={`text-sm font-medium mb-2 ${item.status === 'current' ? 'text-[#D4AF37]' : 'text-ehb-textMuted'}`}>
                  {item.quarter}
                </p>
                <p className="text-xl font-bold text-white mb-2">{item.title}</p>
                <p className="text-sm text-ehb-textMuted">{item.metrics}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore the Platform
            </h2>
            <p className="text-ehb-textMuted">Quick access to all platform features</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Homepage', route: '/', icon: Globe },
              { name: 'AI Agent', route: '/ai-agent', icon: Bot },
              { name: 'Create Case', route: '/create-case', icon: FileText },
              { name: 'Marketplace', route: '/marketplace', icon: Scale },
              { name: 'Database', route: '/database', icon: Database },
              { name: 'Investor Demo', route: '/investor-demo', icon: Presentation },
              { name: 'Dashboard', route: '/dashboard', icon: BarChart3 },
              { name: 'Franchise', route: '/franchise', icon: Building2 },
            ].map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.route}
                  className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all group"
                >
                  <link.icon className="mx-auto text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-white font-medium text-sm">{link.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-3xl p-12 border border-[#D4AF37]/30 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            
            <div className="relative">
              <Rocket className="mx-auto text-[#D4AF37] mb-6" size={48} />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Legal Services?
              </h2>
              <p className="text-ehb-textBody mb-8 max-w-2xl mx-auto">
                Join us in building the world's largest AI-powered legal ecosystem. 
                Experience the future of legal services today.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-3 text-lg"
                >
                  <Zap size={22} />
                  Enter Platform
                  <ArrowRight size={22} />
                </Link>
                
                <Link
                  href="/investor-demo"
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3 text-lg"
                >
                  <Play size={22} />
                  View Full Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                <Scale className="text-white" size={20} />
              </div>
              <div>
                <span className="font-bold text-white">EHB Law</span>
                <span className="text-[#D4AF37] ml-1 text-sm">AI Platform</span>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm">
              © 2026 EHB Law Services. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-ehb-textMuted hover:text-[#D4AF37] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-ehb-textMuted hover:text-[#D4AF37] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-ehb-textMuted hover:text-[#D4AF37] transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
