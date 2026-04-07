'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare, Building2,
  Globe, CheckCircle2, Loader2, Linkedin, Twitter, Facebook, Instagram
} from 'lucide-react';

const OFFICES = [
  {
    city: 'Dubai, UAE',
    address: 'Level 42, Emirates Towers, Sheikh Zayed Road',
    phone: '+971 4 123 4567',
    email: 'dubai@ehblaw.com',
    hours: 'Sun-Thu: 9AM - 6PM'
  },
  {
    city: 'Lahore, Pakistan',
    address: '15th Floor, Arfa Tower, Egerton Road',
    phone: '+92 42 123 4567',
    email: 'lahore@ehblaw.com',
    hours: 'Mon-Fri: 9AM - 6PM'
  },
  {
    city: 'London, UK',
    address: '100 Liverpool Street, EC2M 2AT',
    phone: '+44 20 1234 5678',
    email: 'london@ehblaw.com',
    hours: 'Mon-Fri: 9AM - 5PM'
  },
  {
    city: 'Toronto, Canada',
    address: '181 Bay Street, Suite 2500',
    phone: '+1 416 123 4567',
    email: 'toronto@ehblaw.com',
    hours: 'Mon-Fri: 9AM - 5PM'
  },
];

const CONTACT_REASONS = [
  { id: 'general', label: 'General Inquiry' },
  { id: 'support', label: 'Customer Support' },
  { id: 'partnership', label: 'Partnership Opportunity' },
  { id: 'media', label: 'Press & Media' },
  { id: 'investor', label: 'Investor Relations' },
  { id: 'careers', label: 'Careers' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-slate-900 to-[#020617]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              <MessageSquare size={16} />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-ehb-textMuted">
              Have questions? We're here to help. Reach out to our team anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-ehb-textMuted mb-6">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', reason: 'general', message: '' });
                    }}
                    className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ehb-textMuted mb-2">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ehb-textMuted mb-2">EMAIL *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ehb-textMuted mb-2">PHONE</label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ehb-textMuted mb-2">REASON *</label>
                      <select
                        required
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-all"
                      >
                        {CONTACT_REASONS.map((reason) => (
                          <option key={reason.id} value={reason.id}>{reason.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ehb-textMuted mb-2">MESSAGE *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-ehb-textMuted outline-none focus:border-[#D4AF37] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Contact */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Contact</h2>
              
              <div className="space-y-4">
                <a href="mailto:hello@ehblaw.com" className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Mail className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ehb-textMuted">Email Us</p>
                    <p className="text-white font-medium">hello@ehblaw.com</p>
                  </div>
                </a>
                
                <a href="tel:+18885555555" className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Phone className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ehb-textMuted">Call Us</p>
                    <p className="text-white font-medium">+1 (888) EHB-LAWS</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                    <Clock className="text-[#D4AF37]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ehb-textMuted">Support Hours</p>
                    <p className="text-white font-medium">24/7 AI Support • Human: Mon-Fri 9-6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                  { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
                  { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600/20 hover:text-blue-400' },
                  { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-ehb-textMuted transition-all ${social.color}`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-medium mb-4">
              <Globe size={14} />
              Global Presence
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Our Offices</h2>
            <p className="text-ehb-textMuted">Visit us at any of our global locations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                    <Building2 className="text-[#D4AF37]" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{office.city}</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-ehb-textMuted shrink-0 mt-0.5" size={14} />
                    <span className="text-ehb-textMuted">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-ehb-textMuted" size={14} />
                    <span className="text-ehb-textMuted">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-ehb-textMuted" size={14} />
                    <span className="text-ehb-textMuted">{office.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-ehb-textMuted" size={14} />
                    <span className="text-ehb-textMuted">{office.hours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
