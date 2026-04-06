export interface LegalGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
  steps: { title: string; content: string }[];
  lastUpdated: string;
}

export interface LegalArticle {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  views: number;
}

export interface CountryLaw {
  id: string;
  country: string;
  sections: {
    title: string;
    description: string;
    subsections: string[];
  }[];
}

export interface CaseExample {
  id: string;
  title: string;
  category: string;
  summary: string;
  outcome: string;
  lessons: string[];
}

export interface RegulationUpdate {
  id: string;
  title: string;
  country: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low';
  summary: string;
}

export const MOCK_GUIDES: LegalGuide[] = [
  {
    id: 'g1',
    title: 'Divorce Process Guide',
    description: 'A comprehensive step-by-step guide to the legal divorce process in Pakistan.',
    category: 'Family Law',
    country: 'Pakistan',
    lastUpdated: '2026-02-15',
    steps: [
      { title: 'Filing the Petition', content: 'The process begins with filing a formal petition in the Family Court.' },
      { title: 'Notice to Spouse', content: 'The court issues a notice to the other spouse to appear and respond.' },
      { title: 'Reconciliation Attempt', content: 'The court mandates a reconciliation session between the parties.' },
      { title: 'Evidence & Arguments', content: 'Both parties present their evidence and legal arguments.' },
      { title: 'Final Decree', content: 'The court issues the final divorce decree if reconciliation fails.' }
    ]
  },
  {
    id: 'g2',
    title: 'Company Registration Guide',
    description: 'How to register a private limited company with SECP in Pakistan.',
    category: 'Business Law',
    country: 'Pakistan',
    lastUpdated: '2026-03-01',
    steps: [
      { title: 'Name Reservation', content: 'Apply for name availability on the SECP portal.' },
      { title: 'Documentation', content: 'Prepare Memorandum and Articles of Association.' },
      { title: 'Fee Payment', content: 'Pay the registration fee based on authorized capital.' },
      { title: 'Digital Signature', content: 'Obtain digital signatures for directors.' },
      { title: 'Certificate of Incorporation', content: 'Receive the final certificate from SECP.' }
    ]
  }
];

export const MOCK_ARTICLES: LegalArticle[] = [
  {
    id: 'a1',
    title: 'New Crypto Regulations in 2026',
    author: 'Adv. Zaid Ali',
    authorRole: 'Fintech Expert',
    date: '2026-03-10',
    summary: 'An analysis of the latest digital asset framework and its impact on local exchanges.',
    content: 'The 2026 framework introduces mandatory licensing for all digital asset service providers...',
    category: 'Technology Law',
    views: 1205
  },
  {
    id: 'a2',
    title: 'AI Copyright Audit: What You Need to Know',
    author: 'Maria Garcia',
    authorRole: 'IP Specialist',
    date: '2026-03-08',
    summary: 'Understanding the legal landscape of AI-generated content and intellectual property.',
    content: 'As AI models become more sophisticated, the question of who owns the output becomes critical...',
    category: 'Intellectual Property',
    views: 840
  }
];

export const MOCK_COUNTRY_LAWS: CountryLaw[] = [
  {
    id: 'cl1',
    country: 'Pakistan',
    sections: [
      { 
        title: 'Civil Law', 
        description: 'Governs disputes between individuals and organizations.',
        subsections: ['Contract Act', 'Family Laws', 'Property Laws']
      },
      { 
        title: 'Criminal Law', 
        description: 'Deals with crimes and their punishments.',
        subsections: ['Pakistan Penal Code', 'Code of Criminal Procedure']
      },
      { 
        title: 'Business Law', 
        description: 'Regulations for trade and commerce.',
        subsections: ['Companies Act 2017', 'Partnership Act']
      }
    ]
  }
];

export const MOCK_CASE_EXAMPLES: CaseExample[] = [
  {
    id: 'ce1',
    title: 'Property Dispute: Landmark vs. Tenant',
    category: 'Property Law',
    summary: 'A dispute regarding the illegal eviction of a commercial tenant.',
    outcome: 'Court ruled in favor of the tenant, awarding damages for business loss.',
    lessons: ['Always have a registered lease agreement', 'Document all rent payments']
  }
];

export const MOCK_REGULATION_UPDATES: RegulationUpdate[] = [
  {
    id: 'ru1',
    title: 'New Tax Regulation for Freelancers',
    country: 'Pakistan',
    date: '2026-03-05',
    impact: 'High',
    summary: 'A 1% flat tax has been introduced for all IT-enabled services exports.'
  }
];
