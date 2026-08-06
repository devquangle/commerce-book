import React, { useState } from "react";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import type {
  ProductDetailResponse,
  ProductResponse,
} from "@/modules/shop/products/types/product.type";
import { Button } from "@/components/common/Button";
import { useRejectProduct } from "@/modules/shop/products/hooks/useProduct";
interface ProductRejectModalProps {
  isOpen: boolean;
  item: ProductResponse | ProductDetailResponse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const REJECT_REASONS = [
  "Hình ảnh sản phẩm mờ, không rõ nét hoặc chứa thông tin vi phạm",
  "Thông tin sản phẩm (Tên, tác giả, mô tả) chưa chính xác hoặc thiếu",
  "Giá bán hoặc giá niêm yết không phù hợp với quy định",
  "Sản phẩm trùng lặp với sản phẩm khác đã tồn tại trên hệ thống",
  "Nội dung sách không phù hợp với tiêu chuẩn cộng đồng",
];

export const ProductRejectModal: React.FC<ProductRejectModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    new Set(),
  );
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  const { mutate: reject, isPending } = useRejectProduct();

  if (!isOpen) return null;

  const toggleReason = (r: string) => {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(r)) {
        next.delete(r);
      } else {
        next.add(r);
      }
      return next;
    });
    if (error) setError("");
  };

  const buildFinalReason = () => {
    const parts: string[] = [];
    REJECT_REASONS.forEach((r) => {
      if (selectedReasons.has(r)) parts.push(`• ${r}`);
    });
    if (customReason.trim()) parts.push(customReason.trim());
    return parts.join("\n");
  };

  const handleConfirm = () => {
    if (!item) return;
    const final = buildFinalReason();
    if (!final) {
      setError("Vui lòng chọn hoặc nhập ít nhất một lý do từ chối");
      return;
    }
    reject(
      { id: item.productId, reason: final },
      {
        onSuccess: () => {
          handleReset();
          onClose();
          onSuccess?.();
        },
      },
    );
  };

  const handleReset = () => {
    setSelectedReasons(new Set());
    setCustomReason("");
    setError("");
  };

  const handleModalClose = () => {
    if (isPending) return;
    handleReset();
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleModalClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Từ chối sản phẩm
          </h2>
          <button
            onClick={handleModalClose}
            disabled={isPending}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Bạn có chắc muốn từ chối sản phẩm{" "}
              {item?.name ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  "{item.name}"
                </span>
              ) : (
                "này"
              )}{" "}
              không? Vui lòng cung cấp lý do cho chủ cửa hàng.
            </p>
          </div>

          {/* Gợi ý lý do – multi-select */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Gợi ý lý do nhanh{" "}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                (có thể chọn nhiều)
              </span>
            </label>
            <div className="flex flex-col gap-1.5">
              {REJECT_REASONS.map((r, index) => {
                const isSelected = selectedReasons.has(r);
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleReason(r)}
                    className={`flex items-center gap-2.5 text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer text-left w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-rose-500 border-rose-500 dark:bg-rose-600 dark:border-rose-600"
                          : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ô nhập lý do bổ sung */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Lý do bổ sung{" "}
              {selectedReasons.size === 0 && (
                <span className="text-rose-500">*</span>
              )}
            </label>
            <textarea
              rows={3}
              value={customReason}
              disabled={isPending}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập thêm lý do chi tiết (nếu có)..."
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={isPending}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={isPending}
              icon={
                isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
              className="cursor-pointer"
            >
              {isPending ? "Đang xử lý..." : "Từ chối sản phẩm"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
