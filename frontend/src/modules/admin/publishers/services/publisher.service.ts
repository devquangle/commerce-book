import { authAxios } from "@/libs/config/axios.config";
import type { PublisherFilterRequest, PublisherRequest, PublisherResponse } from "../types/publisher.type";
import type { Pagination } from "@/libs/utils/pagination";
import type { ApiResponse } from "@/libs/utils/api-response";

const PublisherService = {
  search: async (
    option?: PublisherFilterRequest,
  ): Promise<Pagination<PublisherResponse>> => {
    const response = await authAxios.get<
      ApiResponse<Pagination<PublisherResponse>>
    >(`/api/v1/admin/publishers/filter`, { params: option });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to fetch publisher data");
    }
    return response.data.data;
  },
  create: async (request: PublisherRequest): Promise<PublisherResponse> => {
    const response = await authAxios.post<ApiResponse<PublisherResponse>>(
      "/api/v1/admin/publishers",
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to add publisher");
    }
    return response.data.data;
  },
  update: async (id: number, request: PublisherRequest): Promise<PublisherResponse> => {
    const response = await authAxios.put<ApiResponse<PublisherResponse>>(
      `/api/v1/admin/publishers/${id}`,
      request,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update publisher");
    }
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    const response = await authAxios.delete<ApiResponse<void>>(
      `/api/v1/admin/publishers/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete publisher");
    }
  },
};
export default PublisherService;
