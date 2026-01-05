// src/hooks/api/useSubscription.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  SubscriptionStatusDto,
  FeatureAccessDto,
} from "../../types/subscription";

export const useSubscriptionStatus = () =>
  useQuery<SubscriptionStatusDto>({
    queryKey: ["subscription-status"],
    queryFn: () =>
      api.get<SubscriptionStatusDto>("/subscription/status").then((r) => r.data),
  });

export const useSubscriptionCheckScanEligibility = () =>
  useMutation({
    mutationFn: () =>
      api.post("/subscription/check-scan-eligibility").then((r) => r.data),
  });

export const useSubscriptionRecordScan = () =>
  useMutation({
    mutationFn: () =>
      api.post("/subscription/record-scan").then((r) => r.data),
  });

export const useSubscriptionUpgrade = () =>
  useMutation({
    mutationFn: (planId: string) =>
      api.post(`/subscription/upgrade/${planId}`).then((r) => r.data),
  });

export const useSubscriptionCancel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/subscription/cancel", {}).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
};

export const useSubscriptionAddCredits = () =>
  useMutation({
    mutationFn: (body: { amount: number }) =>
      api.post("/subscription/add-credits", body).then((r) => r.data),
  });

export const useSubscriptionFeatureAccess = (feature?: string) =>
  useQuery<FeatureAccessDto>({
    queryKey: ["subscription-feature", feature],
    enabled: !!feature,
    queryFn: () =>
      api
        .get<FeatureAccessDto>(`/subscription/features/${feature}`)
        .then((r) => r.data),
  });
