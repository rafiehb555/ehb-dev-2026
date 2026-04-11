import { 
  Scale, Gavel, Users, Briefcase, Home, Plane, Landmark, Cpu, Globe, 
  Shield, ShieldAlert, FileText, Newspaper, Heart, Leaf, Landmark as BankIcon 
} from 'lucide-react';

export const LAW_CATEGORIES = [
  { id: 'civil', name: 'Civil Law', icon: Scale },
  { id: 'criminal', name: 'Criminal Law', icon: Gavel },
  { id: 'family', name: 'Family Law', icon: Users },
  { id: 'business', name: 'Business Law', icon: Briefcase },
  { id: 'property', name: 'Property Law', icon: Home },
  { id: 'immigration', name: 'Immigration Law', icon: Plane },
  { id: 'tax', name: 'Tax Law', icon: Landmark },
  { id: 'tech', name: 'Technology Law', icon: Cpu },
  { id: 'ip', name: 'Intellectual Property', icon: Shield },
  { id: 'international', name: 'International Law', icon: Globe },
  { id: 'human-rights', name: 'Human Rights Law', icon: Heart },
  { id: 'environmental', name: 'Environmental Law', icon: Leaf },
  { id: 'banking', name: 'Banking & Finance', icon: BankIcon },
];

export const ALL_SERVICES = {
  civil: [
    { title: 'Contract Disputes', description: 'Resolve disputes related to contracts.' },
    { title: 'Debt Recovery', description: 'Recover unpaid debts legally.' },
    { title: 'Consumer Protection Cases', description: 'Protect consumers against fraud.' },
    { title: 'Defamation Cases', description: 'Legal help for reputation damage.' },
    { title: 'Personal Injury Claims', description: 'Compensation for accidents.' },
    { title: 'Insurance Claims', description: 'Legal support for insurance disputes.' },
  ],
  criminal: [
    { title: 'Criminal Defense Lawyer', description: 'Professional defense for criminal cases.' },
    { title: 'Bail Application', description: 'Apply for bail in criminal cases.' },
    { title: 'FIR Legal Assistance', description: 'Help with police complaints.' },
    { title: 'Fraud Defense', description: 'Defense in financial crime cases.' },
    { title: 'Cyber Crime Defense', description: 'Legal help for online crimes.' },
  ],
  family: [
    { 
      title: 'Marriage Registration', 
      description: 'Legal registration of marriage with government authorities.',
      requiredDocs: ['Nikah Nama (Original)', 'CNIC of Bride & Groom', 'CNIC of Witnesses', 'Photos'],
      process: ['Document Verification', 'Application Filing', 'NADRA Registration', 'Certificate Issuance'],
      estimatedTime: '1-2 Weeks',
      cost: 'From $100'
    },
    { 
      title: 'Court Marriage', 
      description: 'Legal marriage performed in court before a magistrate.',
      requiredDocs: ['CNIC/Passport', 'Affidavit of Free Will', 'Witnesses', 'Photos'],
      process: ['Legal Consultation', 'Affidavit Preparation', 'Court Appearance', 'Nikah Performance', 'Registration'],
      estimatedTime: '1-2 Days',
      cost: 'From $200'
    },
    { 
      title: 'Divorce (Talaq) Case', 
      description: 'Legal process for dissolution of marriage by the husband.',
      requiredDocs: ['Nikah Nama', 'CNIC of Husband', 'Divorce Notice', 'Children Birth Certificates (if any)'],
      process: ['Notice to Arbitration Council', 'Reconciliation Attempts', '90-day Waiting Period', 'Divorce Certificate'],
      estimatedTime: '3-4 Months',
      cost: 'From $500'
    },
    { 
      title: 'Khula Case', 
      description: 'Dissolution of marriage initiated by the wife through court.',
      requiredDocs: ['Nikah Nama', 'CNIC of Wife', 'Grounds for Khula', 'Evidence (if any)'],
      process: ['Filing Suit in Family Court', 'Summoning Husband', 'Reconciliation Attempt', 'Decree by Court'],
      estimatedTime: '2-4 Months',
      cost: 'From $400'
    },
    { 
      title: 'Child Custody Case', 
      description: 'Legal proceedings to determine the guardian of the child.',
      requiredDocs: ['Birth Certificates', 'Parental CNICs', 'Evidence of Welfare', 'School Records'],
      process: ['Filing Guardian Petition', 'Interim Custody Hearing', 'Evidence Recording', 'Final Judgment'],
      estimatedTime: '6-12 Months',
      cost: 'From $800'
    },
    { 
      title: 'Child Maintenance Case', 
      description: 'Legal action to secure financial support for children.',
      requiredDocs: ['Birth Certificates', 'Father Income Proof', 'Expense List', 'School Fee Slips'],
      process: ['Filing Maintenance Suit', 'Interim Maintenance Order', 'Final Decree'],
      estimatedTime: '2-4 Months',
      cost: 'From $300'
    },
  ],
  property: [
    { title: 'Property Verification', description: 'Verify property ownership.' },
    { title: 'Land Dispute Cases', description: 'Resolve land disputes.' },
    { title: 'Property Transfer', description: 'Legal support for ownership transfer.' },
    { title: 'Lease Agreement', description: 'Rental agreements and contracts.' },
    { title: 'Construction Disputes', description: 'Legal help for building conflicts.' },
  ],
  business: [
    { title: 'Company Registration', description: 'Register a new company.' },
    { title: 'Corporate Compliance', description: 'Ensure business follows laws.' },
    { title: 'Business Contract Drafting', description: 'Create business contracts.' },
    { title: 'Shareholder Agreements', description: 'Legal agreements for shareholders.' },
    { title: 'Business Dispute Resolution', description: 'Resolve business conflicts.' },
  ],
  immigration: [
    { title: 'Visa Application Assistance', description: 'Help with visa process.' },
    { title: 'Immigration Appeals', description: 'Appeal rejected visas.' },
    { title: 'Work Permit Applications', description: 'Apply for work permits.' },
    { title: 'Citizenship Applications', description: 'Legal help for citizenship.' },
    { title: 'Refugee Cases', description: 'Legal support for refugees.' },
  ],
  tax: [
    { title: 'Tax Consultation', description: 'Professional tax advice.' },
    { title: 'Tax Dispute Resolution', description: 'Resolve tax conflicts.' },
    { title: 'Tax Planning', description: 'Optimize tax payments.' },
    { title: 'Corporate Tax Compliance', description: 'Business tax compliance.' },
    { title: 'VAT / GST Advisory', description: 'Sales tax guidance.' },
  ],
};
