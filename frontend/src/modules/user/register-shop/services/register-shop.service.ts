import { authAxios, publicAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type {
  CheckAccountResponse,
  RegisterShopRequest,
  ShopRegisterResponse,
} from "../types/register-shop.type";

export const registerShopService = {
  registerShop: async (
    data: RegisterShopRequest,
    isAuthenticated: boolean = false
  ): Promise<ShopRegisterResponse> => {
    const axiosClient = isAuthenticated ? authAxios : publicAxios;
    const response = await axiosClient.post<ApiResponse<ShopRegisterResponse>>(
      "/api/v1/shops/register",
      data
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Đăng ký mở cửa hàng thất bại");
    }

    return response.data.data;
  },

  checkShopNameExists: async (name: string): Promise<boolean> => {
    const response = await publicAxios.get<ApiResponse<boolean>>(
      "/api/v1/shops/check-name",
      {
        params: { name },
      }
    );
    return Boolean(response.data.data);
  },

  checkAccountAvailability: async (
    email?: string,
    phone?: string,
    isAuthenticated: boolean = false
  ): Promise<CheckAccountResponse> => {
    const axiosClient = isAuthenticated ? authAxios : publicAxios;
    const response = await axiosClient.get<ApiResponse<CheckAccountResponse>>(
      "/api/v1/shops/check-account",
      {
        params: {
          email: email || undefined,
          phone: phone || undefined,
        },
      }
    );
    return (
      response.data.data || {
        emailExists: false,
        phoneExists: false,
        alreadyHasShop: false,
      }
    );
  },
};
