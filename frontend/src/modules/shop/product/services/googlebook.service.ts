import { publicAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { GoogleBookResponse } from "../types/googlebook";

const GoogleBookService = {
  search: async (req: string) => {
    const res = await publicAxios.get<ApiResponse<GoogleBookResponse[]>>(
      "/api/v1/google-books",
      {
        params: {
          query: req,
        },
      },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch ggbook api");
    }
    return res.data.data;
  },
};
export default GoogleBookService;
