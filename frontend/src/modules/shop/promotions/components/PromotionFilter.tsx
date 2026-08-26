import { Search, RotateCcw } from "lucide-react";
import { type PromotionStatus } from "../types/promotion.type";
import { SelectBox } from "@/components/ui/SelectBox";
import { InputField } from "@/components/ui/InputField";
import { InputDate } from "@/components/ui/InputDate";

interface PromotionFilterProps {
  keyword: string;
  startDate: string;
  endDate: string;
  status: PromotionStatus | null;
  onKeywordChange: (keyword: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStatusChange: (status: PromotionStatus | null) => void;
  onReset: () => void;
}

const getPromotionStatusValue = (status: PromotionStatus) => {
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

const VOUCHER_STATUS_LIST: PromotionStatus[] = ["ACTIVE", "INACTIVE", "DELETED"];

const statusOptions = [
  { label: "Tất cả", value: "" },
  ...VOUCHER_STATUS_LIST.map((st) => ({
    label: getPromotionStatusValue(st),
    value: st,
  })),
];

export const PromotionFilter = ({
  keyword,
  startDate,
  endDate,
  status,
  onKeywordChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onReset,
}: PromotionFilterProps) => {
  return (
    <div className="card-custom grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4">
      <div className="md:col-span-6 lg:col-span-6">
        <InputField
          icon={<Search className="h-4 w-4" />}
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tên chương trình khuyến mãi..."
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
              e.target.value ? (e.target.value as PromotionStatus) : null
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
