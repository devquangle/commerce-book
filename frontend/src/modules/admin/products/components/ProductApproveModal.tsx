import { CheckCircle2, X } from "lucide-react";
import type { ProductDetailResponse, ProductResponse } from "@/modules/shop/products/types/shop-product.type";
import { Button } from "@/components/common/Button";

interface ProductApproveModalProps {
  isOpen: boolean;
  item: ProductResponse | ProductDetailResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProductApproveModal= ({
  isOpen,
  item,
  onClose,
  onConfirm,
}:ProductApproveModalProps) => {
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
            Phê duyệt sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Bạn có chắc chắn muốn phê duyệt sản phẩm{" "}
              {item?.name ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  "{item.name}"
                </span>
              ) : (
                "này"
              )}{" "}
              để hiển thị bán trên hệ thống không?
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Phê duyệt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
