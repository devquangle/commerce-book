"use client";

import React, { useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";

import { getLabelAuthorStatus, type AuthorResponse } from "../types/author.type";
import { AuthorActionMenu } from "./AuthorActionMenu";

interface AuthorMobileCardProps {
  author: AuthorResponse;
  index: number;
  page: number;
  pageSize: number;
  onEdit: (author: AuthorResponse) => void;
  onDelete: (author: AuthorResponse) => void;
}

export const AuthorMobileCard: React.FC<AuthorMobileCardProps> = ({
  author,
  index,
  page,
  pageSize,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stt = page * pageSize + index + 1;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author.urlImage ? (
            <img
              src={author.urlImage}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold body-text shadow-sm shrink-0">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                {author.name}
              </h3>
              {author.urlBio && (
                <a
                  href={author.urlBio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
                  title="Xem tiểu sử chi tiết"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="caption-text font-mono">
              STT: {stt} &bull; Slug: {author.slug}
            </p>
          </div>
        </div>

        <div className="-mt-1 -mr-2">
          <AuthorActionMenu item={author} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {author.description && (
        <div className="space-y-1">
          <p className={`body-text text-zinc-600 dark:text-zinc-400 ${!isExpanded ? "line-clamp-3" : ""}`}>
            {author.description}
          </p>
          {author.description.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="body-text font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      )}



      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center">
        <span
          className={`px-2.5 py-0.5 caption-text font-semibold rounded-lg ${
            author.status === "ACTIVE"
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              : author.status === "INACTIVE"
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
          }`}
        >
          {getLabelAuthorStatus(author.status)}
        </span>
      </div>
    </div>
  );
};
