import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import type { VoucherFilterRequest, VoucherStatus } from "../types/voucher.type";
import useDebounce from "@/libs/utils/useDebounce";

const initialFilterOptions = {
  keyword: "",
  startDate: "",
  endDate: "",
  status: null as VoucherStatus | null,
  page: 1,
  size: 10,
};

export const useVoucherShopFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [startDate, setStartDate] = useState<string>(
    () => searchParams.get("startDate") ?? initialFilterOptions.startDate
  );

  const [endDate, setEndDate] = useState<string>(
    () => searchParams.get("endDate") ?? initialFilterOptions.endDate
  );

  const [status, setStatus] = useState<VoucherStatus | null>(
    () => (searchParams.get("status") as VoucherStatus) ?? initialFilterOptions.status
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

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
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
  }, [debouncedKeyword, startDate, endDate, status, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setPage(1);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: VoucherStatus | null) => {
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
    setStartDate(initialFilterOptions.startDate);
    setEndDate(initialFilterOptions.endDate);
    setStatus(initialFilterOptions.status);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  const filterParams: VoucherFilterRequest = {
    keyword: debouncedKeyword ? debouncedKeyword.trim() : "",
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
    page,
    size,
  };

  return {
    keyword,
    startDate,
    endDate,
    status,
    page,
    size,
    debouncedKeyword,
    filterParams,

    setPage,
    setSize,

    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  };
};
