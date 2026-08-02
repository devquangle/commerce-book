import React from "react";
import { ExternalLink, Link2 } from "lucide-react";
import { getLabelAuthorStatus, type AuthorResponse } from "../types/author.type";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { AuthorActionMenu } from "./AuthorActionMenu";

interface AuthorTableProps {
  authors: AuthorResponse[];
  page?: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit: (author: AuthorResponse) => void;
  onDelete: (authorId: number) => void;
}

const ExpandableDescription: React.FC<{ text?: string }> = ({ text }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!text) {
    return <span className="text-xs text-zinc-400 italic">Chưa có mô tả</span>;
  }

  const isLong = text.length > 80;

  return (
    <div className="max-w-md">
      <p className={`text-xs text-zinc-600 dark:text-zinc-400 ${!isExpanded ? 'line-clamp-2' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline mt-1 focus:outline-none"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export const AuthorTable: React.FC<AuthorTableProps> = ({
  authors,
  page = 1,
  pageSize = 10,
  totalElements = 0,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="hidden md:flex card-custom overflow-hidden flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[35%]">Tác giả</th>
              <th className="px-6 py-4 w-[35%]">Mô tả</th>
              <th className="px-6 py-4 w-[15%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24">Thao tác</th>
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
                        <img
                          src={author.urlImage}
                          alt={author.name}
                          className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200 dark:border-zinc-700"
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
                    <ExpandableDescription text={author.description} />
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
                    <AuthorActionMenu item={author} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
            {authors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState title="Không tìm thấy tác giả phù hợp" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {authors.length > 0 && onPageChange && onPageSizeChange && (
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
