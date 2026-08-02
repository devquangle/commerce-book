import React from "react";
import { getLabelGenreStatus, type GenreResponse } from "../types/genre.type";
import { GenreActionMenu } from "./GenreActionMenu";

interface GenreMobileCardProps {
  genre: GenreResponse;
  index: number;
  page: number;
  pageSize: number;
  onEdit: (genre: GenreResponse) => void;
  onDelete: (genre: GenreResponse) => void;
}

export const GenreMobileCard: React.FC<GenreMobileCardProps> = ({
  genre,
  index,
  page,
  pageSize,
  onEdit,
  onDelete,
}) => {
  const stt = (page - 1) * pageSize + index + 1;

  return (
    <div className="card-custom p-4 flex flex-col gap-3 relative">
      <div className="absolute top-4 right-4">
        <GenreActionMenu item={genre} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          {genre.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-base">
            {genre.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            STT: {stt} • Slug: {genre.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
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
      </div>
    </div>
  );
};
