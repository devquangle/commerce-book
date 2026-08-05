import { authAxios } from "@/libs/config/axios.config";
import type {
  ProductFilterRequest,
  ProductRequest,
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
    >(`/api/v1/shop/products/filter`, { params: options });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch product data");
    }
    return response.data.data;
  },
  async create(data: ProductRequest) {
    const res = await authAxios.post<ApiResponse<ProductResponse>>(
      "/api/v1/shop/products",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add product failed");
    }
    return res.data.data;
  },
};
export default ProductShopService;
