import { Search, RotateCcw } from "lucide-react";
import type { ProductStatus } from "../types/shop-product.type";

interface ProductFilterProps {
  keyword: string;
  status: ProductStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: ProductStatus | null) => void;
  onReset: () => void;
}

export const ProductFilter = ({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onReset,
}: ProductFilterProps) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex gap-2">
        <select 
          value={status || ""}
          onChange={(e) => onStatusChange(e.target.value ? (e.target.value as ProductStatus) : null)}
          className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="DELETED">Đã xóa</option>
        </select>
        <button 
          onClick={onReset}
          title="Làm mới bộ lọc" 
          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
