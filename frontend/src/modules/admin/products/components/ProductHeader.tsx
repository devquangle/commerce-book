import React from "react";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  RotateCcw,
  Save,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ProductHeaderMode = "list" | "add" | "update";

export interface ProductHeaderProps {
  mode?: ProductHeaderMode;
  isEdit?: boolean;
  title?: string;
  subTitle?: string;
  submitText?: string;
  showSubmit?: boolean;
  onBack?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  mode,
  isEdit = false,
  title,
  subTitle,
  submitText,
  showSubmit = true,
  onBack,
  onReset,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const actualMode: ProductHeaderMode =
    mode || (isEdit ? "update" : "list");

  if (actualMode === "list") {
    const displayTitle = title || "Quản lý sản phẩm";
    const displaySubTitle =
      subTitle || "Quản lý và duyệt danh sách sản phẩm trên toàn hệ thống";

    return (
      <div className="col-span-12 card-custom flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {displayTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {displaySubTitle}
          </p>
        </div>
      </div>
    );
  }

  const isUpdateMode = actualMode === "update";
  const displayTitle =
    title || (isUpdateMode ? "Cập nhật thông tin sản phẩm" : "Xem thông tin sản phẩm");
  const displaySubTitle =
    subTitle ||
    (isUpdateMode
      ? "Chỉnh sửa thông tin chi tiết sản phẩm sách trong hệ thống."
      : "Chi tiết thông tin sản phẩm.");
  const displaySubmitText = submitText || "Cập nhật";

  return (
    <div className="col-span-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {displayTitle}
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{displaySubTitle}</p>
      </div>

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
