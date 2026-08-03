import React from "react";
import { Modal } from "./Modal";
import { LogOut } from "lucide-react";

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận đăng xuất"
      confirmText="Đăng xuất"
      cancelText="Hủy"
      isLoading={isLoading}
      size="sm"
    >
      <div className="flex items-center gap-3 py-2">
        <div className="p-3 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
          <LogOut className="w-6 h-6" />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
        </p>
      </div>
    </Modal>
  );
};
