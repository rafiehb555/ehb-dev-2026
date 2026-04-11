// =============================================================================
// EHB DEMO MODE
// Special features for Investor Demonstrations
// =============================================================================

// Demo mode flag - set to true during investor presentations
export const DEMO_MODE = true;

// Demo configuration
export const DEMO_CONFIG = {
  // Faster animations for demo
  animationSpeed: 'fast', // 'normal' | 'fast' | 'instant'
  
  // Show demo indicators
  showDemoIndicators: false, // Set false during real presentation
  
  // Pre-fill forms for faster demo
  autoFillForms: true,
  
  // Show success states more quickly
  instantSuccess: false,
  
  // Demo user profile
  demoUser: {
    name: 'Demo User',
    email: 'demo@ehblaw.com',
    role: 'client',
    country: 'PK',
    language: 'en',
  },
};

// =============================================================================
// DEMO STATISTICS (Impressive numbers for presentation)
// =============================================================================

export const DEMO_STATS = {
  // Platform stats
  totalUsers: 125000,
  totalLawyers: 25000,
  totalCases: 450000,
  countriesActive: 12,
  countriesPlanned: 50,
  languagesSupported: 6,
  
  // AI stats
  aiAgents: 14,
  aiTasksCompleted: 2500000,
  aiAccuracy: 94.5,
  
  // Financial stats
  totalTransactions: 850000000, // $850M
  monthlyRevenue: 12500000, // $12.5M
  avgCaseValue: 1500,
  
  // Performance stats
  avgResponseTime: '< 2 hours',
  caseSuccessRate: 87,
  clientSatisfaction: 4.8,
  lawyerRetention: 92,
  
  // Growth stats
  monthlyGrowth: 25, // percentage
  newLawyersPerMonth: 500,
  newCasesPerDay: 450,
};

// =============================================================================
// DEMO SCENARIOS (Pre-configured demo flows)
// =============================================================================

export const DEMO_SCENARIOS = {
  // Scenario 1: Divorce case flow
  divorceCase: {
    userInput: 'I want to file a divorce case',
    userInputUrdu: 'مجھے طلاق کا کیس فائل کرنا ہے',
    caseType: 'divorce',
    steps: [
      { phase: 'intent_detection', duration: 1000 },
      { phase: 'information_collection', duration: 3000 },
      { phase: 'document_upload', duration: 2000 },
      { phase: 'lawyer_matching', duration: 2500 },
      { phase: 'case_creation', duration: 1500 },
    ],
    matchedLawyer: {
      name: 'Fatima Khan',
      specialization: 'Family Law',
      matchScore: 96,
      rating: 4.8,
    },
  },
  
  // Scenario 2: Property dispute flow
  propertyDispute: {
    userInput: 'I have a property dispute',
    userInputUrdu: 'میرا جائیداد کا تنازعہ ہے',
    caseType: 'property_dispute',
    steps: [
      { phase: 'intent_detection', duration: 800 },
      { phase: 'case_analysis', duration: 2000 },
      { phase: 'strategy_suggestion', duration: 2500 },
      { phase: 'lawyer_matching', duration: 2000 },
    ],
    matchedLawyer: {
      name: 'Ahmed Raza',
      specialization: 'Property Law',
      matchScore: 94,
      rating: 4.9,
    },
  },
  
  // Scenario 3: Quick consultation
  quickConsultation: {
    userInput: 'I need legal advice',
    steps: [
      { phase: 'category_selection', duration: 500 },
      { phase: 'lawyer_list', duration: 1000 },
      { phase: 'booking', duration: 1500 },
    ],
  },
};

// =============================================================================
// DEMO AUTO-FILL DATA
// =============================================================================

export const DEMO_FORM_DATA = {
  // Client information
  clientInfo: {
    fullName: 'Ahmed Hassan',
    phone: '+92 300 1234567',
    email: 'ahmed@example.com',
    city: 'Lahore',
    country: 'Pakistan',
  },
  
  // Divorce case details
  divorceCase: {
    spouseName: 'Fatima Ahmed',
    marriageDate: '2018-06-15',
    children: 'Yes - 2',
    reason: 'Irreconcilable differences',
    separationDate: '2025-12-01',
  },
  
  // Property case details
  propertyCase: {
    propertyType: 'Residential Plot',
    propertyLocation: '123 Gulberg III, Lahore',
    propertyValue: 'PKR 50,000,000',
    disputeType: 'Illegal possession',
    opponentName: 'Muhammad Ali',
  },
  
  // Payment details (for display only)
  paymentCard: {
    number: '**** **** **** 4242',
    expiry: '12/28',
    name: 'Ahmed Hassan',
  },
};

// =============================================================================
// DEMO AI RESPONSES (Pre-written intelligent responses)
// =============================================================================

