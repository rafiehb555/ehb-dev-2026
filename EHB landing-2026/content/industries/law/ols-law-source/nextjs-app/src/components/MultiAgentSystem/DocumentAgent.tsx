'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Plus, Sparkles, Download, Edit, Eye, Copy,
  Check, ChevronRight, Loader2, FileCheck, AlertCircle,
  Printer, Send, Clock, Globe, Languages
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  nameUrdu: string;
  category: string;
  categoryUrdu: string;
  description: string;
  descriptionUrdu: string;
  fields: DocumentField[];
  languages: string[];
}

interface DocumentField {
  id: string;
  name: string;
  nameUrdu: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface GeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  content: string;
  createdAt: Date;
  status: 'draft' | 'review' | 'approved' | 'sent';
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'legal-notice',
    name: 'Legal Notice',
    nameUrdu: 'قانونی نوٹس',
    category: 'Notices',
    categoryUrdu: 'نوٹسز',
    description: 'Official legal notice for disputes and claims',
    descriptionUrdu: 'تنازعات اور دعووں کے لیے سرکاری قانونی نوٹس',
    languages: ['English', 'Urdu', 'Arabic'],
    fields: [
      { id: 'sender', name: 'Sender Name', nameUrdu: 'بھیجنے والے کا نام', type: 'text', required: true },
      { id: 'recipient', name: 'Recipient Name', nameUrdu: 'وصول کنندہ کا نام', type: 'text', required: true },
      { id: 'subject', name: 'Subject Matter', nameUrdu: 'موضوع', type: 'text', required: true },
      { id: 'details', name: 'Notice Details', nameUrdu: 'نوٹس کی تفصیلات', type: 'textarea', required: true },
      { id: 'deadline', name: 'Response Deadline', nameUrdu: 'جواب کی آخری تاریخ', type: 'date', required: true }
    ]
  },
  {
    id: 'court-petition',
    name: 'Court Petition',
    nameUrdu: 'عدالتی درخواست',
    category: 'Court Documents',
    categoryUrdu: 'عدالتی دستاویزات',
    description: 'Formal petition for court proceedings',
    descriptionUrdu: 'عدالتی کارروائی کے لیے باضابطہ درخواست',
    languages: ['English', 'Urdu'],
    fields: [
      { id: 'petitioner', name: 'Petitioner Name', nameUrdu: 'درخواست گزار کا نام', type: 'text', required: true },
      { id: 'respondent', name: 'Respondent Name', nameUrdu: 'جواب دہندہ کا نام', type: 'text', required: true },
      { id: 'court', name: 'Court Name', nameUrdu: 'عدالت کا نام', type: 'text', required: true },
      { id: 'case_type', name: 'Case Type', nameUrdu: 'کیس کی قسم', type: 'select', required: true, options: ['Civil', 'Criminal', 'Family', 'Property'] },
      { id: 'facts', name: 'Statement of Facts', nameUrdu: 'حقائق کا بیان', type: 'textarea', required: true },
      { id: 'prayer', name: 'Prayer/Relief Sought', nameUrdu: 'مطلوبہ ریلیف', type: 'textarea', required: true }
    ]
  },
  {
    id: 'affidavit',
    name: 'Affidavit',
    nameUrdu: 'حلف نامہ',
    category: 'Declarations',
    categoryUrdu: 'اعلانات',
    description: 'Sworn statement of facts',
    descriptionUrdu: 'حقائق کا حلفیہ بیان',
    languages: ['English', 'Urdu', 'Arabic', 'Hindi'],
    fields: [
      { id: 'deponent', name: 'Deponent Name', nameUrdu: 'حلف دینے والے کا نام', type: 'text', required: true },
      { id: 'father', name: 'Father\'s Name', nameUrdu: 'والد کا نام', type: 'text', required: true },
      { id: 'address', name: 'Address', nameUrdu: 'پتہ', type: 'textarea', required: true },
      { id: 'statement', name: 'Statement', nameUrdu: 'بیان', type: 'textarea', required: true },
      { id: 'purpose', name: 'Purpose', nameUrdu: 'مقصد', type: 'text', required: true }
    ]
  },
  {
    id: 'contract',
    name: 'Contract Agreement',
    nameUrdu: 'معاہدہ',
    category: 'Agreements',
    categoryUrdu: 'معاہدات',
    description: 'Legal contract between parties',
    descriptionUrdu: 'فریقین کے درمیان قانونی معاہدہ',
    languages: ['English', 'Urdu', 'Arabic'],
    fields: [
      { id: 'party1', name: 'First Party', nameUrdu: 'پہلا فریق', type: 'text', required: true },
      { id: 'party2', name: 'Second Party', nameUrdu: 'دوسرا فریق', type: 'text', required: true },
      { id: 'contract_type', name: 'Contract Type', nameUrdu: 'معاہدے کی قسم', type: 'select', required: true, options: ['Employment', 'Service', 'Sale', 'Lease', 'Partnership'] },
      { id: 'terms', name: 'Terms & Conditions', nameUrdu: 'شرائط و ضوابط', type: 'textarea', required: true },
      { id: 'start_date', name: 'Start Date', nameUrdu: 'شروع کی تاریخ', type: 'date', required: true },
      { id: 'end_date', name: 'End Date', nameUrdu: 'اختتام کی تاریخ', type: 'date', required: false }
    ]
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    nameUrdu: 'وکالت نامہ',
    category: 'Authorization',
    categoryUrdu: 'اختیار نامے',
    description: 'Legal authorization document',
    descriptionUrdu: 'قانونی اختیار دینے کی دستاویز',
    languages: ['English', 'Urdu'],
    fields: [
      { id: 'principal', name: 'Principal Name', nameUrdu: 'اصل شخص کا نام', type: 'text', required: true },
      { id: 'agent', name: 'Agent/Attorney Name', nameUrdu: 'وکیل/نمائندہ کا نام', type: 'text', required: true },
      { id: 'powers', name: 'Powers Granted', nameUrdu: 'دیے گئے اختیارات', type: 'textarea', required: true },
      { id: 'scope', name: 'Scope', nameUrdu: 'دائرہ کار', type: 'select', required: true, options: ['General', 'Special', 'Limited'] },
      { id: 'validity', name: 'Validity Period', nameUrdu: 'درستگی کی مدت', type: 'text', required: false }
    ]
  }
];

