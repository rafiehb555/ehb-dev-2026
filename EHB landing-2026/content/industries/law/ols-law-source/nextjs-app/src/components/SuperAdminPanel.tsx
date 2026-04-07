'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, UserCheck, Globe, 
  BarChart3, Settings, AlertCircle, Cpu, 
  CheckCircle2, XCircle, MoreVertical,
  Briefcase, Landmark, Loader2
} from 'lucide-react';

export default function SuperAdminPanel() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalLawyers: 1240,
        activeCases: 4500,
        totalRevenue: 2500000
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1 sm:mb-2 text-white">Super Admin Control Panel</h1>
          <p className="text-xs sm:text-sm text-ehb-textMuted">Global platform management and system monitoring.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
          <button 
            onClick={() => router.push('/franchise')}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white border border-slate-800 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all"
          >
            <Globe size={16} className="sm:w-[18px] sm:h-[18px]" /> Franchise Dashboard
          </button>
          <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">
            <Settings size={16} className="sm:w-[18px] sm:h-[18px]" /> System Settings
          </button>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8 sm:py-12">
            <Loader2 className="animate-spin text-brand-primary" size={24} />
          </div>
        ) : (
          [
            { label: 'Total Users', value: '12,840', icon: Users, color: 'text-blue-500' },
            { label: 'Verified Lawyers', value: stats?.totalLawyers.toString() || '0', icon: UserCheck, color: 'text-emerald-500' },
            { label: 'Total Cases', value: stats?.activeCases.toString() || '0', icon: Briefcase, color: 'text-purple-500' },
            { label: 'Total Revenue', value: `$${stats?.totalRevenue.toLocaleString()}` || '$0', icon: Landmark, color: 'text-orange-500' },
          ].map((stat, idx) => (
            <div key={idx} className="ms-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Lawyer Verification Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ms-card overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="font-bold text-white text-sm sm:text-base">Lawyer Verification Queue</h3>
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">12 PENDING</span>
                <button className="text-[10px] sm:text-xs font-bold text-brand-primary hover:underline">View All</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <th className="px-4 sm:px-6 py-3 sm:py-4">Lawyer</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Specialization</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4">Documents</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { name: 'Dr. Sarah Smith', spec: 'International Law', docs: 'Verified', status: 'Pending' },
                    { name: 'Adv. Bilal Ahmed', spec: 'Criminal Law', docs: 'Pending', status: 'Pending' },
                    { name: 'Maria Garcia', spec: 'Family Law', docs: 'Verified', status: 'Pending' },
                  ].map((lawyer, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-[10px] sm:text-xs text-white">
                            {lawyer.name[0]}
                          </div>
                          <span className="text-[10px] sm:text-sm font-bold text-white">{lawyer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-medium text-white hidden sm:table-cell">{lawyer.spec}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                          lawyer.docs === 'Verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {lawyer.docs}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-900/20 rounded-lg transition-colors">
                            <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-900/20 rounded-lg transition-colors">
                            <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          <button className="p-1.5 sm:p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors hidden sm:block">
                            <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Franchise Management */}
          <div className="ms-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="font-bold text-white text-sm sm:text-base">Franchise Performance</h3>
              <button 
                onClick={() => router.push('/franchise')}
                className="text-[10px] sm:text-xs font-bold text-brand-primary hover:underline"
              >
                Manage Franchises
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { city: 'Lahore Central', revenue: '$45,200', lawyers: 124, growth: '+15%' },
                { city: 'Dubai Marina', revenue: '$82,100', lawyers: 86, growth: '+22%' },
              ].map((franchise, idx) => (
                <div key={idx} className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <Globe size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{franchise.city}</h4>
                        <p className="text-[8px] sm:text-[10px] text-zinc-500">{franchise.lawyers} Active Lawyers</p>
                      </div>
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500">{franchise.growth}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest">Monthly Revenue</p>
                      <p className="text-base sm:text-lg font-bold text-white">{franchise.revenue}</p>
                    </div>
                    <button className="text-[9px] sm:text-[10px] font-bold text-brand-primary">View Stats</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Monitoring & AI */}
        <div className="space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <Cpu size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
              AI System Monitoring
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-xs font-bold text-white">AI Accuracy Rate</span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-500">98.4%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '98.4%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 bg-slate-900 rounded-lg sm:rounded-xl text-center">
                  <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 sm:mb-1">AI Requests</p>
                  <p className="text-xs sm:text-sm font-bold text-white">142,500</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-900 rounded-lg sm:rounded-xl text-center">
                  <p className="text-[7px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 sm:mb-1">Server Load</p>
                  <p className="text-xs sm:text-sm font-bold text-orange-500">42%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <AlertCircle size={18} className="sm:w-5 sm:h-5 text-rose-500" />
              Dispute Resolution
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { type: 'Client Complaint', id: '#4521', priority: 'High' },
                { type: 'Lawyer Dispute', id: '#4522', priority: 'Medium' },
              ].map((dispute, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-900 rounded-lg sm:rounded-xl">
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-white">{dispute.type}</p>
                    <p className="text-[8px] sm:text-[10px] text-zinc-500">Case ID: {dispute.id}</p>
                  </div>
                  <span className={`text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                    dispute.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {dispute.priority}
                  </span>
                </div>
              ))}
              <button className="w-full py-2 mt-1 sm:mt-2 bg-slate-900 text-white border border-slate-800 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-800 transition-all">
                Open Dispute Center
              </button>
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <BarChart3 size={18} className="sm:w-5 sm:h-5 text-brand-primary" />
              Platform Growth
            </h3>
            <div className="aspect-video bg-zinc-800 rounded-lg sm:rounded-xl flex items-center justify-center text-zinc-400 text-[9px] sm:text-[10px] font-bold">
              [ Growth Chart Visualization ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
