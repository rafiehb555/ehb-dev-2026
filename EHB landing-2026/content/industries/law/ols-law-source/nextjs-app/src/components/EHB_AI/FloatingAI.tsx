'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bot, X, Mic, MicOff, Send, Volume2, VolumeX,
  Sparkles, Zap, MessageSquare, ChevronUp, ChevronDown,
  Settings, Play, Pause, RotateCcw, Loader2,
  FileText, Scale, Users, Brain, Globe, Building2,
  Home, Briefcase, Shield, BookOpen, CreditCard,
  CheckCircle2, Clock, ArrowRight, Minimize2, Maximize2,
  Monitor, MousePointer, Keyboard, Eye, Navigation,
  CircleDot, Terminal, Activity, Cpu, Radio
} from 'lucide-react';

type AIMode = 'assistant' | 'agent' | 'auto';

interface LiveAction {
  id: string;
  type: 'navigate' | 'type' | 'click' | 'speak' | 'think' | 'complete';
  description: string;
  descriptionUrdu: string;
  target?: string;
  typingText?: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
}

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  action?: {
    type: 'navigate' | 'create_case' | 'search' | 'document' | 'info';
    target?: string;
    data?: any;
  };
}

interface QuickAction {
  id: string;
  label: string;
  labelUrdu: string;
  icon: React.ElementType;
  command: string;
  route?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'case', label: 'File Case', labelUrdu: 'کیس فائل کریں', icon: Briefcase, command: 'I want to file a case', route: '/ai-agent' },
  { id: 'lawyer', label: 'Find Lawyer', labelUrdu: 'وکیل تلاش کریں', icon: Users, command: 'Find me a lawyer', route: '/marketplace' },
  { id: 'document', label: 'Create Document', labelUrdu: 'دستاویز بنائیں', icon: FileText, command: 'Create a legal document', route: '/document-generator' },
  { id: 'research', label: 'Legal Research', labelUrdu: 'قانونی تحقیق', icon: BookOpen, command: 'I need legal research', route: '/research' },
  { id: 'payment', label: 'Payments', labelUrdu: 'ادائیگی', icon: CreditCard, command: 'Show my payments', route: '/payments' },
  { id: 'global', label: 'Global Law', labelUrdu: 'عالمی قانون', icon: Globe, command: 'Tell me about international laws', route: '/ai-agent' },
];

const INTENT_MAP: Record<string, { route: string; response: string; responseUrdu: string }> = {
  'file case|case file|kais|کیس|divorce|talaq|طلاق|property|jaidad|جائیداد': {
    route: '/ai-agent',
    response: 'I\'ll help you file your case. Opening AI Agent...',
    responseUrdu: 'میں آپ کا کیس فائل کرنے میں مدد کروں گا۔ AI ایجنٹ کھول رہا ہوں...'
  },
  'lawyer|vakeel|وکیل|advocate|find lawyer': {
    route: '/marketplace',
    response: 'Let me find the best lawyers for you...',
    responseUrdu: 'آپ کے لیے بہترین وکیل تلاش کر رہا ہوں...'
  },
  'document|legal notice|نوٹس|draft|affidavit|agreement': {
    route: '/document-generator',
    response: 'Opening document generator...',
    responseUrdu: 'دستاویز جنریٹر کھول رہا ہوں...'
  },
  'research|law|قانون|section|act': {
    route: '/research',
    response: 'Opening legal research engine...',
    responseUrdu: 'قانونی تحقیق انجن کھول رہا ہوں...'
  },
  'payment|pay|ادائیگی|paisa|rupees': {
    route: '/payments',
    response: 'Opening payments section...',
    responseUrdu: 'ادائیگی سیکشن کھول رہا ہوں...'
  },
  'dashboard|home|main|گھر': {
    route: '/dashboard',
    response: 'Taking you to dashboard...',
    responseUrdu: 'ڈیش بورڈ پر لے جا رہا ہوں...'
  },
  'franchise|فرنچائز|branch': {
    route: '/franchise',
    response: 'Opening franchise dashboard...',
    responseUrdu: 'فرنچائز ڈیش بورڈ کھول رہا ہوں...'
  },
  'admin|ایڈمن|manage': {
    route: '/admin',
    response: 'Opening admin panel...',
    responseUrdu: 'ایڈمن پینل کھول رہا ہوں...'
  },
  'hello|hi|salam|سلام|assalam|السلام': {
    route: '',
    response: 'Assalam o Alaikum! I am EHB AI, your legal assistant. How can I help you today?',
    responseUrdu: 'السلام علیکم! میں EHB AI ہوں، آپ کا قانونی معاون۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟'
  }
};

