'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Lock, Eye, AlertTriangle, CheckCircle2, XCircle,
  Activity, Users, Globe, FileText, Database, Clock,
  Bell, Settings, Search, Filter, RefreshCw, ChevronRight,
  ShieldAlert, ShieldCheck, Key, Fingerprint, Laptop, Smartphone,
  MapPin, Ban, UserX, AlertOctagon, Loader2
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'critical';
  category: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  source: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
  ip?: string;
  location?: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  nameUrdu: string;
  region: string;
  status: 'compliant' | 'non_compliant' | 'pending';
  lastChecked: Date;
  requirements: string[];
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip: string;
  device: string;
  location: string;
  status: 'success' | 'denied' | 'suspicious';
}

const MOCK_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-1',
    type: 'alert',
    category: 'Authentication',
    title: 'Multiple Failed Login Attempts',
    titleUrdu: 'متعدد ناکام لاگ ان کوششیں',
    description: '5 failed login attempts detected from IP 192.168.1.45',
    descriptionUrdu: 'IP 192.168.1.45 سے 5 ناکام لاگ ان کوششیں',
    source: 'Auth Service',
    timestamp: new Date('2026-03-12T10:30:00'),
    status: 'active',
    ip: '192.168.1.45',
    location: 'Unknown'
  },
  {
    id: 'evt-2',
    type: 'warning',
    category: 'Document',
    title: 'Suspicious Document Upload',
    titleUrdu: 'مشکوک دستاویز اپ لوڈ',
    description: 'Document flagged for potential sensitive data',
    descriptionUrdu: 'دستاویز کو حساس ڈیٹا کے لیے نشان زد کیا گیا',
    source: 'Document Agent',
    timestamp: new Date('2026-03-12T09:45:00'),
    status: 'investigating',
    ip: '10.0.0.23',
    location: 'Lahore, PK'
  },
  {
    id: 'evt-3',
    type: 'critical',
    category: 'Payment',
    title: 'Potential Fraud Detected',
    titleUrdu: 'ممکنہ فراڈ کا پتہ چلا',
    description: 'Unusual payment pattern detected on account A-1234',
    descriptionUrdu: 'اکاؤنٹ A-1234 پر غیر معمولی ادائیگی کا پیٹرن',
    source: 'Payment Agent',
    timestamp: new Date('2026-03-12T08:15:00'),
    status: 'active',
    ip: '172.16.0.89',
    location: 'Dubai, UAE'
  },
  {
    id: 'evt-4',
    type: 'info',
    category: 'System',
    title: 'Security Scan Completed',
    titleUrdu: 'سیکیورٹی اسکین مکمل',
    description: 'Daily security scan completed with no issues',
    descriptionUrdu: 'روزانہ سیکیورٹی اسکین بغیر کسی مسئلے کے مکمل',
    source: 'Security Agent',
    timestamp: new Date('2026-03-12T06:00:00'),
    status: 'resolved'
  }
];

const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'comp-1',
    name: 'GDPR Compliance',
    nameUrdu: 'GDPR تعمیل',
    region: 'Europe',
    status: 'compliant',
    lastChecked: new Date('2026-03-12'),
    requirements: ['Data encryption', 'User consent', 'Right to deletion', 'Data portability']
  },
  {
    id: 'comp-2',
    name: 'PCI DSS',
    nameUrdu: 'PCI DSS',
    region: 'Global',
    status: 'compliant',
    lastChecked: new Date('2026-03-11'),
    requirements: ['Secure payment processing', 'Card data protection', 'Access control']
  },
  {
    id: 'comp-3',
    name: 'Pakistan Data Protection',
    nameUrdu: 'پاکستان ڈیٹا تحفظ',
    region: 'Pakistan',
    status: 'compliant',
    lastChecked: new Date('2026-03-10'),
    requirements: ['Local data storage', 'Privacy policy', 'User rights']
  },
  {
    id: 'comp-4',
    name: 'UAE PDPL',
    nameUrdu: 'UAE PDPL',
    region: 'UAE',
    status: 'pending',
    lastChecked: new Date('2026-03-09'),
    requirements: ['Data localization', 'Cross-border transfer rules', 'Consent management']
  }
];

