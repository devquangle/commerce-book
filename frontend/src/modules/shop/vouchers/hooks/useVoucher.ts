import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  VoucherFilterRequest,
  VoucherRequest,
  VoucherResponse,
} from "../types/voucher.type";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";
import VoucherService from "../services/voucher.service";

export const useVoucherShop = (options?: VoucherFilterRequest) => {
  return useQuery<Pagination<VoucherResponse>>({
    queryKey: ["shop-vouchers-filter", options],
    queryFn: () => VoucherService.fetchVoucherShop(options),
  });
};

export const useVoucherShopDetail = (id: number) => {
  return useQuery<VoucherResponse>({
    queryKey: ["shop-voucher-detail", id],
    queryFn: () => VoucherService.detail(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateVoucherShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoucherRequest) => VoucherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-vouchers-filter"] });
      showSuccessToast("Thêm mới voucher thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm voucher.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateVoucherShop = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: VoucherRequest) => {
      if (!id) {
        throw new Error("Mã voucher không hợp lệ");
      }
      return VoucherService.update(id, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-vouchers-filter"] });
      queryClient.invalidateQueries({ queryKey: ["shop-voucher-detail"] });
      showSuccessToast("Cập nhật voucher thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật voucher.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeleteVoucherShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VoucherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-vouchers-filter"] });
      showSuccessToast("Xóa voucher thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa voucher.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
