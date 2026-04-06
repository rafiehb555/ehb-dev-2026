'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Star, ShieldCheck, Database, Gavel, Users, Briefcase, 
  Plane, Home, Landmark, Scale, X 
} from 'lucide-react';

interface LawyerCardProps {
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  photo: string;
  successRate: string;
  sqlLevel: string;
  onBookConsultation?: () => void;
}

const getSpecializationIcon = (specialization: string) => {
  const spec = specialization.toLowerCase();
  if (spec.includes('criminal')) return Gavel;
  if (spec.includes('family')) return Users;
  if (spec.includes('corporate') || spec.includes('business')) return Briefcase;
  if (spec.includes('immigration')) return Plane;
  if (spec.includes('property')) return Home;
  if (spec.includes('tax')) return Landmark;
  return Scale;
};

export default function LawyerCard({ 
  name, specialization, experience, rating, photo, 
  successRate, sqlLevel, onBookConsultation 
}: LawyerCardProps) {
  const SpecIcon = getSpecializationIcon(specialization);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="ms-card p-3 min-w-[220px] sm:min-w-[240px] flex flex-col gap-3 group cursor-pointer hover:border-brand-primary/50 transition-all">
        <div className="flex gap-3">
          <img 
            src={photo} 
            alt={name} 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-brand-primary/20 group-hover:border-brand-primary transition-colors"
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs sm:text-sm text-white truncate">{name}</h4>
              <div className="flex items-center gap-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-full shadow-sm shadow-emerald-500/20 flex-shrink-0">
                <ShieldCheck size={10} className="fill-white/20" />
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider">Verified</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <SpecIcon size={10} />
              <p className="text-[9px] sm:text-[10px] leading-tight truncate">{specialization}</p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-300">{rating}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 py-2 border-y border-slate-800 bg-slate-900/50 rounded-lg">
          <div className="text-center border-r border-slate-800">
            <p className="text-[6px] sm:text-[7px] uppercase tracking-widest text-slate-500 font-black">Experience</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-300">{experience}</p>
          </div>
          <div className="text-center border-r border-slate-800">
            <p className="text-[6px] sm:text-[7px] uppercase tracking-widest text-slate-500 font-black">Success</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-emerald-500">{successRate}</p>
          </div>
          <div className="text-center">
            <p className="text-[6px] sm:text-[7px] uppercase tracking-widest text-slate-500 font-black">SQL Level</p>
            <div className="flex items-center justify-center gap-1">
              <Database size={10} className="text-brand-primary" />
              <p className="text-[9px] sm:text-[10px] font-bold text-brand-primary">{sqlLevel}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowProfile(true)}
            className="flex-1 py-1.5 bg-slate-800 rounded-md text-[9px] sm:text-[10px] font-bold hover:bg-slate-700 transition-all text-slate-300"
          >
            View Profile
          </button>
          <button 
            onClick={onBookConsultation}
            className="flex-1 py-1.5 bg-brand-primary rounded-md text-[9px] sm:text-[10px] font-bold hover:bg-brand-primary/90 transition-all text-white"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={photo} 
                alt={name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-brand-primary/30"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{name}</h2>
                <p className="text-xs sm:text-sm text-slate-400">{specialization}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs sm:text-sm font-bold text-white">{rating}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs sm:text-sm text-emerald-500 font-bold">{successRate} Success</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-xl">
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold">Experience</p>
                <p className="text-base sm:text-lg font-bold text-white">{experience}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-xl">
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold">SQL Level</p>
                <p className="text-base sm:text-lg font-bold text-brand-primary">{sqlLevel}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-xl">
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cases</p>
                <p className="text-base sm:text-lg font-bold text-white">150+</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-6">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">About</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experienced {specialization.toLowerCase()} with {experience} of practice. 
                Specializes in complex cases with a proven track record of {successRate} success rate.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowProfile(false)}
                className="flex-1 py-2.5 sm:py-3 bg-slate-800 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-700 transition-all text-slate-300"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  onBookConsultation?.();
                }}
                className="flex-1 py-2.5 sm:py-3 bg-brand-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-brand-primary/90 transition-all text-white"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
