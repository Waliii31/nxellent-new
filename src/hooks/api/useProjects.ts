// src/hooks/api/useProjects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  ProjectResponseDto,
  CreateProjectDto,
  UpdateProjectDto,
} from "../../types/project";

export const useProjects = () =>
  useQuery<ProjectResponseDto[]>({
    queryKey: ["projects"],
    queryFn: () => api.get<ProjectResponseDto[]>("/projects").then((r) => r.data),
  });

export const usePublicProjects = () =>
  useQuery<ProjectResponseDto[]>({
    queryKey: ["projects-public"],
    queryFn: () =>
      api.get<ProjectResponseDto[]>("/projects/public").then((r) => r.data),
  });

export const usePublicProject = (id?: string) =>
  useQuery<ProjectResponseDto>({
    queryKey: ["project-public", id],
    enabled: !!id,
    queryFn: () =>
      api.get<ProjectResponseDto>(`/projects/public/${id}`).then((r) => r.data),
  });

export const useLeaderboardProjects = (params: {
  page?: number;
  limit?: number;
  tab?: string;
  period?: string;
  search?: string;
} = {}) =>
  useQuery<any>({
    queryKey: ["projects-leaderboard", params],
    queryFn: () => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", String(params.page));
      if (params.limit) q.append("limit", String(params.limit));
      if (params.tab) q.append("tab", params.tab);
      if (params.period) q.append("period", params.period);
      if (params.search) q.append("search", params.search);
      return api.get<any>(`/projects/leaderboard?${q.toString()}`).then((r) => r.data);
    },
  });

export const useMyProjects = () =>
  useQuery<ProjectResponseDto[]>({
    queryKey: ["my-projects"],
    queryFn: () =>
      api.get<ProjectResponseDto[]>("/projects").then((r) =>
        r.data.map(p => ({
          ...p,
          id: p.id || p._id || ""
        }))
      ),
  });

export const useProject = (id?: string) =>
  useQuery<ProjectResponseDto>({
    queryKey: ["project", id],
    enabled: !!id,
    queryFn: () =>
      api.get<ProjectResponseDto>(`/projects/${id}`).then((r) => r.data),
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProjectDto) =>
      api.post<ProjectResponseDto>("/projects", body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; body: UpdateProjectDto }) =>
      api
        .patch<ProjectResponseDto>(`/projects/${params.id}`, params.body)
        .then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["project", vars.id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

// ----- Team management -----

export const useAddTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; body: { email?: string; userId?: string; role: string } }) =>
      api
        .post<ProjectResponseDto>(`/projects/${params.id}/team`, params.body)
        .then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["project", vars.id] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; userId: string }) =>
      api
        .delete<ProjectResponseDto>(
          `/projects/${params.id}/team/${params.userId}`
        )
        .then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["project", vars.id] });
    },
  });
};

export const useUpdateTeamMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      id: string;
      userId: string;
      body: { role: string };
    }) =>
      api
        .patch<ProjectResponseDto>(
          `/projects/${params.id}/team/${params.userId}/role`,
          params.body
        )
        .then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["project", vars.id] });
    },
  });
};