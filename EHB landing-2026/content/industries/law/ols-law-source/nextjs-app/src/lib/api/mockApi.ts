// =============================================================================
// EHB MOCK API LAYER
// Future-Ready API Structure for Investor Demo
// =============================================================================
// 
// PURPOSE:
// This file provides mock API functions that simulate real backend calls.
// The structure mirrors what the real API will look like, making future
// backend integration seamless.
//
// USAGE:
// Instead of: createCase(data)
// Use: api.cases.create(data)
//
// When backend is ready, simply update these functions to make real API calls.
// =============================================================================

// Simulate network delay for realistic feel
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Random ID generator
const generateId = () => `ehb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// =============================================================================
// MOCK DATA STORES (In-memory for demo)
// =============================================================================

let mockCases: any[] = [];
let mockPayments: any[] = [];
let mockConsultations: any[] = [];
let mockNotifications: any[] = [];

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  // Login user
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    await simulateDelay(1000);
    
    // Demo: Accept any login
    return {
      success: true,
      data: {
        user: {
          id: 'user-demo-001',
          email,
          name: 'Demo User',
          role: 'client',
          avatar: '/avatars/default.png',
        },
        token: 'demo-jwt-token-' + generateId(),
      },
      message: 'Login successful',
    };
  },

  // Register user
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    country: string;
  }): Promise<ApiResponse<any>> {
    await simulateDelay(1200);
    
    return {
      success: true,
      data: {
        user: {
          id: generateId(),
          ...data,
          role: 'client',
          createdAt: new Date().toISOString(),
        },
      },
      message: 'Registration successful',
    };
  },

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<any>> {
    await simulateDelay(500);
    
    return {
      success: true,
      data: {
        id: 'user-demo-001',
        email: 'demo@ehblaw.com',
        name: 'Demo User',
        role: 'client',
        country: 'PK',
        language: 'en',
      },
    };
  },

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    await simulateDelay(300);
    return { success: true, message: 'Logged out successfully' };
  },
};

// =============================================================================
// CASES API
// =============================================================================

export const casesApi = {
  // Create new case
  async create(data: {
    caseType: string;
    title: string;
    description: string;
    clientInfo: any;
    documents?: string[];
  }): Promise<ApiResponse<any>> {
    await simulateDelay(1500);
    
    const newCase = {
      id: generateId(),
      caseNumber: `CASE-${Date.now().toString().slice(-6)}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCases.push(newCase);
    
    return {
      success: true,
      data: newCase,
      message: 'Case created successfully',
    };
  },

  // Get all cases for user
  async getAll(): Promise<ApiResponse<any[]>> {
    await simulateDelay(800);
    
    // Return mock cases + demo cases
    const demoCases = [
      {
        id: 'case-demo-001',
        caseNumber: 'CASE-2026-001',
        caseType: 'property_dispute',
        title: 'Property Possession Case',
        status: 'in_progress',
        lawyer: {
          id: 'lawyer-001',
          name: 'Ahmed Raza',
          avatar: '/lawyers/ahmed.jpg',
        },
        nextHearing: '2026-03-25',
        progress: 65,
        createdAt: '2026-02-15',
      },
      {
        id: 'case-demo-002',
        caseNumber: 'CASE-2026-002',
        caseType: 'divorce',
        title: 'Family Court Matter',
        status: 'document_review',
        lawyer: {
          id: 'lawyer-002',
          name: 'Fatima Khan',
          avatar: '/lawyers/fatima.jpg',
        },
        progress: 35,
        createdAt: '2026-03-01',
      },
    ];
    
    return {
      success: true,
      data: [...demoCases, ...mockCases],
    };
  },

  // Get case by ID
  async getById(caseId: string): Promise<ApiResponse<any>> {
    await simulateDelay(600);
    
    return {
      success: true,
      data: {
        id: caseId,
        caseNumber: 'CASE-2026-001',
        caseType: 'property_dispute',
        title: 'Property Possession Case',
        description: 'Dispute regarding illegal possession of property in Lahore.',
        status: 'in_progress',
        progress: 65,
        lawyer: {
          id: 'lawyer-001',
          name: 'Ahmed Raza',
          specialization: 'Property Law',
          rating: 4.8,
        },
        timeline: [
          { date: '2026-02-15', event: 'Case Created', status: 'completed' },
          { date: '2026-02-18', event: 'Lawyer Assigned', status: 'completed' },
          { date: '2026-02-25', event: 'Documents Submitted', status: 'completed' },
          { date: '2026-03-01', event: 'Legal Notice Sent', status: 'completed' },
          { date: '2026-03-10', event: 'Court Filing', status: 'completed' },
          { date: '2026-03-25', event: 'First Hearing', status: 'pending' },
        ],
        documents: [
          { name: 'Property Deed', status: 'verified' },
          { name: 'Identity Card', status: 'verified' },
          { name: 'Possession Evidence', status: 'under_review' },
        ],
      },
    };
  },

  // Update case status
  async updateStatus(caseId: string, status: string): Promise<ApiResponse<any>> {
    await simulateDelay(500);
    
    return {
      success: true,
      data: { id: caseId, status },
      message: 'Case status updated',
    };
  },
};

