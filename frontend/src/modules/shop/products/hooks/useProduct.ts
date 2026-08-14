import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  ProductDetailResponse,
  ProductFilterRequest,
  ProductRequest,
  ProductResponse,
  SuperAdminFilterRequest,
  SuperAdminProductResponse,
} from "../types/product.type";
import ProductShopService from "../services/product.service";
import { showErrorToast, showSuccessToast } from "@/libs/utils/toastUtil";
import axios from "axios";

export const useProductShop = (options?: ProductFilterRequest) => {
  return useQuery<Pagination<ProductResponse>>({
    queryKey: ["shop-products-filter", options],
    queryFn: () => ProductShopService.fetchProductShop(options),
  });
};

export const useSearchProductsForAdmin = (options?: SuperAdminFilterRequest) => {
  return useQuery<Pagination<SuperAdminProductResponse>>({
    queryKey: ["admin-products-filter", options],
    queryFn: () => ProductShopService.searchProductsForAdmin(options),
  });
};


export const useProductShopDetail = (slug: string) => {
  return useQuery<ProductDetailResponse>({
    queryKey: ["shop-product-detail", slug],
    queryFn: () => ProductShopService.detail(slug),
    enabled: Boolean(slug),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateProductShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductRequest) => ProductShopService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-filter"] });
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

export const useUpdateProductShop = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: ProductRequest) => {
      if (!id) {
        throw new Error("Mã sản phẩm không hợp lệ");
      }
      return ProductShopService.update(id, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["shop-product-detail"] });
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

export const useDeleteProductShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductShopService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-filter"] });
      showSuccessToast("Xóa sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa sản phẩm.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};


export const useApproveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductShopService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["shop-product-detail"] });
      showSuccessToast("Phê duyệt sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let msg = "Đã xảy ra lỗi khi phê duyệt sản phẩm.";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      showErrorToast(msg);
    },
  });
};

export const useRejectProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      ProductShopService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-filter"] });
      queryClient.invalidateQueries({ queryKey: ["shop-product-detail"] });
      showSuccessToast("Từ chối sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let msg = "Đã xảy ra lỗi khi từ chối sản phẩm.";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      showErrorToast(msg);
    },
  });
};

