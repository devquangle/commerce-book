import { useCallback, useEffect, useState } from 'react'
import type { ProductStatus } from '../types/product-status.type';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/libs/utils/useDebounce';
import type { SuperAdminFilterRequest } from '../types/product.type';

const initialFilterOptions = {
  keyword: "",
  status: null as ProductStatus | null,
  shopId: null as number | null,
  page: 1,
  size: 10,
};

export const useSuperAdminFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [status, setStatus] = useState<ProductStatus | null>(
    () => (searchParams.get("status") as ProductStatus) ?? initialFilterOptions.status
  );

  const [shopId, setShopId] = useState<number | null>(() => {
    const rawShopId = searchParams.get("shopId");
    return rawShopId ? Number(rawShopId) : initialFilterOptions.shopId;
  });

  const [page, setPage] = useState<number>(
    () => Number(searchParams.get("page")) || initialFilterOptions.page
  );

  const [size, setSize] = useState<number>(
    () => Number(searchParams.get("size")) || initialFilterOptions.size
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword) {
      params.set("keyword", debouncedKeyword.trim());
    }

    if (status) {
      params.set("status", status);
    }

    if (shopId) {
      params.set("shopId", String(shopId));
    }

    if (page !== initialFilterOptions.page) {
      params.set("page", String(page));
    }

    if (size !== initialFilterOptions.size) {
      params.set("size", String(size));
    }

    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, status, shopId, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: ProductStatus | null) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleShopIdChange = useCallback((value: number | null) => {
    setShopId(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword(initialFilterOptions.keyword);
    setStatus(initialFilterOptions.status);
    setShopId(initialFilterOptions.shopId);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  const filterParams: SuperAdminFilterRequest = {
    keyword: debouncedKeyword ? debouncedKeyword.trim() : "",
    status: status || undefined,
    shopId: shopId || undefined,
    page,
    size,
  };

  return {
    keyword,
    status,
    shopId,
    page,
    size,
    debouncedKeyword,
    filterParams,

    setPage,
    setSize,
    setShopId,

    handleKeywordChange,
    handleStatusChange,
    handleShopIdChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  };
};
