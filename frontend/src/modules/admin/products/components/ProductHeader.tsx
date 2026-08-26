import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  BookOpen,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ProductHeaderMode = "list" | "detail";

export interface ProductHeaderProps {
  mode?: ProductHeaderMode;
  title?: string;
  subTitle?: string;
  showApproveReject?: boolean;
  onBack?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ProductHeader = ({
  mode = "list",
  title,
  subTitle,
  showApproveReject = false,
  onBack,
  onApprove,
  onReject,
}:ProductHeaderProps) => {
  const navigate = useNavigate();

  // Mode: list
  if (mode === "list") {
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

  // Mode: detail
  const displayTitle = title || "Chi tiết sản phẩm";
  const displaySubTitle =
    subTitle || "Xem thông tin chi tiết sản phẩm và thực hiện kiểm duyệt.";

  return (
    <div className="col-span-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
      {/* Title & Subtitle Section */}
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

        {showApproveReject && (
          <>
           {onApprove && (
              <Button
                type="button"
                variant="primary"
                icon={<CheckCircle className="w-4 h-4" />}
                className="w-full sm:w-auto cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={onApprove}
              >
                Phê duyệt
              </Button>
            )}
            {onReject && (
              <Button
                type="button"
                variant="danger"
                icon={<XCircle className="w-4 h-4" />}
                className="w-full sm:w-auto cursor-pointer"
                onClick={onReject}
              >
                Từ chối
              </Button>
            )}
           
          </>
        )}
      </div>
    </div>
  );
};
