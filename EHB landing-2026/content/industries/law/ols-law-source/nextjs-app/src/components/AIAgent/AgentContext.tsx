'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Case Types
export type CaseType = 
  | 'divorce' | 'khula' | 'child_custody' | 'maintenance' 
  | 'property_dispute' | 'property_transfer' | 'inheritance'
  | 'criminal_defense' | 'bail' | 'fir'
  | 'business_registration' | 'contract_dispute' | 'partnership'
  | 'immigration' | 'visa' | 'citizenship'
  | 'accident_claim' | 'medical_malpractice'
  | 'cyber_crime' | 'defamation'
  | 'other';

export interface CaseTypeInfo {
  id: CaseType;
  name: string;
  nameUrdu: string;
  category: string;
  requiredDocs: string[];
  requiredDocsUrdu: string[];
  questions: Array<{ id: string; question: string; questionUrdu: string; type: 'text' | 'date' | 'select' | 'textarea'; options?: string[] }>;
  estimatedTime: string;
  baseFee: number;
}

export const CASE_TYPES: Record<CaseType, CaseTypeInfo> = {
  divorce: {
    id: 'divorce',
    name: 'Divorce Case',
    nameUrdu: 'طلاق کا کیس',
    category: 'Family Law',
    requiredDocs: ['Marriage Certificate (Nikah Nama)', 'ID Card (CNIC)', 'Address Proof'],
    requiredDocsUrdu: ['نکاح نامہ', 'شناختی کارڈ', 'پتے کا ثبوت'],
    questions: [
      { id: 'name', question: 'What is your full name?', questionUrdu: 'آپ کا پورا نام کیا ہے؟', type: 'text' },
      { id: 'spouse_name', question: "What is your spouse's name?", questionUrdu: 'آپ کے شریک حیات کا نام کیا ہے؟', type: 'text' },
      { id: 'marriage_date', question: 'When did the marriage take place?', questionUrdu: 'شادی کب ہوئی تھی؟', type: 'date' },
      { id: 'city', question: 'Which city are you located in?', questionUrdu: 'آپ کس شہر میں ہیں؟', type: 'text' },
      { id: 'children', question: 'Do you have any children?', questionUrdu: 'کیا آپ کے بچے ہیں؟', type: 'select', options: ['Yes', 'No'] },
      { id: 'reason', question: 'Brief reason for divorce', questionUrdu: 'طلاق کی مختصر وجہ', type: 'textarea' },
    ],
    estimatedTime: '3-6 months',
    baseFee: 500
  },
  khula: {
    id: 'khula',
    name: 'Khula Case',
    nameUrdu: 'خلع کا کیس',
    category: 'Family Law',
    requiredDocs: ['Marriage Certificate (Nikah Nama)', 'ID Card (CNIC)', 'Mehr Details'],
    requiredDocsUrdu: ['نکاح نامہ', 'شناختی کارڈ', 'مہر کی تفصیلات'],
    questions: [
      { id: 'name', question: 'What is your full name?', questionUrdu: 'آپ کا پورا نام کیا ہے؟', type: 'text' },
      { id: 'husband_name', question: "What is your husband's name?", questionUrdu: 'آپ کے شوہر کا نام کیا ہے؟', type: 'text' },
      { id: 'marriage_date', question: 'Marriage date', questionUrdu: 'شادی کی تاریخ', type: 'date' },
      { id: 'mehr_amount', question: 'Mehr amount mentioned in Nikah Nama', questionUrdu: 'نکاح نامے میں درج مہر کی رقم', type: 'text' },
      { id: 'reason', question: 'Reason for seeking Khula', questionUrdu: 'خلع مانگنے کی وجہ', type: 'textarea' },
    ],
    estimatedTime: '2-4 months',
    baseFee: 400
  },
  child_custody: {
    id: 'child_custody',
    name: 'Child Custody Case',
    nameUrdu: 'بچے کی حضانت',
    category: 'Family Law',
    requiredDocs: ['Child Birth Certificate', 'Parent ID Cards', 'Marriage Certificate'],
    requiredDocsUrdu: ['بچے کا پیدائشی سرٹیفکیٹ', 'والدین کے شناختی کارڈ', 'نکاح نامہ'],
    questions: [
      { id: 'name', question: 'Your full name', questionUrdu: 'آپ کا پورا نام', type: 'text' },
      { id: 'child_name', question: "Child's name", questionUrdu: 'بچے کا نام', type: 'text' },
      { id: 'child_age', question: "Child's age", questionUrdu: 'بچے کی عمر', type: 'text' },
      { id: 'current_custody', question: 'Who currently has custody?', questionUrdu: 'فی الحال حضانت کس کے پاس ہے؟', type: 'text' },
      { id: 'reason', question: 'Reason for custody request', questionUrdu: 'حضانت کی درخواست کی وجہ', type: 'textarea' },
    ],
    estimatedTime: '4-8 months',
    baseFee: 600
  },
  maintenance: {
    id: 'maintenance',
    name: 'Maintenance Case',
    nameUrdu: 'نفقہ کا کیس',
    category: 'Family Law',
    requiredDocs: ['Marriage Certificate', 'ID Card', 'Income Proof'],
    requiredDocsUrdu: ['نکاح نامہ', 'شناختی کارڈ', 'آمدنی کا ثبوت'],
    questions: [
      { id: 'name', question: 'Your full name', questionUrdu: 'آپ کا پورا نام', type: 'text' },
      { id: 'spouse_name', question: "Spouse's name", questionUrdu: 'شریک حیات کا نام', type: 'text' },
      { id: 'children_count', question: 'Number of children', questionUrdu: 'بچوں کی تعداد', type: 'text' },
      { id: 'monthly_expenses', question: 'Monthly expenses', questionUrdu: 'ماہانہ اخراجات', type: 'text' },
    ],
    estimatedTime: '2-4 months',
    baseFee: 350
  },
  property_dispute: {
    id: 'property_dispute',
    name: 'Property Dispute',
    nameUrdu: 'جائیداد کا تنازعہ',
    category: 'Property Law',
    requiredDocs: ['Property Documents', 'Ownership Proof', 'ID Card', 'Sale Agreement'],
    requiredDocsUrdu: ['جائیداد کے کاغذات', 'ملکیت کا ثبوت', 'شناختی کارڈ', 'فروخت نامہ'],
    questions: [
      { id: 'name', question: 'Your full name', questionUrdu: 'آپ کا پورا نام', type: 'text' },
      { id: 'property_type', question: 'Type of property', questionUrdu: 'جائیداد کی قسم', type: 'select', options: ['Land', 'House', 'Commercial', 'Agricultural'] },
      { id: 'property_location', question: 'Property location', questionUrdu: 'جائیداد کا مقام', type: 'text' },
      { id: 'dispute_with', question: 'Dispute with whom?', questionUrdu: 'تنازعہ کس سے ہے؟', type: 'text' },
      { id: 'dispute_details', question: 'Describe the dispute', questionUrdu: 'تنازعہ کی تفصیل', type: 'textarea' },
    ],
    estimatedTime: '6-12 months',
    baseFee: 800
  },
  property_transfer: {
    id: 'property_transfer',
    name: 'Property Transfer',
    nameUrdu: 'جائیداد کی منتقلی',
    category: 'Property Law',
    requiredDocs: ['Property Documents', 'ID Cards of Both Parties', 'NOC'],
    requiredDocsUrdu: ['جائیداد کے کاغذات', 'دونوں فریقین کے شناختی کارڈ', 'این او سی'],
    questions: [
      { id: 'seller_name', question: 'Seller name', questionUrdu: 'بیچنے والے کا نام', type: 'text' },
      { id: 'buyer_name', question: 'Buyer name', questionUrdu: 'خریدار کا نام', type: 'text' },
      { id: 'property_details', question: 'Property details', questionUrdu: 'جائیداد کی تفصیلات', type: 'textarea' },
      { id: 'sale_amount', question: 'Sale amount', questionUrdu: 'فروخت کی رقم', type: 'text' },
    ],
    estimatedTime: '2-4 weeks',
    baseFee: 400
  },
  inheritance: {
    id: 'inheritance',
    name: 'Inheritance Case',
    nameUrdu: 'وراثت کا کیس',
    category: 'Property Law',
    requiredDocs: ['Death Certificate', 'Family Tree', 'Property Documents', 'ID Cards'],
    requiredDocsUrdu: ['موت کا سرٹیفکیٹ', 'شجرہ نسب', 'جائیداد کے کاغذات', 'شناختی کارڈ'],
    questions: [
      { id: 'deceased_name', question: 'Name of deceased', questionUrdu: 'مرحوم کا نام', type: 'text' },
      { id: 'relation', question: 'Your relation', questionUrdu: 'آپ کا رشتہ', type: 'text' },
      { id: 'heirs_count', question: 'Number of heirs', questionUrdu: 'وارثین کی تعداد', type: 'text' },
      { id: 'property_details', question: 'Property details', questionUrdu: 'جائیداد کی تفصیلات', type: 'textarea' },
    ],
    estimatedTime: '3-6 months',
    baseFee: 600
  },
  criminal_defense: {
    id: 'criminal_defense',
    name: 'Criminal Defense',
    nameUrdu: 'فوجداری دفاع',
    category: 'Criminal Law',
    requiredDocs: ['FIR Copy', 'ID Card', 'Witness Details'],
    requiredDocsUrdu: ['ایف آئی آر کی کاپی', 'شناختی کارڈ', 'گواہوں کی تفصیلات'],
    questions: [
      { id: 'name', question: 'Accused name', questionUrdu: 'ملزم کا نام', type: 'text' },
      { id: 'fir_number', question: 'FIR number', questionUrdu: 'ایف آئی آر نمبر', type: 'text' },
      { id: 'police_station', question: 'Police station', questionUrdu: 'تھانہ', type: 'text' },
      { id: 'charges', question: 'Charges/Sections', questionUrdu: 'الزامات/دفعات', type: 'text' },
      { id: 'case_details', question: 'Case details', questionUrdu: 'کیس کی تفصیل', type: 'textarea' },
    ],
    estimatedTime: 'Varies',
    baseFee: 1000
  },
  bail: {
    id: 'bail',
    name: 'Bail Application',
    nameUrdu: 'ضمانت کی درخواست',
    category: 'Criminal Law',
    requiredDocs: ['FIR Copy', 'ID Card', 'Surety Documents'],
    requiredDocsUrdu: ['ایف آئی آر کی کاپی', 'شناختی کارڈ', 'ضامن کے کاغذات'],
    questions: [
      { id: 'accused_name', question: 'Accused name', questionUrdu: 'ملزم کا نام', type: 'text' },
      { id: 'fir_number', question: 'FIR number', questionUrdu: 'ایف آئی آر نمبر', type: 'text' },
      { id: 'jail_name', question: 'Current jail/custody', questionUrdu: 'موجودہ جیل/حراست', type: 'text' },
      { id: 'surety_name', question: 'Surety provider name', questionUrdu: 'ضامن کا نام', type: 'text' },
    ],
    estimatedTime: '1-2 weeks',
    baseFee: 500
  },
  fir: {
    id: 'fir',
    name: 'FIR Registration Help',
    nameUrdu: 'ایف آئی آر درج کروانا',
    category: 'Criminal Law',
    requiredDocs: ['ID Card', 'Evidence', 'Witness Details'],
    requiredDocsUrdu: ['شناختی کارڈ', 'ثبوت', 'گواہوں کی تفصیلات'],
    questions: [
      { id: 'complainant_name', question: 'Complainant name', questionUrdu: 'مدعی کا نام', type: 'text' },
      { id: 'incident_date', question: 'Incident date', questionUrdu: 'واقعہ کی تاریخ', type: 'date' },
      { id: 'incident_location', question: 'Incident location', questionUrdu: 'واقعہ کی جگہ', type: 'text' },
      { id: 'accused_details', question: 'Accused details', questionUrdu: 'ملزم کی تفصیلات', type: 'textarea' },
      { id: 'incident_details', question: 'Incident details', questionUrdu: 'واقعہ کی تفصیل', type: 'textarea' },
    ],
    estimatedTime: '1-3 days',
    baseFee: 200
  },
  business_registration: {
    id: 'business_registration',
    name: 'Business Registration',
    nameUrdu: 'کاروبار کی رجسٹریشن',
    category: 'Business Law',
    requiredDocs: ['Director ID Cards', 'MOA/AOA', 'Office Address Proof'],
    requiredDocsUrdu: ['ڈائریکٹرز کے شناختی کارڈ', 'ایم او اے/اے او اے', 'دفتر کے پتے کا ثبوت'],
    questions: [
      { id: 'company_name', question: 'Proposed company name', questionUrdu: 'مجوزہ کمپنی کا نام', type: 'text' },
      { id: 'business_type', question: 'Business type', questionUrdu: 'کاروبار کی قسم', type: 'select', options: ['Private Limited', 'Partnership', 'Sole Proprietorship'] },
      { id: 'directors_count', question: 'Number of directors', questionUrdu: 'ڈائریکٹرز کی تعداد', type: 'text' },
      { id: 'capital', question: 'Initial capital', questionUrdu: 'ابتدائی سرمایہ', type: 'text' },
    ],
    estimatedTime: '2-4 weeks',
    baseFee: 500
  },
  contract_dispute: {
    id: 'contract_dispute',
    name: 'Contract Dispute',
    nameUrdu: 'معاہدے کا تنازعہ',
    category: 'Business Law',
    requiredDocs: ['Contract Copy', 'ID Cards', 'Communication Records'],
    requiredDocsUrdu: ['معاہدے کی کاپی', 'شناختی کارڈ', 'مراسلات کا ریکارڈ'],
    questions: [
      { id: 'your_name', question: 'Your name', questionUrdu: 'آپ کا نام', type: 'text' },
      { id: 'other_party', question: 'Other party name', questionUrdu: 'دوسری پارٹی کا نام', type: 'text' },
      { id: 'contract_date', question: 'Contract date', questionUrdu: 'معاہدے کی تاریخ', type: 'date' },
      { id: 'dispute_details', question: 'Dispute details', questionUrdu: 'تنازعہ کی تفصیل', type: 'textarea' },
    ],
    estimatedTime: '2-6 months',
    baseFee: 600
  },
  partnership: {
    id: 'partnership',
    name: 'Partnership Agreement',
    nameUrdu: 'شراکت داری کا معاہدہ',
    category: 'Business Law',
    requiredDocs: ['Partner ID Cards', 'Business Details', 'Capital Details'],
    requiredDocsUrdu: ['شراکت داروں کے شناختی کارڈ', 'کاروبار کی تفصیلات', 'سرمائے کی تفصیلات'],
    questions: [
      { id: 'partner_count', question: 'Number of partners', questionUrdu: 'شراکت داروں کی تعداد', type: 'text' },
      { id: 'business_name', question: 'Business name', questionUrdu: 'کاروبار کا نام', type: 'text' },
      { id: 'profit_ratio', question: 'Profit sharing ratio', questionUrdu: 'منافع کی تقسیم', type: 'text' },
    ],
    estimatedTime: '1-2 weeks',
    baseFee: 350
  },
  immigration: {
    id: 'immigration',
    name: 'Immigration Help',
    nameUrdu: 'امیگریشن میں مدد',
    category: 'Immigration',
    requiredDocs: ['Passport', 'Visa History', 'Financial Documents'],
    requiredDocsUrdu: ['پاسپورٹ', 'ویزا ہسٹری', 'مالی دستاویزات'],
    questions: [
      { id: 'name', question: 'Full name as in passport', questionUrdu: 'پاسپورٹ میں درج نام', type: 'text' },
      { id: 'destination', question: 'Destination country', questionUrdu: 'منزل ملک', type: 'text' },
      { id: 'purpose', question: 'Purpose of travel', questionUrdu: 'سفر کا مقصد', type: 'select', options: ['Work', 'Study', 'Visit', 'Immigration'] },
      { id: 'previous_visa', question: 'Previous visa history', questionUrdu: 'پچھلی ویزا ہسٹری', type: 'textarea' },
    ],
    estimatedTime: '2-6 months',
    baseFee: 600
  },
  visa: {
    id: 'visa',
    name: 'Visa Application',
    nameUrdu: 'ویزا کی درخواست',
    category: 'Immigration',
    requiredDocs: ['Passport', 'Bank Statements', 'Employment Proof', 'Invitation Letter'],
    requiredDocsUrdu: ['پاسپورٹ', 'بینک اسٹیٹمنٹ', 'ملازمت کا ثبوت', 'دعوت نامہ'],
    questions: [
      { id: 'name', question: 'Full name', questionUrdu: 'پورا نام', type: 'text' },
      { id: 'country', question: 'Which country visa?', questionUrdu: 'کس ملک کا ویزا؟', type: 'text' },
      { id: 'visa_type', question: 'Visa type', questionUrdu: 'ویزا کی قسم', type: 'select', options: ['Tourist', 'Business', 'Student', 'Work'] },
    ],
    estimatedTime: '2-8 weeks',
    baseFee: 400
  },
  citizenship: {
    id: 'citizenship',
    name: 'Citizenship Application',
    nameUrdu: 'شہریت کی درخواست',
    category: 'Immigration',
    requiredDocs: ['Birth Certificate', 'Residence Proof', 'ID Documents', 'Background Check'],
    requiredDocsUrdu: ['پیدائشی سرٹیفکیٹ', 'رہائش کا ثبوت', 'شناختی دستاویزات', 'پس منظر کی جانچ'],
    questions: [
      { id: 'name', question: 'Full name', questionUrdu: 'پورا نام', type: 'text' },
      { id: 'country', question: 'Which country citizenship?', questionUrdu: 'کس ملک کی شہریت؟', type: 'text' },
      { id: 'residence_years', question: 'Years of residence', questionUrdu: 'رہائش کے سال', type: 'text' },
    ],
    estimatedTime: '6-24 months',
    baseFee: 1000
  },
  accident_claim: {
    id: 'accident_claim',
    name: 'Accident Claim',
    nameUrdu: 'حادثے کا دعویٰ',
    category: 'Claims',
    requiredDocs: ['Accident Report', 'Medical Records', 'Insurance Details', 'Photos/Videos'],
    requiredDocsUrdu: ['حادثے کی رپورٹ', 'طبی ریکارڈ', 'انشورنس کی تفصیلات', 'تصاویر/ویڈیوز'],
    questions: [
      { id: 'name', question: 'Victim name', questionUrdu: 'متاثرہ کا نام', type: 'text' },
      { id: 'accident_date', question: 'Accident date', questionUrdu: 'حادثے کی تاریخ', type: 'date' },
      { id: 'accident_location', question: 'Accident location', questionUrdu: 'حادثے کی جگہ', type: 'text' },
      { id: 'injuries', question: 'Injuries sustained', questionUrdu: 'لگنے والی چوٹیں', type: 'textarea' },
      { id: 'insurance_company', question: 'Insurance company', questionUrdu: 'انشورنس کمپنی', type: 'text' },
    ],
    estimatedTime: '2-6 months',
    baseFee: 500
  },
  medical_malpractice: {
    id: 'medical_malpractice',
    name: 'Medical Malpractice',
    nameUrdu: 'طبی غفلت',
    category: 'Claims',
    requiredDocs: ['Medical Records', 'Hospital Bills', 'Expert Report', 'Consent Forms'],
    requiredDocsUrdu: ['طبی ریکارڈ', 'ہسپتال کے بل', 'ماہر کی رپورٹ', 'رضامندی کے فارم'],
    questions: [
      { id: 'patient_name', question: 'Patient name', questionUrdu: 'مریض کا نام', type: 'text' },
      { id: 'hospital', question: 'Hospital/Doctor name', questionUrdu: 'ہسپتال/ڈاکٹر کا نام', type: 'text' },
      { id: 'treatment_date', question: 'Treatment date', questionUrdu: 'علاج کی تاریخ', type: 'date' },
      { id: 'malpractice_details', question: 'What went wrong?', questionUrdu: 'کیا غلط ہوا؟', type: 'textarea' },
    ],
    estimatedTime: '6-18 months',
    baseFee: 800
  },
  cyber_crime: {
    id: 'cyber_crime',
    name: 'Cyber Crime',
    nameUrdu: 'سائبر کرائم',
    category: 'Cyber Law',
    requiredDocs: ['Screenshots', 'Digital Evidence', 'ID Card', 'Communication Records'],
    requiredDocsUrdu: ['اسکرین شاٹس', 'ڈیجیٹل ثبوت', 'شناختی کارڈ', 'مراسلات کا ریکارڈ'],
    questions: [
      { id: 'victim_name', question: 'Victim name', questionUrdu: 'متاثرہ کا نام', type: 'text' },
      { id: 'crime_type', question: 'Type of cyber crime', questionUrdu: 'سائبر کرائم کی قسم', type: 'select', options: ['Hacking', 'Online Fraud', 'Harassment', 'Data Theft', 'Other'] },
      { id: 'platform', question: 'Platform used', questionUrdu: 'استعمال شدہ پلیٹ فارم', type: 'text' },
      { id: 'crime_details', question: 'Crime details', questionUrdu: 'جرم کی تفصیل', type: 'textarea' },
    ],
    estimatedTime: '2-6 months',
    baseFee: 500
  },
  defamation: {
    id: 'defamation',
    name: 'Defamation Case',
    nameUrdu: 'ہتک عزت کا کیس',
    category: 'Cyber Law',
    requiredDocs: ['Evidence of Defamation', 'Screenshots', 'Witness Details', 'ID Card'],
    requiredDocsUrdu: ['ہتک عزت کا ثبوت', 'اسکرین شاٹس', 'گواہوں کی تفصیلات', 'شناختی کارڈ'],
    questions: [
      { id: 'victim_name', question: 'Victim name', questionUrdu: 'متاثرہ کا نام', type: 'text' },
      { id: 'accused_name', question: 'Accused name', questionUrdu: 'ملزم کا نام', type: 'text' },
      { id: 'defamation_date', question: 'When did it happen?', questionUrdu: 'یہ کب ہوا؟', type: 'date' },
      { id: 'defamation_details', question: 'What was said/written?', questionUrdu: 'کیا کہا/لکھا گیا؟', type: 'textarea' },
    ],
    estimatedTime: '3-12 months',
    baseFee: 600
  },
  other: {
    id: 'other',
    name: 'Other Legal Matter',
    nameUrdu: 'دیگر قانونی معاملہ',
    category: 'General',
    requiredDocs: ['ID Card', 'Relevant Documents'],
    requiredDocsUrdu: ['شناختی کارڈ', 'متعلقہ دستاویزات'],
    questions: [
      { id: 'name', question: 'Your name', questionUrdu: 'آپ کا نام', type: 'text' },
      { id: 'matter_type', question: 'Type of legal matter', questionUrdu: 'قانونی معاملے کی قسم', type: 'text' },
      { id: 'details', question: 'Describe your legal issue', questionUrdu: 'اپنا قانونی مسئلہ بیان کریں', type: 'textarea' },
    ],
    estimatedTime: 'Varies',
    baseFee: 300
  }
};

