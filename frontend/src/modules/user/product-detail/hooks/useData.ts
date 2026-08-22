import { useParams } from "react-router-dom";
import { useProductDetail } from "./useProductDetail";

export const useData = (slug:string) => {
 
  const { data: productDetail, isLoading: isLoadingProductDetail } =
    useProductDetail(slug);

  return {
    productDetail,
    isLoading: isLoadingProductDetail,
  };
};
