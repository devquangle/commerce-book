import { authAxios } from "@/libs/config/axios.config";
import type {
  SeriesFilterRequest,
  SeriesProductResponse,
  SeriesRequest,
  SeriesResponse,
} from "../types/series.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

const SeriesService = {
  search: async (
    option?: SeriesFilterRequest,
  ): Promise<Pagination<SeriesResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<SeriesResponse>>
    >(`/api/v1/admin/series/filter`, { params: option });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch series data");
    }
    return response.data.data;
  },
  create: async (request: SeriesRequest): Promise<SeriesResponse> => {
    const response = await authAxios.post<ApiResponse<SeriesResponse>>(
      "/api/v1/admin/series",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to add series");
    }
    return response.data.data;
  },
  update: async (
    id: number,
    request: SeriesRequest,
  ): Promise<SeriesResponse> => {
    const response = await authAxios.put<ApiResponse<SeriesResponse>>(
      `/api/v1/admin/series/${id}`,
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update series");
    }
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/admin/series/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete series");
    }
  },
  getSeriesWithProducts: async (): Promise<SeriesProductResponse[]> => {
    const response =
      await authAxios.get<ApiResponse<SeriesProductResponse[]>>(
        "/api/v1/series",
      );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to get series with book count",
      );
    }

    return response.data.data;
  },
};
export default SeriesService;
