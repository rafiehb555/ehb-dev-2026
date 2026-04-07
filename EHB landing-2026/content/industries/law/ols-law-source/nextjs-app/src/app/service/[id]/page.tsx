'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { 
  ArrowLeft, CheckCircle2, Clock, FileText, 
  ShieldCheck, Zap, ArrowRight, Info,
  Briefcase, Home, Heart, Scale, Building2, Globe,
  Car, Stethoscope, Landmark, Shield
} from 'lucide-react';

const SERVICES_DATA: Record<string, any> = {
  'family-law': {
    title: 'Family Law',
    description: 'Divorce, custody, marriage contracts and family disputes',
    icon: Heart,
    requiredDocs: ['Marriage Certificate', 'ID Proof', 'Children Birth Certificates', 'Property Documents'],
    process: ['Initial Consultation', 'Case Assessment', 'Documentation Review', 'Court Filing', 'Representation & Settlement'],
    estimatedTime: '3-6 Months',
    cost: 'From $500'
  },
  'property-law': {
    title: 'Property Law',
    description: 'Real estate transactions, disputes and property rights',
    icon: Home,
    requiredDocs: ['Property Deed', 'ID Proof', 'Previous Sale Agreements', 'Tax Records'],
    process: ['Property Verification', 'Legal Due Diligence', 'Contract Drafting', 'Registration', 'Transfer Completion'],
    estimatedTime: '2-4 Weeks',
    cost: 'From $350'
  },
  'business-law': {
    title: 'Business Law',
    description: 'Company registration, contracts and corporate compliance',
    icon: Briefcase,
    requiredDocs: ['Business Registration', 'Director IDs', 'MOA/AOA', 'Financial Statements'],
    process: ['Business Analysis', 'Legal Structure Review', 'Compliance Check', 'Contract Preparation', 'Registration'],
    estimatedTime: '1-3 Weeks',
    cost: 'From $400'
  },
  'criminal-law': {
    title: 'Criminal Defense',
    description: 'Criminal defense, bail applications and legal representation',
    icon: Scale,
    requiredDocs: ['FIR Copy', 'ID Proof', 'Witness Statements', 'Evidence Documents'],
    process: ['Case Review', 'Bail Application', 'Evidence Analysis', 'Defense Strategy', 'Court Representation'],
    estimatedTime: 'Varies',
    cost: 'From $1,000'
  },
  'immigration': {
    title: 'Immigration Law',
    description: 'Visa applications, citizenship and immigration issues',
    icon: Globe,
    requiredDocs: ['Passport', 'Visa History', 'Employment Proof', 'Financial Statements'],
    process: ['Eligibility Assessment', 'Document Preparation', 'Application Filing', 'Interview Prep', 'Follow-up'],
    estimatedTime: '2-6 Months',
    cost: 'From $600'
  },
  'corporate-law': {
    title: 'Corporate Law',
    description: 'Mergers, acquisitions and corporate restructuring',
    icon: Building2,
    requiredDocs: ['Company Documents', 'Financial Reports', 'Board Resolutions', 'Shareholder Agreements'],
    process: ['Due Diligence', 'Valuation', 'Negotiation', 'Contract Drafting', 'Closing'],
    estimatedTime: '1-4 Months',
    cost: 'From $2,500'
  },
  'accident-claims': {
    title: 'Accident Claims',
    description: 'Personal injury and accident compensation',
    icon: Car,
    requiredDocs: ['Accident Report', 'Medical Records', 'Insurance Details', 'Witness Info'],
    process: ['Incident Analysis', 'Evidence Collection', 'Insurance Claim', 'Negotiation', 'Settlement'],
    estimatedTime: '2-8 Weeks',
    cost: 'From $300'
  },
  'medical-law': {
    title: 'Medical Malpractice',
    description: 'Healthcare disputes and medical negligence claims',
    icon: Stethoscope,
    requiredDocs: ['Medical Records', 'Hospital Bills', 'Expert Reports', 'Consent Forms'],
    process: ['Case Review', 'Expert Consultation', 'Evidence Gathering', 'Claim Filing', 'Trial/Settlement'],
    estimatedTime: '3-12 Months',
    cost: 'From $800'
  },
  'tax-law': {
    title: 'Tax Law',
    description: 'Tax planning, disputes and regulatory compliance',
    icon: Landmark,
    requiredDocs: ['Tax Returns', 'Financial Statements', 'Business Records', 'Correspondence'],
    process: ['Tax Review', 'Compliance Check', 'Strategy Development', 'Filing/Appeals', 'Resolution'],
    estimatedTime: '2-6 Weeks',
    cost: 'From $400'
  },
  'cyber-law': {
    title: 'Cyber Law',
    description: 'Digital rights, data protection and online disputes',
    icon: Shield,
    requiredDocs: ['Digital Evidence', 'Screenshots', 'Communication Records', 'ID Proof'],
    process: ['Incident Analysis', 'Evidence Preservation', 'Legal Notice', 'Filing', 'Resolution'],
    estimatedTime: '1-3 Months',
    cost: 'From $450'
  }
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const service = SERVICES_DATA[serviceId] || {
    title: 'Legal Service',
    description: 'Professional legal assistance for your needs',
    icon: Scale,
    requiredDocs: ['ID Proof', 'Relevant Documents', 'Case Details'],
    process: ['Consultation', 'Documentation', 'Filing', 'Resolution'],
    estimatedTime: '2-4 Weeks',
    cost: 'From $250'
  };

  const ServiceIcon = service.icon;

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
                <ServiceIcon size={28} className="sm:w-8 sm:h-8" />
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
                  <p className="text-xs sm:text-sm font-bold text-white">{service.estimatedTime}</p>
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
              {service.process.map((step: string, idx: number) => (
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
                <span className="font-bold text-white">{service.cost}</span>
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
              {service.requiredDocs.map((doc: string, idx: number) => (
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
