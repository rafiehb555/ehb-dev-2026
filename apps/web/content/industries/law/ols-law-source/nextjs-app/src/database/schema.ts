// =============================================================================
// EHB MASTER DATABASE SCHEMA - PHASE 1
// Core Database Architecture for EHB AI Legal Platform
// =============================================================================

// =============================================================================
// ENUMS - Status and Type Definitions
// =============================================================================

export type UserRole = 'client' | 'lawyer' | 'admin' | 'super_admin' | 'franchise_owner' | 'support';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type LawyerStatus = 'active' | 'inactive' | 'suspended' | 'under_review' | 'pending_verification';
export type LawyerVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type STLLevel = 1 | 2 | 3 | 4 | 5;

export type CaseStatus = 'draft' | 'submitted' | 'assigned' | 'in_progress' | 'hearing_scheduled' | 
                         'awaiting_judgment' | 'completed' | 'closed' | 'cancelled' | 'on_hold';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';
export type CaseType = 
  | 'divorce' | 'child_custody' | 'marriage_registration' | 'family_dispute'
  | 'property_dispute' | 'land_ownership' | 'property_transfer' | 'rent_dispute'
  | 'civil_litigation' | 'contract_dispute' | 'debt_recovery' | 'consumer_complaint'
  | 'criminal_defense' | 'bail_application' | 'fir_quashing'
  | 'corporate_law' | 'company_registration' | 'merger_acquisition' | 'intellectual_property'
  | 'immigration' | 'visa_application' | 'citizenship' | 'deportation_defense'
  | 'tax_law' | 'tax_dispute' | 'tax_planning'
  | 'labor_law' | 'employment_dispute' | 'wrongful_termination'
  | 'cyber_crime' | 'defamation' | 'harassment'
  | 'banking_finance' | 'insurance_claim' | 'cheque_bounce'
  | 'other';

export type DocumentType = 'id_card' | 'passport' | 'marriage_certificate' | 'property_deed' | 
                           'court_order' | 'legal_notice' | 'affidavit' | 'contract' | 
                           'evidence' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'crypto' | 
                            'jazzcash' | 'easypaisa' | 'paypal' | 'stripe' | 'ehbgc';
export type Currency = 'PKR' | 'USD' | 'AED' | 'GBP' | 'EUR' | 'SAR' | 'INR' | 'CAD' | 'AUD';

export type SubscriptionType = 'case_based' | 'hourly' | 'monthly' | 'quarterly' | 'annual' | 'contract';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired' | 'pending_payment';

export type AIAgentType = 'orchestrator' | 'case_management' | 'legal_research' | 'document_generation' |
                          'lawyer_matching' | 'payment' | 'court_process' | 'franchise' | 
                          'global_compliance' | 'security' | 'analytics' | 'communication' |
                          'knowledge' | 'learning';
export type AIAgentStatus = 'active' | 'idle' | 'processing' | 'error' | 'disabled' | 'maintenance';

// =============================================================================
// TABLE 1: USERS
// Core user accounts - clients, lawyers, admins
// =============================================================================

export interface User {
  user_id: string;                    // UUID - Primary Key
  email: string;                      // Unique, required
  password_hash: string;              // Encrypted password
  phone: string;                      // With country code
  phone_verified: boolean;
  email_verified: boolean;
  
  // Personal Info
  first_name: string;
  last_name: string;
  full_name: string;                  // Computed: first_name + last_name
  display_name?: string;
  avatar_url?: string;
  gender?: Gender;
  date_of_birth?: Date;
  
  // Location
  country: string;                    // ISO country code
  country_name: string;
  state_province?: string;
  city: string;
  address?: string;
  postal_code?: string;
  timezone: string;                   // e.g., 'Asia/Karachi'
  
  // Preferences
  language: string;                   // Primary language code
  secondary_language?: string;
  preferred_currency: Currency;
  
  // Account
  role: UserRole;
  status: UserStatus;
  account_type: 'free' | 'premium' | 'enterprise';
  
