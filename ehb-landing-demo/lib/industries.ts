/**
 * EHB 32 Industries – Global Architecture Config
 * Same UI, content-driven. Used by Top Bar, Universal Landing, Industry Home.
 * accent = legacy group (red/blue/green/orange). accentColor = unique hex per industry (Phase 1).
 */

export type IndustryAccent = "red" | "blue" | "green" | "orange";

export interface Industry {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  heroTitle: string;
  overview: string;
  services: string[];
  accent: IndustryAccent;
  accentColor: string;
  icon: string;
  /** Optional: hero subtitle (else use overview) */
  heroSubtitle?: string;
  /** Optional: primary CTA label (else "Explore {name}") */
  heroPrimaryButton?: string;
  /** Optional: secondary CTA label (else "Join as Provider") */
  heroSecondaryButton?: string;
  /** Optional: Popular Services section cards (else from categories) */
  popularServices?: string[];
}

export const INDUSTRIES: Industry[] = [
  { id: 1, slug: "education", name: "Education", shortName: "Education", heroTitle: "Global Education Services Ecosystem", overview: "Schools, colleges, online courses, tutors, and training across the world.", services: ["Schools", "Colleges", "Universities", "Online Courses", "Tutors", "Training Institutes"], accent: "red", accentColor: "#E53935", icon: "GraduationCap", heroSubtitle: "Connecting students, teachers, institutions, and learning platforms worldwide.", heroPrimaryButton: "Find Education Services", heroSecondaryButton: "Become an Instructor", popularServices: ["Math Tutor", "Programming Course", "IELTS Preparation", "Online English Classes"] },
  { id: 2, slug: "health", name: "Health", shortName: "Health", heroTitle: "Global Health Service Marketplace", overview: "Doctors, hospitals, pharmacies, labs, and telemedicine on one platform.", services: ["Doctors", "Hospitals", "Clinics", "Pharmacies", "Diagnostic Labs", "Ambulance"], accent: "blue", accentColor: "#00AEEF", icon: "HeartPulse", heroSubtitle: "Find doctors, hospitals, pharmacies, and medical services near you.", heroPrimaryButton: "Find Doctors", heroSecondaryButton: "Book Appointment", popularServices: ["Doctor Consultation", "Blood Test", "X-Ray", "Online Doctor Appointment"] },
  { id: 3, slug: "law", name: "Law", shortName: "Law", heroTitle: "Legal Services Marketplace", overview: "Verified lawyers, firms, and legal services globally.", services: ["Legal Consultancy", "Court Representation", "Documentation", "Compliance", "IP & Patents"], accent: "red", accentColor: "#6B7280", icon: "Scale" },
  { id: 4, slug: "it", name: "IT & Software", shortName: "IT", heroTitle: "All-in-One IT Services Ecosystem", overview: "Development, cloud, and cybersecurity from verified providers.", services: ["Web Development", "Mobile Development", "UI UX Design", "Cybersecurity", "Cloud Services"], accent: "blue", accentColor: "#3B82F6", icon: "Code2", heroSubtitle: "Connect with developers, designers, and technology experts worldwide.", heroPrimaryButton: "Find Developers", heroSecondaryButton: "Hire Experts", popularServices: ["Website Development", "Mobile App Development", "UI UX Design", "AI Model Development"] },
  { id: 5, slug: "ai", name: "AI & Data", shortName: "AI", heroTitle: "AI & Data Services Marketplace", overview: "AI tools, data science, and ML solutions.", services: ["AI Tools", "Data Science", "ML Models", "Automation", "AI Consulting"], accent: "blue", accentColor: "#8B5CF6", icon: "Brain" },
  { id: 6, slug: "blockchain", name: "Blockchain & Web3", shortName: "Blockchain", heroTitle: "Blockchain & Web3 Marketplace", overview: "Smart contracts, DeFi, NFTs, and Web3 services.", services: ["Smart Contracts", "DeFi", "NFTs", "Tokenization", "Web3 Dev"], accent: "blue", accentColor: "#7C3AED", icon: "Link" },
  { id: 7, slug: "finance", name: "Finance & Banking", shortName: "Finance", heroTitle: "Finance & Banking Services", overview: "Banking, payments, and financial services.", services: ["Banking", "Payments", "Loans", "Investments", "Advisory"], accent: "orange", accentColor: "#F59E0B", icon: "TrendingUp" },
  { id: 8, slug: "insurance", name: "Insurance", shortName: "Insurance", heroTitle: "Insurance Services Marketplace", overview: "Insurance products and claims across industries.", services: ["Health Insurance", "Life", "Auto", "Property", "Claims"], accent: "green", accentColor: "#FBBF24", icon: "ShieldCheck" },
  { id: 9, slug: "real-estate", name: "Real Estate", shortName: "Real Estate", heroTitle: "Real Estate Marketplace", overview: "Buy, rent, and manage property globally.", services: ["Sales", "Rentals", "Property Management", "Valuation", "Legal"], accent: "green", accentColor: "#16A34A", icon: "Building2" },
  { id: 10, slug: "construction", name: "Construction", shortName: "Construction", heroTitle: "Construction & Contractors Marketplace", overview: "Builders, contractors, and construction services.", services: ["Contractors", "Architecture", "Materials", "Safety", "Inspection"], accent: "orange", accentColor: "#A16207", icon: "HardHat" },
  { id: 11, slug: "automotive", name: "Automotive", shortName: "Automotive", heroTitle: "Automotive Services Marketplace", overview: "Repair, sales, and mobility services.", services: ["Repair", "Sales", "Spare Parts", "Fleet", "EV Charging"], accent: "orange", accentColor: "#2563EB", icon: "Car" },
  { id: 12, slug: "agriculture", name: "Agriculture", shortName: "Agriculture", heroTitle: "Agriculture & Agri-Tech Marketplace", overview: "Farming, supply chain, and agri-services.", services: ["Farming", "Supply Chain", "Equipment", "Seeds", "Export"], accent: "green", accentColor: "#22C55E", icon: "Sprout" },
  { id: 13, slug: "manufacturing", name: "Manufacturing", shortName: "Manufacturing", heroTitle: "Manufacturing & Supply Chain", overview: "Production, OEM, and logistics.", services: ["OEM", "Assembly", "QC", "Logistics", "Sourcing"], accent: "green", accentColor: "#64748B", icon: "Factory" },
  { id: 14, slug: "logistics", name: "Logistics & Delivery", shortName: "Delivery", heroTitle: "Logistics & Delivery Marketplace", overview: "Delivery, freight, and last-mile services.", services: ["Delivery", "Freight", "Warehousing", "Last Mile", "Tracking"], accent: "orange", accentColor: "#FB923C", icon: "Truck" },
  { id: 15, slug: "travel", name: "Travel & Tourism", shortName: "Travel", heroTitle: "Travel & Tourism Marketplace", overview: "Flights, hotels, tours, and visas.", services: ["Flights", "Hotels", "Tours", "Visas", "Travel Insurance"], accent: "orange", accentColor: "#0EA5E9", icon: "Plane" },
  { id: 16, slug: "hospitality", name: "Hospitality", shortName: "Hospitality", heroTitle: "Hospitality Services Marketplace", overview: "Hotels, restaurants, and events.", services: ["Hotels", "Restaurants", "Catering", "Events", "Venues"], accent: "orange", accentColor: "#14B8A6", icon: "UtensilsCrossed" },
  { id: 17, slug: "beauty", name: "Beauty & Personal Care", shortName: "Beauty", heroTitle: "Beauty & Personal Care Marketplace", overview: "Salons, spas, and personal care.", services: ["Salons", "Spa", "Skincare", "Makeup", "Wellness"], accent: "orange", accentColor: "#EC4899", icon: "Sparkles" },
  { id: 18, slug: "fitness", name: "Fitness & Sports", shortName: "Fitness", heroTitle: "Fitness & Sports Marketplace", overview: "Gyms, trainers, and sports services.", services: ["Gyms", "Personal Trainers", "Sports", "Nutrition", "Rehab"], accent: "orange", accentColor: "#F43F5E", icon: "Dumbbell" },
  { id: 19, slug: "entertainment", name: "Entertainment & Media", shortName: "Media", heroTitle: "Entertainment & Media Marketplace", overview: "Content, events, and media production.", services: ["Content", "Events", "Production", "Streaming", "PR"], accent: "orange", accentColor: "#9333EA", icon: "Film" },
  { id: 20, slug: "gaming", name: "Gaming & Esports", shortName: "Gaming", heroTitle: "Gaming & Esports Marketplace", overview: "Games, esports, and gaming services.", services: ["Game Dev", "Esports", "Streaming", "Tournaments", "Merch"], accent: "orange", accentColor: "#6366F1", icon: "Gamepad2" },
  { id: 21, slug: "marketing", name: "Marketing & Advertising", shortName: "Marketing", heroTitle: "Marketing & Advertising Marketplace", overview: "Digital marketing, ads, and branding.", services: ["Digital Marketing", "SEO", "Ads", "Branding", "Analytics"], accent: "orange", accentColor: "#F97316", icon: "Megaphone" },
  { id: 22, slug: "consulting", name: "Consulting & Business Services", shortName: "Consulting", heroTitle: "Consulting & Business Services", overview: "Strategy, operations, and business advisory.", services: ["Strategy", "Operations", "Advisory", "Audit", "Outsourcing"], accent: "green", accentColor: "#3B82F6", icon: "Briefcase" },
  { id: 23, slug: "hr", name: "HR & Recruitment", shortName: "HR", heroTitle: "HR & Recruitment Marketplace", overview: "Hiring, payroll, and HR solutions.", services: ["Recruitment", "Payroll", "Training", "HR Tech", "Outplacement"], accent: "green", accentColor: "#22C55E", icon: "Users" },
  { id: 24, slug: "freelancing", name: "Freelancing & Remote Work", shortName: "Freelancing", heroTitle: "Freelancing & Remote Work Marketplace", overview: "Freelancers and remote teams.", services: ["Freelancers", "Remote Teams", "Projects", "JPS Profiles", "Contracts"], accent: "orange", accentColor: "#06B6D4", icon: "Laptop" },
  { id: 25, slug: "security", name: "Security Services", shortName: "Security", heroTitle: "Security Services Marketplace", overview: "Physical and cyber security.", services: ["Guarding", "Surveillance", "Cyber Security", "PSS Verification", "Risk"], accent: "blue", accentColor: "#EF4444", icon: "Shield" },
  { id: 26, slug: "telecom", name: "Telecommunications", shortName: "Telecom", heroTitle: "Telecom Services Marketplace", overview: "Connectivity and telecom solutions.", services: ["Mobile", "Broadband", "IoT", "Enterprise", "Support"], accent: "blue", accentColor: "#0EA5E9", icon: "Radio" },
  { id: 27, slug: "energy", name: "Energy & Utilities", shortName: "Energy", heroTitle: "Energy & Utilities Marketplace", overview: "Power, renewables, and utilities.", services: ["Power", "Renewables", "Meters", "EV", "Billing"], accent: "orange", accentColor: "#EAB308", icon: "Zap" },
  { id: 28, slug: "environment", name: "Environment & Sustainability", shortName: "Environment", heroTitle: "Environment & Sustainability", overview: "Green services and sustainability.", services: ["Waste", "Recycling", "Carbon", "Audit", "Consulting"], accent: "green", accentColor: "#10B981", icon: "Leaf" },
  { id: 29, slug: "research", name: "Research & Development", shortName: "Research", heroTitle: "Research & Development Marketplace", overview: "R&D, labs, and innovation.", services: ["R&D", "Labs", "Patents", "Trials", "Innovation"], accent: "blue", accentColor: "#6366F1", icon: "FlaskConical" },
  { id: 30, slug: "retail", name: "Retail & E-Commerce", shortName: "E-commerce", heroTitle: "Retail & E-Commerce Marketplace", overview: "GoSellr, stores, and online retail.", services: ["GoSellr", "Stores", "D2C", "Inventory", "Payments"], accent: "orange", accentColor: "#F59E0B", icon: "ShoppingCart" },
  { id: 31, slug: "ngo", name: "NGOs & Social Services", shortName: "NGO", heroTitle: "NGOs & Social Services", overview: "Non-profits and social impact.", services: ["NGOs", "Donations", "Volunteers", "Impact", "Grants"], accent: "red", accentColor: "#22C55E", icon: "HeartHandshake" },
  { id: 32, slug: "government", name: "Government & Public Services", shortName: "Government", heroTitle: "Government & Public Services", overview: "Civic and public sector services.", services: ["Civic", "Licenses", "Permits", "Compliance", "E-Governance"], accent: "red", accentColor: "#475569", icon: "Building" },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug.toLowerCase());
}

export function getAllSlugs(): string[] {
  return INDUSTRIES.map((i) => i.slug);
}
