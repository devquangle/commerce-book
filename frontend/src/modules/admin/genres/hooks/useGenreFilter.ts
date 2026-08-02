import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


import useDebounce from "@/libs/utils/useDebounce";
import type { GenreFilterRequest, GenreStatus } from "../types/genre.type";

const initialFilterOptions = {
  keyword: "",
  status: null as GenreStatus | null,
  page: 1,
  size: 10,
};

export const useGenreFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [status, setStatus] = useState<GenreStatus | null>(
    () => (searchParams.get("status") as GenreStatus) ?? initialFilterOptions.status
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

  const handleStatusChange = useCallback((value: GenreStatus | null) => {
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

  const filterParams: GenreFilterRequest = {
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