  // Security
  two_factor_enabled: boolean;
  last_login?: Date;
  last_ip?: string;
  login_count: number;
  failed_login_attempts: number;
  
  // Metadata
  referred_by?: string;               // Referral user_id
  referral_code: string;              // Unique referral code
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;                  // Soft delete
}

// =============================================================================
// TABLE 2: LAWYERS
// Lawyer profiles with verification and specialization
// =============================================================================

export interface Lawyer {
  lawyer_id: string;                  // UUID - Primary Key
  user_id: string;                    // FK -> Users
  
  // Professional Info
  bar_council_id: string;             // Bar registration number
  bar_council_name: string;           // e.g., 'Pakistan Bar Council'
  license_number: string;
  license_issue_date: Date;
  license_expiry_date?: Date;
  license_status: LawyerVerificationStatus;
  
  // Profile
  professional_title: string;         // e.g., 'Advocate High Court'
  bio: string;
  bio_urdu?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  
  // Experience
  experience_years: number;
  cases_handled: number;
  cases_won: number;
  success_rate: number;               // Computed percentage
  
  // Specialization
  primary_specialization: CaseType;
  secondary_specializations: CaseType[];
  practice_areas: string[];
  
  // Rating
  overall_rating: number;             // 1-5 stars
  total_reviews: number;
  stl_level: STLLevel;                // Service Trust Level (L0–L8)
  
  // Availability
  is_available: boolean;
  availability_status: 'online' | 'offline' | 'busy' | 'away';
  working_hours: WorkingHours;
  accepts_new_cases: boolean;
  max_active_cases: number;
  current_active_cases: number;
  
  // Location
  office_address: string;
  office_city: string;
  office_country: string;
  practice_jurisdictions: string[];   // Countries/states where licensed
  courts_practiced: string[];         // e.g., ['Supreme Court', 'High Court']
  
  // Languages
  languages_spoken: string[];
  
  // Pricing
  consultation_fee: number;
  consultation_currency: Currency;
  hourly_rate: number;
  case_based_min_fee: number;
  case_based_max_fee: number;
  monthly_retainer_fee?: number;
  annual_contract_fee?: number;
  accepts_payment_plans: boolean;
  
  // Verification
  verification_status: LawyerVerificationStatus;
  verified_at?: Date;
  verified_by?: string;               // Admin user_id
  verification_documents: string[];   // Document URLs
  background_check_completed: boolean;
  
  // Platform
  status: LawyerStatus;
  featured: boolean;
  badges: string[];                   // e.g., ['Top Rated', 'Quick Responder']
  response_time_hours: number;        // Average response time
  
  // Bank Info (for payments)
  bank_name?: string;
  bank_account_number?: string;
  bank_iban?: string;
  
  // Social
  website_url?: string;
  linkedin_url?: string;
  
  // Franchise
  franchise_id?: string;              // FK -> Franchises (if associated)
  
  // Timestamps
  joined_platform_at: Date;
  last_active_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WorkingHours {
  monday: { start: string; end: string; closed: boolean };
  tuesday: { start: string; end: string; closed: boolean };
  wednesday: { start: string; end: string; closed: boolean };
  thursday: { start: string; end: string; closed: boolean };
  friday: { start: string; end: string; closed: boolean };
  saturday: { start: string; end: string; closed: boolean };
  sunday: { start: string; end: string; closed: boolean };
}

// =============================================================================
// TABLE 3: CASES
// Legal case management
// =============================================================================

export interface Case {
  case_id: string;                    // UUID - Primary Key
  case_number: string;                // Unique, formatted: EHB-YYYY-XXXXXX
  
  // Parties
  client_id: string;                  // FK -> Users
  lawyer_id?: string;                 // FK -> Lawyers (nullable until assigned)
  opponent_name?: string;
  opponent_contact?: string;
  opponent_lawyer_name?: string;
  
  // Case Info
  case_type: CaseType;
  case_category: string;              // Parent category
  title: string;
  title_urdu?: string;
  description: string;
  description_urdu?: string;
  
