'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, CheckCircle2, AlertCircle, FileText, Scale,
  User, Briefcase, Calendar, ArrowRight, Bell,
  MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';

export interface CaseStage {
  id: string;
  name: string;
  nameUrdu: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  description?: string;
}

export interface CaseUpdate {
  id: string;
  type: 'status' | 'document' | 'message' | 'hearing';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  timestamp: Date;
  isRead: boolean;
}

interface CaseMonitoringProps {
  caseId: string;
  caseType: string;
  lawyerName: string;
  language?: 'en' | 'ur';
}

const DEFAULT_STAGES: CaseStage[] = [
  { id: '1', name: 'Case Created', nameUrdu: 'کیس بنایا گیا', status: 'completed', date: '2026-03-10' },
  { id: '2', name: 'Lawyer Reviewing', nameUrdu: 'وکیل جائزہ لے رہا ہے', status: 'completed', date: '2026-03-11' },
  { id: '3', name: 'Documents Submitted', nameUrdu: 'دستاویزات جمع ہوئیں', status: 'current' },
  { id: '4', name: 'Court Filing Prepared', nameUrdu: 'عدالتی درخواست تیار', status: 'pending' },
  { id: '5', name: 'Case Filed in Court', nameUrdu: 'عدالت میں کیس دائر', status: 'pending' },
  { id: '6', name: 'First Hearing', nameUrdu: 'پہلی پیشی', status: 'pending' },
  { id: '7', name: 'Evidence Submission', nameUrdu: 'ثبوت جمع', status: 'pending' },
  { id: '8', name: 'Final Arguments', nameUrdu: 'حتمی دلائل', status: 'pending' },
  { id: '9', name: 'Court Decision', nameUrdu: 'عدالتی فیصلہ', status: 'pending' },
];

const MOCK_UPDATES: CaseUpdate[] = [
  {
    id: '1',
    type: 'status',
    title: 'Lawyer Started Review',
    titleUrdu: 'وکیل نے جائزہ شروع کیا',
    description: 'Your lawyer has started reviewing your case documents.',
    descriptionUrdu: 'آپ کے وکیل نے آپ کے کیس کے دستاویزات کا جائزہ شروع کر دیا ہے۔',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true
  },
  {
    id: '2',
    type: 'document',
    title: 'Document Verified',
    titleUrdu: 'دستاویز کی تصدیق ہوگئی',
    description: 'Your marriage certificate has been verified.',
    descriptionUrdu: 'آپ کے نکاح نامے کی تصدیق ہو گئی ہے۔',
    timestamp: new Date(Date.now() - 1800000),
    isRead: false
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message from Lawyer',
    titleUrdu: 'وکیل کا نیا پیغام',
    description: 'Your lawyer has sent you a message regarding the case.',
    descriptionUrdu: 'آپ کے وکیل نے کیس کے بارے میں پیغام بھیجا ہے۔',
    timestamp: new Date(),
    isRead: false
  }
];

