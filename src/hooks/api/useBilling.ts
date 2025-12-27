// src/hooks/api/useBilling.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../services/api";
import type {
  BillingStatusDto,
  ScanEligibilityDto,
  CheckoutSessionDto,
} from "../../types/billing";

export const useBillingStatus = () =>
  useQuery<BillingStatusDto>({
    queryKey: ["billing-status"],
    queryFn: () =>
      api.get<BillingStatusDto>("/billing/status").then((r) => r.data),
  });

export const useBillingScanEligibility = () =>
  useMutation({
    mutationFn: () =>
      api
        .post<ScanEligibilityDto>("/billing/check-scan-eligibility")
        .then((r) => r.data),
  });

export const useCreateSubscriptionCheckout = () =>
  useMutation({
    mutationFn: (body: { planId: string; successUrl?: string; cancelUrl?: string }) =>
      api
        .post<CheckoutSessionDto>("/billing/create-subscription-checkout", body)
        .then((r) => r.data),
  });

export const useCreatePayPerScanCheckout = () =>
  useMutation({
    mutationFn: (body?: Record<string, unknown>) =>
      api
        .post<CheckoutSessionDto>("/billing/create-pay-per-scan-checkout", body)
        .then((r) => r.data),
  });

export const useBillingTestStripe = () =>
  useQuery({
    queryKey: ["billing-test-stripe"],
    queryFn: () => api.get("/billing/test-stripe").then((r) => r.data),
    enabled: false, // dev only
  });

export const useBillingDiagnose = () =>
  useQuery({
    queryKey: ["billing-diagnose"],
    queryFn: () => api.get("/billing/diagnose").then((r) => r.data),
    enabled: false, // dev only
  });

export const useBillingSubscriptionForUser = (userId?: string) =>
  useQuery({
    queryKey: ["billing-subscription-user", userId],
    enabled: !!userId,
    queryFn: () =>
      api.get(`/billing/subscription/${userId}`).then((r) => r.data),
  });

export const useBillingTestPayment = () =>
  useMutation({
    mutationFn: (type: string) =>
      api.post(`/billing/test-payment/${type}`).then((r) => r.data),
  });

export const useGetInvoices = () =>
  useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => api.get("/billing/invoices").then((r) => r.data),
  });

// Webhook is backend-only, but if you really want:
export const useSimulateStripeWebhook = () =>
  useMutation({
    mutationFn: (body: unknown) =>
      api.post("/webhooks/stripe", body).then((r) => r.data),
  });
