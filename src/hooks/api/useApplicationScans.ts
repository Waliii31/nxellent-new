// src/hooks/api/useApplicationScans.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  ApplicationScanResponseDto,
  CreateApplicationScanDto,
} from "../../types/scans";

export const useApplicationScans = () =>
  useQuery<ApplicationScanResponseDto[]>({
    queryKey: ["application-scans"],
    queryFn: () =>
      api
        .get<ApplicationScanResponseDto[]>("/application-scans")
        .then((r) => r.data),
  });

export const useApplicationScanStatistics = () =>
  useQuery({
    queryKey: ["application-scans-statistics"],
    queryFn: () =>
      api.get("/application-scans/statistics").then((r) => r.data),
  });

export const useApplicationScansForProject = (projectId?: string) =>
  useQuery<ApplicationScanResponseDto[]>({
    queryKey: ["application-scans-project", projectId],
    enabled: !!projectId,
    queryFn: () =>
      api
        .get<ApplicationScanResponseDto[]>(
          `/application-scans/project/${projectId}`
        )
        .then((r) => r.data),
  });

export const useLatestApplicationScanForProject = (projectId?: string) =>
  useQuery<ApplicationScanResponseDto | null>({
    queryKey: ["application-scans-project-latest", projectId],
    enabled: !!projectId,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: false, // Don't retry on error
    refetchOnWindowFocus: true,
    queryFn: async () => {
      try {
        const response = await api.get<ApplicationScanResponseDto>(
          `/application-scans/project/${projectId}/latest`
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

export const useApplicationScan = (id?: string) =>
  useQuery<ApplicationScanResponseDto>({
    queryKey: ["application-scan", id],
    enabled: !!id,
    queryFn: () =>
      api
        .get<ApplicationScanResponseDto>(`/application-scans/${id}`)
        .then((r) => r.data),
  });

export const useCreateApplicationScan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateApplicationScanDto) =>
      api
        .post<ApplicationScanResponseDto>("/application-scans", body)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["application-scans"] });
      qc.invalidateQueries({
        queryKey: ["application-scans-project", data.project],
      });
      qc.invalidateQueries({
        queryKey: ["application-scans-project-latest", data.project],
      });
      qc.invalidateQueries({ queryKey: ["project", data.project] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

// internal/admin
export const useUpdateApplicationScanStatus = () =>
  useMutation({
    mutationFn: (params: {
      id: string;
      body: Partial<ApplicationScanResponseDto>;
    }) =>
      api
        .patch<ApplicationScanResponseDto>(
          `/application-scans/${params.id}/status`,
          params.body
        )
        .then((r) => r.data),
  });

export const useUpdateApplicationScanResults = () =>
  useMutation({
    mutationFn: (params: {
      id: string;
      body: Partial<ApplicationScanResponseDto>;
    }) =>
      api
        .patch<ApplicationScanResponseDto>(
          `/application-scans/${params.id}/results`,
          params.body
        )
        .then((r) => r.data),
  });
