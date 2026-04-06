'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, ChevronRight, ChevronLeft, X, Sparkles, 
  Bot, Scale, Users, CreditCard, LayoutDashboard, Globe,
  Rocket, Clock, CheckCircle2, ArrowRight, Volume2, VolumeX
} from 'lucide-react';

// Demo Steps
const DEMO_STEPS = [
  {
    id: 1,
    title: 'Welcome to EHB Law',
    description: 'The world\'s first AI-powered legal services ecosystem',
    script: 'Today, accessing legal services is complicated, expensive, and slow. Our goal with EHB AI Legal Platform is to build a global ecosystem where users can access legal help instantly.',
    route: '/',
    highlight: 'ai-search',
    duration: 15,
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'AI Legal Assistant',
    description: 'Ask any legal question and get instant guidance',
    script: 'The AI assistant analyzes the legal problem and recommends the correct legal services and lawyers. Users can immediately start a legal case or find a lawyer.',
    route: '/ai-agent',
    highlight: 'ai-chat',
    duration: 25,
    icon: Bot,
  },
  {
    id: 3,
    title: 'Case Creation Wizard',
    description: 'AI-guided step-by-step case filing',
    script: 'The platform guides users step-by-step through the legal process. Select case type, explain your situation, and upload documents.',
    route: '/create-case',
    highlight: 'case-wizard',
    duration: 30,
    icon: Scale,
  },
  {
    id: 4,
    title: 'AI Case Analysis',
    description: 'Intelligent case evaluation and lawyer matching',
    script: 'Our AI system analyzes the case and matches the user with the most suitable lawyers from our global marketplace.',
    route: '/ai-analyzer',
    highlight: 'analysis',
    duration: 20,
    icon: Sparkles,
  },
  {
    id: 5,
    title: 'Global Lawyer Marketplace',
    description: '25,000+ verified lawyers across 50+ countries',
    script: 'Each lawyer profile includes experience, specialization, reviews, and pricing. Users can hire lawyers instantly.',
    route: '/global-marketplace',
    highlight: 'lawyers',
    duration: 15,
    icon: Users,
  },
  {
    id: 6,
    title: 'Secure Payments',
    description: 'Multiple payment options with escrow protection',
    script: 'Once payment is completed, the legal case is created instantly. Funds are held in escrow until milestones are completed.',
    route: '/payments',
    highlight: 'payment',
    duration: 15,
    icon: CreditCard,
  },
  {
    id: 7,
    title: 'Case Dashboard',
    description: 'Track cases, documents, and communicate with lawyers',
    script: 'Users can track their legal cases through a centralized dashboard with real-time updates, documents, and lawyer communication.',
    route: '/dashboard',
    highlight: 'dashboard',
    duration: 25,
    icon: LayoutDashboard,
  },
  {
    id: 8,
    title: 'Global Vision',
    description: 'Building the world\'s largest legal ecosystem',
    script: 'Our long-term vision is to build the world\'s largest legal services ecosystem powered by AI and a global lawyer network across 50+ countries.',
    route: '/landing',
    highlight: 'vision',
    duration: 20,
    icon: Globe,
  },
];

interface GuidedDemoModeProps {
  isActive?: boolean;
  onClose?: () => void;
}

export default function GuidedDemoMode({ isActive = false, onClose }: GuidedDemoModeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDemoActive, setIsDemoActive] = useState(isActive);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLauncher, setShowLauncher] = useState(true);

  const step = DEMO_STEPS[currentStep];
  const totalDuration = DEMO_STEPS.reduce((acc, s) => acc + s.duration, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isDemoActive) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStep < DEMO_STEPS.length - 1) {
              setCurrentStep(curr => curr + 1);
              router.push(DEMO_STEPS[currentStep + 1].route);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (100 / (step.duration * 10));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isDemoActive, currentStep, step.duration, router]);

  useEffect(() => {
    if (isDemoActive && step) {
      router.push(step.route);
    }
  }, [currentStep, isDemoActive]);

  const handleStart = () => {
    setIsDemoActive(true);
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
    setShowLauncher(false);
    router.push(DEMO_STEPS[0].route);
  };

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
      setProgress(0);
      router.push(DEMO_STEPS[currentStep + 1].route);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      setProgress(0);
      router.push(DEMO_STEPS[currentStep - 1].route);
    }
  };

  const handleClose = () => {
    setIsDemoActive(false);
    setIsPlaying(false);
    setShowLauncher(true);
    onClose?.();
  };

  const speakScript = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(step.script);
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <>
      {/* Demo Launcher Button */}
      <AnimatePresence>
        {showLauncher && !isDemoActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={handleStart}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all">
                <Rocket size={22} />
                <span>Start Investor Demo</span>
                <div className="flex items-center gap-1 text-xs bg-slate-900/20 px-2 py-1 rounded-full">
                  <Clock size={12} />
                  2:30
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Demo Panel */}
      <AnimatePresence>
        {isDemoActive && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            {/* Gradient overlay at bottom of screen */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
            
            <div className="relative max-w-4xl mx-auto px-4 pb-6">
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-100"
                    style={{ width: `${((currentStep + progress / 100) / DEMO_STEPS.length) * 100}%` }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Step Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shrink-0">
                      <step.icon className="text-slate-900" size={28} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#D4AF37]">Step {currentStep + 1} of {DEMO_STEPS.length}</span>
                        <span className="text-xs text-slate-500">• {step.duration}s</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{step.description}</p>
                      
                      {/* Script */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-slate-300 leading-relaxed">"{step.script}"</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                      
                      <button
                        onClick={speakScript}
                        className={`p-2 rounded-lg transition-all ${
                          isSpeaking ? 'bg-[#D4AF37] text-slate-900' : 'hover:bg-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                    {/* Step Dots */}
                    <div className="flex gap-2">
                      {DEMO_STEPS.map((s, i) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentStep(i);
                            setProgress(0);
                            router.push(s.route);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentStep 
                              ? 'bg-[#D4AF37] w-6' 
                              : i < currentStep 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="text-white" size={20} />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={currentStep === DEMO_STEPS.length - 1}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="text-white" size={20} />
                      </button>
                    </div>

                    {/* End Demo */}
                    {currentStep === DEMO_STEPS.length - 1 && (
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        End Demo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