const AUTO_MESSAGES = [
  { en: 'I can help you file legal cases automatically.', ur: 'میں آپ کے قانونی کیسز خود بخود فائل کرنے میں مدد کر سکتا ہوں۔' },
  { en: 'Would you like to find a lawyer near you?', ur: 'کیا آپ اپنے قریب کوئی وکیل تلاش کرنا چاہتے ہیں؟' },
  { en: 'I can create legal documents for you instantly.', ur: 'میں آپ کے لیے فوری طور پر قانونی دستاویزات بنا سکتا ہوں۔' },
  { en: 'Ask me anything about Pakistani or international law.', ur: 'مجھ سے پاکستانی یا بین الاقوامی قانون کے بارے میں کچھ بھی پوچھیں۔' },
  { en: 'I\'m monitoring your cases in real-time.', ur: 'میں آپ کے کیسز کو ریئل ٹائم میں مانیٹر کر رہا ہوں۔' },
];

const PAGE_INFO: Record<string, { name: string; nameUrdu: string; icon: React.ElementType }> = {
  '/': { name: 'Home', nameUrdu: 'ہوم', icon: Home },
  '/dashboard': { name: 'Dashboard', nameUrdu: 'ڈیش بورڈ', icon: Activity },
  '/ai-agent': { name: 'AI Agent', nameUrdu: 'AI ایجنٹ', icon: Brain },
  '/marketplace': { name: 'Lawyer Marketplace', nameUrdu: 'وکیل مارکیٹ', icon: Users },
  '/document-generator': { name: 'Document Generator', nameUrdu: 'دستاویز جنریٹر', icon: FileText },
  '/research': { name: 'Legal Research', nameUrdu: 'قانونی تحقیق', icon: BookOpen },
  '/payments': { name: 'Payments', nameUrdu: 'ادائیگی', icon: CreditCard },
  '/franchise': { name: 'Franchise', nameUrdu: 'فرنچائز', icon: Building2 },
  '/admin': { name: 'Admin Panel', nameUrdu: 'ایڈمن پینل', icon: Shield },
  '/ai-system': { name: 'AI System', nameUrdu: 'AI سسٹم', icon: Cpu },
  '/create-case': { name: 'Create Case', nameUrdu: 'کیس بنائیں', icon: Scale },
};

