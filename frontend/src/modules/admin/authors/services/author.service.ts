import { authAxios } from "@/libs/config/axios.config";
import type { AuthorFilterRequest, AuthorResponse } from "../types/author.type";
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
};
export default AuthorService;
