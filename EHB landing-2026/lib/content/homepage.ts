export interface MarketplaceServiceItem {
  title: string;
  seller: string;
  price: string;
  rating: number;
  tag?: string;
  badge?: string;
  deptHint?: string;
}

export interface MarketplaceProductItem {
  title: string;
  price: string;
  rating: number;
  tag?: string;
  badge?: string;
  deptHint?: string;
}

export interface RecommendationItem {
  title: string;
  headline: string;
  desc: string;
  cta: string;
  href: string;
}

export interface DmoLandingCard {
  title: string;
  subtitle: string;
  details: string[];
  cta: string;
  href: string;
  image: string;
  alt: string;
  tone: string;
}

export interface HighlightCard {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  /** Internal route (e.g. /dashboard) — makes FeatureCard clickable */
  href: string;
}

export interface InfoCard {
  title: string;
  subtitle: string;
  description: string;
  accentClass: string;
  toneClass?: string;
  href?: string;
}

export interface InvestorReasonCard {
  title: string;
  description: string;
  href: string;
}

export interface PricingTierCard {
  title: string;
  subtitle: string;
  description: string[];
  accentClass: string;
  toneClass: string;
  href: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: LinkItem[];
}

export interface FooterPolicyLink extends LinkItem {}

export const homepageContent = {
  liveActivity: {
    events: [
      "Ali earned $20 from Web Design order.",
      "Sara completed a job in IT services.",
      "New order placed in Delivery services.",
      "Health provider completed 3 doctor consultations.",
      "New franchise inquiry from Dubai for Delivery services.",
      "User from Lahore booked a Travel package.",
    ],
  },
  marketplace: {
    filterChips: ["Top Rated", "Trending", "Fast Delivery"],
    services: [
      {
        title: "Logo Design",
        seller: "Creative Studio",
        price: "$25",
        rating: 4.8,
        tag: "High demand",
        badge: "⭐ Top Rated",
        deptHint: "DMO quality checks + PSS verified",
      },
      {
        title: "Website Development",
        seller: "Rafi Web Studio",
        price: "$200",
        rating: 4.9,
        tag: "Fast delivery",
        badge: "🔥 Trending",
        deptHint: "PSS + EHB-STL protected",
      },
      {
        title: "SEO Optimization",
        seller: "Growth Agency",
        price: "$50",
        rating: 4.7,
        tag: "Fast delivery",
        badge: "🆕 New",
        deptHint: "DMO monitoring + secure checkout",
      },
      {
        title: "Social Media Management",
        seller: "Brand Boosters",
        price: "$80",
        rating: 4.6,
        tag: "High demand",
        badge: "⭐ Top Rated",
        deptHint: "Verified provider + safe payment",
      },
    ] satisfies MarketplaceServiceItem[],
    products: [
      {
        title: "Laptop (GoSellr Store)",
        price: "$850",
        rating: 4.9,
        tag: "High demand",
        badge: "⭐ Top Rated",
        deptHint: "PSS sellers + EHB-STL checkout",
      },
      {
        title: "Medical Equipment Kit",
        price: "$320",
        rating: 4.7,
        tag: "Fast delivery",
        badge: "🔥 Trending",
        deptHint: "DMO quality checks + secure payment",
      },
      {
        title: "Education Bundle: Books + Courses",
        price: "$99",
        rating: 4.8,
        tag: "Fast delivery",
        badge: "🆕 New",
        deptHint: "Verified content + protected purchase",
      },
      {
        title: "Delivery Rider Gear Pack",
        price: "$60",
        rating: 4.5,
        tag: "High demand",
        badge: "⭐ Top Rated",
        deptHint: "Verified store + secure checkout",
      },
    ] satisfies MarketplaceProductItem[],
  },
  recommended: {
    aiStatusOptions: [
      "AI is analyzing opportunities...",
      "Finding best match for you...",
      "Optimizing your growth path...",
      "Boosting earning signals...",
    ],
    jobs: [
      {
        title: "Best job for you",
        headline: "Simple web design project",
        desc: "3-5 page website for a local business. Great if you know basic design or development.",
        cta: "View jobs",
        href: "/home",
      },
      {
        title: "Best job for you",
        headline: "Verified tutoring session",
        desc: "Teach math, English, or programming with trusted matching.",
        cta: "Find tutoring",
        href: "/home",
      },
      {
        title: "Best job for you",
        headline: "Small marketing campaign",
        desc: "SEO + social posts for a local shop. Start simple and grow fast.",
        cta: "See campaigns",
        href: "/home",
      },
    ] satisfies RecommendationItem[],
    services: [
      {
        title: "Best service to offer",
        headline: "Profile setup & optimization",
        desc: "Help others create strong EHB profiles. Perfect if you understand photos, descriptions, and pricing.",
        cta: "Create service",
        href: "/dashboard",
      },
      {
        title: "Best service to offer",
        headline: "Website + landing page package",
        desc: "Offer a complete mini site with verified checkout and fast delivery.",
        cta: "Create service",
        href: "/dashboard",
      },
      {
        title: "Best service to offer",
        headline: "Basic cybersecurity audit",
        desc: "A beginner-friendly security starter: checks, reports, and verified recommendations.",
        cta: "Create service",
        href: "/dashboard",
      },
    ] satisfies RecommendationItem[],
    trends: [
      {
        title: "Trending in your area",
        headline: "Delivery + small business services",
        desc: "Local delivery, printing, basic tech help, and tutoring stay in demand in most cities.",
        cta: "Explore ideas",
        href: "/ai-marketplace",
      },
      {
        title: "Trending in your area",
        headline: "Health appointments + verified care",
        desc: "Patients book doctors faster with AI suggestions and verified outcomes.",
        cta: "Explore care",
        href: "/landing/health",
      },
      {
        title: "Trending in your area",
        headline: "IT support for businesses",
        desc: "Small companies need fast help: apps, websites, and tech troubleshooting.",
        cta: "Explore IT",
        href: "/landing/it",
      },
    ] satisfies RecommendationItem[],
  },
  dmoLanding: {
    onboardingCards: [
      {
        title: "Central Control System",
        subtitle: "Manage approvals, alerts, applications, and live operations in one place.",
        details: [
          "DMO gives users, teams, and administrators one central place to understand what is happening across the platform at any moment.",
          "Instead of checking separate systems for approvals, alerts, applications, and performance, everything is tracked through one clear control layer.",
          "This makes the platform easier to trust, easier to manage, and easier to scale as more services and industries are added.",
        ],
        cta: "Explore DMO",
        href: "/dmo/home",
        image: "/images/cards/dmo-control-center.svg",
        alt: "DMO control center with connected analytics cards and system flow",
        tone: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
      },
      {
        title: "Identity & Security Verification",
        subtitle: "Verify people and businesses with KYC, AML, and fraud protection.",
        details: [
          "PSS checks whether a user or business is real before they start offering services, products, or professional work inside the ecosystem.",
          "It combines identity verification, AML review, and fraud signals so risky profiles can be filtered before they affect other users.",
          "For first-time users, this means the platform feels safer because trust starts before the transaction begins.",
        ],
        cta: "See Security",
        href: "/verification",
        image: "/images/cards/pss-identity-security.svg",
        alt: "PSS identity verification with shield, user profile, and secure checkmarks",
        tone: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
      },
      {
        title: "Certification & Registry",
        subtitle: "Certify skills, services, products, and companies with trusted records.",
        details: [
          "CRB helps users understand that important claims are not just words, they are supported by formal review, inspection, and registry records.",
          "Skills, services, products, and companies can all be certified so buyers and partners can make better decisions with more confidence.",
          "It also keeps approval history, certification status, and renewal information visible and organized.",
        ],
        cta: "View Certification",
        href: "/certification",
        image: "/images/cards/crb-certification.svg",
        alt: "CRB certification card with certificate ribbon and verified compliance blocks",
        tone: "from-violet-500/20 to-indigo-500/10 border-violet-400/30",
      },
      {
        title: "Ground Verification Network",
        subtitle: "Real-world inspections and franchise validation build real trust.",
        details: [
          "Franchise verification adds a physical layer to the digital system, so important checks can also be confirmed in the real world when required.",
          "This is useful for business locations, service claims, local operations, and any case where on-ground inspection increases trust.",
          "It helps new users feel that EHB is not only online verification, but a complete trust network backed by real action.",
        ],
        cta: "See Franchise Model",
        href: "/franchise",
        image: "/images/cards/franchise-field-network.svg",
        alt: "Franchise field network with city nodes, inspections, and location markers",
        tone: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
      },
      {
        title: "Trust Score Engine",
        subtitle: "A smart trust level that improves visibility, ranking, and confidence.",
        details: [
          "STL turns verification, performance, and behavior into one trust score that helps users quickly understand who is more reliable on the platform.",
          "A higher trust score can improve ranking, visibility, and buyer confidence, while weak trust signals can reduce exposure and credibility.",
          "For first-time visitors, this makes the system easier to understand because trust is shown clearly instead of being hidden.",
        ],
        cta: "Understand STL",
        href: "/dmo/stl",
        image: "/images/cards/stl-trust-score.svg",
        alt: "STL trust score dashboard with score meter and ranking signals",
        tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
      },
      {
        title: "Multi-Industry Verification",
        subtitle: "Add extra trust by verifying businesses across multiple industry sectors.",
        details: [
          "Industry verification shows whether a business or service can be trusted within one or more specific sectors such as health, technology, or manufacturing.",
          "This adds a deeper layer of confidence because users can see that trust is not general only, it is connected to real industry standards.",
          "It strengthens the entire ecosystem by helping businesses build credibility in the exact fields where they operate.",
        ],
        cta: "Explore Industries",
        href: "/industries",
        image: "/images/cards/industry-verification.svg",
        alt: "Industry verification with connected sectors like health, tech, and manufacturing",
        tone: "from-rose-500/20 to-pink-500/10 border-rose-400/30",
      },
    ] satisfies DmoLandingCard[],
    flow: [
      "Start with one EHB account for your profile or business.",
      "PSS checks identity, risk, and compliance details.",
      "CRB validates service quality, products, or company claims.",
      "Franchise teams handle real-world inspection when needed.",
      "DMO records the decision and controls approvals centrally.",
      "STL updates trust score, visibility, and platform confidence.",
    ],
    quickBenefits: [
      "Understand the platform in under one minute",
      "See how trust is built before buying or selling",
      "Know why verified users rank higher in the system",
    ],
    trustSystemBullets: [
      "✔ Verified Identity",
      "✔ Verified Business",
      "✔ Verified Product",
      "✔ Verified Performance",
    ],
    continuousVerificationBullets: [
      "⏳ Six-month verification cycle",
      "🔄 Mandatory renewal workflow",
      "⚠ Expiry triggers trust downgrade",
    ],
    visionPills: [
      "Multi-country support",
      "Franchise-driven physical verification",
      "Blockchain-ready trust infrastructure",
    ],
  },
  sections: {
    earningMethods: [
      {
        title: "Work as a User",
        description: "Offer your skills, complete jobs, and earn from local and global clients.",
        icon: "🧑‍💼",
        accentColor: "#22c55e",
        href: "/dashboard",
      },
      {
        title: "Freelance Globally",
        description: "Work online in IT, design, marketing, and more from anywhere.",
        icon: "💻",
        accentColor: "#f59e0b",
        href: "/jobs",
      },
      {
        title: "Sell Products",
        description: "List your products and sell to customers worldwide.",
        icon: "🛒",
        accentColor: "#3b82f6",
        href: "/gosellr",
      },
      {
        title: "Become a Franchise Partner",
        description: "Manage your area and earn from every order in your region.",
        icon: "🏢",
        accentColor: "#e11d48",
        href: "/franchise",
      },
    ] satisfies HighlightCard[],
    platformComparison: {
      ehb: [
        "All industries in one platform",
        "AI-powered matching",
        "Verified users and services",
        "Earn in multiple ways",
        "Franchise business model",
      ],
      others: [
        "Limited to one category",
        "No AI matching",
        "No full verification system",
        "Only one main income source",
        "No franchise or local business ownership",
      ],
    },
    aiFeatures: [
      {
        icon: "🌍",
        title: "Global buyers and sellers",
        description: "People from different countries can buy and sell services and products with one simple, verified EHB account.",
        badge: "Verified identity (PSS)",
        accentColor: "#00AEEF",
        href: "/global",
      },
      {
        icon: "🧩",
        title: "All services in one place",
        description: "From education and health to IT and logistics, EHB connects 32 industries so you don't need separate platforms.",
        badge: "700+ services",
        accentColor: "#22C55E",
        href: "/industries",
      },
      {
        icon: "🛡️",
        title: "100% verified services and products",
        description: "Strong verification checks help remove fake listings so users can trust that services and products are real.",
        badge: "DMO + PSS checks",
        accentColor: "#F59E0B",
        href: "/verification",
      },
      {
        icon: "⛓️",
        title: "Blockchain-inspired franchise model",
        description: "Franchise layers work like a secure network, so city, regional, and country partners can grow together with clear rules.",
        badge: "EHB-STL protected",
        accentColor: "#E53935",
        href: "/blockchain-governance",
      },
    ],
    dmoOverviewCards: [
      {
        title: "Platform Operations",
        subtitle: "Daily monitoring and control",
        description: "Handles live platform status, incidents, and quality checks so that services, jobs, and payments stay stable 24/7.",
        accentClass: "border-[#3b82f6]/40",
        toneClass: "text-[#3b82f6]",
        href: "/dmo/home",
      },
      {
        title: "Data & Reporting",
        subtitle: "Dashboards and insights",
        description: "Builds internal dashboards for users, orders, and franchise performance so leadership can take fast, data-backed decisions.",
        accentClass: "border-emerald-400/40",
        toneClass: "text-emerald-300",
        href: "/dmo/analytics",
      },
      {
        title: "Content & Communication",
        subtitle: "Messaging and guidelines",
        description: "Manages platform text, announcements, and internal documentation so that every department follows the same clear language and rules.",
        accentClass: "border-amber-400/40",
        toneClass: "text-amber-300",
        href: "/dmo/notifications",
      },
      {
        title: "Process Automation",
        subtitle: "Workflows and approvals",
        description: "Designs digital workflows for onboarding, verification, ticketing, and approvals so work moves in a clean, trackable way.",
        accentClass: "border-violet-400/40",
        toneClass: "text-violet-200",
        href: "/dmo/automation",
      },
      {
        title: "Training & Support",
        subtitle: "Internal enablement",
        description: "Prepares training material, SOPs, and digital help centers for EHB teams, franchises, and support staff.",
        accentClass: "border-rose-400/40",
        toneClass: "text-rose-200",
        href: "/dmo/queue",
      },
      {
        title: "Coordination with Other Departments",
        subtitle: "Central connection point",
        description: "Works together with Development, Admin, AI, Franchise, and Marketing departments so that every new feature is launched in an organized way.",
        accentClass: "border-sky-400/40",
        toneClass: "text-sky-200",
        href: "/dmo",
      },
    ] satisfies InfoCard[],
    monetizationCards: [
      {
        title: "User earning",
        subtitle: "Earn from services, jobs, and products.",
        description: "Individuals and teams make money by completing jobs, selling services, and offering products in 32 industries.",
        accentClass: "border-[#3b82f6]/40",
        toneClass: "text-[#3b82f6]",
        href: "/home",
      },
      {
        title: "Franchise earning",
        subtitle: "Earn from every order in your area.",
        description: "City, regional, and country partners earn a share of all verified orders that pass through their zone.",
        accentClass: "border-[#22c55e]/40",
        toneClass: "text-[#22c55e]",
        href: "/franchise",
      },
      {
        title: "Platform earning",
        subtitle: "EHB earns small fees per transaction.",
        description: "A low, transparent service fee is charged on successful orders, creating a scalable revenue engine.",
        accentClass: "border-amber-400/40",
        toneClass: "text-amber-300",
        href: "/wallet",
      },
    ] satisfies InfoCard[],
    pricingTiers: [
      {
        title: "Pricing & fees",
        subtitle: "Simple and transparent.",
        description: [
          "Clear fee shown before confirmation.",
          "No hidden charges or surprise deductions.",
          "Lower fees for high-quality, verified users.",
        ],
        accentClass: "border-white/15",
        toneClass: "text-ehb-textBody",
        href: "/cart",
      },
      {
        title: "Free vs Premium (future-ready)",
        subtitle: "Upgrade path for power users.",
        description: [
          "Free: basic access to jobs, services, and marketplace.",
          "Premium: more visibility in search and listings.",
          "Premium: stronger AI recommendations and insights.",
          "Premium: potentially lower service fees.",
        ],
        accentClass: "border-[#3b82f6]/40",
        toneClass: "text-[#3b82f6]",
        href: "/dashboard",
      },
      {
        title: "EHBGC token vision",
        subtitle: "Utility for fees, rewards, and premium.",
        description: [
          "Use EHBGC in the future to lower platform fees.",
          "Unlock premium features and higher visibility.",
          "Earn rewards and bonuses for positive activity.",
          "Positioned for a future blockchain ecosystem.",
        ],
        accentClass: "border-violet-400/40",
        toneClass: "text-violet-200",
        href: "/blockchain-governance",
      },
    ] satisfies PricingTierCard[],
    earningsPotential: {
      userPoints: [
        "Earn $100 to $1000 per month by offering services or doing jobs.",
        "Start small and grow your income as your skills and ratings improve.",
      ],
      franchiseBars: [20, 40, 55, 75, 95],
    },
    franchise: {
      benefitLines: [
        "Reserve a city or region before someone else does.",
        "Onboard local services, shops, and riders under one brand.",
        "Earn a share from every completed order in your zone.",
        "Use AI and dashboards to see which areas need more focus.",
      ],
      snapshotBars: [30, 60, 40, 80, 55],
      levels: [
        {
          title: "Sub Franchise",
          description: "Manage local city-level operations, onboard providers, and earn from every order in your zone.",
          color: "#3b82f6",
          href: "/dmo/franchise/sub",
        },
        {
          title: "Master Franchise",
          description: "Control multiple cities or regions with higher earning potential and operational scope.",
          color: "#f59e0b",
          highlighted: true,
          href: "/dmo/franchise/master",
        },
        {
          title: "Corporate Franchise",
          description: "National or country-level franchise with maximum earning power and ecosystem influence.",
          color: "#f97316",
          href: "/dmo/franchise/corporate",
        },
      ],
    },
    investorReasons: [
      {
        title: "Multi-industry platform",
        description: "32 industries under one roof reduce fragmentation and increase cross-selling potential.",
        href: "/industries",
      },
      {
        title: "AI-driven ecosystem",
        description: "Matching, recommendations, and risk controls improve as more users and transactions flow through the system.",
        href: "/ai-ecosystem",
      },
      {
        title: "Scalable franchise model",
        description: "City, regional, and country layers allow rapid geographic expansion with aligned incentives.",
        href: "/dmo/franchise",
      },
      {
        title: "Global expansion potential",
        description: "The same core engine can serve multiple countries with localized providers and franchises.",
        href: "/global",
      },
    ] satisfies InvestorReasonCard[],
    footer: {
      groups: [
        {
          title: "Industries",
          links: [
            { label: "Browse all", href: "#industries" },
            { label: "Health", href: "/landing/health" },
            { label: "Education", href: "/landing/education" },
            { label: "IT", href: "/landing/it" },
          ],
        },
        {
          title: "Marketplace",
          links: [
            { label: "AI Marketplace", href: "/ai-marketplace" },
            { label: "Services", href: "/services" },
          ],
        },
        {
          title: "Franchise",
          links: [{ label: "Opportunities", href: "/franchise" }],
        },
        {
          title: "Jobs",
          links: [{ label: "JPS & Jobs", href: "/home" }],
        },
        {
          title: "About EHB",
          links: [
            { label: "Development", href: "/development" },
            { label: "Admin", href: "/admin" },
          ],
        },
        {
          title: "Help Center",
          links: [{ label: "Dashboard", href: "/dashboard" }],
        },
      ] satisfies FooterGroup[],
      policyLinks: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use", href: "#" },
        { label: "Company Info", href: "#" },
      ] satisfies FooterPolicyLink[],
    },
  },
};
