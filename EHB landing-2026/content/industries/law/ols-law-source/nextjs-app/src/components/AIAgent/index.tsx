'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, FileText, Brain, BarChart2, MessageSquare, CheckCircle2, Scale, ArrowLeft,
  Users, Building2, Globe, CircuitBoard
} from 'lucide-react';
import { AgentProvider, useAgent } from './AgentContext';
import AIAgentPanel from './AIAgentPanel';
import CaseMonitoring from './CaseMonitoring';
import LegalStrategyAdvisor from './LegalStrategyAdvisor';
import DocumentDrafter from './DocumentDrafter';
import CasePrediction from './CasePrediction';
import SmartCommunication from './SmartCommunication';
import CaseCompletion from './CaseCompletion';
import LawyerPerformance from './LawyerPerformance';
import FranchiseIntelligence from './FranchiseIntelligence';
import GlobalLegalIntelligence from './GlobalLegalIntelligence';
import AutonomousLegalSystem from './AutonomousLegalSystem';

type ActiveView = 'agent' | 'monitoring' | 'strategy' | 'documents' | 'prediction' | 'communication' | 'completion' | 'lawyers' | 'franchise' | 'global' | 'autonomous';

interface FeatureCard {
  id: ActiveView;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: React.ElementType;
  color: string;
  category: 'agent' | 'super';
}

const FEATURES: FeatureCard[] = [
  {
    id: 'agent',
    title: 'AI Legal Agent',
    titleUrdu: 'AI قانونی ایجنٹ',
    description: 'File cases automatically with AI assistance',
    descriptionUrdu: 'AI کی مدد سے خود بخود کیس فائل کریں',
    icon: Bot,
    color: 'from-brand-primary to-brand-gold',
    category: 'agent'
  },
  {
    id: 'monitoring',
    title: 'Case Monitoring',
    titleUrdu: 'کیس کی نگرانی',
    description: 'Track your case progress in real-time',
    descriptionUrdu: 'اپنے کیس کی پیش رفت دیکھیں',
    icon: Scale,
    color: 'from-blue-500 to-cyan-500',
    category: 'agent'
  },
  {
    id: 'communication',
    title: 'Smart Communication',
    titleUrdu: 'ذہین رابطہ',
    description: 'Chat with your lawyer and get updates',
    descriptionUrdu: 'اپنے وکیل سے بات کریں',
    icon: MessageSquare,
    color: 'from-indigo-500 to-blue-500',
    category: 'agent'
  },
  {
    id: 'strategy',
    title: 'Legal Strategy',
    titleUrdu: 'قانونی حکمت عملی',
    description: 'AI-powered legal strategy suggestions',
    descriptionUrdu: 'AI سے قانونی حکمت عملی کی تجاویز',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    category: 'super'
  },
  {
    id: 'documents',
    title: 'Document Drafter',
    titleUrdu: 'دستاویز ڈرافٹر',
    description: 'Generate legal documents automatically',
    descriptionUrdu: 'قانونی دستاویزات خود بخود بنائیں',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    category: 'super'
  },
  {
    id: 'prediction',
    title: 'Case Prediction',
    titleUrdu: 'کیس کی پیشن گوئی',
    description: 'Predict your case success probability',
    descriptionUrdu: 'اپنے کیس کی کامیابی کا اندازہ لگائیں',
    icon: BarChart2,
    color: 'from-orange-500 to-yellow-500',
    category: 'super'
  },
  {
    id: 'lawyers',
    title: 'Lawyer Intelligence',
    titleUrdu: 'وکیل انٹیلیجنس',
    description: 'Analyze lawyer performance and rankings',
    descriptionUrdu: 'وکلاء کی کارکردگی کا تجزیہ',
    icon: Users,
    color: 'from-teal-500 to-cyan-500',
    category: 'super'
  },
  {
    id: 'franchise',
    title: 'Franchise Intelligence',
    titleUrdu: 'فرنچائز انٹیلیجنس',
    description: 'Franchise analytics and expansion',
    descriptionUrdu: 'فرنچائز تجزیات اور توسیع',
    icon: Building2,
    color: 'from-emerald-500 to-green-500',
    category: 'super'
  },
  {
    id: 'global',
    title: 'Global Legal',
    titleUrdu: 'عالمی قانون',
    description: 'International legal procedures',
    descriptionUrdu: 'بین الاقوامی قانونی طریقہ کار',
    icon: Globe,
    color: 'from-sky-500 to-blue-500',
    category: 'super'
  },
  {
    id: 'autonomous',
    title: 'Autonomous System',
    titleUrdu: 'خود مختار نظام',
    description: 'Full AI automation control center',
    descriptionUrdu: 'مکمل AI آٹومیشن کنٹرول سینٹر',
    icon: CircuitBoard,
    color: 'from-violet-500 to-purple-500',
    category: 'super'
  }
];

