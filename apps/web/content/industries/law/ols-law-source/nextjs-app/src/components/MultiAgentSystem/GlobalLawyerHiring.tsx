'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Briefcase, Clock, Calendar, FileText, Star,
  MapPin, Globe, Shield, Award, CheckCircle2, ArrowRight,
  Search, Filter, Heart, MessageSquare, Video, Phone,
  CreditCard, Loader2, Sparkles, ChevronDown, Building2,
  Scale, Gavel, BadgeCheck, TrendingUp
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  avatar: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviews: number;
  country: string;
  city: string;
  languages: string[];
  verified: boolean;
  available: boolean;
  stlLevel: number;
  casesWon: number;
  totalCases: number;
  responseTime: string;
  pricing: {
    caseBase: number;
    hourly: number;
    monthly: number;
    annual: number;
  };
  badges: string[];
}

type HiringModel = 'case_based' | 'hourly' | 'monthly' | 'annual';

const HIRING_MODELS: { id: HiringModel; name: string; nameUrdu: string; description: string; descriptionUrdu: string; icon: React.ElementType; features: string[] }[] = [
  {
    id: 'case_based',
    name: 'Case Based',
    nameUrdu: 'کیس کی بنیاد پر',
    description: 'Hire a lawyer for a specific legal case',
    descriptionUrdu: 'مخصوص قانونی کیس کے لیے وکیل کی خدمات حاصل کریں',
    icon: Briefcase,
    features: ['Pay per case', 'Clear deliverables', 'Fixed scope', 'Escrow protection']
  },
  {
    id: 'hourly',
    name: 'Hourly',
    nameUrdu: 'گھنٹہ وار',
    description: 'Pay by the hour for legal consultation',
    descriptionUrdu: 'قانونی مشاورت کے لیے گھنٹے کے حساب سے ادائیگی',
    icon: Clock,
    features: ['Flexible time', 'Track hours', 'Consultation calls', 'Quick advice']
  },
  {
    id: 'monthly',
    name: 'Monthly Retainer',
    nameUrdu: 'ماہانہ مشیر',
    description: 'Dedicated lawyer on monthly subscription',
    descriptionUrdu: 'ماہانہ سبسکرپشن پر مخصوص وکیل',
    icon: Calendar,
    features: ['Priority support', 'Unlimited queries', 'Regular meetings', 'Dedicated advisor']
  },
  {
    id: 'annual',
    name: 'Annual Contract',
    nameUrdu: 'سالانہ معاہدہ',
    description: 'Long-term legal partnership',
    descriptionUrdu: 'طویل مدتی قانونی شراکت داری',
    icon: FileText,
    features: ['Best rates', 'Full coverage', 'Team access', 'Priority handling']
  }
];

const MOCK_LAWYERS: Lawyer[] = [
  {
    id: 'lawyer-1',
    name: 'Adv. Imran Sheikh',
    avatar: '👨‍⚖️',
    specializations: ['Property Law', 'Civil Litigation', 'Contract Law'],
    experience: 15,
    rating: 4.9,
    reviews: 234,
    country: 'Pakistan',
    city: 'Lahore',
    languages: ['English', 'Urdu', 'Punjabi'],
    verified: true,
    available: true,
    stlLevel: 5,
    casesWon: 189,
    totalCases: 210,
    responseTime: '< 1 hour',
    pricing: { caseBase: 50000, hourly: 5000, monthly: 100000, annual: 1000000 },
    badges: ['Top Rated', 'Quick Responder', 'Expert']
  },
  {
    id: 'lawyer-2',
    name: 'Adv. Sara Malik',
    avatar: '👩‍⚖️',
    specializations: ['Family Law', 'Divorce', 'Child Custody'],
    experience: 12,
    rating: 4.8,
    reviews: 189,
    country: 'Pakistan',
    city: 'Karachi',
    languages: ['English', 'Urdu', 'Sindhi'],
    verified: true,
    available: true,
    stlLevel: 4,
    casesWon: 156,
    totalCases: 178,
    responseTime: '< 2 hours',
    pricing: { caseBase: 45000, hourly: 4500, monthly: 90000, annual: 900000 },
    badges: ['Family Law Expert', 'Trusted']
  },
  {
    id: 'lawyer-3',
    name: 'Adv. Ahmed Hassan',
    avatar: '👨‍💼',
    specializations: ['Corporate Law', 'Business Contracts', 'M&A'],
    experience: 18,
    rating: 4.95,
    reviews: 312,
    country: 'UAE',
    city: 'Dubai',
    languages: ['English', 'Arabic', 'Urdu'],
    verified: true,
    available: true,
    stlLevel: 5,
    casesWon: 278,
    totalCases: 295,
    responseTime: '< 30 min',
    pricing: { caseBase: 120000, hourly: 15000, monthly: 250000, annual: 2500000 },
    badges: ['Premium', 'Corporate Expert', 'International']
  },
  {
    id: 'lawyer-4',
    name: 'Adv. Fatima Ali',
    avatar: '👩‍💼',
    specializations: ['Criminal Law', 'Defense', 'Appeals'],
    experience: 10,
    rating: 4.7,
    reviews: 145,
    country: 'Pakistan',
    city: 'Islamabad',
    languages: ['English', 'Urdu'],
    verified: true,
    available: false,
    stlLevel: 4,
    casesWon: 120,
    totalCases: 145,
    responseTime: '< 3 hours',
    pricing: { caseBase: 60000, hourly: 6000, monthly: 120000, annual: 1200000 },
    badges: ['Criminal Defense', 'High Court']
  },
  {
    id: 'lawyer-5',
    name: 'Adv. John Williams',
    avatar: '👨‍⚖️',
    specializations: ['Immigration Law', 'Visa', 'Citizenship'],
    experience: 20,
    rating: 4.85,
    reviews: 456,
    country: 'UK',
    city: 'London',
    languages: ['English', 'French'],
    verified: true,
    available: true,
    stlLevel: 5,
    casesWon: 412,
    totalCases: 445,
    responseTime: '< 1 hour',
    pricing: { caseBase: 200000, hourly: 25000, monthly: 400000, annual: 4000000 },
    badges: ['International Expert', 'Immigration Specialist', 'Premium']
  }
];