  // Status
  status: CaseStatus;
  priority: CasePriority;
  stage: string;                      // Current stage in workflow
  progress_percentage: number;
  
  // Location
  jurisdiction_country: string;
  jurisdiction_state?: string;
  jurisdiction_city?: string;
  court_name?: string;
  court_case_number?: string;         // Official court case number
  
  // Dates
  incident_date?: Date;
  filing_date?: Date;
  assigned_date?: Date;
  first_hearing_date?: Date;
  next_hearing_date?: Date;
  expected_completion_date?: Date;
  actual_completion_date?: Date;
  
  // Financial
  estimated_cost: number;
  actual_cost: number;
  currency: Currency;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'in_escrow';
  escrow_amount: number;
  
  // AI Analysis
  ai_success_prediction?: number;     // Percentage
  ai_recommended_strategy?: string;
  ai_estimated_duration_days?: number;
  ai_risk_assessment?: string;
  
  // Notes
  client_notes?: string;
  lawyer_notes?: string;              // Private notes
  internal_notes?: string;            // Admin notes
  
  // Tags
  tags: string[];
  
  // Ratings (after completion)
  client_rating?: number;
  client_feedback?: string;
  lawyer_rating?: number;
  lawyer_feedback?: string;
  
  // Metadata
  source: 'web' | 'mobile' | 'ai_agent' | 'referral' | 'franchise';
  referred_by?: string;
  franchise_id?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
}

// =============================================================================
// TABLE 4: CASE_DOCUMENTS
// Documents associated with cases
// =============================================================================

export interface CaseDocument {
  document_id: string;                // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  uploaded_by: string;                // FK -> Users
  
  // Document Info
  document_type: DocumentType;
  document_name: string;
  original_filename: string;
  file_url: string;                   // Secure storage URL
  file_size: number;                  // Bytes
  file_format: string;                // e.g., 'pdf', 'jpg', 'docx'
  mime_type: string;
  
  // Description
  title: string;
  description?: string;
  
  // Verification
  status: DocumentStatus;
  verified_by?: string;               // Lawyer/Admin user_id
  verified_at?: Date;
  rejection_reason?: string;
  
  // Security
  is_confidential: boolean;
  access_level: 'public' | 'case_parties' | 'lawyer_only' | 'admin_only';
  encrypted: boolean;
  
  // AI Processing
  ai_extracted_text?: string;         // OCR extracted text
  ai_summary?: string;
  ai_classification?: string;
  
  // Version Control
  version: number;
  parent_document_id?: string;        // For document versions
  
  // Metadata
  page_count?: number;
  
  // Timestamps
  uploaded_at: Date;
  updated_at: Date;
  expires_at?: Date;
}

// =============================================================================
// TABLE 5: LEGAL_SERVICES
// Available legal services on the platform
// =============================================================================

export interface LegalService {
  service_id: string;                 // UUID - Primary Key
  
  // Service Info
  name: string;
  name_urdu: string;
  slug: string;                       // URL-friendly name
  description: string;
  description_urdu: string;
  
  // Category
  category: string;                   // e.g., 'Family Law', 'Property Law'
  category_urdu: string;
  subcategory?: string;
  related_case_types: CaseType[];
  
  // Pricing
  base_price: number;
  max_price: number;
  currency: Currency;
  pricing_type: 'fixed' | 'range' | 'hourly' | 'custom';
  includes_consultation: boolean;
  
  // Details
  features: string[];
  features_urdu: string[];
  requirements: string[];             // Documents/info required
  estimated_duration_days: number;
  
  // Availability
  is_active: boolean;
  available_countries: string[];
  available_languages: string[];
  
  // Display
  icon: string;                       // Icon name or URL
  display_order: number;
  featured: boolean;
  
  // Stats
  total_cases: number;
  success_rate: number;
  average_rating: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// TABLE 6: PAYMENTS
// Payment transactions
// =============================================================================

export interface Payment {
  payment_id: string;                 // UUID - Primary Key
  transaction_id: string;             // External transaction ID
  
