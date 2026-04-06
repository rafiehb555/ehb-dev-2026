'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, Search, FileText, Clock, DollarSign, CheckCircle2,
  AlertTriangle, BookOpen, Scale, Building2, Briefcase,
  ChevronRight, ChevronDown, Flag, Sparkles, ArrowRight,
  Users, Shield, Loader2
} from 'lucide-react';

interface CountryLegalInfo {
  id: string;
  name: string;
  nameUrdu: string;
  flag: string;
  region: string;
  legalSystem: string;
  officialLanguage: string;
  categories: LegalCategory[];
}

interface LegalCategory {
  id: string;
  name: string;
  nameUrdu: string;
  procedures: LegalProcedure[];
}

interface LegalProcedure {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  requirements: string[];
  requirementsUrdu: string[];
  estimatedTime: string;
  estimatedCost: string;
  steps: string[];
  stepsUrdu: string[];
}

const COUNTRIES: CountryLegalInfo[] = [
  {
    id: 'uae',
    name: 'United Arab Emirates',
    nameUrdu: 'متحدہ عرب امارات',
    flag: '🇦🇪',
    region: 'Middle East',
    legalSystem: 'Civil Law (based on Egyptian and Islamic law)',
    officialLanguage: 'Arabic',
    categories: [
      {
        id: 'business',
        name: 'Business Registration',
        nameUrdu: 'کاروبار رجسٹریشن',
        procedures: [
          {
            id: 'company_setup',
            name: 'Company Setup',
            nameUrdu: 'کمپنی کا قیام',
            description: 'Register a new company in UAE mainland or free zone',
            descriptionUrdu: 'UAE میں نئی کمپنی رجسٹر کریں',
            requirements: ['Passport Copy', 'Business Plan', 'Initial Approval', 'Trade License Application'],
            requirementsUrdu: ['پاسپورٹ کاپی', 'بزنس پلان', 'ابتدائی منظوری', 'ٹریڈ لائسنس درخواست'],
            estimatedTime: '7-14 days',
            estimatedCost: '$5,000 - $15,000',
            steps: ['Choose business activity', 'Select company name', 'Get initial approval', 'Submit documents', 'Pay fees', 'Receive license'],
            stepsUrdu: ['کاروباری سرگرمی منتخب کریں', 'کمپنی کا نام منتخب کریں', 'ابتدائی منظوری حاصل کریں', 'دستاویزات جمع کرائیں', 'فیس ادا کریں', 'لائسنس حاصل کریں']
          }
        ]
      },
      {
        id: 'property',
        name: 'Property Law',
        nameUrdu: 'جائیداد قانون',
        procedures: [
          {
            id: 'property_purchase',
            name: 'Property Purchase',
            nameUrdu: 'جائیداد خریداری',
            description: 'Buy property in designated freehold areas',
            descriptionUrdu: 'مخصوص علاقوں میں جائیداد خریدیں',
            requirements: ['Passport', 'Proof of Funds', 'No Objection Certificate'],
            requirementsUrdu: ['پاسپورٹ', 'فنڈز کا ثبوت', 'این او سی'],
            estimatedTime: '2-4 weeks',
            estimatedCost: '4% of property value (transfer fee)',
            steps: ['Find property', 'Make offer', 'Sign MOU', 'Get NOC', 'Transfer ownership'],
            stepsUrdu: ['جائیداد تلاش کریں', 'پیشکش کریں', 'معاہدہ کریں', 'این او سی حاصل کریں', 'ملکیت منتقل کریں']
          }
        ]
      }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    nameUrdu: 'برطانیہ',
    flag: '🇬🇧',
    region: 'Europe',
    legalSystem: 'Common Law',
    officialLanguage: 'English',
    categories: [
      {
        id: 'immigration',
        name: 'Immigration',
        nameUrdu: 'امیگریشن',
        procedures: [
          {
            id: 'work_visa',
            name: 'Skilled Worker Visa',
            nameUrdu: 'ہنرمند ورکر ویزا',
            description: 'Work visa for skilled professionals',
            descriptionUrdu: 'ہنرمند پیشہ ور افراد کے لیے ورک ویزا',
            requirements: ['Job offer from UK employer', 'Certificate of Sponsorship', 'English proficiency', 'Financial proof'],
            requirementsUrdu: ['UK آجر سے نوکری کی پیشکش', 'سپانسرشپ سرٹیفکیٹ', 'انگریزی مہارت', 'مالی ثبوت'],
            estimatedTime: '3-8 weeks',
            estimatedCost: '£610 - £1,408 (application fee)',
            steps: ['Get job offer', 'Receive CoS', 'Apply online', 'Submit documents', 'Attend biometrics', 'Receive decision'],
            stepsUrdu: ['نوکری کی پیشکش حاصل کریں', 'CoS حاصل کریں', 'آن لائن درخواست دیں', 'دستاویزات جمع کرائیں', 'بائیومیٹرکس دیں', 'فیصلہ حاصل کریں']
          }
        ]
      }
    ]
  },
  {
    id: 'usa',
    name: 'United States',
    nameUrdu: 'امریکہ',
    flag: '🇺🇸',
    region: 'North America',
    legalSystem: 'Common Law (Federal and State)',
    officialLanguage: 'English',
    categories: [
      {
        id: 'immigration',
        name: 'Immigration',
        nameUrdu: 'امیگریشن',
        procedures: [
          {
            id: 'h1b_visa',
            name: 'H-1B Visa',
            nameUrdu: 'H-1B ویزا',
            description: 'Specialty occupation work visa',
            descriptionUrdu: 'خاص پیشے کا ورک ویزا',
            requirements: ['Bachelor degree or equivalent', 'Job offer in specialty occupation', 'Employer petition'],
            requirementsUrdu: ['بیچلر ڈگری یا مساوی', 'خاص پیشے میں نوکری کی پیشکش', 'آجر کی درخواست'],
            estimatedTime: '3-6 months',
            estimatedCost: '$1,710 - $8,000+ (filing fees)',
            steps: ['Employer files petition', 'USCIS lottery', 'Petition approved', 'Consular interview', 'Visa stamped'],
            stepsUrdu: ['آجر درخواست دائر کرے', 'USCIS قرعہ اندازی', 'درخواست منظور', 'قونصلر انٹرویو', 'ویزا لگایا جائے']
          }
        ]
      }
    ]
  },
  {
    id: 'canada',
    name: 'Canada',
    nameUrdu: 'کینیڈا',
    flag: '🇨🇦',
    region: 'North America',
    legalSystem: 'Common Law (Civil Law in Quebec)',
    officialLanguage: 'English, French',
    categories: [
      {
        id: 'immigration',
        name: 'Immigration',
        nameUrdu: 'امیگریشن',
        procedures: [
          {
            id: 'express_entry',
            name: 'Express Entry',
            nameUrdu: 'ایکسپریس انٹری',
            description: 'Points-based immigration system for skilled workers',
            descriptionUrdu: 'ہنرمند کارکنوں کے لیے پوائنٹس پر مبنی امیگریشن سسٹم',
            requirements: ['Language test results', 'Education credential assessment', 'Work experience proof', 'Police clearance'],
            requirementsUrdu: ['زبان کے ٹیسٹ کے نتائج', 'تعلیمی سند کی تشخیص', 'کام کے تجربے کا ثبوت', 'پولیس کلیئرنس'],
            estimatedTime: '6-12 months',
            estimatedCost: 'CAD $1,365 (processing fee)',
            steps: ['Create profile', 'Get CRS score', 'Receive ITA', 'Submit application', 'Medical exam', 'Get PR'],
            stepsUrdu: ['پروفائل بنائیں', 'CRS اسکور حاصل کریں', 'ITA حاصل کریں', 'درخواست جمع کرائیں', 'طبی معائنہ', 'PR حاصل کریں']
          }
        ]
      }
    ]
  },
  {
    id: 'saudi',
    name: 'Saudi Arabia',
    nameUrdu: 'سعودی عرب',
    flag: '🇸🇦',
    region: 'Middle East',
    legalSystem: 'Islamic Law (Sharia)',
    officialLanguage: 'Arabic',
    categories: [
      {
        id: 'business',
        name: 'Business Registration',
        nameUrdu: 'کاروبار رجسٹریشن',
        procedures: [
          {
            id: 'company_formation',
            name: 'Company Formation',
            nameUrdu: 'کمپنی تشکیل',
            description: 'Register a company under Saudi commercial law',
            descriptionUrdu: 'سعودی تجارتی قانون کے تحت کمپنی رجسٹر کریں',
            requirements: ['Commercial Registration', 'Chamber of Commerce membership', 'Municipality License', 'GOSI Registration'],
            requirementsUrdu: ['تجارتی رجسٹریشن', 'چیمبر آف کامرس رکنیت', 'میونسپل لائسنس', 'GOSI رجسٹریشن'],
            estimatedTime: '2-4 weeks',
            estimatedCost: 'SAR 10,000 - 50,000',
            steps: ['Reserve name', 'Draft articles', 'Notarize documents', 'Register with MOCI', 'Get licenses'],
            stepsUrdu: ['نام محفوظ کریں', 'آرٹیکلز تیار کریں', 'دستاویزات نوٹرائز کریں', 'MOCI میں رجسٹر کریں', 'لائسنس حاصل کریں']
          }
        ]
      }
    ]
  }
];

interface GlobalLegalIntelligenceProps {
  language?: 'en' | 'ur';
}

export default function GlobalLegalIntelligence({ language = 'en' }: GlobalLegalIntelligenceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryLegalInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<LegalProcedure | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.nameUrdu.includes(searchQuery) ||
    country.categories.some(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.nameUrdu.includes(searchQuery)
    )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const resetSelection = () => {
    setSelectedProcedure(null);
    setSelectedCategory(null);
    setSelectedCountry(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-brand-gold flex items-center justify-center">
            <Globe className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl flex items-center gap-2">
              <Sparkles className="text-brand-gold" size={24} />
              {language === 'ur' ? 'AI عالمی قانونی انٹیلیجنس' : 'AI Global Legal Intelligence'}
            </h2>
            <p className="text-slate-400">
              {language === 'ur' 
                ? 'دنیا بھر کے قوانین اور قانونی طریقہ کار'
                : 'Laws and legal procedures from around the world'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={language === 'ur' ? 'ملک یا قانونی موضوع تلاش کریں...' : 'Search country or legal topic...'}
            className="w-full bg-white/10 text-white placeholder-white/50 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold animate-spin" size={20} />
          )}
        </div>
      </motion.div>

      {/* Breadcrumb */}
      {(selectedCountry || selectedCategory || selectedProcedure) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm"
        >
          <button onClick={resetSelection} className="text-brand-gold hover:text-brand-gold/80">
            {language === 'ur' ? 'تمام ممالک' : 'All Countries'}
          </button>
          {selectedCountry && (
            <>
              <ChevronRight className="text-slate-400" size={16} />
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedProcedure(null); }}
                className={selectedCategory ? 'text-brand-gold hover:text-brand-gold/80' : 'text-white'}
              >
                {selectedCountry.flag} {language === 'ur' ? selectedCountry.nameUrdu : selectedCountry.name}
              </button>
            </>
          )}
          {selectedCategory && (
            <>
              <ChevronRight className="text-slate-400" size={16} />
              <button
                onClick={() => setSelectedProcedure(null)}
                className={selectedProcedure ? 'text-brand-gold hover:text-brand-gold/80' : 'text-white'}
              >
                {language === 'ur' ? selectedCategory.nameUrdu : selectedCategory.name}
              </button>
            </>
          )}
          {selectedProcedure && (
            <>
              <ChevronRight className="text-slate-400" size={16} />
              <span className="text-white">
                {language === 'ur' ? selectedProcedure.nameUrdu : selectedProcedure.name}
              </span>
            </>
          )}
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {!selectedCountry ? (
          /* Country List */
          <motion.div
            key="countries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCountry(country)}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-brand-gold/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="text-white font-bold">
                      {language === 'ur' ? country.nameUrdu : country.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{country.region}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Scale size={14} />
                    {country.legalSystem}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <BookOpen size={14} />
                    {country.officialLanguage}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {country.categories.slice(0, 3).map((cat, i) => (
                    <span key={i} className="px-2 py-1 bg-brand-gold/20 text-brand-gold text-xs rounded-full">
                      {language === 'ur' ? cat.nameUrdu : cat.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !selectedCategory ? (
          /* Category List */
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-white font-bold text-2xl">
                    {language === 'ur' ? selectedCountry.nameUrdu : selectedCountry.name}
                  </h3>
                  <p className="text-slate-400">{selectedCountry.region}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 mb-1">{language === 'ur' ? 'قانونی نظام' : 'Legal System'}</p>
                  <p className="text-white">{selectedCountry.legalSystem}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 mb-1">{language === 'ur' ? 'سرکاری زبان' : 'Official Language'}</p>
                  <p className="text-white">{selectedCountry.officialLanguage}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCountry.categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white/5 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center">
                        {category.name.includes('Business') ? <Building2 className="text-brand-gold" size={24} /> :
                         category.name.includes('Property') ? <Briefcase className="text-brand-gold" size={24} /> :
                         <Users className="text-brand-gold" size={24} />}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">
                          {language === 'ur' ? category.nameUrdu : category.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {category.procedures.length} {language === 'ur' ? 'طریقہ کار' : 'procedures'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-400" size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !selectedProcedure ? (
          /* Procedure List */
          <motion.div
            key="procedures"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {selectedCategory.procedures.map((procedure, index) => (
              <motion.div
                key={procedure.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedProcedure(procedure)}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-brand-gold/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {language === 'ur' ? procedure.nameUrdu : procedure.name}
                    </h4>
                    <p className="text-slate-400 mt-1">
                      {language === 'ur' ? procedure.descriptionUrdu : procedure.description}
                    </p>
                  </div>
                  <ChevronRight className="text-slate-400" size={24} />
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    {procedure.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <DollarSign size={16} />
                    {procedure.estimatedCost}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Procedure Details */
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-brand-primary/20 to-brand-gold/20 border-b border-white/10">
              <h3 className="text-white font-bold text-2xl mb-2">
                {language === 'ur' ? selectedProcedure.nameUrdu : selectedProcedure.name}
              </h3>
              <p className="text-slate-300">
                {language === 'ur' ? selectedProcedure.descriptionUrdu : selectedProcedure.description}
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <Clock className="text-brand-gold" size={18} />
                  <span className="text-white">{selectedProcedure.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <DollarSign className="text-green-400" size={18} />
                  <span className="text-white">{selectedProcedure.estimatedCost}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Requirements */}
              <div>
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <FileText className="text-brand-gold" size={20} />
                  {language === 'ur' ? 'مطلوبہ دستاویزات' : 'Required Documents'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(language === 'ur' ? selectedProcedure.requirementsUrdu : selectedProcedure.requirements).map((req, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                      <CheckCircle2 className="text-green-400 flex-shrink-0" size={18} />
                      <span className="text-slate-300 text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <ArrowRight className="text-brand-gold" size={20} />
                  {language === 'ur' ? 'مراحل' : 'Steps'}
                </h4>
                <div className="space-y-3">
                  {(language === 'ur' ? selectedProcedure.stepsUrdu : selectedProcedure.steps).map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <span className="text-white">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button className="flex-1 py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Briefcase size={20} />
                  {language === 'ur' ? 'AI کی مدد سے شروع کریں' : 'Start with AI Assistance'}
                </button>
                <button className="px-6 py-3 bg-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                  <Shield size={20} />
                  {language === 'ur' ? 'وکیل تلاش کریں' : 'Find Lawyer'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
