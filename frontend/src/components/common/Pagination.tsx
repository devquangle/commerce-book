"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  // Helper to generate visible page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startElement = totalElements
    ? (currentPage - 1) * pageSize + 1
    : undefined;
  const endElement = totalElements
    ? Math.min(currentPage * pageSize, totalElements)
    : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 border-t border-zinc-200 dark:border-zinc-800 text-sm">
      {/* Left side: Page Info Text */}
      <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm order-2 sm:order-1">
        {totalElements !== undefined && startElement && endElement ? (
          <span>
            Hiển thị <span className="font-semibold text-zinc-900 dark:text-white">{startElement}</span>–
            <span className="font-semibold text-zinc-900 dark:text-white">{endElement}</span> trong{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">{totalElements}</span> kết quả
          </span>
        ) : (
          <span>
            Trang <span className="font-semibold text-zinc-900 dark:text-white">{currentPage}</span> /{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Right side: Per-Page Select Dropdown (In Front) + Navigation Buttons */}
      <div className="flex items-center gap-3 order-1 sm:order-2 flex-wrap">
        {/* Per-Page Select Dropdown in front of navigation buttons */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 border-e border-zinc-200 dark:border-zinc-800 pe-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / trang
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Trang trước"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 py-1 text-zinc-400 dark:text-zinc-500 font-medium select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-9 h-9 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                      : "border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="inline-flex items-center justify-center p-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Trang tiếp"
            title="Trang tiếp"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
