import { useMutation, useQuery } from "@tanstack/react-query";
import GeminiService from "../services/gemini.service";
import type {
  BookMetaRequest,
  GeminiBookMetaResponse,
} from "../types/gemini.type";
import { showErrorToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useGetBookMeta = () => {
  return useMutation<GeminiBookMetaResponse, Error, BookMetaRequest>({
    mutationFn: (request: BookMetaRequest) => GeminiService.getBookMeta(request),
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi lấy thông tin từ Gemini.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useGetBookMetaQuery = (
  request?: BookMetaRequest,
  enabled: boolean = true,
) => {
  return useQuery<GeminiBookMetaResponse>({
    queryKey: ["gemini-book-meta", request],
    queryFn: () => GeminiService.getBookMeta(request!),
    enabled: Boolean(enabled && request?.name),
  });
};
