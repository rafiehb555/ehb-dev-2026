import { 
  Scale, Users, Briefcase, ShieldAlert, Plane, FileText, 
  Gavel, Home, Cpu, Globe, Smartphone, MessageSquare,
  CheckCircle2, MapPin, Newspaper, ChevronRight, ArrowRight,
  Shield, ShieldCheck, Zap, Crown, Building2, Map, Landmark,
  BarChart3, UserCheck, Settings, AlertCircle, Heart, Quote,
  LayoutDashboard, Star, DollarSign
} from 'lucide-react';

export const HERO_CARDS = [
  { title: "AI Legal Marketplace", description: "Find verified lawyers worldwide and solve legal problems faster.", icon: Globe, buttonText: "Start Legal Consultation", navigateTo: "/marketplace" },
  { title: "Ask AI Legal Assistant", description: "Ask legal questions and get instant guidance.", icon: Cpu, buttonText: "Ask AI", navigateTo: "/ai-assistant" },
  { title: "Find Verified Lawyer", description: "AI matches the best lawyer for your legal case.", icon: UserCheck, buttonText: "Find Lawyer", navigateTo: "/marketplace" },
];

export const POPULAR_SERVICES = [
  { title: "Marriage Registration", description: "Legal marriage registration.", icon: Heart, cost: "From $100", estimatedTime: "1-2 Weeks", requiredDocs: ["Nikah Nama", "CNIC of Bride & Groom"] },
  { title: "Court Marriage", description: "Legal marriage performed in court.", icon: Landmark, cost: "From $200", estimatedTime: "1-2 Days", requiredDocs: ["CNIC/Passport", "Affidavit", "Witnesses"] },
  { title: "Divorce Case", description: "Legal support for dissolution of marriage.", icon: Users, cost: "From $500", estimatedTime: "3-6 Months", requiredDocs: ["Nikah Nama", "ID Proof", "Financial Statements"] },
  { title: "Khula Case", description: "Marriage dissolution initiated by wife.", icon: Heart, cost: "From $400", estimatedTime: "2-4 Months", requiredDocs: ["Nikah Nama", "ID Proof", "Grounds for Khula"] },
  { title: "Child Custody", description: "Resolve child custody disputes.", icon: Users, cost: "From $800", estimatedTime: "6-12 Months", requiredDocs: ["Birth Certificates", "Parental CNICs", "Evidence"] },
  { title: "Child Maintenance", description: "Secure financial support for children.", icon: DollarSign, cost: "From $300", estimatedTime: "2-4 Months", requiredDocs: ["Birth Certificates", "Income Proof"] },
  { title: "Property Disputes", description: "Land and real estate conflicts.", icon: Home, cost: "From $1,000", estimatedTime: "6-12 Months", requiredDocs: ["Property Deed", "Tax Receipts", "Dispute Evidence"] },
  { title: "Immigration Help", description: "Global visa and residency help.", icon: Plane, cost: "From $800", estimatedTime: "2-4 Months", requiredDocs: ["Passport", "Work/Study Offer", "Bank Statements"] },
];

export const CATEGORIES = [
  "Civil Law", "Criminal Law", "Family Law", "Business Law", "Property Law", 
  "Immigration Law", "Tax Law", "Technology Law", "International Law", "Human Rights Law"
];

export const STL_LEVELS = [
  { level: "Free Level", description: "Open category service provider.", color: "#94a3b8", icon: ShieldAlert },
  { level: "Basic Level", description: "Identity verified provider.", color: "#3b82f6", icon: ShieldCheck },
  { level: "Normal Level", description: "Skill tested provider.", color: "#10b981", icon: Zap },
  { level: "High Level", description: "Expert verified professional.", color: "#8b5cf6", icon: Shield },
  { level: "VIP Level", description: "Top trusted verified expert.", color: "#f59e0b", icon: Crown },
];

export const LAWYERS = [
  { name: "Ahmed Khan", specialization: "Criminal Lawyer", experience: "10Y", rating: 4.9, photo: "https://i.pravatar.cc/150?u=ahmed", successRate: "98%", stlLevel: "VIP" },
  { name: "Sara Malik", specialization: "Family Lawyer", experience: "8Y", rating: 4.8, photo: "https://i.pravatar.cc/150?u=sara", successRate: "96%", stlLevel: "HIGH" },
  { name: "Ali Raza", specialization: "Corporate Lawyer", experience: "12Y", rating: 5.0, photo: "https://i.pravatar.cc/150?u=ali", successRate: "99%", stlLevel: "VIP" },
  { name: "Fatima Noor", specialization: "Immigration Lawyer", experience: "7Y", rating: 4.7, photo: "https://i.pravatar.cc/150?u=fatima", successRate: "94%", stlLevel: "NORMAL" },
  { name: "Usman Tariq", specialization: "Property Lawyer", experience: "15Y", rating: 4.9, photo: "https://i.pravatar.cc/150?u=usman", successRate: "97%", stlLevel: "HIGH" },
  { name: "Hamza Sheikh", specialization: "Tax Lawyer", experience: "9Y", rating: 4.8, photo: "https://i.pravatar.cc/150?u=hamza", successRate: "95%", stlLevel: "NORMAL" },
];

