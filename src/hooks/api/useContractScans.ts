// src/hooks/api/useContractScans.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  ContractScanResponseDto,
  CreateContractScanDto,
} from "../../types/scans";

export const useContractScans = () =>
  useQuery<ContractScanResponseDto[]>({
    queryKey: ["contract-scans"],
    queryFn: () =>
      api.get<ContractScanResponseDto[]>("/contract-scans").then((r) => r.data),
  });

export const useContractScanStatistics = () =>
  useQuery({
    queryKey: ["contract-scans-statistics"],
    queryFn: () =>
      api.get("/contract-scans/statistics").then((r) => r.data),
  });

export const useContractScansForProject = (projectId?: string) =>
  useQuery<ContractScanResponseDto[]>({
    queryKey: ["contract-scans-project", projectId],
    enabled: !!projectId,
    queryFn: () =>
      api
        .get<ContractScanResponseDto[]>(`/contract-scans/project/${projectId}`)
        .then((r) => r.data),
  });

export const useLatestContractScanForProject = (projectId?: string) =>
  useQuery<ContractScanResponseDto | null>({
    queryKey: ["contract-scans-project-latest", projectId],
    enabled: !!projectId,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: false, // Don't retry on error
    refetchOnWindowFocus: true,
    queryFn: async () => {
      try {
        const response = await api.get<ContractScanResponseDto>(
          `/contract-scans/project/${projectId}/latest`
        );
        return response.data;
      } catch (error: any) {
        // If 404, return null - no scan exists yet
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });

export const useContractScan = (id?: string) =>
  useQuery<ContractScanResponseDto>({
    queryKey: ["contract-scan", id],
    enabled: !!id,
    queryFn: () =>
      api
        .get<ContractScanResponseDto>(`/contract-scans/${id}`)
        .then((r) => r.data),
  });

export const useCreateContractScan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateContractScanDto) =>
      api
        .post<ContractScanResponseDto>("/contract-scans", body)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["contract-scans"] });
      qc.invalidateQueries({ queryKey: ["contract-scans-project", data.project] });
      qc.invalidateQueries({ queryKey: ["contract-scans-project-latest", data.project] });
      qc.invalidateQueries({ queryKey: ["project", data.project] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

// internal/admin helpers – you probably won't use in UI yet
export const useUpdateContractScanStatus = () =>
  useMutation({
    mutationFn: (params: {
      id: string;
      body: Partial<ContractScanResponseDto>;
    }) =>
      api
        .patch<ContractScanResponseDto>(
          `/contract-scans/${params.id}/status`,
          params.body
        )
        .then((r) => r.data),
  });

export const useUpdateContractScanResults = () =>
  useMutation({
    mutationFn: (params: {
      id: string;
      body: Partial<ContractScanResponseDto>;
    }) =>
      api
        .patch<ContractScanResponseDto>(
          `/contract-scans/${params.id}/results`,
          params.body
        )
        .then((r) => r.data),
  });
