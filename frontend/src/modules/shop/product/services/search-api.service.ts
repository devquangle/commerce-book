import { publicAxios } from "@/libs/config/axios.config";
import type {
  ProductSearchApiRequest,
  ProductSearchApiResponse,
} from "../types/search-api.type";
import type { ApiResponse } from "@/libs/utils/api-response";

const SearchApiService = {
  getUrlImages: async (
    request: ProductSearchApiRequest,
  ): Promise<ProductSearchApiResponse> => {
    const response = await publicAxios.get<
      ApiResponse<ProductSearchApiResponse | string[]>
    >("/api/v1/search-api/book-images", {
      params: request,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch book images");
    }
    const data = response.data.data;
    if (Array.isArray(data)) {
      return { urlImage: data };
    }
    return data;
  },
};
export default SearchApiService;
