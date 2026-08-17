import { useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import type { SearchProductsFilter } from '../types/search-product';

export const initialFilterOptions: SearchProductsFilter = {
  keyword: undefined,
  genres: [],
  authors: [],
  publisher: undefined,
  series: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  rating: undefined,
  page: 1,
  size: 20,
  sort: "",
  hasPromotion: undefined,
};

export const useSearchProductsFilter = (initialState?: Partial<SearchProductsFilter>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const filterOptions = useMemo<SearchProductsFilter>(() => {
    return {
      keyword: searchParams.get('keyword') || initialState?.keyword || initialFilterOptions.keyword,
      genres: searchParams.get('genres') ? searchParams.get('genres')!.split(',') : initialState?.genres || initialFilterOptions.genres,
      authors: searchParams.get('authors') ? searchParams.get('authors')!.split(',') : initialState?.authors || initialFilterOptions.authors,
      publisher: searchParams.get('publisher') || initialState?.publisher || initialFilterOptions.publisher,
      series: searchParams.get('series') || initialState?.series || initialFilterOptions.series,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : initialState?.minPrice || initialFilterOptions.minPrice,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : initialState?.maxPrice || initialFilterOptions.maxPrice,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : initialState?.rating || initialFilterOptions.rating,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : initialState?.page || initialFilterOptions.page,
      size: searchParams.get('size') ? Number(searchParams.get('size')) : initialState?.size || initialFilterOptions.size,
      sort: (searchParams.get('sort') as SearchProductsFilter['sort']) || initialState?.sort || initialFilterOptions.sort,
      hasPromotion: searchParams.get('hasPromotion') || initialState?.hasPromotion || initialFilterOptions.hasPromotion,
    };
  }, [searchParams, initialState]);

  const updateFilter = useCallback((newOptions: Partial<SearchProductsFilter>) => {
    const isPaginationUpdate = Object.keys(newOptions).every(key => key === 'page' || key === 'size');
    const updatedPage = isPaginationUpdate ? (newOptions.page ?? filterOptions.page) : 1;
    
    const mergedOptions = { ...filterOptions, ...newOptions, page: updatedPage };
    const queryParts: string[] = [];

    Object.entries(mergedOptions).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        if (value.length > 0) {
          // Don't encode commas for arrays
          queryParts.push(`${key}=${value.map(encodeURIComponent).join(',')}`);
        }
      } else {
        queryParts.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    });

    navigate(`${location.pathname}?${queryParts.join('&')}`, { replace: true });
  }, [filterOptions, navigate, location.pathname]);

  const handleUpdateField = useCallback(<K extends keyof SearchProductsFilter>(key: K, value: SearchProductsFilter[K]) => {
    updateFilter({ [key]: value } as Partial<SearchProductsFilter>);
  }, [updateFilter]);

  const resetFilters = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  return {
    filterOptions,
    updateFilter,
    handleUpdateField,
    resetFilters,
  };
};
