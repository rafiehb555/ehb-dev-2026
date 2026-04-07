'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Send, Paperclip, Mic, Phone, Video, MoreVertical, Search,
  Image, FileText, Download, CheckCheck, Clock, Star, Shield, Smile,
  Calendar, Info, X, ChevronDown, User, Bot, Scale
} from 'lucide-react';

interface Message {
  id: number;
  sender: 'client' | 'lawyer' | 'system';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'image' | 'system';
  fileName?: string;
  fileSize?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'system',
    content: 'Chat started for Case #EHB-CASE-2026-001',
    timestamp: '2026-03-10 09:00 AM',
    status: 'read',
    type: 'system'
  },
  {
    id: 2,
    sender: 'lawyer',
    content: 'Hello! I\'m Sarah Ahmed, your assigned lawyer for the divorce case. I\'ve reviewed your initial documents and have a few questions.',
    timestamp: '2026-03-10 09:15 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 3,
    sender: 'client',
    content: 'Hi Sarah! Thank you for taking my case. I\'m ready to answer any questions.',
    timestamp: '2026-03-10 09:20 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 4,
    sender: 'lawyer',
    content: 'Great! First, could you confirm when you and your spouse got married? I need the exact date for the legal notice.',
    timestamp: '2026-03-10 09:25 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 5,
    sender: 'client',
    content: 'We got married on June 15, 2018. I\'ve uploaded the marriage certificate as well.',
    timestamp: '2026-03-10 09:30 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 6,
    sender: 'client',
    content: 'Marriage_Certificate.pdf',
    timestamp: '2026-03-10 09:31 AM',
    status: 'read',
    type: 'file',
    fileName: 'Marriage_Certificate.pdf',
    fileSize: '2.4 MB'
  },
  {
    id: 7,
    sender: 'lawyer',
    content: 'Perfect, I\'ve received the certificate. I\'ll start drafting the legal notice today. Do you have any specific concerns about the asset division?',
    timestamp: '2026-03-10 09:45 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 8,
    sender: 'client',
    content: 'Yes, we jointly own a house and have two cars. I\'d like to discuss how these will be divided.',
    timestamp: '2026-03-10 10:00 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 9,
    sender: 'lawyer',
    content: 'I understand. For the house, we have several options including selling it and splitting the proceeds, or one party buying out the other\'s share. Let\'s schedule a video call tomorrow to discuss this in detail.',
    timestamp: '2026-03-10 10:15 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: 10,
    sender: 'system',
    content: 'Video consultation scheduled for March 11, 2026 at 2:00 PM',
    timestamp: '2026-03-10 10:20 AM',
    status: 'read',
    type: 'system'
  },
];

const LAWYER_INFO = {
  name: 'Sarah Ahmed',
  title: 'Family Law Specialist',
  image: '👩‍⚖️',
  rating: 4.9,
  status: 'online',
  lastSeen: 'Active now'
};

