// =============================================================================
// EHB EXTENDED DATABASE SCHEMA - PHASES 2, 3, 4
// Extended Database Architecture for Global Legal Platform
// =============================================================================

import { CaseType, Currency, PaymentMethod, PaymentStatus } from './schema';

// =============================================================================
// PHASE 2 - EXTENDED DATABASE STRUCTURE
// Tables: Lawyer_Verification, Franchise_Offices, Legal_Knowledge, 
//         Compliance_Records, Languages, Countries
// =============================================================================

// -----------------------------------------------------------------------------
// ENUMS - Phase 2
// -----------------------------------------------------------------------------

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'expired' | 'suspended';
export type FranchiseStatus = 'active' | 'inactive' | 'pending_approval' | 'suspended' | 'closed';
export type FranchiseTier = 'standard' | 'premium' | 'enterprise' | 'master';
export type LegalSystemType = 'common_law' | 'civil_law' | 'religious_law' | 'customary_law' | 'mixed';
export type KnowledgeType = 'law' | 'regulation' | 'precedent' | 'article' | 'guide' | 'template';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'exempted';

// -----------------------------------------------------------------------------
// TABLE 11: LAWYER_VERIFICATION
// Detailed verification records for lawyers
// -----------------------------------------------------------------------------

export interface LawyerVerification {
  verification_id: string;            // UUID - Primary Key
  lawyer_id: string;                  // FK -> Lawyers
  
  // License Information
  license_number: string;
  license_type: string;               // e.g., 'Advocate', 'Barrister', 'Solicitor'
  issuing_authority: string;          // e.g., 'Pakistan Bar Council'
  issuing_country: string;
  issuing_state?: string;
  issue_date: Date;
  expiry_date?: Date;
  
  // Bar Council
  bar_council_name: string;
  bar_council_id: string;
  bar_registration_number: string;
  bar_registration_date: Date;
  
  // Verification
  verification_status: VerificationStatus;
  verification_method: 'manual' | 'api' | 'document' | 'in_person';
  verified_by?: string;               // Admin user_id
  verification_date?: Date;
  verification_notes?: string;
  rejection_reason?: string;
  
  // Documents
  license_document_url?: string;
  bar_card_url?: string;
  id_document_url?: string;
  photo_url?: string;
  additional_documents?: string[];
  
  // Background Check
  background_check_status?: 'pending' | 'passed' | 'failed' | 'not_required';
  background_check_date?: Date;
  background_check_reference?: string;
  
  // Renewal
  renewal_required: boolean;
  renewal_reminder_sent: boolean;
  last_renewal_date?: Date;
  next_renewal_date?: Date;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// -----------------------------------------------------------------------------
// TABLE 12: FRANCHISE_OFFICES
// Franchise network management
// -----------------------------------------------------------------------------

export interface FranchiseOffice {
  franchise_id: string;               // UUID - Primary Key
  franchise_code: string;             // Unique code: EHB-PK-LHR-001
  
  // Ownership
  owner_id: string;                   // FK -> Users (franchise owner)
  owner_name: string;
  owner_contact_email: string;
  owner_contact_phone: string;
  
  // Location
  country: string;                    // ISO country code
  country_name: string;
  state_province?: string;
  city: string;
  address: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  
  // Business Info
  franchise_name: string;
  franchise_name_local?: string;      // In local language
  business_registration_number?: string;
  tax_registration_number?: string;
  
  // Status
  status: FranchiseStatus;
  tier: FranchiseTier;
  
  // Operations
  opening_date?: Date;
  operational_since?: Date;
  operating_hours: {
    weekdays: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string; closed: boolean };
  };
  
  // Team
  total_lawyers: number;
  total_staff: number;
  manager_name?: string;
  manager_contact?: string;
  
  // Performance
  total_cases: number;
  active_cases: number;
  completed_cases: number;
  success_rate: number;
  average_rating: number;
  total_revenue: number;
  revenue_currency: Currency;
  
