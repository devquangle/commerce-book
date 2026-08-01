"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Link2 } from "lucide-react";
import Image from "next/image";
import { AuthorResponse, getLabelAuthorStatus } from "../types/author.type";

interface AuthorTableProps {
  authors: AuthorResponse[];
  page?: number;
  pageSize?: number;
  onEdit: (author: AuthorResponse) => void;
  onDelete: (authorId: number) => void;
}

export const AuthorTable: React.FC<AuthorTableProps> = ({
  authors,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) => {
  if (authors.length === 0) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Không tìm thấy tác giả phù hợp
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {authors.map((author, index) => {
              const stt = (page - 1) * pageSize + index + 1;

              return (
                <tr
                  key={author.id}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 text-xs">
                    {stt}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      {author.urlImage ? (
                        <Image
                          src={author.urlImage}
                          alt={author.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200 dark:border-zinc-700"
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-white">
                            {author.name}
                          </span>
                          {author.urlBio && (
                            <a
                              href={author.urlBio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50"
                              title="Xem tiểu sử (Bio)"
                            >
                              <Link2 className="w-3 h-3" />
                              <span>Bio</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Slug: {author.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-2 max-w-md text-xs text-zinc-600 dark:text-zinc-400">
                      {author.description || "Chưa có mô tả"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        author.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : author.status === "INACTIVE"
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {getLabelAuthorStatus(author.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(author)}
                        className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(author.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
