import React from "react";
import { getLabelSeriesStatus, type SeriesResponse } from "../types/series.type";
import { SeriesActionMenu } from "./SeriesActionMenu";

interface SeriesMobileCardProps {
  series: SeriesResponse;
  index: number;
  page: number;
  pageSize: number;
  onEdit: (series: SeriesResponse) => void;
  onDelete: (series: SeriesResponse) => void;
}

export const SeriesMobileCard: React.FC<SeriesMobileCardProps> = ({
  series,
  index,
  page,
  pageSize,
  onEdit,
  onDelete,
}) => {
  const stt = (page - 1) * pageSize + index + 1;

  return (
    <div className="card-custom flex flex-col gap-3 relative">
      <div className="absolute top-4 right-4">
        <SeriesActionMenu item={series} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          {series.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-base">
            {series.name}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            STT: {stt} • Slug: {series.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ${
            series.status === "ACTIVE"
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              : series.status === "INACTIVE"
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
          }`}
        >
          {getLabelSeriesStatus(series.status)}
        </span>
      </div>
    </div>
  );
};
