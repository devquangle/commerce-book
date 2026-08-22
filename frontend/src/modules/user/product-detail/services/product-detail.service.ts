import { publicAxios } from "@/libs/config/axios.config";
import type { ProductFullResponse } from "../types/product-detail.type";
import type { ApiResponse } from "@/libs/utils/api-response";

const ProductDetailService = {
  getProductFull: async (slug: string): Promise<ProductFullResponse> => {
    const response = await publicAxios.get<ApiResponse<ProductFullResponse>>(
      "/api/v1/product-detail",
      {
        params: {
          slug,
        },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Lỗi khi lấy thông tin sản phẩm",
      );
    }

    return response.data.data;
  },
};

export default ProductDetailService;