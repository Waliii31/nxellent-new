import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    private: boolean;
    language: string;
    updated_at: string;
}

export interface GithubStatus {
    connected: boolean;
    username?: string;
    avatar_url?: string;
}

export const useGithubStatus = () =>
    useQuery<GithubStatus>({
        queryKey: ["github-status"],
        queryFn: () => api.get<GithubStatus>("/auth/github/status").then((r) => r.data),
        retry: false,
    });

export const useGithubRepositories = (enabled: boolean) =>
    useQuery<GithubRepo[]>({
        queryKey: ["github-repos"],
        queryFn: () => api.get<GithubRepo[]>("/auth/github/repos").then((r) => r.data),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
