import { PaginationMeta } from "@/lib/api/pagination";

export type JobStatus = "draft" | "open" | "closed";
export type JobListScope = "all" | "mine" | "shared";

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
}

export interface JobCriterionFormItem {
  id?: string;
  _clientId?: string;
  name: string;
  description: string;
}

export interface Job {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  evaluationCriteria: EvaluationCriterion[];
  status: JobStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobListParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
  scope?: JobListScope;
}

export interface CreateJobInput {
  title: string;
  description: string;
  requiredSkills?: string[];
  evaluationCriteria?: {
    id?: string;
    name: string;
    description: string;
  }[];
  status?: "draft" | "open";
}

export interface UpdateJobInput {
  expectedVersion: number;
  title?: string;
  description?: string;
  requiredSkills?: string[];
  evaluationCriteria?: {
    id?: string;
    name: string;
    description: string;
  }[];
  status?: "draft" | "open";
}

export interface CloseJobInput {
  expectedVersion: number;
}

export interface JobFormValues {
  title: string;
  description: string;
  requiredSkills: string[];
  evaluationCriteria: JobCriterionFormItem[];
  status: "draft" | "open";
}

export interface PaginatedJobsResult {
  data: Job[];
  meta: PaginationMeta;
}
