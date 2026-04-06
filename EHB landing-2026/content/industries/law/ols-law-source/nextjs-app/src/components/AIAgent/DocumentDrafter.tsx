'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Sparkles, Download, Edit3, Copy, Check,
  Loader2, ChevronRight, File, Printer, Mail, Save,
  RefreshCw, AlertCircle
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  nameUrdu: string;
  category: string;
  icon: React.ElementType;
  fields: Array<{
    id: string;
    label: string;
    labelUrdu: string;
    type: 'text' | 'textarea' | 'date' | 'number';
    placeholder?: string;
  }>;
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'legal_notice',
    name: 'Legal Notice',
    nameUrdu: 'قانونی نوٹس',
    category: 'General',
    icon: FileText,
    fields: [
      { id: 'sender_name', label: 'Sender Name', labelUrdu: 'بھیجنے والے کا نام', type: 'text' },
      { id: 'sender_address', label: 'Sender Address', labelUrdu: 'بھیجنے والے کا پتہ', type: 'textarea' },
      { id: 'recipient_name', label: 'Recipient Name', labelUrdu: 'وصول کنندہ کا نام', type: 'text' },
      { id: 'recipient_address', label: 'Recipient Address', labelUrdu: 'وصول کنندہ کا پتہ', type: 'textarea' },
      { id: 'subject', label: 'Subject/Matter', labelUrdu: 'موضوع', type: 'text' },
      { id: 'notice_body', label: 'Notice Details', labelUrdu: 'نوٹس کی تفصیلات', type: 'textarea' },
      { id: 'demand', label: 'Demand/Relief Sought', labelUrdu: 'مطالبہ', type: 'textarea' },
      { id: 'deadline_days', label: 'Response Deadline (days)', labelUrdu: 'جواب کی آخری تاریخ (دن)', type: 'number' },
    ]
  },
  {
    id: 'rent_notice',
    name: 'Rent Recovery Notice',
    nameUrdu: 'کرایہ وصولی کا نوٹس',
    category: 'Property',
    icon: File,
    fields: [
      { id: 'landlord_name', label: 'Landlord Name', labelUrdu: 'مالک مکان کا نام', type: 'text' },
      { id: 'tenant_name', label: 'Tenant Name', labelUrdu: 'کرایہ دار کا نام', type: 'text' },
      { id: 'property_address', label: 'Property Address', labelUrdu: 'جائیداد کا پتہ', type: 'textarea' },
      { id: 'rent_amount', label: 'Monthly Rent Amount', labelUrdu: 'ماہانہ کرایہ', type: 'number' },
      { id: 'pending_months', label: 'Pending Months', labelUrdu: 'بقایا مہینے', type: 'number' },
      { id: 'total_pending', label: 'Total Pending Amount', labelUrdu: 'کل بقایا رقم', type: 'number' },
    ]
  },
  {
    id: 'power_of_attorney',
    name: 'Power of Attorney',
    nameUrdu: 'مختار نامہ',
    category: 'General',
    icon: FileText,
    fields: [
      { id: 'principal_name', label: 'Principal Name', labelUrdu: 'اصل کا نام', type: 'text' },
      { id: 'principal_cnic', label: 'Principal CNIC', labelUrdu: 'اصل کا شناختی کارڈ', type: 'text' },
      { id: 'attorney_name', label: 'Attorney Name', labelUrdu: 'وکیل کا نام', type: 'text' },
      { id: 'attorney_cnic', label: 'Attorney CNIC', labelUrdu: 'وکیل کا شناختی کارڈ', type: 'text' },
      { id: 'powers', label: 'Powers Granted', labelUrdu: 'دی گئی اختیارات', type: 'textarea' },
      { id: 'validity', label: 'Validity Period', labelUrdu: 'میعاد', type: 'text' },
    ]
  },
  {
    id: 'affidavit',
    name: 'Affidavit',
    nameUrdu: 'حلف نامہ',
    category: 'General',
    icon: FileText,
    fields: [
      { id: 'deponent_name', label: 'Deponent Name', labelUrdu: 'حلف اٹھانے والے کا نام', type: 'text' },
      { id: 'father_name', label: 'Father Name', labelUrdu: 'والد کا نام', type: 'text' },
      { id: 'cnic', label: 'CNIC Number', labelUrdu: 'شناختی کارڈ نمبر', type: 'text' },
      { id: 'address', label: 'Address', labelUrdu: 'پتہ', type: 'textarea' },
      { id: 'statement', label: 'Statement', labelUrdu: 'بیان', type: 'textarea' },
    ]
  },
  {
    id: 'rental_agreement',
    name: 'Rental Agreement',
    nameUrdu: 'کرایہ نامہ',
    category: 'Property',
    icon: File,
    fields: [
      { id: 'landlord_name', label: 'Landlord Name', labelUrdu: 'مالک مکان', type: 'text' },
      { id: 'tenant_name', label: 'Tenant Name', labelUrdu: 'کرایہ دار', type: 'text' },
      { id: 'property_address', label: 'Property Address', labelUrdu: 'جائیداد کا پتہ', type: 'textarea' },
      { id: 'monthly_rent', label: 'Monthly Rent', labelUrdu: 'ماہانہ کرایہ', type: 'number' },
      { id: 'security_deposit', label: 'Security Deposit', labelUrdu: 'سیکیورٹی ڈپازٹ', type: 'number' },
      { id: 'start_date', label: 'Start Date', labelUrdu: 'شروع کی تاریخ', type: 'date' },
      { id: 'duration', label: 'Duration (months)', labelUrdu: 'مدت (مہینے)', type: 'number' },
    ]
  }
];

