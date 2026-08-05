import { useMutation, useQuery } from "@tanstack/react-query";
import SearchApiService from "../services/search-api.service";
import type {
  ProductSearchApiRequest,
  ProductSearchApiResponse,
} from "../types/search-api.type";
import { showErrorToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useGetUrlImages = () => {
  return useMutation<ProductSearchApiResponse, Error, ProductSearchApiRequest>({
    mutationFn: (request: ProductSearchApiRequest) =>
      SearchApiService.getUrlImages(request),
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi tìm kiếm hình ảnh sách.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useGetUrlImagesQuery = (
  request?: ProductSearchApiRequest,
  enabled: boolean = true,
) => {
  return useQuery<ProductSearchApiResponse>({
    queryKey: ["search-api-url-images", request],
    queryFn: () => SearchApiService.getUrlImages(request!),
    enabled: Boolean(enabled && request?.name),
  });
};