interface DocumentAgentProps {
  language?: 'en' | 'ur';
}

export default function DocumentAgent({ language = 'en' }: DocumentAgentProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [recentDocs, setRecentDocs] = useState<GeneratedDocument[]>([
    { id: 'doc-1', templateId: 'legal-notice', title: 'Legal Notice - Property Dispute', content: '', createdAt: new Date('2026-03-10'), status: 'sent' },
    { id: 'doc-2', templateId: 'affidavit', title: 'Affidavit - Identity Verification', content: '', createdAt: new Date('2026-03-08'), status: 'approved' }
  ]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      const docContent = `
LEGAL DOCUMENT
==============

Document Type: ${selectedTemplate.name}
Generated by: EHB AI Document Agent
Date: ${new Date().toLocaleDateString()}
Language: ${selectedLanguage}

---

${selectedTemplate.fields.map(field => {
  const value = formData[field.id] || '[Not Provided]';
  return `${field.name}: ${value}`;
}).join('\n\n')}

---

This document has been automatically generated by the EHB AI Document Agent.
Please review all information carefully before use.

For legal validity, this document may require:
- Notarization
- Stamp paper
- Witness signatures
- Court attestation

Generated on behalf of EHB Law Services Platform.
      `;
      
      setGeneratedDoc(docContent);
      setIsGenerating(false);
    }, 2500);
  };

  const getStatusColor = (status: GeneratedDocument['status']) => {
    const colors = {
      draft: 'bg-gray-500',
      review: 'bg-yellow-500',
      approved: 'bg-green-500',
      sent: 'bg-blue-500'
    };
    return colors[status];
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-orange-500/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <FileText className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={20} />
              {language === 'ur' ? 'دستاویز ایجنٹ' : 'Legal Document Agent'}
            </h2>
            <p className="text-ehb-textMuted text-sm">
              {language === 'ur' ? 'AI سے خودکار قانونی دستاویزات' : 'AI-powered automatic legal document generation'}
            </p>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl flex-shrink-0 min-w-[200px]"
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{doc.title}</p>
                <p className="text-slate-500 text-xs">{doc.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Template Selection */}
      {!selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-white font-bold text-lg mb-4">
            {language === 'ur' ? 'دستاویز ٹیمپلیٹ منتخب کریں' : 'Select Document Template'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENT_TEMPLATES.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTemplate(template)}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <FileText className="text-orange-400" size={20} />
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-orange-400 transition-colors" size={20} />
                </div>
                <h4 className="text-white font-bold mb-1">
                  {language === 'ur' ? template.nameUrdu : template.name}
                </h4>
                <p className="text-ehb-textMuted text-sm mb-3">
                  {language === 'ur' ? template.descriptionUrdu : template.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded text-xs">
                    {language === 'ur' ? template.categoryUrdu : template.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Languages size={12} />
                    {template.languages.length} {language === 'ur' ? 'زبانیں' : 'languages'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Document Form */}
      {selectedTemplate && !generatedDoc && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => { setSelectedTemplate(null); setFormData({}); }}
                className="text-ehb-textMuted text-sm hover:text-white mb-2"
              >
                ← {language === 'ur' ? 'واپس' : 'Back to templates'}
              </button>
              <h3 className="text-white font-bold text-xl">
                {language === 'ur' ? selectedTemplate.nameUrdu : selectedTemplate.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="text-ehb-textMuted" size={16} />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none"
              >
                {selectedTemplate.languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {selectedTemplate.fields.map((field) => (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-ehb-textBody text-sm font-medium mb-2">
                  {language === 'ur' ? field.nameUrdu : field.name}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">{language === 'ur' ? 'منتخب کریں' : 'Select...'}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={generateDocument}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                {language === 'ur' ? 'دستاویز بنائی جا رہی ہے...' : 'Generating Document...'}
              </>
            ) : (
              <>
                <Sparkles size={24} />
                {language === 'ur' ? 'AI سے دستاویز بنائیں' : 'Generate with AI'}
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Generated Document */}
      {generatedDoc && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="text-green-400" size={24} />
              <h3 className="text-white font-bold text-lg">
                {language === 'ur' ? 'دستاویز تیار ہے' : 'Document Generated'}
              </h3>
            </div>
            <button
              onClick={() => { setGeneratedDoc(null); setFormData({}); setSelectedTemplate(null); }}
              className="text-ehb-textMuted hover:text-white text-sm"
            >
              {language === 'ur' ? 'نئی دستاویز' : 'New Document'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-700/50 px-6 py-3 flex items-center justify-between">
              <span className="text-white font-medium">
                {selectedTemplate?.name} - {selectedLanguage}
              </span>
              <div className="flex items-center gap-2 text-xs text-ehb-textMuted">
                <Clock size={14} />
                {new Date().toLocaleString()}
              </div>
            </div>
            <pre className="p-6 text-ehb-textBody text-sm whitespace-pre-wrap font-mono max-h-[500px] overflow-y-auto">
              {generatedDoc}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30">
              <Download size={18} />
              {language === 'ur' ? 'PDF ڈاؤن لوڈ' : 'Download PDF'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl font-medium hover:bg-blue-500/30">
              <Download size={18} />
              {language === 'ur' ? 'Word ڈاؤن لوڈ' : 'Download Word'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-xl font-medium hover:bg-violet-500/30">
              <Edit size={18} />
              {language === 'ur' ? 'ترمیم کریں' : 'Edit Document'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-xl font-medium hover:bg-orange-500/30">
              <Printer size={18} />
              {language === 'ur' ? 'پرنٹ کریں' : 'Print'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-gold/20 text-brand-gold rounded-xl font-medium hover:bg-brand-gold/30">
              <Send size={18} />
              {language === 'ur' ? 'ای میل کریں' : 'Send via Email'}
            </button>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-amber-400 font-medium text-sm">
                {language === 'ur' ? 'اہم نوٹ' : 'Important Note'}
              </p>
              <p className="text-amber-400/70 text-sm">
                {language === 'ur' 
                  ? 'براہ کرم استعمال سے پہلے تمام معلومات کی تصدیق کریں۔ قانونی درستگی کے لیے نوٹرائزیشن ضروری ہو سکتی ہے۔'
                  : 'Please verify all information before use. Notarization may be required for legal validity.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
