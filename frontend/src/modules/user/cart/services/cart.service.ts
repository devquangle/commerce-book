import { authAxios } from "@/libs/config/axios.config";
import type { CartResponse } from "../types/cart.type";
import type { ApiResponse } from "@/libs/utils/api-response";

export const CartService = {
  getMyCart: async (): Promise<CartResponse[]> => {
    const res = await authAxios.get<ApiResponse<CartResponse[]>>(
      "/api/v1/auth/my-cart",
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Load cart failed");
    }
    console.log("cart",res.data.data);
    

    return res.data.data;
  },
};
