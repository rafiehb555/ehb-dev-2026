'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import { LAW_CATEGORIES, ALL_SERVICES } from '@/data/services';
import { 
  ChevronRight, Search, Star, MapPin, CheckCircle2, Filter,
  Scale, Heart, Building2, Globe, Shield, Briefcase, Users,
  Clock, Award, Zap, Bot, ArrowRight, Crown, Sparkles
} from 'lucide-react';

// Featured Lawyers
const FEATURED_LAWYERS = [
  { id: 1, name: 'Ahmed Khan', spec: 'Corporate Law', rating: 4.9, cases: '450+', exp: '15 yrs', location: 'Dubai', image: '👨‍⚖️', fee: '$200/hr', verified: true },
  { id: 2, name: 'Sarah Ahmed', spec: 'Family Law', rating: 4.8, cases: '320+', exp: '12 yrs', location: 'Lahore', image: '👩‍⚖️', fee: '$150/hr', verified: true },
  { id: 3, name: 'Fatima Khan', spec: 'Immigration', rating: 4.9, cases: '280+', exp: '10 yrs', location: 'London', image: '👩‍⚖️', fee: '$180/hr', verified: true },
  { id: 4, name: 'Hassan Ali', spec: 'Criminal Law', rating: 4.7, cases: '550+', exp: '18 yrs', location: 'Karachi', image: '👨‍⚖️', fee: '$175/hr', verified: true },
];

// Stats
const MARKETPLACE_STATS = [
  { label: 'Verified Lawyers', value: '25,000+', icon: Users },
  { label: 'Cases Completed', value: '150K+', icon: CheckCircle2 },
  { label: 'Countries', value: '50+', icon: Globe },
  { label: 'Success Rate', value: '94%', icon: Award },
];

export default function ServicesMarketplace() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(LAW_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'services' | 'lawyers'>('services');

  const filteredServices = ALL_SERVICES[activeCategory as keyof typeof ALL_SERVICES] || [];
  
  const allFlattenedServices = Object.entries(ALL_SERVICES).flatMap(([catId, services]) => 
    services.map(s => ({ ...s, categoryId: catId }))
  );

  const searchResults = searchQuery 
    ? allFlattenedServices.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              <Crown size={16} />
              Global Legal Marketplace
              <Sparkles size={16} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-[#D4AF37] bg-clip-text text-transparent">
                Legal Expert
              </span>
            </h1>
            <p className="text-lg text-ehb-textMuted max-w-2xl mx-auto">
              25,000+ verified lawyers across 50+ countries. AI-powered matching for the best legal representation.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-blue-500 rounded-2xl blur-sm opacity-30" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="text-[#D4AF37]" size={22} />
                    <input 
                      type="text" 
                      placeholder="Search lawyers, services, or legal categories..." 
                      className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none py-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                    <Filter className="text-ehb-textMuted" size={20} />
                  </button>
                  <button className="px-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {MARKETPLACE_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <stat.icon className="mx-auto text-[#D4AF37] mb-2" size={24} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-ehb-textMuted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* View Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setViewMode('services')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'services' 
                  ? 'bg-[#D4AF37] text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Legal Services
            </button>
            <button
              onClick={() => setViewMode('lawyers')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'lawyers' 
                  ? 'bg-[#D4AF37] text-slate-900' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Find Lawyers
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {viewMode === 'lawyers' ? (
          /* Lawyers View */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Featured Lawyers</h2>
                <p className="text-ehb-textMuted">Top-rated legal professionals</p>
              </div>
              <Link href="/ai-agent" className="text-[#D4AF37] hover:text-yellow-400 flex items-center gap-1 text-sm">
                AI Matching <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_LAWYERS.map((lawyer, index) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-3xl">
                      {lawyer.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold">{lawyer.name}</h3>
                        {lawyer.verified && <CheckCircle2 className="text-blue-400" size={14} />}
                      </div>
                      <p className="text-[#D4AF37] text-sm">{lawyer.spec}</p>
                      <p className="text-slate-500 text-xs flex items-center gap-1">
                        <MapPin size={10} /> {lawyer.location}
                      </p>
                    </div>
                  </div>

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

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-emerald-400 font-bold">{lawyer.fee}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/lawyer/lawyer-${lawyer.id}`} className="flex-1 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all text-center">
                      View Profile
                    </Link>
                    <Link href={`/lawyer/lawyer-${lawyer.id}?hire=true`} className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all text-center">
                      Hire Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Services View */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] mb-4 px-4">Categories</h3>
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible hide-scrollbar pb-2 lg:pb-0">
                  {LAW_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap lg:w-full ${
                        activeCategory === cat.id 
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 shadow-lg shadow-[#D4AF37]/20' 
                          : 'bg-white/5 hover:bg-white/10 text-ehb-textMuted hover:text-white'
                      }`}
                    >
                      <cat.icon size={18} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {LAW_CATEGORIES.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="text-ehb-textMuted text-sm">
                    {filteredServices.length} services available
                  </p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredServices.map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Matching CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl p-8 md:p-12 border border-blue-500/30 text-center"
        >
          <Bot className="mx-auto text-blue-400 mb-6" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-ehb-textBody mb-8 max-w-2xl mx-auto">
            Let our AI analyze your legal situation and recommend the perfect service and lawyer match.
          </p>
          <Link
            href="/ai-agent"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Zap size={22} />
            Get AI Recommendation
            <ArrowRight size={22} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function ServiceCard({ service }: { service: any }) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(`/service/${encodeURIComponent(service.title)}`)}
      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 flex items-center justify-center">
          <Scale className="text-[#D4AF37]" size={24} />
        </div>
        {service.cost && (
          <span className="text-[#D4AF37] font-bold text-sm">{service.cost}</span>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-ehb-textMuted mb-6 line-clamp-2">{service.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} />
          <span>2-4 weeks</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg group-hover:bg-[#D4AF37] group-hover:text-slate-900 transition-all">
          Start Case <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
