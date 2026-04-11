'use client';

import React, { useState } from 'react';
import { 
  Shield, ShieldCheck, Award, Star, 
  CheckCircle2, ArrowUpCircle, AlertCircle, 
  ChevronRight, Lock, Play, FileText
} from 'lucide-react';
import { STLLevel, STL_LEVELS } from '@/data/stlLevels';
import { motion, AnimatePresence } from 'motion/react';

export default function STLLevelDashboard() {
  const [currentLevel, setCurrentLevel] = useState<STLLevel>(STLLevel.BASIC);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const currentInfo = STL_LEVELS[currentLevel];
  const nextLevel = getNextLevel(currentLevel);
  const nextInfo = nextLevel ? STL_LEVELS[nextLevel] : null;

  function getNextLevel(level: STLLevel): STLLevel | null {
    const levels = Object.values(STLLevel);
    const currentIndex = levels.indexOf(level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Status Card */}
      <div className="ms-card p-4 sm:p-6 bg-linear-to-br from-zinc-900 to-zinc-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-primary/10 blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center ${currentInfo.color}`}>
              <currentInfo.icon size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-2xl font-bold">STL Level: {currentLevel}</h2>
                <span className="px-2 py-0.5 bg-brand-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
              </div>
              <p className="text-zinc-400 text-[10px] sm:text-xs max-w-md">{currentInfo.description}</p>
            </div>
          </div>
          
          {nextLevel && (
            <button 
              onClick={() => setIsUpgrading(true)}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20"
            >
              Upgrade to {nextLevel} <ArrowUpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          )}
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 relative z-10">
          {currentInfo.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-zinc-300 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5 text-emerald-500" />
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Verification Progress */}
        <div className="lg:col-span-2 ms-card p-4 sm:p-6">
          <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <ShieldCheck size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
            Verification Progress
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {nextInfo ? (
              <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-bold">Next Milestone: {nextLevel}</h4>
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400">0/3 Completed</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {nextInfo.requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-2 sm:p-3 bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl border border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                          req.isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400'
                        }`}>
                          {req.isCompleted ? <CheckCircle2 size={14} className="sm:w-4 sm:h-4" /> : <Lock size={14} className="sm:w-4 sm:h-4" />}
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs font-bold">{req.label}</p>
                          <p className="text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-widest font-black">Dept: {req.department}</p>
                        </div>
                      </div>
                      {!req.isCompleted && (
                        <button className="text-[9px] sm:text-[10px] font-bold text-brand-primary flex items-center gap-1 hover:underline">
                          Start <Play size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <Star size={40} className="sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                <h4 className="font-bold text-base sm:text-lg mb-2">You are at the Top!</h4>
                <p className="text-zinc-500 text-xs sm:text-sm">You have reached the VIP STL Level.</p>
              </div>
            )}
          </div>
        </div>

        {/* STL Level Map */}
        <div className="ms-card p-4 sm:p-6">
          <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
            <Award size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
            STL Level Roadmap
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {Object.values(STL_LEVELS).map((lvl) => {
              const isCurrent = lvl.level === currentLevel;
              const isLocked = lvl.rank > currentInfo.rank;
              
              return (
                <div 
                  key={lvl.level} 
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'border-brand-primary bg-brand-primary/5' 
                      : isLocked 
                        ? 'border-black/5 dark:border-white/5 opacity-50' 
                        : 'border-emerald-500/20 bg-emerald-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${lvl.color} bg-white dark:bg-zinc-800 shadow-sm`}>
                        <lvl.icon size={14} className="sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold">{lvl.level}</span>
                    </div>
                    {isCurrent && <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-brand-primary">Current</span>}
                    {!isLocked && !isCurrent && <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-emerald-500" />}
                    {isLocked && <Lock size={12} className="sm:w-3.5 sm:h-3.5 text-zinc-400" />}
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed">{lvl.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {isUpgrading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-base sm:text-lg">Apply for STL Upgrade</h3>
                <button onClick={() => setIsUpgrading(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${currentInfo.color}`}>
                      <currentInfo.icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="font-bold text-sm sm:text-base">{currentLevel}</span>
                  </div>
                  <ChevronRight size={20} className="sm:w-6 sm:h-6 text-zinc-300" />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-brand-primary/10 flex items-center justify-center ${nextInfo?.color}`}>
                      {nextInfo && <nextInfo.icon size={20} className="sm:w-6 sm:h-6" />}
                    </div>
                    <span className="font-bold text-sm sm:text-base">{nextLevel}</span>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4">Required Verification Steps</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {nextInfo?.requirements.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <FileText size={16} className="sm:w-5 sm:h-5" />
                          </div>
                          <div className="grow">
                            <p className="text-xs sm:text-sm font-bold">{req.label}</p>
                            <p className="text-[9px] sm:text-[10px] text-zinc-500">Managed by {req.department} Department</p>
                          </div>
                          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-primary text-white rounded-lg text-[10px] sm:text-xs font-bold">Start</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl sm:rounded-2xl flex gap-2 sm:gap-3">
                    <AlertCircle className="text-blue-500 shrink-0" size={18} />
                    <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      Upgrading to {nextLevel} requires professional verification. Our team will review your application within 48 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-black/5 dark:border-white/5 flex justify-end gap-2 sm:gap-3">
                <button onClick={() => setIsUpgrading(false)} className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-zinc-500">Cancel</button>
                <button className="px-4 sm:px-6 py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-brand-primary/20">Submit Application</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
