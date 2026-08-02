import React from "react";
import { Plus } from "lucide-react";

interface AuthorHeaderProps {
  onAddAuthor: () => void;
}

export const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  onAddAuthor,
}) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Quản lý tác giả
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Quản lý danh sách tác giả, cập nhật thông tin tiểu sử và các tác phẩm liên quan.
        </p>
      </div>
      <button
        onClick={onAddAuthor}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm mới</span>
      </button>
    </div>
  );
};
