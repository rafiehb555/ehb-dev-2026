'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Bot, Sparkles, Brain, Scale, TrendingUp, AlertTriangle, CheckCircle2,
  FileText, Users, Clock, DollarSign, ArrowRight, Zap, Shield,
  BarChart3, PieChart, Target, Lightbulb, Gavel, Crown
} from 'lucide-react';

// Analysis Results (Demo)
const ANALYSIS_RESULTS = {
  caseType: 'Family Law - Divorce',
  confidence: 94,
  complexity: 'Medium',
  estimatedDuration: '3-6 months',
  estimatedCost: '$2,500 - $5,000',
  successProbability: 78,
  riskFactors: [
    { factor: 'Asset Division', level: 'Medium', score: 65 },
    { factor: 'Child Custody', level: 'High', score: 45 },
    { factor: 'Documentation', level: 'Low', score: 85 },
  ],
  keyInsights: [
    'Strong documentation will significantly improve case outcome',
    'Consider mediation as first step to reduce costs',
    'Child custody arrangement needs careful planning',
    'Property valuation may require expert assessment',
  ],
  recommendedActions: [
    { action: 'Gather Financial Documents', priority: 'High', icon: FileText },
    { action: 'Consult Family Lawyer', priority: 'High', icon: Users },
    { action: 'Document Asset List', priority: 'Medium', icon: Scale },
    { action: 'Consider Mediation', priority: 'Medium', icon: Lightbulb },
  ],
  matchedLawyers: [
    { name: 'Sarah Ahmed', spec: 'Family Law', rating: 4.9, match: 96, image: '👩‍⚖️' },
    { name: 'Ahmed Khan', spec: 'Divorce Specialist', rating: 4.8, match: 92, image: '👨‍⚖️' },
    { name: 'Fatima Noor', spec: 'Child Custody', rating: 4.7, match: 88, image: '👩‍⚖️' },
  ],
  similarCases: [
    { title: 'Mutual Consent Divorce', outcome: 'Settled', duration: '4 months', similarity: 85 },
    { title: 'Contested Divorce with Assets', outcome: 'Won', duration: '8 months', similarity: 72 },
  ],
};

// Animated Counter
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count}{suffix}</span>;
};

export default function AIAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalyzing(false);
            setShowResults(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 60);
      
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const analysisSteps = [
    { label: 'Analyzing Case Type', complete: analysisProgress > 15 },
    { label: 'Evaluating Complexity', complete: analysisProgress > 30 },
    { label: 'Calculating Risk Factors', complete: analysisProgress > 50 },
    { label: 'Matching Lawyers', complete: analysisProgress > 70 },
    { label: 'Generating Recommendations', complete: analysisProgress > 85 },
    { label: 'Finalizing Report', complete: analysisProgress >= 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-medium mb-6">
              <Brain size={16} />
              AI-Powered Analysis
              <Sparkles size={16} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Intelligent Case
              <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Analyzer
              </span>
            </h1>
            <p className="text-lg text-ehb-textMuted max-w-2xl mx-auto">
              Our AI analyzes your case details to provide insights, risk assessment, and lawyer recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Analysis Progress */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
              {/* AI Animation */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                  <Brain className="text-violet-400 animate-pulse" size={48} />
                </div>
                <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Case</h2>
              <p className="text-ehb-textMuted mb-8">Please wait while our AI processes your information</p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ehb-textMuted">Progress</span>
                  <span className="text-violet-400 font-bold">{analysisProgress}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {analysisSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      step.complete ? 'bg-emerald-500/10' : 'bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.complete ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      {step.complete ? (
                        <CheckCircle2 className="text-white" size={14} />
                      ) : (
                        <div className="w-2 h-2 bg-slate-500 rounded-full" />
                      )}
                    </div>
                    <span className={step.complete ? 'text-emerald-400' : 'text-ehb-textMuted'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Case Type', value: ANALYSIS_RESULTS.caseType, icon: Scale, color: 'from-blue-500 to-cyan-500' },
                { label: 'AI Confidence', value: `${ANALYSIS_RESULTS.confidence}%`, icon: Brain, color: 'from-violet-500 to-purple-500' },
                { label: 'Success Rate', value: `${ANALYSIS_RESULTS.successProbability}%`, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
                { label: 'Est. Duration', value: ANALYSIS_RESULTS.estimatedDuration, icon: Clock, color: 'from-orange-500 to-amber-500' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                    <card.icon className="text-white" size={24} />
                  </div>
                  <p className="text-sm text-ehb-textMuted mb-1">{card.label}</p>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Analysis Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Risk Assessment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-violet-400" size={20} />
                    Risk Assessment
                  </h3>
                  
                  <div className="space-y-4">
                    {ANALYSIS_RESULTS.riskFactors.map((risk, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{risk.factor}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            risk.level === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                            risk.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {risk.level} Risk
                          </span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.score}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                            className={`h-full rounded-full ${
                              risk.score > 70 ? 'bg-emerald-500' :
                              risk.score > 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Key Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" size={20} />
                    AI Insights
                  </h3>
                  
                  <div className="space-y-3">
                    {ANALYSIS_RESULTS.keyInsights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                        <Sparkles className="text-[#D4AF37] shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-ehb-textBody">{insight}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommended Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="text-blue-400" size={20} />
                    Recommended Actions
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {ANALYSIS_RESULTS.recommendedActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <action.icon className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{action.action}</p>
                          <p className={`text-xs ${
                            action.priority === 'High' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {action.priority} Priority
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Success Probability */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center"
                >
                  <h3 className="text-sm font-bold text-emerald-400 mb-4">Success Probability</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={351.86}
                        initial={{ strokeDashoffset: 351.86 }}
                        animate={{ strokeDashoffset: 351.86 * (1 - ANALYSIS_RESULTS.successProbability / 100) }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#22B14C" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        <AnimatedNumber value={ANALYSIS_RESULTS.successProbability} suffix="%" />
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-ehb-textMuted">Based on similar cases analysis</p>
                </motion.div>

                {/* Matched Lawyers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="text-[#D4AF37]" size={20} />
                    Top Matched Lawyers
                  </h3>
                  
                  <div className="space-y-3">
                    {ANALYSIS_RESULTS.matchedLawyers.map((lawyer, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-2xl">
                          {lawyer.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{lawyer.name}</p>
                          <p className="text-xs text-ehb-textMuted">{lawyer.spec}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-400">{lawyer.match}%</p>
                          <p className="text-xs text-yellow-400">⭐ {lawyer.rating}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/global-marketplace"
                    className="w-full mt-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                  >
                    View All Lawyers <ArrowRight size={18} />
                  </Link>
                </motion.div>

                {/* Cost Estimate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-emerald-400" size={20} />
                    Cost Estimate
                  </h3>
                  <p className="text-3xl font-bold text-white mb-2">{ANALYSIS_RESULTS.estimatedCost}</p>
                  <p className="text-sm text-ehb-textMuted mb-4">Based on market rates and case complexity</p>
                  
                  <Link
                    href="/create-case"
                    className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    Start Your Case <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
