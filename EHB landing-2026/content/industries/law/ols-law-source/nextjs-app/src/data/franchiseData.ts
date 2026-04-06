export enum FranchiseLevel {
  GLOBAL = 'Global Master',
  COUNTRY = 'Country',
  STATE = 'State/Province',
  CITY = 'City',
  OFFICE = 'Local Office'
}

export interface FranchiseStats {
  totalLawyers: number;
  activeCases: number;
  totalRevenue: number;
  commissionEarned: number;
  successRate: number;
}

export interface FranchiseInfo {
  id: string;
  name: string;
  level: FranchiseLevel;
  region: string;
  manager: string;
  stats: FranchiseStats;
  parentFranchiseId?: string;
}

export const MOCK_FRANCHISES: FranchiseInfo[] = [
  {
    id: 'global-1',
    name: 'EHB Global Master',
    level: FranchiseLevel.GLOBAL,
    region: 'Worldwide',
    manager: 'Sarah Jenkins',
    stats: {
      totalLawyers: 1250,
      activeCases: 4500,
      totalRevenue: 2500000,
      commissionEarned: 250000,
      successRate: 94
    }
  },
  {
    id: 'pakistan-1',
    name: 'EHB Pakistan',
    level: FranchiseLevel.COUNTRY,
    region: 'Pakistan',
    manager: 'Zubair Ahmed',
    parentFranchiseId: 'global-1',
    stats: {
      totalLawyers: 320,
      activeCases: 1200,
      totalRevenue: 450000,
      commissionEarned: 45000,
      successRate: 92
    }
  },
  {
    id: 'punjab-1',
    name: 'EHB Punjab',
    level: FranchiseLevel.STATE,
    region: 'Punjab, PK',
    manager: 'Fatima Ali',
    parentFranchiseId: 'pakistan-1',
    stats: {
      totalLawyers: 145,
      activeCases: 580,
      totalRevenue: 180000,
      commissionEarned: 18000,
      successRate: 91
    }
  },
  {
    id: 'lahore-1',
    name: 'EHB Lahore',
    level: FranchiseLevel.CITY,
    region: 'Lahore, PK',
    manager: 'Usman Malik',
    parentFranchiseId: 'punjab-1',
    stats: {
      totalLawyers: 68,
      activeCases: 240,
      totalRevenue: 85000,
      commissionEarned: 8500,
      successRate: 93
    }
  }
];

export const PENDING_LAWYERS = [
  { id: 'l1', name: 'Zainab Qureshi', specialization: 'Criminal Law', experience: '8 years', appliedDate: '2026-03-08' },
  { id: 'l2', name: 'Bilal Ahmed', specialization: 'Business Law', experience: '15 years', appliedDate: '2026-03-09' },
  { id: 'l3', name: 'Hamza Sheikh', specialization: 'Cyber Law', experience: '5 years', appliedDate: '2026-03-10' },
];

export const SERVICE_REQUESTS = [
  { id: 'sr1', user: 'Ali Raza', request: 'I need legal service for AI copyright issues.', status: 'Pending' },
  { id: 'sr2', user: 'Sana Khan', request: 'Legal advice for Drone registration in urban areas.', status: 'Pending' },
];

export const RECENT_CASES = [
  { id: 'c1', title: 'Property Dispute - DHA Phase 6', status: 'Active', lawyer: 'Ahmed Khan', revenue: 1200 },
  { id: 'c2', title: 'Corporate Merger - TechFlow', status: 'Completed', lawyer: 'Sara Malik', revenue: 5000 },
  { id: 'c3', title: 'Labor Dispute - Textile Mill', status: 'Dispute', lawyer: 'Zaid Ali', revenue: 800 },
];
