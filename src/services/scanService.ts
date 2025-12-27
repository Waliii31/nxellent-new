import { api } from "./api";
import type { BatchScanRequestDto, BatchScanResponseDto } from "../types/batch";

export const initiateBatchScan = async (data: BatchScanRequestDto): Promise<BatchScanResponseDto> => {
    const response = await api.post<BatchScanResponseDto>("/scans/batch", data);
    return response.data;
};

export const generateProjectPdf = async (projectId: string): Promise<Blob> => {
    const response = await api.get(`/pdf/project/${projectId}`, {
        responseType: "blob",
    });
    return response.data;
};
