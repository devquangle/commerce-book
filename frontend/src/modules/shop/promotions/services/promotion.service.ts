import { authAxios } from "@/libs/config/axios.config";
import type {
  PromotionFilterRequest,
  PromotionRequest,
  PromotionResponse,
} from "../types/promotion.type";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  ProductPromotionResponse,
} from "../types/promotion-product.type";

const PromotionService = {
  fetchPromotionShop: async (
    options?: PromotionFilterRequest,
  ): Promise<Pagination<PromotionResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<PromotionResponse>>
    >(`/api/v1/shop/promotions/filter`, { params: options });
    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to fetch promotion data",
      );
    }
    return response.data.data;
  },

  create: async (data: PromotionRequest): Promise<PromotionResponse> => {
    const res = await authAxios.post<ApiResponse<PromotionResponse>>(
      "/api/v1/shop/promotions",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add promotion failed");
    }
    return res.data.data;
  },

  detail: async (id: number): Promise<PromotionResponse> => {
    const res = await authAxios.get<ApiResponse<PromotionResponse>>(
      `/api/v1/shop/promotions/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Get promotion failed");
    }
    return res.data.data;
  },

  update: async (
    id: number,
    data: PromotionRequest,
  ): Promise<PromotionResponse> => {
    const res = await authAxios.put<ApiResponse<PromotionResponse>>(
      `/api/v1/shop/promotions/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update promotion failed");
    }
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/shop/promotions/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Delete promotion failed");
    }
  },
  getProductPromotions: async (
    productIds: number[],
  ): Promise<ProductPromotionResponse[]> => {
    const res = await authAxios.post<ApiResponse<ProductPromotionResponse[]>>(
      `/api/v1/shop/promotions/products`,
      { productIds },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Load product promotions failed");
    }
    return res.data.data;
  },
};

export default PromotionService;
