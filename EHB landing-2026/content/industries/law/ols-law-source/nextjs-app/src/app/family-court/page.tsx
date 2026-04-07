'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  Heart, Users, Scale, Shield, FileText, Bot, Search,
  Star, ArrowRight, Upload, Sparkles, MessageSquare,
  CheckCircle2, Clock, MapPin, Award, Phone, Video,
  Globe, Briefcase, ChevronRight, Play, Zap, Crown
} from 'lucide-react';

// Family Law Services
const FAMILY_SERVICES = [
  {
    id: 'divorce',
    title: 'Divorce Case Filing',
    titleUrdu: 'طلاق کیس فائلنگ',
    description: 'Legal assistance for divorce proceedings and settlements',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    cases: '2,500+',
    avgTime: '3-6 months',
  },
  {
    id: 'custody',
    title: 'Child Custody Dispute',
    titleUrdu: 'بچوں کی تحویل',
    description: 'Legal representation for custody and visitation rights',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    cases: '1,800+',
    avgTime: '2-4 months',
  },
  {
    id: 'alimony',
    title: 'Alimony & Financial Support',
    titleUrdu: 'نفقہ اور مالی مدد',
    description: 'Legal help for maintenance and financial support cases',
    icon: Scale,
    color: 'from-emerald-500 to-green-500',
    cases: '1,200+',
    avgTime: '1-3 months',
  },
  {
    id: 'domestic',
    title: 'Domestic Violence Protection',
    titleUrdu: 'گھریلو تشدد تحفظ',
    description: 'Legal support for protection orders and safety measures',
    icon: Shield,
    color: 'from-violet-500 to-purple-500',
    cases: '900+',
    avgTime: 'Urgent',
  },
  {
    id: 'adoption',
    title: 'Adoption & Guardianship',
    titleUrdu: 'گود لینا اور سرپرستی',
    description: 'Legal procedures for adoption and guardianship cases',
    icon: Heart,
    color: 'from-orange-500 to-amber-500',
    cases: '600+',
    avgTime: '4-8 months',
  },
  {
    id: 'inheritance',
    title: 'Family Inheritance',
    titleUrdu: 'خاندانی وراثت',
    description: 'Property and inheritance dispute resolution',
    icon: Briefcase,
    color: 'from-teal-500 to-cyan-500',
    cases: '800+',
    avgTime: '3-6 months',
  },
];

// Recommended Lawyers
const FAMILY_LAWYERS = [
  {
    id: 'lawyer-1',
    name: 'Sarah Ahmed',
    nameUrdu: 'سارہ احمد',
    title: 'Family Law Specialist',
    experience: '12 years',
    casesWon: '320+',
    rating: 4.9,
    reviews: 156,
    location: 'Lahore, Pakistan',
    languages: ['English', 'Urdu'],
    image: '👩‍⚖️',
    verified: true,
    fee: '$150/hr',
  },
  {
    id: 'lawyer-2',
    name: 'Ahmed Hassan',
    nameUrdu: 'احمد حسن',
    title: 'Divorce & Custody Expert',
    experience: '15 years',
    casesWon: '450+',
    rating: 4.8,
    reviews: 203,
    location: 'Dubai, UAE',
    languages: ['English', 'Arabic', 'Urdu'],
    image: '👨‍⚖️',
    verified: true,
    fee: '$200/hr',
  },
  {
    id: 'lawyer-3',
    name: 'Fatima Khan',
    nameUrdu: 'فاطمہ خان',
    title: 'Child Custody Specialist',
    experience: '10 years',
    casesWon: '280+',
    rating: 4.9,
    reviews: 142,
    location: 'London, UK',
    languages: ['English', 'Urdu'],
    image: '👩‍⚖️',
    verified: true,
    fee: '$180/hr',
  },
];

