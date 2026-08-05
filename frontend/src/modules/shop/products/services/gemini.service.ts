import { publicAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type {
  BookMetaRequest,
  GeminiBookMetaResponse,
} from "../types/gemini.type";

const GeminiService = {
  getBookMeta: async (
    request: BookMetaRequest,
  ): Promise<GeminiBookMetaResponse> => {
    const response = await publicAxios.get<ApiResponse<GeminiBookMetaResponse>>(
      "/api/v1/gemini/book-meta",
      {
        params: request,
      },
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to book meta");
    }
    return response.data.data;
  },
};
export default GeminiService;
