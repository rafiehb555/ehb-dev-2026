'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, Brain, Zap, Shield, Scale, FileText, Users,
  Building2, Globe, BarChart2, CheckCircle2, Clock,
  AlertTriangle, ArrowRight, Sparkles, Activity, Cpu,
  Network, CircuitBoard, Workflow, Play, Pause, Settings,
  TrendingUp, MessageSquare, Briefcase, Loader2, Target
} from 'lucide-react';

interface AIModule {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: React.ElementType;
  status: 'active' | 'processing' | 'idle' | 'error';
  tasksCompleted: number;
  accuracy: number;
  lastActive: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  nameUrdu: string;
  status: 'completed' | 'active' | 'pending';
  module: string;
  timestamp?: string;
}

interface SystemMetrics {
  totalCasesProcessed: number;
  activeWorkflows: number;
  avgResponseTime: string;
  systemAccuracy: number;
  uptime: string;
  casesHandledToday: number;
}

interface ActivityLog {
  id: string;
  action: string;
  actionUrdu: string;
  module: string;
  timestamp: Date;
  type: 'success' | 'info' | 'warning';
}

const AI_MODULES: AIModule[] = [
  {
    id: 'case_agent',
    name: 'Case Agent',
    nameUrdu: 'کیس ایجنٹ',
    description: 'Handles case intake and processing',
    descriptionUrdu: 'کیس کا اندراج اور پروسیسنگ',
    icon: Briefcase,
    status: 'active',
    tasksCompleted: 1234,
    accuracy: 96,
    lastActive: '2 mins ago'
  },
  {
    id: 'document_agent',
    name: 'Document Agent',
    nameUrdu: 'دستاویز ایجنٹ',
    description: 'Generates and processes legal documents',
    descriptionUrdu: 'قانونی دستاویزات بناتا اور پروسیس کرتا ہے',
    icon: FileText,
    status: 'processing',
    tasksCompleted: 856,
    accuracy: 94,
    lastActive: 'Now'
  },
  {
    id: 'research_agent',
    name: 'Research Agent',
    nameUrdu: 'تحقیق ایجنٹ',
    description: 'Conducts legal research and analysis',
    descriptionUrdu: 'قانونی تحقیق اور تجزیہ کرتا ہے',
    icon: Brain,
    status: 'active',
    tasksCompleted: 2341,
    accuracy: 92,
    lastActive: '5 mins ago'
  },
  {
    id: 'lawyer_agent',
    name: 'Lawyer Agent',
    nameUrdu: 'وکیل ایجنٹ',
    description: 'Matches cases with lawyers',
    descriptionUrdu: 'کیسز کو وکلاء سے ملاتا ہے',
    icon: Users,
    status: 'active',
    tasksCompleted: 567,
    accuracy: 98,
    lastActive: '1 min ago'
  },
  {
    id: 'court_agent',
    name: 'Court Agent',
    nameUrdu: 'عدالتی ایجنٹ',
    description: 'Manages court processes and schedules',
    descriptionUrdu: 'عدالتی عمل اور شیڈول کا انتظام',
    icon: Scale,
    status: 'idle',
    tasksCompleted: 234,
    accuracy: 95,
    lastActive: '15 mins ago'
  },
  {
    id: 'franchise_agent',
    name: 'Franchise Agent',
    nameUrdu: 'فرنچائز ایجنٹ',
    description: 'Optimizes franchise operations',
    descriptionUrdu: 'فرنچائز آپریشنز کو بہتر کرتا ہے',
    icon: Building2,
    status: 'active',
    tasksCompleted: 123,
    accuracy: 91,
    lastActive: '10 mins ago'
  },
  {
    id: 'global_agent',
    name: 'Global Agent',
    nameUrdu: 'عالمی ایجنٹ',
    description: 'Provides international legal intelligence',
    descriptionUrdu: 'بین الاقوامی قانونی انٹیلیجنس فراہم کرتا ہے',
    icon: Globe,
    status: 'active',
    tasksCompleted: 89,
    accuracy: 90,
    lastActive: '8 mins ago'
  },
  {
    id: 'analytics_agent',
    name: 'Analytics Agent',
    nameUrdu: 'تجزیاتی ایجنٹ',
    description: 'Generates reports and predictions',
    descriptionUrdu: 'رپورٹس اور پیشن گوئیاں بناتا ہے',
    icon: BarChart2,
    status: 'processing',
    tasksCompleted: 456,
    accuracy: 93,
    lastActive: 'Now'
  }
];