export default function CaseMonitoring({ caseId, caseType, lawyerName, language = 'en' }: CaseMonitoringProps) {
  const [stages, setStages] = useState<CaseStage[]>(DEFAULT_STAGES);
  const [updates, setUpdates] = useState<CaseUpdate[]>(MOCK_UPDATES);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showUpdates, setShowUpdates] = useState(true);

  const currentStageIndex = stages.findIndex(s => s.status === 'current');
  const progressPercent = ((currentStageIndex + 1) / stages.length) * 100;

  const getStatusIcon = (status: CaseStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-400" size={24} />;
      case 'current':
        return <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-white" />
        </motion.div>;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-slate-500" />;
    }
  };

  const getUpdateIcon = (type: CaseUpdate['type']) => {
    switch (type) {
      case 'status':
        return <Clock className="text-brand-gold" size={20} />;
      case 'document':
        return <FileText className="text-blue-400" size={20} />;
      case 'message':
        return <MessageSquare className="text-green-400" size={20} />;
      case 'hearing':
        return <Scale className="text-purple-400" size={20} />;
    }
  };

  const markAsRead = (id: string) => {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, isRead: true } : u));
  };

  const unreadCount = updates.filter(u => !u.isRead).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Case Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Briefcase className="text-brand-gold" size={24} />
              {language === 'ur' ? 'کیس کی نگرانی' : 'Case Monitoring'}
            </h3>
            <p className="text-ehb-textMuted text-sm mt-1">
              {language === 'ur' ? `کیس ID: ${caseId}` : `Case ID: ${caseId}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{caseType}</p>
            <p className="text-ehb-textMuted text-sm flex items-center gap-1 justify-end">
              <User size={14} />
              {lawyerName}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ehb-textMuted">
              {language === 'ur' ? 'مجموعی پیش رفت' : 'Overall Progress'}
            </span>
            <span className="text-brand-gold font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-brand-primary to-brand-gold"
            />
          </div>
        </div>

        {/* Current Stage */}
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4">
          <p className="text-sm text-brand-gold mb-1">
            {language === 'ur' ? 'موجودہ مرحلہ' : 'Current Stage'}
          </p>
          <p className="text-white font-bold text-lg">
            {language === 'ur' ? stages[currentStageIndex]?.nameUrdu : stages[currentStageIndex]?.name}
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden"
      >
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-all"
        >
          <span className="font-bold flex items-center gap-2">
            <Calendar className="text-brand-gold" size={20} />
            {language === 'ur' ? 'کیس ٹائم لائن' : 'Case Timeline'}
          </span>
          {showTimeline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="relative">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex gap-4 pb-6 last:pb-0">
                    {/* Line */}
                    {index < stages.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-full -z-10 ${
                        stage.status === 'completed' ? 'bg-green-400' : 'bg-slate-700'
                      }`} style={{ height: 'calc(100% - 24px)', top: '28px' }} />
                    )}
                    
                    {/* Icon */}
                    <div className="flex-shrink-0 z-10">
                      {getStatusIcon(stage.status)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        stage.status === 'current' ? 'text-brand-gold' :
                        stage.status === 'completed' ? 'text-white' : 'text-slate-500'
                      }`}>
                        {language === 'ur' ? stage.nameUrdu : stage.name}
                      </p>
                      {stage.date && (
                        <p className="text-slate-500 text-sm">{stage.date}</p>
                      )}
                    </div>

                    {stage.status === 'current' && (
                      <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                        {language === 'ur' ? 'فعال' : 'Active'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Updates */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden"
      >
        <button
          onClick={() => setShowUpdates(!showUpdates)}
          className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-all"
        >
          <span className="font-bold flex items-center gap-2">
            <Bell className="text-brand-gold" size={20} />
            {language === 'ur' ? 'تازہ ترین اپڈیٹس' : 'Recent Updates'}
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </span>
          {showUpdates ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <AnimatePresence>
          {showUpdates && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-3"
            >
              {updates.map(update => (
                <motion.div
                  key={update.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => markAsRead(update.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    update.isRead ? 'bg-white/5' : 'bg-white/10 border-l-4 border-brand-gold'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getUpdateIcon(update.type)}</div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {language === 'ur' ? update.titleUrdu : update.title}
                      </p>
                      <p className="text-ehb-textMuted text-sm mt-1">
                        {language === 'ur' ? update.descriptionUrdu : update.description}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        {update.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!update.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-gold flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { icon: MessageSquare, label: language === 'ur' ? 'وکیل سے بات' : 'Chat with Lawyer', color: 'from-blue-500 to-blue-600' },
          { icon: FileText, label: language === 'ur' ? 'دستاویزات' : 'Documents', color: 'from-purple-500 to-purple-600' },
          { icon: Calendar, label: language === 'ur' ? 'پیشیاں' : 'Hearings', color: 'from-green-500 to-green-600' },
          { icon: Scale, label: language === 'ur' ? 'کیس تفصیلات' : 'Case Details', color: 'from-brand-gold to-orange-500' }
        ].map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white flex flex-col items-center gap-2`}
          >
            <action.icon size={24} />
            <span className="text-sm font-medium text-center">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
