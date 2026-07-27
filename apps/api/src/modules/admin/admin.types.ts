export type MerchantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELED';
export type DriverStatus = 'PENDING' | 'APPROVED' | 'BLOCKED' | 'INACTIVE';
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELED';
export type BillingInterval = 'MONTHLY' | 'YEARLY';

export interface AdminDashboardSummary {
  merchants: { total: number; active: number; pending: number; suspended: number };
  drivers: { total: number; approved: number; pending: number; blocked: number };
  billing: { recurringRevenueCents: number; overdueInvoices: number; openAmountCents: number };
  operation: { openOrders: number; waitingDrivers: number; activeDeliveries: number };
}

export interface CreateMerchantInput {
  legalName: string;
  tradeName: string;
  document: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  planId?: string;
}

export interface CreateDriverInput {
  name: string;
  phone: string;
  document: string;
  cnh?: string;
  vehiclePlate?: string;
  city: string;
  state: string;
}

export interface CreatePlanInput {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  interval: BillingInterval;
  limits: Record<string, number | boolean>;
}