export const DEMO_AI_RESPONSES = {
  // Welcome messages
  welcome: {
    en: "Hello! I'm EHB AI, your intelligent legal assistant. I can help you with any legal matter - from filing cases to finding lawyers. How can I assist you today?",
    ur: "السلام علیکم! میں EHB AI ہوں، آپ کا ذہین قانونی معاون۔ میں کیس فائل کرنے سے لے کر وکیل تلاش کرنے تک ہر قانونی معاملے میں آپ کی مدد کر سکتا ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
  },
  
  // Case detection
  caseDetection: {
    divorce: {
      en: "I understand you want to file a divorce case. I'll guide you through the entire process. Let me ask you a few questions to understand your situation better.",
      ur: "میں سمجھ گیا کہ آپ طلاق کا کیس فائل کرنا چاہتے ہیں۔ میں پورے عمل میں آپ کی رہنمائی کروں گا۔ آپ کی صورتحال کو بہتر سمجھنے کے لیے میں کچھ سوالات پوچھتا ہوں۔",
    },
    property: {
      en: "I see you have a property dispute. Property matters require careful handling. Let me analyze your situation and suggest the best legal strategy.",
      ur: "میں دیکھ رہا ہوں کہ آپ کا جائیداد کا تنازعہ ہے۔ جائیداد کے معاملات کو احتیاط سے نمٹانے کی ضرورت ہوتی ہے۔ میں آپ کی صورتحال کا جائزہ لے کر بہترین قانونی حکمت عملی تجویز کرتا ہوں۔",
    },
  },
  
  // Lawyer matching
  lawyerMatch: {
    en: "Based on your case details, I've found the perfect lawyer for you. This lawyer specializes in your case type and has a high success rate in similar cases.",
    ur: "آپ کے کیس کی تفصیلات کی بنیاد پر، میں نے آپ کے لیے بہترین وکیل تلاش کر لیا ہے۔ یہ وکیل آپ کے کیس کی قسم میں ماہر ہے اور اسی طرح کے کیسز میں کامیابی کی شرح زیادہ ہے۔",
  },
  
  // Case created
  caseCreated: {
    en: "Congratulations! Your case has been successfully created and assigned to your lawyer. You can track the progress from your dashboard. Your lawyer will contact you within 24 hours.",
    ur: "مبارک ہو! آپ کا کیس کامیابی سے بن گیا ہے اور آپ کے وکیل کو تفویض کر دیا گیا ہے۔ آپ اپنے ڈیش بورڈ سے پیش رفت دیکھ سکتے ہیں۔ آپ کا وکیل 24 گھنٹے کے اندر آپ سے رابطہ کرے گا۔",
  },
  
  // Analysis complete
  analysisComplete: {
    en: "I've analyzed your case. Here's what I found: Your case has a strong foundation with approximately 78% success probability. I recommend proceeding with the legal notice first, followed by court filing if needed.",
    ur: "میں نے آپ کے کیس کا جائزہ لے لیا ہے۔ میرا تجزیہ یہ ہے: آپ کے کیس کی بنیاد مضبوط ہے اور تقریباً 78% کامیابی کا امکان ہے۔ میری سفارش ہے کہ پہلے قانونی نوٹس بھیجیں، اور اگر ضرورت ہو تو عدالت میں کیس دائر کریں۔",
  },
};

// =============================================================================
// DEMO UTILITY FUNCTIONS
// =============================================================================

// Get demo statistic with formatting
export function getDemoStat(key: keyof typeof DEMO_STATS, format: boolean = true): string | number {
  const value = DEMO_STATS[key];
  
  if (!format) return value;
  
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  }
  
  return value;
}

// Get appropriate AI response
export function getDemoAIResponse(
  category: keyof typeof DEMO_AI_RESPONSES,
  subCategory?: string,
  language: 'en' | 'ur' = 'en'
): string {
  const categoryResponses = DEMO_AI_RESPONSES[category];
  
  if (typeof categoryResponses === 'object' && 'en' in categoryResponses) {
    return categoryResponses[language];
  }
  
  if (subCategory && typeof categoryResponses === 'object') {
    const subResponse = (categoryResponses as any)[subCategory];
    if (subResponse && typeof subResponse === 'object') {
      return subResponse[language];
    }
  }
  
  return '';
}

// Simulate realistic typing delay
export async function simulateTyping(text: string, onChar: (char: string) => void): Promise<void> {
  for (const char of text) {
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
    onChar(char);
  }
}

// Get demo scenario
export function getDemoScenario(scenarioKey: keyof typeof DEMO_SCENARIOS) {
  return DEMO_SCENARIOS[scenarioKey];
}

// Auto-fill form with demo data
export function getAutoFillData(formType: keyof typeof DEMO_FORM_DATA) {
  return DEMO_FORM_DATA[formType];
}

// =============================================================================
// DEMO PRESENTATION HELPERS
// =============================================================================

export const PRESENTATION_HELPERS = {
  // Key talking points for each screen
  talkingPoints: {
    homepage: [
      "Notice the AI assistant available on every page",
      "25,000+ verified lawyers across 50+ countries",
      "Multi-language support for global reach",
    ],
    aiAgent: [
      "Watch how AI understands natural language",
      "From voice command to filed case in 5 minutes",
      "No legal knowledge required from user",
    ],
    lawyerDashboard: [
      "Complete practice management for lawyers",
      "STL verification ensures quality",
      "Revenue tracking and analytics",
    ],
    payments: [
      "Escrow system protects both parties",
      "Multiple payment methods including crypto",
      "Our EHBGC platform coin reduces fees",
    ],
    franchise: [
      "Scalable franchise model for growth",
      "Revenue share with local partners",
      "Technology-first expansion strategy",
    ],
  },
  
  // Investor FAQ quick answers
  faqAnswers: {
    revenue: "We generate revenue through: Transaction fees (5-10%), Lawyer subscriptions, Franchise fees, and Premium features.",
    market: "The global legal services market is $900B. We're targeting 1% in 5 years.",
    competition: "Unlike LegalZoom or Rocket Lawyer, we're AI-first and global-first. We support 6 languages and operate across borders.",
    team: "Our team includes legal experts, AI engineers, and business development professionals across 5 countries.",
    technology: "Built on modern architecture: Next.js, TypeScript, AI/ML models, and blockchain for payments.",
  },
};

export default {
  DEMO_MODE,
  DEMO_CONFIG,
  DEMO_STATS,
  DEMO_SCENARIOS,
  DEMO_FORM_DATA,
  DEMO_AI_RESPONSES,
  getDemoStat,
  getDemoAIResponse,
  simulateTyping,
  getDemoScenario,
  getAutoFillData,
  PRESENTATION_HELPERS,
};