  // Commission
  platform_commission_rate: number;   // Percentage
  commission_structure: 'fixed' | 'tiered' | 'custom';
  
  // Features
  services_offered: string[];
  specializations: CaseType[];
  languages_supported: string[];
  
  // Legal
  agreement_signed: boolean;
  agreement_date?: Date;
  agreement_document_url?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
}

// -----------------------------------------------------------------------------
// TABLE 13: LEGAL_KNOWLEDGE
// Legal knowledge base for AI research
// -----------------------------------------------------------------------------

export interface LegalKnowledge {
  knowledge_id: string;               // UUID - Primary Key
  
  // Classification
  knowledge_type: KnowledgeType;
  category: string;                   // e.g., 'Family Law', 'Property Law'
  subcategory?: string;
  related_case_types: CaseType[];
  
  // Content
  title: string;
  title_local?: string;               // In local language
  slug: string;                       // URL-friendly
  description: string;
  description_local?: string;
  full_text: string;
  full_text_local?: string;
  summary?: string;
  
  // Legal Reference
  law_name?: string;                  // e.g., 'Transfer of Property Act'
  section_number?: string;            // e.g., 'Section 54'
  act_year?: number;
  amendment_year?: number;
  
  // Jurisdiction
  country: string;
  country_name: string;
  state_province?: string;
  jurisdiction_type: 'federal' | 'state' | 'local' | 'international';
  court_level?: string;               // e.g., 'Supreme Court', 'High Court'
  
  // Precedent Info (for case precedents)
  case_citation?: string;             // e.g., 'PLD 2020 SC 123'
  court_name?: string;
  judgment_date?: Date;
  judges?: string[];
  outcome?: string;
  
  // Metadata
  language: string;
  effective_date?: Date;
  expiry_date?: Date;
  is_active: boolean;
  is_current_law: boolean;
  
  // Tags & Search
  tags: string[];
  keywords: string[];
  search_vector?: string;             // For full-text search
  
  // Source
  source_name: string;
  source_url?: string;
  source_document_url?: string;
  
  // AI Enhancement
  ai_summary?: string;
  ai_key_points?: string[];
  ai_related_laws?: string[];
  ai_embedding?: number[];            // Vector embedding for semantic search
  
  // Stats
  view_count: number;
  citation_count: number;
  usefulness_rating?: number;
  
  // Timestamps
  published_at?: Date;
  last_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// -----------------------------------------------------------------------------
// TABLE 14: COMPLIANCE_RECORDS
// Global legal compliance requirements
// -----------------------------------------------------------------------------

export interface ComplianceRecord {
  compliance_id: string;              // UUID - Primary Key
  
  // Regulation Info
  regulation_name: string;
  regulation_name_local?: string;
  regulation_code?: string;           // e.g., 'GDPR', 'PDPA'
  regulation_type: 'data_protection' | 'licensing' | 'financial' | 'operational' | 'legal_practice' | 'other';
  
  // Jurisdiction
  country: string;
  country_name: string;
  region?: string;                    // e.g., 'EU', 'GCC'
  applies_to: 'platform' | 'lawyers' | 'clients' | 'franchises' | 'all';
  
  // Requirements
  requirements: ComplianceRequirement[];
  mandatory: boolean;
  
  // Status
  status: ComplianceStatus;
  last_audit_date?: Date;
  next_audit_date?: Date;
  audit_notes?: string;
  
  // Authority
  regulatory_authority: string;
  authority_contact?: string;
  authority_website?: string;
  
  // Penalties
  non_compliance_penalty?: string;
  penalty_amount?: number;
  penalty_currency?: Currency;
  
  // Documentation
  compliance_document_url?: string;
  evidence_documents?: string[];
  
