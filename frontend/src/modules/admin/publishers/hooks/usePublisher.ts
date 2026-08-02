import type { Pagination } from "@/libs/utils/pagination";
import type {
  PublisherFilterRequest,
  PublisherRequest,
  PublisherResponse,
} from "../types/publisher.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PublisherService from "../services/publisher.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useFilterPublisher = (options?: PublisherFilterRequest) => {
  return useQuery<Pagination<PublisherResponse>>({
    queryKey: ["publishers-filter", options],
    queryFn: () => PublisherService.search(options),
  });
};

export const useCreatePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PublisherRequest) => PublisherService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });

      showSuccessToast("Thêm mới nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdatePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: PublisherRequest }) =>
      PublisherService.update(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });

      showSuccessToast("Cập nhật nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeletePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PublisherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });
      showSuccessToast("Xóa nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};