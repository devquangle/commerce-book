import React from "react";
import { Plus } from "lucide-react";

interface GenreHeaderProps {
  onAddGenre: () => void;
}

export const GenreHeader: React.FC<GenreHeaderProps> = ({
  onAddGenre,
}) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Quản lý thể loại
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Quản lý danh sách thể loại, giúp phân loại và tổ chức hệ thống sách một cách logic.
        </p>
      </div>
      <button
        onClick={onAddGenre}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium text-sm transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm thể loại mới</span>
      </button>
    </div>
  );
};
