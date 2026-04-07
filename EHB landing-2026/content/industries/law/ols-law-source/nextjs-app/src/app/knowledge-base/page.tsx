'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Globe, FileText, Briefcase, Bell, ChevronRight, Star, Clock } from 'lucide-react';
import Link from 'next/link';

const GUIDES = [
  { id: '1', title: 'Complete Guide to Khula in Pakistan', category: 'Family Law', country: 'Pakistan', readTime: '15 min', rating: 4.9 },
  { id: '2', title: 'Starting a Business in UAE', category: 'Corporate Law', country: 'UAE', readTime: '20 min', rating: 4.8 },
  { id: '3', title: 'Property Transfer Laws', category: 'Property Law', country: 'Global', readTime: '12 min', rating: 4.7 },
  { id: '4', title: 'Divorce Procedures in UK', category: 'Family Law', country: 'UK', readTime: '18 min', rating: 4.9 },
  { id: '5', title: 'Intellectual Property Rights', category: 'IP Law', country: 'USA', readTime: '25 min', rating: 4.6 },
  { id: '6', title: 'Employment Contracts Guide', category: 'Employment Law', country: 'Global', readTime: '10 min', rating: 4.8 },
];

const ARTICLES = [
  { id: '1', title: 'New Family Court Updates 2026', author: 'Legal Team', date: 'Mar 10, 2026', category: 'News' },
  { id: '2', title: 'How to Protect Your Assets', author: 'Ahmed Khan', date: 'Mar 08, 2026', category: 'Guide' },
  { id: '3', title: 'Understanding Legal AI', author: 'Tech Team', date: 'Mar 05, 2026', category: 'Technology' },
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'guides' | 'laws' | 'articles' | 'cases' | 'updates'>('guides');

  const filteredGuides = GUIDES.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Search Header */}
      <div className="relative mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mb-3 sm:mb-4 text-white">Global Legal Knowledge Base</h1>
        <p className="text-xs sm:text-sm text-ehb-textMuted max-w-2xl mx-auto mb-6 sm:mb-8">
          Access verified legal guides, country laws, and expert articles.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-ehb-textMuted" size={18} />
          <input 
            type="text" 
            placeholder="Search for laws, guides, or legal topics..."
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl shadow-xl outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm sm:text-base lg:text-lg text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 overflow-x-auto hide-scrollbar">
        {[
          { id: 'guides', label: 'Legal Guides', icon: BookOpen },
          { id: 'laws', label: 'Country Laws', icon: Globe },
          { id: 'articles', label: 'Articles', icon: FileText },
          { id: 'cases', label: 'Cases', icon: Briefcase },
          { id: 'updates', label: 'Updates', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-brand-primary shadow-sm' 
                : 'text-ehb-textMuted hover:text-slate-200'
            }`}
          >
            <tab.icon size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filteredGuides.map((guide) => (
                <div 
                  key={guide.id} 
                  className="ms-card p-4 sm:p-6 group cursor-pointer hover:border-brand-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                      {guide.category}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-ehb-textMuted flex items-center gap-1">
                      <Globe size={10} /> {guide.country}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-2 sm:mb-3 group-hover:text-brand-primary transition-colors">
                    {guide.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={10} /> {guide.readTime}</span>
                      <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500" /> {guide.rating}</span>
                    </div>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4 text-slate-500 group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-3 sm:space-y-4">
              {ARTICLES.map((article) => (
                <div 
                  key={article.id} 
                  className="ms-card p-4 sm:p-6 group cursor-pointer hover:border-brand-primary/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 sm:mb-2 block">
                      {article.category} • {article.date}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-ehb-textMuted mt-1">By {article.author}</p>
                  </div>
                  <ChevronRight size={16} className="sm:w-5 sm:h-5 text-slate-500 group-hover:text-brand-primary transition-colors" />
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'laws' || activeTab === 'cases' || activeTab === 'updates') && (
            <div className="ms-card p-8 sm:p-12 text-center">
              <p className="text-slate-500 text-sm sm:text-base">Content for "{activeTab}" is being loaded...</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6">
            <h3 className="font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white text-sm sm:text-base">
              <Star size={16} className="sm:w-5 sm:h-5 text-brand-primary" />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Divorce', 'Property', 'Business', 'Employment', 'Criminal'].map((topic) => (
                <span key={topic} className="px-2 sm:px-3 py-1 bg-slate-800 rounded-full text-[10px] sm:text-xs font-bold text-ehb-textBody hover:bg-brand-primary hover:text-white cursor-pointer transition-colors">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6 bg-brand-primary text-white">
            <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">Need Legal Help?</h3>
            <p className="text-[10px] sm:text-xs text-white/70 mb-3 sm:mb-4">Get personalized guidance from our AI assistant.</p>
            <Link 
              href="/ai-assistant"
              className="w-full py-2 bg-white text-brand-primary rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-2"
            >
              Ask AI Assistant <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
