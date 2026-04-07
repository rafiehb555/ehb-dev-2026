'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Cpu, MapPin, Clock, FileText, ShieldCheck, CheckCircle2, CreditCard, 
  Video, Users, Building, Star, Upload, Loader2, Globe, ChevronRight,
  Sparkles, Bot, Scale, Heart, Briefcase, ArrowRight, Crown, Zap, Mic
} from 'lucide-react';
import { SQLLevel, SQL_LEVELS } from '@/data/sqlLevels';

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
  sqlLevel: SQLLevel;
  photo: string;
  location: string;
  fee: string;
}

const MOCK_LAWYERS: Lawyer[] = [
  { id: '1', name: 'Ahmed Khan', specialization: 'Property Law', experience: '10 years', rating: 4.9, reviews: 156, sqlLevel: SQLLevel.HIGH, photo: '👨‍⚖️', location: 'Dubai', fee: '$200/hr' },
  { id: '2', name: 'Sara Malik', specialization: 'Family Law', experience: '12 years', rating: 5.0, reviews: 234, sqlLevel: SQLLevel.VIP, photo: '👩‍⚖️', location: 'Lahore', fee: '$175/hr' },
  { id: '3', name: 'Zainab Qureshi', specialization: 'Family Law', experience: '8 years', rating: 4.8, reviews: 89, sqlLevel: SQLLevel.HIGH, photo: '👩‍⚖️', location: 'London', fee: '$150/hr' },
  { id: '4', name: 'Bilal Ahmed', specialization: 'Business Law', experience: '15 years', rating: 4.7, reviews: 312, sqlLevel: SQLLevel.VIP, photo: '👨‍⚖️', location: 'Karachi', fee: '$225/hr' },
];

// Case Types
const CASE_TYPES = [
  { id: 'family', name: 'Family Law', icon: Heart, color: 'from-pink-500 to-rose-500', desc: 'Divorce, custody, alimony' },
  { id: 'property', name: 'Property Law', icon: Building, color: 'from-blue-500 to-cyan-500', desc: 'Disputes, transfer, registry' },
  { id: 'business', name: 'Business Law', icon: Briefcase, color: 'from-violet-500 to-purple-500', desc: 'Contracts, corporate' },
  { id: 'criminal', name: 'Criminal Law', icon: Scale, color: 'from-red-500 to-orange-500', desc: 'Defense, bail, appeals' },
];

