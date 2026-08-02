import React from "react";
import { getLabelPublisherStatus, type PublisherResponse } from "../types/publisher.type";
import { PublisherActionMenu } from "./PublisherActionMenu";

interface PublisherMobileCardProps {
  publisher: PublisherResponse;
  index: number;
  page: number;
  pageSize: number;
  onEdit: (publisher: PublisherResponse) => void;
  onDelete: (publisher: PublisherResponse) => void;
}

export const PublisherMobileCard: React.FC<PublisherMobileCardProps> = ({
  publisher,
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
        <PublisherActionMenu item={publisher} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="flex items-start gap-3 pr-8">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
          {publisher.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white text-base">
            {publisher.name}
          </h3>
          <p className="body-text text-zinc-500 dark:text-zinc-400 mt-1">
            STT: {stt} • Slug: {publisher.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span
          className={`inline-flex items-center px-2.5 py-1 caption-text font-semibold rounded-lg ${
            publisher.status === "ACTIVE"
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              : publisher.status === "INACTIVE"
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
          }`}
        >
          {getLabelPublisherStatus(publisher.status)}
        </span>
      </div>
    </div>
  );
};
