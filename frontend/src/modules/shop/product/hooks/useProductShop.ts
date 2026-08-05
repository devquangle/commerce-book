import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  ProductDetailResponse,
  ProductFilterRequest,
  ProductRequest,
  ProductResponse,
} from "../types/shop-product.type";
import ProductShopService from "../services/shop-product.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useProductShop = (options?: ProductFilterRequest) => {
  return useQuery<Pagination<ProductResponse>>({
    queryKey: ["shop-products-filter", options],
    queryFn: () => ProductShopService.fetchProductShop(options),
  });
};

export const useProductShopDetail = (slug: string) => {
  return useQuery<ProductDetailResponse>({
    queryKey: ["shop-product-detail", slug],
    queryFn: () => ProductShopService.detail(slug),
    enabled: Boolean(slug),
  });
};

export const useCreateProductShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductRequest) => ProductShopService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      showSuccessToast("Thêm mới sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm sản phẩm.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateProductShop = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductRequest) =>
      ProductShopService.update(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({
        queryKey: ["shop-product-detail", slug],
      });
      showSuccessToast("Cập nhật sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật sản phẩm.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

