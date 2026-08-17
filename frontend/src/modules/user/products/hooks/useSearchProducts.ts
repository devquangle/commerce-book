import { useQuery } from '@tanstack/react-query';
import SearchProductService from '../services/search-product.service';
import type { SearchProductsFilter } from '../types/search-product';

export const useSearchProducts = (filterOptions: SearchProductsFilter) => {
  return useQuery({
    queryKey: ['searchProducts', filterOptions],
    queryFn: () => SearchProductService.searchProductsForUser(filterOptions),
  });
};
