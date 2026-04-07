'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, FileText, MessageSquare, Calendar, Clock, Download, Upload,
  CheckCircle2, Circle, AlertCircle, Video, Phone, Scale, Star, MapPin,
  ChevronRight, Edit, Trash2, Eye, Plus, Send, Paperclip, MoreVertical,
  Gavel, Users, Shield, Crown, Zap, TrendingUp, Bell
} from 'lucide-react';

const CASE_DATA = {
  id: 'EHB-CASE-2026-001',
  title: 'Divorce Case - Khula Filing',
  category: 'Family Law',
  subCategory: 'Divorce / Khula',
  status: 'in_progress',
  progress: 45,
  created: '2026-03-01',
  urgency: 'Medium',
  location: 'Lahore, Pakistan',
  description: 'Mutual consent divorce case with asset division. Client seeks Khula with fair distribution of shared property and custody arrangement for two children.',
  lawyer: {
    id: 'lawyer-1',
    name: 'Sarah Ahmed',
    title: 'Family Law Specialist',
    image: '👩‍⚖️',
    rating: 4.9,
    reviews: 156,
    experience: '12 years',
    phone: '+92 300 1234567',
    email: 'sarah.ahmed@ehblaw.com'
  },
  client: {
    name: 'Ayesha Khan',
    email: 'ayesha.k@email.com',
    phone: '+92 321 9876543'
  },
  financials: {
    totalPaid: 750,
    totalDue: 450,
    currency: 'USD'
  }
};

const TIMELINE = [
  { 
    id: 1, 
    date: '2026-03-01', 
    time: '10:30 AM',
    title: 'Case Created', 
    description: 'Legal case filed and initial documentation submitted.',
    status: 'completed',
    icon: FileText
  },
  { 
    id: 2, 
    date: '2026-03-02', 
    time: '02:15 PM',
    title: 'Documents Verified', 
    description: 'All submitted documents have been verified and accepted.',
    status: 'completed',
    icon: CheckCircle2
  },
  { 
    id: 3, 
    date: '2026-03-05', 
    time: '11:00 AM',
    title: 'Lawyer Assigned', 
    description: 'Adv. Sarah Ahmed has been assigned to your case.',
    status: 'completed',
    icon: Users
  },
  { 
    id: 4, 
    date: '2026-03-08', 
    time: '03:00 PM',
    title: 'Initial Consultation', 
    description: 'Video consultation completed. Strategy discussed.',
    status: 'completed',
    icon: Video
  },
  { 
    id: 5, 
    date: '2026-03-12', 
    time: '10:00 AM',
    title: 'Legal Notice Drafted', 
    description: 'Lawyer is preparing the legal notice for submission.',
    status: 'current',
    icon: Edit
  },
  { 
    id: 6, 
    date: '2026-03-15', 
    time: 'Scheduled',
    title: 'Court Filing', 
    description: 'Case will be filed in Family Court.',
    status: 'pending',
    icon: Gavel
  },
  { 
    id: 7, 
    date: '2026-03-20', 
    time: 'Scheduled',
    title: 'First Hearing', 
    description: 'Initial court appearance scheduled.',
    status: 'pending',
    icon: Scale
  },
];

const DOCUMENTS = [
  { id: 1, name: 'Marriage_Certificate.pdf', size: '2.4 MB', type: 'pdf', uploaded: '2026-03-01', status: 'verified' },
  { id: 2, name: 'National_ID_Card.jpg', size: '1.1 MB', type: 'image', uploaded: '2026-03-01', status: 'verified' },
  { id: 3, name: 'Property_Documents.pdf', size: '5.2 MB', type: 'pdf', uploaded: '2026-03-01', status: 'verified' },
  { id: 4, name: 'Legal_Notice_Draft.docx', size: '450 KB', type: 'doc', uploaded: '2026-03-10', status: 'review' },
  { id: 5, name: 'Bank_Statements.pdf', size: '3.8 MB', type: 'pdf', uploaded: '2026-03-05', status: 'pending' },
];

