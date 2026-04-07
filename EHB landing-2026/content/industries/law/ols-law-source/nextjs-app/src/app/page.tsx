'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, Star, Smartphone, Globe, Bot, FileText, Rocket, Play, ArrowRight, Scale,
  Sparkles, Crown, Shield, Users, Building2, Zap, CheckCircle2, TrendingUp, Award,
  MessageSquare, Search, Mic, Heart, Briefcase, FileSearch, Gavel, Home as HomeIcon,
  Clock, MapPin, Phone, Video, Brain, CircuitBoard, Database, Target, Layers, Menu, X,
  ChevronDown, ExternalLink, BarChart3
} from 'lucide-react';

// Animated Counter
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Hero Stats
const HERO_STATS = [
  { label: 'Active Lawyers', value: 25000, suffix: '+', icon: Users },
  { label: 'Cases Resolved', value: 150000, suffix: '+', icon: CheckCircle2 },
  { label: 'Countries', value: 50, suffix: '+', icon: Globe },
  { label: 'AI Agents', value: 14, suffix: '', icon: Bot },
];

// Quick Actions
const QUICK_ACTIONS = [
  { 
    title: 'AI Agent System', 
    titleUrdu: 'AI ایجنٹ سسٹم',
    desc: '14 specialized AI agents',
    href: '/ai-agent', 
    icon: Bot, 
    gradient: 'from-blue-500 to-violet-600',
    shadow: 'shadow-blue-500/30'
  },
  { 
    title: 'Create Legal Case', 
    titleUrdu: 'قانونی کیس بنائیں',
    desc: 'Start in 5 minutes',
    href: '/create-case', 
    icon: FileText, 
    gradient: 'from-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/30'
  },
  { 
    title: 'Find Lawyer', 
    titleUrdu: 'وکیل تلاش کریں',
    desc: '25,000+ verified lawyers',
    href: '/marketplace', 
    icon: Scale, 
    gradient: 'from-[#D4AF37] to-[#B8860B]',
    shadow: 'shadow-[#D4AF37]/30'
  },
  { 
    title: 'AI Document Generator', 
    titleUrdu: 'AI دستاویز جنریٹر',
    desc: 'Create legal docs instantly',
    href: '/document-generator', 
    icon: FileSearch, 
    gradient: 'from-pink-500 to-rose-600',
    shadow: 'shadow-pink-500/30'
  },
];

// Legal Services
const LEGAL_SERVICES = [
  { title: 'Family Law', titleUrdu: 'فیملی قانون', icon: Heart, cases: '15K+', href: '/family-court', color: 'from-pink-500 to-rose-500' },
  { title: 'Property Law', titleUrdu: 'جائیداد قانون', icon: HomeIcon, cases: '12K+', href: '/marketplace', color: 'from-emerald-500 to-green-500' },
  { title: 'Corporate Law', titleUrdu: 'کارپوریٹ قانون', icon: Building2, cases: '8K+', href: '/marketplace', color: 'from-blue-500 to-cyan-500' },
  { title: 'Criminal Defense', titleUrdu: 'فوجداری دفاع', icon: Shield, cases: '5K+', href: '/marketplace', color: 'from-red-500 to-orange-500' },
  { title: 'Immigration', titleUrdu: 'امیگریشن', icon: Globe, cases: '10K+', href: '/marketplace', color: 'from-violet-500 to-purple-500' },
  { title: 'Tax Law', titleUrdu: 'ٹیکس قانون', icon: Briefcase, cases: '7K+', href: '/marketplace', color: 'from-amber-500 to-yellow-500' },
];

