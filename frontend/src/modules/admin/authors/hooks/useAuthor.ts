import type { Pagination } from "@/libs/utils/pagination";
import type {
  AuthorFilterRequest,
  AuthorRequest,
  AuthorResponse,
  AuthorProductResponse,
} from "../types/author.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthorService from "../services/author.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useFilterAuthor = (options?: AuthorFilterRequest) => {
  return useQuery<Pagination<AuthorResponse>>({
    queryKey: ["authors-filter", options],
    queryFn: () => AuthorService.search(options),
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AuthorRequest) => AuthorService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors-filter"] });

      showSuccessToast("Thêm mới tác giả thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm tác giả.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: AuthorRequest }) =>
      AuthorService.update(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors-filter"] });

      showSuccessToast("Cập nhật tác giả thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật tác giả.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AuthorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors-filter"] });
      showSuccessToast("Xóa tác giả thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa tác giả.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
export const useAuthorsWithBookCount = () => {
  return useQuery<AuthorProductResponse[]>({
    queryKey: ["authors-with-book-count"],
    queryFn: () => AuthorService.getAuthorsWithBookCount(),
  });
};
