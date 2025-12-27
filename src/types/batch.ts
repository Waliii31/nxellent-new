export interface BatchScanItemDto {
    repoUrl: string;
    scanType: "contract" | "application";
    projectName?: string;
    projectDescription?: string;
}

export interface BatchScanRequestDto {
    scans: BatchScanItemDto[];
}

export interface BatchScanResponseDto {
    message: string;
    results: Array<{
        repositoryUrl: string;
        success: boolean;
        scanId?: string;
        projectId?: string;
        error?: string;
    }>;
}
