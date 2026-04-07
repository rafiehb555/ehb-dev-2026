'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, User, Globe, Sparkles, X } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
];

const navItems = [
  { id: '/', label: 'Home' },
  { id: '/dashboard', label: 'Dashboard' },
  { id: '/marketplace', label: 'Marketplace' },
  { id: '/family-court', label: 'Family Court' },
  { id: '/ai-assistant', label: 'AI Assistant' },
  { id: '/knowledge-base', label: 'Knowledge' },
  { id: '/research', label: 'Research' },
  { id: '/payments', label: 'Payments' },
  { id: '/communication', label: 'Messages' },
  { id: '/franchise', label: 'Franchise' },
  { id: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to EHB Law Hub. How can I help you today?");
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("AI Detected user location: Pakistan. Suggesting Urdu.");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#020617]/95 backdrop-blur-md border-b border-slate-800">
      {/* AI Welcome System Banner */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-1.5 px-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Welcome System</span>
            <span className="text-[10px] text-ehb-textBody ml-2 hidden sm:inline">{welcomeMessage}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[9px] text-slate-500">AI Detected: English (US)</span>
            <div className="w-1 h-1 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      <div className="max-w-[100%] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-blue-500/20">
                EHB
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white hidden lg:block">Legal Services Hub</span>
            </Link>
          </div>
          
          {/* Center: Navigation Links */}
          <div className="flex-1 flex justify-center overflow-hidden">
            <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5 text-[10px] lg:text-[11px] xl:text-xs font-bold overflow-x-auto hide-scrollbar whitespace-nowrap px-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id}
                  className={`transition-all flex-shrink-0 py-2 border-b-2 ${
                    pathname === item.id 
                      ? 'text-blue-400 border-blue-400' 
                      : 'text-ehb-textMuted border-transparent hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[9px] sm:text-[10px] font-bold text-ehb-textBody hover:bg-slate-800 transition-all"
              >
                <Globe size={12} className="sm:w-3.5 sm:h-3.5 text-blue-400" />
                <span className="hidden xs:inline">{currentLang.name}</span>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setShowLangMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-ehb-textBody hover:bg-blue-600/20 hover:text-blue-400 transition-colors border-b border-slate-800/50 last:border-0"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center bg-slate-900 rounded-full px-3 py-1.5 gap-2 border border-slate-800 shadow-sm">
              <Search size={14} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="bg-transparent border-none outline-none text-[11px] w-24 xl:w-40 focus:w-48 transition-all text-white"
              />
            </div>

            <button className="p-1.5 rounded-full hover:bg-slate-800 transition-colors text-ehb-textMuted">
              <User size={18} />
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-full hover:bg-slate-800 transition-colors text-ehb-textMuted"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.id}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === item.id 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-ehb-textBody hover:bg-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
