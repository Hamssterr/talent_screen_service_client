import { PaginationMeta } from "@/lib/api/pagination";

export type CvExtractionStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed"
  | "needs_manual_input";

export type CvProfileStatus = "draft" | "approved";

export interface CvSkillEvidence {
  page?: number;
  quote?: string;
}

export interface CvSkill {
  name: string;
  evidence?: CvSkillEvidence;
}

export interface CvExperience {
  role: string;
  organization?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

export interface CvProject {
  name: string;
  technologies: string[];
  contribution?: string | null;
  evidence?: CvSkillEvidence;
}

export interface CvEducation {
  institution?: string | null;
  degree?: string | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CvProfileV1 {
  schemaVersion: "profile.v1";
  summary?: string | null;
  skills: CvSkill[];
  experiences: CvExperience[];
  projects: CvProject[];
  education: CvEducation[];
  missingInformation: string[];
}

export interface CvVersionSafe {
  id: string;
  applicationId: string;
  version: number;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  extractionStatus: CvExtractionStatus;
  profileStatus: CvProfileStatus;
  profileVersion: number;
  createdAt: string;
}

export interface CvVersionDetail extends CvVersionSafe {
  ownerId: string;
  pageCount: number | null;
  processingVersion: number;
  profileJson: CvProfileV1 | null;
  profileApprovedBy: string | null;
  profileApprovedAt: string | null;
  errorCode: string | null;
  updatedAt: string;
}

export interface CvExtractionResponse {
  id: string;
  applicationId: string;
  version: number;
  originalFilename: string;
  pageCount: number | null;
  extractionStatus: CvExtractionStatus;
  processingVersion: number;
  profileStatus: CvProfileStatus;
  profileVersion: number;
  profileJson: CvProfileV1 | null;
  errorCode: string | null;
  canRetry: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCvVersionsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedCvVersionsResult {
  data: CvVersionSafe[];
  meta: PaginationMeta;
}

export interface UpdateCvProfileInput {
  expectedProfileVersion: number;
  profile: CvProfileV1;
}

export interface ApproveCvProfileInput {
  expectedProfileVersion: number;
}

export interface ExtractCvProfileInput {
  expectedProcessingVersion: number;
}

export interface RetryCvExtractionInput {
  expectedProcessingVersion: number;
}
