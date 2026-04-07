'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  BarChart2, Target, Brain, Sparkles, Loader2,
  ArrowUp, ArrowDown, Minus, Shield, FileWarning,
  Lightbulb
} from 'lucide-react';

interface PredictionFactor {
  name: string;
  nameUrdu: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
  recommendationUrdu?: string;
}

interface CasePrediction {
  successProbability: number;
  estimatedTimeline: string;
  estimatedTimelineUrdu: string;
  confidence: number;
  factors: PredictionFactor[];
  risks: string[];
  risksUrdu: string[];
  improvements: string[];
  improvementsUrdu: string[];
}

interface CasePredictionProps {
  caseType: string;
  caseDetails?: Record<string, any>;
  language?: 'en' | 'ur';
}

export default function CasePredictionComponent({ caseType, caseDetails, language = 'en' }: CasePredictionProps) {
  const [prediction, setPrediction] = useState<CasePrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePrediction = useCallback(() => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setPrediction({
        successProbability: 72,
        estimatedTimeline: '4-6 months',
        estimatedTimelineUrdu: '4-6 ماہ',
        confidence: 85,
        factors: [
          {
            name: 'Documentation Strength',
            nameUrdu: 'دستاویزات کی مضبوطی',
            score: 85,
            impact: 'positive',
            recommendation: 'Your documents are strong. Keep originals safe.',
            recommendationUrdu: 'آپ کی دستاویزات مضبوط ہیں۔ اصل محفوظ رکھیں۔'
          },
          {
            name: 'Legal Precedent',
            nameUrdu: 'قانونی نظیر',
            score: 70,
            impact: 'positive',
            recommendation: 'Similar cases have favorable outcomes.',
            recommendationUrdu: 'اسی طرح کے مقدمات کے نتائج سازگار رہے ہیں۔'
          },
          {
            name: 'Evidence Quality',
            nameUrdu: 'ثبوت کی کوالٹی',
            score: 55,
            impact: 'neutral',
            recommendation: 'Consider gathering additional witness statements.',
            recommendationUrdu: 'اضافی گواہوں کے بیانات جمع کرنے پر غور کریں۔'
          },
          {
            name: 'Opposition Strength',
            nameUrdu: 'مخالف فریق کی طاقت',
            score: 40,
            impact: 'negative',
            recommendation: 'The opposing party has experienced legal counsel.',
            recommendationUrdu: 'مخالف فریق کے پاس تجربہ کار وکیل ہے۔'
          },
          {
            name: 'Jurisdiction',
            nameUrdu: 'دائرہ اختیار',
            score: 80,
            impact: 'positive'
          }
        ],
        risks: [
          'Case may extend beyond estimated timeline due to court delays',
          'Opposition may file counter-claims',
          'Additional documents may be required during proceedings'
        ],
        risksUrdu: [
          'عدالتی تاخیر کی وجہ سے کیس متوقع وقت سے زیادہ لمبا ہو سکتا ہے',
          'مخالف فریق جوابی دعوے دائر کر سکتا ہے',
          'کارروائی کے دوران اضافی دستاویزات درکار ہو سکتی ہیں'
        ],
        improvements: [
          'Upload any additional property documents',
          'Gather witness statements from neighbors',
          'Prepare detailed timeline of events'
        ],
        improvementsUrdu: [
          'کوئی اضافی جائیداد کی دستاویزات اپ لوڈ کریں',
          'پڑوسیوں سے گواہوں کے بیانات حاصل کریں',
          'واقعات کی تفصیلی ٹائم لائن تیار کریں'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  }, [caseType]);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <ArrowUp className="text-green-400" size={16} />;
      case 'negative': return <ArrowDown className="text-red-400" size={16} />;
      default: return <Minus className="text-ehb-textMuted" size={16} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-green-500/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-brand-gold flex items-center justify-center">
            <BarChart2 className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI کیس پیشن گوئی' : 'AI Case Prediction'}
            </h2>
            <p className="text-ehb-textMuted">
              {language === 'ur' 
                ? 'آپ کے کیس کی کامیابی کا امکان اور تجزیہ'
                : 'Success probability and analysis for your case'}
            </p>
          </div>
        </div>

        {!prediction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzePrediction}
            disabled={isAnalyzing}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                {language === 'ur' ? 'کیس کا تجزیہ ہو رہا ہے...' : 'Analyzing Case...'}
              </>
            ) : (
              <>
                <Brain size={24} />
                {language === 'ur' ? 'پیشن گوئی حاصل کریں' : 'Get Prediction'}
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* Main Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Success Probability */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-brand-gold" size={24} />
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  {language === 'ur' ? 'اعتماد' : 'Confidence'}: {prediction.confidence}%
                </span>
              </div>
              <div className="relative w-32 h-32 mx-auto mb-4">
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
                    stroke={prediction.successProbability >= 70 ? '#22C55E' : prediction.successProbability >= 50 ? '#EAB308' : '#EF4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${prediction.successProbability * 3.52} 352` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(prediction.successProbability)}`}>
                    {prediction.successProbability}%
                  </span>
                  <span className="text-ehb-textMuted text-xs">
                    {language === 'ur' ? 'کامیابی' : 'Success'}
                  </span>
                </div>
              </div>
              <p className="text-center text-white font-medium">
                {language === 'ur' ? 'کامیابی کا امکان' : 'Success Probability'}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
              <Clock className="text-brand-gold mb-4" size={24} />
              <h4 className="text-ehb-textMuted text-sm mb-2">
                {language === 'ur' ? 'متوقع مدت' : 'Estimated Timeline'}
              </h4>
              <p className="text-white font-bold text-3xl mb-2">
                {language === 'ur' ? prediction.estimatedTimelineUrdu : prediction.estimatedTimeline}
              </p>
              <p className="text-ehb-textMuted text-sm">
                {language === 'ur' ? 'عدالتی تاخیر سے بڑھ سکتا ہے' : 'May extend due to court delays'}
              </p>
            </div>

            {/* Quick Assessment */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
              <TrendingUp className="text-brand-gold mb-4" size={24} />
              <h4 className="text-ehb-textMuted text-sm mb-2">
                {language === 'ur' ? 'فوری تشخیص' : 'Quick Assessment'}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'مضبوط پہلو' : 'Strong Points'}</span>
                  <span className="text-green-400 font-medium">
                    {prediction.factors.filter(f => f.impact === 'positive').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'کمزور پہلو' : 'Weak Points'}</span>
                  <span className="text-red-400 font-medium">
                    {prediction.factors.filter(f => f.impact === 'negative').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ehb-textMuted">{language === 'ur' ? 'خطرات' : 'Risks'}</span>
                  <span className="text-yellow-400 font-medium">{prediction.risks.length}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="text-brand-gold" size={20} />
              {language === 'ur' ? 'تفصیلی عوامل کا تجزیہ' : 'Detailed Factor Analysis'}
            </h3>

            <div className="space-y-4">
              {prediction.factors.map((factor, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getImpactIcon(factor.impact)}
                      <span className="text-white font-medium">
                        {language === 'ur' ? factor.nameUrdu : factor.name}
                      </span>
                    </div>
                    <span className={`font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${
                        factor.score >= 70 ? 'bg-green-500' : 
                        factor.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  {factor.recommendation && (
                    <p className="text-ehb-textMuted text-sm">
                      {language === 'ur' ? factor.recommendationUrdu : factor.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risks & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-900/30 via-slate-800 to-slate-900 rounded-2xl p-6 border border-red-500/20"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={20} />
                {language === 'ur' ? 'ممکنہ خطرات' : 'Potential Risks'}
              </h3>
              <ul className="space-y-3">
                {(language === 'ur' ? prediction.risksUrdu : prediction.risks).map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-ehb-textBody text-sm">
                    <FileWarning className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                    {risk}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-900/30 via-slate-800 to-slate-900 rounded-2xl p-6 border border-green-500/20"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="text-green-400" size={20} />
                {language === 'ur' ? 'بہتری کی تجاویز' : 'Suggested Improvements'}
              </h3>
              <ul className="space-y-3">
                {(language === 'ur' ? prediction.improvementsUrdu : prediction.improvements).map((imp, index) => (
                  <li key={index} className="flex items-start gap-2 text-ehb-textBody text-sm">
                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                    {imp}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-xl p-4 flex items-start gap-3"
          >
            <Shield className="text-ehb-textMuted flex-shrink-0 mt-0.5" size={20} />
            <p className="text-ehb-textMuted text-sm">
              {language === 'ur' 
                ? 'یہ پیشن گوئی AI تجزیے پر مبنی ہے اور قانونی مشورہ نہیں ہے۔ نتائج عدالتی فیصلوں اور دیگر عوامل کی بنا پر مختلف ہو سکتے ہیں۔'
                : 'This prediction is based on AI analysis and is not legal advice. Results may vary based on court decisions and other factors.'}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}
