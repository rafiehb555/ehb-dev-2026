'use client';

import React, { useState } from 'react';
import { 
  Search, FileText, 
  Zap, Scale, TrendingUp, AlertCircle, CheckCircle2,
  FileSearch, Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LegalResearchEngine() {
  const [activeTool, setActiveTool] = useState<'search' | 'analysis' | 'review' | 'strategy'>('search');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const tools = [
    { id: 'search', label: 'Legal Search', icon: FileSearch, desc: 'AI-powered search across global laws and cases.' },
    { id: 'analysis', label: 'Case Analysis', icon: Binary, desc: 'Deep analysis of case details and success probability.' },
    { id: 'review', label: 'Document Review', icon: FileText, desc: 'AI audit for contracts, notices, and agreements.' },
    { id: 'strategy', label: 'Legal Strategy', icon: TrendingUp, desc: 'AI-suggested legal actions and strategies.' },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        category: 'Property Law',
        action: 'Eviction Notice',
        probability: 72,
        timeline: '4 months',
        risks: ['Tenant might claim repair issues', 'Local court backlog'],
        suggestions: ['Send formal legal notice first', 'Document all missed payments']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Sidebar Tools */}
        <div className="lg:w-64 space-y-2">
          <h2 className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-3 sm:mb-4 px-3 sm:px-4">Research Tools</h2>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTool === tool.id 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <tool.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              {tool.label}
            </button>
          ))}
          
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-brand-primary mb-2">
              <Zap size={14} className="sm:w-4 sm:h-4" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">AI Status</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">
              Research engine is connected to EHB Global Knowledge Base v2.4
            </p>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grow">
          <div className="ms-card p-4 sm:p-6 lg:p-8 min-h-[500px] sm:min-h-[600px] flex flex-col">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">
                {tools.find(t => t.id === activeTool)?.label}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {tools.find(t => t.id === activeTool)?.desc}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {activeTool === 'search' && (
                <motion.div 
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search legal topics, court cases, or regulations..."
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 text-white text-xs sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-slate-800 rounded-xl sm:rounded-2xl hover:border-brand-primary/30 transition-all cursor-pointer bg-slate-900/50">
                      <h4 className="text-[10px] sm:text-xs font-bold mb-1 text-white">Recent Searches</h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">Property law Pakistan eviction process</p>
                    </div>
                    <div className="p-3 sm:p-4 border border-slate-800 rounded-xl sm:rounded-2xl hover:border-brand-primary/30 transition-all cursor-pointer bg-slate-900/50">
                      <h4 className="text-[10px] sm:text-xs font-bold mb-1 text-white">Trending Topics</h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">New crypto regulations UAE 2026</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTool === 'analysis' && (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <textarea 
                    placeholder="Describe your legal case in detail (e.g. 'My tenant is not paying rent for 3 months and refusing to leave')..."
                    className="w-full h-32 sm:h-40 p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none text-xs sm:text-sm text-white"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-3 sm:py-4 bg-brand-primary text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <Binary className="animate-spin" size={18} />
                        AI Analyzing Case...
                      </>
                    ) : (
                      <>
                        <Binary size={18} />
                        Start AI Case Analysis
                      </>
                    )}
                  </button>

                  {analysisResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8"
                    >
                      <div className="p-4 sm:p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl sm:rounded-3xl">
                        <div className="flex items-center gap-2 text-brand-primary mb-3 sm:mb-4">
                          <Scale size={18} className="sm:w-5 sm:h-5" />
                          <h4 className="font-bold text-sm sm:text-base">Case Classification</h4>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Category</p>
                            <p className="text-xs sm:text-sm font-bold text-white">{analysisResult.category}</p>
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Recommended Action</p>
                            <p className="text-xs sm:text-sm font-bold text-white">{analysisResult.action}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl sm:rounded-3xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-3 sm:mb-4">
                          <TrendingUp size={18} className="sm:w-5 sm:h-5" />
                          <h4 className="font-bold text-sm sm:text-base">AI Prediction</h4>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Success Probability</p>
                              <p className="text-xl sm:text-2xl font-bold text-emerald-400">{analysisResult.probability}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Timeline</p>
                              <p className="text-xs sm:text-sm font-bold text-white">{analysisResult.timeline}</p>
                            </div>
                          </div>
                          <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${analysisResult.probability}%` }}
                              className="h-full bg-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800">
                        <h4 className="font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white text-sm sm:text-base">
                          <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] text-orange-500" />
                          Risk Factors & Suggestions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Potential Risks</p>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {analysisResult.risks.map((risk: string, i: number) => (
                                <li key={i} className="text-[10px] sm:text-xs flex items-center gap-2 text-slate-400">
                                  <div className="w-1 h-1 bg-rose-500 rounded-full shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">AI Strategy Suggestions</p>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {analysisResult.suggestions.map((s: string, i: number) => (
                                <li key={i} className="text-[10px] sm:text-xs flex items-center gap-2 text-slate-400">
                                  <CheckCircle2 size={10} className="sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTool === 'review' && (
                <motion.div 
                  key="review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary/10 text-brand-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                    <FileSearch size={32} className="sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">AI Document Auditor</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 sm:mb-8 px-4">
                    Upload your legal documents (PDF, DOCX) for a comprehensive AI audit. We detect missing clauses, legal risks, and potential issues.
                  </p>
                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white border border-slate-800 rounded-xl sm:rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all text-xs sm:text-sm">
                    <FileText size={18} className="sm:w-5 sm:h-5" />
                    Upload Document for Review
                  </button>
                </motion.div>
              )}

              {activeTool === 'strategy' && (
                <motion.div 
                  key="strategy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary/10 text-brand-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                    <TrendingUp size={32} className="sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">AI Legal Strategy</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 sm:mb-8 px-4">
                    Get AI-powered strategy recommendations based on your case details and historical outcomes.
                  </p>
                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-primary text-white rounded-xl sm:rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 text-xs sm:text-sm">
                    <Zap size={18} className="sm:w-5 sm:h-5" />
                    Generate Legal Strategy
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
