import { authAxios } from "@/libs/config/axios.config";
import type { GenreFilterRequest, GenreProductResponse, GenreRequest, GenreResponse } from "../types/genre.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

const GenreService = {
  search: async (
    option?: GenreFilterRequest,
  ): Promise<Pagination<GenreResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<GenreResponse>>
    >(`/api/v1/admin/genres/filter`, { params: option });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch genre data");
    }
    return response.data.data;
  },
  create: async (request: GenreRequest): Promise<GenreResponse> => {
    const response = await authAxios.post<ApiResponse<GenreResponse>>(
      "/api/v1/admin/genres",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to add genre");
    }
    return response.data.data;
  },
  update: async (id: number, request: GenreRequest): Promise<GenreResponse> => {
    const response = await authAxios.put<ApiResponse<GenreResponse>>(
      `/api/v1/admin/genres/${id}`,
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update genre");
    }
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/admin/genres/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete genre");
    }
  },
  getGenresWithBookCount: async (): Promise<GenreProductResponse[]> => {
  const response = await authAxios.get<ApiResponse<GenreProductResponse[]>>(
    "/api/v1/genres"
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Failed to get genres with book count"
    );
  }

  return response.data.data;
},

};
export default GenreService;