const QUICK_REPLIES = [
  'Thank you!',
  'Yes, that works.',
  'Can we schedule a call?',
  'I have a question.',
  'Please send me the document.',
];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const caseId = params.caseId as string;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'client',
      content: messageText,
      timestamp: new Date().toLocaleString(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setShowQuickReplies(false);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const lawyerResponse: Message = {
        id: messages.length + 2,
        sender: 'lawyer',
        content: getAutoResponse(messageText),
        timestamp: new Date().toLocaleString(),
        status: 'read',
        type: 'text'
      };
      setMessages(prev => [...prev, lawyerResponse]);
    }, 3000);
  };

  const getAutoResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('thank')) {
      return "You're welcome! Don't hesitate to reach out if you have any more questions.";
    }
    if (lower.includes('call') || lower.includes('schedule')) {
      return "I have availability tomorrow between 2-5 PM. Would any of those times work for you?";
    }
    if (lower.includes('document') || lower.includes('send')) {
      return "I'll prepare the documents and send them over shortly. Please review them carefully before signing.";
    }
    if (lower.includes('question')) {
      return "Of course! Please go ahead and ask your question. I'm here to help.";
    }
    return "Thank you for the update. I'll review this and get back to you with my thoughts shortly.";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCheck className="text-blue-400" size={14} />;
      case 'delivered': return <CheckCheck className="text-slate-500" size={14} />;
      default: return <Clock className="text-slate-600" size={14} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-2xl">
                    {LAWYER_INFO.image}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#020617]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-white font-bold">{LAWYER_INFO.name}</h1>
                    <Shield className="text-blue-400" size={14} />
                  </div>
                  <p className="text-xs text-emerald-400">{LAWYER_INFO.lastSeen}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                <Phone className="text-white" size={18} />
              </button>
              <button className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                <Video className="text-white" size={18} />
              </button>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                <Info className="text-white" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Case Info Bar */}
        <div className="bg-slate-900/50 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="text-[#D4AF37]" size={14} />
              <span className="text-xs text-ehb-textMuted">Case: </span>
              <span className="text-xs text-white font-mono">{caseId}</span>
            </div>
            <Link href={`/case/${caseId}`} className="text-xs text-[#D4AF37] hover:underline">
              View Case Details
            </Link>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900/80 backdrop-blur-sm border-b border-white/10 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Lawyer</p>
                  <p className="text-sm text-white font-medium">{LAWYER_INFO.name}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Specialization</p>
                  <p className="text-sm text-white font-medium">{LAWYER_INFO.title}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Rating</p>
                  <p className="text-sm text-white font-medium flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={12} />
                    {LAWYER_INFO.rating}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Response Time</p>
                  <p className="text-sm text-emerald-400 font-medium">Usually within 1 hour</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'client' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              {message.type === 'system' ? (
                <div className="px-4 py-2 bg-white/5 rounded-full">
                  <p className="text-xs text-slate-500">{message.content}</p>
                </div>
              ) : (
                <div className={`max-w-[75%] ${message.sender === 'client' ? 'order-2' : ''}`}>
                  {message.sender === 'lawyer' && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">{LAWYER_INFO.name}</span>
                    </div>
                  )}
                  
                  {message.type === 'file' ? (
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'client' 
                        ? 'bg-[#D4AF37] rounded-br-sm' 
                        : 'bg-slate-800 rounded-bl-sm'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          message.sender === 'client' ? 'bg-slate-900/30' : 'bg-white/10'
                        }`}>
                          <FileText size={20} className={message.sender === 'client' ? 'text-slate-900' : 'text-[#D4AF37]'} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${message.sender === 'client' ? 'text-slate-900' : 'text-white'}`}>
                            {message.fileName}
                          </p>
                          <p className={`text-xs ${message.sender === 'client' ? 'text-slate-700' : 'text-slate-500'}`}>
                            {message.fileSize}
                          </p>
                        </div>
                        <button className={`p-2 rounded-lg ${
                          message.sender === 'client' ? 'hover:bg-slate-900/20' : 'hover:bg-white/10'
                        }`}>
                          <Download size={16} className={message.sender === 'client' ? 'text-slate-900' : 'text-ehb-textMuted'} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'client' 
                        ? 'bg-[#D4AF37] text-slate-900 rounded-br-sm' 
                        : 'bg-slate-800 text-white rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                  
                  <div className={`flex items-center gap-2 mt-1 ${message.sender === 'client' ? 'justify-end' : ''}`}>
                    <span className="text-[10px] text-slate-600">
                      {message.timestamp.split(' ').slice(-2).join(' ')}
                    </span>
                    {message.sender === 'client' && getStatusIcon(message.status)}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <AnimatePresence>
        {showQuickReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-slate-900/50"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="sticky bottom-0 bg-[#020617]/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
              <Paperclip className="text-ehb-textMuted" size={20} />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                onFocus={() => setShowQuickReplies(true)}
                placeholder="Type your message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-[#D4AF37] transition-all"
              />
              <button 
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg"
              >
                <ChevronDown className={`text-slate-500 transition-transform ${showQuickReplies ? 'rotate-180' : ''}`} size={18} />
              </button>
            </div>
            
            <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
              <Mic className="text-ehb-textMuted" size={20} />
            </button>
            
            <button 
              onClick={() => sendMessage()}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50"
            >
              <Send className="text-slate-900" size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
