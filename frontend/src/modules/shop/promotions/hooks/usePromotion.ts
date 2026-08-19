import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  PromotionFilterRequest,
  PromotionRequest,
  PromotionResponse,
} from "../types/promotion.type";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";
import PromotionService from "../services/promotion.service";

export const usePromotionShop = (options?: PromotionFilterRequest) => {
  return useQuery<Pagination<PromotionResponse>>({
    queryKey: ["shop-promotions-filter", options],
    queryFn: () => PromotionService.fetchPromotionShop(options),
  });
};

export const usePromotionShopDetail = (id: number) => {
  return useQuery<PromotionResponse>({
    queryKey: ["shop-promotion-detail", id],
    queryFn: () => PromotionService.detail(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreatePromotionShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PromotionRequest) => PromotionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-promotions-filter"] });
      showSuccessToast("Thêm mới promotion thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm promotion.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdatePromotionShop = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PromotionRequest) => {
      if (!id) {
        throw new Error("Mã promotion không hợp lệ");
      }
      return PromotionService.update(id, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-promotions-filter"] });
      queryClient.invalidateQueries({ queryKey: ["shop-promotion-detail"] });
      showSuccessToast("Cập nhật promotion thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật promotion.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeletePromotionShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PromotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-promotions-filter"] });
      showSuccessToast("Xóa promotion thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa promotion.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
