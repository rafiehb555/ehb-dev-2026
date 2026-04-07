'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, Scale, FileText, Users, MessageSquare, Search, Mic, ArrowRight, ArrowLeft,
  CheckCircle2, Star, Upload, Brain, CreditCard, BarChart3, Clock, MapPin,
  Heart, Shield, Building2, Globe, Sparkles, Play, Pause, RotateCcw, Home,
  Calendar, Video, Phone, Send, Paperclip, Check, ChevronRight, Loader2,
  FileCheck, Gavel, Crown, Zap, TrendingUp, Target
} from 'lucide-react';

const DEMO_STEPS = [
  { id: 1, title: 'Homepage', subtitle: 'Entry Point' },
  { id: 2, title: 'AI Assistant', subtitle: 'Interaction' },
  { id: 3, title: 'Legal Services', subtitle: 'Selection' },
  { id: 4, title: 'Case Wizard', subtitle: 'Step 1' },
  { id: 5, title: 'Describe Problem', subtitle: 'Step 2' },
  { id: 6, title: 'Upload Documents', subtitle: 'Step 3' },
  { id: 7, title: 'AI Analysis', subtitle: 'Processing' },
  { id: 8, title: 'Lawyer Match', subtitle: 'Recommendations' },
  { id: 9, title: 'Lawyer Profile', subtitle: 'Details' },
  { id: 10, title: 'Hire Lawyer', subtitle: 'Service Selection' },
  { id: 11, title: 'Payment', subtitle: 'Checkout' },
  { id: 12, title: 'Dashboard', subtitle: 'Case Management' },
  { id: 13, title: 'Lawyer Chat', subtitle: 'Communication' },
  { id: 14, title: 'Global Network', subtitle: 'Expansion Vision' },
];

const FAMILY_SERVICES = [
  { name: 'Divorce Case', icon: Heart, active: true },
  { name: 'Child Custody', icon: Users },
  { name: 'Alimony', icon: CreditCard },
  { name: 'Domestic Violence Protection', icon: Shield },
];