  // Timestamps
  effective_date: Date;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ComplianceRequirement {
  requirement_id: string;
  description: string;
  description_local?: string;
  is_met: boolean;
  evidence_url?: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// TABLE 15: LANGUAGES
// Platform supported languages
// -----------------------------------------------------------------------------

export interface Language {
  language_id: string;                // UUID - Primary Key
  code: string;                       // ISO 639-1 (e.g., 'en', 'ur')
  code_3: string;                     // ISO 639-3 (e.g., 'eng', 'urd')
  
  // Names
  name: string;                       // English name
  native_name: string;                // Name in the language itself
  
  // Properties
  direction: 'ltr' | 'rtl';
  script: string;                     // e.g., 'Latin', 'Arabic', 'Devanagari'
  
  // Platform Support
  is_active: boolean;
  is_default: boolean;
  translation_coverage: number;       // Percentage of UI translated
  
  // Usage
  countries_primary: string[];        // Countries where it's primary
  countries_secondary: string[];      // Countries where it's secondary
  total_users: number;                // Users with this language preference
  
  // AI Support
  ai_translation_available: boolean;
  ai_voice_available: boolean;
  ai_chat_available: boolean;
  
  // Display
  display_order: number;
  flag_emoji?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// -----------------------------------------------------------------------------
// TABLE 16: COUNTRIES
// Country-specific legal and operational data
// -----------------------------------------------------------------------------

export interface Country {
  country_id: string;                 // UUID - Primary Key
  code: string;                       // ISO 3166-1 alpha-2 (e.g., 'PK')
  code_3: string;                     // ISO 3166-1 alpha-3 (e.g., 'PAK')
  
  // Names
  name: string;
  official_name: string;
  native_name?: string;
  
  // Geography
  region: string;                     // e.g., 'Asia', 'Europe'
  subregion: string;                  // e.g., 'Southern Asia'
  capital: string;
  
  // Legal System
  legal_system: LegalSystemType;
  legal_system_description?: string;
  constitution_type?: string;
  
  // Courts
  highest_court: string;              // e.g., 'Supreme Court'
  court_hierarchy: string[];          // List of court levels
  
  // Regulatory
  bar_council_name?: string;
  bar_council_website?: string;
  lawyer_licensing_authority?: string;
  
  // Currency
  currency_code: Currency;
  currency_name: string;
  currency_symbol: string;
  
  // Locale
  timezone: string;
  timezones: string[];                // All timezones if multiple
  phone_code: string;
  date_format: string;
  
  // Languages
  official_languages: string[];
  primary_language: string;
  
  // Platform
  is_active: boolean;
  is_operational: boolean;            // Services available
  launch_date?: Date;
  
  // Business
  total_franchises: number;
  total_lawyers: number;
  total_cases: number;
  
  // Compliance
  data_protection_law?: string;
  requires_local_data_storage: boolean;
  
  // Display
  flag_url?: string;
  flag_emoji: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// PHASE 3 - MARKETPLACE & HIRING DATABASE
// Tables: Lawyer_Hiring_Contracts, Consultation_Sessions, 
//         Subscription_Plans, Lawyer_Performance
// =============================================================================

// -----------------------------------------------------------------------------
// ENUMS - Phase 3
// -----------------------------------------------------------------------------

export type ContractType = 'case_based' | 'hourly' | 'monthly_retainer' | 'annual_contract' | 'project_based';
export type ContractStatus = 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'terminated' | 'expired';
export type SessionStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type SessionType = 'video_call' | 'voice_call' | 'in_person' | 'chat' | 'email';
export type PlanType = 'basic' | 'standard' | 'premium' | 'enterprise' | 'custom';

// -----------------------------------------------------------------------------
// TABLE 17: LAWYER_HIRING_CONTRACTS
// Hiring agreements between clients and lawyers
// -----------------------------------------------------------------------------

export interface LawyerHiringContract {
  contract_id: string;                // UUID - Primary Key
  contract_number: string;            // Unique: EHB-CON-2026-XXXXX
  
  // Parties
  client_id: string;                  // FK -> Users
  lawyer_id: string;                  // FK -> Lawyers
  franchise_id?: string;              // FK -> Franchise_Offices
  
  // Contract Type
  contract_type: ContractType;
  contract_title: string;
  contract_description?: string;
  
  // Duration
  start_date: Date;
  end_date?: Date;
  duration_months?: number;
  is_open_ended: boolean;
  auto_renew: boolean;
  renewal_terms?: string;
  
  // Scope
  scope_of_work: string;
  deliverables?: string[];
  case_types_covered?: CaseType[];
  jurisdiction_covered?: string[];
  
  // Limits
  max_hours?: number;                 // For hourly contracts
  max_cases?: number;                 // For case-based
  hours_used: number;
  cases_used: number;
  
  // Pricing
  total_value: number;
  currency: Currency;
  payment_terms: string;
  billing_frequency: 'one_time' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  
  // Rates
  hourly_rate?: number;
  case_rate?: number;
  monthly_fee?: number;
  retainer_fee?: number;
  
  // Status
  status: ContractStatus;
  status_reason?: string;
  
  // Milestones
  milestones?: ContractMilestone[];
  
  // Termination
  termination_notice_days: number;
  terminated_by?: string;
  termination_date?: Date;
  termination_reason?: string;
  
  // Documents
  contract_document_url?: string;
  signed_document_url?: string;
  amendments?: ContractAmendment[];
  
  // Signatures
  client_signed: boolean;
  client_signed_at?: Date;
  lawyer_signed: boolean;
  lawyer_signed_at?: Date;
  
  // Performance
  satisfaction_score?: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface ContractMilestone {
  milestone_id: string;
  title: string;
  description?: string;
  due_date: Date;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completed_at?: Date;
}

export interface ContractAmendment {
  amendment_id: string;
  amendment_date: Date;
  description: string;
  document_url?: string;
  approved_by_client: boolean;
  approved_by_lawyer: boolean;
}

// -----------------------------------------------------------------------------
// TABLE 18: CONSULTATION_SESSIONS
// Scheduled consultation sessions
// -----------------------------------------------------------------------------

export interface ConsultationSession {
  session_id: string;                 // UUID - Primary Key
  booking_number: string;             // Unique: EHB-BK-2026-XXXXX
  
  // Parties
  client_id: string;                  // FK -> Users
  lawyer_id: string;                  // FK -> Lawyers
  contract_id?: string;               // FK -> Lawyer_Hiring_Contracts
  case_id?: string;                   // FK -> Cases
  
  // Session Type
  session_type: SessionType;
  session_purpose: string;
  session_agenda?: string;
  
  // Scheduling
  scheduled_date: Date;
  scheduled_time: string;             // HH:MM format
  timezone: string;
  duration_minutes: number;
  buffer_minutes: number;             // Time before/after
  
  // Actual Times
  actual_start_time?: Date;
  actual_end_time?: Date;
  actual_duration_minutes?: number;
  
  // Status
  status: SessionStatus;
  status_reason?: string;
  
  // Meeting Details
  meeting_link?: string;              // Video call URL
  meeting_id?: string;
  meeting_password?: string;
  phone_number?: string;              // For phone consultations
  location_address?: string;          // For in-person
  
  // Pricing
  fee: number;
  currency: Currency;
  is_free: boolean;
  discount_applied?: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'waived';
  payment_id?: string;                // FK -> Payments
  
  // Reminders
  reminder_sent: boolean;
  reminder_sent_at?: Date;
  
  // Recording
  is_recorded: boolean;
  recording_url?: string;
  recording_consent: boolean;
  
  // Notes
  client_notes?: string;
  lawyer_notes?: string;              // Private to lawyer
  summary?: string;
  action_items?: string[];
  
  // Follow-up
  requires_follow_up: boolean;
  follow_up_session_id?: string;
  follow_up_notes?: string;
  
  // Rating
  client_rating?: number;
  client_feedback?: string;
  lawyer_rating?: number;
  
  // Timestamps
  booked_at: Date;
  confirmed_at?: Date;
  cancelled_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// -----------------------------------------------------------------------------
// TABLE 19: SUBSCRIPTION_PLANS
// Legal advisory subscription plans
// -----------------------------------------------------------------------------

export interface SubscriptionPlan {
  plan_id: string;                    // UUID - Primary Key
  
  // Plan Identity
  plan_code: string;                  // Unique: PLAN-BASIC-001
  plan_name: string;
  plan_name_local?: string;
  plan_description: string;
  plan_description_local?: string;
  
  // Type
  plan_type: PlanType;
  billing_cycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  
  // Pricing
  base_price: number;
  currency: Currency;
  setup_fee?: number;
  discount_annual?: number;           // Percentage discount for annual
  
  // Features
  features: PlanFeature[];
  
  // Limits
  consultation_hours_included: number;
  cases_included: number;
  document_reviews_included: number;
  legal_calls_included: number;
  
  // Extras
  extra_hour_rate: number;
  extra_case_rate: number;
  
  // Support
  support_level: 'email' | 'chat' | 'phone' | 'dedicated';
  response_time_hours: number;
  priority_support: boolean;
  dedicated_lawyer: boolean;
  
  // Target
  target_audience: 'individual' | 'small_business' | 'enterprise' | 'all';
  available_countries: string[];
  
  // Status
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  
  // Stats
  total_subscribers: number;
  active_subscribers: number;
  
  // Timestamps
  valid_from: Date;
  valid_until?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PlanFeature {
  feature_id: string;
  feature_name: string;
  feature_name_local?: string;
  feature_description?: string;
  is_highlighted: boolean;
  limit?: number;
  unit?: string;
}

// -----------------------------------------------------------------------------
// TABLE 20: LAWYER_PERFORMANCE
// Lawyer performance tracking and analytics
// -----------------------------------------------------------------------------

export interface LawyerPerformance {
  performance_id: string;             // UUID - Primary Key
  lawyer_id: string;                  // FK -> Lawyers
  
  // Period
  period_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all_time';
  period_start: Date;
  period_end: Date;
  
  // Case Metrics
  cases_received: number;
  cases_accepted: number;
  cases_declined: number;
  cases_completed: number;
  cases_ongoing: number;
  cases_won: number;
  cases_lost: number;
  cases_settled: number;
  
  // Success Rate
  success_rate: number;               // Percentage
  win_rate: number;
  settlement_rate: number;
  
  // Response Metrics
  average_response_time_hours: number;
  response_rate: number;              // Percentage of queries responded
  first_response_time_hours: number;
  
  // Client Metrics
  total_clients: number;
  new_clients: number;
  returning_clients: number;
  client_retention_rate: number;
  
  // Rating Metrics
  average_rating: number;
  total_reviews: number;
  five_star_reviews: number;
  positive_review_rate: number;
  
  // Financial Metrics
  total_earnings: number;
  currency: Currency;
  average_case_value: number;
  total_consultations: number;
  consultation_earnings: number;
  
  // Engagement
  profile_views: number;
  contact_requests: number;
  conversion_rate: number;            // Views to hires
  
  // Availability
  availability_hours: number;
  hours_worked: number;
  utilization_rate: number;
  
  // Quality Scores
  communication_score: number;
  professionalism_score: number;
  expertise_score: number;
  value_score: number;
  overall_score: number;
  
  // Ranking
  platform_rank?: number;
  category_rank?: number;
  city_rank?: number;
  
  // Badges Earned
  badges_earned: string[];
  
  // AI Analysis
  ai_performance_summary?: string;
  ai_improvement_suggestions?: string[];
  ai_strength_areas?: string[];
  ai_growth_areas?: string[];
  
  // Timestamps
  calculated_at: Date;
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// PHASE 4 - CASE WORKFLOW & COURT PROCESS DATABASE
// Tables: Case_Workflow, Court_Hearings, Evidence_Records, 
//         Legal_Notices, Case_Timeline
// =============================================================================

// -----------------------------------------------------------------------------
// ENUMS - Phase 4
// -----------------------------------------------------------------------------

export type WorkflowStage = 
  | 'case_created' | 'information_collected' | 'documents_uploaded'
  | 'lawyer_assigned' | 'case_reviewed' | 'strategy_planned'
  | 'legal_notice_drafted' | 'legal_notice_sent' | 'response_received'
  | 'court_filing_prepared' | 'court_filed' | 'hearing_scheduled'
  | 'pre_hearing_preparation' | 'hearing_conducted' | 'evidence_submitted'
  | 'arguments_presented' | 'judgment_reserved' | 'judgment_delivered'
  | 'appeal_filed' | 'case_completed' | 'case_closed';

export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'blocked' | 'failed';
export type HearingType = 'preliminary' | 'evidence' | 'arguments' | 'judgment' | 'appeal' | 'motion' | 'settlement' | 'other';
export type HearingStatus = 'scheduled' | 'confirmed' | 'postponed' | 'completed' | 'cancelled' | 'adjourned';
export type EvidenceType = 'document' | 'photograph' | 'video' | 'audio' | 'physical' | 'witness_statement' | 'expert_opinion' | 'digital';
export type EvidenceStatus = 'collected' | 'verified' | 'submitted' | 'admitted' | 'rejected' | 'challenged';
export type NoticeType = 'legal_notice' | 'demand_notice' | 'cease_desist' | 'eviction' | 'termination' | 'reply' | 'reminder' | 'court_summon';
export type NoticeStatus = 'drafted' | 'approved' | 'sent' | 'delivered' | 'acknowledged' | 'responded' | 'expired';
export type TimelineEventType = 'status_change' | 'document' | 'payment' | 'hearing' | 'communication' | 'assignment' | 'milestone' | 'deadline' | 'note' | 'system';

// -----------------------------------------------------------------------------
// TABLE 21: CASE_WORKFLOW
// Case workflow stage management
// -----------------------------------------------------------------------------

export interface CaseWorkflow {
  workflow_id: string;                // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  
  // Current State
  current_stage: WorkflowStage;
  current_stage_name: string;
  current_stage_name_local?: string;
  current_status: WorkflowStatus;
  
  // Progress
  progress_percentage: number;
  stages_completed: number;
  total_stages: number;
  
  // Stage Details
  stages: WorkflowStageDetail[];
  
  // Timing
  started_at: Date;
  expected_completion_date?: Date;
  actual_completion_date?: Date;
  time_in_current_stage_days: number;
  
  // Blockers
  is_blocked: boolean;
  blocker_reason?: string;
  blocker_resolved_at?: Date;
  
  // Automation
  auto_progress_enabled: boolean;
  next_auto_action?: string;
  next_auto_action_date?: Date;
  
  // AI Assistance
  ai_recommended_next_step?: string;
  ai_estimated_days_remaining?: number;
  ai_risk_flags?: string[];
  
  // Timestamps
  last_stage_change_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowStageDetail {
  stage: WorkflowStage;
  stage_name: string;
  stage_order: number;
  status: WorkflowStatus;
  started_at?: Date;
  completed_at?: Date;
  duration_days?: number;
  notes?: string;
  completed_by?: string;
  dependencies: WorkflowStage[];
  is_mandatory: boolean;
}

// -----------------------------------------------------------------------------
// TABLE 22: COURT_HEARINGS
// Court hearing schedule and management
// -----------------------------------------------------------------------------

export interface CourtHearing {
  hearing_id: string;                 // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  
  // Hearing Info
  hearing_number: number;             // Sequential for case
  hearing_type: HearingType;
  hearing_purpose: string;
  hearing_purpose_local?: string;
  
  // Court Details
  court_name: string;
  court_branch?: string;
  court_room?: string;
  court_address?: string;
  judge_name?: string;
  judge_designation?: string;
  
  // Scheduling
  scheduled_date: Date;
  scheduled_time?: string;
  timezone: string;
  expected_duration_minutes?: number;
  
  // Actual
  actual_date?: Date;
  actual_start_time?: Date;
  actual_end_time?: Date;
  actual_duration_minutes?: number;
  
  // Status
  status: HearingStatus;
  status_reason?: string;
  postponement_count: number;
  
  // Previous/Next
  previous_hearing_id?: string;
  next_hearing_id?: string;
  next_hearing_date?: Date;
  adjournment_reason?: string;
  
  // Participants
  client_present: boolean;
  lawyer_present: boolean;
  opponent_present?: boolean;
  opponent_lawyer_present?: boolean;
  witnesses?: string[];
  
  // Proceedings
  agenda?: string[];
  proceedings_summary?: string;
  orders_passed?: string;
  directions_given?: string[];
  
  // Documents
  documents_submitted?: string[];
  documents_requested?: string[];
  order_sheet_url?: string;
  
  // Next Steps
  next_steps?: string[];
  deadlines?: HearingDeadline[];
  
  // Reminders
  reminder_sent: boolean;
  reminder_date?: Date;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface HearingDeadline {
  deadline_id: string;
  description: string;
  due_date: Date;
  responsible_party: 'client' | 'lawyer' | 'opponent' | 'court';
  is_completed: boolean;
  completed_at?: Date;
}

// -----------------------------------------------------------------------------
// TABLE 23: EVIDENCE_RECORDS
// Case evidence management
// -----------------------------------------------------------------------------

export interface EvidenceRecord {
  evidence_id: string;                // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  
  // Evidence Info
  evidence_number: string;            // Sequential: EV-001
  evidence_type: EvidenceType;
  evidence_title: string;
  evidence_description: string;
  evidence_description_local?: string;
  
  // Source
  source_type: 'client' | 'lawyer' | 'witness' | 'expert' | 'third_party' | 'court';
  source_name?: string;
  source_contact?: string;
  
  // Collection
  collected_date: Date;
  collected_by: string;               // User ID
  collection_method?: string;
  chain_of_custody?: CustodyRecord[];
  
  // File Details
  file_url?: string;
  file_type?: string;
  file_size?: number;
  file_hash?: string;                 // For integrity
  original_filename?: string;
  
  // Physical Evidence
  physical_location?: string;
  physical_condition?: string;
  storage_reference?: string;
  
  // Verification
  status: EvidenceStatus;
  verified_by?: string;
  verification_date?: Date;
  verification_notes?: string;
  
  // Court Submission
  submitted_to_court: boolean;
  submission_date?: Date;
  court_reference_number?: string;
  admission_status?: 'pending' | 'admitted' | 'rejected' | 'objected';
  objection_details?: string;
  
  // Relevance
  relevance_description?: string;
  supports_argument?: string;
  
  // Confidentiality
  is_confidential: boolean;
  access_restricted_to?: string[];
  
  // AI Analysis
  ai_extracted_text?: string;
  ai_summary?: string;
  ai_relevance_score?: number;
  ai_authenticity_score?: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface CustodyRecord {
  custody_id: string;
  transferred_from?: string;
  transferred_to: string;
  transfer_date: Date;
  purpose: string;
  location: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// TABLE 24: LEGAL_NOTICES
// Legal notice generation and tracking
// -----------------------------------------------------------------------------

export interface LegalNotice {
  notice_id: string;                  // UUID - Primary Key
  case_id?: string;                   // FK -> Cases (optional, can be standalone)
  
  // Notice Info
  notice_number: string;              // Unique: LN-2026-XXXXX
  notice_type: NoticeType;
  notice_title: string;
  notice_title_local?: string;
  
  // Parties
  sender_id: string;                  // FK -> Users
  sender_name: string;
  sender_address: string;
  sender_lawyer_id?: string;          // FK -> Lawyers
  
  recipient_name: string;
  recipient_address: string;
  recipient_email?: string;
  recipient_phone?: string;
  
  // Content
  subject: string;
  subject_local?: string;
  body_text: string;
  body_text_local?: string;
  legal_sections_cited?: string[];
  relief_sought?: string;
  
  // Response Requirements
  response_deadline_days: number;
  response_deadline_date: Date;
  requires_response: boolean;
  
  // Status
  status: NoticeStatus;
  status_history: NoticeStatusHistory[];
  
  // Drafting
  drafted_by: string;                 // User ID
  drafted_at: Date;
  approved_by?: string;
  approved_at?: Date;
  
  // Delivery
  delivery_method: 'email' | 'registered_post' | 'courier' | 'hand_delivery' | 'legal_notice_service';
  sent_at?: Date;
  delivery_reference?: string;        // Tracking number
  delivered_at?: Date;
  delivery_proof_url?: string;
  
  // Response
  response_received: boolean;
  response_received_at?: Date;
  response_summary?: string;
  response_document_url?: string;
  
  // Documents
  notice_document_url?: string;
  signed_copy_url?: string;
  attachments?: string[];
  
  // AI Generation
  ai_generated: boolean;
  ai_template_used?: string;
  ai_confidence_score?: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
}

export interface NoticeStatusHistory {
  status: NoticeStatus;
  changed_at: Date;
  changed_by?: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// TABLE 25: CASE_TIMELINE (Enhanced)
// Comprehensive case event tracking
// -----------------------------------------------------------------------------

export interface CaseTimelineExtended {
  timeline_id: string;                // UUID - Primary Key
  case_id: string;                    // FK -> Cases
  
  // Event Info
  event_type: TimelineEventType;
  event_subtype?: string;
  event_title: string;
  event_title_local?: string;
  event_description?: string;
  event_description_local?: string;
  
  // Timing
  event_date: Date;
  event_time?: string;
  duration_minutes?: number;
  
  // Actor
  actor_id?: string;                  // FK -> Users
  actor_type: 'client' | 'lawyer' | 'admin' | 'system' | 'ai_agent' | 'court' | 'opponent';
  actor_name?: string;
  
  // Related Entities
  related_document_id?: string;
  related_hearing_id?: string;
  related_payment_id?: string;
  related_notice_id?: string;
  related_evidence_id?: string;
  
  // Changes (for status changes)
  old_value?: string;
  new_value?: string;
  change_summary?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  tags?: string[];
  
  // Visibility
  is_public: boolean;                 // Visible to client
  is_internal: boolean;               // Internal notes
  is_highlighted: boolean;            // Important event
  
  // Attachments
  attachments?: TimelineAttachment[];
  
  // AI
  ai_generated: boolean;
  ai_summary?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface TimelineAttachment {
  attachment_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}

// =============================================================================
// DATABASE STATISTICS - PHASES 2, 3, 4
// =============================================================================

export const EXTENDED_DATABASE_STATS = {
  phase2: {
    tablesAdded: 6,
    tableNames: ['Lawyer_Verification', 'Franchise_Offices', 'Legal_Knowledge', 
                 'Compliance_Records', 'Languages', 'Countries'],
    totalFieldsAdded: 120,
  },
  phase3: {
    tablesAdded: 4,
    tableNames: ['Lawyer_Hiring_Contracts', 'Consultation_Sessions', 
                 'Subscription_Plans', 'Lawyer_Performance'],
    totalFieldsAdded: 95,
  },
  phase4: {
    tablesAdded: 5,
    tableNames: ['Case_Workflow', 'Court_Hearings', 'Evidence_Records', 
                 'Legal_Notices', 'Case_Timeline'],
    totalFieldsAdded: 110,
  },
  totals: {
    phase1Tables: 10,
    phase2Tables: 6,
    phase3Tables: 4,
    phase4Tables: 5,
    totalTables: 25,
    totalFields: 575,
    totalIndexes: 45,
    totalForeignKeys: 35,
  }
};
