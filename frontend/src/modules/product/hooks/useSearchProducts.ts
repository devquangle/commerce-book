import { useQuery } from '@tanstack/react-query';

import type { SearchProductsFilter } from '../types/search-product';
import SearchProductService from '../services/search-product.service';

export const useSearchProducts = (filterOptions: SearchProductsFilter) => {
  return useQuery({
    queryKey: ['searchProducts', filterOptions],
    queryFn: () => SearchProductService.searchProductsForUser(filterOptions),
  });
};
