import { publicAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type { EKYCResponse } from "../types/ekyc.type";

const EkycService = {
  verify: async (data: FormData) => {
    const response = await publicAxios.post<ApiResponse<EKYCResponse>>(
      "/api/v1/ekyc/verify",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Verify failed");
    }
    console.log("EkycService.verify response:", response.data.data); // Log the entire response for debugging
    return response.data.data;
  },
};
export default EkycService;

