export type VoucherStatus = "ACTIVE" | "INACTIVE" | "DELETE";

export interface VoucherResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;

  startDate: string;
  endDate: string;
  status: VoucherStatus;
}

export interface VoucherRequest {
  name: string;
  code: string;
  description: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;

  startDate: string;
  endDate: string;
  status: VoucherStatus;
}

export interface VoucherFilterRequest {
  keyword?: string;
  status?: VoucherStatus;
  page?: number;
  size?: number;
}