// Recent Cases
const RECENT_CASES = [
  { type: 'Divorce Settlement', location: 'UAE', status: 'Resolved', time: '2 days ago' },
  { type: 'Child Custody', location: 'UK', status: 'In Progress', time: '5 hours ago' },
  { type: 'Maintenance Case', location: 'Pakistan', status: 'Resolved', time: '1 day ago' },
  { type: 'Domestic Protection Order', location: 'Canada', status: 'Urgent', time: '3 hours ago' },
];

// AI Example Questions
const AI_QUESTIONS = [
  'How do I file a divorce case?',
  'What are child custody laws?',
  'How long does divorce take?',
  'What documents needed for custody?',
  'Can I get alimony after divorce?',
];

export default function FamilyCourtPage() {
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAskAI = (question: string) => {
    setSelectedQuestion(question);
    setShowAIResponse(true);
  };

  const handleAnalyzeCase = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-6">
              <Heart size={16} />
              Family Court Legal Services
              <Shield size={16} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Family Court Services
            </h1>
            <p className="text-xl text-ehb-textMuted max-w-2xl mx-auto mb-8">
              AI-powered legal assistance for family disputes, divorce, child custody, and settlements.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/create-case?type=family"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2"
              >
                <FileText size={20} />
                Start Family Case
              </Link>
              <Link
                href="/ai-agent"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Bot size={20} />
                Ask AI About Family Law
              </Link>
              <Link
                href="/marketplace?category=family"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Search size={20} />
                Find Family Lawyer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Family Legal Services */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Family Legal Services</h2>
              <p className="text-ehb-textMuted">Choose a service to start your case</p>
            </div>
            <Link href="/marketplace?category=family" className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAMILY_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="text-white" size={28} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                <p className="text-xs text-pink-400 mb-2">{service.titleUrdu}</p>
                <p className="text-sm text-ehb-textMuted mb-4">{service.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    {service.cases} cases
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {service.avgTime}
                  </span>
                </div>
                
                <Link
                  href={`/create-case?type=${service.id}`}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 text-pink-400 font-medium rounded-lg hover:bg-pink-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Start Case <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Family Law Assistant */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Ask AI Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ask AI About Family Law</h3>
                <p className="text-sm text-ehb-textMuted">Get instant answers to your questions</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-xs text-ehb-textMuted mb-2">Example Questions:</p>
              {AI_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleAskAI(question)}
                  className="w-full text-left px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-ehb-textBody hover:bg-white/10 hover:border-blue-500/30 transition-all"
                >
                  • {question}
                </button>
              ))}
            </div>

            <Link
              href="/ai-agent"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Ask AI Assistant
            </Link>
          </motion.div>

          {/* AI Response Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Response</h3>
                <p className="text-sm text-ehb-textMuted">Intelligent legal guidance</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-sm text-ehb-textBody leading-relaxed">
                {showAIResponse ? (
                  <>
                    <span className="text-emerald-400 font-medium">Regarding: {selectedQuestion}</span>
                    <br /><br />
                    Divorce cases usually require filing a petition in family court. You will need documents such as:
                    <br /><br />
                    • Marriage certificate
                    <br />
                    • National ID / Passport
                    <br />
                    • Financial documents
                    <br />
                    • Child birth certificates (if applicable)
                    <br /><br />
                    The process typically takes 3-6 months depending on mutual consent.
                    <br /><br />
                    <span className="text-emerald-400">Would you like to start a divorce case?</span>
                  </>
                ) : (
                  <span className="text-slate-500 italic">
                    Click on a question above to see AI response...
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/create-case?type=divorce"
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 font-medium rounded-lg hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                Start Divorce Case
              </Link>
              <Link
                href="/marketplace?category=family"
                className="flex-1 py-2.5 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Find Lawyer
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Recommended Lawyers */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Recommended Family Lawyers</h2>
              <p className="text-ehb-textMuted">Top-rated family law specialists</p>
            </div>
            <Link href="/marketplace?category=family" className="text-pink-400 hover:text-pink-300 flex items-center gap-1 text-sm">
              View All Lawyers <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FAMILY_LAWYERS.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 transition-all"
              >
                {/* Lawyer Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-3xl">
                    {lawyer.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{lawyer.name}</h3>
                      {lawyer.verified && (
                        <CheckCircle2 className="text-blue-400" size={16} />
                      )}
                    </div>
                    <p className="text-xs text-pink-400">{lawyer.nameUrdu}</p>
                    <p className="text-sm text-ehb-textMuted">{lawyer.title}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="text-sm font-bold text-white">{lawyer.experience}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Cases Won</p>
                    <p className="text-sm font-bold text-emerald-400">{lawyer.casesWon}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(lawyer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white font-medium">{lawyer.rating}</span>
                  <span className="text-xs text-slate-500">({lawyer.reviews} reviews)</span>
                </div>

                {/* Location & Fee */}
                <div className="flex items-center justify-between text-xs text-ehb-textMuted mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {lawyer.location}
                  </span>
                  <span className="text-emerald-400 font-medium">{lawyer.fee}</span>
                </div>

                {/* Languages */}
                <div className="flex gap-1 mb-4">
                  {lawyer.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 bg-white/10 rounded text-xs text-ehb-textMuted">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/marketplace/lawyer/${lawyer.id}`}
                    className="flex-1 py-2 bg-white/10 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/marketplace/lawyer/${lawyer.id}?hire=true`}
                    className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all text-center"
                  >
                    Hire Lawyer
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Case Analyzer */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-8 border border-violet-500/20"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Zap className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Family Case Analyzer</h3>
                    <p className="text-ehb-textMuted">Upload documents for instant AI analysis</p>
                  </div>
                </div>
                
                <p className="text-ehb-textBody mb-6">
                  Our AI will analyze your case documents and recommend the best lawyer 
                  based on your specific family law situation.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAnalyzeCase}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Upload size={18} />
                    Upload Documents
                  </button>
                  <button
                    onClick={handleAnalyzeCase}
                    disabled={isAnalyzing}
                    className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Analyze Case
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Analysis Preview */}
              <div className="w-full lg:w-80 bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-ehb-textMuted mb-3">AI Analysis Preview:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ehb-textBody">Case Type Detection</span>
                    <span className="text-emerald-400 text-sm">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ehb-textBody">Document Verification</span>
                    <span className="text-emerald-400 text-sm">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ehb-textBody">Success Probability</span>
                    <span className="text-emerald-400 text-sm">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ehb-textBody">Lawyer Matching</span>
                    <span className="text-emerald-400 text-sm">✓ Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Recent Cases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Recent Cases on Platform</h2>
              <p className="text-sm text-ehb-textMuted">Family law cases being handled globally</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECENT_CASES.map((caseItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    caseItem.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                    caseItem.status === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {caseItem.status}
                  </span>
                  <span className="text-xs text-slate-500">{caseItem.time}</span>
                </div>
                <h4 className="text-white font-medium mb-1">{caseItem.type}</h4>
                <p className="text-xs text-ehb-textMuted flex items-center gap-1">
                  <Globe size={12} />
                  {caseItem.location}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Start Case CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-3xl p-12 border border-pink-500/30 text-center"
          >
            <Crown className="mx-auto text-pink-400 mb-6" size={48} />
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Family Court Case Today
            </h2>
            <p className="text-ehb-textBody mb-8 max-w-2xl mx-auto">
              Get AI-powered legal assistance and connect with top family law specialists. 
              Our platform handles divorce, custody, alimony, and all family legal matters.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/create-case?type=family"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all flex items-center gap-3 text-lg"
              >
                <FileText size={22} />
                Start Family Case
                <ArrowRight size={22} />
              </Link>
              
              <Link
                href="/ai-agent"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3 text-lg"
              >
                <Bot size={22} />
                Ask AI First
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
