import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
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
> = ({ isOpen, onClose, shopName = "Cửa hàng của bạn" }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông báo"
      size="md"
    >
      <div className="flex flex-col items-center text-center py-4 space-y-4">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Đăng ký tài khoản thành công!
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
            Tài khoản đã được đăng ký thành công! Trong quá trình chờ xác nhận, bạn hãy đăng nhập để mua hàng nhé.
          </p>
        </div>

        {/* Status detail box */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 text-left text-xs space-y-2.5">
          {shopName && (
            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300 font-medium">
              <span>Tên gian hàng:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {shopName}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Trạng thái hồ sơ:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Chờ xác nhận
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
            <span>Thời gian đăng ký:</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Action: Chỉ đóng modal, không làm gì hết */}
        <div className="w-full pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
          >
            Đã hiểu
          </Button>
        </div>
      </div>
    </Modal>
  );
};