const ACCESS_LOGS: AccessLog[] = [
  { id: 'log-1', user: 'ahmad.khan@email.com', action: 'Login', resource: 'Dashboard', timestamp: new Date('2026-03-12T10:30:00'), ip: '192.168.1.100', device: 'Chrome/Windows', location: 'Lahore, PK', status: 'success' },
  { id: 'log-2', user: 'sara.malik@law.com', action: 'View Case', resource: 'Case #EHB-2026-001234', timestamp: new Date('2026-03-12T10:25:00'), ip: '10.0.0.50', device: 'Safari/Mac', location: 'Karachi, PK', status: 'success' },
  { id: 'log-3', user: 'unknown', action: 'Login Attempt', resource: 'Admin Panel', timestamp: new Date('2026-03-12T10:20:00'), ip: '185.45.67.89', device: 'Unknown', location: 'Unknown', status: 'denied' },
  { id: 'log-4', user: 'tech.solutions@email.com', action: 'Download Document', resource: 'Contract Agreement', timestamp: new Date('2026-03-12T10:15:00'), ip: '172.16.0.25', device: 'Firefox/Linux', location: 'Dubai, UAE', status: 'suspicious' }
];

interface SecurityGovernanceProps {
  language?: 'en' | 'ur';
}

export default function SecurityGovernance({ language = 'en' }: SecurityGovernanceProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'compliance' | 'access' | 'settings'>('events');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [isScanning, setIsScanning] = useState(false);

  const getEventTypeColor = (type: SecurityEvent['type']) => {
    const colors = {
      info: 'text-blue-400 bg-blue-500/20',
      warning: 'text-yellow-400 bg-yellow-500/20',
      alert: 'text-orange-400 bg-orange-500/20',
      critical: 'text-red-400 bg-red-500/20'
    };
    return colors[type];
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    const icons = {
      info: CheckCircle2,
      warning: AlertTriangle,
      alert: ShieldAlert,
      critical: AlertOctagon
    };
    return icons[type];
  };

  const getStatusColor = (status: SecurityEvent['status']) => {
    const colors = {
      active: 'text-red-400 bg-red-500/20',
      investigating: 'text-yellow-400 bg-yellow-500/20',
      resolved: 'text-green-400 bg-green-500/20'
    };
    return colors[status];
  };

  const runSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const stats = {
    totalEvents: events.length,
    critical: events.filter(e => e.type === 'critical').length,
    active: events.filter(e => e.status === 'active').length,
    resolved: events.filter(e => e.status === 'resolved').length
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-red-500/20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center relative">
              <Shield className="text-white" size={28} />
              {stats.critical > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {stats.critical}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">
                {language === 'ur' ? 'سیکیورٹی اور گورننس' : 'Security & Governance'}
              </h2>
              <p className="text-ehb-textMuted text-sm">
                {language === 'ur' ? 'AI نظام کی حفاظت اور تعمیل' : 'AI system security and compliance monitoring'}
              </p>
            </div>
          </div>
          <button
            onClick={runSecurityScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 disabled:opacity-50"
          >
            {isScanning ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            {language === 'ur' ? 'سیکیورٹی اسکین' : 'Run Security Scan'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <Activity size={14} />
              {language === 'ur' ? 'کل واقعات' : 'Total Events'}
            </div>
            <p className="text-white font-bold text-2xl">{stats.totalEvents}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <AlertOctagon size={14} />
              {language === 'ur' ? 'اہم' : 'Critical'}
            </div>
            <p className="text-red-400 font-bold text-2xl">{stats.critical}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <ShieldAlert size={14} />
              {language === 'ur' ? 'فعال' : 'Active'}
            </div>
            <p className="text-orange-400 font-bold text-2xl">{stats.active}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-ehb-textMuted text-xs mb-1">
              <ShieldCheck size={14} />
              {language === 'ur' ? 'حل شدہ' : 'Resolved'}
            </div>
            <p className="text-green-400 font-bold text-2xl">{stats.resolved}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'events', label: language === 'ur' ? 'سیکیورٹی واقعات' : 'Security Events', icon: ShieldAlert },
          { id: 'compliance', label: language === 'ur' ? 'تعمیل' : 'Compliance', icon: CheckCircle2 },
          { id: 'access', label: language === 'ur' ? 'رسائی لاگز' : 'Access Logs', icon: Eye },
          { id: 'settings', label: language === 'ur' ? 'ترتیبات' : 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {events.map((event, index) => {
            const EventIcon = getEventIcon(event.type);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                    <EventIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-bold">
                          {language === 'ur' ? event.titleUrdu : event.title}
                        </h4>
                        <p className="text-ehb-textMuted text-sm">
                          {language === 'ur' ? event.descriptionUrdu : event.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Database size={12} />
                        {event.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.timestamp.toLocaleString()}
                      </span>
                      {event.ip && (
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {event.ip}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {event.status === 'active' && (
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30">
                      {language === 'ur' ? 'حل کریں' : 'Resolve'}
                    </button>
                    <button className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30">
                      {language === 'ur' ? 'تحقیقات' : 'Investigate'}
                    </button>
                    <button className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30">
                      {language === 'ur' ? 'بلاک کریں' : 'Block'}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {COMPLIANCE_RULES.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-bold">
                    {language === 'ur' ? rule.nameUrdu : rule.name}
                  </h4>
                  <p className="text-ehb-textMuted text-sm">{rule.region}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  rule.status === 'compliant' ? 'bg-green-500/20 text-green-400' :
                  rule.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {rule.status === 'compliant' ? (language === 'ur' ? 'مکمل' : 'Compliant') :
                   rule.status === 'pending' ? (language === 'ur' ? 'زیر التوا' : 'Pending') :
                   (language === 'ur' ? 'غیر مکمل' : 'Non-Compliant')}
                </span>
              </div>
              <div className="space-y-2">
                {rule.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ehb-textBody">
                    <CheckCircle2 className="text-green-400" size={14} />
                    {req}
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-3">
                {language === 'ur' ? 'آخری چیک:' : 'Last checked:'} {rule.lastChecked.toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Access Logs Tab */}
      {activeTab === 'access' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-ehb-textMuted text-xs font-medium">{language === 'ur' ? 'صارف' : 'User'}</th>
                  <th className="text-left p-4 text-ehb-textMuted text-xs font-medium">{language === 'ur' ? 'عمل' : 'Action'}</th>
                  <th className="text-left p-4 text-ehb-textMuted text-xs font-medium">{language === 'ur' ? 'وسائل' : 'Resource'}</th>
                  <th className="text-left p-4 text-ehb-textMuted text-xs font-medium">{language === 'ur' ? 'وقت' : 'Time'}</th>
                  <th className="text-left p-4 text-ehb-textMuted text-xs font-medium">{language === 'ur' ? 'حیثیت' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {ACCESS_LOGS.map((log, index) => (
                  <tr key={log.id} className="border-t border-slate-700">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-ehb-textMuted" />
                        <span className="text-white text-sm">{log.user}</span>
                      </div>
                    </td>
                    <td className="p-4 text-ehb-textBody text-sm">{log.action}</td>
                    <td className="p-4 text-ehb-textBody text-sm">{log.resource}</td>
                    <td className="p-4 text-ehb-textMuted text-sm">{log.timestamp.toLocaleTimeString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        log.status === 'denied' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { icon: Lock, title: 'Two-Factor Authentication', titleUrdu: 'دو عنصر کی تصدیق', enabled: true },
            { icon: Fingerprint, title: 'Biometric Login', titleUrdu: 'بائیومیٹرک لاگ ان', enabled: false },
            { icon: Key, title: 'API Key Rotation', titleUrdu: 'API کلید گردش', enabled: true },
            { icon: Database, title: 'Data Encryption', titleUrdu: 'ڈیٹا انکرپشن', enabled: true },
            { icon: Globe, title: 'IP Whitelisting', titleUrdu: 'IP وائٹ لسٹنگ', enabled: false },
            { icon: Bell, title: 'Security Alerts', titleUrdu: 'سیکیورٹی الرٹس', enabled: true }
          ].map((setting, index) => {
            const Icon = setting.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Icon className="text-brand-gold" size={20} />
                  </div>
                  <span className="text-white font-medium">
                    {language === 'ur' ? setting.titleUrdu : setting.title}
                  </span>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
