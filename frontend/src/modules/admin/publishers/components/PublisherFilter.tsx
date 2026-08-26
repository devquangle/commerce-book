import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import type { PublisherStatus } from "../types/publisher.type";
import { SelectBox } from "@/components/ui/SelectBox";
import { Button } from "@/components/ui/Button";

interface PublisherFilterProps {
  keyword: string;
  status: PublisherStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: PublisherStatus | null) => void;
  onReset: () => void;
}

export const PublisherFilter: React.FC<PublisherFilterProps> = ({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onReset,
}) => {

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "" },
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Ngừng hoạt động", value: "INACTIVE" },
    { label: "Đã xóa", value: "DELETED" },
  ];

  return (
    <div className="card-custom flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={keyword || ""}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Tìm kiếm theo tên tác giả"
            className="w-full pl-10 pr-9 py-2 body-text bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all"
          />
          {keyword && (
            <button
              onClick={() => onKeywordChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 min-w-50">
          {/* Searchable Status Filter Dropdown */}
          <SelectBox
            options={statusOptions}
            value={status || ""}
            onChange={(e) =>
              onStatusChange(e.target.value ? (e.target.value as PublisherStatus) : null)
            }
            containerClassName="w-full"
          />

            <Button
              onClick={onReset}
              variant="outline"
              icon={<RotateCcw className="w-4 h-4" />}
              className="shrink-0 aspect-square p-0 w-10 h-10"
            />
        </div>
    </div>
  );
};
