import { authAxios } from "@/libs/config/axios.config";
import type {
  ProductFilterRequest,
  ProductResponse,

} from "../types/shop-product.type";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { Pagination } from "@/libs/utils/pagination";

const ProductShopService = {
  fetchProductShop: async (
    options?: ProductFilterRequest,
  ): Promise<Pagination<ProductResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<ProductResponse>>
    >(`/api/v1/shop/products`, { params: options });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch product data");
    }
    return response.data.data;
  },
};
export default ProductShopService;
