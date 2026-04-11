'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Video, Bell, Calendar, 
  Search, Phone, MoreVertical, Send,
  Paperclip, Clock, CheckCheck,
  ShieldCheck, Zap, Filter, Settings, Trash2, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CommunicationCenter() {
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications' | 'consultations'>('chat');
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const chats = [
    { id: 'c1', name: 'Adv. Ahmed Khan', lastMsg: 'I will review the contract today.', time: '10:30 AM', unread: 2, online: true },
    { id: 'c2', name: 'Maria Garcia (IP Expert)', lastMsg: 'The trademark filing is complete.', time: 'Yesterday', unread: 0, online: false },
    { id: 'c3', name: 'EHB Support', lastMsg: 'Your payment was confirmed.', time: '2 days ago', unread: 0, online: true },
  ];

  const notifications = [
    { id: 'n1', type: 'Case Update', title: 'Document Approved', desc: 'Your property deed has been verified by the lawyer.', time: '2 hours ago', icon: ShieldCheck, color: 'text-emerald-500' },
    { id: 'n2', type: 'Payment', title: 'Payment Received', desc: 'Client has deposited $1,200 into escrow.', time: '5 hours ago', icon: Zap, color: 'text-brand-primary' },
    { id: 'n3', type: 'Consultation', title: 'Meeting Reminder', desc: 'Video call with Adv. Ahmed starts in 30 mins.', time: 'Just now', icon: Video, color: 'text-orange-500' },
  ];

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 min-h-[600px] lg:h-[800px] flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">Communication Center</h1>
          <p className="text-xs sm:text-sm text-ehb-textMuted">Secure messaging, video calls, and real-time alerts.</p>
        </div>
        <div className="flex gap-1 sm:gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl overflow-x-auto">
          {[
            { id: 'chat', label: 'Messages', icon: MessageSquare },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'consultations', label: 'Meetings', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-brand-primary shadow-sm' 
                  : 'text-ehb-textMuted hover:text-ehb-textBody'
              }`}
            >
              <tab.icon size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grow flex gap-4 sm:gap-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grow flex flex-col lg:flex-row gap-4 sm:gap-8"
            >
              {/* Chat List */}
              <div className="lg:w-80 flex flex-col gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-ehb-textMuted" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search messages..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
                  />
                </div>
                <div className="grow overflow-y-auto space-y-2 custom-scrollbar max-h-60 lg:max-h-full">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 transition-all text-left ${
                        selectedChat?.id === chat.id 
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                          : 'hover:bg-slate-900 text-ehb-textMuted'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm sm:text-lg text-white">
                          {chat.name[0]}
                        </div>
                        {chat.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 sm:border-4 border-slate-950 rounded-full" />
                        )}
                      </div>
                      <div className="grow min-w-0">
                        <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                          <h4 className={`font-bold text-xs sm:text-sm truncate ${selectedChat?.id === chat.id ? 'text-white' : 'text-ehb-textBody'}`}>{chat.name}</h4>
                          <span className={`text-[8px] sm:text-[10px] shrink-0 ${selectedChat?.id === chat.id ? 'text-white/70' : 'text-ehb-textMuted'}`}>{chat.time}</span>
                        </div>
                        <p className={`text-[10px] sm:text-xs truncate ${selectedChat?.id === chat.id ? 'text-white/70' : 'text-ehb-textMuted'}`}>{chat.lastMsg}</p>
                      </div>
                      {chat.unread > 0 && selectedChat?.id !== chat.id && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold shrink-0">
                          {chat.unread}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="grow ms-card flex flex-col overflow-hidden min-h-[400px]">
                {selectedChat ? (
                  <>
                    <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-sm">
                          {selectedChat.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-white">{selectedChat.name}</h4>
                          <p className="text-[8px] sm:text-[10px] text-emerald-500 font-bold">Online</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg sm:rounded-xl transition-colors text-ehb-textMuted">
                          <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg sm:rounded-xl transition-colors text-ehb-textMuted">
                          <Video size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg sm:rounded-xl transition-colors text-ehb-textMuted">
                          <MoreVertical size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grow p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 bg-slate-900/50 custom-scrollbar">
                      <div className="flex justify-center">
                        <span className="px-2 sm:px-3 py-1 bg-slate-800 rounded-full text-[8px] sm:text-[10px] font-bold text-ehb-textMuted">Today</span>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 bg-slate-800 rounded-xl sm:rounded-2xl rounded-tl-none shadow-sm border border-slate-700">
                          <p className="text-xs sm:text-sm text-ehb-textBody">Hello! I have reviewed the property documents you sent yesterday.</p>
                          <p className="text-[8px] sm:text-[10px] text-ehb-textMuted mt-2">10:30 AM</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 bg-brand-primary text-white rounded-xl sm:rounded-2xl rounded-tr-none shadow-lg shadow-brand-primary/20">
                          <p className="text-xs sm:text-sm">Thank you, Ahmed. Are there any major legal issues detected?</p>
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <p className="text-[8px] sm:text-[10px] text-white/70">10:32 AM</p>
                            <CheckCheck size={10} className="sm:w-3 sm:h-3 text-white/70" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 bg-slate-800 rounded-xl sm:rounded-2xl rounded-tl-none shadow-sm border border-slate-700">
                          <p className="text-xs sm:text-sm text-ehb-textBody">The contract looks solid, but we should add a clause for the security deposit refund timeline.</p>
                          <p className="text-[8px] sm:text-[10px] text-ehb-textMuted mt-2">10:35 AM</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-t border-slate-800">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Type your message..."
                          className="w-full pl-3 sm:pl-4 pr-20 sm:pr-24 py-3 sm:py-4 bg-slate-800 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-white"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                          <button className="p-1.5 sm:p-2 text-ehb-textMuted hover:text-brand-primary transition-colors">
                            <Paperclip size={18} className="sm:w-5 sm:h-5" />
                          </button>
                          <button className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grow flex flex-col items-center justify-center text-center p-8 sm:p-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary/10 text-brand-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                      <MessageSquare size={32} className="sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Your Messages</h3>
                    <p className="text-xs sm:text-sm text-ehb-textMuted max-w-xs">Select a conversation to start chatting with your lawyer or consultant.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grow space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar pr-2 sm:pr-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-bold text-white text-sm sm:text-base">Recent Notifications</h3>
                <div className="flex gap-1 sm:gap-2">
                  <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg sm:rounded-xl text-ehb-textMuted transition-colors">
                    <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg sm:rounded-xl text-ehb-textMuted transition-colors">
                    <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
              
              {notifications.map((n) => (
                <div key={n.id} className="ms-card p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group hover:border-brand-primary/30 transition-all cursor-pointer">
                  <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 ${n.color} shrink-0`}>
                    <n.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-ehb-textMuted">{n.type}</p>
                      <span className="text-[8px] sm:text-[10px] text-ehb-textMuted">{n.time}</span>
                    </div>
                    <h4 className="font-bold mb-1 text-white text-sm sm:text-base">{n.title}</h4>
                    <p className="text-xs sm:text-sm text-ehb-textMuted">{n.desc}</p>
                  </div>
                  <div className="flex sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg text-ehb-textMuted hover:text-brand-primary">
                      <Archive size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg text-ehb-textMuted hover:text-rose-500">
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'consultations' && (
            <motion.div 
              key="consultations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grow grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="ms-card p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <Calendar size={40} className="sm:w-12 sm:h-12 text-brand-primary mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Schedule Consultation</h3>
                <p className="text-xs sm:text-sm text-ehb-textMuted mb-6 sm:mb-8">Book a video or audio call with a verified legal expert.</p>
                <button className="w-full py-3 sm:py-4 bg-brand-primary text-white rounded-xl sm:rounded-2xl font-bold text-sm shadow-lg shadow-brand-primary/20">
                  Book New Meeting
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <h3 className="font-bold mb-2 sm:mb-4 text-white text-sm sm:text-base">Upcoming Meetings</h3>
                <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-brand-primary/20 blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div>
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/50">Next Meeting</p>
                        <h4 className="font-bold text-white text-sm sm:text-base">Adv. Ahmed Khan</h4>
                      </div>
                      <div className="p-1.5 sm:p-2 bg-brand-primary rounded-lg sm:rounded-xl">
                        <Video size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-ehb-textBody">
                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5 text-brand-primary" />
                        Mar 12, 2026
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-ehb-textBody">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-brand-primary" />
                        11:00 AM
                      </div>
                    </div>
                    <button className="w-full py-2.5 sm:py-3 bg-white text-slate-900 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
