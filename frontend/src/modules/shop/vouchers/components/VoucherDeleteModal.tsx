import { AlertTriangle, X } from "lucide-react";
import type { VoucherResponse } from "../types/voucher.type";
import { Button } from "@/components/common/Button";

interface VoucherDeleteModalProps {
  isOpen: boolean;
  item: VoucherResponse | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const VoucherDeleteModal = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}: VoucherDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Xác nhận xóa voucher
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Bạn có chắc chắn muốn xóa voucher{" "}
              {item?.name ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  "{item.name}"
                </span>
              ) : (
                "này"
              )}{" "}
              không? Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
            >
              Xóa voucher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
