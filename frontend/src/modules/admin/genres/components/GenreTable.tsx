import React from "react";
import { getLabelGenreStatus, type GenreResponse } from "../types/genre.type";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { GenreActionMenu } from "./GenreActionMenu";

interface GenreTableProps {
  genres: GenreResponse[];
  page?: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
}

export const GenreTable: React.FC<GenreTableProps> = ({
  genres,
  page = 1,
  pageSize = 10,
  totalElements = 0,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[50%]">Tên</th>
              <th className="px-6 py-4 w-[20%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {genres.map((genre, index) => {
              const stt = (page - 1) * pageSize + index + 1;

              return (
                <tr
                  key={genre.id}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 text-xs">
                    {stt}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {genre.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {genre.name}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Slug: {genre.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        genre.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : genre.status === "INACTIVE"
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {getLabelGenreStatus(genre.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <GenreActionMenu item={genre} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
            {genres.length === 0 && (
              <tr>
                <td colSpan={4} className="p-0">
                  <EmptyState title="Không tìm thấy dữ liệu" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {genres.length > 0 && onPageChange && onPageSizeChange && (
        <div className="px-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalElements / pageSize)}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
