import { CheckCircle2, Loader2, X } from "lucide-react";
import type { AdminShopResponse, AdminShopDetailResponse } from "../../modules/admin/stores/types/store.type";
import { Button } from "@/components/ui/Button";
import { useApproveShop } from "../../modules/admin/stores/hooks/useAdminStore";

interface StoreApproveModalProps {
  isOpen: boolean;
  item: AdminShopResponse | AdminShopDetailResponse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StoreApproveModal = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}: StoreApproveModalProps) => {
  const { mutate: approve, isPending } = useApproveShop();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!item) return;
    approve(item.id, {
      onSuccess: () => {
        onClose();
        onSuccess?.();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Phê duyệt gian hàng
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="flex flex-col gap-1">
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                Bạn có chắc chắn muốn phê duyệt gian hàng{" "}
                {item?.name ? (
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    "{item.name}"
                  </span>
                ) : (
                  "này"
                )}{" "}
                để bắt đầu hoạt động và cho phép đăng bán sản phẩm không?
              </p>
              {item?.ownerFullName && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Chủ sở hữu:{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    {item.ownerFullName}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {isPending ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
