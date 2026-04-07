'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Briefcase, MessageSquare, FileText, 
  DollarSign, Star, Cpu, CheckCircle2, Clock, 
  Plus, BarChart3, ShieldCheck, Loader2
} from 'lucide-react';
import SQLLevelDashboard from './SQLLevelDashboard';
import { SQLLevel, SQL_LEVELS } from '@/data/sqlLevels';

export default function LawyerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'sql'>('overview');
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalRevenue: 45000 });
  const [isLoading, setIsLoading] = useState(true);

  const lawyer = {
    name: "Ahmed Khan",
    specialization: "Criminal Lawyer",
    experience: "10 years",
    sqlLevel: SQLLevel.HIGH,
    rating: 4.9
  };

  useEffect(() => {
    setTimeout(() => {
      setCases([
        { id: 1, client_name: 'Fatima Noor', title: 'Property Dispute', status: 'in_progress', created_at: new Date().toISOString() },
        { id: 2, client_name: 'Bilal Ahmed', title: 'Contract Review', status: 'pending', created_at: new Date().toISOString() }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const sqlInfo = SQL_LEVELS[lawyer.sqlLevel];
  const SQLIcon = sqlInfo.icon;

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2 text-white">Lawyer Dashboard</h1>
          <p className="text-sm text-ehb-textMuted">Manage your practice, clients, and legal services.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link 
            href="/ai-assistant"
            className="bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Cpu size={16} className="sm:w-[18px] sm:h-[18px]" /> Ask AI
          </Link>
          <button className="bg-brand-primary text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> New Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar / Profile Info */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 mx-auto mb-3 sm:mb-4 flex items-center justify-center overflow-hidden border-4 border-brand-primary/20">
               <img src="https://i.pravatar.cc/150?u=ahmed" alt="Ahmed" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">{lawyer.name}</h3>
            <p className="text-[10px] sm:text-xs text-ehb-textMuted mb-3 sm:mb-4">{lawyer.specialization}</p>
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-slate-800 border border-slate-700 ${sqlInfo.color}`}>
                <SQLIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">SQL: {lawyer.sqlLevel}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-800">
                <p className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-xs sm:text-sm font-bold text-white">{lawyer.experience}</p>
              </div>
              <div className="bg-slate-900 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-800">
                <p className="text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Rating</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={10} className="sm:w-3 sm:h-3 text-yellow-500 fill-yellow-500" />
                  <p className="text-xs sm:text-sm font-bold text-white">{lawyer.rating}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ms-card p-3 sm:p-4 space-y-1 sm:space-y-2">
            <h4 className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2">Quick Navigation</h4>
            {[
              { id: 'overview', label: 'Dashboard', icon: BarChart3, count: null },
              { id: 'sql', label: 'SQL Level', icon: ShieldCheck, count: 'Upgrade' },
              { id: 'cases', label: 'Cases', icon: Briefcase, count: cases.length || null },
              { id: 'requests', label: 'Requests', icon: MessageSquare, count: 5 },
              { id: 'docs', label: 'Documents', icon: FileText, count: 24 },
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => (item.id === 'overview' || item.id === 'sql') && setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm font-bold ${
                  activeTab === item.id 
                    ? 'bg-brand-primary text-white' 
                    : 'hover:bg-slate-800 text-ehb-textMuted'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <item.icon size={14} className={`sm:w-[18px] sm:h-[18px] ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className={`text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === item.id ? 'bg-white text-brand-primary' : 'bg-brand-primary text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Active Cases', value: cases.length.toString(), icon: Briefcase, color: 'text-blue-500' },
                  { label: 'Pending Requests', value: '5', icon: Clock, color: 'text-orange-500' },
                  { label: 'Total Earnings', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
                ].map((stat, idx) => (
                  <div key={idx} className="ms-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                      <stat.icon size={20} className={`sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                      <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Case Management Section */}
              <div className="ms-card overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base">Recent Active Cases</h3>
                  <button className="text-[10px] sm:text-xs font-bold text-brand-primary hover:underline">View All</button>
                </div>
                <div className="divide-y divide-slate-800">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8 sm:py-12">
                      <Loader2 className="animate-spin text-brand-primary" />
                    </div>
                  ) : cases.length > 0 ? (
                    cases.map((item, idx) => (
                      <div key={idx} className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] sm:text-xs text-white">
                            {item.client_name[0]}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-white">{item.client_name}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-500">{item.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] sm:text-[10px] font-bold text-brand-primary uppercase tracking-widest">{item.status}</p>
                          <p className="text-[8px] sm:text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 sm:p-12 text-center">
                      <p className="text-slate-500 text-xs sm:text-sm">No active cases found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Legal Tools Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { title: 'AI Case Analyzer', icon: BarChart3, desc: 'Analyze case strengths' },
                  { title: 'AI Doc Generator', icon: FileText, desc: 'Draft legal agreements' },
                  { title: 'AI Legal Research', icon: Cpu, desc: 'Search case laws' },
                ].map((tool, idx) => (
                  <Link 
                    key={idx} 
                    href="/ai-assistant"
                    className="ms-card p-4 sm:p-6 group cursor-pointer hover:border-brand-primary transition-all border border-slate-800"
                  >
                    <tool.icon size={20} className="sm:w-6 sm:h-6 text-brand-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs sm:text-sm font-bold mb-1 text-white">{tool.title}</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <SQLLevelDashboard />
          )}
        </div>
      </div>
    </div>
  );
}
