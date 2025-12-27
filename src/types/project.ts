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
  latestContractScan?: any | null; // Scan data included by backend
  latestApplicationScan?: any | null; // Scan data included by backend
  scoringDetails?: any; // Scoring details from backend
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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



