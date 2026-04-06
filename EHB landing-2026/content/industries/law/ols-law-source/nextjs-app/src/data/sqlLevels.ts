import { Shield, ShieldCheck, CheckCircle2, Star, Award } from 'lucide-react';

export enum SQLLevel {
  FREE = 'Free',
  BASIC = 'Basic',
  NORMAL = 'Normal',
  HIGH = 'High',
  VIP = 'VIP'
}

export interface SQLRequirement {
  id: string;
  label: string;
  department: 'PSS' | 'EDR' | 'EMO';
  isCompleted: boolean;
}

export interface SQLLevelInfo {
  level: SQLLevel;
  rank: number;
  description: string;
  icon: any;
  color: string;
  benefits: string[];
  requirements: SQLRequirement[];
}

export const SQL_LEVELS: Record<SQLLevel, SQLLevelInfo> = {
  [SQLLevel.FREE]: {
    level: SQLLevel.FREE,
    rank: 1,
    description: "Open category for new users. No verification required.",
    icon: Shield,
    color: "text-zinc-400",
    benefits: ["Entry level listing"],
    requirements: []
  },
  [SQLLevel.BASIC]: {
    level: SQLLevel.BASIC,
    rank: 2,
    description: "Identity and license verified by PSS department.",
    icon: ShieldCheck,
    color: "text-blue-500",
    benefits: ["Verified badge", "Higher trust level", "More client visibility"],
    requirements: [
      { id: 'pss-id', label: 'Identity Verification', department: 'PSS', isCompleted: true },
      { id: 'pss-license', label: 'License Verification', department: 'PSS', isCompleted: true },
      { id: 'pss-contact', label: 'Contact Verification', department: 'PSS', isCompleted: true }
    ]
  },
  [SQLLevel.NORMAL]: {
    level: SQLLevel.NORMAL,
    rank: 3,
    description: "Professional skills verified by EDR department through testing.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    benefits: ["Higher ranking in search", "Access to more cases", "Skill verified badge"],
    requirements: [
      { id: 'edr-knowledge', label: 'Professional Knowledge Test', department: 'EDR', isCompleted: false },
      { id: 'edr-scenario', label: 'Case Scenario Test', department: 'EDR', isCompleted: false },
      { id: 'edr-drafting', label: 'Document Drafting Test', department: 'EDR', isCompleted: false }
    ]
  },
  [SQLLevel.HIGH]: {
    level: SQLLevel.HIGH,
    rank: 4,
    description: "Advanced professional testing and high performance review.",
    icon: Award,
    color: "text-blue-600",
    benefits: ["Priority listing", "Premium clients", "Performance badge"],
    requirements: [
      { id: 'emo-experience', label: 'Minimum Experience Check', department: 'EMO', isCompleted: false },
      { id: 'emo-rating', label: 'High Client Rating (4.5+)', department: 'EMO', isCompleted: false },
      { id: 'emo-performance', label: 'Case Performance Review', department: 'EMO', isCompleted: false }
    ]
  },
  [SQLLevel.VIP]: {
    level: SQLLevel.VIP,
    rank: 5,
    description: "Highest trust level for top-tier trusted professionals.",
    icon: Star,
    color: "text-yellow-500",
    benefits: ["Top ranking in marketplace", "Global client access", "VIP badge", "Exclusive cases"],
    requirements: [
      { id: 'emo-expert', label: 'Expert Level Experience', department: 'EMO', isCompleted: false },
      { id: 'emo-reputation', label: 'Excellent Reputation Audit', department: 'EMO', isCompleted: false },
      { id: 'emo-success', label: 'Verified Case Success Rate', department: 'EMO', isCompleted: false }
    ]
  }
};
