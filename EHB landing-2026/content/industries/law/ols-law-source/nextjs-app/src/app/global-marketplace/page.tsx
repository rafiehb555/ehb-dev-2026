'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Globe, Users, Star, MapPin, CheckCircle2, Filter, Search,
  Scale, Heart, Building2, Briefcase, Shield, Crown, Sparkles,
  Clock, Award, MessageSquare, Video, ArrowRight, ChevronDown
} from 'lucide-react';

// Countries Data
const COUNTRIES = [
  { code: 'PK', name: 'Pakistan', lawyers: 5200, flag: '🇵🇰' },
  { code: 'AE', name: 'UAE', lawyers: 3400, flag: '🇦🇪' },
  { code: 'UK', name: 'United Kingdom', lawyers: 4100, flag: '🇬🇧' },
  { code: 'US', name: 'United States', lawyers: 6800, flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', lawyers: 2100, flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', lawyers: 1800, flag: '🇦🇺' },
  { code: 'SA', name: 'Saudi Arabia', lawyers: 1200, flag: '🇸🇦' },
  { code: 'IN', name: 'India', lawyers: 4500, flag: '🇮🇳' },
];

// Specializations
const SPECIALIZATIONS = [
  { id: 'family', name: 'Family Law', icon: Heart, count: 4200 },
  { id: 'corporate', name: 'Corporate Law', icon: Building2, count: 3800 },
  { id: 'criminal', name: 'Criminal Law', icon: Shield, count: 2900 },
  { id: 'property', name: 'Property Law', icon: Scale, count: 3400 },
  { id: 'immigration', name: 'Immigration', icon: Globe, count: 2100 },
  { id: 'ip', name: 'IP Law', icon: Sparkles, count: 1500 },
];

// Lawyers Data
const LAWYERS = [
  { 
    id: 1, name: 'Sarah Ahmed', spec: 'Family Law', rating: 4.9, reviews: 234, 
    exp: '12 yrs', cases: '450+', location: 'Dubai, UAE', country: 'AE',
    fee: '$200/hr', image: '👩‍⚖️', verified: true, vip: true,
    languages: ['English', 'Arabic', 'Urdu'], available: true
  },
  { 
    id: 2, name: 'Ahmed Khan', spec: 'Corporate Law', rating: 4.8, reviews: 189, 
    exp: '15 yrs', cases: '620+', location: 'Lahore, Pakistan', country: 'PK',
    fee: '$150/hr', image: '👨‍⚖️', verified: true, vip: true,
    languages: ['English', 'Urdu', 'Punjabi'], available: true
  },
  { 
    id: 3, name: 'James Wilson', spec: 'Criminal Defense', rating: 4.7, reviews: 312, 
    exp: '18 yrs', cases: '890+', location: 'London, UK', country: 'UK',
    fee: '$350/hr', image: '👨‍⚖️', verified: true, vip: false,
    languages: ['English'], available: true
  },
  { 
    id: 4, name: 'Fatima Noor', spec: 'Immigration Law', rating: 4.9, reviews: 156, 
    exp: '10 yrs', cases: '380+', location: 'New York, USA', country: 'US',
    fee: '$280/hr', image: '👩‍⚖️', verified: true, vip: true,
    languages: ['English', 'Arabic', 'French'], available: false
  },
  { 
    id: 5, name: 'Zainab Ali', spec: 'Property Law', rating: 4.6, reviews: 98, 
    exp: '8 yrs', cases: '210+', location: 'Karachi, Pakistan', country: 'PK',
    fee: '$120/hr', image: '👩‍⚖️', verified: true, vip: false,
    languages: ['English', 'Urdu', 'Sindhi'], available: true
  },
  { 
    id: 6, name: 'Michael Brown', spec: 'IP Law', rating: 4.8, reviews: 145, 
    exp: '14 yrs', cases: '340+', location: 'Toronto, Canada', country: 'CA',
    fee: '$320/hr', image: '👨‍⚖️', verified: true, vip: true,
    languages: ['English', 'French'], available: true
  },
  { 
    id: 7, name: 'Aisha Rahman', spec: 'Family Law', rating: 4.7, reviews: 178, 
    exp: '9 yrs', cases: '290+', location: 'Riyadh, Saudi Arabia', country: 'SA',
    fee: '$180/hr', image: '👩‍⚖️', verified: true, vip: false,
    languages: ['English', 'Arabic'], available: true
  },
  { 
    id: 8, name: 'David Lee', spec: 'Corporate Law', rating: 4.9, reviews: 267, 
    exp: '20 yrs', cases: '780+', location: 'Sydney, Australia', country: 'AU',
    fee: '$400/hr', image: '👨‍⚖️', verified: true, vip: true,
    languages: ['English', 'Mandarin'], available: true
  },
];

