/**
 * EHB Industry → Service Categories → Services Architecture
 * Phase 13–28. Marketplace listing structure. See EHB_SERVICES_ARCHITECTURE.md.
 *
 * Hierarchy: Industry → Service Category → Services → Providers
 */

export interface ServiceItem {
  slug: string;
  name: string;
}

export interface ServiceCategory {
  slug: string;
  name: string;
  services: ServiceItem[];
}

export interface IndustryServicesConfig {
  industrySlug: string;
  accentColor: string;
  categories: ServiceCategory[];
}

/** All 32 industries with categories and services. 700+ services across platform. */
export const INDUSTRY_SERVICES: IndustryServicesConfig[] = [
  {
    industrySlug: "education",
    accentColor: "#E53935",
    categories: [
      { slug: "schools", name: "Schools", services: [{ slug: "primary-education", name: "Primary Education" }, { slug: "secondary-education", name: "Secondary Education" }, { slug: "admissions", name: "Admissions" }] },
      { slug: "colleges", name: "Colleges", services: [{ slug: "undergraduate", name: "Undergraduate Programs" }, { slug: "admissions", name: "College Admissions" }] },
      { slug: "universities", name: "Universities", services: [{ slug: "graduate", name: "Graduate Programs" }, { slug: "research", name: "Research Programs" }] },
      { slug: "online-courses", name: "Online Courses", services: [{ slug: "programming-courses", name: "Programming Courses" }, { slug: "certifications", name: "Certifications" }] },
      { slug: "training-institutes", name: "Training Institutes", services: [{ slug: "computer-training", name: "Computer Training" }, { slug: "professional-training", name: "Professional Training" }] },
      { slug: "tutors", name: "Tutors", services: [{ slug: "math-tutor", name: "Math Tutor" }, { slug: "english-tutor", name: "English Tutor" }, { slug: "ielts-preparation", name: "IELTS Preparation" }, { slug: "science-tutor", name: "Science Tutor" }] },
    ],
  },
  {
    industrySlug: "health",
    accentColor: "#00AEEF",
    categories: [
      { slug: "doctors", name: "Doctors", services: [{ slug: "doctor-consultation", name: "Doctor Consultation" }, { slug: "online-doctor-appointment", name: "Online Doctor Appointment" }, { slug: "general-physician", name: "General Physician" }, { slug: "specialist", name: "Specialist Consultation" }] },
      { slug: "hospitals", name: "Hospitals", services: [{ slug: "inpatient", name: "Inpatient Care" }, { slug: "outpatient", name: "Outpatient" }, { slug: "emergency", name: "Emergency" }] },
      { slug: "clinics", name: "Clinics", services: [{ slug: "clinic-visit", name: "Clinic Visit" }, { slug: "day-care", name: "Day Care" }] },
      { slug: "pharmacies", name: "Pharmacies", services: [{ slug: "medicine-delivery", name: "Medicine Delivery" }, { slug: "prescription", name: "Prescription Filling" }] },
      { slug: "diagnostic-labs", name: "Diagnostic Labs", services: [{ slug: "blood-test", name: "Blood Test" }, { slug: "x-ray", name: "X-Ray" }, { slug: "mri-ct", name: "MRI / CT" }, { slug: "lab-reports", name: "Lab Reports" }] },
      { slug: "ambulance", name: "Ambulance", services: [{ slug: "emergency-ambulance", name: "Emergency Ambulance" }, { slug: "patient-transfer", name: "Patient Transfer" }] },
    ],
  },
  {
    industrySlug: "law",
    accentColor: "#6B7280",
    categories: [
      { slug: "legal-consultation", name: "Legal Consultation", services: [{ slug: "legal-advice", name: "Legal Advice" }, { slug: "document-drafting", name: "Document Drafting" }] },
      { slug: "corporate-law", name: "Corporate Law", services: [{ slug: "company-formation", name: "Company Formation" }, { slug: "contracts", name: "Contracts" }] },
      { slug: "family-law", name: "Family Law", services: [{ slug: "divorce", name: "Divorce" }, { slug: "custody", name: "Custody" }] },
      { slug: "criminal-law", name: "Criminal Law", services: [{ slug: "court-representation", name: "Court Representation" }, { slug: "bail", name: "Bail" }] },
      { slug: "immigration-law", name: "Immigration Law", services: [{ slug: "visa-consultation", name: "Visa Consultation" }, { slug: "work-permit", name: "Work Permit" }] },
    ],
  },
  {
    industrySlug: "it",
    accentColor: "#3B82F6",
    categories: [
      { slug: "web-development", name: "Web Development", services: [{ slug: "website-development", name: "Website Development" }, { slug: "ecommerce", name: "E-Commerce Site" }, { slug: "cms", name: "CMS Development" }] },
      { slug: "mobile-development", name: "Mobile Development", services: [{ slug: "mobile-app-development", name: "Mobile App Development" }, { slug: "ios-android", name: "iOS & Android" }] },
      { slug: "ai-development", name: "AI Development", services: [{ slug: "ai-model-development", name: "AI Model Development" }, { slug: "integration", name: "AI Integration" }] },
      { slug: "cybersecurity", name: "Cybersecurity", services: [{ slug: "security-audit", name: "Security Audit" }, { slug: "penetration-testing", name: "Penetration Testing" }] },
      { slug: "cloud-services", name: "Cloud Services", services: [{ slug: "server-management", name: "Server Management" }, { slug: "cloud-migration", name: "Cloud Migration" }, { slug: "devops", name: "DevOps" }] },
      { slug: "design", name: "Design", services: [{ slug: "ui-ux-design", name: "UI UX Design" }, { slug: "branding", name: "Branding" }] },
    ],
  },
  {
    industrySlug: "ai",
    accentColor: "#8B5CF6",
    categories: [
      { slug: "ai-consulting", name: "AI Consulting", services: [{ slug: "ai-strategy", name: "AI Strategy" }, { slug: "ai-chatbot-development", name: "AI Chatbot Development" }] },
      { slug: "machine-learning", name: "Machine Learning", services: [{ slug: "ml-model-training", name: "ML Model Training" }, { slug: "predictive-analytics", name: "Predictive Analytics" }] },
      { slug: "automation", name: "Automation", services: [{ slug: "business-automation", name: "Business Automation" }, { slug: "rpa", name: "RPA" }] },
      { slug: "ai-chatbots", name: "AI Chatbots", services: [{ slug: "customer-support-bot", name: "Customer Support Bot" }, { slug: "voice-bot", name: "Voice Bot" }] },
      { slug: "data-science", name: "Data Science", services: [{ slug: "data-analysis", name: "Data Analysis" }, { slug: "visualization", name: "Data Visualization" }] },
    ],
  },
  {
    industrySlug: "blockchain",
    accentColor: "#7C3AED",
    categories: [
      { slug: "smart-contracts", name: "Smart Contracts", services: [{ slug: "smart-contract-audit", name: "Smart Contract Audit" }, { slug: "development", name: "Smart Contract Development" }] },
      { slug: "token-development", name: "Token Development", services: [{ slug: "token-creation", name: "Token Creation" }, { slug: "tokenomics", name: "Tokenomics" }] },
      { slug: "defi", name: "DeFi", services: [{ slug: "defi-development", name: "DeFi Development" }, { slug: "yield-farming", name: "Yield Farming" }] },
      { slug: "nft", name: "NFT", services: [{ slug: "nft-marketplace", name: "NFT Marketplace" }, { slug: "nft-minting", name: "NFT Minting" }] },
      { slug: "validators", name: "Validators", services: [{ slug: "validator-setup", name: "Validator Setup" }, { slug: "staking", name: "Staking" }] },
    ],
  },
  {
    industrySlug: "finance",
    accentColor: "#F59E0B",
    categories: [
      { slug: "accounting", name: "Accounting", services: [{ slug: "business-accounting", name: "Business Accounting" }, { slug: "bookkeeping", name: "Bookkeeping" }] },
      { slug: "tax-services", name: "Tax Services", services: [{ slug: "tax-filing", name: "Tax Filing" }, { slug: "tax-consultation", name: "Tax Consultation" }] },
      { slug: "investment-consulting", name: "Investment Consulting", services: [{ slug: "investment-advice", name: "Investment Advice" }, { slug: "portfolio-management", name: "Portfolio Management" }] },
      { slug: "banking-services", name: "Banking Services", services: [{ slug: "loan-consultation", name: "Loan Consultation" }, { slug: "accounts", name: "Accounts & Cards" }] },
      { slug: "financial-planning", name: "Financial Planning", services: [{ slug: "retirement-planning", name: "Retirement Planning" }, { slug: "wealth-management", name: "Wealth Management" }] },
    ],
  },
  {
    industrySlug: "insurance",
    accentColor: "#FBBF24",
    categories: [
      { slug: "health-insurance", name: "Health Insurance", services: [{ slug: "policy-purchase", name: "Policy Purchase" }, { slug: "claims", name: "Claims" }] },
      { slug: "life", name: "Life", services: [{ slug: "life-policy", name: "Life Policy" }, { slug: "term-insurance", name: "Term Insurance" }] },
      { slug: "auto", name: "Auto", services: [{ slug: "vehicle-insurance", name: "Vehicle Insurance" }, { slug: "claim-filing", name: "Claim Filing" }] },
      { slug: "property", name: "Property", services: [{ slug: "home-insurance", name: "Home Insurance" }, { slug: "commercial", name: "Commercial Property" }] },
    ],
  },
  {
    industrySlug: "real-estate",
    accentColor: "#16A34A",
    categories: [
      { slug: "property-buying", name: "Property Buying", services: [{ slug: "house-buying", name: "House Buying" }, { slug: "commercial-buy", name: "Commercial Property" }] },
      { slug: "property-selling", name: "Property Selling", services: [{ slug: "listing", name: "Listing" }, { slug: "agent-services", name: "Agent Services" }] },
      { slug: "rentals", name: "Rentals", services: [{ slug: "apartment-rentals", name: "Apartment Rentals" }, { slug: "office-rent", name: "Office Rent" }] },
      { slug: "property-management", name: "Property Management", services: [{ slug: "tenant-management", name: "Tenant Management" }, { slug: "maintenance", name: "Maintenance" }] },
      { slug: "construction-consulting", name: "Construction Consulting", services: [{ slug: "property-valuation", name: "Property Valuation" }, { slug: "construction-estimation", name: "Construction Estimation" }] },
    ],
  },
  {
    industrySlug: "construction",
    accentColor: "#A16207",
    categories: [
      { slug: "contractors", name: "Contractors", services: [{ slug: "general-contractor", name: "General Contractor" }, { slug: "subcontractor", name: "Subcontractor" }] },
      { slug: "architecture", name: "Architecture", services: [{ slug: "architectural-design", name: "Architectural Design" }, { slug: "blueprints", name: "Blueprints" }] },
      { slug: "materials", name: "Materials", services: [{ slug: "supply", name: "Material Supply" }, { slug: "equipment-rental", name: "Equipment Rental" }] },
      { slug: "safety", name: "Safety", services: [{ slug: "safety-inspection", name: "Safety Inspection" }, { slug: "compliance", name: "Compliance" }] },
    ],
  },
  {
    industrySlug: "automotive",
    accentColor: "#2563EB",
    categories: [
      { slug: "repair", name: "Repair", services: [{ slug: "car-repair", name: "Car Repair" }, { slug: "engine-service", name: "Engine Service" }] },
      { slug: "sales", name: "Sales", services: [{ slug: "new-cars", name: "New Cars" }, { slug: "used-cars", name: "Used Cars" }] },
      { slug: "spare-parts", name: "Spare Parts", services: [{ slug: "parts-supply", name: "Parts Supply" }, { slug: "fitting", name: "Fitting" }] },
      { slug: "ev-charging", name: "EV Charging", services: [{ slug: "charging-station", name: "Charging Station" }, { slug: "home-charger", name: "Home Charger Install" }] },
    ],
  },
  {
    industrySlug: "agriculture",
    accentColor: "#22C55E",
    categories: [
      { slug: "farming", name: "Farming", services: [{ slug: "crop-advisory", name: "Crop Advisory" }, { slug: "organic-farming", name: "Organic Farming" }] },
      { slug: "supply-chain", name: "Supply Chain", services: [{ slug: "procurement", name: "Procurement" }, { slug: "cold-chain", name: "Cold Chain" }] },
      { slug: "equipment", name: "Equipment", services: [{ slug: "tractor-rental", name: "Tractor Rental" }, { slug: "irrigation", name: "Irrigation" }] },
      { slug: "seeds", name: "Seeds", services: [{ slug: "seed-supply", name: "Seed Supply" }, { slug: "hybrid-seeds", name: "Hybrid Seeds" }] },
    ],
  },
  {
    industrySlug: "manufacturing",
    accentColor: "#64748B",
    categories: [
      { slug: "oem", name: "OEM", services: [{ slug: "contract-manufacturing", name: "Contract Manufacturing" }, { slug: "custom-production", name: "Custom Production" }] },
      { slug: "assembly", name: "Assembly", services: [{ slug: "product-assembly", name: "Product Assembly" }, { slug: "packaging", name: "Packaging" }] },
      { slug: "qc", name: "QC", services: [{ slug: "quality-inspection", name: "Quality Inspection" }, { slug: "certification", name: "Certification" }] },
      { slug: "logistics", name: "Logistics", services: [{ slug: "warehousing", name: "Warehousing" }, { slug: "distribution", name: "Distribution" }] },
    ],
  },
  {
    industrySlug: "logistics",
    accentColor: "#FB923C",
    categories: [
      { slug: "courier", name: "Courier", services: [{ slug: "same-day-delivery", name: "Same Day Delivery" }, { slug: "express-courier", name: "Express Courier" }] },
      { slug: "food-delivery", name: "Food Delivery", services: [{ slug: "food-delivery", name: "Food Delivery" }, { slug: "grocery-delivery", name: "Grocery Delivery" }] },
      { slug: "package-delivery", name: "Package Delivery", services: [{ slug: "package-shipping", name: "Package Shipping" }, { slug: "international-shipping", name: "International Shipping" }] },
      { slug: "moving-services", name: "Moving Services", services: [{ slug: "home-moving", name: "Home Moving" }, { slug: "office-relocation", name: "Office Relocation" }] },
      { slug: "transport-services", name: "Transport Services", services: [{ slug: "freight", name: "Freight" }, { slug: "last-mile", name: "Last Mile" }] },
    ],
  },
  {
    industrySlug: "travel",
    accentColor: "#0EA5E9",
    categories: [
      { slug: "flight-booking", name: "Flight Booking", services: [{ slug: "international-flights", name: "International Flights" }, { slug: "domestic-flights", name: "Domestic Flights" }] },
      { slug: "hotel-booking", name: "Hotel Booking", services: [{ slug: "hotel-reservation", name: "Hotel Reservation" }, { slug: "vacation-rentals", name: "Vacation Rentals" }] },
      { slug: "tour-packages", name: "Tour Packages", services: [{ slug: "tour-guide", name: "Tour Guide" }, { slug: "group-tours", name: "Group Tours" }] },
      { slug: "visa-services", name: "Visa Services", services: [{ slug: "visa-assistance", name: "Visa Assistance" }, { slug: "documentation", name: "Documentation" }] },
      { slug: "travel-insurance", name: "Travel Insurance", services: [{ slug: "travel-insurance", name: "Travel Insurance" }, { slug: "trip-protection", name: "Trip Protection" }] },
    ],
  },
  {
    industrySlug: "hospitality",
    accentColor: "#14B8A6",
    categories: [
      { slug: "hotels", name: "Hotels", services: [{ slug: "stay-booking", name: "Stay Booking" }, { slug: "events-venue", name: "Events Venue" }] },
      { slug: "restaurants", name: "Restaurants", services: [{ slug: "dining", name: "Dining" }, { slug: "catering", name: "Catering" }] },
      { slug: "catering", name: "Catering", services: [{ slug: "event-catering", name: "Event Catering" }, { slug: "corporate-catering", name: "Corporate Catering" }] },
      { slug: "events", name: "Events", services: [{ slug: "event-planning", name: "Event Planning" }, { slug: "venue-booking", name: "Venue Booking" }] },
    ],
  },
  {
    industrySlug: "beauty",
    accentColor: "#EC4899",
    categories: [
      { slug: "salons", name: "Salons", services: [{ slug: "haircut", name: "Haircut" }, { slug: "styling", name: "Styling" }] },
      { slug: "spa", name: "Spa", services: [{ slug: "massage", name: "Massage" }, { slug: "facial", name: "Facial" }] },
      { slug: "skincare", name: "Skincare", services: [{ slug: "skincare-treatment", name: "Skincare Treatment" }, { slug: "consultation", name: "Consultation" }] },
      { slug: "makeup", name: "Makeup", services: [{ slug: "bridal-makeup", name: "Bridal Makeup" }, { slug: "makeup-artist", name: "Makeup Artist" }] },
    ],
  },
  {
    industrySlug: "fitness",
    accentColor: "#F43F5E",
    categories: [
      { slug: "gyms", name: "Gyms", services: [{ slug: "gym-membership", name: "Gym Membership" }, { slug: "personal-training", name: "Personal Training" }] },
      { slug: "personal-trainers", name: "Personal Trainers", services: [{ slug: "fitness-coach", name: "Fitness Coach" }, { slug: "home-training", name: "Home Training" }] },
      { slug: "sports", name: "Sports", services: [{ slug: "sports-coaching", name: "Sports Coaching" }, { slug: "rehab", name: "Rehab" }] },
      { slug: "nutrition", name: "Nutrition", services: [{ slug: "diet-plan", name: "Diet Plan" }, { slug: "nutritionist", name: "Nutritionist" }] },
    ],
  },
  {
    industrySlug: "entertainment",
    accentColor: "#9333EA",
    categories: [
      { slug: "content", name: "Content", services: [{ slug: "content-creation", name: "Content Creation" }, { slug: "script-writing", name: "Script Writing" }] },
      { slug: "events", name: "Events", services: [{ slug: "live-events", name: "Live Events" }, { slug: "concerts", name: "Concerts" }] },
      { slug: "production", name: "Production", services: [{ slug: "video-production", name: "Video Production" }, { slug: "streaming", name: "Streaming" }] },
    ],
  },
  {
    industrySlug: "gaming",
    accentColor: "#6366F1",
    categories: [
      { slug: "game-dev", name: "Game Dev", services: [{ slug: "game-development", name: "Game Development" }, { slug: "indie-games", name: "Indie Games" }] },
      { slug: "esports", name: "Esports", services: [{ slug: "tournaments", name: "Tournaments" }, { slug: "team-management", name: "Team Management" }] },
      { slug: "streaming", name: "Streaming", services: [{ slug: "live-streaming", name: "Live Streaming" }, { slug: "content", name: "Gaming Content" }] },
    ],
  },
  {
    industrySlug: "marketing",
    accentColor: "#F97316",
    categories: [
      { slug: "digital-marketing", name: "Digital Marketing", services: [{ slug: "social-media", name: "Social Media Marketing" }, { slug: "ppc", name: "PPC" }] },
      { slug: "seo", name: "SEO", services: [{ slug: "seo-services", name: "SEO Services" }, { slug: "content-seo", name: "Content SEO" }] },
      { slug: "ads", name: "Ads", services: [{ slug: "ad-campaigns", name: "Ad Campaigns" }, { slug: "branding", name: "Branding" }] },
      { slug: "analytics", name: "Analytics", services: [{ slug: "web-analytics", name: "Web Analytics" }, { slug: "reporting", name: "Reporting" }] },
    ],
  },
  {
    industrySlug: "consulting",
    accentColor: "#3B82F6",
    categories: [
      { slug: "strategy", name: "Strategy", services: [{ slug: "business-strategy", name: "Business Strategy" }, { slug: "growth-consulting", name: "Growth Consulting" }] },
      { slug: "operations", name: "Operations", services: [{ slug: "operations-consulting", name: "Operations Consulting" }, { slug: "process-improvement", name: "Process Improvement" }] },
      { slug: "advisory", name: "Advisory", services: [{ slug: "business-advisory", name: "Business Advisory" }, { slug: "audit", name: "Audit" }] },
    ],
  },
  {
    industrySlug: "hr",
    accentColor: "#22C55E",
    categories: [
      { slug: "recruitment", name: "Recruitment", services: [{ slug: "hiring", name: "Hiring" }, { slug: "headhunting", name: "Headhunting" }] },
      { slug: "payroll", name: "Payroll", services: [{ slug: "payroll-processing", name: "Payroll Processing" }, { slug: "compliance", name: "Compliance" }] },
      { slug: "training", name: "Training", services: [{ slug: "corporate-training", name: "Corporate Training" }, { slug: "soft-skills", name: "Soft Skills" }] },
    ],
  },
  {
    industrySlug: "freelancing",
    accentColor: "#06B6D4",
    categories: [
      { slug: "graphic-design", name: "Graphic Design", services: [{ slug: "logo-design", name: "Logo Design" }, { slug: "brand-identity", name: "Brand Identity" }] },
      { slug: "content-writing", name: "Content Writing", services: [{ slug: "copywriting", name: "Copywriting" }, { slug: "blog-posts", name: "Blog Posts" }] },
      { slug: "programming", name: "Programming", services: [{ slug: "wordpress-development", name: "WordPress Development" }, { slug: "custom-development", name: "Custom Development" }] },
      { slug: "marketing", name: "Marketing", services: [{ slug: "seo-services", name: "SEO Services" }, { slug: "social-media-management", name: "Social Media Management" }] },
      { slug: "video-editing", name: "Video Editing", services: [{ slug: "video-editing", name: "Video Editing" }, { slug: "motion-graphics", name: "Motion Graphics" }] },
    ],
  },
  {
    industrySlug: "security",
    accentColor: "#EF4444",
    categories: [
      { slug: "personal-security", name: "Personal Security", services: [{ slug: "private-protection", name: "Private Protection" }, { slug: "bodyguard", name: "Bodyguard" }] },
      { slug: "cybersecurity", name: "Cybersecurity", services: [{ slug: "cybersecurity-audit", name: "Cybersecurity Audit" }, { slug: "vulnerability-assessment", name: "Vulnerability Assessment" }] },
      { slug: "home-security", name: "Home Security", services: [{ slug: "cctv-installation", name: "CCTV Installation" }, { slug: "alarm-systems", name: "Alarm Systems" }] },
      { slug: "corporate-security", name: "Corporate Security", services: [{ slug: "security-guards", name: "Security Guards" }, { slug: "access-control", name: "Access Control" }] },
    ],
  },
  {
    industrySlug: "telecom",
    accentColor: "#0EA5E9",
    categories: [
      { slug: "mobile", name: "Mobile", services: [{ slug: "sim-activation", name: "SIM Activation" }, { slug: "plans", name: "Plans & Bundles" }] },
      { slug: "broadband", name: "Broadband", services: [{ slug: "internet-connection", name: "Internet Connection" }, { slug: "fiber", name: "Fiber" }] },
      { slug: "enterprise", name: "Enterprise", services: [{ slug: "enterprise-solutions", name: "Enterprise Solutions" }, { slug: "support", name: "Support" }] },
    ],
  },
  {
    industrySlug: "energy",
    accentColor: "#EAB308",
    categories: [
      { slug: "power", name: "Power", services: [{ slug: "electricity", name: "Electricity" }, { slug: "backup-power", name: "Backup Power" }] },
      { slug: "renewables", name: "Renewables", services: [{ slug: "solar-installation", name: "Solar Installation" }, { slug: "solar-panels", name: "Solar Panels" }] },
      { slug: "ev", name: "EV", services: [{ slug: "ev-charging", name: "EV Charging" }, { slug: "ev-advisory", name: "EV Advisory" }] },
    ],
  },
  {
    industrySlug: "environment",
    accentColor: "#10B981",
    categories: [
      { slug: "waste-management", name: "Waste Management", services: [{ slug: "waste-disposal", name: "Waste Disposal" }, { slug: "recycling-services", name: "Recycling Services" }] },
      { slug: "renewable-energy", name: "Renewable Energy", services: [{ slug: "solar-installation", name: "Solar Installation" }, { slug: "green-energy", name: "Green Energy" }] },
      { slug: "environmental-consulting", name: "Environmental Consulting", services: [{ slug: "environmental-audit", name: "Environmental Audit" }, { slug: "compliance", name: "Compliance" }] },
      { slug: "recycling", name: "Recycling", services: [{ slug: "recycling-services", name: "Recycling Services" }, { slug: "e-waste", name: "E-Waste" }] },
    ],
  },
  {
    industrySlug: "research",
    accentColor: "#6366F1",
    categories: [
      { slug: "scientific-research", name: "Scientific Research", services: [{ slug: "scientific-consulting", name: "Scientific Consulting" }, { slug: "lab-services", name: "Lab Services" }] },
      { slug: "technology-research", name: "Technology Research", services: [{ slug: "technology-development", name: "Technology Development" }, { slug: "r-d", name: "R&D" }] },
      { slug: "market-research", name: "Market Research", services: [{ slug: "market-analysis", name: "Market Analysis" }, { slug: "surveys", name: "Surveys" }] },
      { slug: "product-innovation", name: "Product Innovation", services: [{ slug: "product-development", name: "Product Development" }, { slug: "prototyping", name: "Prototyping" }] },
    ],
  },
  {
    industrySlug: "retail",
    accentColor: "#F59E0B",
    categories: [
      { slug: "electronics", name: "Electronics", services: [{ slug: "online-store", name: "Online Store" }, { slug: "product-delivery", name: "Product Delivery" }] },
      { slug: "fashion", name: "Fashion", services: [{ slug: "local-store", name: "Local Store" }, { slug: "marketplace-seller", name: "Marketplace Seller" }] },
      { slug: "home-goods", name: "Home Goods", services: [{ slug: "home-products", name: "Home Products" }, { slug: "delivery", name: "Delivery" }] },
      { slug: "beauty-products", name: "Beauty Products", services: [{ slug: "beauty-retail", name: "Beauty Retail" }, { slug: "gosellr", name: "GoSellr" }] },
      { slug: "groceries", name: "Groceries", services: [{ slug: "grocery-delivery", name: "Grocery Delivery" }, { slug: "fresh-produce", name: "Fresh Produce" }] },
    ],
  },
  {
    industrySlug: "ngo",
    accentColor: "#22C55E",
    categories: [
      { slug: "ngos", name: "NGOs", services: [{ slug: "donations", name: "Donations" }, { slug: "volunteers", name: "Volunteers" }] },
      { slug: "impact", name: "Impact", services: [{ slug: "impact-assessment", name: "Impact Assessment" }, { slug: "grants", name: "Grants" }] },
    ],
  },
  {
    industrySlug: "government",
    accentColor: "#475569",
    categories: [
      { slug: "civic", name: "Civic", services: [{ slug: "civic-services", name: "Civic Services" }, { slug: "e-governance", name: "E-Governance" }] },
      { slug: "licenses", name: "Licenses", services: [{ slug: "license-application", name: "License Application" }, { slug: "permits", name: "Permits" }] },
      { slug: "compliance", name: "Compliance", services: [{ slug: "compliance-filing", name: "Compliance Filing" }, { slug: "regulatory", name: "Regulatory" }] },
    ],
  },
];

/** Get service config by industry slug */
export function getIndustryServices(industrySlug: string): IndustryServicesConfig | undefined {
  return INDUSTRY_SERVICES.find((c) => c.industrySlug === industrySlug.toLowerCase());
}

/** Flatten all services for an industry (for search/listing) */
export function getAllServicesForIndustry(industrySlug: string): ServiceItem[] {
  const config = getIndustryServices(industrySlug);
  if (!config) return [];
  return config.categories.flatMap((cat) => cat.services);
}

/** Total service count across all industries (700+ target) */
export function getTotalServiceCount(): number {
  return INDUSTRY_SERVICES.reduce(
    (sum, ind) => sum + ind.categories.reduce((s, cat) => s + cat.services.length, 0),
    0
  );
}