const MESSAGES = [
  { id: 1, sender: 'lawyer', name: 'Sarah Ahmed', message: 'I have reviewed your documents. Everything looks good. We can proceed with the legal notice.', time: '2 hours ago' },
  { id: 2, sender: 'client', name: 'You', message: 'Thank you! When can we expect the first hearing date?', time: '1 hour ago' },
  { id: 3, sender: 'lawyer', name: 'Sarah Ahmed', message: 'I\'ll file the case this week. The hearing date will be assigned by the court, usually within 2-3 weeks.', time: '45 mins ago' },
];

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'messages'>('timeline');
  const [messageText, setMessageText] = useState('');

  const caseId = params.id as string;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'current': return 'bg-blue-500 animate-pulse';
      case 'pending': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-ehb-textMuted border-slate-500/30';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-ehb-textMuted hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Case Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  CASE_DATA.status === 'in_progress' 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  IN PROGRESS
                </span>
                <span className="text-ehb-textMuted text-sm font-mono">{CASE_DATA.id}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{CASE_DATA.title}</h1>
              <p className="text-ehb-textMuted mb-4">{CASE_DATA.category} • {CASE_DATA.subCategory}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-ehb-textMuted">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Created: {new Date(CASE_DATA.created).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {CASE_DATA.location}
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow-400" />
                  Urgency: {CASE_DATA.urgency}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/chat/${caseId}`}
                className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <MessageSquare size={18} />
                Chat
              </Link>
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2">
                <Video size={18} />
                Schedule Call
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-ehb-textMuted">Case Progress</span>
              <span className="text-[#D4AF37] font-bold">{CASE_DATA.progress}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${CASE_DATA.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Timeline/Documents/Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-[#D4AF37] text-slate-900' 
                      : 'text-ehb-textMuted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Timeline */}
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-[#D4AF37]" size={20} />
                    Case Timeline
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-700" />
                    
                    <div className="space-y-6">
                      {TIMELINE.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex gap-4"
                        >
                          {/* Dot */}
                          <div className={`w-10 h-10 rounded-full ${getStatusColor(event.status)} flex items-center justify-center z-10 shrink-0`}>
                            <event.icon className="text-white" size={18} />
                          </div>
                          
                          {/* Content */}
                          <div className={`flex-1 pb-6 ${event.status === 'current' ? 'bg-blue-500/10 -mx-4 px-4 py-4 rounded-xl border border-blue-500/30' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-ehb-textMuted">{event.date}</span>
                              <span className="text-xs text-ehb-textMuted">•</span>
                              <span className="text-xs text-ehb-textMuted">{event.time}</span>
                              {event.status === 'current' && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">CURRENT</span>
                              )}
                            </div>
                            <h4 className="text-white font-bold mb-1">{event.title}</h4>
                            <p className="text-sm text-ehb-textMuted">{event.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Documents */}
              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="text-[#D4AF37]" size={20} />
                      Case Documents
                    </h3>
                    <button className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37]/30 transition-all flex items-center gap-2">
                      <Upload size={16} />
                      Upload
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {DOCUMENTS.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                            <FileText className="text-[#D4AF37]" size={20} />
                          </div>
                          <div>
                            <p className="text-white font-medium mb-1">{doc.name}</p>
                            <div className="flex items-center gap-3 text-xs text-ehb-textMuted">
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>Uploaded {new Date(doc.uploaded).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getDocStatusBadge(doc.status)}`}>
                            {doc.status.toUpperCase()}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 hover:bg-white/10 rounded-lg">
                              <Eye className="text-ehb-textMuted" size={16} />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg">
                              <Download className="text-ehb-textMuted" size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="text-[#D4AF37]" size={20} />
                      Messages with Lawyer
                    </h3>
                  </div>
                  
                  {/* Messages List */}
                  <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                    {MESSAGES.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${msg.sender === 'client' ? 'order-2' : ''}`}>
                          <div className={`px-4 py-3 rounded-2xl ${
                            msg.sender === 'client' 
                              ? 'bg-[#D4AF37] text-slate-900 rounded-br-sm' 
                              : 'bg-slate-800 text-white rounded-bl-sm'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className={`text-xs text-ehb-textMuted mt-1 ${msg.sender === 'client' ? 'text-right' : ''}`}>
                            {msg.name} • {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10 bg-slate-900/50">
                    <div className="flex gap-3">
                      <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                        <Paperclip className="text-ehb-textMuted" size={18} />
                      </button>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      />
                      <button className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Assigned Lawyer */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-ehb-textMuted uppercase tracking-wider mb-4">Assigned Lawyer</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                  {CASE_DATA.lawyer.image}
                </div>
                <div>
                  <h4 className="text-white font-bold">{CASE_DATA.lawyer.name}</h4>
                  <p className="text-sm text-ehb-textMuted">{CASE_DATA.lawyer.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={12} />
                    <span className="text-white text-sm font-bold">{CASE_DATA.lawyer.rating}</span>
                    <span className="text-ehb-textMuted text-xs">({CASE_DATA.lawyer.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-ehb-textMuted">
                  <Phone size={14} />
                  {CASE_DATA.lawyer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-ehb-textMuted">
                  <MessageSquare size={14} />
                  {CASE_DATA.lawyer.email}
                </div>
              </div>
              
              <Link
                href={`/lawyer/${CASE_DATA.lawyer.id}`}
                className="w-full py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg text-center hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                View Profile <ChevronRight size={16} />
              </Link>
            </div>

            {/* Case Summary */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-ehb-textMuted uppercase tracking-wider mb-4">Case Summary</h3>
              <p className="text-ehb-textBody text-sm leading-relaxed">
                {CASE_DATA.description}
              </p>
            </div>

            {/* Financials */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-amber-500/10 border border-[#D4AF37]/30 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4">Financials</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">Total Paid</span>
                  <span className="text-emerald-400 font-bold">${CASE_DATA.financials.totalPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ehb-textMuted">Amount Due</span>
                  <span className="text-orange-400 font-bold">${CASE_DATA.financials.totalDue}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-[#D4AF37] font-bold text-lg">${CASE_DATA.financials.totalPaid + CASE_DATA.financials.totalDue}</span>
                </div>
              </div>
              
              {CASE_DATA.financials.totalDue > 0 && (
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                  Pay ${CASE_DATA.financials.totalDue}
                </button>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-ehb-textMuted uppercase tracking-wider mb-4">Next Steps</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <Gavel className="text-blue-400" size={18} />
                  <div>
                    <p className="text-white text-sm font-medium">Court Filing</p>
                    <p className="text-xs text-ehb-textMuted">Mar 15, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Calendar className="text-ehb-textMuted" size={18} />
                  <div>
                    <p className="text-white text-sm font-medium">First Hearing</p>
                    <p className="text-xs text-ehb-textMuted">Mar 20, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