const RECOMMENDED_LAWYERS = [
  { name: 'Sarah Ahmed', spec: 'Family Law Specialist', rating: 4.8, cases: '320+', fee: '$150/hr', exp: '12 yrs', location: 'Lahore', verified: true },
  { name: 'David Khan', spec: 'Divorce Litigation Expert', rating: 4.7, cases: '280+', fee: '$180/hr', exp: '15 yrs', location: 'Dubai', verified: true },
  { name: 'Maria Ali', spec: 'Family Court Advocate', rating: 4.9, cases: '410+', fee: '$120/hr', exp: '10 yrs', location: 'Karachi', verified: true },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      setAiTyping(true);
      setTimeout(() => {
        setAiTyping(false);
        setAiResponse('I can help you with family court legal services.\n\nAvailable options:\n• Divorce Case Filing\n• Child Custody Dispute\n• Alimony & Financial Support');
      }, 2000);
    }
    if (currentStep === 7) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsAnalyzing(false), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  }, [currentStep]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && currentStep < 14) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), 4000);
    } else if (currentStep >= 14) {
      setIsAutoPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep]);

  const nextStep = () => currentStep < 14 && setCurrentStep(prev => prev + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(prev => prev - 1);
  const resetDemo = () => { setCurrentStep(1); setIsAutoPlaying(false); setAiResponse(''); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                <Scale className="text-white" size={18} />
              </div>
              <span className="font-bold text-white">EHB Law</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/20 rounded-full">
              <Sparkles className="text-[#D4AF37]" size={14} />
              <span className="text-[#D4AF37] text-xs font-medium">Investor Demo Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={resetDemo} className="p-2 hover:bg-white/10 rounded-lg transition-all" title="Restart">
              <RotateCcw className="text-ehb-textMuted" size={18} />
            </button>
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)} 
              className={`p-2 rounded-lg transition-all ${isAutoPlaying ? 'bg-[#D4AF37] text-slate-900' : 'hover:bg-white/10 text-ehb-textMuted'}`}
            >
              {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-all" title="Exit Demo">
              <Home className="text-ehb-textMuted" size={18} />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 14) * 100}%` }}
          />
        </div>
      </header>

      {/* Step Indicator */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {DEMO_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  currentStep === step.id
                    ? 'bg-[#D4AF37] text-slate-900'
                    : currentStep > step.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {currentStep > step.id ? <Check size={12} /> : <span>{step.id}</span>}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-36 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Homepage */}
            {currentStep === 1 && (
              <DemoCard key="step1" title="Homepage" subtitle="Entry Point">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Global Legal Platform</h2>
                  <p className="text-ehb-textMuted">User lands on the homepage</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Try AI Assistant', icon: Bot, primary: true },
                    { label: 'Start Legal Case', icon: FileText },
                    { label: 'Find a Lawyer', icon: Users },
                    { label: 'Legal Services', icon: Scale },
                  ].map((btn, i) => (
                    <button key={i} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                      btn.primary ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}>
                      <btn.icon size={20} />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </DemoCard>
            )}

            {/* Step 2: AI Assistant */}
            {currentStep === 2 && (
              <DemoCard key="step2" title="AI Legal Assistant" subtitle="Interaction">
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <MessageSquare className="text-blue-400" size={16} />
                    </div>
                    <div className="flex-1 bg-blue-500/10 rounded-lg rounded-tl-none p-3">
                      <p className="text-white text-sm">I want to file a divorce case</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                      <Bot className="text-[#D4AF37]" size={16} />
                    </div>
                    <div className="flex-1 bg-[#D4AF37]/10 rounded-lg rounded-tl-none p-3">
                      {aiTyping ? (
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                        </div>
                      ) : (
                        <p className="text-white text-sm whitespace-pre-line">{aiResponse}</p>
                      )}
                    </div>
                  </div>
                </div>
                {!aiTyping && aiResponse && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                    <button className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2">
                      <FileText size={18} /> Start Divorce Case
                    </button>
                    <button className="flex-1 py-3 bg-white/10 text-white rounded-xl">Find Family Lawyer</button>
                  </motion.div>
                )}
              </DemoCard>
            )}

            {/* Step 3: Legal Services */}
            {currentStep === 3 && (
              <DemoCard key="step3" title="Family Court Services" subtitle="Legal Service Selection">
                <div className="grid grid-cols-2 gap-3">
                  {FAMILY_SERVICES.map((service, i) => (
                    <button key={i} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                      service.active ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-white' : 'bg-white/5 border border-white/10 text-ehb-textBody hover:bg-white/10'
                    }`}>
                      <service.icon size={20} className={service.active ? 'text-[#D4AF37]' : ''} />
                      {service.name}
                      {service.active && <Check className="ml-auto text-[#D4AF37]" size={16} />}
                    </button>
                  ))}
                </div>
                <button className="w-full mt-4 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2">
                  Start Case <ArrowRight size={18} />
                </button>
              </DemoCard>
            )}

            {/* Step 4: Case Type Selection */}
            {currentStep === 4 && (
              <DemoCard key="step4" title="Case Creation Wizard" subtitle="Step 1: Select Case Type">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className={`flex-1 h-2 rounded-full ${n === 1 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                  ))}
                </div>
                <div className="space-y-3">
                  {['Divorce', 'Child Custody', 'Maintenance', 'Domestic Violence'].map((type, i) => (
                    <button key={i} className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition-all ${
                      i === 0 ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}>
                      <span className="text-white font-medium">{type}</span>
                      {i === 0 && <Check className="text-[#D4AF37]" size={20} />}
                    </button>
                  ))}
                </div>
              </DemoCard>
            )}

            {/* Step 5: Describe Problem */}
            {currentStep === 5 && (
              <DemoCard key="step5" title="Describe Your Legal Problem" subtitle="Step 2: Case Details">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className={`flex-1 h-2 rounded-full ${n <= 2 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <p className="text-white text-sm mb-2">User types:</p>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-ehb-textBody text-sm italic">"My spouse and I want to file for divorce. We also need help dividing assets."</p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="text-emerald-400" size={18} />
                    <span className="text-emerald-400 font-medium text-sm">AI Case Summary</span>
                  </div>
                  <p className="text-white text-sm">Divorce case involving asset division. Recommended category: Family Law - Divorce & Property Settlement</p>
                </div>
              </DemoCard>
            )}

            {/* Step 6: Upload Documents */}
            {currentStep === 6 && (
              <DemoCard key="step6" title="Upload Documents" subtitle="Step 3: Required Files">
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex-1 h-2 rounded-full bg-[#D4AF37]" />
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Marriage Certificate', status: 'uploaded' },
                    { name: 'ID Card / Passport', status: 'uploaded' },
                    { name: 'Property Documents', status: 'uploading' },
                  ].map((doc, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.status === 'uploaded' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                      }`}>
                        {doc.status === 'uploaded' ? <FileCheck className="text-emerald-400" size={20} /> : <Loader2 className="text-blue-400 animate-spin" size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{doc.name}</p>
                        <p className={`text-xs ${doc.status === 'uploaded' ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {doc.status === 'uploaded' ? 'Uploaded successfully' : 'Analyzing file...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DemoCard>
            )}

            {/* Step 7: AI Analysis */}
            {currentStep === 7 && (
              <DemoCard key="step7" title="AI Case Analysis" subtitle="Processing Your Case">
                <div className="text-center py-8">
                  {isAnalyzing ? (
                    <>
                      <div className="w-20 h-20 mx-auto mb-6 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#D4AF37" strokeWidth="4" 
                            strokeDasharray={`${analysisProgress * 2.26} 226`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="text-[#D4AF37] animate-pulse" size={28} />
                        </div>
                      </div>
                      <p className="text-white font-medium mb-2">AI is analyzing your case...</p>
                      <p className="text-ehb-textMuted text-sm">Matching lawyers • Preparing recommendations</p>
                      <p className="text-[#D4AF37] font-bold text-2xl mt-4">{analysisProgress}%</p>
                    </>
                  ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="text-emerald-400" size={40} />
                      </div>
                      <p className="text-emerald-400 font-bold text-xl mb-2">Case Analysis Complete!</p>
                      <p className="text-ehb-textMuted text-sm">Found 3 recommended lawyers</p>
                    </motion.div>
                  )}
                </div>
              </DemoCard>
            )}

            {/* Step 8: Lawyer Recommendations */}
            {currentStep === 8 && (
              <DemoCard key="step8" title="AI Lawyer Recommendations" subtitle="Top Matches for Your Case">
                <div className="space-y-3">
                  {RECOMMENDED_LAWYERS.map((lawyer, i) => (
                    <div key={i} className={`bg-white/5 rounded-xl p-4 border transition-all ${i === 0 ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/20'}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-xl">
                          👩‍⚖️
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{lawyer.name}</span>
                            {lawyer.verified && <CheckCircle2 className="text-blue-400" size={14} />}
                            {i === 0 && <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">Best Match</span>}
                          </div>
                          <p className="text-ehb-textMuted text-sm">{lawyer.spec}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="text-yellow-400">⭐ {lawyer.rating}</span>
                            <span className="text-slate-500">{lawyer.cases} cases</span>
                            <span className="text-emerald-400">{lawyer.fee}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold text-sm rounded-lg">
                          Hire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </DemoCard>
            )}

            {/* Step 9: Lawyer Profile */}
            {currentStep === 9 && (
              <DemoCard key="step9" title="Lawyer Profile" subtitle="Sarah Ahmed">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-4xl mb-3">
                    👩‍⚖️
                  </div>
                  <h3 className="text-white font-bold text-xl">Sarah Ahmed</h3>
                  <p className="text-[#D4AF37]">Family Law Specialist</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1,2,3,4,5].map(n => <Star key={n} size={16} className={n <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'} />)}
                    <span className="text-white ml-2">4.8</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Experience', value: '12 Years' },
                    { label: 'Success Rate', value: '94%' },
                    { label: 'Cases', value: '320+' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-white font-bold">{stat.value}</p>
                      <p className="text-slate-500 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-white/10 text-white rounded-xl flex items-center justify-center gap-2">
                    <Video size={18} /> Consultation
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl">
                    Hire Lawyer
                  </button>
                </div>
              </DemoCard>
            )}

            {/* Step 10: Service Selection */}
            {currentStep === 10 && (
              <DemoCard key="step10" title="Select Service" subtitle="Hire Lawyer">
                <div className="space-y-3 mb-6">
                  {[
                    { name: 'Video Consultation', price: '$80', desc: '30 min session', selected: false },
                    { name: 'Full Case Representation', price: '$1,500', desc: 'Complete legal support', selected: true },
                    { name: 'Document Review', price: '$150', desc: 'Legal document analysis', selected: false },
                  ].map((service, i) => (
                    <button key={i} className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition-all ${
                      service.selected ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]' : 'bg-white/5 border border-white/10'
                    }`}>
                      <div>
                        <p className="text-white font-medium">{service.name}</p>
                        <p className="text-slate-500 text-sm">{service.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${service.selected ? 'text-[#D4AF37]' : 'text-white'}`}>{service.price}</p>
                        {service.selected && <Check className="text-[#D4AF37] ml-auto" size={20} />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ehb-textMuted">Service Fee</span>
                    <span className="text-white">$1,500</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ehb-textMuted">Platform Fee</span>
                    <span className="text-white">$75</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-[#D4AF37] font-bold text-xl">$1,575</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl">
                  Proceed to Payment
                </button>
              </DemoCard>
            )}

            {/* Step 11: Payment */}
            {currentStep === 11 && (
              <DemoCard key="step11" title="Payment" subtitle="Secure Checkout">
                <div className="space-y-3 mb-6">
                  {['Credit Card', 'Crypto (USDT)', 'Bank Transfer'].map((method, i) => (
                    <button key={i} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                      i === 0 ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]' : 'bg-white/5 border border-white/10'
                    }`}>
                      <CreditCard className={i === 0 ? 'text-[#D4AF37]' : 'text-ehb-textMuted'} size={20} />
                      <span className="text-white">{method}</span>
                      {i === 0 && <Check className="ml-auto text-[#D4AF37]" size={20} />}
                    </button>
                  ))}
                </div>
                {!paymentProcessing ? (
                  <button onClick={() => setPaymentProcessing(true)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <Shield size={20} /> Pay $1,575 Securely
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                    <Loader2 className="mx-auto text-[#D4AF37] animate-spin mb-3" size={32} />
                    <p className="text-white font-medium">Processing Payment...</p>
                  </motion.div>
                )}
              </DemoCard>
            )}

            {/* Step 12: Dashboard */}
            {currentStep === 12 && (
              <DemoCard key="step12" title="Case Dashboard" subtitle="EHB-CASE-2031">
                <div className="bg-emerald-500/10 rounded-xl p-4 mb-4 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-emerald-400 font-bold">Payment Successful!</p>
                    <p className="text-ehb-textMuted text-sm">Your legal case has been created</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">Case ID</span><p className="text-white font-bold">EHB-CASE-2031</p></div>
                    <div><span className="text-slate-500">Type</span><p className="text-white font-bold">Divorce Case</p></div>
                    <div><span className="text-slate-500">Lawyer</span><p className="text-white font-bold">Sarah Ahmed</p></div>
                    <div><span className="text-slate-500">Status</span><p className="text-emerald-400 font-bold">Active</p></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-ehb-textMuted text-sm font-medium mb-3">Case Timeline</p>
                  {[
                    { title: 'Case Created', time: 'Just now', done: true },
                    { title: 'Documents Uploaded', time: '2 min ago', done: true },
                    { title: 'Lawyer Assigned', time: '1 min ago', done: true },
                    { title: 'Consultation Scheduled', time: 'Pending', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <span className={item.done ? 'text-white' : 'text-slate-500'}>{item.title}</span>
                      <span className="ml-auto text-xs text-slate-500">{item.time}</span>
                    </div>
                  ))}
                </div>
              </DemoCard>
            )}

            {/* Step 13: Lawyer Chat */}
            {currentStep === 13 && (
              <DemoCard key="step13" title="Chat with Lawyer" subtitle="Sarah Ahmed">
                <div className="bg-slate-800/50 rounded-xl p-4 h-64 overflow-y-auto mb-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">👤</div>
                    <div className="bg-blue-500/10 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                      <p className="text-white text-sm">Hello, I uploaded my documents.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-sm">👩‍⚖️</div>
                    <div className="bg-[#D4AF37]/10 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                      <p className="text-white text-sm">Thank you! I've reviewed them. We can start the divorce filing process. I'll schedule a video call to discuss the next steps.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/10 rounded-xl"><Paperclip className="text-ehb-textMuted" size={20} /></button>
                  <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-500" placeholder="Type a message..." />
                  <button className="p-3 bg-[#D4AF37] rounded-xl"><Send className="text-slate-900" size={20} /></button>
                </div>
              </DemoCard>
            )}

            {/* Step 14: Global Network */}
            {currentStep === 14 && (
              <DemoCard key="step14" title="Global Legal Network" subtitle="EHB Expansion Vision">
                <div className="text-center mb-6">
                  <Globe className="mx-auto text-[#D4AF37] mb-4" size={48} />
                  <h3 className="text-white font-bold text-xl mb-2">Franchise & Global Infrastructure</h3>
                  <p className="text-ehb-textMuted text-sm">Expanding legal access worldwide</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Countries', value: '50+', icon: Globe },
                    { label: 'Lawyers', value: '25K+', icon: Users },
                    { label: 'Franchises', value: '200+', icon: Building2 },
                    { label: 'AI Agents', value: '14', icon: Bot },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                      <stat.icon className="mx-auto text-[#D4AF37] mb-2" size={24} />
                      <p className="text-white font-bold text-xl">{stat.value}</p>
                      <p className="text-slate-500 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-blue-500/20 rounded-xl p-4 border border-[#D4AF37]/30 text-center">
                  <Crown className="mx-auto text-[#D4AF37] mb-2" size={28} />
                  <p className="text-white font-bold">Demo Complete!</p>
                  <p className="text-ehb-textMuted text-sm">Experience the full platform at EHB Law</p>
                </div>
              </DemoCard>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={prevStep} disabled={currentStep === 1} className="px-6 py-3 bg-white/10 text-white rounded-xl flex items-center gap-2 disabled:opacity-30">
            <ArrowLeft size={18} /> Previous
          </button>
          <div className="text-center">
            <p className="text-[#D4AF37] font-bold">{currentStep} / 14</p>
            <p className="text-slate-500 text-xs">{DEMO_STEPS[currentStep - 1].title}</p>
          </div>
          <button onClick={nextStep} disabled={currentStep === 14} className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl flex items-center gap-2 disabled:opacity-30">
            Next <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function DemoCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-[#D4AF37]/20 to-blue-500/20 px-6 py-4 border-b border-white/10">
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <p className="text-ehb-textMuted text-sm">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
