'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Send, Paperclip, Image, File, Mic,
  Video, Phone, Bell, Clock, Check, CheckCheck,
  User, Scale, X, Calendar, AlertCircle, Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'lawyer' | 'system';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{ name: string; type: string; url: string }>;
}

interface Notification {
  id: string;
  type: 'message' | 'hearing' | 'document' | 'payment' | 'status';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface SmartCommunicationProps {
  caseId: string;
  lawyerName: string;
  lawyerImage?: string;
  language?: 'en' | 'ur';
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'lawyer',
    senderName: 'Adv. Ahmed Khan',
    senderType: 'lawyer',
    content: 'Assalam o Alaikum! I have reviewed your case documents. Everything looks good. I will start preparing the legal notice.',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read'
  },
  {
    id: '2',
    senderId: 'client',
    senderName: 'You',
    senderType: 'client',
    content: 'Walaikum Assalam! Thank you. How long will it take?',
    timestamp: new Date(Date.now() - 3000000),
    status: 'read'
  },
  {
    id: '3',
    senderId: 'lawyer',
    senderName: 'Adv. Ahmed Khan',
    senderType: 'lawyer',
    content: 'I will prepare the draft within 2-3 days. I will share it with you for review before sending.',
    timestamp: new Date(Date.now() - 2400000),
    status: 'read'
  },
  {
    id: '4',
    senderId: 'system',
    senderName: 'System',
    senderType: 'system',
    content: '📅 Reminder: Consultation call scheduled for tomorrow at 3:00 PM',
    timestamp: new Date(Date.now() - 1800000),
    status: 'read'
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message from lawyer',
    titleUrdu: 'وکیل کا نیا پیغام',
    description: 'Adv. Ahmed Khan sent you a message',
    descriptionUrdu: 'ایڈووکیٹ احمد خان نے آپ کو پیغام بھیجا',
    timestamp: new Date(Date.now() - 300000),
    isRead: false
  },
  {
    id: '2',
    type: 'hearing',
    title: 'Upcoming consultation',
    titleUrdu: 'آنے والی مشاورت',
    description: 'You have a consultation call tomorrow at 3:00 PM',
    descriptionUrdu: 'کل شام 3 بجے آپ کی مشاورت کال ہے',
    timestamp: new Date(Date.now() - 600000),
    isRead: false
  },
  {
    id: '3',
    type: 'document',
    title: 'Document uploaded',
    titleUrdu: 'دستاویز اپ لوڈ ہو گئی',
    description: 'Your lawyer uploaded a new document',
    descriptionUrdu: 'آپ کے وکیل نے نئی دستاویز اپ لوڈ کی',
    timestamp: new Date(Date.now() - 1200000),
    isRead: true
  },
  {
    id: '4',
    type: 'status',
    title: 'Case status updated',
    titleUrdu: 'کیس کی حیثیت اپڈیٹ ہوئی',
    description: 'Your case status changed to "Documents Review"',
    descriptionUrdu: 'آپ کے کیس کی حیثیت "دستاویزات کا جائزہ" میں تبدیل ہوئی',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true
  }
];

