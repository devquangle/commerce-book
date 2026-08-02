"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Link2 } from "lucide-react";

import { getLabelAuthorStatus, type AuthorResponse } from "../types/author.type";

interface AuthorMobileCardProps {
  author: AuthorResponse;
  onEdit: (author: AuthorResponse) => void;
  onDelete: (author: AuthorResponse) => void;
}

export const AuthorMobileCard: React.FC<AuthorMobileCardProps> = ({
  author,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author.urlImage ? (
            <img
              src={author.urlImage}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              {author.name}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Slug: {author.slug}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg ${
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

      {author.description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {author.description}
        </p>
      )}

      {author.urlBio && (
        <div className="pt-1">
          <a
            href={author.urlBio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Xem tiểu sử chi tiết</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(author)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Chỉnh sửa</span>
        </button>
        <button
          onClick={() => onDelete(author)}
          className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
          title="Xóa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
