import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerShopService } from "../services/register-shop.service";
import type { RegisterShopRequest, ShopRegisterResponse } from "../types/register-shop.type";
import { showSuccessToast, showErrorToast } from "@/libs/utils/toastUtil";
import { getErrorMessage } from "@/libs/utils/error";

export const useRegisterShop = (isAuthenticated: boolean = false) => {
  const queryClient = useQueryClient();

  return useMutation<ShopRegisterResponse, Error, RegisterShopRequest>({
    mutationFn: (data: RegisterShopRequest) =>
      registerShopService.registerShop(data, isAuthenticated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      showSuccessToast("Đăng ký mở gian hàng thành công! Hồ sơ đang chờ kiểm duyệt.");
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error));
    },
  });
};
