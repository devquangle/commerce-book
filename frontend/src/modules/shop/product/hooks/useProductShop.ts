import { useQuery } from "@tanstack/react-query";
import type { Pagination } from "@/libs/utils/pagination";
import type {
  ProductFilterRequest,
  ProductResponse,
} from "../types/shop-product.type";
import ProductShopService from "../services/shop-product.service";

export const useProductShop = (options?: ProductFilterRequest) => {
  return useQuery<Pagination<ProductResponse>>({
    queryKey: ["shop-products-filter", options],
    queryFn: () => ProductShopService.fetchProductShop(options),
  });
};
