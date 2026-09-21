import React from "react";
import { Search, RotateCcw } from "lucide-react";
import type { ShopStatus } from "../../modules/admin/stores/types/store-status.type";
import { SelectBox } from "@/components/ui/SelectBox";

interface StoreFilterProps {
  keyword: string;
  status: ShopStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: ShopStatus | null) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Chờ duyệt (Pending)", value: "PENDING" },
  { label: "Đang hoạt động (Active)", value: "ACTIVE" },
  { label: "Bị từ chối (Rejected)", value: "REJECTED" },
  { label: "Tạm ngưng (Inactive)", value: "INACTIVE" },
  { label: "Tạm đình chỉ (Suspended)", value: "SUSPENDED" },
  { label: "Đã khóa (Banned)", value: "BANNED" },
];

export const StoreFilter: React.FC<StoreFilterProps> = ({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row gap-4">
      {/* Ô tìm kiếm từ khóa */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm theo tên cửa hàng, chủ sở hữu, email, SĐT..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 transition-all"
        />
      </div>

      {/* Dropdown Lọc trạng thái */}
      <div className="w-full sm:w-64">
        <SelectBox
          value={status || ""}
          onChange={(e) =>
            onStatusChange(e.target.value ? (e.target.value as ShopStatus) : null)
          }
          options={statusOptions}
          placeholder="Chọn trạng thái"
        />
      </div>

      {/* Nút reset */}
      <button
        onClick={onReset}
        type="button"
        title="Đặt lại bộ lọc"
        className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
