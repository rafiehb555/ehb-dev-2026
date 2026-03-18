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
  { id: 1, slug: "education", name: "Education", shortName: "Education", heroTitle: "Global Education Services Ecosystem", overview: "Learn new skills or teach others and earn money online. Offer courses, tutoring, or educational services globally.", services: ["Schools", "Colleges", "Universities", "Online Courses", "Tutors", "Training Institutes"], accent: "red", accentColor: "#E53935", icon: "GraduationCap", heroSubtitle: "Connecting students, teachers, institutions, and learning platforms worldwide.", heroPrimaryButton: "Find Education Services", heroSecondaryButton: "Become an Instructor", popularServices: ["Math Tutor", "Programming Course", "IELTS Preparation", "Online English Classes"] },
  { id: 2, slug: "health", name: "Health", shortName: "Health", heroTitle: "Global Health Service Marketplace", overview: "Book doctors, offer medical services, or connect with patients. Provide consultations, treatments, and healthcare solutions.", services: ["Doctors", "Hospitals", "Clinics", "Pharmacies", "Diagnostic Labs", "Ambulance"], accent: "blue", accentColor: "#00AEEF", icon: "HeartPulse", heroSubtitle: "Find doctors, hospitals, pharmacies, and medical services near you.", heroPrimaryButton: "Find Doctors", heroSecondaryButton: "Book Appointment", popularServices: ["Doctor Consultation", "Blood Test", "X-Ray", "Online Doctor Appointment"] },
  { id: 3, slug: "law", name: "Law", shortName: "Law", heroTitle: "Legal Services Marketplace", overview: "Hire verified lawyers or offer legal services worldwide. Get help with contracts, cases, and legal advice.", services: ["Legal Consultancy", "Court Representation", "Documentation", "Compliance", "IP & Patents"], accent: "red", accentColor: "#6B7280", icon: "Scale" },
  { id: 4, slug: "it", name: "IT & Software", shortName: "IT", heroTitle: "All-in-One IT Services Ecosystem", overview: "Work as a developer or hire experts globally. Build websites, apps, and software solutions.", services: ["Web Development", "Mobile Development", "UI UX Design", "Cybersecurity", "Cloud Services"], accent: "blue", accentColor: "#3B82F6", icon: "Code2", heroSubtitle: "Connect with developers, designers, and technology experts worldwide.", heroPrimaryButton: "Find Developers", heroSecondaryButton: "Hire Experts", popularServices: ["Website Development", "Mobile App Development", "UI UX Design", "AI Model Development"] },
  { id: 5, slug: "ai", name: "AI & Data", shortName: "AI", heroTitle: "AI & Data Services Marketplace", overview: "Create AI tools, automation systems, and smart solutions. Use AI to grow businesses and improve productivity.", services: ["AI Tools", "Data Science", "ML Models", "Automation", "AI Consulting"], accent: "blue", accentColor: "#8B5CF6", icon: "Brain" },
  { id: 6, slug: "blockchain", name: "Blockchain & Web3", shortName: "Blockchain", heroTitle: "Blockchain & Web3 Marketplace", overview: "Build blockchain apps, smart contracts, and Web3 solutions. Work with crypto, NFTs, and decentralized systems.", services: ["Smart Contracts", "DeFi", "NFTs", "Tokenization", "Web3 Dev"], accent: "blue", accentColor: "#7C3AED", icon: "Link" },
  { id: 7, slug: "finance", name: "Finance & Banking", shortName: "Finance", heroTitle: "Finance & Banking Services", overview: "Manage payments, investments, and financial services. Offer financial consulting or grow your business securely.", services: ["Banking", "Payments", "Loans", "Investments", "Advisory"], accent: "orange", accentColor: "#F59E0B", icon: "TrendingUp" },
  { id: 8, slug: "insurance", name: "Insurance", shortName: "Insurance", heroTitle: "Insurance Services Marketplace", overview: "Provide insurance services or connect with providers. Secure health, property, and business assets.", services: ["Health Insurance", "Life", "Auto", "Property", "Claims"], accent: "green", accentColor: "#FBBF24", icon: "ShieldCheck" },
  { id: 9, slug: "real-estate", name: "Real Estate", shortName: "Real Estate", heroTitle: "Real Estate Marketplace", overview: "Buy, sell, or rent properties globally. Manage real estate investments and services.", services: ["Sales", "Rentals", "Property Management", "Valuation", "Legal"], accent: "green", accentColor: "#16A34A", icon: "Building2" },
  { id: 10, slug: "construction", name: "Construction", shortName: "Construction", heroTitle: "Construction & Contractors Marketplace", overview: "Offer construction services or hire builders. Work on projects, buildings, and infrastructure.", services: ["Contractors", "Architecture", "Materials", "Safety", "Inspection"], accent: "orange", accentColor: "#A16207", icon: "HardHat" },
  { id: 11, slug: "automotive", name: "Automotive", shortName: "Automotive", heroTitle: "Automotive Services Marketplace", overview: "Buy, sell, or repair vehicles and offer services. Connect with customers for transport solutions.", services: ["Repair", "Sales", "Spare Parts", "Fleet", "EV Charging"], accent: "orange", accentColor: "#2563EB", icon: "Car" },
  { id: 12, slug: "agriculture", name: "Agriculture", shortName: "Agriculture", heroTitle: "Agriculture & Agri-Tech Marketplace", overview: "Trade crops, farming tools, and agricultural services. Grow and manage farming businesses efficiently.", services: ["Farming", "Supply Chain", "Equipment", "Seeds", "Export"], accent: "green", accentColor: "#22C55E", icon: "Sprout" },
  { id: 13, slug: "manufacturing", name: "Manufacturing", shortName: "Manufacturing", heroTitle: "Manufacturing & Supply Chain", overview: "Produce goods, manage factories, and supply products. Connect with global buyers and suppliers.", services: ["OEM", "Assembly", "QC", "Logistics", "Sourcing"], accent: "green", accentColor: "#64748B", icon: "Factory" },
  { id: 14, slug: "logistics", name: "Logistics & Delivery", shortName: "Delivery", heroTitle: "Logistics & Delivery Marketplace", overview: "Offer delivery services or manage logistics operations. Transport goods locally and internationally.", services: ["Delivery", "Freight", "Warehousing", "Last Mile", "Tracking"], accent: "orange", accentColor: "#FB923C", icon: "Truck" },
  { id: 15, slug: "travel", name: "Travel & Tourism", shortName: "Travel", heroTitle: "Travel & Tourism Marketplace", overview: "Book trips, offer travel services, and manage tours. Help people explore the world easily.", services: ["Flights", "Hotels", "Tours", "Visas", "Travel Insurance"], accent: "orange", accentColor: "#0EA5E9", icon: "Plane" },
  { id: 16, slug: "hospitality", name: "Hospitality", shortName: "Hospitality", heroTitle: "Hospitality Services Marketplace", overview: "Manage hotels, restaurants, and guest services. Provide comfortable experiences for customers.", services: ["Hotels", "Restaurants", "Catering", "Events", "Venues"], accent: "orange", accentColor: "#14B8A6", icon: "UtensilsCrossed" },
  { id: 17, slug: "beauty", name: "Beauty & Personal Care", shortName: "Beauty", heroTitle: "Beauty & Personal Care Marketplace", overview: "Offer beauty services like makeup, skincare, and salons. Connect with clients and grow your business.", services: ["Salons", "Spa", "Skincare", "Makeup", "Wellness"], accent: "orange", accentColor: "#EC4899", icon: "Sparkles" },
  { id: 18, slug: "fitness", name: "Fitness & Sports", shortName: "Fitness", heroTitle: "Fitness & Sports Marketplace", overview: "Provide training, coaching, and fitness programs. Help people stay healthy and fit.", services: ["Gyms", "Personal Trainers", "Sports", "Nutrition", "Rehab"], accent: "orange", accentColor: "#F43F5E", icon: "Dumbbell" },
  { id: 19, slug: "entertainment", name: "Entertainment & Media", shortName: "Media", heroTitle: "Entertainment & Media Marketplace", overview: "Create videos, content, and media production services. Work in editing, filming, and content creation.", services: ["Content", "Events", "Production", "Streaming", "PR"], accent: "orange", accentColor: "#9333EA", icon: "Film" },
  { id: 20, slug: "gaming", name: "Gaming & Esports", shortName: "Gaming", heroTitle: "Gaming & Esports Marketplace", overview: "Develop games or offer gaming services and content. Earn through gaming and entertainment.", services: ["Game Dev", "Esports", "Streaming", "Tournaments", "Merch"], accent: "orange", accentColor: "#6366F1", icon: "Gamepad2" },
  { id: 21, slug: "marketing", name: "Marketing & Advertising", shortName: "Marketing", heroTitle: "Marketing & Advertising Marketplace", overview: "Promote businesses with digital marketing strategies. Offer SEO, ads, and branding services.", services: ["Digital Marketing", "SEO", "Ads", "Branding", "Analytics"], accent: "orange", accentColor: "#F97316", icon: "Megaphone" },
  { id: 22, slug: "consulting", name: "Consulting & Business Services", shortName: "Consulting", heroTitle: "Consulting & Business Services", overview: "Provide expert advice to businesses and individuals. Help others grow with your knowledge.", services: ["Strategy", "Operations", "Advisory", "Audit", "Outsourcing"], accent: "green", accentColor: "#3B82F6", icon: "Briefcase" },
  { id: 23, slug: "hr", name: "HR & Recruitment", shortName: "HR", heroTitle: "HR & Recruitment Marketplace", overview: "Manage hiring, payroll, and employee services. Connect companies with skilled professionals.", services: ["Recruitment", "Payroll", "Training", "HR Tech", "Outplacement"], accent: "green", accentColor: "#22C55E", icon: "Users" },
  { id: 24, slug: "freelancing", name: "Freelancing & Remote Work", shortName: "Freelancing", heroTitle: "Freelancing & Remote Work Marketplace", overview: "Work independently and earn online globally. Offer skills like design, writing, and development.", services: ["Freelancers", "Remote Teams", "Projects", "JPS Profiles", "Contracts"], accent: "orange", accentColor: "#06B6D4", icon: "Laptop" },
  { id: 25, slug: "security", name: "Security Services", shortName: "Security", heroTitle: "Security Services Marketplace", overview: "Provide physical or cyber security services. Protect systems, data, and people.", services: ["Guarding", "Surveillance", "Cyber Security", "PSS Verification", "Risk"], accent: "blue", accentColor: "#EF4444", icon: "Shield" },
  { id: 26, slug: "telecom", name: "Telecommunications", shortName: "Telecom", heroTitle: "Telecom Services Marketplace", overview: "Offer communication and telecom services. Connect people through technology.", services: ["Mobile", "Broadband", "IoT", "Enterprise", "Support"], accent: "blue", accentColor: "#0EA5E9", icon: "Radio" },
  { id: 27, slug: "energy", name: "Energy & Utilities", shortName: "Energy", heroTitle: "Energy & Utilities Marketplace", overview: "Work in power, renewable energy, and utilities. Support sustainable and efficient energy solutions.", services: ["Power", "Renewables", "Meters", "EV", "Billing"], accent: "orange", accentColor: "#EAB308", icon: "Zap" },
  { id: 28, slug: "environment", name: "Environment & Sustainability", shortName: "Environment", heroTitle: "Environment & Sustainability", overview: "Promote eco-friendly services and sustainability. Work on green projects and environmental protection.", services: ["Waste", "Recycling", "Carbon", "Audit", "Consulting"], accent: "green", accentColor: "#10B981", icon: "Leaf" },
  { id: 29, slug: "research", name: "Research & Development", shortName: "Research", heroTitle: "Research & Development Marketplace", overview: "Conduct research and innovation projects. Develop new ideas and solutions.", services: ["R&D", "Labs", "Patents", "Trials", "Innovation"], accent: "blue", accentColor: "#6366F1", icon: "FlaskConical" },
  { id: 30, slug: "retail", name: "Retail & E-Commerce", shortName: "E-commerce", heroTitle: "Retail & E-Commerce Marketplace", overview: "Sell products online and grow your business globally. Manage stores and reach more customers.", services: ["GoSellr", "Stores", "D2C", "Inventory", "Payments"], accent: "orange", accentColor: "#F59E0B", icon: "ShoppingCart" },
  { id: 31, slug: "ngo", name: "NGOs & Social Services", shortName: "NGO", heroTitle: "NGOs & Social Services", overview: "Run social projects and help communities. Support causes and make a positive impact.", services: ["NGOs", "Donations", "Volunteers", "Impact", "Grants"], accent: "red", accentColor: "#22C55E", icon: "HeartHandshake" },
  { id: 32, slug: "government", name: "Government & Public Services", shortName: "Government", heroTitle: "Government & Public Services", overview: "Provide public services and manage civic operations. Support development and governance systems.", services: ["Civic", "Licenses", "Permits", "Compliance", "E-Governance"], accent: "red", accentColor: "#475569", icon: "Building" },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug.toLowerCase());
}

export function getAllSlugs(): string[] {
  return INDUSTRIES.map((i) => i.slug);
}
