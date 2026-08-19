export type PromotionStatus = "ACTIVE" | "INACTIVE" | "DELETE";

export interface PromotionResponse {
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
  status: PromotionStatus;
}

export interface PromotionRequest {
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
  status: PromotionStatus;
}

export interface PromotionFilterRequest {
  keyword?: string;
  startDate?:string;
  endDate?:string;
  status?: PromotionStatus;
  page?: number;
  size?: number;
}

