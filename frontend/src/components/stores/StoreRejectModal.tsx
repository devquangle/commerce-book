import React, { useState } from "react";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import type { AdminShopResponse, AdminShopDetailResponse } from "../../modules/admin/stores/types/store.type";
import { Button } from "@/components/ui/Button";
import { useRejectShop } from "../../modules/admin/stores/hooks/useAdminStore";

interface StoreRejectModalProps {
  isOpen: boolean;
  item: AdminShopResponse | AdminShopDetailResponse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const REJECT_REASONS = [
  "Ảnh CCCD / CMND bị mờ, lóa sáng hoặc không thể nhận diện.",
  "Khuôn mặt chụp xác thực không khớp với ảnh trên giấy tờ tùy thân (eKYC).",
  "Thông tin tài khoản ngân hàng không khớp với tên chủ sở hữu gian hàng.",
  "Tên gian hàng hoặc mô tả vi phạm chính sách cộng đồng của sàn.",
  "Địa chỉ lấy hàng không hợp lệ hoặc không thể định tuyến giao nhận.",
];

export const StoreRejectModal: React.FC<StoreRejectModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  const { mutate: reject, isPending } = useRejectShop();

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
    const finalReason = buildFinalReason();
    if (!finalReason) {
      setError("Vui lòng chọn ít nhất một lý do hoặc nhập lý do từ chối");
      return;
    }
    if (!item) return;

    reject(
      { id: item.id, request: { reason: finalReason } },
      {
        onSuccess: () => {
          setSelectedReasons(new Set());
          setCustomReason("");
          setError("");
          onClose();
          onSuccess?.();
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setSelectedReasons(new Set());
    setCustomReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Từ chối duyệt gian hàng
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {item?.name ? `Gian hàng: "${item.name}"` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Chọn lý do từ chối (có thể chọn nhiều):
          </p>

          <div className="flex flex-col gap-2">
            {REJECT_REASONS.map((reason, idx) => {
              const checked = selectedReasons.has(reason);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    checked
                      ? "border-rose-300 bg-rose-50/70 text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                      : "border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? "bg-rose-600 text-white"
                        : "border border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-xs leading-relaxed">{reason}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Lý do chi tiết khác (tùy chọn):
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập hướng dẫn khắc phục hoặc lý do cụ thể gửi tới người bán..."
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 justify-end shrink-0 bg-zinc-50/50 dark:bg-zinc-850/50">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isPending}
            icon={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            {isPending ? "Đang xử lý..." : "Xác nhận từ chối"}
          </Button>
        </div>
      </div>
    </div>
  );
};
