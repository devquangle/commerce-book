import type { Pagination } from "@/libs/utils/pagination";
import type { SearchProductsFilter } from "../types/search-product";
import type { ProductCardResponse } from "../types/product-card.type";
import type { ApiResponse } from "@/libs/utils/api-response";
import { publicAxios } from "@/libs/config/axios.config";

const SearchProductService={
  searchProductsForUser: async (
    options?: SearchProductsFilter,
  ): Promise<Pagination<ProductCardResponse>> => {
    const response = await publicAxios.get<
      ApiResponse<Pagination<ProductCardResponse>>
    >(`/api/v1/products/filter`, { params: options });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch product data");
    }
    return response.data.data;
  },
}
export default SearchProductService;