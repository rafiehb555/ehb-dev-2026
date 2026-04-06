'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Cpu, Network, Zap, Activity, CheckCircle2,
  AlertTriangle, Clock, ArrowRight, Play, Pause, Settings,
  RefreshCw, ChevronRight, Eye, Loader2, Shield,
  Globe, Database, BarChart2, Users, FileText, Scale,
  CreditCard, Building2, BookOpen, Lock, Sparkles
} from 'lucide-react';
import { 
  AIAgent, AgentType, AgentTask, Workflow, WorkflowStep,
  AgentStatus, TaskStatus, TaskPriority 
} from './types';

// Define all AI Agents
const AGENT_DEFINITIONS: Record<AgentType, Omit<AIAgent, 'id' | 'metrics' | 'config'>> = {
  orchestrator: {
    type: 'orchestrator',
    name: 'AI Orchestrator',
    nameUrdu: 'AI آرکیسٹریٹر',
    description: 'Central AI brain coordinating all agents',
    descriptionUrdu: 'مرکزی AI دماغ جو تمام ایجنٹس کو منظم کرتا ہے',
    status: 'active',
    version: '2.0.0',
    capabilities: ['task_routing', 'workflow_management', 'agent_coordination', 'priority_handling'],
    dependencies: []
  },
  case_management: {
    type: 'case_management',
    name: 'Case Management Agent',
    nameUrdu: 'کیس مینجمنٹ ایجنٹ',
    description: 'Manages legal case lifecycle',
    descriptionUrdu: 'قانونی کیس کا مکمل انتظام',
    status: 'active',
    version: '1.5.0',
    capabilities: ['case_creation', 'status_tracking', 'timeline_management', 'assignment'],
    dependencies: ['orchestrator']
  },
  legal_research: {
    type: 'legal_research',
    name: 'Legal Research Agent',
    nameUrdu: 'قانونی تحقیق ایجنٹ',
    description: 'Performs intelligent legal research',
    descriptionUrdu: 'ذہین قانونی تحقیق',
    status: 'active',
    version: '1.3.0',
    capabilities: ['law_search', 'precedent_analysis', 'argument_suggestions', 'citation'],
    dependencies: ['orchestrator', 'knowledge']
  },
  document_generation: {
    type: 'document_generation',
    name: 'Document Generation Agent',
    nameUrdu: 'دستاویز ایجنٹ',
    description: 'Creates legal documents automatically',
    descriptionUrdu: 'قانونی دستاویزات خود بخود بنائیں',
    status: 'active',
    version: '1.4.0',
    capabilities: ['template_generation', 'contract_drafting', 'notice_creation', 'formatting'],
    dependencies: ['orchestrator', 'legal_research']
  },
  lawyer_matching: {
    type: 'lawyer_matching',
    name: 'Lawyer Matching Agent',
    nameUrdu: 'وکیل میچنگ ایجنٹ',
    description: 'Matches cases with best lawyers',
    descriptionUrdu: 'بہترین وکیل سے ملائیں',
    status: 'active',
    version: '1.6.0',
    capabilities: ['skill_matching', 'availability_check', 'rating_analysis', 'recommendation'],
    dependencies: ['orchestrator', 'analytics']
  },
  payment: {
    type: 'payment',
    name: 'Payment Agent',
    nameUrdu: 'ادائیگی ایجنٹ',
    description: 'Handles payments and escrow',
    descriptionUrdu: 'ادائیگی اور ایسکرو کا انتظام',
    status: 'active',
    version: '1.2.0',
    capabilities: ['payment_processing', 'escrow_management', 'refund_handling', 'invoicing'],
    dependencies: ['orchestrator', 'security']
  },
  court_process: {
    type: 'court_process',
    name: 'Court Process Agent',
    nameUrdu: 'عدالتی عمل ایجنٹ',
    description: 'Manages court proceedings',
    descriptionUrdu: 'عدالتی کارروائی کا انتظام',
    status: 'active',
    version: '1.1.0',
    capabilities: ['hearing_scheduling', 'deadline_tracking', 'court_filing', 'reminder'],
    dependencies: ['orchestrator', 'case_management']
  },
  franchise: {
    type: 'franchise',
    name: 'Franchise Intelligence Agent',
    nameUrdu: 'فرنچائز انٹیلیجنس ایجنٹ',
    description: 'Franchise network optimization',
    descriptionUrdu: 'فرنچائز نیٹ ورک کی اصلاح',
    status: 'active',
    version: '1.0.0',
    capabilities: ['performance_analysis', 'demand_prediction', 'expansion_recommendation'],
    dependencies: ['orchestrator', 'analytics']
  },
  global_compliance: {
    type: 'global_compliance',
    name: 'Global Compliance Agent',
    nameUrdu: 'عالمی تعمیل ایجنٹ',
    description: 'Multi-country legal compliance',
    descriptionUrdu: 'کثیر ملکی قانونی تعمیل',
    status: 'active',
    version: '1.0.0',
    capabilities: ['regulation_checking', 'license_verification', 'cross_border_compliance'],
    dependencies: ['orchestrator', 'knowledge']
  },
  security: {
    type: 'security',
    name: 'Security Agent',
    nameUrdu: 'سیکیورٹی ایجنٹ',
    description: 'System security and fraud detection',
    descriptionUrdu: 'سسٹم سیکیورٹی اور فراڈ کا پتہ',
    status: 'active',
    version: '1.5.0',
    capabilities: ['fraud_detection', 'access_control', 'encryption', 'audit_logging'],
    dependencies: ['orchestrator']
  },
  analytics: {
    type: 'analytics',
    name: 'Analytics Agent',
    nameUrdu: 'تجزیاتی ایجنٹ',
    description: 'Data analysis and predictions',
    descriptionUrdu: 'ڈیٹا تجزیہ اور پیشن گوئیاں',
    status: 'active',
    version: '1.2.0',
    capabilities: ['reporting', 'prediction', 'trend_analysis', 'kpi_monitoring'],
    dependencies: ['orchestrator']
  },
  communication: {
    type: 'communication',
    name: 'Communication Agent',
    nameUrdu: 'مواصلاتی ایجنٹ',
    description: 'Manages notifications and messaging',
    descriptionUrdu: 'اطلاعات اور پیغامات کا انتظام',
    status: 'active',
    version: '1.1.0',
    capabilities: ['notification', 'email', 'sms', 'in_app_messaging'],
    dependencies: ['orchestrator']
  },
  knowledge: {
    type: 'knowledge',
    name: 'Knowledge Base Agent',
    nameUrdu: 'علم کا ذخیرہ ایجنٹ',
    description: 'Legal knowledge management',
    descriptionUrdu: 'قانونی علم کا انتظام',
    status: 'active',
    version: '1.3.0',
    capabilities: ['knowledge_retrieval', 'indexing', 'context_understanding', 'learning'],
    dependencies: ['orchestrator']
  },
  learning: {
    type: 'learning',
    name: 'Learning & Optimization Agent',
    nameUrdu: 'سیکھنے اور بہتری کا ایجنٹ',
    description: 'Continuous system improvement',
    descriptionUrdu: 'مسلسل نظام کی بہتری',
    status: 'active',
    version: '1.0.0',
    capabilities: ['pattern_recognition', 'optimization', 'model_training', 'feedback_processing'],
    dependencies: ['orchestrator', 'analytics']
  }
};

