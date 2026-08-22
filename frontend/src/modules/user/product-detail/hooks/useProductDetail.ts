import { useQuery } from "@tanstack/react-query";
import ProductDetailService from "../services/product-detail.service";

export const useProductDetail = (slug: string) => {
  return useQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => ProductDetailService.getProductFull(slug),
    enabled: !!slug,
  });
};
