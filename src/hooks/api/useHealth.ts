// src/hooks/api/useHealth.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

export const useWelcomePing = () =>
  useQuery<string>({
    queryKey: ["root-welcome"],
    queryFn: () => api.get<string>("/").then((r) => r.data),
  });

export interface HealthStatusDto {
  status: string;
  timestamp: string;
  database: string;
  uptime: number;
  environment: string;
}

export const useHealthStatus = () =>
  useQuery<HealthStatusDto>({
    queryKey: ["health"],
    queryFn: () =>
      api.get<HealthStatusDto>("/health").then((r) => r.data),
  });
