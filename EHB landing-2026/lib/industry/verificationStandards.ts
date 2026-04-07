// ---------------------------------------------------------------------------
// EHB Industry Verification Standards — Phase 31–35
// IT & AI · Health · Education · Logistics
// ---------------------------------------------------------------------------

export type VerificationBadge = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type DocumentStatus    = "REQUIRED" | "OPTIONAL" | "CONDITIONAL";

export interface DocumentRequirement {
  id:          string;
  label:       string;
  description: string;
  status:      DocumentStatus;
  scoreWeight: number;        // how much this doc contributes to the score
  acceptedFormats: string[];  // e.g. ["pdf","jpg","png"]
  maxSizeMB:   number;
}

export interface VerificationStep {
  step:        number;
  title:       string;
  description: string;
  automated:   boolean;  // true = AI auto-checks, false = human review
  slaHours:    number;
}

export interface ScoreWeights {
  documents:   number;   // % of total score
  skills_test: number;
  reviews:     number;
  jps:         number;
  license:     number;
}

export interface BadgeThreshold {
  badge:     VerificationBadge;
  minScore:  number;
  label:     string;
  color:     string;
  benefits:  string[];
}

export interface IndustryVerificationStandard {
  industrySlug:     string;
  industryName:     string;
  icon:             string;
  accentColor:      string;
  description:      string;
  requiredDocuments: DocumentRequirement[];
  optionalDocuments: DocumentRequirement[];
  verificationSteps: VerificationStep[];
  scoreWeights:     ScoreWeights;
  badgeThresholds:  BadgeThreshold[];
  expiryMonths:     number;   // how often re-verification needed
  fastTrackEligible: boolean; // CRB Gold/Platinum = auto-approved?
  autoApproveScore: number;   // score threshold for AI auto-approval
}

// ---------------------------------------------------------------------------
// BADGE COLORS
// ---------------------------------------------------------------------------
const BADGE_COLORS: Record<VerificationBadge, string> = {
  BRONZE:   "bg-orange-900/30 text-orange-300 border-orange-500/40",
  SILVER:   "bg-slate-700/30 text-ehb-textBody border-ehb-textMuted/40",
  GOLD:     "bg-yellow-900/30 text-yellow-300 border-yellow-500/40",
  PLATINUM: "bg-purple-900/30 text-purple-300 border-purple-500/40",
};
export function getBadgeColor(badge: VerificationBadge) { return BADGE_COLORS[badge]; }

export function getBadgeFromScore(score: number, thresholds: BadgeThreshold[]): VerificationBadge {
  const sorted = [...thresholds].sort((a, b) => b.minScore - a.minScore);
  return sorted.find((t) => score >= t.minScore)?.badge ?? "BRONZE";
}

