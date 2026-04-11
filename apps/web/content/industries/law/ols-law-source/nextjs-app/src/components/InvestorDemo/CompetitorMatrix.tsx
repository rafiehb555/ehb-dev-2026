'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check, X, Minus, Crown, Globe, Bot, Scale, Building2,
  CreditCard, Users, Zap, Shield, Languages, Smartphone
} from 'lucide-react';

interface FeatureRow {
  category: string;
  feature: string;
  featureUrdu: string;
  ehb: 'yes' | 'no' | 'partial' | 'unique';
  legalZoom: 'yes' | 'no' | 'partial';
  rocketLawyer: 'yes' | 'no' | 'partial';
  avvo: 'yes' | 'no' | 'partial';
  lawDepot: 'yes' | 'no' | 'partial';
  importance: 'high' | 'medium' | 'low';
}

const FEATURE_MATRIX: FeatureRow[] = [
  // AI Features
  { category: 'AI Technology', feature: 'AI Legal Assistant', featureUrdu: 'AI قانونی معاون', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'AI Technology', feature: 'AI Voice Interaction', featureUrdu: 'AI وائس انٹریکشن', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'AI Technology', feature: 'AI Case Analysis', featureUrdu: 'AI کیس تجزیہ', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'AI Technology', feature: 'AI Lawyer Matching', featureUrdu: 'AI وکیل میچنگ', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'partial', lawDepot: 'no', importance: 'high' },
  { category: 'AI Technology', feature: 'AI Document Generation', featureUrdu: 'AI دستاویز بنانا', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'yes', importance: 'medium' },
  { category: 'AI Technology', feature: 'Multi-Agent AI System', featureUrdu: 'ملٹی ایجنٹ AI سسٹم', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'high' },
  
  // Global Features
  { category: 'Global Reach', feature: 'Multi-Country Support', featureUrdu: 'ملٹی کنٹری سپورٹ', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'partial', importance: 'high' },
  { category: 'Global Reach', feature: 'Multi-Language Platform', featureUrdu: 'ملٹی لینگویج پلیٹ فارم', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'partial', importance: 'high' },
  { category: 'Global Reach', feature: 'Cross-Border Legal Services', featureUrdu: 'کراس بارڈر قانونی خدمات', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'Global Reach', feature: 'Franchise Network Model', featureUrdu: 'فرنچائز نیٹ ورک ماڈل', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'medium' },
  
  // Marketplace Features
  { category: 'Marketplace', feature: 'Lawyer Marketplace', featureUrdu: 'وکیل مارکیٹ پلیس', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'yes', avvo: 'yes', lawDepot: 'no', importance: 'high' },
  { category: 'Marketplace', feature: 'Verified Lawyer Profiles', featureUrdu: 'تصدیق شدہ وکیل پروفائلز', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'yes', avvo: 'yes', lawDepot: 'no', importance: 'high' },
  { category: 'Marketplace', feature: 'Multiple Hiring Models', featureUrdu: 'متعدد ہائرنگ ماڈلز', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'partial', avvo: 'partial', lawDepot: 'no', importance: 'medium' },
  { category: 'Marketplace', feature: 'STL Verification System', featureUrdu: 'STL تصدیقی نظام', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'medium' },
  
  // Services
  { category: 'Services', feature: 'Full Case Management', featureUrdu: 'مکمل کیس مینجمنٹ', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'Services', feature: 'Document Templates', featureUrdu: 'دستاویز ٹیمپلیٹس', ehb: 'yes', legalZoom: 'yes', rocketLawyer: 'yes', avvo: 'no', lawDepot: 'yes', importance: 'medium' },
  { category: 'Services', feature: 'Legal Consultation Booking', featureUrdu: 'قانونی مشاورت بکنگ', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'yes', avvo: 'yes', lawDepot: 'no', importance: 'high' },
  { category: 'Services', feature: 'Court Process Automation', featureUrdu: 'عدالتی عمل آٹومیشن', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'high' },
  
  // Payments
  { category: 'Payments', feature: 'Escrow Payment System', featureUrdu: 'ایسکرو ادائیگی سسٹم', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'no', importance: 'high' },
  { category: 'Payments', feature: 'Multi-Currency Support', featureUrdu: 'ملٹی کرنسی سپورٹ', ehb: 'yes', legalZoom: 'partial', rocketLawyer: 'partial', avvo: 'no', lawDepot: 'partial', importance: 'medium' },
  { category: 'Payments', feature: 'Crypto Payments', featureUrdu: 'کرپٹو ادائیگی', ehb: 'yes', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'low' },
  { category: 'Payments', feature: 'Platform Coin (EHBGC)', featureUrdu: 'پلیٹ فارم کوائن', ehb: 'unique', legalZoom: 'no', rocketLawyer: 'no', avvo: 'no', lawDepot: 'no', importance: 'low' },
];