export default function SmartCommunication({ caseId, lawyerName, lawyerImage, language = 'en' }: SmartCommunicationProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'client',
      senderName: 'You',
      senderType: 'client',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'delivered' as const } : m));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, status: 'read' as const } : m));
    }, 2000);

    setTimeout(() => {
      setIsTyping(true);
    }, 3000);

    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'lawyer',
        senderName: lawyerName,
        senderType: 'lawyer',
        content: 'Thank you for your message. I will review and get back to you shortly.',
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, reply]);
    }, 5000);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="text-blue-400" size={20} />;
      case 'hearing': return <Calendar className="text-purple-400" size={20} />;
      case 'document': return <File className="text-green-400" size={20} />;
      case 'payment': return <AlertCircle className="text-orange-400" size={20} />;
      default: return <Bell className="text-brand-gold" size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="text-ehb-textMuted" size={14} />;
      case 'delivered': return <CheckCheck className="text-ehb-textMuted" size={14} />;
      case 'read': return <CheckCheck className="text-blue-400" size={14} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-t-2xl border border-white/10 border-b-0"
      >
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 px-6 font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chat' 
                ? 'text-white border-b-2 border-brand-gold bg-white/5' 
                : 'text-ehb-textMuted hover:text-white'
            }`}
          >
            <MessageSquare size={20} />
            {language === 'ur' ? 'چیٹ' : 'Chat'}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-4 px-6 font-medium flex items-center justify-center gap-2 transition-all relative ${
              activeTab === 'notifications' 
                ? 'text-white border-b-2 border-brand-gold bg-white/5' 
                : 'text-ehb-textMuted hover:text-white'
            }`}
          >
            <Bell size={20} />
            {language === 'ur' ? 'اطلاعات' : 'Notifications'}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-[calc(50%-40px)] w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Lawyer Info (Chat Tab) */}
        {activeTab === 'chat' && (
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center text-white font-bold text-lg">
                {lawyerName.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <h3 className="text-white font-bold">{lawyerName}</h3>
                <p className="text-green-400 text-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  {language === 'ur' ? 'آن لائن' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                <Phone size={20} />
              </button>
              <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
                <Video size={20} />
              </button>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-x border-white/10"
      >
        {activeTab === 'chat' ? (
          <>
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.senderType === 'system' ? (
                    <div className="bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-xl text-sm text-center">
                      {message.content}
                    </div>
                  ) : (
                    <div className={`max-w-[75%] ${message.senderType === 'client' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.senderType === 'client'
                          ? 'bg-brand-primary text-white rounded-br-sm'
                          : 'bg-white/10 text-white rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
                        message.senderType === 'client' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.senderType === 'client' && getStatusIcon(message.status)}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="bg-white/10 rounded-2xl px-4 py-3 rounded-bl-sm">
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-ehb-textMuted hover:text-white transition-all"
                >
                  <Paperclip size={20} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={language === 'ur' ? 'پیغام لکھیں...' : 'Type a message...'}
                  className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-brand-gold text-brand-dark rounded-xl hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Notifications */
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-ehb-textMuted">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p>{language === 'ur' ? 'کوئی اطلاع نہیں' : 'No notifications'}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    notification.isRead 
                      ? 'bg-white/5 hover:bg-white/10' 
                      : 'bg-white/10 border-l-4 border-brand-gold hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {language === 'ur' ? notification.titleUrdu : notification.title}
                      </p>
                      <p className="text-ehb-textMuted text-sm mt-1">
                        {language === 'ur' ? notification.descriptionUrdu : notification.description}
                      </p>
                      <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-gold flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-b-2xl border border-white/10 border-t-0 p-4"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm whitespace-nowrap hover:bg-white/20 transition-all">
            <Sparkles size={16} className="text-brand-gold" />
            {language === 'ur' ? 'AI مدد' : 'AI Help'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm whitespace-nowrap hover:bg-white/20 transition-all">
            <File size={16} />
            {language === 'ur' ? 'دستاویزات' : 'Documents'}
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm whitespace-nowrap hover:bg-white/20 transition-all"
          >
            <Calendar size={16} />
            {language === 'ur' ? 'میٹنگ طے کریں' : 'Schedule Meeting'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm whitespace-nowrap hover:bg-white/20 transition-all">
            <Scale size={16} />
            {language === 'ur' ? 'کیس حیثیت' : 'Case Status'}
          </button>
        </div>
      </motion.div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">
                  {language === 'ur' ? 'مشاورت طے کریں' : 'Schedule Consultation'}
                </h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-ehb-textMuted hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-ehb-textMuted text-sm mb-2 block">
                    {language === 'ur' ? 'تاریخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-ehb-textMuted text-sm mb-2 block">
                    {language === 'ur' ? 'وقت' : 'Time'}
                  </label>
                  <input
                    type="time"
                    className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-ehb-textMuted text-sm mb-2 block">
                    {language === 'ur' ? 'قسم' : 'Type'}
                  </label>
                  <select className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                    <option value="video">{language === 'ur' ? 'ویڈیو کال' : 'Video Call'}</option>
                    <option value="audio">{language === 'ur' ? 'آڈیو کال' : 'Audio Call'}</option>
                    <option value="in_person">{language === 'ur' ? 'ملاقات' : 'In Person'}</option>
                  </select>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl">
                  {language === 'ur' ? 'طے کریں' : 'Schedule'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