const AGENT_ICONS: Record<AgentType, React.ElementType> = {
  orchestrator: Brain,
  case_management: Scale,
  legal_research: BookOpen,
  document_generation: FileText,
  lawyer_matching: Users,
  payment: CreditCard,
  court_process: Scale,
  franchise: Building2,
  global_compliance: Globe,
  security: Shield,
  analytics: BarChart2,
  communication: Zap,
  knowledge: Database,
  learning: Sparkles
};

interface AIOrchestatorProps {
  language?: 'en' | 'ur';
}

export default function AIOrchestrator({ language = 'en' }: AIOrchestatorProps) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [taskQueue, setTaskQueue] = useState<AgentTask[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showWorkflowDemo, setShowWorkflowDemo] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    const initialAgents: AIAgent[] = Object.entries(AGENT_DEFINITIONS).map(([type, def]) => ({
      ...def,
      id: `agent-${type}-${Date.now()}`,
      metrics: {
        tasksCompleted: Math.floor(Math.random() * 1000) + 100,
        tasksInProgress: Math.floor(Math.random() * 10),
        tasksFailed: Math.floor(Math.random() * 20),
        avgResponseTime: Math.random() * 2 + 0.5,
        accuracy: 90 + Math.random() * 9,
        uptime: 99 + Math.random(),
        lastActive: new Date(),
        memoryUsage: Math.random() * 50 + 20,
        cpuUsage: Math.random() * 30 + 10
      },
      config: {
        maxConcurrentTasks: 10,
        timeout: 30000,
        retryAttempts: 3,
        priority: type === 'orchestrator' ? 100 : 50,
        enabled: true,
        autoScale: true
      }
    }));
    setAgents(initialAgents);
  }, []);

  const simulateWorkflow = useCallback(() => {
    setShowWorkflowDemo(true);
    setCurrentStepIndex(-1);
    
    const steps: WorkflowStep[] = [
      { id: '1', name: 'User Request Received', agent: 'orchestrator', action: 'analyze_request', input: {}, status: 'pending' },
      { id: '2', name: 'Intent Classification', agent: 'orchestrator', action: 'classify_intent', input: {}, status: 'pending' },
      { id: '3', name: 'Case Creation', agent: 'case_management', action: 'create_case', input: {}, status: 'pending' },
      { id: '4', name: 'Legal Research', agent: 'legal_research', action: 'research_laws', input: {}, status: 'pending' },
      { id: '5', name: 'Document Preparation', agent: 'document_generation', action: 'generate_docs', input: {}, status: 'pending' },
      { id: '6', name: 'Lawyer Matching', agent: 'lawyer_matching', action: 'find_lawyers', input: {}, status: 'pending' },
      { id: '7', name: 'Security Verification', agent: 'security', action: 'verify_data', input: {}, status: 'pending' },
      { id: '8', name: 'Payment Setup', agent: 'payment', action: 'setup_escrow', input: {}, status: 'pending' },
      { id: '9', name: 'Notification Sent', agent: 'communication', action: 'send_notification', input: {}, status: 'pending' },
      { id: '10', name: 'Workflow Complete', agent: 'orchestrator', action: 'complete', input: {}, status: 'pending' }
    ];

    setWorkflowSteps(steps);

    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStepIndex(index);
        setWorkflowSteps(prev => 
          prev.map((s, i) => ({
            ...s,
            status: i < index ? 'completed' : i === index ? 'in_progress' : 'pending'
          }))
        );
      }, (index + 1) * 1200);
    });

    setTimeout(() => {
      setWorkflowSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      setCurrentStepIndex(steps.length);
    }, (steps.length + 1) * 1200);
  }, []);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'processing');
  const totalTasks = agents.reduce((acc, a) => acc + a.metrics.tasksCompleted, 0);
  const avgAccuracy = agents.length > 0 
    ? (agents.reduce((acc, a) => acc + a.metrics.accuracy, 0) / agents.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-violet-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-brand-gold flex items-center justify-center relative">
              <Brain className="text-white" size={32} />
              {isRunning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-2xl border-2 border-violet-400"
                />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl flex items-center gap-2">
                <Sparkles className="text-brand-gold" size={24} />
                {language === 'ur' ? 'AI آرکیسٹریٹر' : 'AI Orchestrator'}
              </h2>
              <p className="text-slate-400">
                {language === 'ur' 
                  ? 'مرکزی AI دماغ - تمام ایجنٹس کو منظم کرتا ہے'
                  : 'Central AI Brain - Coordinating all agents'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isRunning ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? 'Running' : 'Paused'}
            </button>
            <button className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Network size={14} />
              {language === 'ur' ? 'فعال ایجنٹس' : 'Active Agents'}
            </div>
            <p className="text-green-400 font-bold text-2xl">{activeAgents.length}/{agents.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <CheckCircle2 size={14} />
              {language === 'ur' ? 'مکمل ٹاسکس' : 'Tasks Done'}
            </div>
            <p className="text-white font-bold text-2xl">{totalTasks.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Activity size={14} />
              {language === 'ur' ? 'درستگی' : 'Accuracy'}
            </div>
            <p className="text-brand-gold font-bold text-2xl">{avgAccuracy}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock size={14} />
              {language === 'ur' ? 'اوسط وقت' : 'Avg Time'}
            </div>
            <p className="text-white font-bold text-2xl">1.2s</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Cpu size={14} />
              {language === 'ur' ? 'سسٹم لوڈ' : 'System Load'}
            </div>
            <p className="text-blue-400 font-bold text-2xl">24%</p>
          </div>
        </div>
      </motion.div>

      {/* Workflow Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <RefreshCw className="text-brand-gold" size={20} />
            {language === 'ur' ? 'AI ورک فلو ڈیمو' : 'AI Workflow Demo'}
          </h3>
          <button
            onClick={simulateWorkflow}
            disabled={showWorkflowDemo && currentStepIndex < workflowSteps.length}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-brand-gold text-white rounded-xl font-medium disabled:opacity-50"
          >
            <Play size={18} />
            {language === 'ur' ? 'ورک فلو چلائیں' : 'Run Workflow'}
          </button>
        </div>

        {showWorkflowDemo && (
          <div className="space-y-3">
            {workflowSteps.map((step, index) => {
              const AgentIcon = AGENT_ICONS[step.agent];
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    step.status === 'in_progress' ? 'bg-brand-gold/20 border border-brand-gold/50' :
                    step.status === 'completed' ? 'bg-green-500/10' :
                    'bg-white/5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in_progress' ? 'bg-brand-gold' :
                    'bg-slate-700'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="text-white" size={20} />
                    ) : step.status === 'in_progress' ? (
                      <Loader2 className="text-white animate-spin" size={20} />
                    ) : (
                      <AgentIcon className="text-slate-400" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      step.status === 'in_progress' ? 'text-brand-gold' :
                      step.status === 'completed' ? 'text-green-400' :
                      'text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-slate-500 text-xs">Agent: {AGENT_DEFINITIONS[step.agent].name}</p>
                  </div>
                  {step.status === 'completed' && (
                    <span className="text-green-400 text-xs">Done</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Agent Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <Network className="text-brand-gold" size={20} />
          {language === 'ur' ? 'AI ایجنٹس نیٹ ورک' : 'AI Agents Network'}
          <span className="text-slate-400 text-sm font-normal">({agents.length} agents)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent, index) => {
            const AgentIcon = AGENT_ICONS[agent.type];
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                className={`bg-white/5 rounded-xl p-4 cursor-pointer transition-all border ${
                  selectedAgent?.id === agent.id ? 'border-brand-gold' : 'border-transparent hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/30 to-brand-gold/30 flex items-center justify-center">
                    <AgentIcon className="text-brand-gold" size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="text-[10px] text-slate-400">{agent.status}</span>
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm mb-1">
                  {language === 'ur' ? agent.nameUrdu : agent.name}
                </h4>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                  {language === 'ur' ? agent.descriptionUrdu : agent.description}
                </p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{agent.metrics.tasksCompleted} tasks</span>
                  <span className="text-green-400">{agent.metrics.accuracy.toFixed(1)}%</span>
                </div>

                <AnimatePresence>
                  {selectedAgent?.id === agent.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-slate-400">Response</p>
                          <p className="text-white font-medium">{agent.metrics.avgResponseTime.toFixed(2)}s</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-slate-400">Uptime</p>
                          <p className="text-green-400 font-medium">{agent.metrics.uptime.toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agent.capabilities.slice(0, 3).map((cap, i) => (
                          <span key={i} className="px-2 py-0.5 bg-brand-gold/20 text-brand-gold text-[10px] rounded">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Agent Communication Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-violet-500/10 to-brand-gold/10 rounded-2xl p-6 border border-violet-500/20"
      >
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="text-brand-gold" size={20} />
          {language === 'ur' ? 'ایجنٹ کمیونیکیشن فلو' : 'Agent Communication Flow'}
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['User', 'Orchestrator', 'Case Agent', 'Research Agent', 'Document Agent', 'Lawyer Agent', 'Payment Agent'].map((name, i) => (
            <React.Fragment key={name}>
              <div className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm font-medium">
                {name}
              </div>
              {i < 6 && <ArrowRight className="text-brand-gold" size={20} />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
