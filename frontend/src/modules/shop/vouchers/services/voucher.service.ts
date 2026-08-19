import { authAxios } from "@/libs/config/axios.config";
import type {
  VoucherFilterRequest,
  VoucherRequest,
  VoucherResponse,
} from "../types/voucher.type";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { Pagination } from "@/libs/utils/pagination";

const VoucherService = {
  fetchVoucherShop: async (
    options?: VoucherFilterRequest,
  ): Promise<Pagination<VoucherResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<VoucherResponse>>
    >(`/api/v1/shop/vouchers/filter`, { params: options });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch voucher data");
    }
    return response.data.data;
  },

  create: async (data: VoucherRequest): Promise<VoucherResponse> => {
    const res = await authAxios.post<ApiResponse<VoucherResponse>>(
      "/api/v1/shop/vouchers",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add voucher failed");
    }
    return res.data.data;
  },

  detail: async (id: number): Promise<VoucherResponse> => {
    const res = await authAxios.get<ApiResponse<VoucherResponse>>(
      `/api/v1/shop/vouchers/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Get voucher failed");
    }
    return res.data.data;
  },

  update: async (
    id: number,
    data: VoucherRequest,
  ): Promise<VoucherResponse> => {
    const res = await authAxios.put<ApiResponse<VoucherResponse>>(
      `/api/v1/shop/vouchers/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update voucher failed");
    }
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/shop/vouchers/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Delete voucher failed");
    }
  },
};

export default VoucherService;
