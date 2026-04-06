'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Network, Scale, BookOpen, FileText, Users,
  Shield, Monitor, Globe, Zap, ChevronRight, Sparkles,
  Play, Settings, ArrowLeft
} from 'lucide-react';

import AIOrchestrator from './AIOrchestrator';
import CaseManagementAgent from './CaseManagementAgent';
import LegalResearchAgent from './LegalResearchAgent';
import DocumentAgent from './DocumentAgent';
import GlobalLawyerHiring from './GlobalLawyerHiring';
import SecurityGovernance from './SecurityGovernance';
import AIControlDashboard from './AIControlDashboard';

type FeatureId = 'dashboard' | 'orchestrator' | 'case' | 'research' | 'document' | 'hiring' | 'security';

interface Feature {
  id: FeatureId;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: React.ElementType;
  gradient: string;
  component: React.ComponentType<{ language?: 'en' | 'ur' }>;
}

const FEATURES: Feature[] = [
  {
    id: 'dashboard',
    name: 'AI Control Dashboard',
    nameUrdu: 'AI کنٹرول ڈیش بورڈ',
    description: 'Central command center for monitoring all AI systems',
    descriptionUrdu: 'تمام AI نظاموں کی نگرانی کا مرکزی کنٹرول',
    icon: Monitor,
    gradient: 'from-violet-500 via-purple-500 to-brand-gold',
    component: AIControlDashboard
  },
  {
    id: 'orchestrator',
    name: 'AI Orchestrator',
    nameUrdu: 'AI آرکیسٹریٹر',
    description: 'Central AI brain coordinating all agents',
    descriptionUrdu: 'مرکزی AI دماغ جو تمام ایجنٹس کو منظم کرتا ہے',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-500',
    component: AIOrchestrator
  },
  {
    id: 'case',
    name: 'Case Management Agent',
    nameUrdu: 'کیس مینجمنٹ ایجنٹ',
    description: 'Manages complete legal case lifecycle',
    descriptionUrdu: 'قانونی کیس کا مکمل انتظام',
    icon: Scale,
    gradient: 'from-blue-500 to-cyan-500',
    component: CaseManagementAgent
  },
  {
    id: 'research',
    name: 'Legal Research Agent',
    nameUrdu: 'قانونی تحقیق ایجنٹ',
    description: 'AI-powered intelligent legal research',
    descriptionUrdu: 'AI سے ذہین قانونی تحقیق',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-teal-500',
    component: LegalResearchAgent
  },
  {
    id: 'document',
    name: 'Document Agent',
    nameUrdu: 'دستاویز ایجنٹ',
    description: 'Automatic legal document generation',
    descriptionUrdu: 'خودکار قانونی دستاویزات',
    icon: FileText,
    gradient: 'from-orange-500 to-amber-500',
    component: DocumentAgent
  },
  {
    id: 'hiring',
    name: 'Global Lawyer Marketplace',
    nameUrdu: 'عالمی وکیل مارکیٹ پلیس',
    description: 'Hire lawyers: Case/Hourly/Monthly/Annual',
    descriptionUrdu: 'وکیل کی خدمات: کیس/گھنٹہ/ماہانہ/سالانہ',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-500',
    component: GlobalLawyerHiring
  },
  {
    id: 'security',
    name: 'Security & Governance',
    nameUrdu: 'سیکیورٹی اور گورننس',
    description: 'AI security and compliance monitoring',
    descriptionUrdu: 'AI سیکیورٹی اور تعمیل کی نگرانی',
    icon: Shield,
    gradient: 'from-red-500 to-rose-500',
    component: SecurityGovernance
  }
];

interface MultiAgentSystemProps {
  initialLanguage?: 'en' | 'ur';
}

export default function MultiAgentSystem({ initialLanguage = 'en' }: MultiAgentSystemProps) {
  const [language, setLanguage] = useState<'en' | 'ur'>(initialLanguage);
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null);

  const ActiveComponent = activeFeature 
    ? FEATURES.find(f => f.id === activeFeature)?.component 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            {activeFeature && (
              <button
                onClick={() => setActiveFeature(null)}
                className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-white font-bold text-2xl md:text-3xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-brand-primary to-brand-gold flex items-center justify-center">
                  <Network className="text-white" size={24} />
                </div>
                {language === 'ur' ? 'EHB AI ملٹی-ایجنٹ سسٹم' : 'EHB AI Multi-Agent System'}
              </h1>
              <p className="text-slate-400 mt-1">
                {language === 'ur' 
                  ? 'عالمی قانونی AI ماحولیاتی نظام'
                  : 'Global Legal AI Ecosystem with 14+ Specialized Agents'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20"
            >
              <Globe size={18} />
              {language === 'ur' ? 'English' : 'اردو'}
            </button>
            <button className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20">
              <Settings size={20} />
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!activeFeature ? (
            <motion.div
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-violet-900/50 via-slate-800 to-slate-900 rounded-3xl p-8 mb-8 border border-violet-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4QjVDRjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-brand-gold" size={24} />
                    <span className="text-brand-gold font-medium">
                      {language === 'ur' ? 'AI سے چلنے والا' : 'AI-Powered'}
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-3xl md:text-4xl mb-4">
                    {language === 'ur' 
                      ? 'EHB عالمی قانونی AI پلیٹ فارم'
                      : 'EHB Global Legal AI Platform'}
                  </h2>
                  <p className="text-slate-300 text-lg mb-6 max-w-2xl">
                    {language === 'ur'
                      ? 'دنیا کا سب سے جدید AI قانونی ماحولیاتی نظام جس میں 14+ خصوصی AI ایجنٹس ہیں جو مل کر کام کرتے ہیں'
                      : 'The world\'s most advanced AI legal ecosystem with 14+ specialized AI agents working together to automate your legal workflows'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setActiveFeature('dashboard')}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-xl font-bold"
                    >
                      <Play size={20} />
                      {language === 'ur' ? 'کنٹرول پینل کھولیں' : 'Open Control Panel'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20">
                      <Zap size={20} />
                      {language === 'ur' ? 'کیسے کام کرتا ہے' : 'How It Works'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => setActiveFeature(feature.id)}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 cursor-pointer group hover:border-brand-gold/50 transition-all"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">
                        {language === 'ur' ? feature.nameUrdu : feature.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        {language === 'ur' ? feature.descriptionUrdu : feature.description}
                      </p>
                      <div className="flex items-center text-brand-gold text-sm font-medium group-hover:gap-2 transition-all">
                        {language === 'ur' ? 'کھولیں' : 'Open'}
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: '14+', label: language === 'ur' ? 'AI ایجنٹس' : 'AI Agents' },
                  { value: '12+', label: language === 'ur' ? 'ممالک' : 'Countries' },
                  { value: '99.99%', label: language === 'ur' ? 'اپ ٹائم' : 'Uptime' },
                  { value: '24/7', label: language === 'ur' ? 'سپورٹ' : 'Support' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 text-center border border-white/5"
                  >
                    <p className="text-brand-gold font-bold text-3xl mb-1">{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {ActiveComponent && <ActiveComponent language={language} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export {
  AIOrchestrator,
  CaseManagementAgent,
  LegalResearchAgent,
  DocumentAgent,
  GlobalLawyerHiring,
  SecurityGovernance,
  AIControlDashboard
};
