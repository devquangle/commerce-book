import type { Pagination } from "@/libs/utils/pagination";
import type {
  GenreFilterRequest,
  GenreRequest,
  GenreResponse,
  GenreProductResponse,
} from "../types/genre.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GenreService from "../services/genre.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useFilterGenre = (options?: GenreFilterRequest) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: ["genres-filter", options],
    queryFn: () => GenreService.search(options),
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: GenreRequest) => GenreService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

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

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: GenreRequest }) =>
      GenreService.update(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

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

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => GenreService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });
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
export const useGenresWithBookCount = () => {
  return useQuery<GenreProductResponse[]>({
    queryKey: ["genres-with-book-count"],
    queryFn: () => GenreService.getGenresWithBookCount(),
  });
};
