// src/types/subscription.ts

export interface SubscriptionStatusDto {
  plan: string;
  status: "active" | "trialing" | "canceled" | "incomplete" | string;
  remainingScans: number;
  totalScans: number;
  renewsAt?: string;
  cancelAtPeriodEnd?: string;
  currentPeriodEnd?: string;
}

export interface FeatureAccessDto {
  feature: string;
  hasAccess: boolean;
}