const COMPETITORS = [
  { id: 'ehb', name: 'EHB Law', logo: '🚀', highlight: true },
  { id: 'legalZoom', name: 'LegalZoom', logo: '📄', highlight: false },
  { id: 'rocketLawyer', name: 'Rocket Lawyer', logo: '🚀', highlight: false },
  { id: 'avvo', name: 'Avvo', logo: '⚖️', highlight: false },
  { id: 'lawDepot', name: 'LawDepot', logo: '📋', highlight: false },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'yes':
      return <Check className="text-green-400" size={20} />;
    case 'no':
      return <X className="text-red-400" size={20} />;
    case 'partial':
      return <Minus className="text-yellow-400" size={20} />;
    case 'unique':
      return (
        <div className="flex items-center gap-1">
          <Crown className="text-brand-gold" size={18} />
          <span className="text-brand-gold text-xs font-bold">UNIQUE</span>
        </div>
      );
    default:
      return <Minus className="text-ehb-textMuted" size={20} />;
  }
};

interface CompetitorMatrixProps {
  language?: 'en' | 'ur';
}

export default function CompetitorMatrix({ language = 'en' }: CompetitorMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...new Set(FEATURE_MATRIX.map(f => f.category))];
  
  const filteredFeatures = selectedCategory === 'all' 
    ? FEATURE_MATRIX 
    : FEATURE_MATRIX.filter(f => f.category === selectedCategory);

  // Count unique features
  const uniqueFeatures = FEATURE_MATRIX.filter(f => f.ehb === 'unique').length;
  const totalYes = FEATURE_MATRIX.filter(f => f.ehb === 'yes' || f.ehb === 'unique').length;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="text-brand-gold" />
          {language === 'ur' ? 'مقابلہ کا تجزیہ' : 'Competitive Analysis'}
        </h2>
        <p className="text-ehb-textMuted mt-1">
          {language === 'ur' 
            ? 'EHB بمقابلہ روایتی قانونی پلیٹ فارمز'
            : 'EHB vs Traditional Legal Platforms'}
        </p>
      </div>

      {/* EHB Advantage Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-xl p-4 border border-brand-gold/30">
          <Crown className="text-brand-gold mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{uniqueFeatures}</p>
          <p className="text-sm text-ehb-textMuted">Unique Features</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-4 border border-green-500/30">
          <Check className="text-green-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">{totalYes}</p>
          <p className="text-sm text-ehb-textMuted">Total Features</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-4 border border-blue-500/30 col-span-2 md:col-span-1">
          <Globe className="text-blue-400 mb-2" size={24} />
          <p className="text-3xl font-bold text-white">50+</p>
          <p className="text-sm text-ehb-textMuted">Target Countries</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-brand-gold text-slate-900'
                : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Features' : cat}
          </button>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-3 text-ehb-textMuted font-medium text-sm w-1/4">Feature</th>
              {COMPETITORS.map((comp) => (
                <th 
                  key={comp.id} 
                  className={`text-center py-4 px-3 text-sm ${
                    comp.highlight ? 'text-brand-gold font-bold' : 'text-ehb-textMuted font-medium'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">{comp.logo}</span>
                    <span>{comp.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((row, index) => (
              <motion.tr
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-4 px-3">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {language === 'ur' ? row.featureUrdu : row.feature}
                    </p>
                    <p className="text-ehb-textMuted text-xs">{row.category}</p>
                  </div>
                </td>
                <td className={`text-center py-4 px-3 ${row.ehb === 'unique' ? 'bg-brand-gold/5' : ''}`}>
                  <StatusIcon status={row.ehb} />
                </td>
                <td className="text-center py-4 px-3">
                  <StatusIcon status={row.legalZoom} />
                </td>
                <td className="text-center py-4 px-3">
                  <StatusIcon status={row.rocketLawyer} />
                </td>
                <td className="text-center py-4 px-3">
                  <StatusIcon status={row.avvo} />
                </td>
                <td className="text-center py-4 px-3">
                  <StatusIcon status={row.lawDepot} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <Crown className="text-brand-gold" size={16} />
          <span className="text-ehb-textMuted">Unique to EHB</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="text-green-400" size={16} />
          <span className="text-ehb-textMuted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="text-yellow-400" size={16} />
          <span className="text-ehb-textMuted">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="text-red-400" size={16} />
          <span className="text-ehb-textMuted">Not Available</span>
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="mt-8 p-6 bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl border border-brand-gold/30">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="text-brand-gold" />
          {language === 'ur' ? 'EHB کے اہم فرق' : 'EHB Key Differentiators'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Bot, title: 'AI-First Platform', desc: 'Not document-focused, but AI-driven end-to-end legal journey' },
            { icon: Globe, title: 'Global-First Design', desc: 'Multi-country, multi-language, cross-border from day one' },
            { icon: Building2, title: 'Franchise Model', desc: 'Scalable expansion through local franchise partnerships' },
            { icon: Scale, title: 'Full Legal Lifecycle', desc: 'From consultation to court representation, all in one platform' },
          ].map((diff, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center shrink-0">
                <diff.icon className="text-brand-gold" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">{diff.title}</p>
                <p className="text-ehb-textMuted text-sm">{diff.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