  // References
  case_id?: string;                   // FK -> Cases (optional)
  subscription_id?: string;           // FK -> Subscriptions (optional)
  payer_id: string;                   // FK -> Users (client)
  payee_id?: string;                  // FK -> Users (lawyer)
  
  // Amount
  amount: number;
  currency: Currency;
  exchange_rate?: number;             // If currency conversion
  original_amount?: number;
  original_currency?: Currency;
  
  // Breakdown
  service_fee: number;                // Platform fee
  lawyer_fee: number;                 // Lawyer's share
  tax_amount: number;
  discount_amount: number;
  discount_code?: string;
  net_amount: number;                 // Final amount after all calculations
  
  // Payment Info
  payment_method: PaymentMethod;
  payment_gateway: string;            // e.g., 'stripe', 'jazzcash'
  gateway_reference?: string;
  
  // Status
  status: PaymentStatus;
  status_reason?: string;
  
  // Escrow
  is_escrow: boolean;
  escrow_status?: 'held' | 'released' | 'refunded' | 'disputed';
  escrow_release_date?: Date;
  
  // Billing
  invoice_number?: string;
  invoice_url?: string;
  receipt_url?: string;
  
  // Distribution
  platform_commission: number;
  platform_commission_percentage: number;
  franchise_commission?: number;
  franchise_id?: string;
  
  // Refund
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: Date;
  
  // Metadata
  ip_address?: string;
  device_info?: string;
  notes?: string;
  
  // Timestamps
  created_at: Date;
  processed_at?: Date;
  completed_at?: Date;
  updated_at: Date;
}

// =============================================================================
// TABLE 7: SUBSCRIPTIONS
// Lawyer subscription/hiring plans
// =============================================================================

export interface Subscription {
  subscription_id: string;            // UUID - Primary Key
  
  // Parties
  client_id: string;                  // FK -> Users
  lawyer_id: string;                  // FK -> Lawyers
  
  // Plan Info
  subscription_type: SubscriptionType;
  plan_name: string;
  plan_description: string;
  
  // Duration
  start_date: Date;
  end_date: Date;
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  auto_renew: boolean;
  
  // Pricing
  price: number;
  currency: Currency;
  discount_percentage?: number;
  
  // Usage
  hours_included?: number;            // For hourly plans
  hours_used?: number;
  cases_included?: number;            // For case-based plans
  cases_used?: number;
  unlimited: boolean;
  
  // Features
  features: string[];
  priority_support: boolean;
  dedicated_contact: boolean;
  
  // Status
  status: SubscriptionStatus;
  cancelled_at?: Date;
  cancellation_reason?: string;
  
  // Payment
  next_billing_date?: Date;
  last_payment_id?: string;           // FK -> Payments
  payment_status: 'current' | 'overdue' | 'failed';
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// TABLE 8: AI_AGENTS
// AI Agent configuration and status
// =============================================================================

export interface AIAgent {
  agent_id: string;                   // UUID - Primary Key
  
  // Identity
  agent_type: AIAgentType;
  name: string;
  name_urdu: string;
  description: string;
  description_urdu: string;
  version: string;
  
  // Configuration
  config: Record<string, any>;        // JSON configuration
  capabilities: string[];
  dependencies: AIAgentType[];
  
  // Status
  status: AIAgentStatus;
  is_enabled: boolean;
  
  // Performance
  tasks_completed: number;
  tasks_in_progress: number;
  tasks_failed: number;
  average_response_time_ms: number;
  accuracy_percentage: number;
  uptime_percentage: number;
  
  // Resources
  memory_usage_mb: number;
  cpu_usage_percentage: number;
  max_concurrent_tasks: number;
  
  // Timestamps
  last_active_at?: Date;
  last_error_at?: Date;
  last_error_message?: string;
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// TABLE 9: CASE_TIMELINE (Supporting Table)
// Case progress and event tracking
// =============================================================================

export interface CaseTimelineEvent {
  event_id: string;                   // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  
  // Event Info
  event_type: 'status_change' | 'document_added' | 'payment' | 'hearing' | 
              'message' | 'assignment' | 'note' | 'milestone' | 'system';
  title: string;
  title_urdu?: string;
  description?: string;
  description_urdu?: string;
  
