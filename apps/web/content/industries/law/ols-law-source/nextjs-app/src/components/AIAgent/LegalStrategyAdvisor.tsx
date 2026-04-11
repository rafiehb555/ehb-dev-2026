'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Lightbulb, Target, TrendingUp, Clock,
  AlertTriangle, CheckCircle2, Scale, ChevronRight,
  ArrowRight, Loader2, Sparkles
} from 'lucide-react';

interface LegalStrategy {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  steps: Array<{ step: string; stepUrdu: string }>;
  timeline: string;
  timelineUrdu: string;
  successRate: number;
  risks: string[];
  risksUrdu: string[];
  recommended: boolean;
}

interface StrategyAnalysis {
  caseStrength: number;
  recommendations: string[];
  recommendationsUrdu: string[];
  keyFactors: Array<{ factor: string; factorUrdu: string; impact: 'positive' | 'negative' | 'neutral' }>;
}

interface LegalStrategyAdvisorProps {
  caseType: string;
  caseDetails?: Record<string, string>;
  language?: 'en' | 'ur';
}

const MOCK_STRATEGIES: Record<string, LegalStrategy[]> = {
  property_dispute: [
    {
      id: '1',
      title: 'Send Legal Notice',
      titleUrdu: 'قانونی نوٹس بھیجیں',
      description: 'Start with a formal legal notice to the other party demanding resolution.',
      descriptionUrdu: 'دوسری پارٹی کو حل کے لیے رسمی قانونی نوٹس سے شروع کریں۔',
      steps: [
        { step: 'Draft legal notice', stepUrdu: 'قانونی نوٹس کا مسودہ تیار کریں' },
        { step: 'Send via registered post', stepUrdu: 'رجسٹرڈ ڈاک سے بھیجیں' },
        { step: 'Wait for response (15-30 days)', stepUrdu: 'جواب کا انتظار کریں (15-30 دن)' }
      ],
      timeline: '1-2 months',
      timelineUrdu: '1-2 ماہ',
      successRate: 35,
      risks: ['May not receive response', 'Other party may escalate'],
      risksUrdu: ['جواب نہیں مل سکتا', 'دوسری پارٹی معاملہ بڑھا سکتی ہے'],
      recommended: false
    },
    {
      id: '2',
      title: 'Attempt Mediation',
      titleUrdu: 'ثالثی کی کوشش',
      description: 'Try to resolve through neutral third-party mediation before going to court.',
      descriptionUrdu: 'عدالت جانے سے پہلے غیر جانبدار ثالث کے ذریعے حل کرنے کی کوشش کریں۔',
      steps: [
        { step: 'Identify mediator', stepUrdu: 'ثالث کی شناخت کریں' },
        { step: 'Schedule mediation session', stepUrdu: 'ثالثی کا اجلاس طے کریں' },
        { step: 'Negotiate settlement', stepUrdu: 'تصفیے پر بات کریں' },
        { step: 'Document agreement', stepUrdu: 'معاہدے کو دستاویزی شکل دیں' }
      ],
      timeline: '2-4 months',
      timelineUrdu: '2-4 ماہ',
      successRate: 55,
      risks: ['Both parties must agree', 'Settlement may not be enforceable'],
      risksUrdu: ['دونوں فریقین کو متفق ہونا ضروری ہے', 'تصفیہ نافذ نہیں ہو سکتا'],
      recommended: true
    },
    {
      id: '3',
      title: 'File Civil Suit',
      titleUrdu: 'دیوانی مقدمہ دائر کریں',
      description: 'File a civil suit for declaration and possession in the appropriate court.',
      descriptionUrdu: 'مناسب عدالت میں اعلامیہ اور قبضے کے لیے دیوانی مقدمہ دائر کریں۔',
      steps: [
        { step: 'Prepare petition', stepUrdu: 'درخواست تیار کریں' },
        { step: 'File in civil court', stepUrdu: 'دیوانی عدالت میں دائر کریں' },
        { step: 'Attend hearings', stepUrdu: 'پیشیوں میں حاضر ہوں' },
        { step: 'Submit evidence', stepUrdu: 'ثبوت جمع کرائیں' },
        { step: 'Await judgment', stepUrdu: 'فیصلے کا انتظار کریں' }
      ],
      timeline: '12-24 months',
      timelineUrdu: '12-24 ماہ',
      successRate: 70,
      risks: ['Long duration', 'High legal costs', 'Uncertain outcome'],
      risksUrdu: ['طویل مدت', 'زیادہ قانونی اخراجات', 'غیر یقینی نتیجہ'],
      recommended: false
    }
  ],
  divorce: [
    {
      id: '1',
      title: 'Mutual Consent Divorce',
      titleUrdu: 'باہمی رضامندی سے طلاق',
      description: 'If both parties agree, pursue mutual consent divorce for faster resolution.',
      descriptionUrdu: 'اگر دونوں فریق متفق ہیں تو تیز حل کے لیے باہمی رضامندی سے طلاق۔',
      steps: [
        { step: 'Draft separation agreement', stepUrdu: 'علیحدگی کا معاہدہ تیار کریں' },
        { step: 'File joint petition', stepUrdu: 'مشترکہ درخواست دائر کریں' },
        { step: 'Complete cooling-off period', stepUrdu: 'کولنگ آف مدت مکمل کریں' },
        { step: 'Final decree', stepUrdu: 'حتمی فرمان' }
      ],
      timeline: '3-6 months',
      timelineUrdu: '3-6 ماہ',
      successRate: 95,
      risks: ['Both must agree on all terms', 'One party may withdraw'],
      risksUrdu: ['تمام شرائط پر اتفاق ضروری', 'ایک فریق واپس لے سکتا ہے'],
      recommended: true
    },
    {
      id: '2',
      title: 'Contested Divorce',
      titleUrdu: 'متنازعہ طلاق',
      description: 'File for divorce through family court if spouse does not agree.',
      descriptionUrdu: 'اگر شریک حیات متفق نہ ہو تو فیملی کورٹ کے ذریعے طلاق کے لیے درخواست دیں۔',
      steps: [
        { step: 'File divorce petition', stepUrdu: 'طلاق کی درخواست دائر کریں' },
        { step: 'Serve notice to spouse', stepUrdu: 'شریک حیات کو نوٹس بھیجیں' },
        { step: 'Attend hearings', stepUrdu: 'پیشیوں میں حاضر ہوں' },
        { step: 'Present evidence', stepUrdu: 'ثبوت پیش کریں' },
        { step: 'Final judgment', stepUrdu: 'حتمی فیصلہ' }
      ],
      timeline: '12-24 months',
      timelineUrdu: '12-24 ماہ',
      successRate: 75,
      risks: ['Lengthy process', 'Emotional stress', 'Higher costs'],
      risksUrdu: ['طویل عمل', 'جذباتی تناؤ', 'زیادہ اخراجات'],
      recommended: false
    }
  ]
};

