/**
 * EHB Shared Types — consumed by apps/web, services/api, services/ai, and all packages.
 */

export type { Industry, IndustryGroup, IndustryStatus, IndustryPhase } from "@ehb/industry-registry";
export type { TrustLevel, TrustScores, BuyerProtection } from "@ehb/trust-engine";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ISODate = string;