interface GlobalLawyerHiringProps {
  language?: 'en' | 'ur';
}

export default function GlobalLawyerHiring({ language = 'en' }: GlobalLawyerHiringProps) {
  const [selectedModel, setSelectedModel] = useState<HiringModel | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLawyers = MOCK_LAWYERS.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry = selectedCountry === 'all' || lawyer.country === selectedCountry;
    const matchesSpec = selectedSpecialization === 'all' || 
      lawyer.specializations.some(s => s.toLowerCase().includes(selectedSpecialization.toLowerCase()));
    return matchesSearch && matchesCountry && matchesSpec;
  });

  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/50 via-slate-800 to-slate-900 rounded-2xl p-6 border border-indigo-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Globe className="text-brand-gold" size={20} />
              {language === 'ur' ? 'عالمی وکیل مارکیٹ پلیس' : 'Global Lawyer Marketplace'}
            </h2>
            <p className="text-ehb-textMuted text-sm">
              {language === 'ur' ? 'دنیا بھر کے بہترین وکلاء کی خدمات حاصل کریں' : 'Hire the best lawyers from around the world'}
            </p>
          </div>
        </div>

        {/* Hiring Models */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {HIRING_MODELS.map((model) => {
            const Icon = model.icon;
            return (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedModel === model.id
                    ? 'bg-gradient-to-br from-brand-primary to-brand-gold text-white'
                    : 'bg-white/5 hover:bg-white/10 text-ehb-textBody'
                }`}
              >
                <Icon className={selectedModel === model.id ? 'text-white' : 'text-brand-gold'} size={24} />
                <h4 className="font-bold mt-2">
                  {language === 'ur' ? model.nameUrdu : model.name}
                </h4>
                <p className={`text-xs mt-1 ${selectedModel === model.id ? 'text-white/80' : 'text-ehb-textMuted'}`}>
                  {language === 'ur' ? model.descriptionUrdu : model.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ehb-textMuted" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ur' ? 'وکیل کا نام یا مہارت تلاش کریں...' : 'Search lawyer name or specialization...'}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-brand-gold focus:outline-none"
          />
        </div>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
        >
          <option value="all">{language === 'ur' ? 'تمام ممالک' : 'All Countries'}</option>
          <option value="Pakistan">Pakistan</option>
          <option value="UAE">UAE</option>
          <option value="UK">United Kingdom</option>
          <option value="USA">United States</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700"
        >
          <Filter size={18} />
          {language === 'ur' ? 'فلٹرز' : 'Filters'}
          <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Extended Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-800/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 overflow-hidden"
          >
            <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
              <option>{language === 'ur' ? 'مہارت' : 'Specialization'}</option>
              <option>Property Law</option>
              <option>Family Law</option>
              <option>Criminal Law</option>
              <option>Corporate Law</option>
            </select>
            <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
              <option>{language === 'ur' ? 'تجربہ' : 'Experience'}</option>
              <option>1-5 years</option>
              <option>5-10 years</option>
              <option>10+ years</option>
            </select>
            <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
              <option>{language === 'ur' ? 'ریٹنگ' : 'Rating'}</option>
              <option>4.5+ Stars</option>
              <option>4+ Stars</option>
              <option>All</option>
            </select>
            <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
              <option>{language === 'ur' ? 'زبان' : 'Language'}</option>
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLawyers.map((lawyer, index) => (
          <motion.div
            key={lawyer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border transition-all cursor-pointer ${
              selectedLawyer?.id === lawyer.id ? 'border-brand-gold' : 'border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => setSelectedLawyer(selectedLawyer?.id === lawyer.id ? null : lawyer)}
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-3xl">
                  {lawyer.avatar}
                </div>
                {lawyer.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <BadgeCheck size={12} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                      {lawyer.name}
                      {lawyer.badges.includes('Premium') && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-brand-gold to-amber-500 text-slate-900 text-[10px] font-bold rounded">
                          PREMIUM
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span>{lawyer.rating}</span>
                      </div>
                      <span className="text-ehb-textMuted">({lawyer.reviews} reviews)</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${lawyer.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {lawyer.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg">
                    <Heart size={18} className="text-ehb-textMuted" />
                  </button>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {lawyer.specializations.slice(0, 3).map((spec, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs rounded">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-3 text-xs text-ehb-textMuted">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {lawyer.city}, {lawyer.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={12} />
                    {lawyer.experience} yrs
                  </span>
                  <span className="flex items-center gap-1">
                    <Gavel size={12} />
                    {lawyer.casesWon}/{lawyer.totalCases} won
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {selectedLawyer?.id === lawyer.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  {/* Pricing */}
                  <h5 className="text-white font-semibold mb-3">
                    {language === 'ur' ? 'قیمت کے اختیارات' : 'Pricing Options'}
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    <div className={`p-3 rounded-lg text-center ${selectedModel === 'case_based' ? 'bg-brand-gold/20 border border-brand-gold' : 'bg-white/5'}`}>
                      <Briefcase className="mx-auto text-brand-gold mb-1" size={18} />
                      <p className="text-ehb-textMuted text-xs">{language === 'ur' ? 'فی کیس' : 'Per Case'}</p>
                      <p className="text-white font-bold text-sm">{formatPrice(lawyer.pricing.caseBase)}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${selectedModel === 'hourly' ? 'bg-brand-gold/20 border border-brand-gold' : 'bg-white/5'}`}>
                      <Clock className="mx-auto text-brand-gold mb-1" size={18} />
                      <p className="text-ehb-textMuted text-xs">{language === 'ur' ? 'فی گھنٹہ' : 'Per Hour'}</p>
                      <p className="text-white font-bold text-sm">{formatPrice(lawyer.pricing.hourly)}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${selectedModel === 'monthly' ? 'bg-brand-gold/20 border border-brand-gold' : 'bg-white/5'}`}>
                      <Calendar className="mx-auto text-brand-gold mb-1" size={18} />
                      <p className="text-ehb-textMuted text-xs">{language === 'ur' ? 'ماہانہ' : 'Monthly'}</p>
                      <p className="text-white font-bold text-sm">{formatPrice(lawyer.pricing.monthly)}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${selectedModel === 'annual' ? 'bg-brand-gold/20 border border-brand-gold' : 'bg-white/5'}`}>
                      <FileText className="mx-auto text-brand-gold mb-1" size={18} />
                      <p className="text-ehb-textMuted text-xs">{language === 'ur' ? 'سالانہ' : 'Annual'}</p>
                      <p className="text-white font-bold text-sm">{formatPrice(lawyer.pricing.annual)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBooking(); }}
                      disabled={isBooking || !lawyer.available}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-xl font-bold disabled:opacity-50"
                    >
                      {isBooking ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <CreditCard size={18} />
                      )}
                      {language === 'ur' ? 'خدمات حاصل کریں' : 'Hire Now'}
                    </button>
                    <button className="px-4 py-3 bg-violet-500/20 text-violet-400 rounded-xl font-medium hover:bg-violet-500/30">
                      <MessageSquare size={18} />
                    </button>
                    <button className="px-4 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30">
                      <Video size={18} />
                    </button>
                    <button className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-xl font-medium hover:bg-blue-500/30">
                      <Phone size={18} />
                    </button>
                  </div>

                  {/* Languages & Badges */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-xs text-ehb-textMuted">
                      <Globe size={12} />
                      {lawyer.languages.join(', ')}
                    </div>
                    <div className="flex gap-1">
                      {lawyer.badges.slice(0, 2).map((badge, i) => (
                        <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Booking Success Modal */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setBookingSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-400" size={40} />
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">
                {language === 'ur' ? 'بکنگ کامیاب!' : 'Booking Successful!'}
              </h3>
              <p className="text-ehb-textMuted mb-6">
                {language === 'ur' 
                  ? 'آپ کی درخواست وکیل کو بھیج دی گئی ہے۔ وہ جلد آپ سے رابطہ کریں گے۔'
                  : 'Your request has been sent to the lawyer. They will contact you shortly.'}
              </p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="w-full py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-xl font-bold"
              >
                {language === 'ur' ? 'ٹھیک ہے' : 'Got it'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-ehb-textMuted mb-4" size={48} />
          <p className="text-ehb-textMuted">
            {language === 'ur' ? 'کوئی وکیل نہیں ملا' : 'No lawyers found matching your criteria'}
          </p>
        </div>
      )}
    </div>
  );
}
