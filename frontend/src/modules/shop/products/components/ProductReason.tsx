import React from "react";
import { ShieldAlert, FileX2, Info } from "lucide-react";
import type { ProductStatus } from "../types/product-status.type";

export interface ProductReasonProps {
  status?: ProductStatus;
  reason?: string;
  showSubTitLe?: boolean;
  mode?: "admin" | "shop";
  className?: string;
}

export const ProductReason: React.FC<ProductReasonProps> = ({
  status,
  reason,
  showSubTitLe = false,
  mode = "shop",
  className = "",
}) => {
  if (status !== "REJECTED") return null;

  const isAdmin = mode === "admin";
  const reasonList = reason
    ? reason
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const subHeader = isAdmin
    ? "Sản phẩm đã bị từ chối phê duyệt bởi Quản trị viên"
    : "Cần cập nhật thông tin trước khi gửi duyệt lại";

  const reasonTitle = isAdmin
    ? "Lý do từ chối đã phản hồi cho cửa hàng:"
    : "Lý do từ chối từ Quản trị viên:";

  return (
    <div
      className={`col-span-12 rounded-2xl bg-linear-to-br from-rose-50/80 via-white to-rose-50/30 dark:from-rose-950/30 dark:via-zinc-900 dark:to-rose-950/10 border border-rose-200/80 dark:border-rose-900/60 border-l-4 border-l-rose-500 p-5 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200 ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800/60 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              Sản phẩm bị từ chối phê duyệt
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subHeader}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0">
          Từ chối
        </span>
      </div>

      {/* Subtitle / Tip banner if enabled */}
      {showSubTitLe && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          {isAdmin ? (
            <span>
              Dưới đây là các lý do từ chối đã được phản hồi cho người bán. Cửa hàng có thể điều chỉnh lại thông tin sản phẩm và gửi lại yêu cầu xét duyệt.
            </span>
          ) : (
            <span>
              Vui lòng chỉnh sửa các thông tin chưa đạt yêu cầu bên dưới và nhấn nút{" "}
              <strong className="font-semibold text-amber-900 dark:text-amber-200">
                "Cập nhật"
              </strong>{" "}
              để gửi lại yêu cầu phê duyệt cho Quản trị viên.
            </span>
          )}
        </div>
      )}

      {/* Reasons List */}
      <div className="space-y-2 pt-1 border-t border-rose-100 dark:border-rose-900/40">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 pt-1">
          <FileX2 className="w-4 h-4 text-rose-500" />
          <span>{reasonTitle}</span>
        </div>

        {reasonList.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {reasonList.map((reasonLine, idx) => {
              const cleanText = reasonLine.replace(/^•\s*/, "");
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-rose-100 dark:border-rose-900/40 text-sm text-zinc-800 dark:text-zinc-200 shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed font-medium pt-0.5 select-text">
                    {cleanText}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-400 italic">
            Chưa có lý do chi tiết được cung cấp.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReason;