  // Actor
  actor_id?: string;                  // FK -> Users (who triggered)
  actor_type: 'client' | 'lawyer' | 'admin' | 'system' | 'ai_agent';
  
  // Data
  old_value?: string;
  new_value?: string;
  metadata?: Record<string, any>;
  
  // Visibility
  is_public: boolean;                 // Visible to client
  
  // Timestamps
  event_date: Date;
  created_at: Date;
}

// =============================================================================
// TABLE 10: NOTIFICATIONS (Supporting Table)
// User notifications
// =============================================================================

export interface Notification {
  notification_id: string;            // UUID - Primary Key
  user_id: string;                    // FK -> Users
  
  // Content
  type: 'case_update' | 'payment' | 'message' | 'reminder' | 'system' | 'marketing';
  title: string;
  title_urdu?: string;
  message: string;
  message_urdu?: string;
  
  // Reference
  reference_type?: 'case' | 'payment' | 'document' | 'lawyer' | 'subscription';
  reference_id?: string;
  action_url?: string;
  
  // Delivery
  channel: 'in_app' | 'email' | 'sms' | 'push';
  is_read: boolean;
  read_at?: Date;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Timestamps
  created_at: Date;
  expires_at?: Date;
}

// =============================================================================
// DATABASE INDEXES (For Performance)
// =============================================================================

export const DATABASE_INDEXES = {
  users: [
    'CREATE INDEX idx_users_email ON users(email)',
    'CREATE INDEX idx_users_phone ON users(phone)',
    'CREATE INDEX idx_users_country ON users(country)',
    'CREATE INDEX idx_users_role ON users(role)',
    'CREATE INDEX idx_users_status ON users(status)',
  ],
  lawyers: [
    'CREATE INDEX idx_lawyers_user_id ON lawyers(user_id)',
    'CREATE INDEX idx_lawyers_specialization ON lawyers(primary_specialization)',
    'CREATE INDEX idx_lawyers_country ON lawyers(office_country)',
    'CREATE INDEX idx_lawyers_status ON lawyers(status)',
    'CREATE INDEX idx_lawyers_rating ON lawyers(overall_rating DESC)',
    'CREATE INDEX idx_lawyers_verification ON lawyers(verification_status)',
  ],
  cases: [
    'CREATE INDEX idx_cases_client ON cases(client_id)',
    'CREATE INDEX idx_cases_lawyer ON cases(lawyer_id)',
    'CREATE INDEX idx_cases_status ON cases(status)',
    'CREATE INDEX idx_cases_type ON cases(case_type)',
    'CREATE INDEX idx_cases_number ON cases(case_number)',
    'CREATE INDEX idx_cases_created ON cases(created_at DESC)',
  ],
  payments: [
    'CREATE INDEX idx_payments_payer ON payments(payer_id)',
    'CREATE INDEX idx_payments_payee ON payments(payee_id)',
    'CREATE INDEX idx_payments_case ON payments(case_id)',
    'CREATE INDEX idx_payments_status ON payments(status)',
    'CREATE INDEX idx_payments_date ON payments(created_at DESC)',
  ],
  documents: [
    'CREATE INDEX idx_documents_case ON case_documents(case_id)',
    'CREATE INDEX idx_documents_uploader ON case_documents(uploaded_by)',
    'CREATE INDEX idx_documents_status ON case_documents(status)',
  ],
};

// =============================================================================
// DATABASE STATISTICS
// =============================================================================

export const DATABASE_STATS = {
  phase: 1,
  version: '1.0.0',
  totalTables: 10,
  coreEntities: 8,
  supportingTables: 2,
  totalFields: 250,
  indexes: 20,
  foreignKeys: 15,
  supportedCountries: 50,
  supportedCurrencies: 9,
  supportedLanguages: 10,
};
