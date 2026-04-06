'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Sparkles, Search, Cpu, Mic, Image, FileText, X, Volume2, Loader2 } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
];

const SECONDARY_IMAGES = [
  "https://images.unsplash.com/photo-1473186578172-c141e6798ee4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1589216532372-1c2a367900d9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
];

const CORPORATE_IMAGES = [
  "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
];

export default function MicrosoftStoreHero() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(0);
  const [corporateIndex, setCorporateIndex] = useState(0);
  const [mainSearch, setMainSearch] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiDetectionResult, setAiDetectionResult] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleAIDetection = async () => {
    if (!aiInput.trim()) return;
    setAiDetectionResult({ category: 'Analyzing...', service: 'Please wait...' });
    
    // Simulate AI detection
    setTimeout(() => {
      setAiDetectionResult({ 
        category: 'Family Law', 
        service: 'Legal Consultation' 
      });
    }, 1000);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please try Chrome or Edge.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setShowVoiceOverlay(true);
      setVoiceTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setVoiceTranscript(transcript);
      setMainSearch(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      setShowVoiceOverlay(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (voiceTranscript) {
        setAiResponse("I understood: " + voiceTranscript);
        setTimeout(() => {
          setShowVoiceOverlay(false);
          router.push('/marketplace');
        }, 2000);
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    const mainTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    
    const secondaryTimer = setInterval(() => {
      setSecondaryIndex((prev) => (prev + 1) % SECONDARY_IMAGES.length);
    }, 4000);

    const corporateTimer = setInterval(() => {
      setCorporateIndex((prev) => (prev + 1) % CORPORATE_IMAGES.length);
    }, 6000);

    return () => {
      clearInterval(mainTimer);
      clearInterval(secondaryTimer);
      clearInterval(corporateTimer);
    };
  }, []);

  return (
    <section className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Search & AI Detection Bar */}
      <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch">
        {/* Main Search Bar */}
        <div className="flex-[2] relative group">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-5 flex items-center pointer-events-none">
            <Search className="text-slate-500 group-focus-within:text-brand-primary transition-colors w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          
          <input 
            type="text" 
            placeholder="Search legal services, lawyers..."
            className="w-full h-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-32 sm:pr-48 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white/10 transition-all text-white placeholder:text-slate-500 shadow-xl"
            value={mainSearch}
            onChange={(e) => setMainSearch(e.target.value)}
          />

          {/* Action Icons */}
          <div className="absolute inset-y-0 right-20 sm:right-24 flex items-center gap-1 sm:gap-2">
            <button 
              onClick={handleVoiceSearch}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-white/10'}`}
              title="AI Voice Search"
            >
              <Mic size={14} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="p-1.5 sm:p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
              title="Upload Image"
            >
              <Image size={14} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => docInputRef.current?.click()}
              className="p-1.5 sm:p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
              title="Upload Document"
            >
              <FileText size={14} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" />
            <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" />
          </div>

          {/* AI FIND Button */}
          <button 
            onClick={() => router.push('/marketplace')}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-1 sm:gap-2"
          >
            <span className="hidden xs:inline">AI</span> FIND <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* AI Detection Card */}
        <div className="flex-1 lg:max-w-md relative group overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-1">
          <div className="flex h-full">
            <div className="grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Cpu className="text-brand-primary w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <input 
                type="text" 
                placeholder="AI: Describe your issue..."
                className="w-full h-full bg-transparent border-none rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-[11px] sm:text-xs outline-none focus:ring-2 focus:ring-brand-primary transition-all text-white placeholder:text-slate-500"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIDetection()}
              />
            </div>
            <button 
              onClick={handleAIDetection}
              className="bg-brand-primary text-white px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-brand-primary/90 transition-all m-1"
            >
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Detection Result */}
      <AnimatePresence>
        {aiDetectionResult && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 backdrop-blur-md"
          >
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div>
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-primary">Category</p>
                <p className="text-xs sm:text-sm font-bold text-white">{aiDetectionResult.category}</p>
              </div>
              <div>
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-primary">Service</p>
                <p className="text-xs sm:text-sm font-bold text-white">{aiDetectionResult.service}</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/ai-assistant')}
              className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs hover:bg-white/90 transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              Ask AI Assistant <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-h-[450px] sm:min-h-[500px] lg:min-h-[400px] xl:min-h-[500px]">
        {/* Main Large Hero Card */}
        <div className="lg:col-span-2 relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl min-h-[280px] sm:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_IMAGES[currentIndex]} 
                alt="Legal Services" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-10 lg:left-10 lg:right-10 z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="bg-brand-primary text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Featured Service</span>
                <span className="text-white/60 text-[10px] sm:text-xs">Updated Today</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 font-display leading-tight">
                Premium Legal Solutions <br className="hidden sm:block" /> For Your Global Needs
              </h1>
              <p className="text-white/70 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8 max-w-xl">
                Connect with verified legal experts worldwide. From corporate law to family disputes.
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button 
                  onClick={() => router.push('/marketplace')}
                  className="bg-white text-black px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-white/90 transition-colors flex items-center gap-2 text-xs sm:text-sm lg:text-base"
                >
                  Explore Now <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-white/20 transition-colors text-xs sm:text-sm lg:text-base">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 sm:h-1.5 rounded-full transition-all ${currentIndex === idx ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="grid grid-rows-2 gap-3 sm:gap-4">
          {/* Top Right Card */}
          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={secondaryIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img 
                  src={SECONDARY_IMAGES[secondaryIndex]} 
                  alt="Family Law" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">Family Law Experts</h3>
              <p className="text-white/60 text-[10px] sm:text-xs mb-2 sm:mb-3">Compassionate support for your family.</p>
              <button 
                onClick={() => router.push('/family-court')}
                className="text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Details <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Right Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-[#1e293b] min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={corporateIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={CORPORATE_IMAGES[corporateIndex]} 
                    alt="Corporate" 
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 z-10">
                <h4 className="text-xs sm:text-sm font-bold text-white">Corporate Law</h4>
                <p className="text-[8px] sm:text-[10px] text-white/50">Business growth support</p>
              </div>
            </div>
            <div 
              onClick={() => router.push('/ai-assistant')}
              className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-brand-primary cursor-pointer hover:scale-[1.02] transition-transform min-h-[120px]"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                  <Sparkles className="text-white" size={16} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">AI Assistant</h4>
                <p className="text-[8px] sm:text-[10px] text-white/70">Instant legal help 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Interaction Overlay */}
      <AnimatePresence>
        {showVoiceOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center"
          >
            <button 
              onClick={() => setShowVoiceOverlay(false)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            <div className="max-w-2xl w-full space-y-8 sm:space-y-12">
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: isListening ? [1, 1.2, 1] : 1,
                      opacity: isListening ? [0.5, 1, 0.5] : 0.5
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-brand-primary/20 absolute -inset-4 blur-2xl"
                  />
                  <div className={`w-28 h-28 sm:w-40 sm:h-40 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                    isListening ? 'border-brand-primary' : 'border-slate-800'
                  }`}>
                    {isProcessing ? (
                      <Loader2 size={48} className="sm:w-16 sm:h-16 text-brand-primary animate-spin" />
                    ) : (
                      <Mic size={48} className={`sm:w-16 sm:h-16 ${isListening ? 'text-brand-primary' : 'text-slate-600'}`} />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="min-h-[40px] sm:min-h-[60px]">
                  <p className="text-lg sm:text-2xl font-medium text-white italic">
                    {voiceTranscript || (isListening ? "I'm listening..." : "")}
                  </p>
                </div>

                {aiResponse && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 sm:p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 text-left"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-brand-primary">
                      {aiResponse}
                    </p>
                  </motion.div>
                )}
              </div>

              {!isProcessing && isListening && (
                <button 
                  onClick={stopListening}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl font-bold hover:bg-white/90 transition-all text-sm sm:text-base"
                >
                  Done Speaking
                </button>
              )}
            </div>
            
            <div className="absolute bottom-8 sm:bottom-12 flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
              <Volume2 size={14} className="sm:w-4 sm:h-4" />
              <span>AI will confirm and open the service for you</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
