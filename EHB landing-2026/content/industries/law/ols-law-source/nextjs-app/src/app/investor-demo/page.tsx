'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Presentation, Globe, Bot, Scale, TrendingUp,
  ChevronRight, ArrowRight, Sparkles, Target, Users,
  Building2, CreditCard, Shield, Zap, Crown, Calendar
} from 'lucide-react';
import EcosystemMap from '@/components/InvestorDemo/EcosystemMap';
import CompetitorMatrix from '@/components/InvestorDemo/CompetitorMatrix';
import InvestorPitch from '@/components/InvestorDemo/InvestorPitch';
import ProductRoadmap from '@/components/InvestorDemo/ProductRoadmap';

const DEMO_SECTIONS = [
  { id: 'overview', name: 'Platform Overview', icon: Presentation },
  { id: 'ecosystem', name: 'Ecosystem Map', icon: Globe },
  { id: 'competitor', name: 'Competitive Analysis', icon: Shield },
  { id: 'pitch', name: 'Market & Revenue', icon: Target },
  { id: 'roadmap', name: 'Product Roadmap', icon: Calendar },
  { id: 'demo', name: 'Live Demo Flow', icon: Play },
  { id: 'business', name: 'Business Model', icon: TrendingUp },
];

const INVESTMENT_HIGHLIGHTS = [
  { icon: Globe, label: '$900B', desc: 'Global Legal Market' },
  { icon: Users, label: '25K+', desc: 'Lawyers Network' },
  { icon: Bot, label: '14', desc: 'AI Agents' },
  { icon: Building2, label: '50+', desc: 'Target Countries' },
];

const REVENUE_STREAMS = [
  { name: 'Legal Service Fees', percentage: 40, color: 'bg-blue-500' },
  { name: 'Lawyer Subscriptions', percentage: 25, color: 'bg-violet-500' },
  { name: 'Franchise Fees', percentage: 20, color: 'bg-emerald-500' },
  { name: 'AI Tools Premium', percentage: 10, color: 'bg-orange-500' },
  { name: 'Platform Coin', percentage: 5, color: 'bg-pink-500' },
];

const DEMO_FLOW_STEPS = [
  { step: 1, title: 'AI Welcome', route: '/', duration: '60s', desc: 'Homepage with AI assistant' },
  { step: 2, title: 'Voice Command', route: '/', duration: '90s', desc: 'Say "I want to file divorce case"' },
  { step: 3, title: 'Services', route: '/marketplace', duration: '60s', desc: 'Legal services marketplace' },
  { step: 4, title: 'AI Agent', route: '/ai-agent', duration: '120s', desc: 'AI case creation flow' },
  { step: 5, title: 'Lawyer Match', route: '/ai-agent', duration: '90s', desc: 'AI recommends lawyers' },
  { step: 6, title: 'Payment', route: '/payments', duration: '60s', desc: 'Payment & escrow system' },
  { step: 7, title: 'Dashboard', route: '/dashboard', duration: '60s', desc: 'Client case dashboard' },
  { step: 8, title: 'Global Vision', route: '/franchise', duration: '60s', desc: 'Franchise & expansion' },
];

