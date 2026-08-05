import { useMutation, useQuery } from "@tanstack/react-query";
import GoogleBookService from "../services/googlebook.service";
import type { GoogleBookResponse } from "../types/googlebook";
import { showErrorToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useSearchGoogleBook = () => {
  return useMutation<GoogleBookResponse[], Error, string>({
    mutationFn: (query: string) => GoogleBookService.search(query),
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi tìm kiếm từ Google Books.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useGoogleBookQuery = (
  query?: string,
  enabled: boolean = true,
) => {
  return useQuery<GoogleBookResponse[]>({
    queryKey: ["google-books-search", query],
    queryFn: () => GoogleBookService.search(query!),
    enabled: Boolean(enabled && query && query.trim().length > 0),
  });
};