function AIAgentSystemContent({ language }: { language: 'en' | 'ur' }) {
  const [activeView, setActiveView] = useState<ActiveView | null>(null);
  const [activeTab, setActiveTab] = useState<'agent' | 'super'>('agent');

  const renderActiveView = () => {
    switch (activeView) {
      case 'agent':
        return <AIAgentPanel />;
      case 'monitoring':
        return (
          <CaseMonitoring
            caseId="EHB-123456"
            caseType="Property Dispute"
            lawyerName="Adv. Ahmed Khan"
            language={language}
          />
        );
      case 'strategy':
        return (
          <LegalStrategyAdvisor
            caseType="property_dispute"
            language={language}
          />
        );
      case 'documents':
        return <DocumentDrafter language={language} />;
      case 'prediction':
        return (
          <CasePrediction
            caseType="property_dispute"
            language={language}
          />
        );
      case 'communication':
        return (
          <SmartCommunication
            caseId="EHB-123456"
            lawyerName="Adv. Ahmed Khan"
            language={language}
          />
        );
      case 'completion':
        return (
          <CaseCompletion
            caseId="EHB-123456"
            caseType="Property Dispute"
            lawyerName="Adv. Ahmed Khan"
            lawyerId="lawyer-1"
            totalAmount={850}
            language={language}
            onComplete={() => setActiveView(null)}
          />
        );
      case 'lawyers':
        return <LawyerPerformance language={language} />;
      case 'franchise':
        return <FranchiseIntelligence language={language} />;
      case 'global':
        return <GlobalLegalIntelligence language={language} />;
      case 'autonomous':
        return <AutonomousLegalSystem language={language} />;
      default:
        return null;
    }
  };

  const agentFeatures = FEATURES.filter(f => f.category === 'agent');
  const superFeatures = FEATURES.filter(f => f.category === 'super');

  if (activeView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveView(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {language === 'ur' ? 'واپس' : 'Back to Dashboard'}
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center">
            <Bot className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === 'ur' ? 'AI قانونی ایجنٹ سسٹم' : 'AI Legal Agent System'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {language === 'ur'
              ? 'آپ کا ذاتی قانونی معاون جو آپ کے لیے کام کرتا ہے۔ کیس فائل کرنے سے لے کر مکمل ہونے تک، AI سب سنبھالتا ہے۔'
              : 'Your personal legal assistant that works for you. From filing a case to completion, AI handles everything.'}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('agent')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'agent' 
                ? 'bg-gradient-to-r from-brand-primary to-brand-gold text-white' 
                : 'bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Bot size={20} />
            {language === 'ur' ? 'AI ایجنٹ' : 'AI Agent'}
          </button>
          <button
            onClick={() => setActiveTab('super')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'super' 
                ? 'bg-gradient-to-r from-purple-500 to-brand-gold text-white' 
                : 'bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Brain size={20} />
            {language === 'ur' ? 'AI سپر ایجنٹ' : 'AI Super Agent'}
          </button>
        </motion.div>

        {/* Feature Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {(activeTab === 'agent' ? agentFeatures : superFeatures).map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setActiveView(feature.id)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-brand-gold/30 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {language === 'ur' ? feature.titleUrdu : feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {language === 'ur' ? feature.descriptionUrdu : feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl p-8 border ${
            activeTab === 'agent' 
              ? 'bg-gradient-to-r from-brand-primary/20 to-brand-gold/20 border-brand-gold/20'
              : 'bg-gradient-to-r from-purple-500/20 to-brand-gold/20 border-purple-500/20'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">
                {activeTab === 'agent' 
                  ? (language === 'ur' ? 'ابھی شروع کریں' : 'Start Now')
                  : (language === 'ur' ? 'AI سپر پاور استعمال کریں' : 'Use AI Super Powers')}
              </h3>
              <p className="text-slate-400">
                {activeTab === 'agent'
                  ? (language === 'ur'
                      ? 'AI کو بتائیں آپ کو کیا قانونی مدد چاہیے اور AI سب کچھ خود کرے گا'
                      : 'Tell the AI what legal help you need and it will handle everything')
                  : (language === 'ur'
                      ? 'ایڈوانسڈ AI ٹولز سے قانونی عمل کو تیز کریں'
                      : 'Accelerate legal processes with advanced AI tools')}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(activeTab === 'agent' ? 'agent' : 'autonomous')}
              className={`px-8 py-4 text-white font-bold rounded-xl flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'agent'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-gold'
                  : 'bg-gradient-to-r from-purple-500 to-brand-gold'
              }`}
            >
              {activeTab === 'agent' ? <Bot size={24} /> : <CircuitBoard size={24} />}
              {activeTab === 'agent'
                ? (language === 'ur' ? 'AI ایجنٹ سے بات کریں' : 'Talk to AI Agent')
                : (language === 'ur' ? 'کنٹرول سینٹر کھولیں' : 'Open Control Center')}
            </motion.button>
          </div>
        </motion.div>

        {/* Case Completion Demo */}
        {activeTab === 'agent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400" size={24} />
                <div>
                  <h4 className="text-white font-bold">
                    {language === 'ur' ? 'فعال کیس' : 'Active Case Demo'}
                  </h4>
                  <p className="text-slate-400 text-sm">EHB-123456 - Property Dispute</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('completion')}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all"
              >
                {language === 'ur' ? 'کیس مکمل کریں' : 'Complete Case'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AIAgentSystem() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  return (
    <AgentProvider>
      <div className="relative">
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all"
          >
            {language === 'en' ? 'اردو' : 'English'}
          </button>
        </div>
        <AIAgentSystemContent language={language} />
      </div>
    </AgentProvider>
  );
}

export {
  AgentProvider,
  useAgent,
  AIAgentPanel,
  CaseMonitoring,
  LegalStrategyAdvisor,
  DocumentDrafter,
  CasePrediction,
  SmartCommunication,
  CaseCompletion,
  LawyerPerformance,
  FranchiseIntelligence,
  GlobalLegalIntelligence,
  AutonomousLegalSystem
};
