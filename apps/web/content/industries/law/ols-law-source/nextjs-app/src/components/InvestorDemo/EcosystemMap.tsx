'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Bot, Scale, Building2, Globe, CreditCard,
  Mic, Search, FileText, MessageSquare, Video,
  Shield, Zap, Brain, Network, TrendingUp,
  ChevronRight, Play, Layers, Target
} from 'lucide-react';

interface EcosystemLayer {
  id: string;
  name: string;
  nameUrdu: string;
  icon: React.ElementType;
  color: string;
  description: string;
  modules: string[];
}

const ECOSYSTEM_LAYERS: EcosystemLayer[] = [
  {
    id: 'users',
    name: 'User Interaction Layer',
    nameUrdu: 'صارف انٹریکشن لیئر',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description: 'Entry point where users interact with the platform',
    modules: ['AI Voice Assistant', 'AI Chat', 'Search Bar', 'Service Marketplace', 'Document Generator'],
  },
  {
    id: 'services',
    name: 'Legal Services Layer',
    nameUrdu: 'قانونی خدمات لیئر',
    icon: Scale,
    color: 'from-emerald-500 to-green-500',
    description: 'Core legal services delivery',
    modules: ['Family Law', 'Property Law', 'Corporate Law', 'Immigration', 'Criminal Defense', 'Tax Law'],
  },
  {
    id: 'marketplace',
    name: 'Lawyer Marketplace',
    nameUrdu: 'وکیل مارکیٹ پلیس',
    icon: Building2,
    color: 'from-violet-500 to-purple-500',
    description: 'Global network of verified lawyers',
    modules: ['Lawyer Profiles', 'Verification System', 'Ratings & Reviews', 'Consultation Booking', 'Hiring Models'],
  },
  {
    id: 'ai',
    name: 'AI Automation Layer',
    nameUrdu: 'AI آٹومیشن لیئر',
    icon: Brain,
    color: 'from-orange-500 to-amber-500',
    description: 'Intelligent automation powering the platform',
    modules: ['Case Analysis', 'Lawyer Matching', 'Document Generation', 'Legal Research', 'Case Prediction'],
  },
  {
    id: 'business',
    name: 'Business Ecosystem',
    nameUrdu: 'کاروباری ایکو سسٹم',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-500',
    description: 'Revenue and scaling infrastructure',
    modules: ['Franchise Network', 'Subscriptions', 'Service Fees', 'AI Tools Revenue', 'Global Expansion'],
  },
];

const PLATFORM_STATS = [
  { label: 'Countries', value: '50+', icon: Globe },
  { label: 'AI Agents', value: '14', icon: Bot },
  { label: 'Legal Services', value: '32', icon: Scale },
  { label: 'Revenue Streams', value: '5', icon: CreditCard },
];

interface EcosystemMapProps {
  language?: 'en' | 'ur';
  mode?: 'full' | 'compact';
}

export default function EcosystemMap({ language = 'en', mode = 'full' }: EcosystemMapProps) {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < ECOSYSTEM_LAYERS.length) {
        setSelectedLayer(ECOSYSTEM_LAYERS[index].id);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setSelectedLayer(null);
          setIsAnimating(false);
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Network className="text-brand-gold" />
            {language === 'ur' ? 'EHB ایکو سسٹم میپ' : 'EHB Ecosystem Map'}
          </h2>
          <p className="text-ehb-textMuted mt-1">
            {language === 'ur' 
              ? 'عالمی AI قانونی پلیٹ فارم کا مکمل نظارہ'
              : 'Complete view of the global AI legal platform'}
          </p>
        </div>
        
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isAnimating 
              ? 'bg-slate-700 text-ehb-textMuted cursor-not-allowed' 
              : 'bg-brand-gold text-slate-900 hover:bg-brand-gold/90'
          }`}
        >
          <Play size={18} />
          {isAnimating ? 'Animating...' : 'Start Demo Flow'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {PLATFORM_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700"
          >
            <stat.icon className="mx-auto text-brand-gold mb-2" size={24} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-ehb-textMuted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Ecosystem Visualization */}
      <div className="relative">
        {/* Central Platform Core */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: isAnimating ? Infinity : 0 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center shadow-2xl shadow-brand-gold/20"
          >
            <div className="text-center">
              <Zap className="mx-auto text-white mb-1" size={32} />
              <p className="text-white font-bold text-sm">EHB</p>
              <p className="text-white/70 text-xs">Platform</p>
            </div>
          </motion.div>
        </div>

        {/* Layers */}
        <div className="space-y-4">
          {ECOSYSTEM_LAYERS.map((layer, index) => {
            const LayerIcon = layer.icon;
            const isSelected = selectedLayer === layer.id;
            
            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedLayer(isSelected ? null : layer.id)}
                className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-brand-gold shadow-lg shadow-brand-gold/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Layer Header */}
                <div className={`bg-gradient-to-r ${layer.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <LayerIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {language === 'ur' ? layer.nameUrdu : layer.name}
                      </h3>
                      <p className="text-white/70 text-sm">{layer.description}</p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`text-white transition-transform ${isSelected ? 'rotate-90' : ''}`} 
                    size={24} 
                  />
                </div>

                {/* Layer Modules */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-800/50 p-4"
                    >
                      <div className="flex flex-wrap gap-2">
                        {layer.modules.map((module, i) => (
                          <motion.span
                            key={module}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg border border-slate-600"
                          >
                            {module}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Connection Lines (Visual) */}
        <div className="absolute left-1/2 top-32 w-0.5 h-full bg-gradient-to-b from-brand-gold via-slate-600 to-transparent -z-10 transform -translate-x-1/2" />
      </div>

      {/* Key Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl border border-brand-gold/30 text-center"
      >
        <Layers className="mx-auto text-brand-gold mb-3" size={32} />
        <p className="text-white font-bold text-lg mb-2">
          {language === 'ur' 
            ? 'یہ صرف ایک ایپ نہیں — یہ ایک قانونی ایکو سسٹم ہے'
            : 'This is not just an app — This is a Legal Ecosystem'}
        </p>
        <p className="text-ehb-textMuted text-sm">
          {language === 'ur'
            ? 'EHB صارفین، وکلاء، AI ٹیکنالوجی، اور قانونی خدمات کو ایک پلیٹ فارم میں جوڑتا ہے'
            : 'EHB connects users, lawyers, AI technology, and legal services into a single platform'}
        </p>
      </motion.div>
    </div>
  );
}
