import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import type { ProductFilterRequest, ProductStatus } from "../types/shop-product.type";
import useDebounce from "@/libs/utils/useDebounce";

const initialFilterOptions = {
  keyword: "",
  status: null as ProductStatus | null,
  page: 1,
  size: 10,
};

export const useProductShopFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [status, setStatus] = useState<ProductStatus | null>(
    () => (searchParams.get("status") as ProductStatus) ?? initialFilterOptions.status
  );

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

    if (page !== initialFilterOptions.page) {
      params.set("page", String(page));
    }

    if (size !== initialFilterOptions.size) {
      params.set("size", String(size));
    }

    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, status, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: ProductStatus | null) => {
    setStatus(value);
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
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  const filterParams: ProductFilterRequest = {
    keyword: debouncedKeyword ? debouncedKeyword.trim() : "",
    status: status || undefined,
    page,
    size,
  };

  return {
    keyword,
    status,
    page,
    size,
    debouncedKeyword,
    filterParams,

    setPage,
    setSize,

    handleKeywordChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  };
};