export default function CaseCreationFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [issue, setIssue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ category: string; service: string; confidence: number } | null>(null);
  const [details, setDetails] = useState({ title: '', country: '', city: '', urgency: 'Medium' });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [consultationType, setConsultationType] = useState('Online');
  const [paymentMethod, setPaymentMethod] = useState('EHBGC');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    if (!issue.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysis({ 
        category: CASE_TYPES.find(t => t.id === selectedType)?.name || "Family Law", 
        service: "Legal Consultation",
        confidence: 94
      });
      setStep(3);
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/payment-success');
    }, 2500);
  };

  const handleFileUpload = () => {
    const newFiles = ['Marriage_Certificate.pdf', 'ID_Card.jpg', 'Property_Documents.pdf'];
    setUploadedFiles(newFiles);
  };

  const steps = [
    { num: 1, label: 'Type', icon: Scale },
    { num: 2, label: 'Describe', icon: FileText },
    { num: 3, label: 'Details', icon: MapPin },
    { num: 4, label: 'Documents', icon: Upload },
    { num: 5, label: 'Lawyer', icon: Users },
    { num: 6, label: 'Pay', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              <Zap size={16} />
              AI-Powered Case Filing
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Start Your Legal Case
            </h1>
            <p className="text-ehb-textMuted">Let AI guide you through the process</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-slate-900 shadow-lg shadow-[#D4AF37]/20' 
                      : 'bg-white/10 text-ehb-textMuted'
                  }`}>
                    {step > s.num ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
                  </div>
                  <span className={`text-xs mt-2 hidden md:block ${step >= s.num ? 'text-[#D4AF37]' : 'text-ehb-textMuted'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    step > s.num ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Case Type Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">What type of legal case?</h2>
              <p className="text-ehb-textMuted mb-8">Select the category that best describes your legal matter</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {CASE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedType === type.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                      <type.icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{type.name}</h3>
                    <p className="text-sm text-ehb-textMuted">{type.desc}</p>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setStep(2)}
                disabled={!selectedType}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Issue Description */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Describe Your Issue</h2>
                  <p className="text-ehb-textMuted">AI will analyze and classify your case</p>
                </div>
              </div>
              
              <div className="relative mb-6">
                <textarea 
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all resize-none"
                  placeholder="Describe your legal issue in detail. For example: 'My landlord is refusing to return my security deposit even though I left the apartment in perfect condition...'"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                />
                <button className="absolute bottom-4 right-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                  <Mic className="text-ehb-textMuted" size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={!issue.trim() || isAnalyzing}
                  className="flex-[2] py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Case Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              {/* AI Analysis Result */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                    <span className="text-emerald-400 font-bold">AI Analysis Complete</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                    {analysis?.confidence}% Confidence
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-ehb-textMuted mb-1">Category</p>
                    <p className="text-lg font-bold text-white">{analysis?.category}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-ehb-textMuted mb-1">Recommended Service</p>
                    <p className="text-lg font-bold text-white">{analysis?.service}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-6">Case Details</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-ehb-textMuted mb-2">CASE TITLE</label>
                  <input 
                    type="text" 
                    placeholder="Give your case a brief title"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                    value={details.title}
                    onChange={(e) => setDetails({...details, title: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ehb-textMuted mb-2">COUNTRY</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pakistan"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      value={details.country}
                      onChange={(e) => setDetails({...details, country: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ehb-textMuted mb-2">CITY</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lahore"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      value={details.city}
                      onChange={(e) => setDetails({...details, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ehb-textMuted mb-2">URGENCY</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all"
                      value={details.urgency}
                      onChange={(e) => setDetails({...details, urgency: e.target.value})}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Back</button>
                <button onClick={() => setStep(4)} className="flex-[2] py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2">
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Document Upload */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Upload className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Upload Documents</h2>
                  <p className="text-ehb-textMuted">Add supporting documents for your case</p>
                </div>
              </div>

              <div 
                onClick={handleFileUpload}
                className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-[#D4AF37]/50 transition-all cursor-pointer mb-6 bg-white/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-[#D4AF37]" size={32} />
                </div>
                <p className="text-lg font-bold text-white mb-2">Click to upload demo files</p>
                <p className="text-sm text-ehb-textMuted mb-4">or drag and drop</p>
                <p className="text-xs text-ehb-textMuted">Supports PDF, JPG, PNG, DOC (Max 10MB each)</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mb-6">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="text-[#D4AF37]" size={18} />
                        <span className="text-sm text-white">{file}</span>
                      </div>
                      <button className="text-xs text-red-400">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Back</button>
                <button onClick={() => setStep(5)} className="flex-[2] py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2">
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Lawyer Selection */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Select Your Lawyer</h2>
                    <p className="text-ehb-textMuted">AI recommended based on your case</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {MOCK_LAWYERS.map((lawyer) => (
                  <div 
                    key={lawyer.id} 
                    onClick={() => setSelectedLawyer(lawyer)}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedLawyer?.id === lawyer.id 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                        {lawyer.photo}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white">{lawyer.name}</h4>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">VERIFIED</span>
                        </div>
                        <p className="text-sm text-ehb-textMuted mb-2">{lawyer.specialization} • {lawyer.experience}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-500 fill-yellow-500" size={14} />
                            <span className="text-sm font-bold text-white">{lawyer.rating}</span>
                            <span className="text-xs text-ehb-textMuted">({lawyer.reviews})</span>
                          </div>
                          <span className="text-sm text-ehb-textMuted">📍 {lawyer.location}</span>
                          <span className="text-sm font-bold text-emerald-400">{lawyer.fee}</span>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedLawyer?.id === lawyer.id 
                          ? 'border-[#D4AF37] bg-[#D4AF37]' 
                          : 'border-slate-700'
                      }`}>
                        {selectedLawyer?.id === lawyer.id && <CheckCircle2 className="text-slate-900" size={16} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(4)} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Back</button>
                <button 
                  onClick={() => setStep(6)} 
                  disabled={!selectedLawyer}
                  className="flex-[2] py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Payment */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
                  <p className="text-ehb-textMuted">Complete your case filing</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ehb-textMuted">Consultation Fee</span>
                    <span className="text-white">$50.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ehb-textMuted">Service Retainer</span>
                    <span className="text-white">$100.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ehb-textMuted">Platform Fee</span>
                    <span className="text-white">$0.00</span>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">$150.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'EHBGC', label: 'EHBGC Coin', icon: Cpu, desc: '0% fees' },
                  { id: 'Crypto', label: 'Crypto', icon: Globe, desc: '1% fee' },
                  { id: 'Bank', label: 'Bank Transfer', icon: Building, desc: '1-3 days' },
                  { id: 'Card', label: 'Credit Card', icon: CreditCard, desc: '2.5% fee' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                      paymentMethod === method.id 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <method.icon className={paymentMethod === method.id ? 'text-[#D4AF37]' : 'text-ehb-textMuted'} size={20} />
                    <div className="text-left">
                      <span className="text-sm font-bold text-white block">{method.label}</span>
                      <span className="text-xs text-ehb-textMuted">{method.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(5)} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Back</button>
                <button 
                  onClick={handleFinalize}
                  disabled={isProcessing}
                  className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Confirm & Start Case
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-ehb-textMuted">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Verified Lawyers Only</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span className="text-xs font-bold">Global Coverage</span>
          </div>
        </div>
      </section>
    </div>
  );
}
