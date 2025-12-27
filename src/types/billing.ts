// src/types/billing.ts

export interface BillingStatusDto {
  plan: string;
  remainingScans: number;
  totalScans: number;
  renewsAt?: string;
}

export interface ScanEligibilityDto {
  eligible: boolean;
  reason?: string;
}

export interface CheckoutSessionDto {
  checkoutUrl: string;
}
