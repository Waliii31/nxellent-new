// src/hooks/api/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, API_BASE } from "../../services/api";
import { useAppDispatch } from "../../app/store";
import { setCredentials, clearAuth } from "../../features/auth/authSlice";
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  User,
} from "../../types/auth";

export interface GithubStatusResponse {
  connected: boolean;
  username?: string;
}

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: RegisterDto) =>
      api.post<AuthResponseDto>("/auth/register", body).then((r) => r.data),
    onSuccess: (data) => {
      localStorage.setItem("nxellent_access_token", data.access_token);
      dispatch(setCredentials(data));
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginDto) =>
      api.post<AuthResponseDto>("/auth/login", body).then((r) => r.data),
    onSuccess: (data) => {
      localStorage.setItem("nxellent_access_token", data.access_token);
      dispatch(setCredentials(data));
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// current user
export const useCurrentUser = () =>
  useQuery<User>({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/users/profile").then((r) => r.data),
    retry: 1,
  });

// simple logout helper
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return () => {
    dispatch(clearAuth());
    localStorage.removeItem("nxellent_access_token");
    qc.clear();
  };
};

// ---------- GitHub integration ----------

export const useGithubStatus = () =>
  useQuery<GithubStatusResponse>({
    queryKey: ["github-status"],
    queryFn: () => api.get<GithubStatusResponse>("/auth/github/status").then((r) => r.data),
  });

export const useGithubRepos = () =>
  useQuery({
    queryKey: ["github-repos"],
    queryFn: () => api.get("/auth/github/repos").then((r) => r.data),
    enabled: false, // call via refetch()
  });

export const useDisconnectGithub = () =>
  useMutation({
    mutationFn: () => api.post("/auth/disconnect-github"),
  });

// Buttons (no hooks needed – use these helpers in UI):
export const startGithubLogin = () => {
  window.location.href = `${API_BASE}/auth/github`;
};

export const startGithubConnect = () => {
  window.location.href = `${API_BASE}/auth/github/connect`;
};
