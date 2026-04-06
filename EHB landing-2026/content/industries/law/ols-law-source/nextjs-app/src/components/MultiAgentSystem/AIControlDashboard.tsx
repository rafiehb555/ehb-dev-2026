'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu, Activity, Users, Scale, FileText, CreditCard,
  Globe, TrendingUp, TrendingDown, Clock, CheckCircle2,
  AlertTriangle, Database, Server, Wifi, RefreshCw,
  Play, Pause, Settings, Eye, BarChart2, PieChart,
  Zap, Brain, Network, Shield, Loader2, ChevronRight,
  ArrowUpRight, ArrowDownRight, Sparkles, Monitor
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  nameUrdu: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface AgentStatus {
  id: string;
  name: string;
  nameUrdu: string;
  status: 'running' | 'idle' | 'error' | 'stopped';
  tasks: number;
  load: number;
  uptime: string;
}

interface RealtimeEvent {
  id: string;
  type: 'case' | 'payment' | 'user' | 'system';
  message: string;
  messageUrdu: string;
  timestamp: Date;
}

const SYSTEM_METRICS: SystemMetric[] = [
  { id: 'users', name: 'Active Users', nameUrdu: 'فعال صارفین', value: 1247, unit: '', change: 12, changeType: 'increase', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { id: 'cases', name: 'Active Cases', nameUrdu: 'فعال کیسز', value: 856, unit: '', change: 8, changeType: 'increase', icon: Scale, color: 'from-violet-500 to-purple-500' },
  { id: 'lawyers', name: 'Online Lawyers', nameUrdu: 'آن لائن وکلاء', value: 234, unit: '', change: -3, changeType: 'decrease', icon: Users, color: 'from-emerald-500 to-green-500' },
  { id: 'revenue', name: 'Today Revenue', nameUrdu: 'آج کی آمدنی', value: 2450000, unit: 'PKR', change: 15, changeType: 'increase', icon: CreditCard, color: 'from-amber-500 to-orange-500' },
  { id: 'documents', name: 'Documents Generated', nameUrdu: 'دستاویزات', value: 456, unit: '', change: 25, changeType: 'increase', icon: FileText, color: 'from-pink-500 to-rose-500' },
  { id: 'countries', name: 'Active Countries', nameUrdu: 'فعال ممالک', value: 12, unit: '', change: 2, changeType: 'increase', icon: Globe, color: 'from-indigo-500 to-blue-500' }
];

const AI_AGENTS: AgentStatus[] = [
  { id: 'orchestrator', name: 'AI Orchestrator', nameUrdu: 'AI آرکیسٹریٹر', status: 'running', tasks: 145, load: 45, uptime: '99.99%' },
  { id: 'case', name: 'Case Management', nameUrdu: 'کیس مینجمنٹ', status: 'running', tasks: 89, load: 62, uptime: '99.95%' },
  { id: 'research', name: 'Legal Research', nameUrdu: 'قانونی تحقیق', status: 'running', tasks: 34, load: 28, uptime: '99.98%' },
  { id: 'document', name: 'Document Agent', nameUrdu: 'دستاویز ایجنٹ', status: 'running', tasks: 67, load: 55, uptime: '99.92%' },
  { id: 'lawyer', name: 'Lawyer Matching', nameUrdu: 'وکیل میچنگ', status: 'running', tasks: 23, load: 35, uptime: '99.97%' },
  { id: 'payment', name: 'Payment Agent', nameUrdu: 'ادائیگی ایجنٹ', status: 'running', tasks: 12, load: 18, uptime: '99.99%' },
  { id: 'security', name: 'Security Agent', nameUrdu: 'سیکیورٹی ایجنٹ', status: 'running', tasks: 156, load: 72, uptime: '100%' },
  { id: 'analytics', name: 'Analytics Agent', nameUrdu: 'تجزیاتی ایجنٹ', status: 'running', tasks: 78, load: 41, uptime: '99.94%' }
];

interface AIControlDashboardProps {
  language?: 'en' | 'ur';
}

export default function AIControlDashboard({ language = 'en' }: AIControlDashboardProps) {
  const [agents, setAgents] = useState(AI_AGENTS);
  const [metrics, setMetrics] = useState(SYSTEM_METRICS);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const events: RealtimeEvent[] = [
      { id: '1', type: 'case', message: 'New case filed: Property Dispute #EHB-2026-001245', messageUrdu: 'نیا کیس: پراپرٹی تنازعہ', timestamp: new Date() },
      { id: '2', type: 'payment', message: 'Payment received: PKR 50,000 for Case #1234', messageUrdu: 'ادائیگی موصول: PKR 50,000', timestamp: new Date(Date.now() - 60000) },
      { id: '3', type: 'user', message: 'New lawyer registration: Adv. Hassan Ali', messageUrdu: 'نئی وکیل رجسٹریشن', timestamp: new Date(Date.now() - 120000) },
      { id: '4', type: 'system', message: 'AI Document Agent completed 100 tasks', messageUrdu: 'AI دستاویز ایجنٹ نے 100 کام مکمل کیے', timestamp: new Date(Date.now() - 180000) }
    ];
    setRealtimeEvents(events);

    if (autoRefresh) {
      const interval = setInterval(() => {
        setMetrics(prev => prev.map(m => ({
          ...m,
          value: m.id === 'revenue' ? m.value + Math.floor(Math.random() * 10000) : m.value + Math.floor(Math.random() * 5 - 2)
        })));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    const colors = {
      running: 'bg-green-500',
      idle: 'bg-yellow-500',
      error: 'bg-red-500',
      stopped: 'bg-gray-500'
    };
    return colors[status];
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return 'text-green-400';
    if (load < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const runningAgents = agents.filter(a => a.status === 'running').length;
  const totalTasks = agents.reduce((acc, a) => acc + a.tasks, 0);
  const avgLoad = Math.round(agents.reduce((acc, a) => acc + a.load, 0) / agents.length);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-violet-900/30 to-slate-900 rounded-2xl p-6 border border-violet-500/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-brand-gold flex items-center justify-center relative">
              <Monitor className="text-white" size={32} />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-2xl border-2 border-brand-gold/50"
              />
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl flex items-center gap-2">
                <Sparkles className="text-brand-gold" size={24} />
                {language === 'ur' ? 'AI کنٹرول ڈیش بورڈ' : 'AI Control Dashboard'}
              </h2>
              <p className="text-slate-400">
                {language === 'ur' ? 'EHB AI نظام کا مرکزی کنٹرول' : 'Central command center for EHB AI system'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              systemStatus === 'healthy' ? 'bg-green-500/20 text-green-400' :
              systemStatus === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                systemStatus === 'healthy' ? 'bg-green-500' :
                systemStatus === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              } animate-pulse`} />
              {systemStatus === 'healthy' ? 'All Systems Healthy' :
               systemStatus === 'warning' ? 'Warning' : 'Critical'}
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">{language === 'ur' ? 'فعال ایجنٹس' : 'Running Agents'}</span>
              <Network className="text-brand-gold" size={16} />
            </div>
            <p className="text-white font-bold text-3xl">{runningAgents}/{agents.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">{language === 'ur' ? 'کل ٹاسکس' : 'Total Tasks'}</span>
              <Activity className="text-blue-400" size={16} />
            </div>
            <p className="text-white font-bold text-3xl">{totalTasks}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">{language === 'ur' ? 'اوسط لوڈ' : 'Avg Load'}</span>
              <Cpu className="text-violet-400" size={16} />
            </div>
            <p className={`font-bold text-3xl ${getLoadColor(avgLoad)}`}>{avgLoad}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">{language === 'ur' ? 'اپ ٹائم' : 'System Uptime'}</span>
              <Clock className="text-green-400" size={16} />
            </div>
            <p className="text-green-400 font-bold text-3xl">99.99%</p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3`}>
                <Icon className="text-white" size={20} />
              </div>
              <p className="text-slate-400 text-xs mb-1">
                {language === 'ur' ? metric.nameUrdu : metric.name}
              </p>
              <p className="text-white font-bold text-xl">
                {metric.id === 'revenue' 
                  ? `${(metric.value / 1000000).toFixed(1)}M`
                  : metric.value.toLocaleString()}
                {metric.unit && <span className="text-xs text-slate-400 ml-1">{metric.unit}</span>}
              </p>
              <div className={`flex items-center gap-1 text-xs mt-1 ${
                metric.changeType === 'increase' ? 'text-green-400' :
                metric.changeType === 'decrease' ? 'text-red-400' :
                'text-slate-400'
              }`}>
                {metric.changeType === 'increase' ? <ArrowUpRight size={12} /> :
                 metric.changeType === 'decrease' ? <ArrowDownRight size={12} /> :
                 null}
                {Math.abs(metric.change)}%
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Brain className="text-brand-gold" size={20} />
            {language === 'ur' ? 'AI ایجنٹس اسٹیٹس' : 'AI Agents Status'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">{language === 'ur' ? 'آٹو ریفریش' : 'Auto Refresh'}</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-12 h-6 rounded-full transition-colors ${autoRefresh ? 'bg-green-500' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white/5 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  <h4 className="text-white font-medium text-sm">
                    {language === 'ur' ? agent.nameUrdu : agent.name}
                  </h4>
                </div>
                <span className="text-slate-500 text-xs">{agent.uptime}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{language === 'ur' ? 'ٹاسکس' : 'Tasks'}</span>
                  <span className="text-white">{agent.tasks}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{language === 'ur' ? 'لوڈ' : 'Load'}</span>
                  <span className={getLoadColor(agent.load)}>{agent.load}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.load}%` }}
                    className={`h-full rounded-full ${
                      agent.load < 40 ? 'bg-green-500' :
                      agent.load < 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs">
                  <Eye size={12} className="inline mr-1" />
                  {language === 'ur' ? 'دیکھیں' : 'View'}
                </button>
                {agent.status === 'running' ? (
                  <button className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30">
                    <Pause size={12} />
                  </button>
                ) : (
                  <button className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                    <Play size={12} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Realtime Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Activity className="text-brand-gold" size={20} />
          {language === 'ur' ? 'لائیو ایونٹس' : 'Live Events'}
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </h3>

        <div className="space-y-3">
          {realtimeEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-xl"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                event.type === 'case' ? 'bg-violet-500/20 text-violet-400' :
                event.type === 'payment' ? 'bg-green-500/20 text-green-400' :
                event.type === 'user' ? 'bg-blue-500/20 text-blue-400' :
                'bg-brand-gold/20 text-brand-gold'
              }`}>
                {event.type === 'case' ? <Scale size={18} /> :
                 event.type === 'payment' ? <CreditCard size={18} /> :
                 event.type === 'user' ? <Users size={18} /> :
                 <Cpu size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">
                  {language === 'ur' ? event.messageUrdu : event.message}
                </p>
              </div>
              <span className="text-slate-500 text-xs">
                {event.timestamp.toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Brain, label: language === 'ur' ? 'AI ٹرینگ' : 'Train AI', color: 'from-violet-500 to-purple-500' },
          { icon: Database, label: language === 'ur' ? 'ڈیٹا بیک اپ' : 'Backup Data', color: 'from-blue-500 to-cyan-500' },
          { icon: Shield, label: language === 'ur' ? 'سیکیورٹی اسکین' : 'Security Scan', color: 'from-red-500 to-rose-500' },
          { icon: BarChart2, label: language === 'ur' ? 'رپورٹ بنائیں' : 'Generate Report', color: 'from-emerald-500 to-green-500' }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium`}
            >
              <Icon size={20} />
              {action.label}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