export default function LegalStrategyAdvisor({ caseType, caseDetails, language = 'en' }: LegalStrategyAdvisorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [strategies, setStrategies] = useState<LegalStrategy[]>([]);
  const [analysis, setAnalysis] = useState<StrategyAnalysis | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const analyzeCase = useCallback(() => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const caseStrategies = MOCK_STRATEGIES[caseType] || MOCK_STRATEGIES['property_dispute'];
      setStrategies(caseStrategies);
      
      setAnalysis({
        caseStrength: 72,
        recommendations: [
          'Gather all property ownership documents',
          'Collect witness statements if available',
          'Consider mediation before court proceedings'
        ],
        recommendationsUrdu: [
          'تمام ملکیت کے دستاویزات جمع کریں',
          'اگر دستیاب ہوں تو گواہوں کے بیانات جمع کریں',
          'عدالتی کارروائی سے پہلے ثالثی پر غور کریں'
        ],
        keyFactors: [
          { factor: 'Strong documentation', factorUrdu: 'مضبوط دستاویزات', impact: 'positive' },
          { factor: 'Clear ownership history', factorUrdu: 'واضح ملکیت کی تاریخ', impact: 'positive' },
          { factor: 'Missing NOC certificate', factorUrdu: 'این او سی غائب', impact: 'negative' },
          { factor: 'Property registered', factorUrdu: 'جائیداد رجسٹرڈ', impact: 'positive' }
        ]
      });
      
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 2500);
  }, [caseType]);

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return 'text-green-400 bg-green-400/20';
      case 'negative': return 'text-red-400 bg-red-400/20';
      default: return 'text-ehb-textMuted bg-slate-400/20';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-gold flex items-center justify-center">
            <Brain className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI قانونی حکمت عملی مشیر' : 'AI Legal Strategy Advisor'}
            </h2>
            <p className="text-ehb-textMuted">
              {language === 'ur' 
                ? 'آپ کے کیس کا تجزیہ کرکے بہترین قانونی حکمت عملی تجویز کرتا ہے'
                : 'Analyzes your case and suggests the best legal strategy'}
            </p>
          </div>
        </div>

        {!hasAnalyzed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeCase}
            disabled={isAnalyzing}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                {language === 'ur' ? 'کیس کا تجزیہ ہو رہا ہے...' : 'Analyzing Case...'}
              </>
            ) : (
              <>
                <Brain size={24} />
                {language === 'ur' ? 'AI تجزیہ شروع کریں' : 'Start AI Analysis'}
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {hasAnalyzed && analysis && (
          <>
            {/* Case Strength */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="text-brand-gold" size={20} />
                {language === 'ur' ? 'کیس کی مضبوطی' : 'Case Strength'}
              </h3>

              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 352' }}
                      animate={{ strokeDasharray: `${analysis.caseStrength * 3.52} 352` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{analysis.caseStrength}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {analysis.keyFactors.map((factor, index) => (
                    <div key={index} className={`flex items-center justify-between px-3 py-2 rounded-lg ${getImpactColor(factor.impact)}`}>
                      <span className="text-sm font-medium">
                        {language === 'ur' ? factor.factorUrdu : factor.factor}
                      </span>
                      {factor.impact === 'positive' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <AlertTriangle size={18} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recommended Strategies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="text-brand-gold" size={20} />
                {language === 'ur' ? 'تجویز کردہ حکمت عملی' : 'Suggested Strategies'}
              </h3>

              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <motion.div
                    key={strategy.id}
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-xl border transition-all cursor-pointer ${
                      selectedStrategy === strategy.id
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    } ${strategy.recommended ? 'ring-2 ring-green-500/30' : ''}`}
                    onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-bold">
                              {language === 'ur' ? strategy.titleUrdu : strategy.title}
                            </h4>
                            {strategy.recommended && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                {language === 'ur' ? 'تجویز کردہ' : 'Recommended'}
                              </span>
                            )}
                          </div>
                          <p className="text-ehb-textMuted text-sm mt-1">
                            {language === 'ur' ? strategy.descriptionUrdu : strategy.description}
                          </p>
                        </div>
                        <ChevronRight 
                          className={`text-ehb-textMuted transition-transform ${selectedStrategy === strategy.id ? 'rotate-90' : ''}`} 
                          size={24} 
                        />
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock size={14} className="text-brand-gold" />
                          <span className="text-ehb-textMuted">
                            {language === 'ur' ? strategy.timelineUrdu : strategy.timeline}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp size={14} className="text-green-400" />
                          <span className="text-green-400">{strategy.successRate}%</span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedStrategy === strategy.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 px-4 pb-4"
                        >
                          <div className="pt-4 space-y-4">
                            {/* Steps */}
                            <div>
                              <h5 className="text-white font-medium mb-2 text-sm">
                                {language === 'ur' ? 'اقدامات' : 'Steps'}
                              </h5>
                              <div className="space-y-2">
                                {strategy.steps.map((step, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center font-bold">
                                      {index + 1}
                                    </span>
                                    <span className="text-ehb-textBody text-sm">
                                      {language === 'ur' ? step.stepUrdu : step.step}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Risks */}
                            <div>
                              <h5 className="text-white font-medium mb-2 text-sm flex items-center gap-1">
                                <AlertTriangle size={14} className="text-orange-400" />
                                {language === 'ur' ? 'خطرات' : 'Risks'}
                              </h5>
                              <ul className="space-y-1">
                                {(language === 'ur' ? strategy.risksUrdu : strategy.risks).map((risk, index) => (
                                  <li key={index} className="text-ehb-textMuted text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2">
                              <Scale size={20} />
                              {language === 'ur' ? 'یہ حکمت عملی منتخب کریں' : 'Select This Strategy'}
                              <ArrowRight size={20} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-brand-gold" size={20} />
                {language === 'ur' ? 'AI سفارشات' : 'AI Recommendations'}
              </h3>

              <ul className="space-y-3">
                {(language === 'ur' ? analysis.recommendationsUrdu : analysis.recommendations).map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <CheckCircle2 className="text-brand-gold flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-ehb-textBody">{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