const INITIAL_METRICS: SystemMetrics = {
  totalCasesProcessed: 15234,
  activeWorkflows: 47,
  avgResponseTime: '1.2s',
  systemAccuracy: 94.5,
  uptime: '99.9%',
  casesHandledToday: 156
};

const ACTIVITY_LOG: ActivityLog[] = [
  { id: '1', action: 'New divorce case processed', actionUrdu: 'نیا طلاق کیس پروسیس ہوا', module: 'Case Agent', timestamp: new Date(Date.now() - 60000), type: 'success' },
  { id: '2', action: 'Legal notice generated', actionUrdu: 'قانونی نوٹس بنایا گیا', module: 'Document Agent', timestamp: new Date(Date.now() - 120000), type: 'success' },
  { id: '3', action: 'Lawyer matched for property case', actionUrdu: 'جائیداد کیس کے لیے وکیل ملایا گیا', module: 'Lawyer Agent', timestamp: new Date(Date.now() - 180000), type: 'info' },
  { id: '4', action: 'Case success prediction completed', actionUrdu: 'کیس کامیابی کی پیشن گوئی مکمل', module: 'Analytics Agent', timestamp: new Date(Date.now() - 240000), type: 'info' },
  { id: '5', action: 'Court hearing reminder sent', actionUrdu: 'عدالتی پیشی کی یاد دہانی بھیجی گئی', module: 'Court Agent', timestamp: new Date(Date.now() - 300000), type: 'success' },
];

interface AutonomousLegalSystemProps {
  language?: 'en' | 'ur';
}

