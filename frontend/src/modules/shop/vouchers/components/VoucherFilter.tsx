import { Search, RotateCcw } from "lucide-react";
import { type VoucherStatus } from "../types/voucher.type";
import { SelectBox } from "@/components/common/SelectBox";
import { InputField } from "@/components/common/InputField";
import { InputDate } from "@/components/common/InputDate";

interface VoucherFilterProps {
  keyword: string;
  startDate: string;
  endDate: string;
  status: VoucherStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStatusChange: (status: VoucherStatus | null) => void;
  onReset: () => void;
}

const getVoucherStatusValue = (status: VoucherStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "INACTIVE":
      return "Tạm ngưng";
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
  startDate,
  endDate,
  status,
  onKeywordChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onReset,
}: VoucherFilterProps) => {
  return (
    <div className="card-custom grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4">
      <div className="md:col-span-6 lg:col-span-6">
        <InputField
          icon={<Search className="h-4 w-4" />}
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tên, mã voucher..."
        />
      </div>
      
      <div className="md:col-span-4 lg:col-span-4 flex gap-2">
        <InputDate
          placeholder="Từ ngày"
          value={startDate}
          onChange={(date) => {
            if (date) {
              const pad = (n: number) => n.toString().padStart(2, '0');
              onStartDateChange(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`);
            } else {
              onStartDateChange("");
            }
          }}
          containerClassName="flex-1"
        />
        <InputDate
          placeholder="Đến ngày"
          value={endDate}
          onChange={(date) => {
            if (date) {
              const pad = (n: number) => n.toString().padStart(2, '0');
              onEndDateChange(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`);
            } else {
              onEndDateChange("");
            }
          }}
          containerClassName="flex-1"
        />
      </div>
      
      <div className="md:col-span-2 lg:col-span-2 flex items-end gap-2">
        <SelectBox
          options={statusOptions}
          value={status || ""}
          onChange={(e) =>
            onStatusChange(
              e.target.value ? (e.target.value as VoucherStatus) : null
            )
          }
          containerClassName="flex-1"
        />
        <button
          onClick={onReset}
          title="Làm mới bộ lọc"
          className="h-10 px-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0 flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
