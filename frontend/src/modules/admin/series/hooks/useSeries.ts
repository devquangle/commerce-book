import type { Pagination } from "@/libs/utils/pagination";
import type {
  SeriesFilterRequest,
  SeriesRequest,
  SeriesResponse,
  SeriesProductResponse,
} from "../types/series.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SeriesService from "../services/series.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useFilterSeries = (options?: SeriesFilterRequest) => {
  return useQuery<Pagination<SeriesResponse>>({
    queryKey: ["series-filter", options],
    queryFn: () => SeriesService.search(options),
  });
};

export const useCreateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: SeriesRequest) => SeriesService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series-filter"] });

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

export const useUpdateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: SeriesRequest }) =>
      SeriesService.update(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series-filter"] });

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

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SeriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series-filter"] });
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
export const useSeriesWithBookCount = () => {
  return useQuery<SeriesProductResponse[]>({
    queryKey: ["series-with-book-count"],
    queryFn: () => SeriesService.getSeriesWithBookCount(),
  });
};
