'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Send, Cpu, Bot, User, Loader2, 
  FileText, UserCheck, ShieldCheck, Scale,
  Sparkles, X, Maximize2, Minimize2,
  ArrowRight, BookOpen, Binary, Heart, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SUPPORTED_LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    greeting: "Hello! I am your EHB AI Legal Assistant. How can I help you today?",
    ui: {
      placeholder: "Ask a legal question...",
      thinking: "AI is thinking...",
      disclaimer: "EHB AI Assistant can make mistakes. Verify important legal info."
    }
  },
  { 
    code: 'ur', 
    name: 'Urdu', 
    greeting: "EHB Law Services mein khush aamdeed. Main aap ki AI legal assistant hoon.",
    ui: {
      placeholder: "Qanooni sawal poochein...",
      thinking: "AI soch raha hai...",
      disclaimer: "AI ghalti kar sakta hai. Aham qanooni maloomat ki tasdeeq karein."
    }
  },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'service-recommendation' | 'document' | 'security' | 'research' | 'knowledge-base';
  data?: any;
}

interface AILegalAssistantProps {
  isFloating?: boolean;
}

export default function AILegalAssistant({ isFloating = false }: AILegalAssistantProps) {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(isFloating);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ 
      id: '1', 
      role: 'assistant', 
      content: currentLanguage.greeting 
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = userInput.toLowerCase();
      let responseText = "I understand your question. Let me help you with that.";
      let additionalMessage: Message | null = null;

      if (lowerInput.includes('khula') || lowerInput.includes('divorce') || lowerInput.includes('talaq')) {
        responseText = "I can help you with divorce/khula cases. This is a family law matter that requires proper legal representation.";
        additionalMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "I've detected that you're asking about a divorce case.",
          type: 'service-recommendation',
          data: { 
            title: lowerInput.includes('khula') ? 'Khula Case' : 'Divorce Case',
            description: 'Marriage dissolution legal support.',
            icon: Heart
          }
        };
      } else if (lowerInput.includes('custody') || lowerInput.includes('child')) {
        responseText = "Child custody matters are sensitive and require experienced family law attorneys.";
        additionalMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "I can help you with child custody cases.",
          type: 'service-recommendation',
          data: { 
            title: 'Child Custody Case',
            description: 'Resolve child custody and guardianship disputes.',
            icon: Users
          }
        };
      } else if (lowerInput.includes('document') || lowerInput.includes('notice') || lowerInput.includes('contract')) {
        responseText = "I can help you generate legal documents.";
        additionalMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: "Would you like to use our AI Document Generator?",
          type: 'document',
          data: { title: "Legal Document Generator" }
        };
      } else if (lowerInput.includes('lawyer') || lowerInput.includes('attorney')) {
        responseText = "Finding the right lawyer is important for your case. I can help match you with verified legal professionals.";
      }

      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseText 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      if (additionalMessage) {
        setMessages(prev => [...prev, additionalMessage]);
      }
      setIsLoading(false);
    }, 1500);
  };

  if (isFloating && isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
      >
        <Bot size={24} className="sm:w-8 sm:h-8" />
      </button>
    );
  }

  const containerClasses = isFloating 
    ? "fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100%-2rem)] sm:w-[400px] h-[500px] sm:h-[600px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden"
    : "ms-card w-full h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col overflow-hidden bg-white";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="p-3 sm:p-4 bg-brand-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Cpu size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm">EHB Legal Assistant</h3>
            <p className="text-[9px] sm:text-[10px] text-white/70 flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              AI Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isFloating && (
            <button onClick={() => setIsMinimized(true)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Minimize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          )}
          {!isFloating && (
            <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Maximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="grow overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-stone-50"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] sm:max-w-[85%] flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200' : 'bg-brand-primary text-white'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="sm:w-4 sm:h-4" /> : <Bot size={14} className="sm:w-4 sm:h-4" />}
                </div>
                <div className="space-y-2">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-primary text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 shadow-sm rounded-tl-none text-slate-800'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Special Widgets */}
                  {msg.type === 'service-recommendation' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 sm:p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl sm:rounded-2xl space-y-2 sm:space-y-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-primary text-white flex items-center justify-center">
                          {msg.data?.icon ? <msg.data.icon size={18} className="sm:w-5 sm:h-5" /> : <Scale size={18} className="sm:w-5 sm:h-5" />}
                        </div>
                        <div>
                          <h4 className="text-[10px] sm:text-xs font-bold text-slate-900">{msg.data?.title}</h4>
                          <p className="text-[9px] sm:text-[10px] text-ehb-textMuted">{msg.data?.description}</p>
                        </div>
                      </div>
                      <Link 
                        href="/marketplace"
                        className="w-full py-1.5 sm:py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-2"
                      >
                        View Service Details <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                      </Link>
                    </motion.div>
                  )}

                  {msg.type === 'document' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 sm:p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl sm:rounded-2xl space-y-2 sm:space-y-3"
                    >
                      <div className="flex items-center gap-2 text-brand-primary">
                        <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest">AI Document Generator</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-ehb-textMuted">I can draft a professional legal document for you.</p>
                      <Link 
                        href="/document-generator"
                        className="w-full py-1.5 sm:py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-2"
                      >
                        Generate Draft <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                <Bot size={14} className="sm:w-4 sm:h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin text-brand-primary" />
                <span className="text-[10px] sm:text-xs text-ehb-textMuted">{currentLanguage.ui.thinking}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input 
            type="text" 
            placeholder={currentLanguage.ui.placeholder}
            className="w-full bg-stone-100 border-none rounded-xl sm:rounded-2xl pl-3 sm:pl-4 pr-10 sm:pr-12 py-3 sm:py-4 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary transition-all text-slate-900 placeholder:text-ehb-textMuted"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        <p className="text-[8px] sm:text-[9px] text-center text-ehb-textMuted mt-2 sm:mt-3 uppercase tracking-widest font-bold">
          {currentLanguage.ui.disclaimer}
        </p>
      </div>
    </div>
  );
}
