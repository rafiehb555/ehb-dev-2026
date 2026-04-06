'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, ShieldCheck, History, Coins, CreditCard, Landmark, Zap, Lock, 
  CheckCircle2, ArrowRight, TrendingUp, Globe, Send, Download,
  ArrowUpRight, ArrowDownRight, Crown, Sparkles, Eye, EyeOff, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Payment Methods
const PAYMENT_METHODS = [
  { id: 'ehbgc', label: 'EHBGC Coin', icon: Coins, desc: 'Native platform coin • 0% fees', color: 'from-[#D4AF37] to-[#B8860B]' },
  { id: 'crypto', label: 'Crypto (USDT/BTC)', icon: Zap, desc: 'Fast blockchain • 1% fee', color: 'from-violet-500 to-purple-500' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Instant payment • 2.5% fee', color: 'from-blue-500 to-cyan-500' },
  { id: 'bank', label: 'Bank Transfer', icon: Landmark, desc: 'Wire transfer • 1-3 days', color: 'from-emerald-500 to-green-500' },
];

// Transactions
const TRANSACTIONS = [
  { id: 'tx1', type: 'Service Payment', desc: 'Divorce Case Filing', amount: -450, status: 'completed', date: 'Mar 10, 2026', method: 'EHBGC', icon: ArrowUpRight },
  { id: 'tx2', type: 'Escrow Release', desc: 'Case #EHB-2026-001', amount: 1200, status: 'completed', date: 'Mar 08, 2026', method: 'Crypto', icon: ArrowDownRight },
  { id: 'tx3', type: 'Staking Reward', desc: 'Monthly reward', amount: 25, status: 'pending', date: 'Mar 07, 2026', method: 'EHBGC', icon: TrendingUp },
  { id: 'tx4', type: 'Lawyer Payment', desc: 'Adv. Ahmed Khan', amount: -300, status: 'completed', date: 'Mar 05, 2026', method: 'Card', icon: ArrowUpRight },
  { id: 'tx5', type: 'Wallet Top-up', desc: 'Bank Transfer', amount: 2000, status: 'completed', date: 'Mar 01, 2026', method: 'Bank', icon: ArrowDownRight },
];

// Stats
const WALLET_STATS = [
  { label: 'Total Balance', value: '$12,450', change: '+12.5%', icon: Wallet, color: 'from-[#D4AF37] to-[#B8860B]' },
  { label: 'EHBGC Staked', value: '5,000', suffix: 'EHBGC', change: '+25 this month', icon: Coins, color: 'from-violet-500 to-purple-500' },
  { label: 'In Escrow', value: '$3,200', change: '2 active', icon: Lock, color: 'from-orange-500 to-amber-500' },
  { label: 'This Month', value: '$2,450', change: 'Spent', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'escrow' | 'history'>('wallet');
  const [selectedMethod, setSelectedMethod] = useState('ehbgc');
  const [showBalance, setShowBalance] = useState(true);
  const [amount, setAmount] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-4">
                <Crown size={16} />
                Secure Payments
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payment & Wallet
                <span className="block text-[#D4AF37]">Center</span>
              </h1>
              <p className="text-slate-400">Manage your funds, escrow, and transaction history</p>
            </div>
            
            <div className="hidden md:flex gap-3">
              <button className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                <Download size={18} />
                Statement
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2">
                <Send size={18} />
                Send Funds
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WALLET_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.suffix && <span className="text-xs text-slate-400">{stat.suffix}</span>}
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-xs text-emerald-400 mt-1">{stat.change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl w-fit">
              {[
                { id: 'wallet', label: 'Wallet', icon: Wallet },
                { id: 'escrow', label: 'Escrow', icon: Lock },
                { id: 'history', label: 'History', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-[#D4AF37] text-slate-900' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Wallet Tab */}
              {activeTab === 'wallet' && (
                <motion.div 
                  key="wallet"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Balance Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Available Balance</p>
                          <div className="flex items-center gap-3">
                            <p className="text-4xl font-bold text-white">
                              {showBalance ? '$12,450.00' : '••••••'}
                            </p>
                            <button 
                              onClick={() => setShowBalance(!showBalance)}
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                            >
                              {showBalance ? <EyeOff className="text-slate-400" size={18} /> : <Eye className="text-slate-400" size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                          <CheckCircle2 size={14} />
                          Verified
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2">
                          <ArrowDownRight size={18} />
                          Add Funds
                        </button>
                        <button className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                          <ArrowUpRight size={18} />
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedMethod === method.id
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-3`}>
                            <method.icon className="text-white" size={20} />
                          </div>
                          <h4 className="text-white font-medium mb-1">{method.label}</h4>
                          <p className="text-xs text-slate-500">{method.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Pay */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Pay</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 mb-2">AMOUNT</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-[#D4AF37] transition-all"
                          />
                        </div>
                      </div>
                      <button className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all self-end">
                        Pay Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Escrow Tab */}
              {activeTab === 'escrow' && (
                <motion.div 
                  key="escrow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Active Escrow */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                          <Lock className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Active Escrow</h3>
                          <p className="text-sm text-slate-400">Case #EHB-2026-001</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">Protected</span>
                    </div>
                    
                    <p className="text-3xl font-bold text-orange-400 mb-4">$3,200.00</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Milestone Progress</span>
                        <span className="text-orange-400">60%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-500">Funds will be released when the case milestone is completed.</p>
                  </div>

                  {/* Escrow Info */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">How Escrow Works</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Deposit Funds', desc: 'Securely deposit payment into escrow' },
                        { step: 2, title: 'Work Begins', desc: 'Lawyer starts working on your case' },
                        { step: 3, title: 'Milestone Complete', desc: 'Work milestone is verified' },
                        { step: 4, title: 'Funds Released', desc: 'Payment released to lawyer' },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-sm font-bold shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{item.title}</h4>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Transaction History</h3>
                    <button className="text-sm text-[#D4AF37] hover:underline">Export CSV</button>
                  </div>
                  
                  <div className="space-y-3">
                    {TRANSACTIONS.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-slate-800'
                          }`}>
                            <tx.icon className={tx.amount > 0 ? 'text-emerald-400' : 'text-slate-400'} size={18} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{tx.type}</p>
                            <p className="text-xs text-slate-500">{tx.desc} • {tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                          </p>
                          <p className={`text-xs font-medium ${
                            tx.status === 'completed' ? 'text-emerald-400' : 'text-orange-400'
                          }`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Status */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="text-[#D4AF37]" size={20} />
                Security Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: '2FA Enabled', status: true },
                  { label: 'Email Verified', status: true },
                  { label: 'Phone Verified', status: true },
                  { label: 'Biometric Lock', status: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className={`text-xs font-bold ${item.status ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {item.status ? '✓ Active' : 'Off'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* EHBGC Card */}
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Coins className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold">EHBGC Staking</h3>
                  <p className="text-xs text-slate-400">Earn up to 12% APY</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-white mb-1">5,000 EHBGC</p>
                <p className="text-xs text-emerald-400">+25 rewards this month</p>
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all">
                Stake More
              </button>
            </div>

            {/* Wallet Address */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-3">Your Wallet Address</h3>
              <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl">
                <p className="text-xs text-slate-400 font-mono flex-1 truncate">0x7a2E...8b3F</p>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                  <Copy className="text-slate-400" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