export default function InvestorDemoPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  const startLiveDemo = () => {
    setIsPlaying(true);
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-gold/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/20 rounded-full text-brand-gold text-sm font-medium mb-6">
              <Sparkles size={16} />
              Investor Presentation Mode
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              EHB AI Legal Platform
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              The World's First AI-Powered Global Legal Ecosystem
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {INVESTMENT_HIGHLIGHTS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
                >
                  <stat.icon className="mx-auto text-brand-gold mb-2" size={24} />
                  <p className="text-2xl font-bold text-white">{stat.label}</p>
                  <p className="text-xs text-slate-400">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-1 py-2">
            {DEMO_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-brand-gold text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <section.icon size={18} />
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Problem & Solution */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-500/10 rounded-2xl p-8 border border-red-500/30">
                  <h3 className="text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                    <Target size={20} />
                    The Problem
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-red-400 mt-1 shrink-0" size={16} />
                      Legal services are expensive and inaccessible
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-red-400 mt-1 shrink-0" size={16} />
                      Finding the right lawyer is confusing
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-red-400 mt-1 shrink-0" size={16} />
                      Legal processes take weeks or months
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-red-400 mt-1 shrink-0" size={16} />
                      Cross-border legal help is nearly impossible
                    </li>
                  </ul>
                </div>

                <div className="bg-green-500/10 rounded-2xl p-8 border border-green-500/30">
                  <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    Our Solution
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-green-400 mt-1 shrink-0" size={16} />
                      AI-powered legal assistance in any language
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-green-400 mt-1 shrink-0" size={16} />
                      Intelligent lawyer matching algorithm
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-green-400 mt-1 shrink-0" size={16} />
                      Case filing in 5 minutes, not weeks
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="text-green-400 mt-1 shrink-0" size={16} />
                      Global platform, local expertise
                    </li>
                  </ul>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-8 border border-brand-gold/30 text-center">
                <Crown className="mx-auto text-brand-gold mb-4" size={40} />
                <h3 className="text-2xl font-bold text-white mb-2">
                  "Uber for Legal Services"
                </h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  EHB combines the marketplace model of Uber, the professional network of Upwork, 
                  and the AI power of ChatGPT — specifically designed for the $900B legal industry.
                </p>
              </div>
            </motion.div>
          )}

          {/* Ecosystem Section */}
          {activeSection === 'ecosystem' && (
            <motion.div
              key="ecosystem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EcosystemMap language="en" />
            </motion.div>
          )}

          {/* Competitor Section */}
          {activeSection === 'competitor' && (
            <motion.div
              key="competitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CompetitorMatrix language="en" />
            </motion.div>
          )}

          {/* Pitch Section - Market, Revenue, Growth */}
          {activeSection === 'pitch' && (
            <motion.div
              key="pitch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InvestorPitch language="en" />
            </motion.div>
          )}

          {/* Roadmap Section */}
          {activeSection === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProductRoadmap language="en" />
            </motion.div>
          )}

          {/* Demo Flow Section */}
          {activeSection === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Live Demo Flow</h2>
                <p className="text-slate-400">7-minute guided demonstration</p>
              </div>

              {/* Start Demo Button */}
              <div className="text-center mb-8 space-y-4">
                <a
                  href="/demo"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  <Play size={24} />
                  Start Guided Demo (2 Minutes)
                </a>
                <p className="text-slate-500 text-sm">or</p>
                <button
                  onClick={startLiveDemo}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                >
                  Open Full Platform
                </button>
              </div>

              {/* Demo Steps */}
              <div className="grid md:grid-cols-2 gap-4">
                {DEMO_FLOW_STEPS.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <span className="text-xs text-slate-500">{item.duration}</span>
                      </div>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                    <a
                      href={item.route}
                      target="_blank"
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ArrowRight className="text-slate-400" size={18} />
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Business Model Section */}
          {activeSection === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Business Model</h2>
                <p className="text-slate-400">Multiple revenue streams for sustainable growth</p>
              </div>

              {/* Revenue Streams */}
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <CreditCard className="text-brand-gold" />
                  Revenue Streams
                </h3>
                <div className="space-y-4">
                  {REVENUE_STREAMS.map((stream, index) => (
                    <div key={stream.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{stream.name}</span>
                        <span className="text-slate-400">{stream.percentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stream.percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className={`h-full ${stream.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Opportunity */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                  <p className="text-4xl font-bold text-brand-gold mb-2">$900B</p>
                  <p className="text-slate-400 text-sm">Global Legal Market</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                  <p className="text-4xl font-bold text-brand-gold mb-2">1%</p>
                  <p className="text-slate-400 text-sm">Target Market Share (5 years)</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
                  <p className="text-4xl font-bold text-brand-gold mb-2">$9B</p>
                  <p className="text-slate-400 text-sm">Revenue Potential</p>
                </div>
              </div>

              {/* Use of Funds */}
              <div className="bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-8 border border-brand-gold/30">
                <h3 className="text-white font-bold text-lg mb-6">Use of Investment</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Product Development', percentage: 40 },
                    { label: 'Market Expansion', percentage: 30 },
                    { label: 'Team Growth', percentage: 20 },
                    { label: 'Operations', percentage: 10 },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-3xl font-bold text-brand-gold mb-1">{item.percentage}%</p>
                      <p className="text-sm text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-gold py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Legal Services?
          </h2>
          <p className="text-white/80 mb-8">
            Join us in building the world's largest AI-powered legal ecosystem
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Schedule Meeting
            </button>
            <button className="px-8 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors">
              Download Pitch Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