// AI Features
const AI_FEATURES = [
  { title: 'AI Case Analysis', desc: 'Instant case evaluation with AI', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { title: 'AI Lawyer Matching', desc: 'Find the perfect lawyer automatically', icon: Target, color: 'from-violet-500 to-purple-500' },
  { title: 'AI Document Drafting', desc: 'Generate legal documents in seconds', icon: FileText, color: 'from-emerald-500 to-green-500' },
  { title: 'AI Case Prediction', desc: 'Success probability analysis', icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
];

// Top Lawyers
const TOP_LAWYERS = [
  { name: 'Ahmed Khan', spec: 'Corporate Law', exp: '15 yrs', rating: 4.9, cases: '450+', location: 'Dubai', image: '👨‍⚖️' },
  { name: 'Sarah Ahmed', spec: 'Family Law', exp: '12 yrs', rating: 4.8, cases: '320+', location: 'Lahore', image: '👩‍⚖️' },
  { name: 'Fatima Ali', spec: 'Immigration', exp: '10 yrs', rating: 4.9, cases: '280+', location: 'London', image: '👩‍⚖️' },
  { name: 'Hassan Malik', spec: 'Criminal Law', exp: '18 yrs', rating: 4.7, cases: '550+', location: 'Karachi', image: '👨‍⚖️' },
];

// Testimonials
const TESTIMONIALS = [
  { name: 'Ali Raza', feedback: 'EHB Law helped me win my property case. The AI analysis was incredibly accurate!', rating: 5, case: 'Property Dispute' },
  { name: 'Ayesha Khan', feedback: 'Found the perfect family lawyer within minutes. Amazing platform!', rating: 5, case: 'Divorce Case' },
  { name: 'Omar Sheikh', feedback: 'The AI document generator saved me hours of work. Highly recommended!', rating: 5, case: 'Corporate Contract' },
];

export default function Home() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Premium Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Scale className="text-white" size={20} />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white">EHB Law</span>
                <span className="text-[#D4AF37] ml-1 text-sm font-medium">AI Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/ai-agent" className="px-4 py-2 text-ehb-textMuted hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
                AI Agent
              </Link>
              <Link href="/marketplace" className="px-4 py-2 text-ehb-textMuted hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
                Lawyers
              </Link>
              <Link href="/create-case" className="px-4 py-2 text-ehb-textMuted hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
                Create Case
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-ehb-textMuted hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
                Dashboard
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/landing"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all"
              >
                <Layers size={16} />
                Landing
              </Link>
              <Link
                href="/demo"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium rounded-xl hover:bg-emerald-500/30 transition-all"
              >
                <Rocket size={16} />
                Guided Demo
              </Link>
              <Link
                href="/investor-demo"
                className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
              >
                <Play size={16} />
                <span className="hidden sm:inline">Investor</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-2">
                <Link href="/demo" className="flex items-center gap-3 px-4 py-3 text-white bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                  <Rocket className="text-emerald-400" size={20} />
                  <span className="font-medium">Guided Demo</span>
                  <Sparkles size={16} className="ml-auto text-emerald-400" />
                </Link>
                <Link href="/landing" className="flex items-center gap-3 px-4 py-3 text-white bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
                  <Layers className="text-[#D4AF37]" size={20} />
                  <span className="font-medium">Landing Page</span>
                  <ExternalLink size={16} className="ml-auto text-[#D4AF37]" />
                </Link>
                <Link href="/ai-agent" className="flex items-center gap-3 px-4 py-3 text-ehb-textBody hover:bg-white/5 rounded-xl transition-all">
                  <Bot size={20} />
                  AI Agent System
                </Link>
                <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 text-ehb-textBody hover:bg-white/5 rounded-xl transition-all">
                  <Users size={20} />
                  Find Lawyers
                </Link>
                <Link href="/create-case" className="flex items-center gap-3 px-4 py-3 text-ehb-textBody hover:bg-white/5 rounded-xl transition-all">
                  <FileText size={20} />
                  Create Case
                </Link>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-ehb-textBody hover:bg-white/5 rounded-xl transition-all">
                  <BarChart3 size={20} />
                  Dashboard
                </Link>
                <Link href="/investor-demo" className="flex items-center gap-3 px-4 py-3 text-ehb-textBody hover:bg-white/5 rounded-xl transition-all">
                  <Play size={20} />
                  Investor Demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Hero Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <Link href="/landing" className="group inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all">
              <Sparkles className="text-[#D4AF37]" size={16} />
              <span className="text-[#D4AF37] text-sm font-medium">World's First AI-Powered Legal Platform</span>
              <Crown className="text-[#D4AF37]" size={16} />
              <ArrowRight size={14} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Main Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Legal Services
              <span className="block bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-[#D4AF37] bg-clip-text text-transparent">
                Reimagined with AI
              </span>
            </h1>
            <p className="text-lg text-ehb-textMuted max-w-2xl mx-auto">
              Connect with 25,000+ verified lawyers, get AI-powered legal assistance, 
              and resolve your cases faster than ever.
            </p>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#D4AF37] rounded-2xl blur-sm opacity-50" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Bot className="text-[#D4AF37]" size={24} />
                    <input
                      type="text"
                      placeholder="Ask AI: 'I need help with divorce case' or 'Find property lawyer in Dubai'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none py-4"
                    />
                  </div>
                  <button 
                    onClick={() => setIsVoiceActive(!isVoiceActive)}
                    className={`p-4 rounded-xl transition-all ${isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    <Mic className={isVoiceActive ? 'text-white' : 'text-ehb-textMuted'} size={20} />
                  </button>
                  <button className="px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2">
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Divorce Case', 'Property Dispute', 'Child Custody', 'Corporate Contract'].map((tag) => (
                <button key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-ehb-textMuted hover:bg-white/10 hover:text-white transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Action Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {QUICK_ACTIONS.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className={`group relative overflow-hidden bg-gradient-to-br ${action.gradient} rounded-2xl p-5 hover:shadow-xl ${action.shadow} transition-all hover:scale-[1.02]`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <action.icon className="text-white/90 mb-3" size={28} />
                <h3 className="text-white font-bold text-lg mb-0.5">{action.title}</h3>
                <p className="text-white/60 text-xs mb-1">{action.titleUrdu}</p>
                <p className="text-white/80 text-sm flex items-center gap-1">
                  {action.desc}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <stat.icon className="mx-auto text-[#D4AF37] mb-2" size={24} />
                <p className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-ehb-textMuted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Legal Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Legal Services</h2>
              <p className="text-ehb-textMuted">Expert legal assistance across all practice areas</p>
            </div>
            <Link href="/marketplace" className="text-[#D4AF37] hover:text-yellow-400 flex items-center gap-1 text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEGAL_SERVICES.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={service.href}
                  className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{service.title}</h3>
                  <p className="text-[#D4AF37] text-xs mb-1">{service.titleUrdu}</p>
                  <p className="text-slate-500 text-xs">{service.cases} cases</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              <Zap size={16} />
              Powered by Advanced AI
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              AI-Powered Legal Intelligence
            </h2>
            <p className="text-ehb-textMuted max-w-2xl mx-auto">
              Our 14 specialized AI agents work together to provide comprehensive legal assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-ehb-textMuted text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/ai-agent"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <Bot size={22} />
              Explore AI Agent System
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Lawyers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Top Lawyers</h2>
              <p className="text-ehb-textMuted">Verified and highly rated legal professionals</p>
            </div>
            <Link href="/marketplace" className="text-[#D4AF37] hover:text-yellow-400 flex items-center gap-1 text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_LAWYERS.map((lawyer, index) => (
              <motion.div
                key={lawyer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                    {lawyer.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{lawyer.name}</h3>
                      <CheckCircle2 className="text-blue-400" size={14} />
                    </div>
                    <p className="text-[#D4AF37] text-sm">{lawyer.spec}</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <MapPin size={10} /> {lawyer.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="text-sm font-bold text-white">{lawyer.exp}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Cases</p>
                    <p className="text-sm font-bold text-emerald-400">{lawyer.cases}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="text-sm font-bold text-yellow-400">⭐ {lawyer.rating}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/lawyer/lawyer-${index + 1}`} className="flex-1 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all text-center">
                    View Profile
                  </Link>
                  <Link href={`/lawyer/lawyer-${index + 1}?hire=true`} className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all text-center">
                    Hire Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-blue-500/10 rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">How EHB Law Works</h2>
              <p className="text-ehb-textMuted">Simple 4-step process to resolve your legal matters</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: 1, title: 'Describe Your Case', desc: 'Tell AI about your legal problem', icon: MessageSquare },
                { step: 2, title: 'AI Analysis', desc: 'AI analyzes and recommends solutions', icon: Brain },
                { step: 3, title: 'Match with Lawyer', desc: 'Get matched with the perfect lawyer', icon: Users },
                { step: 4, title: 'Case Resolved', desc: 'Track progress until resolution', icon: CheckCircle2 },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
                    <item.icon className="text-white" size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-ehb-textMuted text-sm">{item.desc}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Client Success Stories</h2>
            <p className="text-ehb-textMuted">What our clients say about EHB Law</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                  ))}
                </div>
                <p className="text-ehb-textBody italic mb-6">"{testimonial.feedback}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-slate-500 text-xs">{testimonial.case}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-emerald-400" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-blue-500/20 rounded-3xl p-12 border border-[#D4AF37]/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            
            <div className="relative">
              <Rocket className="mx-auto text-[#D4AF37] mb-6" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Legal Case Today
              </h2>
              <p className="text-ehb-textBody mb-8 max-w-2xl mx-auto">
                Don't wait for legal problems to grow. Get AI-powered assistance and 
                connect with top lawyers in minutes.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/create-case"
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-3 text-lg"
                >
                  <FileText size={22} />
                  Start Case Now
                  <ArrowRight size={22} />
                </Link>
                
                <Link
                  href="/ai-agent"
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3 text-lg"
                >
                  <Bot size={22} />
                  Ask AI First
                </Link>
              </div>

              {/* Landing Page CTA */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-ehb-textMuted text-sm mb-4">Want to learn more about our platform?</p>
                <Link
                  href="/landing"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all"
                >
                  <Layers size={18} />
                  View Landing Page
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Mobile App Banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white font-bold">EHB Law App</p>
              <p className="text-ehb-textMuted text-xs">Legal help in your pocket</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
              iOS
            </button>
            <button className="px-4 py-2 bg-[#D4AF37] text-slate-900 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all">
              Android
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
