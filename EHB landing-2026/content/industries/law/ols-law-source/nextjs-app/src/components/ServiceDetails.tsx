'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle2, Clock, FileText, 
  ShieldCheck, Zap, ArrowRight, Info
} from 'lucide-react';

interface ServiceDetailsProps {
  service: {
    title: string;
    description: string;
    icon: any;
    requiredDocs?: string[];
    process?: string[];
    estimatedTime?: string;
    cost?: string;
  };
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  const router = useRouter();

  if (!service) return null;
  
  return (
    <div className="w-full max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-6 sm:mb-8 group"
      >
        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs sm:text-sm font-bold">Back to Services</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="ms-card p-6 sm:p-8 bg-slate-900 border border-slate-800">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <service.icon size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white">{service.title}</h1>
                <p className="text-xs sm:text-sm text-ehb-textMuted">{service.description}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500 mb-3 sm:mb-4">Service Overview</h3>
                <p className="text-xs sm:text-sm text-ehb-textMuted leading-relaxed">
                  Our {service.title} service provides comprehensive legal support tailored to your specific needs. 
                  We handle everything from initial consultation to final resolution, ensuring your rights are protected 
                  at every step of the legal process.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-700">
                  <h4 className="font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white text-sm sm:text-base">
                    <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
                    Estimated Timeline
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-white">{service.estimatedTime || '2-4 Weeks'}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">Varies based on case complexity.</p>
                </div>
                <div className="p-4 sm:p-6 bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-700">
                  <h4 className="font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white text-sm sm:text-base">
                    <ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-500" />
                    Service Guarantee
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-white">Verified Legal Experts</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">100% Secure Escrow Payments.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ms-card p-6 sm:p-8 bg-slate-900 border border-slate-800">
            <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-500 mb-4 sm:mb-6">Legal Process</h3>
            <div className="space-y-4 sm:space-y-6">
              {(service.process || [
                "Initial Case Review & AI Analysis",
                "Lawyer Matching & Consultation",
                "Document Preparation & Verification",
                "Legal Representation & Filing",
                "Case Resolution & Final Release"
              ]).map((step, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 text-white">{step}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Standard procedure for this legal service.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="ms-card p-4 sm:p-6 border-2 border-brand-primary bg-brand-primary/5">
            <h3 className="font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white text-sm sm:text-base">
              <Zap size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Start Your Case
            </h3>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex justify-between text-[10px] sm:text-xs">
                <span className="text-slate-500">Service Fee</span>
                <span className="font-bold text-white">{service.cost || 'From $250'}</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs">
                <span className="text-slate-500">EHB Platform Fee</span>
                <span className="font-bold text-white">10%</span>
              </div>
              <div className="border-t border-slate-700 pt-3 sm:pt-4 flex justify-between text-xs sm:text-sm font-bold">
                <span className="text-white">Total Estimate</span>
                <span className="text-brand-primary">Calculated by AI</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/create-case')}
              className="w-full py-3 sm:py-4 bg-brand-primary text-white rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              Start Legal Case <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <p className="text-[9px] sm:text-[10px] text-ehb-textMuted text-center mt-3 sm:mt-4">
              Secure escrow payment required after lawyer match.
            </p>
          </div>

          <div className="ms-card p-4 sm:p-6 bg-slate-900 border border-slate-800">
            <h3 className="font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white text-sm sm:text-base">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-brand-primary" />
              Required Documents
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {(service.requiredDocs || [
                "Valid Identity Proof (ID/Passport)",
                "Relevant Case Documents",
                "Proof of Address",
                "Evidence/Supporting Material"
              ]).map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800 rounded-lg sm:rounded-xl border border-slate-700">
                  <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-white">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ms-card p-4 sm:p-6 bg-slate-900 text-white border border-slate-800">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-blue-400">
              <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
              <h4 className="font-bold text-[10px] sm:text-xs uppercase tracking-widest">AI Matching</h4>
            </div>
            <p className="text-[9px] sm:text-[10px] text-ehb-textMuted leading-relaxed">
              Our AI will analyze your case details and match you with the top 3 lawyers specialized in {service.title}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
