// EHB AI Multi-Agent System Types

export type AgentStatus = 'active' | 'idle' | 'processing' | 'error' | 'disabled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

// Agent Types
export type AgentType = 
  | 'orchestrator'
  | 'case_management'
  | 'legal_research'
  | 'document_generation'
  | 'lawyer_matching'
  | 'payment'
  | 'court_process'
  | 'franchise'
  | 'global_compliance'
  | 'security'
  | 'analytics'
  | 'communication'
  | 'knowledge'
  | 'learning';

export interface AIAgent {
  id: string;
  type: AgentType;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  status: AgentStatus;
  version: string;
  capabilities: string[];
  dependencies: AgentType[];
  metrics: AgentMetrics;
  config: AgentConfig;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  avgResponseTime: number;
  accuracy: number;
  uptime: number;
  lastActive: Date;
  memoryUsage: number;
  cpuUsage: number;
}

export interface AgentConfig {
  maxConcurrentTasks: number;
  timeout: number;
  retryAttempts: number;
  priority: number;
  enabled: boolean;
  autoScale: boolean;
}

// Task System
export interface AgentTask {
  id: string;
  type: string;
  title: string;
  description: string;
  sourceAgent: AgentType;
  targetAgent: AgentType;
  priority: TaskPriority;
  status: TaskStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  parentTaskId?: string;
  childTaskIds: string[];
}

// Workflow System
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: TaskStatus;
  currentStepIndex: number;
  context: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface WorkflowTrigger {
  type: 'user_request' | 'scheduled' | 'event' | 'manual';
  condition?: string;
  data?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agent: AgentType;
  action: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: TaskStatus;
  conditions?: WorkflowCondition[];
  onSuccess?: string;
  onFailure?: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

// Global System
export interface CountryConfig {
  code: string;
  name: string;
  nameNative: string;
  languages: string[];
  currency: string;
  timezone: string;
  legalSystem: string;
  courts: string[];
  regulations: string[];
  paymentMethods: string[];
}

export interface LawyerHiringModel {
  type: 'case_based' | 'hourly' | 'monthly' | 'annual_contract';
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  pricing: PricingStructure;
  features: string[];
  terms: string[];
}

export interface PricingStructure {
  basePrice: number;
  currency: string;
  unit: 'case' | 'hour' | 'month' | 'year';
  platformFee: number;
  taxes: number;
}

// Security & Governance
export interface SecurityEvent {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'critical';
  source: string;
  message: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AccessControl {
  userId: string;
  role: 'user' | 'lawyer' | 'admin' | 'super_admin';
  permissions: string[];
  restrictions: string[];
  mfaEnabled: boolean;
  lastLogin: Date;
  loginHistory: LoginRecord[];
}

export interface LoginRecord {
  timestamp: Date;
  ip: string;
  device: string;
  location: string;
  success: boolean;
}

// Analytics
export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCases: number;
  activeCases: number;
  totalLawyers: number;
  activeLawyers: number;
  totalRevenue: number;
  todayRevenue: number;
  systemUptime: number;
  avgResponseTime: number;
  agentPerformance: Record<AgentType, number>;
}