// ---------------------------------------------------------------------------
// IT & AI VERIFICATION STANDARD — Phase 31
// ---------------------------------------------------------------------------
export const IT_STANDARD: IndustryVerificationStandard = {
  industrySlug:  "it",
  industryName:  "IT & Software",
  icon:          "💻",
  accentColor:   "#3B82F6",
  description:   "Verification for IT professionals, software houses, and AI service providers.",
  expiryMonths:  12,
  fastTrackEligible: true,
  autoApproveScore:  75,

  requiredDocuments: [
    {
      id:          "it_cnic",
      label:       "CNIC / Passport",
      description: "Government-issued identity proof",
      status:      "REQUIRED",
      scoreWeight: 20,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   5,
    },
    {
      id:          "it_portfolio",
      label:       "Portfolio / GitHub Profile",
      description: "Link or screenshot of at least 3 completed projects",
      status:      "REQUIRED",
      scoreWeight: 25,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   10,
    },
    {
      id:          "it_skills_proof",
      label:       "Skills Certificate or Degree",
      description: "Relevant IT degree, bootcamp certificate, or online certification (Coursera/Udemy/etc.)",
      status:      "REQUIRED",
      scoreWeight: 20,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
  ],

  optionalDocuments: [
    {
      id:          "it_company_reg",
      label:       "Company Registration (for software houses)",
      description: "SECP registration or equivalent for businesses",
      status:      "OPTIONAL",
      scoreWeight: 15,
      acceptedFormats: ["pdf"],
      maxSizeMB:   5,
    },
    {
      id:          "it_client_letter",
      label:       "Client Reference Letter",
      description: "Letter from a previous client confirming completed work",
      status:      "OPTIONAL",
      scoreWeight: 10,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   3,
    },
  ],

  verificationSteps: [
    { step: 1, title: "Document Upload",       description: "Upload all required documents",                        automated: false, slaHours: 0   },
    { step: 2, title: "AI Document Check",     description: "AI verifies document authenticity and completeness",   automated: true,  slaHours: 1   },
    { step: 3, title: "Skills Assessment",     description: "Short online test (30 mins) — coding basics + logic", automated: true,  slaHours: 2   },
    { step: 4, title: "Portfolio Review",      description: "Human reviewer checks project quality",               automated: false, slaHours: 24  },
    { step: 5, title: "Final Score & Badge",   description: "Score calculated, badge assigned",                    automated: true,  slaHours: 1   },
  ],

  scoreWeights: {
    documents:   40,
    skills_test: 25,
    reviews:     20,
    jps:         10,
    license:     5,
  },

  badgeThresholds: [
    {
      badge:    "PLATINUM",
      minScore: 90,
      label:    "IT Elite",
      color:    BADGE_COLORS.PLATINUM,
      benefits: ["Featured in search results", "Direct client matching", "Priority support", "Reduced commission"],
    },
    {
      badge:    "GOLD",
      minScore: 75,
      label:    "IT Verified",
      color:    BADGE_COLORS.GOLD,
      benefits: ["Verified badge on profile", "Access to premium projects", "Escrow protection"],
    },
    {
      badge:    "SILVER",
      minScore: 55,
      label:    "IT Certified",
      color:    BADGE_COLORS.SILVER,
      benefits: ["Verified checkmark", "Standard marketplace access"],
    },
    {
      badge:    "BRONZE",
      minScore: 30,
      label:    "IT Beginner",
      color:    BADGE_COLORS.BRONZE,
      benefits: ["Basic profile listing", "Entry-level projects"],
    },
  ],
};

// ---------------------------------------------------------------------------
// HEALTH VERIFICATION STANDARD — Phase 32
// ---------------------------------------------------------------------------
export const HEALTH_STANDARD: IndustryVerificationStandard = {
  industrySlug:  "health",
  industryName:  "Health",
  icon:          "🏥",
  accentColor:   "#29ABE2",
  description:   "Verification for doctors, clinics, hospitals, pharmacies, and healthcare providers.",
  expiryMonths:  6,   // Medical licenses need more frequent re-check
  fastTrackEligible: false,  // Health = always human review
  autoApproveScore:  0,      // Never auto-approve health

  requiredDocuments: [
    {
      id:          "health_cnic",
      label:       "CNIC / Passport",
      description: "Government-issued identity proof",
      status:      "REQUIRED",
      scoreWeight: 15,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   5,
    },
    {
      id:          "health_medical_license",
      label:       "Medical License (PMDC / GMC / State Board)",
      description: "Current valid medical practice license from regulatory body",
      status:      "REQUIRED",
      scoreWeight: 35,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
    {
      id:          "health_degree",
      label:       "Medical Degree (MBBS / BDS / equivalent)",
      description: "Recognized medical qualification from accredited institution",
      status:      "REQUIRED",
      scoreWeight: 25,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
    {
      id:          "health_clinic_address",
      label:       "Clinic / Hospital Address Proof",
      description: "Utility bill or lease agreement for the practice address",
      status:      "REQUIRED",
      scoreWeight: 15,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
  ],

  optionalDocuments: [
    {
      id:          "health_specialization",
      label:       "Specialization Certificate",
      description: "Post-graduate or specialist qualification",
      status:      "OPTIONAL",
      scoreWeight: 10,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
    {
      id:          "health_hospital_affiliation",
      label:       "Hospital Affiliation Letter",
      description: "Letter from hospital confirming doctor's association",
      status:      "OPTIONAL",
      scoreWeight: 8,
      acceptedFormats: ["pdf"],
      maxSizeMB:   3,
    },
  ],

  verificationSteps: [
    { step: 1, title: "Document Upload",          description: "Upload license, degree, and address proof",                   automated: false, slaHours: 0  },
    { step: 2, title: "AI Document Scan",         description: "AI checks document format and completeness",                  automated: true,  slaHours: 2  },
    { step: 3, title: "License Number Check",     description: "Cross-reference license number with PMDC/GMC database",      automated: true,  slaHours: 4  },
    { step: 4, title: "Physical Inspection",      description: "Franchise inspector visits clinic/hospital address",          automated: false, slaHours: 72 },
    { step: 5, title: "Senior Medical Review",    description: "EHB medical team reviews all documents",                     automated: false, slaHours: 48 },
    { step: 6, title: "Badge Issuance",           description: "Health Licensed / Health Verified badge assigned",           automated: true,  slaHours: 2  },
  ],

  scoreWeights: {
    documents:   50,
    skills_test: 0,   // No skills test for health — license is the proof
    reviews:     25,
    jps:         10,
    license:     15,
  },

  badgeThresholds: [
    {
      badge:    "PLATINUM",
      minScore: 90,
      label:    "Health Elite",
      color:    BADGE_COLORS.PLATINUM,
      benefits: ["Featured doctor listing", "Top search placement", "Telemedicine enabled", "Zero commission on first 50 consultations"],
    },
    {
      badge:    "GOLD",
      minScore: 75,
      label:    "Health Licensed",
      color:    BADGE_COLORS.GOLD,
      benefits: ["Licensed badge", "Telemedicine access", "Patient reviews enabled"],
    },
    {
      badge:    "SILVER",
      minScore: 55,
      label:    "Health Verified",
      color:    BADGE_COLORS.SILVER,
      benefits: ["Verified checkmark", "Standard listing"],
    },
    {
      badge:    "BRONZE",
      minScore: 30,
      label:    "Health Pending",
      color:    BADGE_COLORS.BRONZE,
      benefits: ["Basic listing (pending full verification)"],
    },
  ],
};

// ---------------------------------------------------------------------------
// EDUCATION VERIFICATION STANDARD — Phase 33
// ---------------------------------------------------------------------------
export const EDUCATION_STANDARD: IndustryVerificationStandard = {
  industrySlug:  "education",
  industryName:  "Education",
  icon:          "📚",
  accentColor:   "#E53935",
  description:   "Verification for teachers, tutors, online instructors, and educational institutions.",
  expiryMonths:  12,
  fastTrackEligible: true,
  autoApproveScore:  70,

  requiredDocuments: [
    {
      id:          "edu_cnic",
      label:       "CNIC / Passport",
      description: "Government-issued identity proof",
      status:      "REQUIRED",
      scoreWeight: 15,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   5,
    },
    {
      id:          "edu_degree",
      label:       "Highest Educational Degree",
      description: "Bachelor's, Master's, or PhD from recognized institution",
      status:      "REQUIRED",
      scoreWeight: 30,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
    {
      id:          "edu_subject_proof",
      label:       "Subject Expertise Proof",
      description: "Transcript, test result, or certification showing subject mastery",
      status:      "REQUIRED",
      scoreWeight: 20,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
  ],

  optionalDocuments: [
    {
      id:          "edu_teaching_experience",
      label:       "Teaching Experience Letter",
      description: "Reference from school, college, or institution where you taught",
      status:      "OPTIONAL",
      scoreWeight: 15,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   3,
    },
    {
      id:          "edu_online_course",
      label:       "Online Course Published",
      description: "Link or screenshot of course on Udemy/Coursera/YouTube",
      status:      "OPTIONAL",
      scoreWeight: 10,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   3,
    },
    {
      id:          "edu_institution_reg",
      label:       "Institution Registration (for schools/academies)",
      description: "Government or board registration for educational institution",
      status:      "CONDITIONAL",
      scoreWeight: 20,
      acceptedFormats: ["pdf"],
      maxSizeMB:   5,
    },
  ],

  verificationSteps: [
    { step: 1, title: "Document Upload",        description: "Upload degree and subject expertise proof",                   automated: false, slaHours: 0  },
    { step: 2, title: "AI Document Check",      description: "AI verifies document authenticity",                          automated: true,  slaHours: 1  },
    { step: 3, title: "Subject Knowledge Test", description: "30-min online test on declared subject area",                automated: true,  slaHours: 2  },
    { step: 4, title: "Demo Session Review",    description: "5-min video demo lesson uploaded and reviewed",              automated: false, slaHours: 24 },
    { step: 5, title: "Badge Issuance",         description: "Edu Verified or Institution Approved badge assigned",        automated: true,  slaHours: 1  },
  ],

  scoreWeights: {
    documents:   35,
    skills_test: 30,
    reviews:     20,
    jps:         10,
    license:     5,
  },

  badgeThresholds: [
    {
      badge:    "PLATINUM",
      minScore: 90,
      label:    "Master Educator",
      color:    BADGE_COLORS.PLATINUM,
      benefits: ["Featured tutor listing", "Premium student matching", "Ability to run EHB certified courses"],
    },
    {
      badge:    "GOLD",
      minScore: 72,
      label:    "Edu Verified",
      color:    BADGE_COLORS.GOLD,
      benefits: ["Verified teacher badge", "Online course publishing", "Student reviews enabled"],
    },
    {
      badge:    "SILVER",
      minScore: 50,
      label:    "Edu Certified",
      color:    BADGE_COLORS.SILVER,
      benefits: ["Certified checkmark", "Standard student matching"],
    },
    {
      badge:    "BRONZE",
      minScore: 25,
      label:    "Edu Beginner",
      color:    BADGE_COLORS.BRONZE,
      benefits: ["Basic tutor listing"],
    },
  ],
};

// ---------------------------------------------------------------------------
// LOGISTICS VERIFICATION STANDARD — Phase 34
// ---------------------------------------------------------------------------
export const LOGISTICS_STANDARD: IndustryVerificationStandard = {
  industrySlug:  "logistics",
  industryName:  "Logistics & Delivery",
  icon:          "🚚",
  accentColor:   "#FB923C",
  description:   "Verification for delivery riders, fleet owners, and logistics companies.",
  expiryMonths:  6,   // Vehicle registrations and licenses need frequent renewal check
  fastTrackEligible: true,
  autoApproveScore:  70,

  requiredDocuments: [
    {
      id:          "log_cnic",
      label:       "CNIC / Passport",
      description: "Government-issued identity proof",
      status:      "REQUIRED",
      scoreWeight: 15,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   5,
    },
    {
      id:          "log_driving_license",
      label:       "Driving License (valid)",
      description: "Current valid driving license appropriate for vehicle type",
      status:      "REQUIRED",
      scoreWeight: 25,
      acceptedFormats: ["pdf","jpg","png"],
      maxSizeMB:   5,
    },
    {
      id:          "log_vehicle_reg",
      label:       "Vehicle Registration Certificate",
      description: "Official vehicle registration document",
      status:      "REQUIRED",
      scoreWeight: 20,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
    {
      id:          "log_background_check",
      label:       "Police Clearance Certificate",
      description: "Background check certificate from local police (not older than 6 months)",
      status:      "REQUIRED",
      scoreWeight: 25,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   5,
    },
  ],

  optionalDocuments: [
    {
      id:          "log_company_reg",
      label:       "Logistics Company Registration",
      description: "For fleet owners: SECP / business registration",
      status:      "CONDITIONAL",
      scoreWeight: 15,
      acceptedFormats: ["pdf"],
      maxSizeMB:   5,
    },
    {
      id:          "log_insurance",
      label:       "Vehicle Insurance",
      description: "Valid insurance certificate for delivery vehicle",
      status:      "OPTIONAL",
      scoreWeight: 10,
      acceptedFormats: ["pdf","jpg"],
      maxSizeMB:   3,
    },
  ],

  verificationSteps: [
    { step: 1, title: "Document Upload",         description: "Upload license, vehicle reg, and background check",           automated: false, slaHours: 0  },
    { step: 2, title: "AI Document Scan",        description: "AI checks document completeness and expiry dates",            automated: true,  slaHours: 1  },
    { step: 3, title: "License Validity Check",  description: "Cross-reference license with NTRC / DVLA database",          automated: true,  slaHours: 4  },
    { step: 4, title: "Background Check Review", description: "Human reviewer checks police clearance certificate",         automated: false, slaHours: 24 },
    { step: 5, title: "GPS Onboarding",          description: "Rider installs EHB tracking app and completes test run",     automated: true,  slaHours: 2  },
    { step: 6, title: "Badge & Coverage Map",    description: "Logistics Verified badge + added to city coverage map",      automated: true,  slaHours: 1  },
  ],

  scoreWeights: {
    documents:   40,
    skills_test: 15,  // Test delivery run
    reviews:     25,
    jps:         10,
    license:     10,
  },

  badgeThresholds: [
    {
      badge:    "PLATINUM",
      minScore: 90,
      label:    "Logistics Elite",
      color:    BADGE_COLORS.PLATINUM,
      benefits: ["Priority order assignment", "Featured on coverage map", "Fleet management dashboard", "Zero late penalty for first 30 days"],
    },
    {
      badge:    "GOLD",
      minScore: 72,
      label:    "Logistics Verified",
      color:    BADGE_COLORS.GOLD,
      benefits: ["Verified rider badge", "Same-day delivery eligibility", "STL tracking enabled"],
    },
    {
      badge:    "SILVER",
      minScore: 50,
      label:    "Logistics Certified",
      color:    BADGE_COLORS.SILVER,
      benefits: ["Certified checkmark", "Standard delivery assignments"],
    },
    {
      badge:    "BRONZE",
      minScore: 25,
      label:    "Logistics Beginner",
      color:    BADGE_COLORS.BRONZE,
      benefits: ["Basic rider listing"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Master registry
// ---------------------------------------------------------------------------
export const INDUSTRY_STANDARDS: Record<string, IndustryVerificationStandard> = {
  it:        IT_STANDARD,
  health:    HEALTH_STANDARD,
  education: EDUCATION_STANDARD,
  logistics: LOGISTICS_STANDARD,
};

export function getStandard(slug: string): IndustryVerificationStandard | null {
  return INDUSTRY_STANDARDS[slug.toLowerCase()] ?? null;
}

// ---------------------------------------------------------------------------
// Calculate verification score from uploaded documents
// ---------------------------------------------------------------------------
export function calculateVerificationScore(
  standard: IndustryVerificationStandard,
  uploadedDocIds: string[],
  reviewScore?: number,   // 0–100 from human reviewer
  jpsScore?:    number,   // 0–1000 JPS
): number {
  const allDocs = [...standard.requiredDocuments, ...standard.optionalDocuments];

  // Document score (0–100)
  let totalDocWeight  = 0;
  let earnedDocWeight = 0;
  for (const doc of allDocs) {
    if (doc.status === "REQUIRED") totalDocWeight += doc.scoreWeight;
    if (uploadedDocIds.includes(doc.id)) earnedDocWeight += doc.scoreWeight;
  }
  const docScore = totalDocWeight > 0 ? (earnedDocWeight / totalDocWeight) * 100 : 0;

  // JPS normalized to 0–100
  const jpsNorm = jpsScore ? Math.min(100, (jpsScore / 1000) * 100) : 50;

  // Weighted composite
  const w = standard.scoreWeights;
  const composite =
    (docScore       * w.documents   / 100) +
    ((reviewScore ?? 50) * w.reviews     / 100) +
    (jpsNorm        * w.jps         / 100);

  return Math.round(Math.min(100, composite));
}
