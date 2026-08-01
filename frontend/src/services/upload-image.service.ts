import { authAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";

const UploadImageService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await authAxios.post<ApiResponse<string>>(
      "/api/v1/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload file");
    }
    return res.data.data;
  },
};

export default UploadImageService;
