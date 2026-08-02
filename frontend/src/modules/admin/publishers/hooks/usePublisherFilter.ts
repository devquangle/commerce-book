import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


import useDebounce from "@/libs/utils/useDebounce";
import type { PublisherFilterRequest, PublisherStatus } from "../types/publisher.type";

const initialFilterOptions = {
  keyword: "",
  status: null as PublisherStatus | null,
  page: 1,
  size: 10,
};

export const usePublisherFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [status, setStatus] = useState<PublisherStatus | null>(
    () => (searchParams.get("status") as PublisherStatus) ?? initialFilterOptions.status
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

  const handleStatusChange = useCallback((value: PublisherStatus | null) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword(initialFilterOptions.keyword);
    setStatus(initialFilterOptions.status);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1);
  }, []);

  const filterParams: PublisherFilterRequest = {
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
