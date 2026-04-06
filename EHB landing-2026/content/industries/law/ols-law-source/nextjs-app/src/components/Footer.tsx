'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram,
  Globe, Shield, Award, Users, ChevronRight
} from 'lucide-react';

const FOOTER_LINKS = {
  services: [
    { label: 'AI Legal Assistant', href: '/ai-agent' },
    { label: 'Find a Lawyer', href: '/marketplace' },
    { label: 'Create Legal Case', href: '/create-case' },
    { label: 'Document Generator', href: '/document-generator' },
    { label: 'Legal Research', href: '/research' },
  ],
  legal: [
    { label: 'Family Law', href: '/family-court' },
    { label: 'Property Law', href: '/marketplace?category=property' },
    { label: 'Corporate Law', href: '/marketplace?category=corporate' },
    { label: 'Criminal Defense', href: '/marketplace?category=criminal' },
    { label: 'Immigration', href: '/marketplace?category=immigration' },
  ],
  company: [
    { label: 'About EHB Law', href: '/about' },
    { label: 'For Investors', href: '/investor-demo' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Contact Us', href: '/contact' },
  ],
  resources: [
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: 'Legal Guides', href: '/guides' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'API Documentation', href: '/api-docs' },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Scale className="text-white" size={24} />
              </div>
              <div>
                <span className="font-bold text-xl text-white">EHB Law</span>
                <span className="text-[#D4AF37] ml-1 text-sm font-medium block -mt-1">AI Platform</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm mb-6 max-w-sm">
              World's first AI-powered legal services platform. Connecting clients with verified lawyers globally through intelligent matching and automated case management.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <Shield className="text-emerald-400" size={16} />
                <span className="text-xs text-slate-400">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <Award className="text-[#D4AF37]" size={16} />
                <span className="text-xs text-slate-400">Verified Lawyers</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Services</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Areas */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Legal Areas</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Resources</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Mail className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-white">contact@ehblaw.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Phone className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm text-white">+1 (888) EHB-LAWS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <MapPin className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Headquarters</p>
                <p className="text-sm text-white">Dubai, UAE • Lahore, PK</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Globe className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Global Network</p>
                <p className="text-sm text-white">50+ Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 EHB Law Services. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="text-slate-500 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-500 text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/disclaimer" className="text-slate-500 text-sm hover:text-white transition-colors">
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
