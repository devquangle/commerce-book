import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  ArrowLeft,
  Ticket,
  Eye,
  RotateCcw,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type PromotionHeaderMode = "list" | "add" | "update";

export interface PromotionHeaderProps {
  mode?: PromotionHeaderMode;
  isEdit?: boolean;
  title?: string;
  subTitle?: string;
  submitText?: string;
  showSubmit?: boolean;
  onBack?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
  onAddClick?: () => void;
}

export const PromotionHeader: React.FC<PromotionHeaderProps> = ({
  mode,
  isEdit = false,
  title,
  subTitle,
  submitText,
  showSubmit = true,
  onBack,
  onReset,
  onSubmit,
  onAddClick,
}) => {
  const navigate = useNavigate();

  // Determine actual mode
  const actualMode: PromotionHeaderMode =
    mode || (isEdit ? "update" : "list");

  // Mode: List
  if (actualMode === "list") {
    const displayTitle = title || "Giảm giá sản phẩm";
    const displaySubTitle =
      subTitle || "Quản lý danh sách giảm giá sản phẩm của cửa hàng";

    return (
      <div className="col-span-12 card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {displayTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {displaySubTitle}
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAddClick || (() => navigate("/shop/promotions/add"))}
        >
          Thêm mới
        </Button>
      </div>
    );
  }

  // Mode: Add or Update
  const isUpdateMode = actualMode === "update";
  const displayTitle =
    title || (isUpdateMode ? "Cập nhật thông tin giảm giá sản phẩm" : "Thêm chương trình giảm giá sản phẩm mới");
  const displaySubTitle =
    subTitle ||
    (isUpdateMode
      ? "Chỉnh sửa các thông tin giảm giá sản phẩm trong hệ thống."
      : "Điền đầy đủ thông tin bên dưới để khởi tạo giảm giá sản phẩm mới trong hệ thống.");
  const displaySubmitText = submitText || (isUpdateMode ? "Cập nhật" : "Thêm");

  return (
    <div className="col-span-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      {/* Title & Subtitle Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
            <Ticket className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{displaySubTitle}</p>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full sm:w-auto cursor-pointer"
          onClick={onBack || (() => navigate(-1))}
        >
          Quay lại
        </Button>
        <Button
          type="button"
          variant="secondary"
          icon={<Eye className="w-4 h-4" />}
          className="w-full sm:w-auto cursor-pointer"
        >
          Xem nháp
        </Button>
        {onReset && (
          <Button
            type="button"
            onClick={onReset}
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto cursor-pointer border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/40"
          >
            Đặt lại
          </Button>
        )}
        {showSubmit && (
          <Button
            type={onSubmit ? "button" : "submit"}
            onClick={onSubmit}
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto cursor-pointer"
          >
            {displaySubmitText}
          </Button>
        )}
      </div>
    </div>
  );
};
