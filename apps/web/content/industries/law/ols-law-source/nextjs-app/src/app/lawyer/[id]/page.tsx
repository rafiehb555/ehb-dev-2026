'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Star, MapPin, CheckCircle2, Clock, Award, Globe, Phone, Video, MessageSquare,
  Calendar, Shield, Briefcase, FileText, ArrowLeft, Heart, Share2, Users,
  TrendingUp, Scale, Crown, Zap, ChevronRight, Play, Download, ExternalLink,
  Mail, Linkedin, Building2, GraduationCap, Languages
} from 'lucide-react';

const LAWYERS_DATA: Record<string, any> = {
  'lawyer-1': {
    id: 'lawyer-1',
    name: 'Sarah Ahmed',
    nameUrdu: 'سارہ احمد',
    title: 'Family Law Specialist',
    tagline: 'Compassionate advocacy for families in transition',
    image: '👩‍⚖️',
    verified: true,
    featured: true,
    rating: 4.9,
    reviews: 156,
    experience: '12 years',
    casesWon: '320+',
    successRate: '94%',
    consultationFee: '$150',
    fullCaseFee: '$1,500 - $5,000',
    location: 'Lahore, Pakistan',
    languages: ['English', 'Urdu', 'Punjabi'],
    education: [
      { degree: 'LLB', institution: 'Punjab University', year: '2010' },
      { degree: 'LLM Family Law', institution: 'Harvard Law School', year: '2012' },
    ],
    specializations: ['Divorce', 'Child Custody', 'Alimony', 'Domestic Violence', 'Adoption'],
    barAdmissions: ['Punjab Bar Council', 'Supreme Court of Pakistan'],
    awards: ['Best Family Lawyer 2023', 'Women in Law Award 2022'],
    bio: `Sarah Ahmed is a leading family law specialist with over 12 years of experience in handling complex family disputes. She has successfully represented hundreds of clients in divorce, custody, and domestic violence cases.

Her compassionate approach combined with aggressive advocacy has earned her recognition as one of the top family lawyers in Pakistan. She is known for achieving favorable settlements while minimizing emotional trauma for families.

Sarah is committed to providing accessible legal services and often takes pro-bono cases for underprivileged women and children.`,
    availability: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 1:00 PM',
    },
    stats: {
      totalCases: 450,
      activeCases: 28,
      thisMonth: 12,
      avgResolutionTime: '3.5 months',
    },
  },
  'lawyer-2': {
    id: 'lawyer-2',
    name: 'Ahmed Hassan',
    nameUrdu: 'احمد حسن',
    title: 'Divorce & Custody Expert',
    tagline: 'Strategic legal solutions for complex family matters',
    image: '👨‍⚖️',
    verified: true,
    featured: true,
    rating: 4.8,
    reviews: 203,
    experience: '15 years',
    casesWon: '450+',
    successRate: '92%',
    consultationFee: '$200',
    fullCaseFee: '$2,000 - $8,000',
    location: 'Dubai, UAE',
    languages: ['English', 'Arabic', 'Urdu'],
    education: [
      { degree: 'LLB', institution: 'University of London', year: '2007' },
      { degree: 'LLM International Law', institution: 'NYU School of Law', year: '2009' },
    ],
    specializations: ['International Divorce', 'Cross-border Custody', 'High Net Worth Settlements', 'Islamic Family Law'],
    barAdmissions: ['Dubai Bar Association', 'UK Bar Council'],
    awards: ['Top Family Lawyer UAE 2024', 'Excellence in Legal Services 2023'],
    bio: `Ahmed Hassan is an internationally recognized family law expert specializing in complex cross-border family disputes. With 15 years of experience across multiple jurisdictions, he has handled some of the most challenging divorce and custody cases in the Middle East.

His expertise in both common law and Islamic family law makes him uniquely qualified to handle cases involving parties from different legal systems. He is known for his strategic approach and ability to achieve favorable outcomes in high-stakes situations.`,
    availability: {
      sunday: '10:00 AM - 6:00 PM',
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
    },
    stats: {
      totalCases: 580,
      activeCases: 35,
      thisMonth: 8,
      avgResolutionTime: '4 months',
    },
  },
  'lawyer-3': {
    id: 'lawyer-3',
    name: 'Fatima Khan',
    nameUrdu: 'فاطمہ خان',
    title: 'Property & Real Estate Lawyer',
    tagline: 'Protecting your property rights with expertise',
    image: '👩‍⚖️',
    verified: true,
    featured: true,
    rating: 4.7,
    reviews: 189,
    experience: '10 years',
    casesWon: '280+',
    successRate: '91%',
    consultationFee: '$175',
    fullCaseFee: '$2,000 - $10,000',
    location: 'Karachi, Pakistan',
    languages: ['English', 'Urdu', 'Sindhi'],
    education: [
      { degree: 'LLB', institution: 'Karachi University', year: '2012' },
      { degree: 'LLM Property Law', institution: 'Cambridge University', year: '2014' },
    ],
    specializations: ['Property Disputes', 'Land Transfer', 'Real Estate Contracts', 'Title Verification', 'Commercial Property'],
    barAdmissions: ['Sindh Bar Council', 'High Court of Sindh'],
    awards: ['Property Law Expert 2023', 'Rising Star Award 2020'],
    bio: `Fatima Khan is a distinguished property law specialist with extensive experience in handling complex real estate disputes and transactions. Her expertise covers residential and commercial property matters, including land acquisition, title disputes, and contract negotiations.

Known for her meticulous attention to detail, Fatima has helped clients navigate intricate property laws and achieve favorable outcomes in challenging cases. She is particularly skilled in handling matters involving multiple stakeholders and disputed inheritances.`,
    availability: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 2:00 PM',
    },
    stats: {
      totalCases: 380,
      activeCases: 22,
      thisMonth: 6,
      avgResolutionTime: '5 months',
    },
  },
  'lawyer-4': {
    id: 'lawyer-4',
    name: 'Bilal Ahmed',
    nameUrdu: 'بلال احمد',
    title: 'Corporate & Business Law Expert',
    tagline: 'Strategic counsel for business success',
    image: '👨‍⚖️',
    verified: true,
    featured: true,
    rating: 4.9,
    reviews: 312,
    experience: '18 years',
    casesWon: '500+',
    successRate: '96%',
    consultationFee: '$250',
    fullCaseFee: '$5,000 - $25,000',
    location: 'Islamabad, Pakistan',
    languages: ['English', 'Urdu', 'Arabic'],
    education: [
      { degree: 'LLB', institution: 'Oxford University', year: '2004' },
      { degree: 'MBA', institution: 'Wharton School', year: '2008' },
    ],
    specializations: ['Corporate Law', 'Mergers & Acquisitions', 'Contract Law', 'Startup Advisory', 'International Trade'],
    barAdmissions: ['Islamabad Bar Council', 'Supreme Court of Pakistan', 'UK Solicitors Regulation Authority'],
    awards: ['Top Business Lawyer 2024', 'Deal Maker of the Year 2023', 'Legal Excellence Award 2022'],
    bio: `Bilal Ahmed is one of Pakistan's most sought-after corporate lawyers with an impressive track record spanning 18 years. His unique combination of legal expertise and business acumen makes him the go-to advisor for major corporations and startups alike.

He has advised on transactions worth over $500 million and helped launch more than 50 successful startups. His client list includes Fortune 500 companies, tech unicorns, and government entities.`,
    availability: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: 'By Appointment',
    },
    stats: {
      totalCases: 720,
      activeCases: 45,
      thisMonth: 15,
      avgResolutionTime: '2 months',
    },
  },
  'lawyer-5': {
    id: 'lawyer-5',
    name: 'Maria Rodriguez',
    nameUrdu: 'ماریہ راڈریگز',
    title: 'Criminal Defense Attorney',
    tagline: 'Fierce defense when it matters most',
    image: '👩‍⚖️',
    verified: true,
    featured: true,
    rating: 4.8,
    reviews: 278,
    experience: '14 years',
    casesWon: '400+',
    successRate: '89%',
    consultationFee: '$200',
    fullCaseFee: '$3,000 - $15,000',
    location: 'London, UK',
    languages: ['English', 'Spanish', 'Portuguese'],
    education: [
      { degree: 'LLB', institution: 'LSE', year: '2008' },
      { degree: 'Criminal Law Certificate', institution: 'Bar Council of England', year: '2010' },
    ],
    specializations: ['Criminal Defense', 'White Collar Crime', 'Bail Applications', 'Appeals', 'Fraud Cases'],
    barAdmissions: ['Bar Council of England and Wales', 'European Court of Human Rights'],
    awards: ['Criminal Defense Lawyer of the Year 2023', 'Justice Champion Award 2021'],
    bio: `Maria Rodriguez is a formidable criminal defense attorney with an exceptional track record of winning complex cases. She has represented clients in high-profile criminal matters, including fraud, white-collar crime, and serious felonies.

Known for her courtroom presence and meticulous case preparation, Maria has successfully defended clients facing life-changing charges. She believes everyone deserves robust legal representation regardless of the accusations they face.`,
    availability: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 4:00 PM',
    },
    stats: {
      totalCases: 520,
      activeCases: 32,
      thisMonth: 10,
      avgResolutionTime: '6 months',
    },
  },
  'lawyer-6': {
    id: 'lawyer-6',
    name: 'Omar Ali',
    nameUrdu: 'عمر علی',
    title: 'Immigration Law Specialist',
    tagline: 'Your pathway to global opportunities',
    image: '👨‍⚖️',
    verified: true,
    featured: false,
    rating: 4.6,
    reviews: 145,
    experience: '8 years',
    casesWon: '200+',
    successRate: '88%',
    consultationFee: '$125',
    fullCaseFee: '$1,000 - $5,000',
    location: 'Toronto, Canada',
    languages: ['English', 'French', 'Urdu', 'Arabic'],
    education: [
      { degree: 'LLB', institution: 'University of Toronto', year: '2014' },
      { degree: 'Immigration Law Diploma', institution: 'Osgoode Hall', year: '2016' },
    ],
    specializations: ['Immigration', 'Visa Applications', 'Citizenship', 'Work Permits', 'Refugee Claims'],
    barAdmissions: ['Law Society of Ontario', 'Immigration Consultants of Canada Regulatory Council'],
    awards: ['Immigration Lawyer Excellence 2023'],
    bio: `Omar Ali is a dedicated immigration lawyer helping families and professionals navigate the complex Canadian immigration system. With expertise in multiple immigration streams, he has helped hundreds achieve their dreams of living and working in Canada.

His multilingual abilities and cultural understanding make him particularly effective in handling diverse client needs. Omar is passionate about reuniting families and helping skilled professionals contribute to Canada's growth.`,
    availability: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM',
    },
    stats: {
      totalCases: 280,
      activeCases: 18,
      thisMonth: 8,
      avgResolutionTime: '4 months',
    },
  },
};

