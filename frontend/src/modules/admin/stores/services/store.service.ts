import { authAxios } from "@/libs/config/axios.config";
import type {
  AdminShopDetailResponse,
  AdminShopFilterParams,
  AdminShopResponse,
  RejectShopRequest,
} from "../types/store.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

export const StoreService = {
  search: async (
    params?: AdminShopFilterParams,
  ): Promise<Pagination<AdminShopResponse>> => {
    const response = await authAxios.get<ApiResponse<Pagination<AdminShopResponse>>>(
      "/api/v1/admin/shops/filter",
      { params },
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không thể tải danh sách cửa hàng");
    }
    return response.data.data;
  },

  getDetail: async (id: number): Promise<AdminShopDetailResponse> => {
    const response = await authAxios.get<ApiResponse<AdminShopDetailResponse>>(
      `/api/v1/admin/shops/${id}`,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không thể tải chi tiết cửa hàng");
    }
    return response.data.data;
  },

  approve: async (id: number): Promise<void> => {
    const response = await authAxios.put<ApiResponse<void>>(
      `/api/v1/admin/shops/${id}/approve`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Phê duyệt cửa hàng thất bại");
    }
  },

  reject: async (id: number, request: RejectShopRequest): Promise<void> => {
    const response = await authAxios.put<ApiResponse<void>>(
      `/api/v1/admin/shops/${id}/reject`,
      request,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Từ chối cửa hàng thất bại");
    }
  },
};

export default StoreService;
