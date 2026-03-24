import { api } from "./api";
import type { LoginDto, RegisterDto, AuthResponseDto } from "../types/auth";

export const register = (payload: RegisterDto) => {
  return api.post<AuthResponseDto>("/auth/register", payload).then((r) => r.data);
};

export const login = (payload: LoginDto) => {
  return api.post<AuthResponseDto>("/auth/login", payload).then((r) => r.data);
};

export const startGithubOAuth = () => {
  // Redirect browser to backend GitHub OAuth endpoint
  window.location.href = (import.meta.env.VITE_API_URL || "") + "/auth/github";
};

export const connectGithub = () => {
  const token = localStorage.getItem("nx_token");
  let url = (import.meta.env.VITE_API_URL || "") + "/auth/github/connect";
  if (token) {
    url += `?token=${encodeURIComponent(token)}`;
  }
  window.location.href = url;
};

export const githubStatus = () => api.get("/auth/github/status").then((r) => r.data);

export default { register, login, startGithubOAuth, connectGithub, githubStatus };
