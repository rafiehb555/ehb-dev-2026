'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle, ChevronDown, Search, Bot, Scale, CreditCard, Shield,
  Globe, Users, FileText, MessageSquare, ArrowRight
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  questions: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    color: 'from-blue-500 to-cyan-500',
    questions: [
      {
        question: 'What is EHB Law?',
        answer: 'EHB Law is an AI-powered legal services platform that connects clients with verified lawyers globally. Our platform uses artificial intelligence to provide instant legal guidance, automated document generation, and smart lawyer matching based on your specific legal needs.'
      },
      {
        question: 'How does the AI Legal Assistant work?',
        answer: 'Our AI Legal Assistant uses advanced natural language processing to understand your legal queries. It can analyze your situation, suggest relevant legal services, generate documents, and recommend the best lawyers for your case. The AI is available 24/7 and supports multiple languages.'
      },
      {
        question: 'Is EHB Law available in my country?',
        answer: 'EHB Law operates in 50+ countries including UAE, Pakistan, UK, USA, Canada, Australia, and most European countries. We have verified lawyers in each jurisdiction who understand local laws and regulations.'
      },
      {
        question: 'How do I get started?',
        answer: 'Getting started is easy! Simply create an account, describe your legal issue to our AI assistant, and we\'ll guide you through the process. You can also browse lawyers directly or use our document generator for simple legal documents.'
      },
    ]
  },
  {
    id: 'lawyers',
    name: 'Lawyers',
    icon: Users,
    color: 'from-emerald-500 to-green-500',
    questions: [
      {
        question: 'How are lawyers verified on EHB Law?',
        answer: 'All lawyers on our platform undergo a rigorous verification process including bar association membership verification, background checks, credential validation, and reference checks. We also collect and verify client reviews to ensure quality.'
      },
      {
        question: 'Can I choose my own lawyer?',
        answer: 'Yes! You can browse our lawyer marketplace, filter by specialization, location, language, and ratings, and choose the lawyer that best fits your needs. Alternatively, our AI can recommend lawyers based on your specific case requirements.'
      },
      {
        question: 'What if I\'m not satisfied with my lawyer?',
        answer: 'Client satisfaction is our priority. If you\'re not satisfied, you can request a different lawyer at no additional cost within the first 48 hours. We also have a dispute resolution process and refund policy for qualifying cases.'
      },
      {
        question: 'Can I communicate with my lawyer through the platform?',
        answer: 'Yes, our platform includes secure messaging, video calls, and file sharing features. All communications are encrypted and stored securely. You can schedule consultations, share documents, and track your case progress all in one place.'
      },
    ]
  },
  {
    id: 'pricing',
    name: 'Pricing & Payment',
    icon: CreditCard,
    color: 'from-[#D4AF37] to-amber-500',
    questions: [
      {
        question: 'How much does EHB Law cost?',
        answer: 'Pricing varies based on the service. AI consultations start from free for basic queries. Lawyer consultations typically range from $50-$300 depending on the lawyer and complexity. Full case representation pricing is discussed directly with your chosen lawyer.'
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept credit/debit cards, bank transfers, and cryptocurrency (including our EHBGC token). Payments are processed securely through our escrow system, ensuring your funds are protected until services are delivered.'
      },
      {
        question: 'Is there a money-back guarantee?',
        answer: 'Yes, we offer a satisfaction guarantee. If you\'re not happy with an initial consultation, we\'ll either connect you with another lawyer or provide a full refund. For ongoing services, refund terms are outlined in your service agreement.'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees. All costs are clearly displayed before you confirm any service. Our platform fee is included in the quoted price, and lawyers cannot charge additional fees without your prior approval.'
      },
    ]
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    icon: Shield,
    color: 'from-violet-500 to-purple-500',
    questions: [
      {
        question: 'Is my data secure on EHB Law?',
        answer: 'Absolutely. We use bank-grade 256-bit encryption for all data transmission and storage. Our servers are hosted in secure, SOC 2 compliant data centers. We never share your personal information with third parties without your consent.'
      },
      {
        question: 'Who can see my case information?',
        answer: 'Only you and your assigned lawyer can access your case details. Our support team may access limited information to help resolve issues, but all staff sign strict confidentiality agreements. AI processing is done securely with data anonymization.'
      },
      {
        question: 'Is attorney-client privilege maintained?',
        answer: 'Yes, all communications between you and your lawyer through our platform are protected by attorney-client privilege. We\'ve designed our system to ensure these legal protections are fully maintained.'
      },
      {
        question: 'How do you handle data deletion requests?',
        answer: 'You can request deletion of your data at any time through your account settings or by contacting support. We comply with GDPR and other privacy regulations, and will delete your data within 30 days of request, except where legal retention is required.'
      },
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    questions: [
      {
        question: 'What documents can I generate with AI?',
        answer: 'Our AI can generate various legal documents including contracts, agreements, legal notices, affidavits, power of attorney, NDAs, and more. Templates are customized based on your jurisdiction and specific requirements.'
      },
      {
        question: 'Are AI-generated documents legally valid?',
        answer: 'AI-generated documents provide a solid starting point and are formatted according to legal standards. However, we recommend having important documents reviewed by a lawyer before signing. Some documents may require notarization depending on your jurisdiction.'
      },
      {
        question: 'Can I edit documents after generation?',
        answer: 'Yes, all generated documents can be edited, saved, and re-downloaded. You can also share them with your lawyer for review and further customization.'
      },
      {
        question: 'What file formats are supported?',
        answer: 'Documents can be downloaded in PDF, Word (.docx), and plain text formats. You can also print directly from the platform or share via secure link.'
      },
    ]
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const activeQuestions = FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions || [];
  
  const filteredQuestions = searchQuery 
    ? FAQ_CATEGORIES.flatMap(c => c.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : activeQuestions;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-medium mb-6">
              <HelpCircle size={16} />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-ehb-textMuted mb-8">
              Find answers to common questions about EHB Law
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Categories</p>
                {FAQ_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeCategory === category.id
                        ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-white'
                        : 'bg-white/5 border border-transparent text-ehb-textMuted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="text-white" size={16} />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={searchQuery ? 'lg:col-span-4' : 'lg:col-span-3'}
          >
            {searchQuery && (
              <p className="text-ehb-textMuted mb-6">
                Showing {filteredQuestions.length} results for "{searchQuery}"
              </p>
            )}
            
            <div className="space-y-4">
              {filteredQuestions.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(item.question)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="text-white font-medium pr-4">{item.question}</span>
                    <ChevronDown 
                      className={`text-[#D4AF37] shrink-0 transition-transform ${
                        openQuestions.includes(item.question) ? 'rotate-180' : ''
                      }`} 
                      size={20} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openQuestions.includes(item.question) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="h-px bg-white/10 mb-4" />
                          <p className="text-ehb-textMuted leading-relaxed">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-ehb-textMuted mb-4">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#D4AF37] hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="text-ehb-textBody mb-6">
                Can't find what you're looking for? Our support team is here to help 24/7.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <MessageSquare size={18} />
                  Contact Support
                </Link>
                <Link
                  href="/ai-agent"
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
                >
                  <Bot size={18} />
                  Ask AI Assistant
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <HelpCircle className="text-white" size={64} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
