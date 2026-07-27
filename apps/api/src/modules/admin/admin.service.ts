import { Injectable } from '@nestjs/common';
import type { AdminDashboardSummary, CreateDriverInput, CreateMerchantInput, CreatePlanInput } from './admin.types';

@Injectable()
export class AdminService {
  getDashboard(): AdminDashboardSummary {
    return {
      merchants: { total: 0, active: 0, pending: 0, suspended: 0 },
      drivers: { total: 0, approved: 0, pending: 0, blocked: 0 },
      billing: { recurringRevenueCents: 0, overdueInvoices: 0, openAmountCents: 0 },
      operation: { openOrders: 0, waitingDrivers: 0, activeDeliveries: 0 },
    };
  }

  createMerchant(input: CreateMerchantInput) {
    return { id: crypto.randomUUID(), status: 'PENDING', ...input, createdAt: new Date().toISOString() };
  }

  createDriver(input: CreateDriverInput) {
    return { id: crypto.randomUUID(), status: 'PENDING', approvedAt: null, ...input, createdAt: new Date().toISOString() };
  }

  createPlan(input: CreatePlanInput) {
    if (!Number.isInteger(input.priceCents) || input.priceCents < 0) {
      throw new Error('priceCents deve ser um inteiro não negativo');
    }
    return { id: crypto.randomUUID(), active: true, ...input, createdAt: new Date().toISOString() };
  }
}
