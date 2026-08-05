import { authAxios } from "@/libs/config/axios.config";
import type { ApiResponse } from "@/libs/utils/api-response";
import type {
  ProductImageRequest,
  ProductImageResponse,
  UploadImageResponse,
} from "../type/cloudinary.type";

const UploadImageService = {
  uploadFile: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await authAxios.post<ApiResponse<UploadImageResponse>>(
      "/api/v1/upload/file",
      formData,
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload file");
    }
    return res.data.data;
  },
  uploadImageUrl: async (url: string): Promise<UploadImageResponse> => {
    const res = await authAxios.post<ApiResponse<UploadImageResponse>>(
      "/api/v1/upload/url",
      { url },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return res.data.data;
  },
  uploadImages: async (
    items: ProductImageRequest[],
  ): Promise<ProductImageResponse[]> => {
    const formData = new FormData();

    items.forEach((img, index) => {
      if (img.file) {
        formData.append(`imageRequests[${index}].file`, img.file);
      } else {
        formData.append(`imageRequests[${index}].url`, img.url ?? "");
      }

      formData.append(
        `imageRequests[${index}].isThumbnail`,
        String(img.isThumbnail === true),
      );
    });

    const res = await authAxios.post<ApiResponse<ProductImageResponse[]>>(
      "/api/v1/upload/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to upload image");
    }
    return (res.data.data || []).map((img: ProductImageResponse & { thumbnail?: unknown }, index: number) => {
      const newImg = { ...img };
      delete newImg.thumbnail;
      return {
        ...newImg,
        isThumbnail: items[index]?.isThumbnail === true,
      };
    });
  },
};

export default UploadImageService;
