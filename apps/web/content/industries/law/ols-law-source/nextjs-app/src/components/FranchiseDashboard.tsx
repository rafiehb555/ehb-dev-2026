'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, Users, Briefcase, DollarSign,
  Clock, TrendingUp, Plus, Search, Filter, MoreVertical,
  ShieldCheck, LayoutDashboard, Settings,
  BarChart3, MessageSquare, Newspaper,
  PlusCircle, X, Check, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MOCK_FRANCHISES, 
  PENDING_LAWYERS, SERVICE_REQUESTS, 
  RECENT_CASES, FranchiseInfo 
} from '@/data/franchiseData';

export default function FranchiseDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'lawyers' | 'services' | 'cases' | 'earnings'>('overview');
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseInfo>(MOCK_FRANCHISES[3]);
  const [isAddingService, setIsAddingService] = useState(false);

  const stats = selectedFranchise.stats;

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header & Hierarchy Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2">
            <Globe size={12} className="sm:w-3.5 sm:h-3.5" /> {selectedFranchise.level} Franchise
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1 text-white">{selectedFranchise.name}</h1>
          <p className="text-zinc-500 text-xs sm:text-sm">Managing {selectedFranchise.region} • Manager: {selectedFranchise.manager}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
          <select 
            className="bg-slate-900 border border-slate-800 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
            onChange={(e) => {
              const f = MOCK_FRANCHISES.find(f => f.id === e.target.value);
              if (f) setSelectedFranchise(f);
            }}
            value={selectedFranchise.id}
          >
            {MOCK_FRANCHISES.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button className="bg-brand-primary text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> Apply for Expansion
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 overflow-x-auto no-scrollbar border border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'lawyers', label: 'Lawyers', icon: Users },
          { id: 'services', label: 'Services', icon: Settings },
          { id: 'cases', label: 'Cases', icon: Briefcase },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-brand-primary shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon size={14} className="sm:w-[18px] sm:h-[18px]" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Lawyers', value: stats.totalLawyers, icon: Users, color: 'text-blue-500', trend: '+12%' },
                  { label: 'Active Cases', value: stats.activeCases, icon: Briefcase, color: 'text-orange-500', trend: '+5%' },
                  { label: 'Total Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-emerald-500', trend: '+18%' },
                  { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-brand-primary', trend: '+2%' },
                ].map((stat, idx) => (
                  <div key={idx} className="ms-card p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 flex items-center justify-center">
                        <stat.icon size={16} className={`sm:w-5 sm:h-5 ${stat.color}`} />
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 sm:mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity & Requests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="ms-card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-white text-sm sm:text-base">
                      <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
                      Recent Cases
                    </h3>
                    <button className="text-[10px] sm:text-xs font-bold text-brand-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {RECENT_CASES.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-900 rounded-lg sm:rounded-xl">
                        <div>
                          <p className="text-[10px] sm:text-xs font-bold mb-0.5 text-white">{c.title}</p>
                          <p className="text-[8px] sm:text-[10px] text-zinc-500">Lawyer: {c.lawyer}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                            c.status === 'Completed' ? 'text-emerald-500' : c.status === 'Dispute' ? 'text-rose-500' : 'text-blue-500'
                          }`}>{c.status}</p>
                          <p className="text-[10px] sm:text-xs font-bold text-white">${c.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ms-card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-white text-sm sm:text-base">
                      <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
                      Service Requests
                    </h3>
                    <span className="text-[8px] sm:text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">2 NEW</span>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {SERVICE_REQUESTS.map((req) => (
                      <div key={req.id} className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800">
                        <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <p className="text-[10px] sm:text-xs font-bold text-white">{req.user}</p>
                          <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-widest text-zinc-400">Request</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-zinc-500 mb-3 sm:mb-4 leading-relaxed">&quot;{req.request}&quot;</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 bg-brand-primary text-white rounded-lg text-[9px] sm:text-[10px] font-bold">Approve</button>
                          <button className="flex-1 py-1.5 bg-zinc-800 rounded-lg text-[9px] sm:text-[10px] font-bold text-white">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'lawyers' && (
            <div className="ms-card overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h3 className="font-bold text-white text-sm sm:text-base">Lawyer Onboarding & Management</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search lawyers..." 
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
                    />
                  </div>
                  <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl text-zinc-400">
                    <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 sm:mb-4">Pending Approvals</h4>
                <div className="space-y-3 sm:space-y-4">
                  {PENDING_LAWYERS.map((lawyer) => (
                    <div key={lawyer.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-base sm:text-lg text-white">
                          {lawyer.name[0]}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white">{lawyer.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-zinc-500">{lawyer.specialization} • {lawyer.experience}</p>
                          <p className="text-[7px] sm:text-[8px] text-zinc-400 mt-0.5 sm:mt-1 uppercase tracking-widest">Applied: {lawyer.appliedDate}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-2">
                          <Check size={12} className="sm:w-3.5 sm:h-3.5" /> Approve
                        </button>
                        <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-2">
                          <X size={12} className="sm:w-3.5 sm:h-3.5" /> Reject
                        </button>
                        <button className="p-1.5 sm:p-2 bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl text-zinc-400">
                          <MoreVertical size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-sm sm:text-base">Regional Service Management</h3>
                <button 
                  onClick={() => setIsAddingService(true)}
                  className="bg-brand-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" /> Add New Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { title: 'Drone Law Consultation', category: 'Technology', status: 'Active', cases: 24 },
                  { title: 'Crypto Asset Recovery', category: 'Finance', status: 'Active', cases: 42 },
                  { title: 'AI Copyright Audit', category: 'IP Law', status: 'Pending Approval', cases: 0 },
                  { title: 'E-Commerce Compliance', category: 'Business', status: 'Active', cases: 156 },
                ].map((service, idx) => (
                  <div key={idx} className="ms-card p-4 sm:p-6 flex justify-between items-start">
                    <div>
                      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full mb-1.5 sm:mb-2 inline-block">
                        {service.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 text-white">{service.title}</h4>
                      <p className="text-[9px] sm:text-[10px] text-zinc-500">{service.cases} cases managed locally</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full ${
                        service.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {service.status}
                      </span>
                      <div className="mt-3 sm:mt-4 flex gap-2">
                        <button className="text-[9px] sm:text-[10px] font-bold text-zinc-400 hover:text-brand-primary">Edit</button>
                        <button className="text-[9px] sm:text-[10px] font-bold text-rose-500">Disable</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="ms-card p-4 sm:p-6 bg-emerald-500 text-white">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Monthly Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold">$12,450.00</p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[9px] sm:text-[10px] font-bold">Payout Status</span>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full">Processing</span>
                  </div>
                </div>
                <div className="ms-card p-4 sm:p-6">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Franchise Commission (10%)</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-500">$1,245.00</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-1 sm:mt-2">Earned from 240 active cases</p>
                </div>
                <div className="ms-card p-4 sm:p-6">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Platform Share (5%)</p>
                  <p className="text-2xl sm:text-3xl font-bold text-zinc-400">$622.50</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-1 sm:mt-2">Global infrastructure fee</p>
                </div>
              </div>

              <div className="ms-card p-4 sm:p-6">
                <h3 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">Revenue Distribution Model</h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { label: 'Lawyer Fee', percentage: 85, color: 'bg-emerald-500' },
                    { label: 'Franchise Commission', percentage: 10, color: 'bg-brand-primary' },
                    { label: 'Platform Share', percentage: 5, color: 'bg-zinc-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold text-white">
                        <span>{item.label}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="ms-card p-4 sm:p-6">
              <h3 className="font-bold mb-4 sm:mb-6 text-white text-sm sm:text-base">All Cases</h3>
              <div className="space-y-3 sm:space-y-4">
                {RECENT_CASES.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div>
                      <p className="text-xs sm:text-sm font-bold mb-0.5 text-white">{c.title}</p>
                      <p className="text-[9px] sm:text-[10px] text-zinc-500">Lawyer: {c.lawyer}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                        c.status === 'Completed' ? 'text-emerald-500' : c.status === 'Dispute' ? 'text-rose-500' : 'text-blue-500'
                      }`}>{c.status}</p>
                      <p className="text-xs sm:text-sm font-bold text-white">${c.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Quick Tools */}
        <div className="space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <Newspaper size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Legal Articles
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { title: 'New Crypto Law Update', date: 'Mar 10', views: 1205 },
                { title: 'AI Regulation Guide', date: 'Mar 08', views: 840 },
              ].map((article, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <p className="text-[10px] sm:text-xs font-bold group-hover:text-brand-primary transition-colors mb-0.5 sm:mb-1 text-white">{article.title}</p>
                  <div className="flex justify-between text-[8px] sm:text-[10px] text-zinc-500">
                    <span>{article.date}</span>
                    <span>{article.views} views</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 mt-1 sm:mt-2 border-2 border-dashed border-zinc-700 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold text-zinc-400 hover:border-brand-primary hover:text-brand-primary transition-all">
                + Publish New Article
              </button>
              <button 
                onClick={() => router.push('/knowledge-base')}
                className="w-full py-2 mt-1 sm:mt-2 bg-zinc-800 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold text-zinc-400 hover:bg-brand-primary hover:text-white transition-all"
              >
                View Knowledge Base
              </button>
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Performance
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2.5 sm:p-3 bg-zinc-800/50 rounded-lg sm:rounded-xl">
                <p className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 sm:mb-2">Case Success Rate</p>
                <div className="flex items-end gap-2">
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.successRate}%</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-500 font-bold mb-0.5 sm:mb-1">Excellent</span>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 bg-zinc-800/50 rounded-lg sm:rounded-xl">
                <p className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 sm:mb-2">Lawyer Satisfaction</p>
                <div className="flex items-end gap-2">
                  <p className="text-xl sm:text-2xl font-bold text-white">4.8</p>
                  <span className="text-[8px] sm:text-[10px] text-emerald-500 font-bold mb-0.5 sm:mb-1">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6 bg-zinc-900 text-white relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-brand-primary/20 blur-3xl" />
            <ShieldCheck className="text-brand-primary mb-3 sm:mb-4" size={28} />
            <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Franchise Governance</h4>
            <p className="text-[9px] sm:text-[10px] text-zinc-400 mb-3 sm:mb-4 leading-relaxed">Ensure all lawyers follow EHB&apos;s global standards.</p>
            <button className="text-[9px] sm:text-[10px] font-bold text-brand-primary flex items-center gap-1">View Policies <ArrowUpRight size={10} className="sm:w-3 sm:h-3" /></button>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-800"
            >
              <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-base sm:text-lg text-white">Add New Legal Service</h3>
                <button onClick={() => setIsAddingService(false)} className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg sm:rounded-xl transition-colors">
                  <X size={18} className="sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 sm:mb-2">Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Drone Law Consultation" 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 sm:mb-2">Category</label>
                  <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-white">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Intellectual Property</option>
                    <option>Business</option>
                    <option>Criminal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 sm:mb-2">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe the scope of this legal service..." 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
                  ></textarea>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-zinc-800/50 border-t border-slate-700 flex justify-end gap-2 sm:gap-3">
                <button onClick={() => setIsAddingService(false)} className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold text-zinc-500">Cancel</button>
                <button className="px-4 sm:px-6 py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-brand-primary/20">Submit for Approval</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
