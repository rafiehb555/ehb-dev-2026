'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database, Users, Scale, FileText, CreditCard, BookOpen,
  Bot, Clock, Bell, Shield, ChevronRight, ChevronDown,
  Server, HardDrive, Layers, Link, Key, Hash,
  Globe, Activity, BarChart2, Cpu, Zap, Eye,
  CheckCircle2, AlertCircle, Settings, Code
} from 'lucide-react';
import { DATABASE_STATS } from '@/database/schema';
import { MOCK_DB_STATS } from '@/database/mockData';
import { EXTENDED_DATABASE_STATS } from '@/database/schemaExtended';
import { EXTENDED_MOCK_STATS } from '@/database/mockDataExtended';
import { 
  Building2, Gavel, Calendar, FileCheck, 
  BadgeCheck, Languages, MapPin, Briefcase, Video, Star
} from 'lucide-react';

interface TableSchema {
  name: string;
  nameUrdu: string;
  icon: React.ElementType;
  description: string;
  descriptionUrdu: string;
  fields: FieldInfo[];
  primaryKey: string;
  foreignKeys?: { field: string; references: string }[];
  indexes?: string[];
  rowCount: number;
  color: string;
}

interface FieldInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  isUnique?: boolean;
  description?: string;
}

const CORE_TABLES: TableSchema[] = [
  {
    name: 'Users',
    nameUrdu: 'صارفین',
    icon: Users,
    description: 'User accounts including clients, lawyers, and administrators',
    descriptionUrdu: 'کلائنٹس، وکلاء اور منتظمین کے صارف اکاؤنٹس',
    primaryKey: 'user_id',
    foreignKeys: [{ field: 'referred_by', references: 'Users.user_id' }],
    indexes: ['email', 'phone', 'country', 'role', 'status'],
    rowCount: MOCK_DB_STATS.users.total,
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { name: 'user_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, isUnique: true },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
      { name: 'phone', type: 'VARCHAR(20)', nullable: false },
      { name: 'first_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'last_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'country', type: 'CHAR(2)', nullable: false },
      { name: 'city', type: 'VARCHAR(100)', nullable: false },
      { name: 'language', type: 'CHAR(2)', nullable: false },
      { name: 'role', type: 'ENUM', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false },
    ]
  },
  {
    name: 'Lawyers',
    nameUrdu: 'وکلاء',
    icon: Scale,
    description: 'Lawyer profiles with verification and specialization',
    descriptionUrdu: 'تصدیق اور مہارت کے ساتھ وکیل پروفائلز',
    primaryKey: 'lawyer_id',
    foreignKeys: [
      { field: 'user_id', references: 'Users.user_id' },
      { field: 'franchise_id', references: 'Franchises.franchise_id' }
    ],
    indexes: ['user_id', 'specialization', 'country', 'status', 'rating', 'verification_status'],
    rowCount: MOCK_DB_STATS.lawyers.total,
    color: 'from-violet-500 to-purple-500',
    fields: [
      { name: 'lawyer_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'user_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'bar_council_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'license_number', type: 'VARCHAR(50)', nullable: false },
      { name: 'experience_years', type: 'INT', nullable: false },
      { name: 'primary_specialization', type: 'ENUM', nullable: false },
      { name: 'overall_rating', type: 'DECIMAL(2,1)', nullable: false },
      { name: 'sql_level', type: 'TINYINT', nullable: false },
      { name: 'verification_status', type: 'ENUM', nullable: false },
      { name: 'hourly_rate', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Cases',
    nameUrdu: 'کیسز',
    icon: FileText,
    description: 'Legal case information and lifecycle tracking',
    descriptionUrdu: 'قانونی کیس کی معلومات اور لائف سائیکل ٹریکنگ',
    primaryKey: 'case_id',
    foreignKeys: [
      { field: 'client_id', references: 'Users.user_id' },
      { field: 'lawyer_id', references: 'Lawyers.lawyer_id' }
    ],
    indexes: ['client_id', 'lawyer_id', 'status', 'case_type', 'case_number', 'created_at'],
    rowCount: MOCK_DB_STATS.cases.total,
    color: 'from-emerald-500 to-green-500',
    fields: [
      { name: 'case_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_number', type: 'VARCHAR(20)', nullable: false, isUnique: true },
      { name: 'client_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'lawyer_id', type: 'UUID', nullable: true, isForeign: true },
      { name: 'case_type', type: 'ENUM', nullable: false },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'priority', type: 'ENUM', nullable: false },
      { name: 'progress_percentage', type: 'INT', nullable: false },
      { name: 'estimated_cost', type: 'DECIMAL(15,2)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
    ]
  },
  {
    name: 'Case_Documents',
    nameUrdu: 'کیس دستاویزات',
    icon: FileText,
    description: 'Documents associated with legal cases',
    descriptionUrdu: 'قانونی کیسز سے وابستہ دستاویزات',
    primaryKey: 'document_id',
    foreignKeys: [
      { field: 'case_id', references: 'Cases.case_id' },
      { field: 'uploaded_by', references: 'Users.user_id' }
    ],
    indexes: ['case_id', 'uploaded_by', 'status'],
    rowCount: MOCK_DB_STATS.documents.total,
    color: 'from-orange-500 to-amber-500',
    fields: [
      { name: 'document_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'uploaded_by', type: 'UUID', nullable: false, isForeign: true },
      { name: 'document_type', type: 'ENUM', nullable: false },
      { name: 'file_url', type: 'VARCHAR(500)', nullable: false },
      { name: 'file_size', type: 'BIGINT', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'uploaded_at', type: 'TIMESTAMP', nullable: false },
    ]
  },
  {
    name: 'Legal_Services',
    nameUrdu: 'قانونی خدمات',
    icon: BookOpen,
    description: 'Available legal services offered on the platform',
    descriptionUrdu: 'پلیٹ فارم پر دستیاب قانونی خدمات',
    primaryKey: 'service_id',
    indexes: ['category', 'is_active'],
    rowCount: 45,
    color: 'from-pink-500 to-rose-500',
    fields: [
      { name: 'service_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'category', type: 'VARCHAR(50)', nullable: false },
      { name: 'base_price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'currency', type: 'CHAR(3)', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
    ]
  },
  {
    name: 'Payments',
    nameUrdu: 'ادائیگیاں',
    icon: CreditCard,
    description: 'Payment transactions and financial records',
    descriptionUrdu: 'ادائیگی کے لین دین اور مالی ریکارڈ',
    primaryKey: 'payment_id',
    foreignKeys: [
      { field: 'case_id', references: 'Cases.case_id' },
      { field: 'payer_id', references: 'Users.user_id' },
      { field: 'payee_id', references: 'Users.user_id' }
    ],
    indexes: ['payer_id', 'payee_id', 'case_id', 'status', 'created_at'],
    rowCount: MOCK_DB_STATS.payments.total,
    color: 'from-green-500 to-emerald-500',
    fields: [
      { name: 'payment_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'transaction_id', type: 'VARCHAR(50)', nullable: false, isUnique: true },
      { name: 'case_id', type: 'UUID', nullable: true, isForeign: true },
      { name: 'payer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'payee_id', type: 'UUID', nullable: true, isForeign: true },
      { name: 'amount', type: 'DECIMAL(15,2)', nullable: false },
      { name: 'currency', type: 'CHAR(3)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'payment_method', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Subscriptions',
    nameUrdu: 'سبسکرپشنز',
    icon: Clock,
    description: 'Lawyer subscription and hiring plans',
    descriptionUrdu: 'وکیل سبسکرپشن اور خدمات کے منصوبے',
    primaryKey: 'subscription_id',
    foreignKeys: [
      { field: 'client_id', references: 'Users.user_id' },
      { field: 'lawyer_id', references: 'Lawyers.lawyer_id' }
    ],
    rowCount: 2500,
    color: 'from-indigo-500 to-blue-500',
    fields: [
      { name: 'subscription_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'client_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'lawyer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'subscription_type', type: 'ENUM', nullable: false },
      { name: 'start_date', type: 'DATE', nullable: false },
      { name: 'end_date', type: 'DATE', nullable: false },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'AI_Agents',
    nameUrdu: 'AI ایجنٹس',
    icon: Bot,
    description: 'AI agent configuration and performance metrics',
    descriptionUrdu: 'AI ایجنٹ کنفیگریشن اور کارکردگی کے میٹرکس',
    primaryKey: 'agent_id',
    rowCount: 14,
    color: 'from-purple-500 to-violet-500',
    fields: [
      { name: 'agent_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'agent_type', type: 'ENUM', nullable: false },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'version', type: 'VARCHAR(20)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'tasks_completed', type: 'BIGINT', nullable: false },
      { name: 'accuracy_percentage', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'uptime_percentage', type: 'DECIMAL(5,2)', nullable: false },
    ]
  },
];

// Phase 2 Tables
const PHASE2_TABLES: TableSchema[] = [
  {
    name: 'Lawyer_Verification',
    nameUrdu: 'وکیل تصدیق',
    icon: BadgeCheck,
    description: 'Lawyer license and verification records',
    descriptionUrdu: 'وکیل لائسنس اور تصدیق کے ریکارڈز',
    primaryKey: 'verification_id',
    foreignKeys: [{ field: 'lawyer_id', references: 'Lawyers.lawyer_id' }],
    indexes: ['lawyer_id', 'verification_status', 'license_number'],
    rowCount: EXTENDED_MOCK_STATS.phase2.verifications.total,
    color: 'from-green-500 to-emerald-500',
    fields: [
      { name: 'verification_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'lawyer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'license_number', type: 'VARCHAR(50)', nullable: false },
      { name: 'issuing_authority', type: 'VARCHAR(100)', nullable: false },
      { name: 'verification_status', type: 'ENUM', nullable: false },
      { name: 'verification_date', type: 'TIMESTAMP', nullable: true },
    ]
  },
  {
    name: 'Franchise_Offices',
    nameUrdu: 'فرنچائز دفاتر',
    icon: Building2,
    description: 'Franchise network offices worldwide',
    descriptionUrdu: 'دنیا بھر میں فرنچائز نیٹ ورک دفاتر',
    primaryKey: 'franchise_id',
    foreignKeys: [{ field: 'owner_id', references: 'Users.user_id' }],
    indexes: ['country', 'city', 'status', 'tier'],
    rowCount: EXTENDED_MOCK_STATS.phase2.franchises.total,
    color: 'from-amber-500 to-yellow-500',
    fields: [
      { name: 'franchise_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'franchise_code', type: 'VARCHAR(20)', nullable: false, isUnique: true },
      { name: 'owner_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'country', type: 'CHAR(2)', nullable: false },
      { name: 'city', type: 'VARCHAR(100)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'tier', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Legal_Knowledge',
    nameUrdu: 'قانونی علم',
    icon: BookOpen,
    description: 'Legal knowledge base for AI research',
    descriptionUrdu: 'AI تحقیق کے لیے قانونی علم کا ذخیرہ',
    primaryKey: 'knowledge_id',
    indexes: ['category', 'country', 'knowledge_type'],
    rowCount: EXTENDED_MOCK_STATS.phase2.knowledge.articles,
    color: 'from-cyan-500 to-blue-500',
    fields: [
      { name: 'knowledge_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'knowledge_type', type: 'ENUM', nullable: false },
      { name: 'category', type: 'VARCHAR(50)', nullable: false },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'country', type: 'CHAR(2)', nullable: false },
      { name: 'full_text', type: 'TEXT', nullable: false },
    ]
  },
  {
    name: 'Countries',
    nameUrdu: 'ممالک',
    icon: MapPin,
    description: 'Country-specific legal and operational data',
    descriptionUrdu: 'ملک کے مخصوص قانونی اور آپریشنل ڈیٹا',
    primaryKey: 'country_id',
    rowCount: EXTENDED_MOCK_STATS.phase2.countries.operational,
    color: 'from-teal-500 to-green-500',
    fields: [
      { name: 'country_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'code', type: 'CHAR(2)', nullable: false, isUnique: true },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'legal_system', type: 'ENUM', nullable: false },
      { name: 'currency_code', type: 'CHAR(3)', nullable: false },
    ]
  },
  {
    name: 'Languages',
    nameUrdu: 'زبانیں',
    icon: Languages,
    description: 'Platform supported languages',
    descriptionUrdu: 'پلیٹ فارم کی معاون زبانیں',
    primaryKey: 'language_id',
    rowCount: EXTENDED_MOCK_STATS.phase2.languages.active,
    color: 'from-rose-500 to-pink-500',
    fields: [
      { name: 'language_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'code', type: 'CHAR(2)', nullable: false, isUnique: true },
      { name: 'name', type: 'VARCHAR(50)', nullable: false },
      { name: 'native_name', type: 'VARCHAR(50)', nullable: false },
      { name: 'direction', type: 'ENUM', nullable: false },
    ]
  },
];

// Phase 3 Tables
const PHASE3_TABLES: TableSchema[] = [
  {
    name: 'Lawyer_Hiring_Contracts',
    nameUrdu: 'وکیل کرایہ معاہدے',
    icon: Briefcase,
    description: 'Hiring agreements between clients and lawyers',
    descriptionUrdu: 'کلائنٹس اور وکلاء کے درمیان خدمات کے معاہدے',
    primaryKey: 'contract_id',
    foreignKeys: [
      { field: 'client_id', references: 'Users.user_id' },
      { field: 'lawyer_id', references: 'Lawyers.lawyer_id' }
    ],
    indexes: ['client_id', 'lawyer_id', 'contract_type', 'status'],
    rowCount: EXTENDED_MOCK_STATS.phase3.contracts.total,
    color: 'from-indigo-500 to-violet-500',
    fields: [
      { name: 'contract_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'contract_number', type: 'VARCHAR(25)', nullable: false, isUnique: true },
      { name: 'client_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'lawyer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'contract_type', type: 'ENUM', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Consultation_Sessions',
    nameUrdu: 'مشاورتی سیشنز',
    icon: Video,
    description: 'Scheduled consultation sessions',
    descriptionUrdu: 'طے شدہ مشاورتی سیشنز',
    primaryKey: 'session_id',
    foreignKeys: [
      { field: 'client_id', references: 'Users.user_id' },
      { field: 'lawyer_id', references: 'Lawyers.lawyer_id' }
    ],
    indexes: ['client_id', 'lawyer_id', 'scheduled_date', 'status'],
    rowCount: EXTENDED_MOCK_STATS.phase3.sessions.total,
    color: 'from-sky-500 to-blue-500',
    fields: [
      { name: 'session_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'booking_number', type: 'VARCHAR(25)', nullable: false, isUnique: true },
      { name: 'client_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'lawyer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'session_type', type: 'ENUM', nullable: false },
      { name: 'scheduled_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Subscription_Plans',
    nameUrdu: 'سبسکرپشن پلانز',
    icon: CreditCard,
    description: 'Legal advisory subscription plans',
    descriptionUrdu: 'قانونی مشاورتی سبسکرپشن پلانز',
    primaryKey: 'plan_id',
    indexes: ['plan_type', 'is_active'],
    rowCount: 8,
    color: 'from-emerald-500 to-teal-500',
    fields: [
      { name: 'plan_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'plan_code', type: 'VARCHAR(25)', nullable: false, isUnique: true },
      { name: 'plan_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'plan_type', type: 'ENUM', nullable: false },
      { name: 'base_price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
    ]
  },
  {
    name: 'Lawyer_Performance',
    nameUrdu: 'وکیل کارکردگی',
    icon: Star,
    description: 'Lawyer performance tracking and analytics',
    descriptionUrdu: 'وکیل کی کارکردگی کی ٹریکنگ اور تجزیات',
    primaryKey: 'performance_id',
    foreignKeys: [{ field: 'lawyer_id', references: 'Lawyers.lawyer_id' }],
    indexes: ['lawyer_id', 'period_type', 'overall_score'],
    rowCount: MOCK_DB_STATS.lawyers.total * 12,
    color: 'from-yellow-500 to-orange-500',
    fields: [
      { name: 'performance_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'lawyer_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'period_type', type: 'ENUM', nullable: false },
      { name: 'cases_completed', type: 'INT', nullable: false },
      { name: 'success_rate', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'average_rating', type: 'DECIMAL(2,1)', nullable: false },
    ]
  },
];

// Phase 4 Tables
const PHASE4_TABLES: TableSchema[] = [
  {
    name: 'Case_Workflow',
    nameUrdu: 'کیس ورک فلو',
    icon: Activity,
    description: 'Case workflow stage management',
    descriptionUrdu: 'کیس ورک فلو مرحلے کا انتظام',
    primaryKey: 'workflow_id',
    foreignKeys: [{ field: 'case_id', references: 'Cases.case_id' }],
    indexes: ['case_id', 'current_stage', 'current_status'],
    rowCount: EXTENDED_MOCK_STATS.phase4.workflows.total,
    color: 'from-violet-500 to-purple-500',
    fields: [
      { name: 'workflow_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'current_stage', type: 'ENUM', nullable: false },
      { name: 'current_status', type: 'ENUM', nullable: false },
      { name: 'progress_percentage', type: 'INT', nullable: false },
    ]
  },
  {
    name: 'Court_Hearings',
    nameUrdu: 'عدالتی سماعتیں',
    icon: Gavel,
    description: 'Court hearing schedule and management',
    descriptionUrdu: 'عدالتی سماعت کا شیڈول اور انتظام',
    primaryKey: 'hearing_id',
    foreignKeys: [{ field: 'case_id', references: 'Cases.case_id' }],
    indexes: ['case_id', 'scheduled_date', 'status'],
    rowCount: EXTENDED_MOCK_STATS.phase4.hearings.scheduled + EXTENDED_MOCK_STATS.phase4.hearings.completed,
    color: 'from-red-500 to-rose-500',
    fields: [
      { name: 'hearing_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'hearing_type', type: 'ENUM', nullable: false },
      { name: 'court_name', type: 'VARCHAR(150)', nullable: false },
      { name: 'scheduled_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Evidence_Records',
    nameUrdu: 'ثبوت ریکارڈز',
    icon: FileCheck,
    description: 'Case evidence management',
    descriptionUrdu: 'کیس ثبوت کا انتظام',
    primaryKey: 'evidence_id',
    foreignKeys: [{ field: 'case_id', references: 'Cases.case_id' }],
    indexes: ['case_id', 'evidence_type', 'status'],
    rowCount: EXTENDED_MOCK_STATS.phase4.evidence.total,
    color: 'from-orange-500 to-amber-500',
    fields: [
      { name: 'evidence_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'evidence_type', type: 'ENUM', nullable: false },
      { name: 'evidence_title', type: 'VARCHAR(255)', nullable: false },
      { name: 'file_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Legal_Notices',
    nameUrdu: 'قانونی نوٹسز',
    icon: FileText,
    description: 'Legal notice generation and tracking',
    descriptionUrdu: 'قانونی نوٹس کی تخلیق اور ٹریکنگ',
    primaryKey: 'notice_id',
    foreignKeys: [{ field: 'case_id', references: 'Cases.case_id' }],
    indexes: ['case_id', 'notice_type', 'status'],
    rowCount: EXTENDED_MOCK_STATS.phase4.notices.total,
    color: 'from-blue-500 to-indigo-500',
    fields: [
      { name: 'notice_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: true, isForeign: true },
      { name: 'notice_number', type: 'VARCHAR(25)', nullable: false, isUnique: true },
      { name: 'notice_type', type: 'ENUM', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
    ]
  },
  {
    name: 'Case_Timeline',
    nameUrdu: 'کیس ٹائم لائن',
    icon: Clock,
    description: 'Comprehensive case event tracking',
    descriptionUrdu: 'جامع کیس ایونٹ ٹریکنگ',
    primaryKey: 'timeline_id',
    foreignKeys: [{ field: 'case_id', references: 'Cases.case_id' }],
    indexes: ['case_id', 'event_type', 'event_date'],
    rowCount: MOCK_DB_STATS.cases.total * 15,
    color: 'from-slate-500 to-gray-500',
    fields: [
      { name: 'timeline_id', type: 'UUID', nullable: false, isPrimary: true },
      { name: 'case_id', type: 'UUID', nullable: false, isForeign: true },
      { name: 'event_type', type: 'ENUM', nullable: false },
      { name: 'event_title', type: 'VARCHAR(255)', nullable: false },
      { name: 'event_date', type: 'TIMESTAMP', nullable: false },
    ]
  },
];

// All tables combined
const ALL_TABLES = [...CORE_TABLES, ...PHASE2_TABLES, ...PHASE3_TABLES, ...PHASE4_TABLES];

interface DatabaseArchitectureProps {
  language?: 'en' | 'ur';
}

export default function DatabaseArchitecture({ language = 'en' }: DatabaseArchitectureProps) {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'diagram' | 'stats'>('grid');
  const [selectedPhase, setSelectedPhase] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  const getFilteredTables = () => {
    switch (selectedPhase) {
      case '1': return CORE_TABLES;
      case '2': return PHASE2_TABLES;
      case '3': return PHASE3_TABLES;
      case '4': return PHASE4_TABLES;
      default: return ALL_TABLES;
    }
  };

  const filteredTables = getFilteredTables();
  const totalRows = filteredTables.reduce((acc, t) => acc + t.rowCount, 0);
  const totalFields = filteredTables.reduce((acc, t) => acc + t.fields.length, 0);
  const totalTables = EXTENDED_DATABASE_STATS.totals.totalTables;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center">
              <Database className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-white font-bold text-3xl flex items-center gap-3">
                {language === 'ur' ? 'ڈیٹابیس آرکیٹیکچر' : 'Database Architecture'}
                <span className="text-sm font-normal px-3 py-1 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-full">
                  {totalTables} Tables
                </span>
              </h1>
              <p className="text-ehb-textMuted">
                {language === 'ur' 
                  ? 'EHB AI عالمی قانونی پلیٹ فارم کا ڈیٹابیس ڈھانچہ - فیز 1-4'
                  : 'Global database structure for EHB AI Legal Platform - Phases 1-4'}
              </p>
            </div>
          </div>

          {/* Phase Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { id: 'all', label: 'All Phases', count: totalTables },
              { id: '1', label: 'Phase 1: Core', count: CORE_TABLES.length },
              { id: '2', label: 'Phase 2: Extended', count: PHASE2_TABLES.length },
              { id: '3', label: 'Phase 3: Marketplace', count: PHASE3_TABLES.length },
              { id: '4', label: 'Phase 4: Workflow', count: PHASE4_TABLES.length },
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPhase === phase.id 
                    ? 'bg-brand-gold text-slate-900' 
                    : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
                }`}
              >
                {phase.label}
                <span className={`px-2 py-0.5 rounded text-xs ${
                  selectedPhase === phase.id ? 'bg-slate-900/20' : 'bg-slate-700'
                }`}>
                  {phase.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { icon: Layers, label: 'Tables', value: filteredTables.length, color: 'text-blue-400' },
            { icon: Hash, label: 'Fields', value: totalFields, color: 'text-violet-400' },
            { icon: Key, label: 'Indexes', value: EXTENDED_DATABASE_STATS.totals.totalIndexes, color: 'text-green-400' },
            { icon: Link, label: 'Foreign Keys', value: EXTENDED_DATABASE_STATS.totals.totalForeignKeys, color: 'text-orange-400' },
            { icon: HardDrive, label: 'Total Rows', value: `${(totalRows / 1000).toFixed(0)}K`, color: 'text-pink-400' },
            { icon: Globe, label: 'Countries', value: DATABASE_STATS.supportedCountries, color: 'text-cyan-400' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-white/10"
            >
              <stat.icon className={`${stat.color} mb-2`} size={20} />
              <p className="text-white font-bold text-2xl">{stat.value}</p>
              <p className="text-ehb-textMuted text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* View Mode Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'grid', label: 'Table Grid', icon: Layers },
            { id: 'diagram', label: 'ER Diagram', icon: Link },
            { id: 'stats', label: 'Statistics', icon: BarChart2 },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                viewMode === mode.id 
                  ? 'bg-brand-gold text-slate-900' 
                  : 'bg-slate-800 text-ehb-textMuted hover:bg-slate-700'
              }`}
            >
              <mode.icon size={18} />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTables.map((table, index) => {
              const TableIcon = table.icon;
              const isExpanded = expandedTable === table.name;
              
              return (
                <motion.div
                  key={table.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden"
                >
                  {/* Table Header */}
                  <div 
                    className={`p-4 bg-gradient-to-r ${table.color} cursor-pointer`}
                    onClick={() => setExpandedTable(isExpanded ? null : table.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <TableIcon className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{table.name}</h3>
                          <p className="text-white/70 text-xs">
                            {language === 'ur' ? table.nameUrdu : table.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                          {table.rowCount.toLocaleString()} rows
                        </span>
                        {isExpanded ? <ChevronDown className="text-white" size={20} /> : <ChevronRight className="text-white" size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Table Fields */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-2">
                          {/* Primary Key */}
                          <div className="flex items-center gap-2 text-xs text-brand-gold mb-3">
                            <Key size={12} />
                            <span>Primary Key: {table.primaryKey}</span>
                          </div>

                          {/* Fields */}
                          <div className="space-y-1">
                            {table.fields.map((field) => (
                              <div
                                key={field.name}
                                className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  {field.isPrimary && <Key size={12} className="text-brand-gold" />}
                                  {field.isForeign && <Link size={12} className="text-blue-400" />}
                                  {field.isUnique && <CheckCircle2 size={12} className="text-green-400" />}
                                  <span className={`font-mono text-sm ${
                                    field.isPrimary ? 'text-brand-gold' :
                                    field.isForeign ? 'text-blue-400' :
                                    'text-white'
                                  }`}>
                                    {field.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-ehb-textMuted text-xs font-mono">{field.type}</span>
                                  {!field.nullable && (
                                    <span className="text-red-400 text-[10px]">NOT NULL</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Foreign Keys */}
                          {table.foreignKeys && table.foreignKeys.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-ehb-textMuted text-xs mb-2 flex items-center gap-1">
                                <Link size={12} />
                                Foreign Keys:
                              </p>
                              {table.foreignKeys.map((fk, i) => (
                                <div key={i} className="text-xs text-blue-400 pl-4">
                                  {fk.field} → {fk.references}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Indexes */}
                          {table.indexes && table.indexes.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-ehb-textMuted text-xs mb-2 flex items-center gap-1">
                                <Zap size={12} />
                                Indexes:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {table.indexes.map((idx, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded">
                                    {idx}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ER Diagram View */}
        {viewMode === 'diagram' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700"
          >
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Link className="text-brand-gold" size={20} />
              Entity Relationship Diagram
            </h3>
            
            {/* Simplified ER Diagram */}
            <div className="relative" style={{ minHeight: '400px' }}>
              {/* Tables positioned */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500/20 border border-blue-500 rounded-xl p-4 text-center">
                <Users className="text-blue-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">Users</p>
                <p className="text-blue-400 text-xs">{MOCK_DB_STATS.users.total} rows</p>
              </div>
              
              <div className="absolute top-32 left-20 bg-violet-500/20 border border-violet-500 rounded-xl p-4 text-center">
                <Scale className="text-violet-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">Lawyers</p>
                <p className="text-violet-400 text-xs">{MOCK_DB_STATS.lawyers.total} rows</p>
              </div>
              
              <div className="absolute top-32 right-20 bg-emerald-500/20 border border-emerald-500 rounded-xl p-4 text-center">
                <FileText className="text-emerald-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">Cases</p>
                <p className="text-emerald-400 text-xs">{MOCK_DB_STATS.cases.total} rows</p>
              </div>
              
              <div className="absolute top-64 left-1/4 bg-green-500/20 border border-green-500 rounded-xl p-4 text-center">
                <CreditCard className="text-green-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">Payments</p>
                <p className="text-green-400 text-xs">{MOCK_DB_STATS.payments.total} rows</p>
              </div>
              
              <div className="absolute top-64 right-1/4 bg-orange-500/20 border border-orange-500 rounded-xl p-4 text-center">
                <FileText className="text-orange-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">Documents</p>
                <p className="text-orange-400 text-xs">{MOCK_DB_STATS.documents.total} rows</p>
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-purple-500/20 border border-purple-500 rounded-xl p-4 text-center">
                <Bot className="text-purple-400 mx-auto mb-2" size={24} />
                <p className="text-white font-bold">AI_Agents</p>
                <p className="text-purple-400 text-xs">14 rows</p>
              </div>
              
              {/* Relationship lines would go here - simplified for now */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#D4AF37" />
                  </marker>
                </defs>
              </svg>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-ehb-textMuted text-sm">One-to-Many</p>
                <p className="text-white font-bold">8</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-ehb-textMuted text-sm">Many-to-Many</p>
                <p className="text-white font-bold">3</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-ehb-textMuted text-sm">One-to-One</p>
                <p className="text-white font-bold">2</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats View */}
        {viewMode === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Users Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="text-blue-400" size={20} />
                User Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Total Users</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.users.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Active Users</span>
                  <span className="text-green-400 font-bold">{MOCK_DB_STATS.users.active.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Clients</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.users.clients.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Lawyers</span>
                  <span className="text-violet-400 font-bold">{MOCK_DB_STATS.users.lawyers.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cases Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Scale className="text-emerald-400" size={20} />
                Case Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Total Cases</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.cases.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Active Cases</span>
                  <span className="text-blue-400 font-bold">{MOCK_DB_STATS.cases.active.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Completed</span>
                  <span className="text-green-400 font-bold">{MOCK_DB_STATS.cases.completed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Pending</span>
                  <span className="text-yellow-400 font-bold">{MOCK_DB_STATS.cases.pending.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payments Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="text-green-400" size={20} />
                Payment Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Total Transactions</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.payments.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Total Amount</span>
                  <span className="text-green-400 font-bold">PKR {(MOCK_DB_STATS.payments.totalAmount / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">This Month</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.payments.thisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">This Month Amount</span>
                  <span className="text-brand-gold font-bold">PKR {(MOCK_DB_STATS.payments.thisMonthAmount / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            {/* Lawyers Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="text-violet-400" size={20} />
                Lawyer Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Total Lawyers</span>
                  <span className="text-white font-bold">{MOCK_DB_STATS.lawyers.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Verified</span>
                  <span className="text-green-400 font-bold">{MOCK_DB_STATS.lawyers.verified.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Active</span>
                  <span className="text-blue-400 font-bold">{MOCK_DB_STATS.lawyers.active.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ehb-textMuted">Average Rating</span>
                  <span className="text-brand-gold font-bold">{MOCK_DB_STATS.lawyers.avgRating} ⭐</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 rounded-2xl p-6 border border-brand-gold/20"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Server className="text-brand-gold" size={20} />
            {language === 'ur' ? 'فیز 1 کا خلاصہ' : 'Phase 1 Summary'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-brand-gold font-bold text-2xl">{DATABASE_STATS.totalTables}</p>
              <p className="text-ehb-textMuted text-sm">{language === 'ur' ? 'ٹیبلز' : 'Tables'}</p>
            </div>
            <div>
              <p className="text-brand-gold font-bold text-2xl">{DATABASE_STATS.totalFields}+</p>
              <p className="text-ehb-textMuted text-sm">{language === 'ur' ? 'فیلڈز' : 'Fields'}</p>
            </div>
            <div>
              <p className="text-brand-gold font-bold text-2xl">{DATABASE_STATS.supportedCurrencies}</p>
              <p className="text-ehb-textMuted text-sm">{language === 'ur' ? 'کرنسیاں' : 'Currencies'}</p>
            </div>
            <div>
              <p className="text-brand-gold font-bold text-2xl">{DATABASE_STATS.supportedLanguages}</p>
              <p className="text-ehb-textMuted text-sm">{language === 'ur' ? 'زبانیں' : 'Languages'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
