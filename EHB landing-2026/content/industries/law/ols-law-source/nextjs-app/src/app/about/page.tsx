'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Scale, Globe, Users, Award, TrendingUp, Shield, Zap, Heart,
  Building2, Target, Rocket, CheckCircle2, Star, ArrowRight,
  Linkedin, Twitter, Mail, Bot, Sparkles, Crown
} from 'lucide-react';

const STATS = [
  { value: '50+', label: 'Countries', icon: Globe },
  { value: '10,000+', label: 'Cases Handled', icon: Scale },
  { value: '500+', label: 'Verified Lawyers', icon: Users },
  { value: '98%', label: 'Client Satisfaction', icon: Heart },
];

const TEAM = [
  {
    name: 'Muhammad Rafi',
    role: 'Founder & CEO',
    image: '👨‍💼',
    bio: 'Visionary entrepreneur with 15+ years in legal tech and AI innovation.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Dr. Sarah Khan',
    role: 'Chief Legal Officer',
    image: '👩‍⚖️',
    bio: 'Former Supreme Court advocate with expertise in international law.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Ahmed Ali',
    role: 'CTO',
    image: '👨‍💻',
    bio: 'AI researcher and former Google engineer building the future of legal AI.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Maria Rodriguez',
    role: 'VP of Operations',
    image: '👩‍💼',
    bio: 'Operations expert scaling legal services across 50+ countries.',
    linkedin: '#',
    twitter: '#'
  },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Bank-grade encryption and verified lawyer credentials ensure your legal matters are in safe hands.'
  },
  {
    icon: Zap,
    title: 'AI-Powered Efficiency',
    description: 'Our AI reduces legal research time by 80% and automates routine tasks for faster resolution.'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Connect with verified lawyers across 50+ countries, breaking down geographical barriers to justice.'
  },
  {
    icon: Heart,
    title: 'Client-First Approach',
    description: 'Every feature we build starts with one question: How does this help our clients get better legal outcomes?'
  },
];

const MILESTONES = [
  { year: '2022', title: 'Founded', description: 'EHB Law founded with a vision to democratize legal services globally.' },
  { year: '2023', title: 'AI Launch', description: 'Launched AI Legal Assistant, revolutionizing how people interact with legal services.' },
  { year: '2024', title: 'Global Expansion', description: 'Expanded to 50+ countries with 500+ verified lawyers on the platform.' },
  { year: '2025', title: 'Series A', description: 'Raised $25M Series A to accelerate AI development and global growth.' },
  { year: '2026', title: 'The Future', description: 'Building the world\'s largest AI-powered legal marketplace.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
              <Sparkles size={16} />
              About EHB Law
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Revolutionizing Legal Services
              <span className="block text-[#D4AF37]">Through AI Innovation</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              We're on a mission to make quality legal services accessible to everyone, everywhere. 
              By combining AI technology with human expertise, we're building the future of law.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
              >
                <Rocket size={20} />
                See Platform Demo
              </Link>
              <Link
                href="/investor-demo"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <TrendingUp size={20} />
                Investor Information
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-white" size={24} />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4">
              <Target size={14} />
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Making Justice Accessible to Everyone
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Legal services have traditionally been expensive, time-consuming, and geographically limited. 
              We're changing that. Our AI-powered platform connects clients with the right lawyers instantly, 
              automates routine legal work, and reduces costs by up to 70%.
            </p>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Whether you need help with a simple contract or a complex international dispute, 
              EHB Law provides the tools and expertise to get the best possible outcome.
            </p>
            <div className="space-y-3">
              {[
                'AI-powered case analysis in minutes, not days',
                'Transparent pricing with no hidden fees',
                'Verified lawyers with proven track records',
                '24/7 support in 20+ languages'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 text-center">
                  <Bot className="text-blue-400 mx-auto mb-3" size={32} />
                  <p className="text-2xl font-bold text-white mb-1">AI Agent</p>
                  <p className="text-xs text-slate-400">24/7 Legal Assistance</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
                  <Users className="text-emerald-400 mx-auto mb-3" size={32} />
                  <p className="text-2xl font-bold text-white mb-1">500+</p>
                  <p className="text-xs text-slate-400">Expert Lawyers</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-6 text-center">
                  <Globe className="text-violet-400 mx-auto mb-3" size={32} />
                  <p className="text-2xl font-bold text-white mb-1">50+</p>
                  <p className="text-xs text-slate-400">Countries</p>
                </div>
                <div className="bg-gradient-to-br from-[#D4AF37]/20 to-amber-500/20 border border-[#D4AF37]/30 rounded-2xl p-6 text-center">
                  <Award className="text-[#D4AF37] mx-auto mb-3" size={32} />
                  <p className="text-2xl font-bold text-white mb-1">98%</p>
                  <p className="text-xs text-slate-400">Success Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-4">
              <Heart size={14} />
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Drives Us
            </h2>
            <p className="text-slate-400">
              Our core values guide every decision we make and every feature we build.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                  <value.icon className="text-[#D4AF37]" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-medium mb-4">
            <Rocket size={14} />
            Our Journey
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From Vision to Reality
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#D4AF37] via-blue-500 to-emerald-500 hidden md:block" />
          
          <div className="space-y-12">
            {MILESTONES.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                  <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-md`}>
                    <span className="text-[#D4AF37] font-bold text-lg">{milestone.year}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-slate-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-slate-900 z-10 hidden md:block" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-4">
              <Crown size={14} />
              Leadership Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-slate-400">
              Our team combines deep legal expertise with cutting-edge technology skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-[#D4AF37]/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#D4AF37] text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href={member.linkedin} className="p-2 bg-white/10 rounded-lg hover:bg-blue-500/20 transition-all">
                    <Linkedin size={16} className="text-slate-400 hover:text-blue-400" />
                  </a>
                  <a href={member.twitter} className="p-2 bg-white/10 rounded-lg hover:bg-sky-500/20 transition-all">
                    <Twitter size={16} className="text-slate-400 hover:text-sky-400" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/20 border border-[#D4AF37]/30 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Future of Law?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of clients and lawyers who are already using EHB Law to transform their legal experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/create-case"
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center gap-2"
            >
              Start Your Case
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
