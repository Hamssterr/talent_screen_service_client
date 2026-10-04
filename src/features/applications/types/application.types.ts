import { PaginationMeta } from "@/lib/api/pagination";
import { ApplicationStatusKey } from "@/lib/status/application-status";

export type ApplicationStatus = ApplicationStatusKey;
export type ApplicationListScope = "all" | "mine" | "job-owned";

export interface CandidateSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface JobSummary {
  id: string;
  title: string;
  status: string;
  ownerId: string;
}

export interface ApplicationOwner {
  ownerId: string;
  name: string;
  role?: string[];
}

export interface Application {
  id: string;
  owner?: ApplicationOwner;
  candidateId: string;
  jobId: string;
  currentCvVersionId: string | null;
  status: ApplicationStatus;
  version: number;
  notes: string | null;
  withdrawReason: string | null;
  withdrawnAt: string | null;
  createdAt: string;
  updatedAt: string;
  candidate?: CandidateSummary;
  job?: JobSummary;
}

export interface CreateApplicationInput {
  candidateId: string;
  jobId: string;
  notes?: string;
}

export interface UpdateApplicationInput {
  expectedVersion: number;
  notes?: string;
}

export interface WithdrawApplicationInput {
  expectedVersion: number;
  reason?: string;
}

export interface ListApplicationsParams {
  page?: number;
  limit?: number;
  jobId?: string;
  candidateId?: string;
  status?: ApplicationStatus;
  scope?: ApplicationListScope;
}

export interface PaginatedApplicationsResult {
  data: Application[];
  meta: PaginationMeta;
}