export default function AutonomousLegalSystem({ language = 'en' }: AutonomousLegalSystemProps) {
  const [modules, setModules] = useState<AIModule[]>(AI_MODULES);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [activities, setActivities] = useState<ActivityLog[]>(ACTIVITY_LOG);
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStep[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateWorkflow = useCallback(() => {
    setIsSimulating(true);
    setShowWorkflow(true);
    
    const steps: WorkflowStep[] = [
      { id: '1', name: 'User Request Received', nameUrdu: 'صارف کی درخواست موصول', status: 'pending', module: 'System' },
      { id: '2', name: 'Intent Analysis', nameUrdu: 'ارادے کا تجزیہ', status: 'pending', module: 'Case Agent' },
      { id: '3', name: 'Information Collection', nameUrdu: 'معلومات کا اجتماع', status: 'pending', module: 'Case Agent' },
      { id: '4', name: 'Document Processing', nameUrdu: 'دستاویز پروسیسنگ', status: 'pending', module: 'Document Agent' },
      { id: '5', name: 'Legal Research', nameUrdu: 'قانونی تحقیق', status: 'pending', module: 'Research Agent' },
      { id: '6', name: 'Strategy Generation', nameUrdu: 'حکمت عملی بنانا', status: 'pending', module: 'Analytics Agent' },
      { id: '7', name: 'Lawyer Matching', nameUrdu: 'وکیل ملانا', status: 'pending', module: 'Lawyer Agent' },
      { id: '8', name: 'Case Creation', nameUrdu: 'کیس تخلیق', status: 'pending', module: 'Case Agent' },
      { id: '9', name: 'Workflow Complete', nameUrdu: 'ورک فلو مکمل', status: 'pending', module: 'System' },
    ];
    
    setCurrentWorkflow(steps);

    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentWorkflow(prev => 
          prev.map((s, i) => ({
            ...s,
            status: i < index ? 'completed' : i === index ? 'active' : 'pending',
            timestamp: i <= index ? new Date().toLocaleTimeString() : undefined
          }))
        );
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            setCurrentWorkflow(prev => 
              prev.map(s => ({ ...s, status: 'completed' as const, timestamp: new Date().toLocaleTimeString() }))
            );
            setIsSimulating(false);
          }, 1000);
        }
      }, (index + 1) * 1500);
    });
  }, []);

  useEffect(() => {
    if (!isSystemRunning) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        casesHandledToday: prev.casesHandledToday + Math.floor(Math.random() * 2),
        activeWorkflows: Math.max(40, Math.min(60, prev.activeWorkflows + Math.floor(Math.random() * 5) - 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isSystemRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ur: string }> = {
      active: { en: 'Active', ur: 'فعال' },
      processing: { en: 'Processing', ur: 'پروسیسنگ' },
      idle: { en: 'Idle', ur: 'بیکار' },
      error: { en: 'Error', ur: 'خرابی' }
    };
    return language === 'ur' ? labels[status]?.ur : labels[status]?.en;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-gold flex items-center justify-center relative">
              <CircuitBoard className="text-white" size={32} />
              {isSystemRunning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
                />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl flex items-center gap-2">
                <Sparkles className="text-brand-gold" size={24} />
                {language === 'ur' ? 'AI خود مختار قانونی نظام' : 'AI Autonomous Legal System'}
              </h2>
              <p className="text-ehb-textMuted">
                {language === 'ur' 
                  ? 'مکمل خود کار قانونی ورک فلو مینجمنٹ'
                  : 'Fully automated legal workflow management'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSystemRunning(!isSystemRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isSystemRunning 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              {isSystemRunning ? <Pause size={18} /> : <Play size={18} />}
              {isSystemRunning ? (language === 'ur' ? 'چل رہا ہے' : 'Running') : (language === 'ur' ? 'روکا ہوا' : 'Paused')}
            </button>
            <button className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Target size={14} />
              {language === 'ur' ? 'کل کیسز' : 'Total Cases'}
            </div>
            <p className="text-white font-bold text-xl">{metrics.totalCasesProcessed.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Activity size={14} />
              {language === 'ur' ? 'فعال ورک فلوز' : 'Active Workflows'}
            </div>
            <p className="text-green-400 font-bold text-xl">{metrics.activeWorkflows}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Clock size={14} />
              {language === 'ur' ? 'اوسط وقت' : 'Avg Response'}
            </div>
            <p className="text-white font-bold text-xl">{metrics.avgResponseTime}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Zap size={14} />
              {language === 'ur' ? 'درستگی' : 'Accuracy'}
            </div>
            <p className="text-brand-gold font-bold text-xl">{metrics.systemAccuracy}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Shield size={14} />
              {language === 'ur' ? 'اپ ٹائم' : 'Uptime'}
            </div>
            <p className="text-green-400 font-bold text-xl">{metrics.uptime}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <TrendingUp size={14} />
              {language === 'ur' ? 'آج کے کیسز' : 'Today'}
            </div>
            <p className="text-white font-bold text-xl">{metrics.casesHandledToday}</p>
          </div>
        </div>
      </motion.div>

      {/* AI Modules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Network className="text-brand-gold" size={20} />
            {language === 'ur' ? 'AI ایجنٹس' : 'AI Agents'}
          </h3>
          <span className="text-ehb-textMuted text-sm">
            {modules.filter(m => m.status === 'active' || m.status === 'processing').length}/{modules.length} {language === 'ur' ? 'فعال' : 'active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedModule(selectedModule?.id === module.id ? null : module)}
              className={`bg-white/5 rounded-xl p-4 cursor-pointer transition-all border ${
                selectedModule?.id === module.id ? 'border-brand-gold' : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/30 to-brand-gold/30 flex items-center justify-center">
                  <module.icon className="text-brand-gold" size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(module.status)}`} />
                  <span className="text-xs text-ehb-textMuted">{getStatusLabel(module.status)}</span>
                </div>
              </div>
              <h4 className="text-white font-bold text-sm mb-1">
                {language === 'ur' ? module.nameUrdu : module.name}
              </h4>
              <p className="text-ehb-textMuted text-xs mb-3">
                {language === 'ur' ? module.descriptionUrdu : module.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ehb-textMuted">{module.tasksCompleted} tasks</span>
                <span className="text-green-400">{module.accuracy}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Workflow Simulation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Workflow className="text-brand-gold" size={20} />
            {language === 'ur' ? 'خود کار ورک فلو' : 'Autonomous Workflow'}
          </h3>
          <button
            onClick={simulateWorkflow}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-xl font-medium disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {language === 'ur' ? 'چل رہا ہے...' : 'Running...'}
              </>
            ) : (
              <>
                <Play size={18} />
                {language === 'ur' ? 'نمونہ چلائیں' : 'Simulate Workflow'}
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showWorkflow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {currentWorkflow.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    step.status === 'active' ? 'bg-brand-gold/20 border border-brand-gold/50' :
                    step.status === 'completed' ? 'bg-green-500/10' :
                    'bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-brand-gold' :
                    'bg-slate-600'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="text-white" size={16} />
                    ) : step.status === 'active' ? (
                      <Loader2 className="text-white animate-spin" size={16} />
                    ) : (
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.status === 'active' ? 'text-brand-gold' :
                      step.status === 'completed' ? 'text-white' :
                      'text-ehb-textMuted'
                    }`}>
                      {language === 'ur' ? step.nameUrdu : step.name}
                    </p>
                    <p className="text-ehb-textMuted text-xs">{step.module}</p>
                  </div>
                  {step.timestamp && (
                    <span className="text-ehb-textMuted text-xs">{step.timestamp}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="text-brand-gold" size={20} />
          {language === 'ur' ? 'سرگرمی لاگ' : 'Activity Log'}
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-400' :
                activity.type === 'warning' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-white text-sm">
                  {language === 'ur' ? activity.actionUrdu : activity.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">
                    {activity.module}
                  </span>
                  <span className="text-ehb-textMuted text-xs">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button className="bg-gradient-to-r from-brand-primary to-brand-gold rounded-xl p-6 text-left hover:opacity-90 transition-all">
          <Bot className="text-white mb-3" size={28} />
          <h4 className="text-white font-bold mb-1">
            {language === 'ur' ? 'نیا کیس شروع کریں' : 'Start New Case'}
          </h4>
          <p className="text-white/70 text-sm">
            {language === 'ur' ? 'AI خود بخود سب کچھ سنبھالے گا' : 'AI will handle everything automatically'}
          </p>
        </button>
        <button className="bg-white/5 rounded-xl p-6 text-left hover:bg-white/10 transition-all border border-white/10">
          <BarChart2 className="text-brand-gold mb-3" size={28} />
          <h4 className="text-white font-bold mb-1">
            {language === 'ur' ? 'سسٹم رپورٹ' : 'System Report'}
          </h4>
          <p className="text-ehb-textMuted text-sm">
            {language === 'ur' ? 'کارکردگی کا تفصیلی تجزیہ' : 'Detailed performance analysis'}
          </p>
        </button>
        <button className="bg-white/5 rounded-xl p-6 text-left hover:bg-white/10 transition-all border border-white/10">
          <Settings className="text-brand-gold mb-3" size={28} />
          <h4 className="text-white font-bold mb-1">
            {language === 'ur' ? 'AI ترتیبات' : 'AI Settings'}
          </h4>
          <p className="text-ehb-textMuted text-sm">
            {language === 'ur' ? 'ایجنٹس کو کنفیگر کریں' : 'Configure AI agents'}
          </p>
        </button>
      </motion.div>
    </div>
  );
}