const REVIEWS = [
  { id: 1, name: 'Ayesha K.', rating: 5, date: '2 weeks ago', text: 'Sarah was incredibly supportive during my divorce. She explained everything clearly and fought for my rights. Highly recommend!' },
  { id: 2, name: 'Muhammad R.', rating: 5, date: '1 month ago', text: 'Professional and compassionate. Got me custody of my children. Forever grateful.' },
  { id: 3, name: 'Fatima A.', rating: 4, date: '2 months ago', text: 'Good lawyer, helped me understand my options. The process took longer than expected but outcome was positive.' },
];

const SERVICE_PACKAGES = [
  { id: 'consultation', name: 'Video Consultation', price: '$150', duration: '30 minutes', desc: 'Initial case assessment and legal advice', popular: false },
  { id: 'document', name: 'Document Review', price: '$250', duration: '24 hours', desc: 'Review and analysis of legal documents', popular: false },
  { id: 'full', name: 'Full Representation', price: 'From $1,500', duration: 'Case duration', desc: 'Complete legal representation for your case', popular: true },
];

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'services'>('overview');
  const [selectedPackage, setSelectedPackage] = useState('full');
  const [isBooking, setIsBooking] = useState(false);

  const lawyerId = params.id as string;
  const lawyer = LAWYERS_DATA[lawyerId] || LAWYERS_DATA['lawyer-1'];

  const handleHire = () => {
    setIsBooking(true);
    setTimeout(() => {
      router.push(`/create-case?lawyer=${lawyerId}`);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-blue-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-ehb-textMuted hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Lawyers
          </motion.button>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Left: Profile Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-6xl shadow-xl shadow-[#D4AF37]/20">
                  {lawyer.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{lawyer.name}</h1>
                    {lawyer.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
                        <CheckCircle2 className="text-blue-400" size={14} />
                        <span className="text-blue-400 text-xs font-medium">Verified</span>
                      </div>
                    )}
                    {lawyer.featured && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/20 rounded-full">
                        <Crown className="text-[#D4AF37]" size={14} />
                        <span className="text-[#D4AF37] text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[#D4AF37] font-medium mb-1">{lawyer.title}</p>
                  <p className="text-ehb-textMuted text-sm mb-3">{lawyer.tagline}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.floor(lawyer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-ehb-textMuted'} />
                        ))}
                      </div>
                      <span className="text-white font-bold">{lawyer.rating}</span>
                      <span className="text-ehb-textMuted">({lawyer.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-ehb-textMuted">
                      <MapPin size={14} />
                      {lawyer.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Experience', value: lawyer.experience, icon: Clock },
                  { label: 'Cases Won', value: lawyer.casesWon, icon: Award },
                  { label: 'Success Rate', value: lawyer.successRate, icon: TrendingUp },
                  { label: 'Active Cases', value: lawyer.stats.activeCases, icon: Briefcase },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <stat.icon className="text-[#D4AF37] mb-2" size={20} />
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-ehb-textMuted text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Languages & Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lawyer.specializations.map((spec: string) => (
                  <span key={spec} className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs font-medium">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-ehb-textMuted">
                <Languages size={16} />
                <span>{lawyer.languages.join(' • ')}</span>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="lg:w-96">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-ehb-textMuted text-sm">Consultation Fee</p>
                    <p className="text-3xl font-bold text-white">{lawyer.consultationFee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ehb-textMuted text-sm">Full Case</p>
                    <p className="text-lg font-bold text-[#D4AF37]">{lawyer.fullCaseFee}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {SERVICE_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                        selectedPackage === pkg.id
                          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Popular</span>
                          )}
                        </div>
                        <p className="text-ehb-textMuted text-xs">{pkg.desc}</p>
                      </div>
                      <span className={`font-bold ${selectedPackage === pkg.id ? 'text-[#D4AF37]' : 'text-white'}`}>{pkg.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleHire}
                  disabled={isBooking}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Scale size={20} />
                      Hire Lawyer
                    </>
                  )}
                </button>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    <Video size={18} />
                    Video Call
                  </button>
                  <button className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Message
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <button className="text-ehb-textMuted hover:text-white transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="text-ehb-textMuted hover:text-white transition-colors">
                    <Share2 size={20} />
                  </button>
                  <button className="text-ehb-textMuted hover:text-white transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-28 z-30 bg-slate-900/95 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: `Reviews (${lawyer.reviews})` },
              { id: 'services', label: 'Services & Fees' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                    : 'text-ehb-textMuted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:pr-[420px]">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* About */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-ehb-textBody leading-relaxed whitespace-pre-line">{lawyer.bio}</p>
              </div>

              {/* Education */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="text-[#D4AF37]" size={24} />
                  Education
                </h2>
                <div className="space-y-4">
                  {lawyer.education.map((edu: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                        <GraduationCap className="text-[#D4AF37]" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{edu.degree}</p>
                        <p className="text-ehb-textMuted text-sm">{edu.institution} • {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Admissions */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-[#D4AF37]" size={24} />
                  Bar Admissions
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.barAdmissions.map((bar: string) => (
                    <div key={bar} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                      <CheckCircle2 className="text-emerald-400" size={16} />
                      <span className="text-white text-sm">{bar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="text-[#D4AF37]" size={24} />
                  Awards & Recognition
                </h2>
                <div className="space-y-3">
                  {lawyer.awards.map((award: string) => (
                    <div key={award} className="flex items-center gap-3 p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30">
                      <Crown className="text-[#D4AF37]" size={20} />
                      <span className="text-white">{award}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-[#D4AF37]" size={24} />
                  Availability
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(lawyer.availability).map(([day, time]) => (
                    <div key={day} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white font-medium capitalize">{day}</p>
                      <p className="text-ehb-textMuted text-sm">{time as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white">{lawyer.rating}</p>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-ehb-textMuted text-sm">{lawyer.reviews} reviews</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-ehb-textMuted w-3">{stars}</span>
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {REVIEWS.map((review) => (
                <div key={review.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{review.name}</p>
                        <p className="text-ehb-textMuted text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-ehb-textBody">{review.text}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {SERVICE_PACKAGES.map((pkg) => (
                <div key={pkg.id} className={`bg-white/5 rounded-2xl p-6 border ${pkg.popular ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 'border-white/10'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        {pkg.popular && <span className="px-2 py-1 bg-[#D4AF37] text-slate-900 text-xs font-bold rounded">Most Popular</span>}
                      </div>
                      <p className="text-ehb-textMuted text-sm mt-1">{pkg.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{pkg.price}</p>
                      <p className="text-ehb-textMuted text-sm">{pkg.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleHire}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Select {pkg.name}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-blue-500/20 rounded-3xl p-8 md:p-12 border border-[#D4AF37]/30 text-center">
          <Zap className="mx-auto text-[#D4AF37] mb-4" size={40} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Your Case?</h2>
          <p className="text-ehb-textBody mb-6 max-w-xl mx-auto">
            {lawyer.name} is ready to help you with your legal needs. Book a consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleHire} className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl flex items-center gap-2">
              <Scale size={20} />
              Hire {lawyer.name.split(' ')[0]}
              <ChevronRight size={20} />
            </button>
            <Link href="/marketplace" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl flex items-center gap-2">
              <Users size={20} />
              Browse Other Lawyers
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
