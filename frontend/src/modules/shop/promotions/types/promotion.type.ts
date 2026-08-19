export type PromotionStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type PromotionCampaignType =
  | "FLASH_SALE"
  | "PRODUCT_DISCOUNT"
  | "SEASONAL";
export interface PromotionResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  promotionCampaignType: PromotionCampaignType;
  status: PromotionStatus;
}

export interface PromotionRequest {
  name: string;
  startDate: string;
  endDate: string;
  promotionCampaignType: PromotionCampaignType;
  status: PromotionStatus;
}

export interface PromotionFilterRequest {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  status?: PromotionStatus;
  page?: number;
  size?: number;
}
