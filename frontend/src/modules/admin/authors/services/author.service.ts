import { authAxios } from "@/libs/config/axios.config";
import type { AuthorFilterRequest, AuthorRequest, AuthorResponse } from "../types/author.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

const AuthorService = {
  search: async (
    option?: AuthorFilterRequest,
  ): Promise<Pagination<AuthorResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<AuthorResponse>>
    >(`/api/v1/admin/authors/filter`, { params: option });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch author data");
    }
    return response.data.data;
  },
  create: async (request: AuthorRequest): Promise<AuthorResponse> => {
    const response = await authAxios.post<ApiResponse<AuthorResponse>>(
      "/api/v1/admin/authors",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to add author");
    }
    return response.data.data;
  },
  update: async (id: number, request: AuthorRequest): Promise<AuthorResponse> => {
    const response = await authAxios.put<ApiResponse<AuthorResponse>>(
      `/api/v1/admin/authors/${id}`,
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update author");
    }
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/admin/authors/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete author");
    }
  },
};
export default AuthorService;