// Agent State
export type AgentPhase = 
  | 'idle' 
  | 'understanding' 
  | 'confirming' 
  | 'collecting_info' 
  | 'collecting_docs' 
  | 'matching_lawyer' 
  | 'creating_case' 
  | 'payment' 
  | 'completed';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'uploaded' | 'verified' | 'rejected';
}

export interface MatchedLawyer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  sqlLevel: string;
  fee: number;
  city: string;
  image?: string;
}

export interface CaseData {
  id?: string;
  type: CaseType;
  answers: Record<string, string>;
  documents: UploadedDocument[];
  selectedLawyer?: MatchedLawyer;
  status: 'draft' | 'submitted' | 'in_progress' | 'completed';
  createdAt?: Date;
  totalFee?: number;
  paymentStatus?: 'pending' | 'paid' | 'in_escrow' | 'released';
}

interface AgentContextType {
  phase: AgentPhase;
  setPhase: (phase: AgentPhase) => void;
  caseType: CaseType | null;
  setCaseType: (type: CaseType | null) => void;
  caseData: CaseData | null;
  setCaseData: React.Dispatch<React.SetStateAction<CaseData | null>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  matchedLawyers: MatchedLawyer[];
  setMatchedLawyers: (lawyers: MatchedLawyer[]) => void;
  agentMessages: Array<{ role: 'agent' | 'user'; message: string; timestamp: Date }>;
  addAgentMessage: (role: 'agent' | 'user', message: string) => void;
  clearAgent: () => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [caseType, setCaseType] = useState<CaseType | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [matchedLawyers, setMatchedLawyers] = useState<MatchedLawyer[]>([]);
  const [agentMessages, setAgentMessages] = useState<Array<{ role: 'agent' | 'user'; message: string; timestamp: Date }>>([]);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const addAgentMessage = useCallback((role: 'agent' | 'user', message: string) => {
    setAgentMessages(prev => [...prev, { role, message, timestamp: new Date() }]);
  }, []);

  const clearAgent = useCallback(() => {
    setPhase('idle');
    setCaseType(null);
    setCaseData(null);
    setCurrentQuestionIndex(0);
    setMatchedLawyers([]);
    setAgentMessages([]);
  }, []);

  return (
    <AgentContext.Provider value={{
      phase,
      setPhase,
      caseType,
      setCaseType,
      caseData,
      setCaseData,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      matchedLawyers,
      setMatchedLawyers,
      agentMessages,
      addAgentMessage,
      clearAgent,
      language,
      setLanguage
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}
