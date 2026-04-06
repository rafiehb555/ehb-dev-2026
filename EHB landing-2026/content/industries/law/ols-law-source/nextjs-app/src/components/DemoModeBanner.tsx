'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, X, Rocket, Info, ChevronRight } from 'lucide-react';

export default function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      {/* Fixed Banner at Top */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-16 left-0 right-0 z-40"
      >
        <div className="bg-gradient-to-r from-emerald-500/90 to-green-600/90 backdrop-blur-md border-b border-emerald-400/30 shadow-lg shadow-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between gap-4">
              {/* Main Content */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="text-white" size={16} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-white font-bold text-sm">DEMO MODE</p>
                    <p className="text-emerald-100 text-xs">All data is simulated</p>
                  </div>
                  <span className="sm:hidden text-white font-bold text-sm">DEMO MODE</span>
                </div>

                {/* Quick Links */}
                <div className="hidden md:flex items-center gap-2 ml-4">
                  <Link
                    href="/demo"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-medium transition-all"
                  >
                    <Rocket size={14} />
                    Guided Demo
                  </Link>
                  <Link
                    href="/investor-demo"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-medium transition-all"
                  >
                    <Play size={14} />
                    Investor Pitch
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-all text-white"
                  title="More info"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-all text-white"
                  title="Dismiss"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Info Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-1">What is Demo Mode?</h4>
                    <p className="text-slate-400 text-xs">All data shown is simulated for demonstration. No real transactions occur.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-1">For Investors</h4>
                    <p className="text-slate-400 text-xs">Experience the complete platform flow in 2 minutes with our guided demo.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-1">AI Features</h4>
                    <p className="text-slate-400 text-xs">AI responses are simulated. Production version uses real AI models.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-bold text-sm mb-1">Payments</h4>
                    <p className="text-slate-400 text-xs">Payment flows are simulated. No real money is processed.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href="/demo"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all"
                  >
                    <Rocket size={16} />
                    Start Guided Demo (2 min)
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/investor-demo"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all"
                  >
                    <Play size={16} />
                    Investor Presentation
                  </Link>
                  <Link
                    href="/landing"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all"
                  >
                    View Landing Page
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Demo Button (Mobile) */}
      <div className="fixed bottom-20 right-4 z-50 sm:hidden">
        <Link
          href="/demo"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-500 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-500/30 animate-bounce"
        >
          <Rocket size={18} />
          Demo
        </Link>
      </div>
    </>
  );
}
