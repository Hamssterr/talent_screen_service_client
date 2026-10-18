import { PaginationMeta } from "@/lib/api/pagination";

export type QuestionSetStatus = "draft" | "generating" | "approved" | "failed";

export type QuestionSetMode = "manual" | "ai";

export type QuestionLanguage = "vi" | "en";

export type QuestionSource = "manual" | "ai";

export type QuestionDifficulty = "basic" | "intermediate" | "advanced";

export interface QuestionSetItem {
  id: string;
  position: number;
  text: string;
  source: QuestionSource;
  competency: string | null;
  evaluationCriterionId: string | null;
  difficulty: QuestionDifficulty;
  allowFollowUp: boolean;
  maxFollowUps: number;
  evidenceRefs: unknown[] | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSetItemInput {
  position: number;
  text: string;
  competency?: string | null;
  evaluationCriterionId?: string | null;
  difficulty?: QuestionDifficulty;
  allowFollowUp?: boolean;
  maxFollowUps?: number;
  evidenceRefs?: unknown[] | null;
  reviewNotes?: string | null;
}

export interface QuestionSetSummary {
  id: string;
  ownerId: string;
  applicationId: string;
  cvVersionId: string;
  cvProfileVersion: number;
  jobVersion: number;
  language: QuestionLanguage;
  mode: QuestionSetMode;
  status: QuestionSetStatus;
  version: number;
  generationVersion: number;
  aiRunId?: string | null;
  sourceQuestionSetId?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  itemCount: number;
  isStale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobSnapshotCriterion {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  rubricLevels?: Array<{
    level: number;
    score: number;
    description: string;
  }>;
}

export interface JobSnapshot {
  jobId: string;
  title: string;
  description?: string;
  requiredSkills?: string[];
  evaluationCriteria?: JobSnapshotCriterion[];
  version: number;
}

export interface QuestionSetDetail extends QuestionSetSummary {
  profileSnapshot: Record<string, unknown>;
  jobSnapshot: JobSnapshot;
  items: QuestionSetItem[];
}

export interface CreateQuestionSetInput {
  mode?: QuestionSetMode;
  cvVersionId?: string;
  language?: QuestionLanguage;
  questionCount?: number;
}

export interface UpdateQuestionSetItemsInput {
  expectedVersion: number;
  items: QuestionSetItemInput[];
}

export interface ApproveQuestionSetInput {
  expectedVersion: number;
}

export interface RetryQuestionGenerationInput {
  expectedGenerationVersion: number;
}

export interface ListQuestionSetsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedQuestionSetsResult {
  data: QuestionSetSummary[];
  meta: PaginationMeta;
}
