import { authAxios } from "@/libs/config/axios.config";
import type {
  ProductDetailResponse,
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
  create: async (data: ProductRequest): Promise<ProductResponse> => {
    const res = await authAxios.post<ApiResponse<ProductResponse>>(
      "/api/v1/shop/products",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add product failed");
    }
    return res.data.data;
  },
  detail: async (slug: string): Promise<ProductDetailResponse> => {
    const res = await authAxios.get<ApiResponse<ProductDetailResponse>>(
      "/api/v1/shop/products",
      {
        params: {
          slug,
        },
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Get product failed");
    }

    return res.data.data;
  },
  update: async (
    id: number,
    data: ProductRequest,
  ): Promise<ProductResponse> => {
    const res = await authAxios.put<ApiResponse<ProductResponse>>(
      `/api/v1/shop/products/${id}`,
      data,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update product failed");
    }

    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/shop/products/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Delete product failed");
    }
  },
};
export default ProductShopService;
