// src/hooks/api/useUploadsAndScans.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

export interface UploadZipResponse {
  filename: string;
  path?: string;
  extractPath?: string;
  size: number;
}

export interface InitiateScanBody {
  scanType?: "contract" | "application";
  sourceType: "url" | "upload";
  repoUrl?: string;
  uploadPath?: string; // Assuming uploadPath works for 'upload' source type
  projectId?: string;
  projectName?: string;
  projectDescription?: string;
  projectVisibility?: "private" | "public";
}

export const useUploadZip = () =>
  useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api
        .post<UploadZipResponse>("/uploads/zip", formData)
        .then((r) => r.data);
    },
  });

export const useInitiateScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: InitiateScanBody) =>
      api.post("/scans/initiate", body).then((r) => r.data),
    onSuccess: () => {
      // Invalidate all scan-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["contract-scans"] });
      queryClient.invalidateQueries({ queryKey: ["application-scans"] });
      queryClient.invalidateQueries({ queryKey: ["contract-scans-project"] });
      queryClient.invalidateQueries({ queryKey: ["application-scans-project"] });
      queryClient.invalidateQueries({ queryKey: ["contract-scans-project-latest"] });
      queryClient.invalidateQueries({ queryKey: ["application-scans-project-latest"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
  });
};