// =============================================================================
// LAWYERS API
// =============================================================================

export const lawyersApi = {
  // Get all lawyers
  async getAll(filters?: {
    specialization?: string;
    country?: string;
    minRating?: number;
  }): Promise<ApiResponse<any[]>> {
    await simulateDelay(800);
    
    const lawyers = [
      {
        id: 'lawyer-001',
        name: 'Ahmed Raza',
        title: 'Senior Advocate',
        specialization: ['Property Law', 'Civil Litigation'],
        experience: 15,
        rating: 4.9,
        reviewCount: 234,
        successRate: 87,
        sqlLevel: 5,
        hourlyRate: 5000,
        currency: 'PKR',
        country: 'PK',
        city: 'Lahore',
        avatar: '/lawyers/ahmed.jpg',
        verified: true,
      },
      {
        id: 'lawyer-002',
        name: 'Fatima Khan',
        title: 'Family Law Expert',
        specialization: ['Family Law', 'Divorce'],
        experience: 12,
        rating: 4.8,
        reviewCount: 189,
        successRate: 92,
        sqlLevel: 4,
        hourlyRate: 4500,
        currency: 'PKR',
        country: 'PK',
        city: 'Karachi',
        avatar: '/lawyers/fatima.jpg',
        verified: true,
      },
      {
        id: 'lawyer-003',
        name: 'Mohammad Ali',
        title: 'Corporate Lawyer',
        specialization: ['Corporate Law', 'Business Law'],
        experience: 18,
        rating: 4.7,
        reviewCount: 156,
        successRate: 85,
        sqlLevel: 5,
        hourlyRate: 8000,
        currency: 'PKR',
        country: 'PK',
        city: 'Islamabad',
        avatar: '/lawyers/ali.jpg',
        verified: true,
      },
      {
        id: 'lawyer-004',
        name: 'Sarah Ahmed',
        title: 'Immigration Specialist',
        specialization: ['Immigration Law', 'Visa Applications'],
        experience: 10,
        rating: 4.9,
        reviewCount: 312,
        successRate: 94,
        sqlLevel: 4,
        hourlyRate: 150,
        currency: 'USD',
        country: 'AE',
        city: 'Dubai',
        avatar: '/lawyers/sarah.jpg',
        verified: true,
      },
    ];
    
    return {
      success: true,
      data: lawyers,
    };
  },

  // Get lawyer by ID
  async getById(lawyerId: string): Promise<ApiResponse<any>> {
    await simulateDelay(600);
    
    return {
      success: true,
      data: {
        id: lawyerId,
        name: 'Ahmed Raza',
        title: 'Senior Advocate High Court',
        bio: 'With over 15 years of experience in property law and civil litigation, I have successfully handled hundreds of cases across Pakistan.',
        specialization: ['Property Law', 'Civil Litigation', 'Land Disputes'],
        experience: 15,
        rating: 4.9,
        reviewCount: 234,
        successRate: 87,
        casesCompleted: 450,
        sqlLevel: 5,
        hourlyRate: 5000,
        monthlyRate: 80000,
        currency: 'PKR',
        country: 'PK',
        city: 'Lahore',
        languages: ['English', 'Urdu', 'Punjabi'],
        education: [
          { degree: 'LLB', institution: 'Punjab University', year: 2008 },
          { degree: 'LLM', institution: 'Cambridge University', year: 2012 },
        ],
        barCouncil: 'Pakistan Bar Council',
        licenseNumber: 'PBC-2008-12345',
        availability: 'Available',
        responseTime: '< 2 hours',
        reviews: [
          { user: 'Ali K.', rating: 5, comment: 'Excellent lawyer, very professional.' },
          { user: 'Sara M.', rating: 5, comment: 'Won my property case. Highly recommend.' },
        ],
      },
    };
  },

  // Match lawyers for case
  async matchForCase(caseType: string, location: string): Promise<ApiResponse<any[]>> {
    await simulateDelay(1200);
    
    return {
      success: true,
      data: [
        {
          lawyer: { id: 'lawyer-001', name: 'Ahmed Raza', rating: 4.9 },
          matchScore: 94,
          reasons: ['Property law expert', 'Same city', 'High success rate'],
        },
        {
          lawyer: { id: 'lawyer-003', name: 'Mohammad Ali', rating: 4.7 },
          matchScore: 87,
          reasons: ['Civil litigation experience', 'Verified SQL 5'],
        },
        {
          lawyer: { id: 'lawyer-005', name: 'Usman Khan', rating: 4.6 },
          matchScore: 82,
          reasons: ['Property disputes', 'Good reviews'],
        },
      ],
    };
  },

  // Hire lawyer
  async hire(data: {
    lawyerId: string;
    caseId: string;
    contractType: 'case_based' | 'hourly' | 'monthly';
  }): Promise<ApiResponse<any>> {
    await simulateDelay(1500);
    
    return {
      success: true,
      data: {
        contractId: generateId(),
        ...data,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
      },
      message: 'Lawyer hired successfully',
    };
  },
};