// Stats
const MARKETPLACE_STATS = [
  { label: 'Verified Lawyers', value: '25,000+', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { label: 'Countries', value: '50+', icon: Globe, color: 'from-emerald-500 to-green-500' },
  { label: 'Cases Completed', value: '150K+', icon: Award, color: 'from-violet-500 to-purple-500' },
  { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'from-yellow-500 to-orange-500' },
];

export default function GlobalMarketplacePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLawyers = LAWYERS.filter(lawyer => {
    if (selectedCountry && lawyer.country !== selectedCountry) return false;
    if (selectedSpec && !lawyer.spec.toLowerCase().includes(selectedSpec.toLowerCase())) return false;
    if (searchQuery && !lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lawyer.spec.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              <Globe size={16} />
              Global Legal Network
              <Crown size={16} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Find Expert Lawyers
              <span className="block bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-[#D4AF37] bg-clip-text text-transparent">
                Worldwide
              </span>
            </h1>
            <p className="text-lg text-ehb-textMuted max-w-2xl mx-auto">
              Connect with 25,000+ verified lawyers across 50+ countries. Get expert legal help anywhere in the world.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {MARKETPLACE_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-ehb-textMuted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-blue-500 rounded-2xl blur-sm opacity-30" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="text-[#D4AF37]" size={22} />
                    <input 
                      type="text" 
                      placeholder="Search lawyers by name or specialization..." 
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none py-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2"
                    >
                      <Filter className="text-ehb-textMuted" size={20} />
                      <span className="text-white text-sm">Filters</span>
                      <ChevronDown className={`text-ehb-textMuted transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                      Search
                    </button>
                  </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-white/10 mt-2 pt-4 px-4 pb-2"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-ehb-textMuted mb-2">COUNTRY</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all"
                          value={selectedCountry || ''}
                          onChange={(e) => setSelectedCountry(e.target.value || null)}
                        >
                          <option value="">All Countries</option>
                          {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ehb-textMuted mb-2">SPECIALIZATION</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all"
                          value={selectedSpec || ''}
                          onChange={(e) => setSelectedSpec(e.target.value || null)}
                        >
                          <option value="">All Specializations</option>
                          {SPECIALIZATIONS.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Browse by Country</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(selectedCountry === country.code ? null : country.code)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedCountry === country.code
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <span className="text-3xl mb-2 block">{country.flag}</span>
              <p className="text-sm font-medium text-white truncate">{country.name}</p>
              <p className="text-xs text-slate-500">{country.lawyers.toLocaleString()} lawyers</p>
            </button>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Legal Specializations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpec(selectedSpec === spec.name ? null : spec.name)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedSpec === spec.name
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <spec.icon className="text-[#D4AF37]" size={20} />
              </div>
              <p className="text-sm font-medium text-white">{spec.name}</p>
              <p className="text-xs text-slate-500">{spec.count.toLocaleString()} lawyers</p>
            </button>
          ))}
        </div>
      </section>

      {/* Lawyers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Featured Lawyers</h2>
            <p className="text-sm text-ehb-textMuted">{filteredLawyers.length} lawyers found</p>
          </div>
          <select className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none">
            <option>Top Rated</option>
            <option>Most Reviews</option>
            <option>Lowest Price</option>
            <option>Most Experience</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLawyers.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                    {lawyer.image}
                  </div>
                  {lawyer.available ? (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  ) : (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {lawyer.vip && (
                    <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Crown size={10} /> VIP
                    </span>
                  )}
                  {lawyer.verified && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{lawyer.name}</h3>
                <p className="text-sm text-[#D4AF37] mb-1">{lawyer.spec}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={12} /> {lawyer.location}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">Exp</p>
                  <p className="text-sm font-bold text-white">{lawyer.exp}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">Cases</p>
                  <p className="text-sm font-bold text-emerald-400">{lawyer.cases}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="text-sm font-bold text-yellow-400">⭐ {lawyer.rating}</p>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {lawyer.languages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 bg-white/5 text-ehb-textMuted text-[10px] rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-emerald-400">{lawyer.fee}</span>
                <span className="text-xs text-slate-500">{lawyer.reviews} reviews</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-1">
                  <MessageSquare size={14} /> Chat
                </button>
                <button className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                  Hire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all inline-flex items-center gap-2">
            Load More Lawyers
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-3xl p-8 md:p-12 border border-[#D4AF37]/30 text-center"
        >
          <Scale className="mx-auto text-[#D4AF37] mb-6" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">
            Are You a Lawyer?
          </h2>
          <p className="text-ehb-textBody mb-8 max-w-2xl mx-auto">
            Join our global network of 25,000+ lawyers and expand your practice worldwide.
          </p>
          <Link
            href="/lawyer-dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
          >
            <Briefcase size={22} />
            Join as Lawyer
            <ArrowRight size={22} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
