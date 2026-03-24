// src/types/project.ts

export type ProjectType = "contract" | "application" | string;
export type ProjectVisibility = "public" | "private";

// User reference in team members - can be populated or just an ID
export interface PopulatedUser {
  _id: string;
  email: string;
  profile: {
    name: string;
    company?: string;
    avatar?: string;
  };
}

export interface TeamMemberDto {
  user: string | PopulatedUser; // Can be user id or populated user object
  role: "owner" | "member" | string;
  invitedAt: string;
  joinedAt?: string;
}

export interface ProjectScoresDto {
  contract?: Record<string, unknown>;
  application?: Record<string, unknown>;
  overall?: Record<string, unknown>;
}

// --- Scoring Details types (from backend scoring engine) ---

export interface ScoringCategoryDto {
  score?: number;
  findings?: Array<{
    id?: string;
    title?: string;
    severity?: string;
    impact?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface ScoringFindingsCountDto {
  total?: number;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface ScoringTrackDto {
  subscore?: number;
  categories?: Record<string, ScoringCategoryDto>;
  findingsCount?: ScoringFindingsCountDto;
  [key: string]: unknown;
}

export interface ScoringDetailsDto {
  overall?: number;
  coverage?: number;
  shieldRank?: string;
  calculatedAt?: string;
  contractTrack?: ScoringTrackDto;
  applicationTrack?: ScoringTrackDto;
  latestContractScanId?: string;
  latestApplicationScanId?: string;
  [key: string]: unknown;
}

// --- Embedded latest scan data (partial scan data embedded in project response) ---

export interface LatestScanEmbedDto {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  scores?: {
    overall?: number;
    [key: string]: unknown;
  };
  issueCounts?: {
    total?: number;
    critical?: number;
    high?: number;
    medium?: number;
    low?: number;
  };
  findings?: Array<Record<string, unknown>>;
  coverage?: number;
  blockchain?: string;
  framework?: string;
  scanStatus?: {
    status?: string;
    startedAt?: string;
    completedAt?: string;
    errorMessage?: string;
  };
  shieldRank?: string;
  project?: string | Record<string, unknown>;
  [key: string]: unknown;
}

export interface ProjectResponseDto {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  platform: string;
  owner: string;
  teamMembers: TeamMemberDto[];
  visibility: ProjectVisibility;
  currentScores: ProjectScoresDto;
  latestContractScan?: LatestScanEmbedDto | null;
  latestApplicationScan?: LatestScanEmbedDto | null;
  scoringDetails?: ScoringDetailsDto;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Index signature to allow safe casting to Record<string, unknown>
  [key: string]: unknown;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  type: ProjectType;
  platform: string;
  visibility?: ProjectVisibility;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  type?: ProjectType;
  platform?: string;
  visibility?: ProjectVisibility;
}



