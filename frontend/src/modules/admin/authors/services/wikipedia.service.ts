import { publicAxios } from "@/libs/config/axios.config";
import type { WikipediaResponse } from "../types/wikipedia.type";
import type { ApiResponse } from "@/libs/utils/api-response";

const WikipediaService = {
  async fetchAuthorData(req: string): Promise<WikipediaResponse> {
    const res = await publicAxios.get<ApiResponse<WikipediaResponse>>(
      "/public/wikipedia",
      {
        params: { name: req },
      },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Lỗi khi lấy thông tin từ wiki");
    }
    return res.data.data;
  },
};

export default WikipediaService;