// =============================================================================
// PAYMENTS API
// =============================================================================

export const paymentsApi = {
  // Create payment
  async create(data: {
    amount: number;
    currency: string;
    type: 'case_payment' | 'consultation' | 'subscription';
    method: 'card' | 'bank' | 'crypto' | 'ehbgc';
    caseId?: string;
  }): Promise<ApiResponse<any>> {
    await simulateDelay(2000);
    
    const payment = {
      id: generateId(),
      transactionId: `TXN-${Date.now()}`,
      ...data,
      status: 'completed',
      escrowStatus: 'held',
      createdAt: new Date().toISOString(),
    };
    
    mockPayments.push(payment);
    
    return {
      success: true,
      data: payment,
      message: 'Payment successful',
    };
  },

  // Get wallet balance
  async getWalletBalance(): Promise<ApiResponse<any>> {
    await simulateDelay(500);
    
    return {
      success: true,
      data: {
        available: 12450.00,
        inEscrow: 3200.00,
        ehbgcBalance: 5000,
        currency: 'USD',
      },
    };
  },

  // Get transaction history
  async getHistory(): Promise<ApiResponse<any[]>> {
    await simulateDelay(800);
    
    return {
      success: true,
      data: [
        { id: 'tx-001', type: 'payment', amount: -450, status: 'completed', date: '2026-03-10' },
        { id: 'tx-002', type: 'escrow_release', amount: 1200, status: 'completed', date: '2026-03-08' },
        { id: 'tx-003', type: 'staking_reward', amount: 25, status: 'pending', date: '2026-03-07' },
        ...mockPayments,
      ],
    };
  },

  // Release escrow
  async releaseEscrow(paymentId: string): Promise<ApiResponse<any>> {
    await simulateDelay(1000);
    
    return {
      success: true,
      data: { paymentId, escrowStatus: 'released' },
      message: 'Escrow released successfully',
    };
  },
};

// =============================================================================
// AI API
// =============================================================================

export const aiApi = {
  // Process AI command
  async processCommand(command: string, language: 'en' | 'ur' = 'en'): Promise<ApiResponse<any>> {
    await simulateDelay(1000);
    
    // Simple keyword-based intent detection
    const lowerCommand = command.toLowerCase();
    
    let intent = 'general';
    let response = '';
    let actions: string[] = [];
    
    if (lowerCommand.includes('divorce') || lowerCommand.includes('talaq')) {
      intent = 'case_creation';
      response = language === 'ur' 
        ? 'میں آپ کو طلاق کا کیس فائل کرنے میں مدد کروں گا۔ براہ کرم کچھ سوالات کے جوابات دیں۔'
        : 'I will help you file a divorce case. Please answer a few questions.';
      actions = ['start_case_wizard', 'collect_info'];
    } else if (lowerCommand.includes('property') || lowerCommand.includes('jaidad')) {
      intent = 'case_creation';
      response = language === 'ur'
        ? 'جائیداد کے معاملے کے لیے، مجھے کچھ معلومات چاہیں۔'
        : 'For a property matter, I need some information.';
      actions = ['start_case_wizard', 'collect_info'];
    } else if (lowerCommand.includes('lawyer') || lowerCommand.includes('vakeel')) {
      intent = 'find_lawyer';
      response = language === 'ur'
        ? 'میں آپ کے لیے بہترین وکیل تلاش کروں گا۔'
        : 'I will find the best lawyer for you.';
      actions = ['search_lawyers'];
    } else {
      response = language === 'ur'
        ? 'میں آپ کی قانونی مدد کے لیے حاضر ہوں۔ آپ کو کیا مسئلہ درپیش ہے؟'
        : 'I am here to help with your legal needs. What issue are you facing?';
    }
    
    return {
      success: true,
      data: {
        intent,
        response,
        actions,
        language,
        confidence: 0.92,
      },
    };
  },

  // Analyze case
  async analyzeCase(caseData: any): Promise<ApiResponse<any>> {
    await simulateDelay(2000);
    
    return {
      success: true,
      data: {
        caseType: caseData.type || 'property_dispute',
        complexity: 'moderate',
        estimatedDuration: '4-6 months',
        successProbability: 78,
        requiredDocuments: [
          'Property deed or title',
          'Identity documents',
          'Previous correspondence',
          'Evidence of possession',
        ],
        recommendedActions: [
          'Send legal notice to opponent',
          'File civil suit for possession',
          'Request interim injunction',
        ],
        riskFactors: [
          'Missing ownership documents',
          'Delayed action may weaken case',
        ],
      },
    };
  },

  // Generate document
  async generateDocument(data: {
    templateType: string;
    fields: Record<string, string>;
  }): Promise<ApiResponse<any>> {
    await simulateDelay(2500);
    
    return {
      success: true,
      data: {
        documentId: generateId(),
        templateType: data.templateType,
        generatedAt: new Date().toISOString(),
        previewUrl: `/documents/preview/${generateId()}`,
        downloadUrl: `/documents/download/${generateId()}`,
        content: `[Generated ${data.templateType} document content would appear here]`,
      },
      message: 'Document generated successfully',
    };
  },
};

