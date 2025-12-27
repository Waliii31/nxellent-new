// src/types/scans.ts

export type Severity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "resolved" | "in_progress";
export type ScanStatusValue = "pending" | "running" | "completed" | "failed";

export interface ContractScanScoresDto {
  overall: number;
  ownership: number;
  cpiFunds: number;
  vulnerabilities: number;
  hygiene: number;
  deployHistory: number;
  splToken: number;
}

export interface ContractScanIssueCountsDto {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ScanFindingDto {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  evidence: string;
  recommendation: string;
  status: FindingStatus;
  pointsDeducted: number;
}

export interface ScanStatusDto {
  status: ScanStatusValue;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface ContractScanResponseDto {
  _id: string;
  project: string;
  scannedBy: string;
  commitHash: string;
  repositoryUrl?: string;
  branch?: string;
  scores: ContractScanScoresDto;
  issueCounts: ContractScanIssueCountsDto;
  coverage: number;
  findings: ScanFindingDto[];
  scanStatus: ScanStatusDto;
  blockchain: string;
  framework?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractScanDto {
  projectId: string;
  commitHash: string;
  repositoryUrl?: string;
  branch?: string;
  blockchain: string;
  framework?: string;
}

// ---------- Application scans ----------

export interface ApplicationScanScoresDto {
  overall: number;
  auth: number;
  secrets: number;
  dependencies: number;
  dataStorage: number;
  apiSurface: number;
  webHygiene: number;
}

export interface ApplicationScanIssueCountsDto {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ConfigSecurityAnalysisDto {
  findings: ScanFindingDto[];
  summary: ApplicationScanIssueCountsDto;
}

export interface DependencyAnalysisDto {
  findings: ScanFindingDto[];
  summary: ApplicationScanIssueCountsDto;
}

export interface RuntimeProbingAnalysisDto {
  probes: any[]; // Using any for now as structure differs slightly
  summary: ApplicationScanIssueCountsDto;
}

export interface ApplicationScanResponseDto {
  _id: string;
  project: string;
  scannedBy: string;
  commitHash: string;
  repositoryUrl?: string;
  branch?: string;
  scores: ApplicationScanScoresDto;
  issueCounts: ApplicationScanIssueCountsDto;
  coverage: number;
  findings: ScanFindingDto[];
  configSecurityAnalysis?: ConfigSecurityAnalysisDto;
  dependencyAnalysis?: DependencyAnalysisDto;
  runtimeProbingAnalysis?: RuntimeProbingAnalysisDto;
  scanStatus: ScanStatusDto;
  framework: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationScanDto {
  projectId: string;
  commitHash: string;
  repositoryUrl?: string;
  branch?: string;
  framework: string;
  language?: string;
}
