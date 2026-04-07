'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  CheckCircle2, FileText, MessageSquare, Calendar, Download, Share2,
  ArrowRight, Scale, Clock, MapPin, Star, Shield, Copy, ExternalLink,
  Sparkles, Bell, User, Video
} from 'lucide-react';

export default function PaymentSuccessPage() {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const caseId = 'EHB-CASE-' + Math.floor(Math.random() * 9000 + 1000);

  const handleCopy = () => {
    navigator.clipboard.writeText(caseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617] py-12 px-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: -20, 
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                top: '100%',
                opacity: 0,
                rotate: Math.random() * 720 - 360
              }}
              transition={{ 
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: ['#D4AF37', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-b border-emerald-500/30 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="text-white" size={40} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
              <p className="text-emerald-400">Your legal case has been created</p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Case ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-ehb-textMuted text-sm">Case ID</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[#D4AF37] text-sm hover:text-yellow-400 transition-colors"
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-2xl font-mono font-bold text-white">{caseId}</p>
            </motion.div>

            {/* Case Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-8"
            >
              <h3 className="text-sm font-bold text-ehb-textMuted uppercase tracking-wider">Case Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Case Type</p>
                  <p className="text-white font-bold">Family Law - Divorce</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <p className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Active
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                  <p className="text-[#D4AF37] font-bold">$150.00</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                  <p className="text-white font-bold">Credit Card</p>
                </div>
              </div>
            </motion.div>

            {/* Assigned Lawyer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-6 mb-8"
            >
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4">Assigned Lawyer</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                  👩‍⚖️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-lg">Sarah Ahmed</h4>
                    <CheckCircle2 className="text-blue-400" size={16} />
                  </div>
                  <p className="text-ehb-textMuted text-sm">Family Law Specialist • 12 yrs experience</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-white text-sm font-bold">4.9</span>
                    <span className="text-slate-500 text-sm">(156 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Link href="/lawyer/lawyer-1" className="flex-1 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg text-center hover:bg-white/20 transition-all">
                  View Profile
                </Link>
                <button className="flex-1 py-2.5 bg-[#D4AF37] text-slate-900 text-sm font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={16} />
                  Message
                </button>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h3 className="text-sm font-bold text-ehb-textMuted uppercase tracking-wider mb-4">What's Next?</h3>
              <div className="space-y-3">
                {[
                  { icon: Bell, title: 'Lawyer will contact you within 24 hours', done: false },
                  { icon: Calendar, title: 'Schedule your first consultation', done: false },
                  { icon: FileText, title: 'Upload additional documents if needed', done: false },
                  { icon: Video, title: 'Join video call for case discussion', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <step.icon className="text-blue-400" size={18} />
                    </div>
                    <span className="text-white text-sm">{step.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Link
                href="/dashboard"
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
              >
                Go to Case Dashboard
                <ArrowRight size={20} />
              </Link>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download Receipt
                </button>
                <button className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span className="text-xs font-bold">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={16} />
            <span className="text-xs font-bold">Escrow Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Verified Lawyer</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