export default function FloatingAI() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<AIMode>('assistant');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showLiveScreen, setShowLiveScreen] = useState(false);
  const [liveActions, setLiveActions] = useState<LiveAction[]>([]);
  const [currentAction, setCurrentAction] = useState<LiveAction | null>(null);
  const [typingDisplay, setTypingDisplay] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [isAutoPerforming, setIsAutoPerforming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAutoMode && isOpen) {
      let msgIndex = 0;
      autoIntervalRef.current = setInterval(() => {
        const autoMsg = AUTO_MESSAGES[msgIndex % AUTO_MESSAGES.length];
        const content = language === 'ur' ? autoMsg.ur : autoMsg.en;
        
        addMessage('ai', content);
        speak(content);
        
        msgIndex++;
      }, 15000);
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }

    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [isAutoMode, isOpen, language]);

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const addMessage = (role: 'user' | 'ai' | 'system', content: string, action?: Message['action']) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      action
    }]);
  };

  const detectIntent = (input: string): { route: string; response: string } | null => {
    const lowerInput = input.toLowerCase();
    
    for (const [keywords, data] of Object.entries(INTENT_MAP)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(kw => lowerInput.includes(kw))) {
        return {
          route: data.route,
          response: language === 'ur' ? data.responseUrdu : data.response
        };
      }
    }
    
    return null;
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    
    addMessage('user', text);
    setInputText('');
    setIsProcessing(true);
    setShowQuickActions(false);

    const intent = detectIntent(text);

    if (isAutoMode && intent) {
      await performLiveAction(intent, text);
      addMessage('ai', intent.response, intent.route ? { type: 'navigate', target: intent.route } : undefined);
      setIsProcessing(false);
    } else {
      setTimeout(() => {
        if (intent) {
          addMessage('ai', intent.response, intent.route ? { type: 'navigate', target: intent.route } : undefined);
          speak(intent.response);
          
          if (intent.route) {
            setTimeout(() => {
              router.push(intent.route);
            }, 1500);
          }
        } else {
          const defaultResponse = language === 'ur'
            ? 'میں آپ کی بات سمجھ گیا۔ آپ AI Agent استعمال کر کے مکمل قانونی خدمات حاصل کر سکتے ہیں۔'
            : 'I understand. You can use the AI Agent for complete legal services.';
          addMessage('ai', defaultResponse);
          speak(defaultResponse);
        }
        
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    addMessage('user', action.command);
    setShowQuickActions(false);
    
    setTimeout(() => {
      const response = language === 'ur'
        ? `${action.labelUrdu} کے لیے آپ کو لے جا رہا ہوں...`
        : `Taking you to ${action.label}...`;
      addMessage('ai', response, { type: 'navigate', target: action.route });
      speak(response);
      
      if (action.route) {
        setTimeout(() => router.push(action.route!), 1000);
      }
    }, 500);
  };

  const clearChat = () => {
    setMessages([]);
    setShowQuickActions(true);
  };

  const simulateTyping = async (text: string, speed: number = 50) => {
    setTypingDisplay('');
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, speed));
      setTypingDisplay(text.substring(0, i));
    }
  };

  const moveCursor = async (x: number, y: number) => {
    const steps = 20;
    const startX = cursorPosition.x;
    const startY = cursorPosition.y;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setCursorPosition({
        x: startX + (x - startX) * (i / steps),
        y: startY + (y - startY) * (i / steps)
      });
    }
  };

  const performLiveAction = async (intent: { route: string; response: string }, userInput: string) => {
    if (!isAutoMode) return;
    
    setShowLiveScreen(true);
    setIsAutoPerforming(true);
    setLiveActions([]);

    const actions: LiveAction[] = [
      {
        id: '1',
        type: 'think',
        description: 'Understanding your request...',
        descriptionUrdu: 'آپ کی درخواست سمجھ رہا ہوں...',
        progress: 0,
        status: 'pending'
      },
      {
        id: '2',
        type: 'type',
        description: 'Processing command...',
        descriptionUrdu: 'کمانڈ پر عمل ہو رہا ہے...',
        typingText: userInput,
        progress: 0,
        status: 'pending'
      }
    ];

    if (intent.route) {
      actions.push({
        id: '3',
        type: 'navigate',
        description: `Navigating to ${PAGE_INFO[intent.route]?.name || intent.route}...`,
        descriptionUrdu: `${PAGE_INFO[intent.route]?.nameUrdu || intent.route} پر جا رہا ہوں...`,
        target: intent.route,
        progress: 0,
        status: 'pending'
      });
    }

    actions.push({
      id: '4',
      type: 'speak',
      description: 'Speaking response...',
      descriptionUrdu: 'جواب بول رہا ہوں...',
      typingText: intent.response,
      progress: 0,
      status: 'pending'
    });

    actions.push({
      id: '5',
      type: 'complete',
      description: 'Task completed!',
      descriptionUrdu: 'کام مکمل!',
      progress: 0,
      status: 'pending'
    });

    setLiveActions(actions);

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      setCurrentAction(action);
      
      setLiveActions(prev => prev.map((a, idx) => ({
        ...a,
        status: idx < i ? 'completed' : idx === i ? 'in_progress' : 'pending'
      })));

      if (action.type === 'think') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else if (action.type === 'type' && action.typingText) {
        await simulateTyping(action.typingText, 40);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (action.type === 'navigate' && action.target) {
        await moveCursor(70, 30);
        await new Promise(resolve => setTimeout(resolve, 800));
      } else if (action.type === 'speak') {
        speak(intent.response);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else if (action.type === 'complete') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setLiveActions(prev => prev.map((a, idx) => ({
        ...a,
        status: idx <= i ? 'completed' : 'pending',
        progress: idx <= i ? 100 : 0
      })));
    }

    if (intent.route) {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(intent.route);
    }

    setIsAutoPerforming(false);
    setCurrentAction(null);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'agent': return <Zap className="text-yellow-400" size={16} />;
      case 'auto': return <RotateCcw className="text-green-400" size={16} />;
      default: return <MessageSquare className="text-blue-400" size={16} />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'agent': return language === 'ur' ? 'ایجنٹ' : 'Agent';
      case 'auto': return language === 'ur' ? 'آٹو' : 'Auto';
      default: return language === 'ur' ? 'اسسٹنٹ' : 'Assistant';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold shadow-2xl shadow-brand-primary/30 flex items-center justify-center group"
          >
            <Bot className="text-white" size={28} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded whitespace-nowrap">
              EHB AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden ${
              isExpanded 
                ? 'bottom-4 right-4 left-4 top-4 sm:left-auto sm:top-auto sm:bottom-6 sm:right-6 sm:w-[500px] sm:h-[700px]' 
                : 'bottom-6 right-6 w-[360px] h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-gold p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                  <Bot className="text-white" size={22} />
                  {isAutoMode && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-white"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    EHB AI
                    {getModeIcon()}
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      {getModeLabel()}
                    </span>
                  </h3>
                  <p className="text-white/70 text-[10px]">
                    {isSpeaking ? (language === 'ur' ? 'بول رہا ہوں...' : 'Speaking...') : 
                     isProcessing ? (language === 'ur' ? 'سوچ رہا ہوں...' : 'Thinking...') :
                     (language === 'ur' ? 'آن لائن' : 'Online')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                  className="p-1.5 rounded-lg bg-white/10 text-white text-[10px] font-bold hover:bg-white/20"
                >
                  {language === 'en' ? 'UR' : 'EN'}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-1 p-2 bg-white/5 border-b border-white/10">
              {[
                { id: 'assistant', icon: MessageSquare, label: language === 'ur' ? 'اسسٹنٹ' : 'Assistant' },
                { id: 'agent', icon: Zap, label: language === 'ur' ? 'ایجنٹ' : 'Agent' },
                { id: 'auto', icon: Monitor, label: language === 'ur' ? 'آٹو' : 'Auto', special: true }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id as AIMode);
                    if (m.id === 'auto') {
                      setIsAutoMode(true);
                      setShowLiveScreen(true);
                    } else {
                      setIsAutoMode(false);
                      setShowLiveScreen(false);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all relative ${
                    mode === m.id 
                      ? m.special ? 'bg-gradient-to-r from-green-500 to-brand-gold text-white' : 'bg-brand-gold text-brand-dark'
                      : 'bg-white/5 text-ehb-textMuted hover:bg-white/10'
                  }`}
                >
                  <m.icon size={14} />
                  {m.label}
                  {m.special && mode !== m.id && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Live Action Screen for Auto Mode */}
            <AnimatePresence>
              {showLiveScreen && isAutoMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/10 bg-slate-900/50"
                >
                  <div className="p-3">
                    {/* Live Screen Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-2 h-2 bg-red-500 rounded-full"
                          />
                          <span className="text-red-400 text-[10px] font-bold">LIVE</span>
                        </div>
                        <span className="text-ehb-textMuted text-[10px]">
                          {language === 'ur' ? 'AI اسکرین' : 'AI Screen'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowLiveScreen(false)}
                        className="text-ehb-textMuted hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Simulated Screen */}
                    <div className="relative bg-slate-800 rounded-lg border border-slate-700 overflow-hidden" style={{ minHeight: '120px' }}>
                      {/* Browser-like header */}
                      <div className="flex items-center gap-2 px-2 py-1 bg-slate-700/50 border-b border-slate-600">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 flex items-center gap-1 px-2 py-0.5 bg-slate-800 rounded text-[9px] text-ehb-textMuted">
                          <Globe size={10} />
                          <span>ehb-law.com{pathname}</span>
                        </div>
                      </div>

                      {/* Screen Content */}
                      <div className="p-3 relative" style={{ minHeight: '90px' }}>
                        {/* Virtual Cursor */}
                        {isAutoPerforming && (
                          <motion.div
                            animate={{ x: cursorPosition.x, y: cursorPosition.y }}
                            className="absolute pointer-events-none z-10"
                            style={{ left: `${cursorPosition.x}%`, top: `${cursorPosition.y}%` }}
                          >
                            <MousePointer className="text-brand-gold drop-shadow-lg" size={16} />
                          </motion.div>
                        )}

                        {/* Current Action Display */}
                        {currentAction && (
                          <div className="space-y-2">
                            {currentAction.type === 'think' && (
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                >
                                  <Brain className="text-violet-400" size={16} />
                                </motion.div>
                                <span className="text-violet-400 text-xs">
                                  {language === 'ur' ? currentAction.descriptionUrdu : currentAction.description}
                                </span>
                              </div>
                            )}

                            {currentAction.type === 'type' && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Keyboard className="text-blue-400" size={14} />
                                  <span className="text-blue-400 text-[10px]">
                                    {language === 'ur' ? 'ٹائپ کر رہا ہوں...' : 'Typing...'}
                                  </span>
                                </div>
                                <div className="bg-slate-700/50 rounded px-2 py-1.5 font-mono text-xs text-green-400">
                                  {typingDisplay}
                                  <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="text-brand-gold"
                                  >
                                    |
                                  </motion.span>
                                </div>
                              </div>
                            )}

                            {currentAction.type === 'navigate' && currentAction.target && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Navigation className="text-cyan-400" size={14} />
                                  <span className="text-cyan-400 text-[10px]">
                                    {language === 'ur' ? 'نیویگیٹ کر رہا ہوں...' : 'Navigating...'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-cyan-500/10 rounded">
                                  {PAGE_INFO[currentAction.target] && (
                                    <>
                                      {React.createElement(PAGE_INFO[currentAction.target].icon, { size: 14, className: 'text-cyan-400' })}
                                      <span className="text-cyan-400 text-xs font-medium">
                                        {language === 'ur' 
                                          ? PAGE_INFO[currentAction.target].nameUrdu 
                                          : PAGE_INFO[currentAction.target].name}
                                      </span>
                                    </>
                                  )}
                                  <ArrowRight className="text-cyan-400" size={12} />
                                </div>
                              </div>
                            )}

                            {currentAction.type === 'speak' && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                  >
                                    <Volume2 className="text-orange-400" size={14} />
                                  </motion.div>
                                  <span className="text-orange-400 text-[10px]">
                                    {language === 'ur' ? 'بول رہا ہوں...' : 'Speaking...'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      animate={{ height: [4, 16, 4] }}
                                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                      className="w-1 bg-orange-400 rounded-full"
                                      style={{ height: 4 }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {currentAction.type === 'complete' && (
                              <div className="flex items-center justify-center gap-2 py-2">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <CheckCircle2 className="text-green-400" size={20} />
                                </motion.div>
                                <span className="text-green-400 text-sm font-medium">
                                  {language === 'ur' ? currentAction.descriptionUrdu : currentAction.description}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Steps */}
                    {liveActions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {liveActions.map((action, idx) => (
                          <div
                            key={action.id}
                            className={`flex items-center gap-2 px-2 py-1 rounded text-[10px] ${
                              action.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              action.status === 'in_progress' ? 'bg-brand-gold/10 text-brand-gold' :
                              'bg-white/5 text-slate-500'
                            }`}
                          >
                            {action.status === 'completed' ? (
                              <CheckCircle2 size={10} />
                            ) : action.status === 'in_progress' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Loader2 size={10} />
                              </motion.div>
                            ) : (
                              <CircleDot size={10} />
                            )}
                            <span>{language === 'ur' ? action.descriptionUrdu : action.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ height: isExpanded ? 'calc(100% - 200px)' : showLiveScreen && isAutoMode ? '150px' : '280px' }}>
              {messages.length === 0 && showQuickActions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <Sparkles className="text-brand-gold mx-auto mb-3" size={32} />
                  <h4 className="text-white font-bold text-sm mb-1">
                    {language === 'ur' ? 'میں EHB AI ہوں' : 'I am EHB AI'}
                  </h4>
                  <p className="text-ehb-textMuted text-xs mb-4">
                    {language === 'ur' 
                      ? 'آواز یا ٹیکسٹ سے کمانڈ دیں'
                      : 'Give commands via voice or text'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.slice(0, 4).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action)}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-all"
                      >
                        <action.icon className="text-brand-gold" size={16} />
                        <span className="text-white text-xs">
                          {language === 'ur' ? action.labelUrdu : action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-br-sm'
                      : msg.role === 'system'
                      ? 'bg-brand-gold/20 text-brand-gold'
                      : 'bg-white/10 text-white rounded-bl-sm'
                  }`}>
                    <p className="text-xs">{msg.content}</p>
                    {msg.action && msg.action.type === 'navigate' && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70">
                        <ArrowRight size={10} />
                        {msg.action.target}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-3 py-2 rounded-bl-sm">
                    <div className="flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-white rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              {/* Auto Mode Indicator */}
              {isAutoMode && (
                <div className="flex items-center justify-between mb-2 px-2 py-1.5 bg-gradient-to-r from-green-500/10 to-brand-gold/10 rounded-lg border border-green-500/20">
                  <span className="text-green-400 text-[10px] flex items-center gap-1">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      <RotateCcw size={12} />
                    </motion.div>
                    {language === 'ur' ? 'آٹو موڈ فعال' : 'Auto Mode Active'}
                    {isAutoPerforming && (
                      <span className="ml-1 px-1 py-0.5 bg-red-500/20 text-red-400 rounded text-[8px]">
                        LIVE
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowLiveScreen(!showLiveScreen)}
                      className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded ${
                        showLiveScreen ? 'bg-brand-gold/20 text-brand-gold' : 'text-ehb-textMuted hover:text-white'
                      }`}
                    >
                      <Monitor size={10} />
                      {language === 'ur' ? 'اسکرین' : 'Screen'}
                    </button>
                    <button
                      onClick={() => { setIsAutoMode(false); setShowLiveScreen(false); setIsAutoPerforming(false); }}
                      className="text-[10px] text-red-400 hover:text-red-300"
                    >
                      {language === 'ur' ? 'بند' : 'Stop'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={language === 'ur' ? 'پیغام لکھیں...' : 'Type message...'}
                  className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="p-2.5 rounded-xl bg-orange-500 text-white"
                  >
                    <VolumeX size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-brand-gold text-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between mt-2 px-1">
                <button
                  onClick={clearChat}
                  className="text-[10px] text-ehb-textMuted hover:text-white"
                >
                  {language === 'ur' ? 'صاف کریں' : 'Clear'}
                </button>
                <span className="text-[10px] text-slate-500">
                  {pathname}
                </span>
                <button
                  onClick={() => router.push('/ai-agent')}
                  className="text-[10px] text-brand-gold hover:text-brand-gold/80 flex items-center gap-1"
                >
                  {language === 'ur' ? 'پورا AI کھولیں' : 'Full AI'}
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
