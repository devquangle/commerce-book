import { authAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { AddressRequest, AddressResponse } from "../types/address.type";

export const AddressService = {
  getAll: async (): Promise<AddressResponse[]> => {
    const response = await authAxios.get<ApiResponse<AddressResponse[]>>(
      "/api/v1/user/address",
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Lỗi khi lấy danh sách địa chỉ");
    }
    return response.data.data;
  },

  getById: async (id: number): Promise<AddressResponse> => {
    const response = await authAxios.get<ApiResponse<AddressResponse>>(
      `/api/v1/user/address/${id}`,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Lỗi khi lấy chi tiết địa chỉ");
    }
    return response.data.data;
  },

  create: async (request: AddressRequest): Promise<AddressResponse> => {
    const response = await authAxios.post<ApiResponse<AddressResponse>>(
      "/api/v1/user/address",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Lỗi khi thêm địa chỉ");
    }
    return response.data.data;
  },

  update: async (
    id: number,
    request: AddressRequest,
  ): Promise<AddressResponse> => {
    const response = await authAxios.put<ApiResponse<AddressResponse>>(
      `/api/v1/user/address/${id}`,
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Lỗi khi cập nhật địa chỉ");
    }
    return response.data.data;
  },

  setDefault: async (id: number): Promise<void> => {
    // Trạm API yêu cầu body AddressRequest nhưng không thực sự dùng data trong controller,
    // chúng ta gửi empty object để thỏa mãn yêu cầu của backend
    const response = await authAxios.put<ApiResponse<void>>(
      `/api/v1/user/address/${id}/default`,
      {},
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi khi đặt địa chỉ mặc định");
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/user/address/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Lỗi khi xóa địa chỉ");
    }
  },
};