// =============================================================================
// CONSULTATIONS API
// =============================================================================

export const consultationsApi = {
  // Book consultation
  async book(data: {
    lawyerId: string;
    date: string;
    time: string;
    type: 'video' | 'voice' | 'chat';
    duration: number;
  }): Promise<ApiResponse<any>> {
    await simulateDelay(1200);
    
    const consultation = {
      id: generateId(),
      bookingNumber: `CON-${Date.now().toString().slice(-6)}`,
      ...data,
      status: 'confirmed',
      meetingLink: `https://meet.ehblaw.com/${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    
    mockConsultations.push(consultation);
    
    return {
      success: true,
      data: consultation,
      message: 'Consultation booked successfully',
    };
  },

  // Get upcoming consultations
  async getUpcoming(): Promise<ApiResponse<any[]>> {
    await simulateDelay(600);
    
    return {
      success: true,
      data: [
        {
          id: 'con-001',
          lawyer: { name: 'Ahmed Raza', avatar: '/lawyers/ahmed.jpg' },
          date: '2026-03-15',
          time: '14:00',
          type: 'video',
          status: 'confirmed',
        },
        ...mockConsultations,
      ],
    };
  },
};

// =============================================================================
// SERVICES API
// =============================================================================

export const servicesApi = {
  // Get all services
  async getAll(): Promise<ApiResponse<any[]>> {
    await simulateDelay(500);
    
    return {
      success: true,
      data: [
        { id: 'family-law', name: 'Family Law', price: 500, popular: true },
        { id: 'property-law', name: 'Property Law', price: 350, popular: true },
        { id: 'business-law', name: 'Business Law', price: 400, popular: false },
        { id: 'criminal-law', name: 'Criminal Defense', price: 1000, popular: false },
        { id: 'immigration', name: 'Immigration Law', price: 600, popular: true },
        { id: 'corporate-law', name: 'Corporate Law', price: 2500, popular: false },
        { id: 'tax-law', name: 'Tax Law', price: 400, popular: false },
        { id: 'cyber-law', name: 'Cyber Law', price: 450, popular: true },
      ],
    };
  },

  // Get service by ID
  async getById(serviceId: string): Promise<ApiResponse<any>> {
    await simulateDelay(400);
    
    return {
      success: true,
      data: {
        id: serviceId,
        name: 'Property Law',
        description: 'Real estate transactions, disputes and property rights',
        price: 350,
        timeline: '2-4 weeks',
        requiredDocs: ['Property Deed', 'ID Proof', 'Tax Records'],
        process: ['Verification', 'Due Diligence', 'Contract', 'Registration', 'Transfer'],
      },
    };
  },
};

// =============================================================================
// NOTIFICATIONS API
// =============================================================================

export const notificationsApi = {
  // Get all notifications
  async getAll(): Promise<ApiResponse<any[]>> {
    await simulateDelay(400);
    
    return {
      success: true,
      data: [
        { id: 'n1', type: 'case_update', message: 'Your case hearing is scheduled for March 25', read: false },
        { id: 'n2', type: 'payment', message: 'Payment of $450 received', read: true },
        { id: 'n3', type: 'message', message: 'New message from Ahmed Raza', read: false },
        ...mockNotifications,
      ],
    };
  },

  // Mark as read
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    await simulateDelay(200);
    return { success: true };
  },
};

// =============================================================================
// UNIFIED API OBJECT
// =============================================================================

export const api = {
  auth: authApi,
  cases: casesApi,
  lawyers: lawyersApi,
  payments: paymentsApi,
  ai: aiApi,
  consultations: consultationsApi,
  services: servicesApi,
  notifications: notificationsApi,
};

export default api;
