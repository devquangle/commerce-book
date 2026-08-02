"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SelectBox } from "@/components/common/SelectBox";

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
  // Helper to generate visible page numbers (compact mode: max 5 items)
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
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
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 py-2 px-1 w-full body-text">
      {/* Left side: Page Info Text */}
      <div className="flex items-center text-zinc-500 dark:text-zinc-400">
        {totalElements !== undefined && startElement && endElement ? (
          <>
            <span className="hidden sm:inline">
              Hiển thị <span className="font-semibold text-zinc-900 dark:text-white">{startElement}</span>–
              <span className="font-semibold text-zinc-900 dark:text-white">{endElement}</span> trong{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">{totalElements}</span> kết quả
            </span>
            <span className="sm:hidden font-medium">
              {startElement}–{endElement} / {totalElements}
            </span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">
              Trang <span className="font-semibold text-zinc-900 dark:text-white">{currentPage}</span> /{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span>
            </span>
            <span className="sm:hidden font-medium">
              {currentPage} / {totalPages}
            </span>
          </>
        )}
      </div>

      {/* Right side: Per-Page Select Dropdown (In Front) + Navigation Buttons */}
      <div className="flex flex-row items-center gap-2 sm:gap-3">
        {/* Per-Page Select Dropdown in front of navigation buttons */}
        {onPageSizeChange && (
          <div className="hidden sm:flex items-center justify-center gap-2 border-e border-zinc-200 dark:border-zinc-800 pe-3 text-zinc-500 dark:text-zinc-400">
            <span className="hidden sm:inline">Hiển thị</span>
            <SelectBox
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              options={pageSizeOptions.map((opt) => ({
                label: String(opt),
                value: opt,
              }))}
              containerClassName="!space-y-0 w-[72px]"
              className="px-2! py-1.5! min-h-0!"
              openDirection="up"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-1.5">
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
                    className="px-1.5 py-1 text-zinc-400 dark:text-zinc-500 font-medium select-none"
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
                  className={`min-w-9 h-9 px-3 rounded-xl font-medium transition-all ${
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
