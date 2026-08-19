import type { PromotionCampaignType, PromotionStatus } from "./promotion.type";

export interface ProductPromotionRequest {
  productIds: number[];
}

export interface ProductPromotionResponse {
  productId: number;
  activePromotion: PromotionProductResponse | null;
  promotionHistory: PromotionProductResponse[] | [];
}
export interface PromotionProductResponse {
  promotionId: number;
  name: string;
  startDate: string;
  endDate: string;
  promotionCampaignType: PromotionCampaignType;
  status: PromotionStatus;
  discountPercent: number;
  maxQuantity: number;
  soldQuantity: number;
  reservedQuantity: number;
}
