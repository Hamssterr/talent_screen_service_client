import { PaginationMeta } from "@/lib/api/pagination";

export interface CandidateOwner {
  ownerId: string;
  name: string;
  role?: string[];
}

export interface Candidate {
  id: string;
  owner?: CandidateOwner;
  fullName: string;
  email: string;
  normalizedEmail?: string;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateInput {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface UpdateCandidateInput {
  fullName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface ListCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedCandidatesResult {
  data: Candidate[];
  meta: PaginationMeta;
}