interface DocumentDrafterProps {
  language?: 'en' | 'ur';
}

export default function DocumentDrafter({ language = 'en' }: DocumentDrafterProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState('');

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const generateDocument = useCallback(() => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      let document = '';
      
      if (selectedTemplate.id === 'legal_notice') {
        document = `
LEGAL NOTICE

Date: ${new Date().toLocaleDateString()}

TO:
${formData.recipient_name || '[Recipient Name]'}
${formData.recipient_address || '[Recipient Address]'}

FROM:
${formData.sender_name || '[Sender Name]'}
${formData.sender_address || '[Sender Address]'}

SUBJECT: ${formData.subject || '[Subject Matter]'}

Dear Sir/Madam,

Under instructions and on behalf of my client, ${formData.sender_name || '[Sender Name]'}, I hereby serve upon you the following Legal Notice:

${formData.notice_body || '[Notice Details]'}

DEMAND:
${formData.demand || '[Relief/Demand Sought]'}

You are hereby called upon to comply with the above demand within ${formData.deadline_days || '15'} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, at your risk and cost.

Please note that this notice is issued without prejudice to any other rights and remedies available to my client under the law.

Yours faithfully,

________________________
Advocate
On behalf of ${formData.sender_name || '[Sender Name]'}
        `.trim();
      } else if (selectedTemplate.id === 'rent_notice') {
        const totalAmount = (Number(formData.rent_amount) || 0) * (Number(formData.pending_months) || 1);
        document = `
LEGAL NOTICE FOR RECOVERY OF RENT

Date: ${new Date().toLocaleDateString()}

TO:
${formData.tenant_name || '[Tenant Name]'}
(Tenant of the property mentioned below)

FROM:
${formData.landlord_name || '[Landlord Name]'}
(Landlord/Owner)

RE: Recovery of pending rent for property situated at:
${formData.property_address || '[Property Address]'}

Dear Sir/Madam,

Under instructions from my client, ${formData.landlord_name || '[Landlord Name]'}, I hereby serve upon you this Legal Notice demanding payment of pending rent.

PARTICULARS:
1. Monthly Rent: Rs. ${formData.rent_amount || '0'}
2. Pending Period: ${formData.pending_months || '0'} months
3. Total Pending Amount: Rs. ${formData.total_pending || totalAmount}

You are the tenant of the above-mentioned property and have failed to pay rent for ${formData.pending_months || '0'} consecutive months despite repeated reminders.

DEMAND:
You are hereby called upon to pay the total pending rent of Rs. ${formData.total_pending || totalAmount} within 15 days from the receipt of this notice.

Failing compliance, my client shall be constrained to initiate eviction proceedings and file a recovery suit against you, at your risk and cost.

Yours faithfully,

________________________
Advocate
On behalf of ${formData.landlord_name || '[Landlord Name]'}
        `.trim();
      } else if (selectedTemplate.id === 'affidavit') {
        document = `
AFFIDAVIT

I, ${formData.deponent_name || '[Deponent Name]'}, 
Son/Daughter of ${formData.father_name || '[Father Name]'},
CNIC No. ${formData.cnic || '[CNIC Number]'},
Resident of ${formData.address || '[Address]'},

Do hereby solemnly affirm and declare as under:

${formData.statement || '[Statement/Declaration]'}

I hereby declare that the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed therein.

DEPONENT

________________________
${formData.deponent_name || '[Deponent Name]'}

VERIFICATION

Verified at _____________ on this _____ day of _____________, 20___ that the contents of this affidavit are true and correct to the best of my knowledge and belief.

DEPONENT
        `.trim();
      } else {
        document = `
[DOCUMENT: ${selectedTemplate.name}]

Date: ${new Date().toLocaleDateString()}

${Object.entries(formData).map(([key, value]) => {
  const field = selectedTemplate.fields.find(f => f.id === key);
  return `${field?.label || key}: ${value || '[Not Provided]'}`;
}).join('\n')}

---
This document has been generated by EHB Law AI Document Drafter.
Please review and verify all information before use.
        `.trim();
      }

      setGeneratedDocument(document);
      setEditedDocument(document);
      setIsGenerating(false);
    }, 2000);
  }, [selectedTemplate, formData]);

  const copyToClipboard = async () => {
    const textToCopy = isEditing ? editedDocument : generatedDocument;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const regenerateDocument = () => {
    setGeneratedDocument(null);
    setEditedDocument('');
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-brand-gold flex items-center justify-center">
            <FileText className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI دستاویز ڈرافٹر' : 'AI Document Drafter'}
            </h2>
            <p className="text-slate-400">
              {language === 'ur' 
                ? 'قانونی دستاویزات خود بخود تیار کریں'
                : 'Automatically generate legal documents'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Template Selection */}
      {!selectedTemplate && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white font-bold text-lg mb-4">
            {language === 'ur' ? 'دستاویز کی قسم منتخب کریں' : 'Select Document Type'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENT_TEMPLATES.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTemplate(template)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-brand-gold/30 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                    <template.icon className="text-brand-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {language === 'ur' ? template.nameUrdu : template.name}
                    </h4>
                    <p className="text-slate-500 text-xs">{template.category}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-400 ml-auto" size={20} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Form */}
      {selectedTemplate && !generatedDocument && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <selectedTemplate.icon className="text-brand-gold" size={20} />
              {language === 'ur' ? selectedTemplate.nameUrdu : selectedTemplate.name}
            </h3>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setFormData({});
              }}
              className="text-slate-400 hover:text-white text-sm"
            >
              {language === 'ur' ? 'تبدیل کریں' : 'Change'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {selectedTemplate.fields.map((field) => (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-slate-400 text-sm mb-2">
                  {language === 'ur' ? field.labelUrdu : field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold border border-white/10"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold border border-white/10"
                  />
                )}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateDocument}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                {language === 'ur' ? 'دستاویز بن رہی ہے...' : 'Generating Document...'}
              </>
            ) : (
              <>
                <Sparkles size={24} />
                {language === 'ur' ? 'دستاویز بنائیں' : 'Generate Document'}
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Generated Document */}
      <AnimatePresence>
        {generatedDocument && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FileText className="text-brand-gold" size={20} />
                {language === 'ur' ? 'تیار شدہ دستاویز' : 'Generated Document'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-all ${
                    isEditing ? 'bg-brand-gold text-brand-dark' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
                <button
                  onClick={regenerateDocument}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={editedDocument}
                  onChange={(e) => setEditedDocument(e.target.value)}
                  className="w-full h-96 bg-white text-slate-800 rounded-xl p-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-slate-800 font-mono text-sm whitespace-pre-wrap min-h-[300px]">
                  {generatedDocument}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-500/10 rounded-xl">
                <AlertCircle className="text-blue-400 flex-shrink-0" size={18} />
                <p className="text-blue-400 text-sm">
                  {language === 'ur' 
                    ? 'براہ کرم استعمال سے پہلے تمام معلومات کی تصدیق کریں'
                    : 'Please verify all information before use'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 flex flex-wrap gap-3">
              <button className="flex-1 min-w-[120px] py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <Download size={20} />
                {language === 'ur' ? 'PDF ڈاؤن لوڈ' : 'Download PDF'}
              </button>
              <button className="flex-1 min-w-[120px] py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                <Printer size={20} />
                {language === 'ur' ? 'پرنٹ' : 'Print'}
              </button>
              <button className="flex-1 min-w-[120px] py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                <Mail size={20} />
                {language === 'ur' ? 'ای میل' : 'Email'}
              </button>
              <button className="flex-1 min-w-[120px] py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                <Save size={20} />
                {language === 'ur' ? 'محفوظ کریں' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
