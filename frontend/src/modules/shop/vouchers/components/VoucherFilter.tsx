import { Search, RotateCcw } from "lucide-react";
import { type VoucherStatus } from "../types/voucher.type";
import { SelectBox } from "@/components/common/SelectBox";

interface VoucherFilterProps {
  keyword: string;
  status: VoucherStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: VoucherStatus | null) => void;
  onReset: () => void;
}

const getVoucherStatusValue = (status: VoucherStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    case "DELETED":
      return "Đã xóa";
    default:
      return status;
  }
};

const VOUCHER_STATUS_LIST: VoucherStatus[] = ["ACTIVE", "INACTIVE", "DELETED"];

const statusOptions = [
  { label: "Tất cả", value: "" },
  ...VOUCHER_STATUS_LIST.map((st) => ({
    label: getVoucherStatusValue(st),
    value: st,
  })),
];

export const VoucherFilter = ({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onReset,
}: VoucherFilterProps) => {
  return (
    <div className="card-custom flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm kiếm voucher..."
          className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="flex items-center gap-2 min-w-48">
        <SelectBox
          options={statusOptions}
          value={status || ""}
          onChange={(e) =>
            onStatusChange(
              e.target.value ? (e.target.value as VoucherStatus) : null
            )
          }
          containerClassName="w-full"
        />
        <button
          onClick={onReset}
          title="Làm mới bộ lọc"
          className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
