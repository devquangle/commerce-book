import React from "react";
import { CheckCircle2, Store, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export interface RegisterShopSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
  onGoToDashboard?: () => void;
}

export const RegisterShopSuccessModal: React.FC<
  RegisterShopSuccessModalProps
> = ({ isOpen, onClose, shopName = "Cửa hàng của bạn", onGoToDashboard }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký Cửa hàng Thành công!"
      size="md"
    >
      <div className="flex flex-col items-center text-center py-4 space-y-4">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Title and Message */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Chúc mừng! Hồ sơ đã được khởi tạo
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
            Hồ sơ đăng ký mở gian hàng{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              "{shopName}"
            </span>{" "}
            đã được tiếp nhận và xử lý thành công.
          </p>
        </div>

        {/* Status detail box */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 text-left text-xs space-y-2">
          <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300 font-medium">
            <span>Trạng thái hồ sơ:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
              Đang hoạt động
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span>Thời gian đăng ký:</span>
            <span>{new Date().toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            fullWidth
            icon={<Store className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onGoToDashboard || onClose}
          >
            Vào Kênh Người Bán
          </Button>
        </div>
      </div>
    </Modal>
  );
};
