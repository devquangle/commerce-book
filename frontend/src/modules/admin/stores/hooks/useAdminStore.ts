import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  AdminShopDetailResponse,
  AdminShopFilterParams,
  AdminShopResponse,
  RejectShopRequest,
} from "../types/store.type";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";
import StoreService from "../services/store.service";

export const useSearchShopsForAdmin = (params?: AdminShopFilterParams) => {
  return useQuery<Pagination<AdminShopResponse>>({
    queryKey: ["admin-shops-filter", params],
    queryFn: () => StoreService.search(params),
  });
};

export const useShopDetailForAdmin = (id?: number | null) => {
  return useQuery<AdminShopDetailResponse>({
    queryKey: ["admin-shop-detail", id],
    queryFn: () => StoreService.getDetail(id!),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
};

export const useApproveShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => StoreService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shops-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-shop-detail"] });
      showSuccessToast("Phê duyệt cửa hàng thành công!");
    },
    onError: (error: unknown) => {
      let msg = "Đã xảy ra lỗi khi phê duyệt cửa hàng.";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      showErrorToast(msg);
    },
  });
};

export const useRejectShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: RejectShopRequest }) =>
      StoreService.reject(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shops-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-shop-detail"] });
      showSuccessToast("Từ chối phê duyệt cửa hàng thành công!");
    },
    onError: (error: unknown) => {
      let msg = "Đã xảy ra lỗi khi từ chối cửa hàng.";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      showErrorToast(msg);
    },
  });
};