export const DOCUMENT_SERVICES = [
  { title: "Contract Drafting", description: "Custom legal contracts.", icon: FileText, isDoc: true },
  { title: "Legal Notice", description: "Formal legal warnings.", icon: Newspaper, isDoc: true },
  { title: "Affidavit Creation", description: "Sworn legal statements.", icon: Scale, isDoc: true },
  { title: "Power of Attorney", description: "Legal representation rights.", icon: UserCheck, isDoc: true },
  { title: "Rental Agreement", description: "Property lease documents.", icon: Home, isDoc: true },
  { title: "Employment Contract", description: "Hiring and labor agreements.", icon: Briefcase, isDoc: true },
];

export const FRANCHISE_NETWORK = [
  { title: "Global Master Franchise", description: "International franchise lead.", icon: Globe },
  { title: "Country Franchise", description: "National legal network lead.", icon: Globe },
  { title: "Regional Franchise", description: "Multi-city legal operations.", icon: Map },
  { title: "City Franchise", description: "Manage lawyers in your city.", icon: Building2 },
  { title: "Legal Office Franchise", description: "Open your own EHB office.", icon: Landmark },
  { title: "Consultation Center", description: "Local legal help desk.", icon: MessageSquare },
  { title: "Document Verification Center", description: "Document & lawyer vetting.", icon: ShieldCheck },
];

export const AI_ASSISTANT_CARDS = [
  { title: "Ask AI Legal Questions", description: "Get instant answers to complex legal queries.", icon: Cpu, href: "/ai-assistant" },
  { title: "AI Case Analyzer", description: "Upload documents for deep legal analysis.", icon: BarChart3, href: "/ai-assistant" },
  { title: "AI Lawyer Matching", description: "Find the perfect lawyer for your specific case.", icon: UserCheck, href: "/marketplace" },
  { title: "AI Legal Document Generator", description: "Draft contracts and notices in seconds.", icon: FileText, href: "/ai-assistant" },
];

export const HOW_IT_WORKS = [
  { step: "Step 1", title: "Describe your legal issue", description: "Tell us what happened or what you need help with." },
  { step: "Step 2", title: "AI matches best lawyer", description: "Our AI finds the top-rated expert for your specific case." },
  { step: "Step 3", title: "Start consultation", description: "Connect with your lawyer via chat, call, or in-person." },
  { step: "Step 4", title: "Track case progress", description: "Monitor your case status and documents in real-time." },
];

export const TESTIMONIALS = [
  { name: "Ali Khan", feedback: "Property dispute solved in 2 weeks. Amazing service!", rating: 5 },
  { name: "Sarah Ahmed", feedback: "The AI assistant gave me the clarity I needed for my divorce case.", rating: 5 },
  { name: "John Doe", feedback: "Verified lawyers you can actually trust. Highly recommended.", rating: 4 },
];

export const GLOBAL_COVERAGE = [
  { country: "Pakistan", description: "Full legal coverage across all major cities.", icon: Globe },
  { country: "UAE", description: "Expert legal support in Dubai, Abu Dhabi & more.", icon: Globe },
  { country: "UK", description: "London-based solicitors and legal experts.", icon: Globe },
  { country: "USA", description: "State-specific legal guidance and representation.", icon: Globe },
];

export const ARTICLES = [
  { title: "New Crypto Law Guide", summary: "Digital asset regulations in 2026.", date: "Mar 10, 2026", content: "Cryptocurrency and digital asset regulations have evolved significantly in 2026..." },
  { title: "Divorce Process Guide", summary: "Step-by-step family law guide.", date: "Mar 08, 2026", content: "Navigating through divorce can be challenging. This guide provides a comprehensive overview..." },
  { title: "Property Law Guide", summary: "Land dispute resolution tips.", date: "Mar 05, 2026", content: "Property disputes can be complex and emotionally draining..." },
  { title: "Business Compliance Guide", summary: "Essential tips for startups in 2026.", date: "Mar 01, 2026", content: "Starting a business requires understanding various legal compliance requirements..." },
];
